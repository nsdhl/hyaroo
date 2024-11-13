import { useCookies } from '@/hooks/useCookies';
import { ICartItem } from '@/types/types';
import { Box, Stack, Typography } from '@mui/material';
import { deleteCartItem, updateCartItem } from './actions';
import CartInterface from './components/CartInterface';

export const dynamic = 'force-dynamic';

async function getUserCart(token: string) {
  const res = await fetch(`${process.env.API_URL}/api/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { tags: ['getUserCart'] },
  });

  if (!res.ok) {
    throw new Error('Something went wrong');
  }

  return res.json();
}

export default async function CartPage() {
  const token = useCookies();
  let cartItems: ICartItem[] | undefined = undefined;
  if (token) {
    cartItems = await getUserCart(token);
  }


  const deliveryResponse = await fetch(`${process.env.API_URL}/api/user/delivery-address`,{
    headers:{
      Authorization: `Bearer ${token}`,
    }
  }).then(res=>res.json())

  return (
    <Box width="100%">
      <Typography
        variant="h2"
        sx={{
          padding: { xs: '0px 10px', md: '0em 1.33em' },
        }}
      >
        My Cart
      </Typography>

      <Stack
        sx={{
          width: { xs: '100%', md: '90%' },
          margin: '0 auto',
        }}
      >
        <CartInterface
          cartItems={cartItems}
          deliveryAddress={deliveryResponse.deliveryAddress}
          updateCartItem={async (count, cartItem) => {
            'use server';
            await updateCartItem(token, cartItem, count);
          }}
          deleteCartItem={async (id) => {
            'use server';
            await deleteCartItem(token, id);
          }}
        />
      </Stack>
    </Box>
  );
}
