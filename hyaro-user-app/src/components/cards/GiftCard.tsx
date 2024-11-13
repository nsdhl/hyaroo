'use client';

import { FC } from 'react';
import { Stack, Typography, Box, Divider } from '@mui/material';
import { IProduct } from '@/types/types';

interface IGiftCard {
  giftItem: IProduct;
}

const GiftCard: FC<IGiftCard> = ({ giftItem }) => {
  return (
    <>
      <Stack
        direction="row"
        sx={{
          backgroundColor: '#fff',
          borderTop: (theme) => `1px solid ${theme.color.gray.primary}`,
          borderBottom: (theme) => `1px solid ${theme.color.gray.primary}`,
          columnGap: '1.33em',
          padding: '10px 0px',
        }}
      >
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/product/${giftItem?.images[0]}`}
          alt={giftItem.name}
          width={120}
          height={80}
          style={{ objectFit: 'contain' }}
        />

        <Stack direction="column">
          <Stack
            sx={{
              flexDirection: { sm: 'row', xs: 'column' },
            }}
            columnGap="1.3em"
          >
            <Box
              sx={{
                width: { sm: '100%', xs: '120px' },
              }}
            >
              <Typography variant="body2">
                You have received a new gift from {giftItem?.user?.fullName}{' '}
              </Typography>
              <Typography variant="h5">{giftItem?.name}</Typography>
            </Box>
            <Divider
              flexItem
              orientation="horizontal"
              sx={{
                margin: '5px 0px',
              }}
            />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default GiftCard;
