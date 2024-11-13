import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type QuickBuyDocument = HydratedDocument<QuickBuy>;

@Schema({ timestamps: true })
export class QuickBuy {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Schema.Types.ObjectId;
}

export const QuickBuySchema = SchemaFactory.createForClass(QuickBuy);
