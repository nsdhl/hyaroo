import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoriesDocument = HydratedDocument<Categories>;

@Schema({ timestamps: true })
export class Categories {
  @Prop({ required: true, type: String })
  category: string;
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
