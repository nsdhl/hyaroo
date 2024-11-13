'use client';

import { Stack } from '@mui/material';
import { FC, ReactNode } from 'react';

interface IPlaceCenter {
  children: ReactNode;
}

const PlaceCenter: FC<IPlaceCenter> = ({ children }) => {
  return (
    <Stack direction="row" justifyContent="center" mt="4em">
      {children}
    </Stack>
  );
};

export default PlaceCenter;
