import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { IRequest } from 'src/interfaces/interfaces';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/addToCart.dto';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addToCart(@Body() addToCartDto: AddToCartDto, @Request() req: IRequest) {
    const { userId } = req.user;
    return this.cartService.addToCart(addToCartDto, userId);
  }

  @Get()
  getUserCart(@Request() req: IRequest) {
    const { userId } = req.user;
    return this.cartService.getUserCart(userId);
  }

  @Get('id')
  getCartItemsById(
    @Query('cartItemIds') cartItemIds: mongoose.Schema.Types.ObjectId[],
  ) {
    return this.cartService.getCartItemsById(cartItemIds);
  }

  @Delete(':id')
  deleteCartItem(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.cartService.deleteCartItem(id);
  }
}
