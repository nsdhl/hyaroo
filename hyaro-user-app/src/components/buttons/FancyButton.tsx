'use client';

import { Box, styled } from '@mui/material';

export const FancyButton = styled(Box)(({ theme }) => ({
  backgroundColor: theme.color.blue.primary,
  padding: '8px',
  cursor: 'pointer',
  width: 'fit-content',
}));
