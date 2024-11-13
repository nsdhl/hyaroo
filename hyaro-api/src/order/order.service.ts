import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, SortOrder } from 'mongoose';
import { Cart } from 'src/cart/schema/cart.schema';
import {
  CreateOrderDto,
  CreateOrderWithoutCartDto,
  EOrderStatusAdaptor,
  EOrderStatusSort,
  EPriceSort,
  OrderPaginationDto,
} from './dto/createOrder.dto';
import { Order, OrderStatus } from './schema/order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
  ) { }

  private resolvePaginationParams(paginationParams: OrderPaginationDto) {
    const { fromDate, toDate, priceSort, status } = paginationParams;
    console.log(fromDate, toDate)
    const limit = paginationParams.limit ?? 10;
    const page = paginationParams.page ?? 1;
    const query = {
      ...(fromDate ? { createdAt: { $gte: fromDate } } : {}),
      ...(toDate
        ? fromDate
          ? {
            createdAt: {
              $gte: fromDate,
              $lte: toDate,
            },
          }
          : { createdAt: { $lte: toDate } }
        : {}),
      ...(status ? { orderStatus: EOrderStatusAdaptor[status] } : {}),
    };
    type SortOrder = 'asc' | 'desc';
    const sortQuery: { [key: string]: SortOrder } = {
      ...(priceSort === EPriceSort.HIGHT_TO_LOW
        ? { 'product.price': 'desc' }
        : {}),
      ...(priceSort === EPriceSort.LOW_TO_HIGH
        ? { 'product.price': 'asc' }
        : { createdAt: 'desc' }),
    };

    return { page, limit, query, sortQuery };
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: mongoose.Schema.Types.ObjectId,
  ) {
    const cartItems = await this.cartModel.find({
      _id: createOrderDto.cartItems,
    });

    cartItems.map(async (item) => {
      await this.orderModel.create({
        user: userId,
        product: item.product,
        variant: item.variant,
        totalCost: item.totalCost,
        productCount: item.productCount,
        city: createOrderDto.city,
        detailAddress: createOrderDto.detailAddress,
        receiverName: createOrderDto.receiverName,
        receiverPhone: createOrderDto.receiverPhone,
      });

      await this.cartModel.deleteOne({
        _id: item._id,
      });
    });

    return 'Order succesfully created!';
  }

  async createOrderWithoutCart(
    createOrderWithoutCartDto: CreateOrderWithoutCartDto,
    userId: mongoose.Schema.Types.ObjectId,
  ) {
    createOrderWithoutCartDto.orderItem.map(async (itemOrder) => {
      await this.orderModel.create({
        user: userId,
        product: itemOrder.product._id,
        variant: itemOrder.variant,
        totalCost: itemOrder.totalCost,
        productCount: itemOrder.productCount,
        detailAddress: createOrderWithoutCartDto.detailAddress,
      });
    });

    return 'Order succesfully created!';
  }

  async getUserOrders(
    userId: mongoose.Schema.Types.ObjectId,
    paginationParams: OrderPaginationDto,
  ) {
    const { page, limit, query, sortQuery } =
      this.resolvePaginationParams(paginationParams);

    const totalOrdersCount = await this.orderModel.countDocuments(query);

    const orders = await this.orderModel
      .find({
        user: userId,
        ...query,
      })
      .populate({
        path: 'product',
        populate: {
          path: 'user',
          select: '-password',
        },
      })
      .skip(limit * (page - 1)) // Adjusted to start from the correct index
      .limit(limit)
      .sort({ ...sortQuery });
    const hasNextPage = limit * page < totalOrdersCount;

    return { orders, hasNextPage };
  }

  async getAdminProductOrders(
    productOwnerId: mongoose.Schema.Types.ObjectId,
    paginationParams: OrderPaginationDto,
  ) {
    const { page, limit, query, sortQuery } =
      this.resolvePaginationParams(paginationParams);

    const totalOrdersCount = await this.orderModel.countDocuments(query);

    const orders = await this.orderModel
      .find(query)
      .populate([
        { path: 'product', match: { user: productOwnerId } },
        { path: 'user' },
      ])
      .skip(limit * (page - 1)) // Adjusted to start from the correct index
      .limit(limit)
      .sort({ ...sortQuery })
      .then((orders: any) => {
        const filteredOrders = orders.filter(
          (order: any) => order.product !== null,
        );
        return filteredOrders;
      });

    const hasNextPage = limit * page < totalOrdersCount;

    return { orders, hasNextPage };
  }

  async getAdminProductOrdersForDeliveryPerson() {
    return await this.orderModel
      .find()
      .populate([
        {
          path: 'product',
          populate: { path: 'user', match: { roles: 'admin' } },
        },
        { path: 'user' },
      ])
      .sort({ createdAt: -1 })
      .then((orders: any) => {
        const filteredOrders = orders.filter(
          (order: any) => order.product.user !== null,
        );
        return filteredOrders;
      });
  }

  async getOrderByOrderId(orderId: mongoose.Schema.Types.ObjectId) {
    return await this.orderModel
      .findOne({
        _id: orderId,
      })
      .populate([{ path: 'product' }, { path: 'user' }]);
  }

  async updateOrderStatus(
    orderId: mongoose.Schema.Types.ObjectId,
    orderStatus: string,
  ) {
    await this.orderModel.findByIdAndUpdate(orderId, {
      orderStatus: orderStatus,
    });

    return 'Order Status Updated!';
  }
}
