import OrderCard from '@/components/cards/OrderCard';
import WishlistCard from '@/components/cards/WishListCard';
import PlaceCenter from '@/components/hoc/PlaceCenter';
import When from '@/components/hoc/When';
import { useCookies } from '@/hooks/useCookies';
import { IUserOrder, IUserWishList } from '@/types/types';
import { Stack, Typography } from '@mui/material';

export const revalidate = 0;

async function getUserWishList(token: string) {
  const res = await fetch(`${process.env.API_URL}/api/wishlist/get`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { tags: ['getUserWishList'], revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error('Something went wrong');
  }

  return res.json();
}

export default async function Wishlist() {
  const token = useCookies();
  const wishLists: IUserWishList[] = await getUserWishList(token);

  return (
    <Stack
      direction="column"
      sx={{
        width: { xs: '95%', md: '50%' },
        rowGap: '1em',
        margin: { xs: '0 auto 12em auto', md: '0 0 6em 6em' },
      }}
    >
      <When condition={wishLists && wishLists.length === 0}>
        <PlaceCenter>
          <Stack direction="column" rowGap="1.3em">
            <Typography variant="h3">
              You haven't received any wishlist yet!
            </Typography>
          </Stack>
        </PlaceCenter>
      </When>
      {
        wishLists.map((wishList, key) => {
          return <WishlistCard wishListItem={wishList} key={key} />;
        })
      }
    </Stack>
  );
}
