import CartCard from '@/components/cards/CartCard';
import { useCookies } from '@/hooks/useCookies';
import { ICartItem } from '@/types/types';
import { generateQueryString } from '@/utils/encodeQueryParams';
import { Box, Typography, Stack } from '@mui/material';
import OrderInterface from '../components/OrderInterface';

async function getCheckOutItems(token: string, cartItemIds: string) {
  const res = await fetch(`${process.env.API_URL}/api/cart/id?${cartItemIds}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 0, tags: ['getUserCart'] },
  });

  if (!res.ok) {
    console.log('Something went wrong!');
  }

  return res.json();
}

export default async function OrderPage({
  params,
}: {
  params: { item: string[] };
}) {
  const { item } = params;
  const lastItem = item.pop();
  let isGift = lastItem === 'g';
  let checkOutTotal = '';
  if (isGift) {
    checkOutTotal = item.pop() as string; //last item in params is the total cost
  } else {
    checkOutTotal = lastItem as string;
  }
  const token = useCookies();

  let checkOutItems: ICartItem[] = [];

  if (token) {
    const query = generateQueryString('cartItemIds', item);
    checkOutItems = await getCheckOutItems(token, query);
  }

  return (
    <Box width="100%">
      <Typography
        variant="h2"
        sx={{
          padding: { xs: '0px 10px', md: '0em 1.33em' },
        }}
      >
        {isGift ? 'Gift' : 'Order'}
      </Typography>

      <Stack
        sx={{
          width: { xs: '100%', md: '90%' },
          margin: '0 auto',
        }}
      >
        <OrderInterface
          totalCost={checkOutTotal as string}
          item={item}
          isGift={isGift}
        />
        {token &&
          checkOutItems.map((item, key) => {
            return <CartCard key={key} readOnly={true} cartItem={item} />;
          })}
      </Stack>
    </Box>
  );
}
