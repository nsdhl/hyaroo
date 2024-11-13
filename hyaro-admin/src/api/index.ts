import { url } from "../axios";
import { IProduct } from "../types/interfaces";
import type {
  IAdminProductOrder,
  ICategory,
  OrderStatus,
} from "../types/interfaces";

export const getProducts = async (userId: string = ""): Promise<IProduct[]> => {
  const { data } = await url.get(`/product/?user=${userId}`);
  return data;
};

export const getAdminProducts = async (): Promise<IProduct[]> => {
  const { data } = await url.get("/product/admin");
  return data;
};

export const getCategories = async (): Promise<ICategory[]> => {
  const { data } = await url.get("/app-feature/category");
  return data;
};

export const getAdminProductOrders = async (
  searchParams: URLSearchParams
): Promise<{
  orders: IAdminProductOrder[];
  hasNextPage: boolean;
}> => {
  const {
    data,
  }: { data: { orders: IAdminProductOrder[]; hasNextPage: boolean } } =
    await url.get(`/order/admin?${searchParams.toString()}`);
  return data;
};

export const getAdminProductOrdersForDelivery = async (): Promise<
  IAdminProductOrder[]
> => {
  const { data } = await url.get(`/order/delivery`);
  return data;
};

export const getOrderByOrderId = async (
  orderId: string
): Promise<IAdminProductOrder> => {
  const { data } = await url.get(`/order/${orderId}`);
  return data;
};

export const updateOrderStatus = async (
  orderId: string,
  orderStatus: OrderStatus
) => {
  await url.patch(`/order/${orderId}?orderStatus=${orderStatus}`);
};

export const getCarouselImages = async () => {
  const { data } = await url.get("/app-feature/img");
  return data;
};

export const getCarouselVideos = async () => {
  const { data } = await url.get("/app-feature/vid");
  return data;
};

export const getUsers = async () => {
  const { data } = await url.get(
    "/user?type=vendor&type=delivery&type=shopper&type=supplier"
  );
  return data;
};

export const getAssignedGifts = async () => {
  const { data } = await url.get("/app-feature/gift/assigned");
  return data;
};

export const getUnverifiedUsers = async () => {
  const { data } = await url.get("/user/unverified");
  return data;
};
