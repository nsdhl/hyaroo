import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

export type AnnouncementDocument = HydratedDocument<Announcement>;
@Schema({ timestamps: true })
export class Announcement extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    alias: 'Product',
  })
  productId: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
