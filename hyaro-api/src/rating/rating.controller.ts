import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { Public } from 'src/commons/decorators/isPublic.decorator';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { IRequest } from 'src/interfaces/interfaces';
import { RatingDto } from './dto/rating.dto';
import { RatingService } from './rating.service';

@Controller('rating')
@UseGuards(AuthGuard)
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  addRating(@Body() ratingDto: RatingDto, @Request() req: IRequest) {
    const { userId } = req.user;

    return this.ratingService.addRating(ratingDto, userId);
  }

  @Public()
  @Get(':id')
  getProductComments(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.ratingService.getProductComments(id);
  }
}
