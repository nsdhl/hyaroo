import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from 'src/product/schema/product.schema';

export type CarouselImageDocument = HydratedDocument<CarouselImage>;

@Schema({ timestamps: true })
export class CarouselImage {
  @Prop({ required: true, type: String })
  image: string;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId })
  productId: Product;
}

export const CarouselImageSchema = SchemaFactory.createForClass(CarouselImage);
