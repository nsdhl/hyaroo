import mongoose from 'mongoose';
import { ICartItemVariant } from 'src/interfaces/interfaces';

export class AddToCartDto {
  product: mongoose.Schema.Types.ObjectId;
  variant: ICartItemVariant[];
  cost: number;
  productCount: number;
}
