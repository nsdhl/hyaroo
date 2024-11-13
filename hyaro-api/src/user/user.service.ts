import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Role, User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { EditUserDto } from './dto/edit-user.dto';
import { AddAddressDto } from './dto/add-address.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(createUserDto: CreateUserDto) {
    let _user: User;

    if (!createUserDto.email) {
      _user = await this.userModel.findOne({
        phone: createUserDto.phone,
      });
    } else {
      _user = await this.userModel.findOne({
        $or: [{ email: createUserDto.email }, { phone: createUserDto.phone }],
      });
    }

    if (_user) {
      throw new UnauthorizedException('Email or phone already exists!');
    }

    const user = await this.userModel.create({
      ...createUserDto,
      verified:
        createUserDto.roles.includes(Role.VENDOR) ||
        !createUserDto.roles.includes(Role.SUPPLIER)
    });
    const token = user.generateJwt();

    return { token: token };
  }

  async login(loginDto: LoginDto) {
    let user: User;

    if (loginDto.email) {
      user = await this.userModel.findOne({ email: loginDto.email });
    } else {
      user = await this.userModel.findOne({ phone: loginDto.phone });
    }

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    if (!(await user.comparePassword(loginDto.password))) {
      throw new ForbiddenException("Phone/Email or password didn't match!");
    }

    const token = user.generateJwt();

    return { token: token };
  }

  async getUsers(type: string[], showOnlyVerified: boolean) {
    const query: any = {};
    if (showOnlyVerified) {
      query.verified = true;
    }

    return this.userModel
      .find({
        roles: { $in: type },
        ...query,
      })
      .sort({ createdAt: -1 })
      .select('-password');
  }

  async updatePassword(
    userId: mongoose.Schema.Types.ObjectId,
    password: string,
  ) {
    const salt = await bcrypt.genSalt(10);
    const _password = await bcrypt.hash(password, salt);

    await this.userModel.findByIdAndUpdate(userId, {
      password: _password,
    });

    return 'Password updated';
  }

  async getUnverifiedUsers() {
    const unverifiedUsers = await this.userModel
      .find({
        verified: false,
      })
      .select('-password')
      .sort({ createdAt: -1 });

    return unverifiedUsers;
  }

  async verifyUser(userId: mongoose.Schema.Types.ObjectId) {
    await this.userModel.findByIdAndUpdate(userId, {
      verified: true,
    });

    return 'User has been verified!';
  }

  async editUser(
    userId: mongoose.Schema.Types.ObjectId,
    editUserDto: EditUserDto,
  ) {
    const user = await this.userModel.findOneAndUpdate(
      {
        _id: userId,
      },
      editUserDto,
      { new: true },
    );
    return user;
  }

  async addAddress(
    userId: mongoose.Schema.Types.ObjectId,
    addAddressDto: AddAddressDto,
  ) {
    const user = await this.userModel.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $push: {
          deliveryAddress: addAddressDto,
        },
      },
    );
    return addAddressDto;
  }

  async deleteAddress(
    userId: mongoose.Schema.Types.ObjectId,
    addAddressDto: AddAddressDto,
  ) {
    const user = await this.userModel.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $pull: {
          deliveryAddress: addAddressDto,
        },
      },
    );
    return addAddressDto;
  }
  
  async getDeliveryAddress(
    userId:mongoose.Schema.Types.ObjectId
  ){
    const deliveryAddress = await this.userModel.findById(userId).select("deliveryAddress");
    return deliveryAddress
  }
}
