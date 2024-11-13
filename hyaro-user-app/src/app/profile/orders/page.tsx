import OrderCard from '@/components/cards/OrderCard';
import { useCookies } from '@/hooks/useCookies';
import { IUserOrder } from '@/types/types';
import { Stack } from '@mui/material';

export const revalidate = 0;

async function getUserOrders(token: string) {
  const res = await fetch(`${process.env.API_URL}/api/order`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { tags: ['getUserOrders'], revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error('Something went wrong');
  }

  return res.json().then(res => res.orders);
}

export default async function MyOrder() {
  const token = useCookies();
  const orders: IUserOrder[] = await getUserOrders(token);

  return (
    <Stack
      direction="column"
      sx={{
        width: { xs: '95%', md: '50%' },
        rowGap: '1em',
        margin: { xs: '0 auto 12em auto', md: '0 0 6em 6em' },
      }}
    >
      {orders?.map((order, key) => {
        return <OrderCard orderItem={order} key={key} />;
      })}
    </Stack>
  );
}
