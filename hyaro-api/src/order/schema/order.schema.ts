import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Product } from 'src/product/schema/product.schema';
import { ICartItemVariant } from 'src/interfaces/interfaces';

export type CartDocument = HydratedDocument<Order>;

export enum OrderStatus {
  ORDER_PLACED = 'Order Placed',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  })
  product: Product;

  @Prop({ required: true, type: Array })
  variant: ICartItemVariant[];

  @Prop({ required: true, type: Number })
  totalCost: number;

  @Prop({ required: true, type: Number })
  productCount: number;

  @Prop({ required: false, type: String })
  city: string;

  @Prop({ required: true, type: String })
  detailAddress: string;

  @Prop({ required: false, type: String })
  receiverName: string;

  @Prop({ required: false, type: String })
  receiverPhone: string;

  @Prop({
    required: true,
    type: String,
    enum: OrderStatus,
    default: OrderStatus.ORDER_PLACED,
  })
  orderStatus: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
