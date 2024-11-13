import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ICartItemVariant } from 'src/interfaces/interfaces';
import * as mongoose from 'mongoose';
import { Product } from 'src/product/schema/product.schema';
import { User } from 'src/user/schema/user.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  })
  product: Product;

  @Prop({ required: true, type: mongoose.Schema.Types.Array })
  variant: ICartItemVariant[];

  @Prop({ required: true, type: Number })
  cost: number;

  @Prop({ required: true, type: Number })
  totalCost: number;

  @Prop({ required: true, type: Number })
  productCount: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
