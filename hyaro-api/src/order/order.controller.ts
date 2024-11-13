import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { IRequest } from 'src/interfaces/interfaces';
import { Role } from 'src/user/schema/user.schema';
import {
  CreateOrderDto,
  CreateOrderWithoutCartDto,
  EOrderStatusSort,
  EPriceSort,
  OrderPaginationDto,
} from './dto/createOrder.dto';
import { OrderService } from './order.service';
import { OrderStatus } from './schema/order.schema';

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: IRequest,
  ) {
    const { userId } = req.user;
    return this.orderService.createOrder(createOrderDto, userId);
  }

  @Post('direct')
  createOrderWithoutCart(
    @Body() createOrderWithoutCartDto: CreateOrderWithoutCartDto,
    @Request() req: IRequest,
  ) {
    const { userId } = req.user;
    return this.orderService.createOrderWithoutCart(
      createOrderWithoutCartDto,
      userId,
    );
  }

  @Get()
  @UsePipes(new ValidationPipe())
  getUserOrder(@Request() req: IRequest, @Query() query: OrderPaginationDto) {
    const { userId } = req.user;
    return this.orderService.getUserOrders(userId, query);
  }

  @Roles(Role.ADMIN, Role.VENDOR, Role.SUPPLIER)
  @Get('/admin')
  @UsePipes(new ValidationPipe({ transform: true }))
  getAdminProductOrders(
    @Request() req: IRequest,
    @Query() query: OrderPaginationDto,
  ) {
    const { userId } = req.user;
    return this.orderService.getAdminProductOrders(userId, query);
  }

  //this api should be refactored in the upcoming phases
  @Roles(Role.DELIVERY)
  @Get('/delivery')
  getAdminProductOrdersForDeliveryPerson() {
    return this.orderService.getAdminProductOrdersForDeliveryPerson();
  }

  @Roles(Role.ADMIN, Role.VENDOR, Role.SUPPLIER)
  @Get(':orderId')
  getOrderByOrderId(@Param('orderId') orderId: mongoose.Schema.Types.ObjectId) {
    return this.orderService.getOrderByOrderId(orderId);
  }

  @Roles(Role.ADMIN, Role.VENDOR, Role.SUPPLIER)
  @Patch(':orderId')
  updateOrderStatus(
    @Param('orderId') orderId: mongoose.Schema.Types.ObjectId,
    @Query('orderStatus') orderStatus: string,
  ) {
    return this.orderService.updateOrderStatus(orderId, orderStatus);
  }
}
