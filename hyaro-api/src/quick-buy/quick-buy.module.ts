import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuickBuyController } from './quick-buy.controller';
import { QuickBuyService } from './quick-buy.service';
import { QuickBuy, QuickBuySchema } from './schema/quickBuy.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuickBuy.name,
        schema: QuickBuySchema,
      },
    ]),
  ],
  controllers: [QuickBuyController],
  providers: [QuickBuyService],
  exports: [QuickBuyModule],
})
export class QuickBuyModule {}
