import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Cart } from 'src/cart/schema/cart.schema';
import { CreateWishListDto } from './dto/createWishList.dto';
import { WishList } from './schema/wishlist.schema';
import { retry } from 'rxjs';

@Injectable()
export class WishListService {
  constructor(
    @InjectModel(WishList.name) private WishListModel: Model<WishList>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
  ) {}

  async createWishList(
    createWishListDto: CreateWishListDto,
    userId: mongoose.Schema.Types.ObjectId,
  ) {
    const wishList = await this.WishListModel.create({
      user: userId,
      product: createWishListDto.productId,
    });
    return wishList;
  }

  async getUserWishLists(userId: mongoose.Schema.Types.ObjectId) {
    return await this.WishListModel.find({
      user: userId,
    })
      .populate({
        path: 'product',
        populate: {
          path: 'user',
          select: '-password',
        },
      })
      .sort({ createdAt: -1 });
  }

  async getWishListByProducId(
    productId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
  ) {
    const isWishListed = await this.WishListModel.findOne({
      $and: [
        {
          user: userId,
        },
        {
          product: productId,
        },
      ],
    });
    if (!isWishListed) {
      return { isWishList: false };
    }
    return { isWishList: true, _id: isWishListed._id };
  }

  async deleteWishList(
    wishListId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
  ) {
    await this.WishListModel.findOneAndDelete({
      $and: [
        {
          user: userId,
        },
        {
          _id: wishListId,
        },
      ],
    });
    return 'Sucessfully Deleted';
  }
}
