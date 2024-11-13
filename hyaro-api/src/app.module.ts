import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseExceptionFilter } from './commons/filters/mongo-exception.filter';
import configuration from './config/configuration';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { AppFeaturesModule } from './app-features/app-features.module';
import { QuickBuyModule } from './quick-buy/quick-buy.module';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { RatingModule } from './rating/rating.module';
import { WishListModule } from './wishlist/wishlist.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/hyaroo'),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, './../media/'),
      // serveStaticOptions: {
      //   setHeaders: (res: any, _, __) => {
      //     res.header('Access-Control-Allow-Origin', 'https://admin.anantabipal.dev');
      //     res.set('Access-Control-Allow-Origin', 'https://admin.anantabipal.dev');
      //     res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
      //   }
      // }
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    UserModule,
    ProductModule,
    CartModule,
    OrderModule,
    AppFeaturesModule,
    QuickBuyModule,
    RatingModule,
    WishListModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: MongooseExceptionFilter,
    },
  ],
})
export class AppModule {}
