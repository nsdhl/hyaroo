import mongoose from 'mongoose';
import { Role } from 'src/user/schema/user.schema';
import { Request } from 'express';

type IVariantType = {
  name: string;
  additionalCost: number;
  variantStock: boolean;
};

export interface IVariant {
  [key: string]: IVariantType[];
}

export interface ICartItemVariant {
  variantType: string;
  variantName: string;
}

export interface ISessionUser {
  userId: mongoose.Schema.Types.ObjectId;
  phone: string;
  email: string;
  fullName: string;
  roles: Role[];
  iat: number;
  exp: number;
}

export interface IRequest extends Request {
  user: ISessionUser;
}
