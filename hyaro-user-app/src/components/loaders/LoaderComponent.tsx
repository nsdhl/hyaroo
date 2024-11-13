'use client';

import { CircularProgress } from '@mui/material';

const LoaderComponent = () => {
  return (
    <CircularProgress
      sx={{
        position: 'fixed',
        top: '45%',
        left: { xs: '42%', md: '50%' },
        color: '#000',
        zIndex: 100,
      }}
      size={60}
    />
  );
};

export default LoaderComponent;
