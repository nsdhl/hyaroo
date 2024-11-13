import mongoose from 'mongoose';

export class DeleteProductDto {
  productId: mongoose.Schema.Types.ObjectId[];
}
