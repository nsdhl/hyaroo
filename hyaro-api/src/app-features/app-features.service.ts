import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { UploadCarouselImageDto } from './dto/uploadCarouselImage.dto';
import { UploadCarouselVideoDto } from './dto/uploadCarouselVideo.dto';
import { CarouselImage } from './schema/carouselImages.schema';
import { CarouselVideo } from './schema/carouselVideos.schema';
import { Categories } from './schema/categories.schema';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { Gifts } from './schema/gift.schema';
import { Announcement } from './schema/announcement.schema';
import {
  CreateAnnouncementDto,
  EditAnnouncementDto,
} from './dto/announcement.dto';

@Injectable()
export class AppFeatureService {
  constructor(
    @InjectModel(CarouselImage.name)
    private carouselImageModel: Model<CarouselImage>,
    @InjectModel(CarouselVideo.name)
    private carouselVideoModel: Model<CarouselVideo>,
    @InjectModel(Categories.name) private categoryModel: Model<Categories>,
    @InjectModel(Gifts.name) private giftModel: Model<Gifts>,
    @InjectModel(Announcement.name)
    private readonly announcementModel: Model<Announcement>,
  ) {}

  async uploadCarouselImage(
    uploadCarouselImageDto: UploadCarouselImageDto,
    fileName: string,
  ) {
    return await this.carouselImageModel.create({
      image: fileName,
      productId: uploadCarouselImageDto.productId,
    });
  }

  async deleteCarouselImage(id: mongoose.Schema.Types.ObjectId) {
    const carouselImage = await this.carouselImageModel.findOne({
      _id: id,
    });
    await fs.promises.unlink(
      path.resolve(__dirname, `./../../media/carousel/${carouselImage.image}`),
    );
    await this.carouselImageModel.findByIdAndDelete(id);
    return 'Carousel Image Deleted!';
  }

  async deleteCarouselVideo(id: mongoose.Schema.Types.ObjectId) {
    const carouselVideo = await this.carouselVideoModel.findOne({
      _id: id,
    });
    await fs.promises.unlink(
      path.resolve(__dirname, `./../../media/carousel/${carouselVideo.video}`),
    );
    await this.carouselVideoModel.findByIdAndDelete(id);
    return 'Carousel Video Deleted!';
  }

  async uploadCarouselVideo(
    uploadCarouselVidoDto: UploadCarouselVideoDto,
    fileName: string,
  ) {
    return await this.carouselVideoModel.create({
      video: fileName,
      productId: uploadCarouselVidoDto.productId,
    });
  }

  async getCarouselImage() {
    return await this.carouselImageModel.find().sort({ createdAt: -1 });
  }

  async getCarouselVideo() {
    return await this.carouselVideoModel
      .find()
      .populate('productId')
      .sort({ createdAt: -1 });
  }

  async addCategory(categoryDto: { categoryName: string }) {
    return await this.categoryModel.create({
      category: categoryDto.categoryName,
    });
  }

  async deleteCategory(id: mongoose.Schema.Types.ObjectId) {
    await this.categoryModel.findByIdAndDelete(id);
    return 'Category Deleted!';
  }

  async getAllCategories() {
    return await this.categoryModel.find().sort({ createdAt: -1 });
  }

  async assignGift(
    productId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
  ) {
    await this.giftModel.create({
      productId: productId,
      userId: userId,
    });

    return 'Gift has been assigned to the user!';
  }

  async getUserGifts(userId: mongoose.Schema.Types.ObjectId) {
    const userGifts = await this.giftModel
      .find({
        userId: userId,
      })
      .populate([
        {
          path: 'productId',
          populate: 'user',
        },
      ])
      .sort({ createdAt: -1 });

    return userGifts;
  }

  //this userId is admin user id who assigned the gift
  async getAssignedGifts(userId: mongoose.Schema.Types.ObjectId) {
    const assignedGifts = await this.giftModel
      .find()
      .populate([
        {
          path: 'productId',
          match: {
            user: userId,
          },
        },
        { path: 'userId' },
      ])
      .sort({ createdAt: -1 })
      .then((gift: any) => {
        const filteredGift = gift.filter(
          (gift: any) => gift.productId !== null,
        );
        return filteredGift;
      });

    return assignedGifts;
  }

  async deleteAssignedGifts(giftId: mongoose.Schema.Types.ObjectId[]) {
    await this.giftModel.deleteMany({ _id: giftId });
    return 'Deleted!';
  }

  async addAnnouncements(body: CreateAnnouncementDto) {
    if (body.productId && !Types.ObjectId.isValid(body?.productId))
      throw new Error('The Product to set announcement is not available');
    const newAnnouncement = new this.announcementModel(body);
    return await newAnnouncement.save();
  }

  async getAnnouncements() {
    console.log("hello")
    const data = await this.announcementModel
      .find({ isDeleted: false })
      .populate({
        path: 'productId',
      })
      .sort({ createdAt: -1 });
      console.log("hellooooo", data)

    return { announcements: data };
  }

  async editAnnouncement(id: string, body: EditAnnouncementDto) {
    if (!Types.ObjectId.isValid(id))
      throw new Error('Announcement  not available');
    const currentAnnouncement = await this.announcementModel.findById(id);
    currentAnnouncement.title = body.title ?? currentAnnouncement.title;
    currentAnnouncement.description =
      body.description ?? currentAnnouncement.description;
    currentAnnouncement.productId =
      body.productId ?? currentAnnouncement.productId;

    return await currentAnnouncement.save();
  }

  async deleteAnnouncement(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new Error('Announcement  not available');

    await this.announcementModel.findByIdAndUpdate(id, {
      $set: { isDeleted: true },
    });
    return '!Deleted';
  }
}
