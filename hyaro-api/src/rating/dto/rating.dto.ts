import mongoose from 'mongoose';

export class RatingDto {
  rating: number;
  comment: string;
  productId: mongoose.Schema.Types.ObjectId;
}
