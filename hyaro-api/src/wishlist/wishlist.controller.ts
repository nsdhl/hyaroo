import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { IRequest } from 'src/interfaces/interfaces';
import { Role } from 'src/user/schema/user.schema';
import { CreateWishListDto } from './dto/createWishList.dto';
import { WishListService } from './wishlist.service';

@Controller('wishList')
@UseGuards(AuthGuard)
export class WishListController {
  constructor(private readonly wishListService: WishListService) {}

  @Post()
  createWishList(
    @Body() createWishListDto: CreateWishListDto,
    @Request() req: IRequest,
  ) {
    const { userId } = req.user;
    return this.wishListService.createWishList(createWishListDto, userId);
  }

  @Get()
  getWishListByProducId(
    @Query()
    getWishListByProducIdDto: { productId: mongoose.Schema.Types.ObjectId },
    @Request() req: IRequest,
  ) {
    return this.wishListService.getWishListByProducId(
      getWishListByProducIdDto.productId,
      req.user.userId,
    );
  }

  @Get('/get')
  getUserWishList(@Request() req: IRequest) {
    const { userId } = req.user;
    return this.wishListService.getUserWishLists(userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':wishListId')
  deleteWishList(
    @Param() deleteWishListDto: { wishListId: mongoose.Schema.Types.ObjectId },
    @Request() req: IRequest,
  ) {
    const { userId } = req.user;
    return this.wishListService.deleteWishList(
      deleteWishListDto.wishListId,
      userId,
    );
  }
}
