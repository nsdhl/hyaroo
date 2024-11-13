import GiftCard from '@/components/cards/GiftCard';
import PlaceCenter from '@/components/hoc/PlaceCenter';
import When from '@/components/hoc/When';
import { useCookies } from '@/hooks/useCookies';
import { IGift } from '@/types/types';
import { Stack, Typography } from '@mui/material';

async function getUserGifts(token: string) {
  const res = await fetch(`${process.env.API_URL}/api/app-feature/gift`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error('Something went wrong');
  }

  return res.json();
}

export default async function MyGifts() {
  const token = useCookies();
  const gifts: IGift[] = await getUserGifts(token);

  return (
    <>
      <When condition={gifts && gifts.length === 0}>
        <PlaceCenter>
          <Stack direction="column" rowGap="1.3em">
            <Typography variant="h3">
              You haven't received any gifts yet!
            </Typography>
          </Stack>
        </PlaceCenter>
      </When>
      <Stack
        direction="column"
        sx={{
          width: { xs: '95%', md: '50%' },
          rowGap: '1em',
          margin: { xs: '0 auto', md: '0 0 3em 6em' },
        }}
      >
        {gifts.map((gift, index) => {
          return <GiftCard giftItem={gift.productId} key={index} />;
        })}
      </Stack>
    </>
  );
}
