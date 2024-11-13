import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuickBuyModule } from 'src/quick-buy/quick-buy.module';
import { QuickBuyService } from 'src/quick-buy/quick-buy.service';
import { QuickBuy, QuickBuySchema } from 'src/quick-buy/schema/quickBuy.schema';
import { User, UserSchema } from './schema/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: QuickBuy.name, schema: QuickBuySchema },
    ]),
    QuickBuyModule,
  ],
  controllers: [UserController],
  providers: [UserService, QuickBuyService],
})
export class UserModule {}
