'use client'; // Error components must be Client Components

import { BuyButton } from '@/components/buttons/BuyButton';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const router = useRouter();

  return (
    <Stack
      direction="column"
      justifyContent="center"
      textAlign="center"
      sx={{
        width: { xs: '90%', md: '30%' },
        margin: '0  auto',
        rowGap: '2em',
        mt: '10em',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: '16px', md: '32px' },
        }}
      >
        {error.message}
      </Typography>

      <BuyButton onClick={() => router.push('/')}>Go to Home</BuyButton>
    </Stack>
  );
}
