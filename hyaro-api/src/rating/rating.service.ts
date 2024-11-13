import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ProductService } from 'src/product/product.service';
import { RatingDto } from './dto/rating.dto';
import { Rating } from './schema/rating.schema';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<Rating>,
    private readonly productService: ProductService,
  ) {}

  async addRating(
    ratingDto: RatingDto,
    userId: mongoose.Schema.Types.ObjectId,
  ) {
    const rating = await this.ratingModel.findOne({
      $and: [{ userId: userId }, { productId: ratingDto.productId }],
    });

    if (rating) {
      throw new UnauthorizedException('You have already rated this product!');
    }

    await this.ratingModel.create({
      userId: userId,
      comment: ratingDto.comment,
      rating: ratingDto.rating,
      productId: ratingDto.productId,
    });

    const allRatings = await this.ratingModel.find({
      productId: ratingDto.productId,
    });

    let total = 0;

    for (const ratings of allRatings) {
      total = total + ratings.rating;
    }

    const averageRating = Math.ceil(total / allRatings.length);

    this.productService.updateRating(averageRating, ratingDto.productId);

    return 'Your rating and comment is recorded!';
  }

  async getProductComments(id: mongoose.Schema.Types.ObjectId) {
    const productComments = await this.ratingModel
      .find({
        productId: id,
      })
      .populate('userId')
      .sort({ createdAt: -1 });

    return productComments;
  }
}
