import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from 'src/product/schema/product.schema';

export type CarouselVideoDocument = HydratedDocument<CarouselVideo>;

@Schema({ timestamps: true })
export class CarouselVideo {
  @Prop({ required: true, type: String })
  video: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  })
  productId: Product;
}

export const CarouselVideoSchema = SchemaFactory.createForClass(CarouselVideo);
