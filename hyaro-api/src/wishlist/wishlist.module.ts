import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WishList, WishListSchema } from './schema/wishlist.schema';
import { WishListController } from './wishlist.controller';
import { WishListService } from './wishlist.service';
import { Cart, CartSchema } from 'src/cart/schema/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WishList.name, schema: WishListSchema },
    ]),
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
  ],
  controllers: [WishListController],
  providers: [WishListService],
})
export class WishListModule {}
