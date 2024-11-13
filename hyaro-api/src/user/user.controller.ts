import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  Query,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { IRequest } from 'src/interfaces/interfaces';
import { QuickBuyService } from 'src/quick-buy/quick-buy.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from './schema/user.schema';
import { UserService } from './user.service';
import { EditUserDto } from './dto/edit-user.dto';
import { AddAddressDto } from './dto/add-address.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly quickBuyService: QuickBuyService,
  ) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    console.log('hello',createUserDto)

    return this.userService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Get()
  getUsers(
    @Query('type') type: string[],
    @Query('showOnlyVerified') showOnlyVerified: boolean,
  ) {
    return this.userService.getUsers(type, showOnlyVerified);
  }

  @UseGuards(AuthGuard)
  @Post('update-password')
  updatePassword(
    @Body() updatePasswordDto: { password: string },
    @Request() req: IRequest,
  ) {
    const updated = this.userService.updatePassword(
      req.user.userId,
      updatePasswordDto.password,
    );
    this.quickBuyService.removeQuickBuyUser(req.user.userId);
    return updated;
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Get('unverified')
  getUnverifiedUsers() {
    return this.userService.getUnverifiedUsers();
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Patch('verify/:userId')
  verifyUser(@Param('userId') userId: mongoose.Schema.Types.ObjectId) {
    return this.userService.verifyUser(userId);
  }

  @UseGuards(AuthGuard)
  @Patch('edit')
  editUser(@Body() editUserDto: EditUserDto, @Request() req: IRequest) {
    const updated = this.userService.editUser(req.user.userId, editUserDto);
    return updated;
  }

  @UseGuards(AuthGuard)
  @Post('/add-address')
  addAddress(@Body() addAddressDto: AddAddressDto, @Request() req: IRequest) {
    const addedAddress = this.userService.addAddress(
      req.user.userId,
      addAddressDto,
    );
    return addedAddress;
  }
  @UseGuards(AuthGuard)
  @Patch('/delete-address')
  deleteAddress(
    @Body() addAddressDto: AddAddressDto,
    @Request() req: IRequest,
  ) {
    const addedAddress = this.userService.deleteAddress(
      req.user.userId,
      addAddressDto,
    );
    return addedAddress;
  }

  @UseGuards(AuthGuard)
  @Get("/delivery-address")
  getDeliveryAddress(
    @Request() req:IRequest
  ){
    return this.userService.getDeliveryAddress(req.user.userId)
  }

  // @Get()
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  // findAll() {
  //   return this.userService.findAll();
  // }
}
