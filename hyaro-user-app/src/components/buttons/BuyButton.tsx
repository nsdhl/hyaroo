'use client';

import { Box, styled } from '@mui/material';

export const BuyButton = styled(Box)(({ theme }) => ({
  backgroundColor: theme.color.black.primary,
  cursor: 'pointer',
  borderRadius: '56px',
  color: '#fff',
  padding: '15px 25px',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    padding: '8px 12px',
    borderRadius: '40px',
  },
}));

export const AddToCartButton = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  padding: '15px 25px',
  textAlign: 'center',
  border: '2px solid #000',
  '&:hover': {
    backgroundColor: theme.color.black.secondary,
    color: '#fff',
  },
  [theme.breakpoints.down('md')]: {
    padding: '8px 12px',
  },
}));

export const BuyButton2 = styled(Box)(({ theme }) => ({
  backgroundColor: theme.color.black.primary,
  cursor: 'pointer',
  color: '#fff',
  padding: '15px 25px',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    padding: '8px 12px',
  },
}));
