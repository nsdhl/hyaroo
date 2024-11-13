import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AddToCartDto } from './dto/addToCart.dto';
import { Cart } from './schema/cart.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

  async addToCart(
    addToCartDto: AddToCartDto,
    userId: mongoose.Schema.Types.ObjectId,
  ) {
    const cartItem = await this.cartModel.findOne({
      product: addToCartDto.product,
    });

    if (cartItem) {
      const cart = await this.cartModel.findOneAndUpdate(
        {
          _id: cartItem._id,
        },
        {
          variant: addToCartDto.variant
            ? addToCartDto.variant
            : cartItem.variant,
          cost: addToCartDto.cost,
          totalCost: addToCartDto.cost * addToCartDto.productCount,
          productCount: addToCartDto.productCount,
          product: cartItem.product,
          user: userId,
        },
        { new: true },
      );
      return cart;
    }

    const cart = await this.cartModel.create({
      user: userId,
      product: addToCartDto.product,
      variant: addToCartDto.variant,
      cost: addToCartDto.cost,
      totalCost: addToCartDto.cost * addToCartDto.productCount,
      productCount: addToCartDto.productCount,
    });
    return cart;
  }

  async getUserCart(userId: mongoose.Schema.Types.ObjectId) {
    return await this.cartModel
      .find({
        user: userId,
      })
      .populate({
        path: 'product',
        populate: {
          path: 'user',
          select: '-password',
        },
      })
      .sort({ createdAt: -1 });
  }

  async getCartItemsById(cartItemIds: mongoose.Schema.Types.ObjectId[]) {
    return await this.cartModel
      .find({
        _id: cartItemIds,
      })
      .populate({
        path: 'product',
        populate: {
          path: 'user',
          select: '-password',
        },
      });
  }

  async deleteCartItem(cartItemId: mongoose.Schema.Types.ObjectId) {
    return await this.cartModel.findByIdAndDelete(cartItemId);
  }
}
