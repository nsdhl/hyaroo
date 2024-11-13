import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppFeatureController } from './app-features.controller';
import { AppFeatureService } from './app-features.service';
import {
  CarouselImage,
  CarouselImageSchema,
} from './schema/carouselImages.schema';
import {
  CarouselVideo,
  CarouselVideoSchema,
} from './schema/carouselVideos.schema';
import { Categories, CategoriesSchema } from './schema/categories.schema';
import { Gifts, GiftsSchema } from './schema/gift.schema';
import { Announcement, AnnouncementSchema } from './schema/announcement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CarouselImage.name, schema: CarouselImageSchema },
    ]),
    MongooseModule.forFeature([
      { name: CarouselVideo.name, schema: CarouselVideoSchema },
    ]),
    MongooseModule.forFeature([
      { name: Categories.name, schema: CategoriesSchema },
    ]),
    MongooseModule.forFeature([{ name: Gifts.name, schema: GiftsSchema }]),
    MongooseModule.forFeature([
      { name: Announcement.name, schema: AnnouncementSchema },
    ]),
  ],
  controllers: [AppFeatureController],
  providers: [AppFeatureService],
})
export class AppFeaturesModule {}
