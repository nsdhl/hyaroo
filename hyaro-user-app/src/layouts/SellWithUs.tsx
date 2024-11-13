'use client';

import { AddToCartButton } from '@/components/buttons/BuyButton';
import { Box, Stack, Typography } from '@mui/material';

const SellWithUs = () => {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      sx={{
        height: '100vh',
        backgroundColor: (theme) => theme.color.blue.primary,
        width: '100%',
      }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        rowGap="2.5em"
        sx={{
          width: { xs: '95%', sm: '50%' },
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <Stack direction="column" rowGap="10px">
          <Typography variant="h2">Become a Seller</Typography>
          <Typography variant="body1">
            Sell with us! You can sign up today as a vendor or a supplier. We
            get 1000+ daily visitors on this platform. Host your online store
            and uplift your sells counts exponentially!
          </Typography>
        </Stack>
        <AddToCartButton
          onClick={() => {
            window.open('https://admin.likewows.com/auth/signup');
          }}
        >
          Sign Up Now
        </AddToCartButton>
      </Stack>
    </Stack>
  );
};

export default SellWithUs;
