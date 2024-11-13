import {
  Body,
  Request,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { Role } from 'src/user/schema/user.schema';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { AppFeatureService } from './app-features.service';
import { UploadCarouselImageDto } from './dto/uploadCarouselImage.dto';
import { UploadCarouselVideoDto } from './dto/uploadCarouselVideo.dto';
import { Public } from 'src/commons/decorators/isPublic.decorator';
import mongoose from 'mongoose';
import { DeleteGiftDto, GiftDto } from './dto/gifts.dto';
import { IRequest } from 'src/interfaces/interfaces';
import {
  CreateAnnouncementDto,
  EditAnnouncementDto,
} from './dto/announcement.dto';
import { identity } from 'rxjs';

const storage = diskStorage({
  destination: __dirname + './../../media/carousel/',
  filename: (_, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${extname(file.originalname)}`);
  },
});

@Controller('app-feature')
@UseGuards(AuthGuard, RolesGuard)
export class AppFeatureController {
  constructor(private readonly appFeatureService: AppFeatureService) { }

  @Roles(Role.ADMIN)
  @Post('img')
  @UseInterceptors(FileInterceptor('image', { storage }))
  uploadCarouselImage(
    @Body() uploadCarouselImageDto: UploadCarouselImageDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.appFeatureService.uploadCarouselImage(
      uploadCarouselImageDto,
      image.filename,
    );
  }

  @Roles(Role.ADMIN)
  @Delete('img/:id')
  deleteCarouselImage(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.appFeatureService.deleteCarouselImage(id);
  }

  @Roles(Role.ADMIN)
  @Delete('vid/:id')
  deleteCarouselVideo(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.appFeatureService.deleteCarouselVideo(id);
  }

  @Roles(Role.ADMIN)
  @Post('vid')
  @UseInterceptors(FileInterceptor('video', { storage }))
  uploadCarouselVideo(
    @Body() uploadCarouselVideoDto: UploadCarouselVideoDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.appFeatureService.uploadCarouselVideo(
      uploadCarouselVideoDto,
      image.filename,
    );
  }

  @Public()
  @Get('img')
  async getCarouselImage() {
    const response = await this.appFeatureService.getCarouselImage();
    console.log(response)
    return response;
    return this.appFeatureService.getCarouselImage();
  }

  @Public()
  @Get('vid')
  getCarouselVideo() {
    return this.appFeatureService.getCarouselVideo();
  }

  @Roles(Role.ADMIN, Role.VENDOR, Role.SUPPLIER)
  @Post('category')
  addCategory(@Body() categoryDto: { categoryName: string }) {
    return this.appFeatureService.addCategory(categoryDto);
  }

  @Roles(Role.ADMIN)
  @Delete('category/:id')
  deleteCategory(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.appFeatureService.deleteCategory(id);
  }

  @Public()
  @Get('category')
  getAllCategories() {
    return this.appFeatureService.getAllCategories();
  }

  @Roles(Role.ADMIN, Role.VENDOR, Role.SUPPLIER)
  @Post('gift')
  assignGift(@Body() giftDto: GiftDto) {
    return this.appFeatureService.assignGift(giftDto.productId, giftDto.userId);
  }

  @Roles(Role.ADMIN, Role.VENDOR, Role.SUPPLIER)
  @Get('gift/assigned')
  getAssignedGifts(@Request() req: IRequest) {
    //this userId is admin user id who assigned the gift
    const { userId } = req.user;
    return this.appFeatureService.getAssignedGifts(userId);
  }

  @Roles(Role.ADMIN, Role.VENDOR, Role.SUPPLIER)
  @Delete('gift')
  deleteAssignedGifts(@Body() deleteGiftDto: DeleteGiftDto) {
    return this.appFeatureService.deleteAssignedGifts(deleteGiftDto.giftId);
  }

  @Get('gift')
  getUserGifts(@Request() req: IRequest) {
    const { userId } = req.user;
    return this.appFeatureService.getUserGifts(userId);
  }
  @Public()
  @Get('announcements')
  async getAnnouncements() {
    const response = await this.appFeatureService.getAnnouncements();
    return response;
  }

  @Roles(Role.ADMIN)
  @Post('announcements')
  @UsePipes(new ValidationPipe())
  addAnnouncements(@Body() body: CreateAnnouncementDto) {
    return this.appFeatureService.addAnnouncements(body);
  }

  @Roles(Role.ADMIN)
  @Put('announcements/:Id')
  @UsePipes(new ValidationPipe())
  editAnnouncement(@Param('Id') id: string, @Body() body: EditAnnouncementDto) {
    return this.appFeatureService.editAnnouncement(id, body);
  }

  @Roles(Role.ADMIN)
  @Delete('announcements/:Id')
  deleteAnnouncement(@Param('Id') id: string) {
    return this.appFeatureService.deleteAnnouncement(id);
  }
}
