import { ICartItem } from '@/types/types';
import { revalidateTag } from 'next/cache';

export async function updateCartItem(
  token: string,
  cartItem: ICartItem,
  count: number,
) {
  await fetch(`${process.env.API_URL}/api/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      cost: cartItem.cost,
      productCount: count,
      product: cartItem.product._id,
    }),
  });
  revalidateTag('getUserCart');
}

export const deleteCartItem = async (token: string, id: string) => {
  await fetch(`${process.env.API_URL}/api/cart/${id}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  revalidateTag('getUserCart');
};
