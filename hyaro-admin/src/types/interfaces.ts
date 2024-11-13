export enum Mode {
  POST = "post",
  EDIT = "edit",
  VIEW = "view"
}

export interface IOneClickPurchasePayload {
  fullName: string;
  phone: string;
}

export type IVariantType = {
  name: string;
  additionalCost: string;
  variantStock: boolean;
}
export type ICategory = {
  _id: string;
  category: string;
}

export interface IUser {
  _id: string;
  fullName: string;
  address: string;
  phone: string;
  email: string;
  roles: string[];
  verified: boolean;
}

export interface IAuth extends Omit<IUser, 'verified'> {
  loggedIn: boolean
  token: string
  verified: boolean | undefined;
}

export interface IVariant {
  [key: string]: IVariantType[];
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  variants: IVariant;
  user: IUser;
  images: string[];
  videos: string[];
  promotionalImages: string[];
  stock: boolean;
  basePrice: number;
  categories: ICategory[];
}

export interface ISignin {
  phone: string;
  email: string;
  password: string;
}

export interface ISignup extends ISignin {
  fullName: string;
  address: string;
  roles: string[];
}

export interface ICartItem {
  _id: string;
  user: string;
  product: IProduct;
  variant: { variantType: string; variantName: string }[];
  cost: number;
  totalCost: number;
  productCount: number;
}

export enum OrderStatus {
  ORDER_PLACED = "Order Placed",
  OUT_FOR_DELIVERY = "Out for Delivery",
  DELIVERED = "Delivered"
}

export interface IUserOrder {
  _id: string;
  user: string;
  product: IProduct;
  variant: { variantType: string; variantName: string }[];
  totalCost: number;
  productCount: number;
  city: string;
  detailAddress: string;
  receiverPhone: string;
  receiverName: string;
  orderStatus: OrderStatus
}

export interface IVideo {
  _id: string;
  video: string;
  productId: IProduct;
}

export interface IAdminProductOrder extends Omit<IUserOrder, 'user'> {
  user: IUser
}

export enum Role {
  SHOPPER = "shopper",
  ADMIN = "admin",
  DELIVERY = "delivery",
  SUPPLIER = "supplier",
  VENDOR = "vendor"
}

export interface IGift {
  _id: string;
  productId: IProduct;
  userId: IUser;
}


export enum EPriceSort {
  LOW_TO_HIGH = 'low_to_high',
  HIGHT_TO_LOW = 'high_to_low',
}

export enum EOrderStatusSort {
  ORDER_PLACED = 'order_placed',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  ALL = 'all'
}

export interface IAnnouncement {
  _id: string;
  title: string;
  description: string;
  productId: IProduct;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

