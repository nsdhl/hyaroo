import mongoose from 'mongoose';

export class CreateWishListDto {
  productId: mongoose.Schema.Types.ObjectId;
}
