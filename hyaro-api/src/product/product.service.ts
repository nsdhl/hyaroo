import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  ChangeProductFeaturedOrder,
  UpdateProductDto,
  UploadProductDto,
  ratingOrder,
} from './dto/upload-product.dto';
import { Product } from './schema/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) { }

  private async addFeaturedOrder(
    productId: string,
    body: ChangeProductFeaturedOrder,
  ) {
    const previousProductWithSameOrder = await this.productModel.findOne({
      _id: { $ne: productId },
      featuredOrder: body.featuredOrder,
      isFeatured: true,
    });

    if (!previousProductWithSameOrder) {
      return await this.productModel.findByIdAndUpdate(productId, {
        $set: {
          ...body,
        },
      });
    }
    const productCurrentStatus = await this.productModel.findById(productId);
    if (
      (productCurrentStatus.isFeatured &&
        productCurrentStatus.featuredOrder === body.featuredOrder + 1) ||
      (productCurrentStatus.isFeatured &&
        productCurrentStatus.featuredOrder === body.featuredOrder - 1)
    ) {
      previousProductWithSameOrder.featuredOrder =
        productCurrentStatus.featuredOrder;
      await previousProductWithSameOrder.save();
      await this.productModel.findByIdAndUpdate(productId, {
        $set: {
          ...body,
        },
      });
      return true;
    }

    await this.productModel.updateMany(
      {
        isFeatured: true,
        featuredOrder: { $gte: body.featuredOrder },
        _id: { $ne: productId },
      },
      { $inc: { featuredOrder: 1 } },
    );

    await this.productModel.updateMany(
      { isFeatured: true, featuredOrder: { $gt: 12 } },
      { $set: { isFeatured: false, featuredOrder: null } },
    );

    await this.productModel.findByIdAndUpdate(productId, {
      $set: {
        ...body,
      },
    });

    return true;
  }

  private async removeFeaturedOrder(
    productId: string,
    body: ChangeProductFeaturedOrder,
  ) {
    await this.productModel.findByIdAndUpdate(productId, {
      $set: {
        ...body,
      },
    });

    await this.productModel.updateMany(
      { isFeatured: true, featuredOrder: { $gt: body.featuredOrder } },
      { $inc: { featuredOrder: -1 } },
      { multi: true },
    );

    return true;
  }
  async upload(
    files: {
      images: Express.Multer.File[];
      promotionalImages: Express.Multer.File[];
      videos?: Express.Multer.File[];
    },
    uploadProductDto: UploadProductDto,
    userId: mongoose.Schema.Types.ObjectId,
  ) {
    const images = files?.images?.map((el) => `${el?.filename}`);
    const videos = files?.videos?.map((el) => `${el?.filename}`);
    const promotionalImages = files?.promotionalImages?.map(
      (el) => `${el?.filename}`,
    );

    const product = await this.productModel.create({
      name: uploadProductDto.name,
      description: uploadProductDto.description,
      variants: JSON.parse(uploadProductDto.variants),
      user: userId,
      stock: uploadProductDto.stock,
      basePrice: uploadProductDto.basePrice,
      categories: uploadProductDto.categories,
      images,
      videos,
      promotionalImages,
    });
    return product;
  }

  async updateProduct(
    files: {
      images: Express.Multer.File[];
      promotionalImages: Express.Multer.File[];
      videos?: Express.Multer.File[];
    },
    updateProductDto: UpdateProductDto,
    productId: mongoose.Schema.Types.ObjectId,
  ) {
    const product = await this.productModel.findOne({ _id: productId });

    let filteredImages: string[] = [];
    let filteredPromotionalImages: string[] = [];
    let filteredVideos: string[] = [];

    let images: string[] = [];
    let videos: string[] = [];
    let promotionalImages: string[] = [];

    let filesToDelete: string[] = [];

    if (updateProductDto.imagesToDelete) {
      if (Array.isArray(updateProductDto.imagesToDelete)) {
        filteredImages = product.images.filter(
          (image) =>
            !updateProductDto.imagesToDelete.some((item) => item === image),
        );
        filesToDelete = [...filesToDelete, ...updateProductDto.imagesToDelete];
      } else {
        let imagesToDelete = [updateProductDto.imagesToDelete];
        filteredImages = product.images.filter(
          (image) => !imagesToDelete.some((item) => item === image),
        );
        filesToDelete = [...filesToDelete, ...imagesToDelete];
      }
      if (files.images) {
        images = [
          ...files?.images?.map((el) => `${el?.filename}`),
          ...filteredImages,
        ];
      } else {
        images = [...filteredImages];
      }
    } else {
      if (files.images) {
        images = [
          ...files?.images?.map((el) => `${el?.filename}`),
          ...product.images,
        ];
      } else {
        images = product.images;
      }
    }

    if (updateProductDto.promotionalImagesToDelete) {
      if (Array.isArray(updateProductDto.promotionalImagesToDelete)) {
        filteredPromotionalImages = product.promotionalImages.filter(
          (image) =>
            !updateProductDto.promotionalImagesToDelete.some(
              (item) => item === image,
            ),
        );
        filesToDelete = [
          ...filesToDelete,
          ...updateProductDto.promotionalImagesToDelete,
        ];
      } else {
        let promotionalImagesToDelete = [
          updateProductDto.promotionalImagesToDelete,
        ];
        filteredPromotionalImages = product.promotionalImages.filter(
          (image) => !promotionalImagesToDelete.some((item) => item === image),
        );
        filesToDelete = [...filesToDelete, ...promotionalImagesToDelete];
      }
      if (files.promotionalImages) {
        promotionalImages = [
          ...files?.promotionalImages?.map((el) => `${el?.filename}`),
          ...filteredPromotionalImages,
        ];
      } else {
        promotionalImages = [...filteredPromotionalImages];
      }
    } else {
      if (files.promotionalImages) {
        promotionalImages = [
          ...files?.promotionalImages?.map((el) => `${el?.filename}`),
          ...product.promotionalImages,
        ];
      } else {
        promotionalImages = product.promotionalImages;
      }
    }

    if (updateProductDto.videosToDelete) {
      if (Array.isArray(updateProductDto.videosToDelete)) {
        filteredVideos = product.videos.filter(
          (video) =>
            !updateProductDto.videosToDelete.some((item) => item === video),
        );
        filesToDelete = [...filesToDelete, ...updateProductDto.videosToDelete];
      } else {
        let videosToDelete = [updateProductDto.videosToDelete];
        filteredVideos = product.videos.filter(
          (video) => !videosToDelete.some((item) => item === video),
        );
        filesToDelete = [...filesToDelete, ...videosToDelete];
      }
      if (files.videos) {
        videos = [
          ...files?.videos?.map((el) => `${el?.filename}`),
          ...filteredVideos,
        ];
      } else {
        videos = [...filteredVideos];
      }
    } else {
      if (files.videos) {
        videos = [
          ...files?.videos?.map((el) => `${el?.filename}`),
          ...product.videos,
        ];
      } else {
        videos = product.videos;
      }
    }

    for (const file of filesToDelete) {
      await fs.promises.unlink(
        path.resolve(__dirname, `./../../media/product/${file}`),
      );
    }

    return await this.productModel.findByIdAndUpdate(
      productId,
      {
        name: updateProductDto.name,
        description: updateProductDto.description,
        variants: JSON.parse(updateProductDto.variants),
        stock: updateProductDto.stock,
        basePrice: updateProductDto.basePrice,
        categories: updateProductDto.categories,
        images: images,
        videos: videos,
        promotionalImages: promotionalImages,
      },
      { new: true },
    );
  }

  async deleteProduct(productId: mongoose.Schema.Types.ObjectId[]) {
    await this.productModel.updateMany(
      { _id: productId },
      {
        isDeleted: true,
      },
    );
    return 'Deleted!';
  }

  async getProducts(
    _limit: number,
    _page: number,
    categories: mongoose.Schema.Types.ObjectId[],
    user: mongoose.Schema.Types.ObjectId,
    role: mongoose.Schema.Types.ObjectId[],
    searchKeyword: string,
    priceLow: string,
    priceHigh: string,
    ratingFlow: ratingOrder,
    rating: number,
  ) {
    const query: any = {
      isDeleted: false,
      stock: true,
      isFeatured: false,
      ...(priceHigh ? { basePrice: { $lte: priceHigh } } : {}),
      ...(priceLow
        ? priceHigh
          ? {
            basePrice: {
              $gte: priceLow,
              $lte: priceHigh,
            },
          }
          : { basePrice: { $gte: priceLow } }
        : {}),
      ...(rating
        ? ratingFlow
          ? ratingFlow === 'lowerThan'
            ? {
              rating: { $lte: rating },
            }
            : { rating: { $gte: rating } }
          : { rating: rating }
        : {}),
    };

    let page = +_page || 1;
    let limit = +_limit || 12;

    if (categories) {
      query.categories = { $in: categories };
    }

    if (user) {
      query.user = user;
    }

    if (searchKeyword) {
      query.$or = [
        { name: { $regex: searchKeyword, $options: 'i' } },
        { description: { $regex: searchKeyword, $options: 'i' } },
      ];
    }

    let products: any;

    const productWithoutLimit = await this.productModel.find(query);

    products = await this.productModel
      .find(query)
      .populate([
        {
          path: 'user',
          select: '-password',
        },
        {
          path: 'categories',
        },
      ])
      .skip(limit * page - limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (role) {
      const product = products
        .populate([{ path: 'user', match: { roles: role } }])
        .then((products: any) => {
          const filteredProducts = products.filter(
            (product: any) => product.user !== null,
          );

          return filteredProducts;
        });
      products = product;
    }

    const hasNextPage =
      limit * page >= productWithoutLimit.length ? false : true;

    return { products, hasNextPage };
  }

  async getFeaturedProducts() {
    const query: any = {
      isDeleted: false,
      stock: true,
      isFeatured: true,
    };
    const products = await this.productModel
      .find(query)
      .populate([
        {
          path: 'user',
          select: '-password',
        },
        {
          path: 'categories',
        },
      ])
      .sort({ featuredOrder: 1 });
      console.log({ products })
    return { products };
  }

  async getProductById(productId: mongoose.Schema.Types.ObjectId) {
    return await this.productModel.findById(productId).populate([
      {
        path: 'user',
        select: '-password',
      },
      {
        path: 'categories',
      },
    ]);
  }

  async getAdminProducts(userId: mongoose.Schema.Types.ObjectId) {
    return await this.productModel
      .find({
        isDeleted: false,
      })
      .populate([{ path: 'user', match: { _id: userId } }])
      .sort({ createdAt: -1 });
  }

  async updateRating(
    rating: number,
    productId: mongoose.Schema.Types.ObjectId,
  ) {
    await this.productModel.findByIdAndUpdate(productId, {
      rating: rating,
    });
  }

  async updateFeaturedProduct(
    productId: string,
    body: ChangeProductFeaturedOrder,
  ) {
    if (!Types.ObjectId.isValid(productId))
      throw new Error('Product not available');
    const isProductAvailable = await this.productModel.findOne({
      _id: productId,
    });
    if (!isProductAvailable) throw new Error('Product not available');
    return body.isFeatured
      ? await this.addFeaturedOrder(<string>(<unknown>productId), body)
      : await this.removeFeaturedOrder(<string>(<unknown>productId), body);
  }
}
