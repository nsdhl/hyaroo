export interface IOneClickPurchasePayload {
  fullName: string;
  phone: string;
}

export type IVariantType = {
  name: string;
  additionalCost: string;
  variantStock: boolean;
};
export type ICategory = {
  _id: string;
  category: string;
};

export interface IDeliveryAddress {
  detailAddress: string;
}

export interface IUser {
  _id: string;
  fullName: string;
  address: string;
  phone: string;
  email: string;
  roles: string[];
  deliveryAddress: IDeliveryAddress[];
  verified: boolean;
}

export interface IVariant {
  [key: string]: IVariantType[];
}

export interface IWishListRepsonse {
  isWishList: boolean;
  _id: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  variants: IVariant;
  user: IUser;
  images: string[];
  promotionalImages: string[];
  videos: string[];
  stock: boolean;
  basePrice: number;
  categories: ICategory[];
  rating: number;
}

export interface IRegularProduct extends Product {
  isFeatured: false;
}

export interface IFeaturedProduct extends Product {
  isFeatured: true;
  featuredOrder: number;
}

export interface ISignin {
  phone: string;
  email: string;
  password: string;
}

export type IProduct = IRegularProduct | IFeaturedProduct;

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
  ORDER_PLACED = 'Order Placed',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
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
  orderStatus: OrderStatus;
}

export interface IUserWishList {
  _id: string;
  user: string;
  product: IProduct;
}

export interface IVideo {
  _id: string;
  video: string;
  productId: IProduct;
}

export interface IRating {
  _id: string;
  rating: number;
  comment: string;
  userId: IUser;
  productId: string;
}

export interface IGift {
  productId: IProduct;
  userId: string;
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