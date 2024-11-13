import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { QuickBuy } from './schema/quickBuy.schema';

@Injectable()
export class QuickBuyService {
  constructor(
    @InjectModel(QuickBuy.name) private quickBuyModel: Model<QuickBuy>,
  ) {}

  async addQuickBuy(userId: mongoose.Schema.Types.ObjectId) {
    return await this.quickBuyModel.create({
      user: userId,
    });
  }

  async findQuickBuyUser(userId: mongoose.Schema.Types.ObjectId) {
    const user = await this.quickBuyModel.findOne({
      user: userId,
    });

    if (user) {
      return true;
    }
    return false;
  }

  async removeQuickBuyUser(userId: mongoose.Schema.Types.ObjectId) {
    await this.quickBuyModel.deleteOne({
      user: userId,
    });
  }
}
