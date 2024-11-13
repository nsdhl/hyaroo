'use client';

import When from '@/components/hoc/When';
import { Email, LocationOn, PhoneInTalk } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const Footer = () => {
  const [count, setCount] = useState(0)
  const path = usePathname();
  return (
    <When
      condition={
        !(
          path.includes('cart') ||
          path.includes('orders') ||
          path.includes('gifts')
        )
      }
    >
      <Stack
        direction="row"
        justifyContent="center"
        sx={{
          backgroundColor: (theme) => theme.color.black.primary,
          padding: { xs: '2em 0em 4em 0em', md: '4em 0em' },
          mb: { xs: '5em', md: '0em' },
        }}
      >
        <Stack direction="column" alignItems="center" rowGap="1.33em">
          {
            count < 28 ? 
            <Typography
            variant="h4"
            sx={{
              color: '#fff',
            }}
            onClick={() => setCount(prev => prev+1)}
          >
            HYAROO Online Store
          </Typography>
          : 
          <Typography
          variant="h4"
          sx={{
            color: '#fff',
          }}
        >
          Developed by <a href="https://anantabipal.dev" target='__black'>anantabipal.dev</a>
        </Typography>
          }
         
          <Stack direction="column" rowGap={0.5} alignItems="center">
            <Stack direction="row" columnGap={1.5}>
              <Stack direction="row" columnGap={0.5}>
                <PhoneInTalk fontSize="small" sx={{ color: '#fff' }} />
                <Typography variant="caption" sx={{ color: '#fff' }}>
                  9805940865
                </Typography>
              </Stack>
              <Stack direction="row" columnGap={0.5}>
                <Email fontSize="small" sx={{ color: '#fff' }} />
                <Typography variant="caption" sx={{ color: '#fff' }}>
                  hyaroo@gmail.com
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" columnGap={1.5}>
              <LocationOn sx={{ color: '#fff' }} fontSize="small" />
              <Typography variant="caption" sx={{ color: '#fff' }}>
                Gopikrishna Hall, Chabahil Kathmandu
              </Typography>
            </Stack>
          </Stack>
          <Typography variant="caption" color="#fff">
            Copyright &copy; 2024
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: '#fff', visibility: 'hidden' }}
          >
            Developed by{' '}
            <Typography
              variant="subtitle1"
              component="a"
              href="https://anantabipal.dev"
              target="_blank"
              sx={{ color: '#fff', textDecoration: 'none' }}
            >
              anantabipal.dev
            </Typography>
          </Typography>
        </Stack>
      </Stack>
    </When>
  );
};

export default Footer;
