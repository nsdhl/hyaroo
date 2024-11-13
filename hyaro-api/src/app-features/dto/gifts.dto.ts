import mongoose from 'mongoose';

export class GiftDto {
  productId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
}

export class DeleteGiftDto {
  giftId: mongoose.Schema.Types.ObjectId[];
}
