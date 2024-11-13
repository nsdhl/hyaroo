import mongoose from 'mongoose';
import { ICartItemVariant } from 'src/interfaces/interfaces';
import {
  IsOptional,
  IsDateString,
  IsEnum,
  IsInt,
  Min,
  Max,
  ValidateIf,
  IsNumber,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateOrderDto {
  cartItems: mongoose.Schema.Types.ObjectId[];
  city: string;
  detailAddress: string;
  receiverName: string;
  receiverPhone: string;
}

type OrderItem = {
  product: { _id: mongoose.Schema.Types.ObjectId };
  variant: ICartItemVariant[];
  totalCost: number;
  productCount: number;
};

export class CreateOrderWithoutCartDto {
  orderItem: OrderItem[];
  detailAddress: string;
}

export enum EPriceSort {
  LOW_TO_HIGH = 'low_to_high',
  HIGHT_TO_LOW = 'high_to_low',
}

export enum EOrderStatusSort {
  ORDER_PLACED = 'order_placed',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
}

export enum EOrderStatusAdaptor {
  order_placed = 'Order Placed',
  out_for_delivery = 'Out for Delivery',
  delivered = 'Delivered',
}

export class OrderPaginationDto {
  @IsOptional()
  @Transform((value) => Number(value.value))
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Transform((value) => Number(value.value))
  @IsNumber()
  page?: number;

  @ValidateIf((o) => o.fromDate === true)
  @IsOptional()
  @IsDateString()
  @Transform((value) => new Date(value.value))
  validateFromDate(fromDate: string): Date | undefined {
    const date = new Date(fromDate);
    if (isNaN(date.getTime())) {
      return undefined;
    }
    const currentDate = new Date();
    if (date.getTime() > currentDate.getTime()) {
      return undefined;
    }
    return date;
  }
  fromDate: Date;

  @ValidateIf((o) => o.toDate === true)
  @IsOptional()
  @IsDateString()
  @Transform((value) => new Date(value.value))
  validateTDate(toDate: string): Date | undefined {
    const date = new Date(toDate);
    if (isNaN(date.getTime())) {
      return undefined;
    }
    const currentDate = new Date();
    if (date.getTime() > currentDate.getTime()) {
      return undefined;
    }
    return date;
  }
  toDate: Date;

  @IsOptional()
  @IsEnum(EOrderStatusSort)
  status?: EOrderStatusSort;

  @IsOptional()
  @IsEnum(EPriceSort)
  priceSort?: EPriceSort;
}
