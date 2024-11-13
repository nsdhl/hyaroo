import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IVariant } from 'src/interfaces/interfaces';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Categories } from 'src/app-features/schema/categories.schema';

export type UserDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Object })
  variants: IVariant;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Categories',
  })
  categories: Categories[];

  @Prop({ required: false, type: [String] })
  images: string[];

  @Prop({ required: false, type: [String] })
  promotionalImages: string[];

  @Prop({ type: [String] })
  videos: string[];

  @Prop({ default: true })
  stock: boolean;

  @Prop({ required: true })
  basePrice: number;

  @Prop({ required: false, default: 4 })
  rating: number;

  @Prop({ required: false, default: false })
  isFeatured: boolean;

  @Prop({ required: false, unique: false, default: null })
  featuredOrder: number | null;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
