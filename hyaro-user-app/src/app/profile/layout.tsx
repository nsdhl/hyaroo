'use client';

import { BuyButton2 } from '@/components/buttons/BuyButton';
import { useAppState } from '@/hooks/useAppState';
import {
  Box,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import UpdatePasswordCard from '@/components/cards/UpdatePasswordCard';
import { url } from '@/lib/axios/index';
import toast from 'react-hot-toast';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const appState = useAppState();
  const router = useRouter();
  const path = usePathname();
  const theme = useTheme();
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await url.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quick-buy`,
      );
      if (data) {
        setShowUpdatePasswordModal(true);
        return;
      }
      setShowUpdatePasswordModal(false);
    })();
  }, []);

  const handleUpdatePassword = async (password: {
    password: string;
    confirmPassword: string;
  }) => {
    if (password.password !== password.confirmPassword) {
      return toast.error("Password and confirmPassword didn't match!");
    }
    try {
      await url.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/update-password`,
        {
          password: password.password,
        },
      );
      toast.success('Password updated!');
      setShowUpdatePasswordModal(false);
    } catch (e) {
      toast.error('Something went wrong. Try again later!');
    }
  };

  const [pageValue, setPageValue] = useState(
    path.includes('orders')
      ? 'orders'
      : path.includes('gifts')
        ? 'gifts'
        : 'wishlist',
  );
  const handleChange = (e: SelectChangeEvent<string>) => {
    router.push(e.target.value);
    setPageValue(e.target.value);
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          width: { xs: '95%', md: '90%' },
          margin: '20px auto 20px auto',
          alignItems: 'flex-start',
        }}
      >
        <Stack direction="column" rowGap={2}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{
              cursor: 'pointer',
            }}
          >
            Hi! {appState?.appState.userInfo?.fullName},
          </Typography>

          <Stack
            direction="row"
            rowGap="5px"
            columnGap="5px"
            flexWrap="wrap"
            alignItems="center"
            sx={{
              display: { xs: "none", md: "flex" }
            }}
          >
            <Link
              href={'/profile/orders'}
              style={{
                textDecoration: 'none',
                border: path.includes('orders') ? '3px solid gray' : '',
              }}
            >
              <BuyButton2 sx={{ padding: '8px 18px' }}>
                <Typography variant="subtitle1" fontSize="15px">
                  My Orders
                </Typography>
              </BuyButton2>
            </Link>
            <Link
              href={'/profile/gifts'}
              style={{
                textDecoration: 'none',
                border: path.includes('gifts') ? '3px solid gray' : '',
              }}
            >
              <BuyButton2 sx={{ padding: '8px 18px' }}>
                <Typography variant="subtitle1" fontSize="15px">
                  My Gifts
                </Typography>
              </BuyButton2>
            </Link>
            <Link
              href={'/profile/wishlist'}
              style={{
                textDecoration: 'none',
                border: path.includes('gifts') ? '3px solid gray' : '',
              }}
            >
              <BuyButton2 sx={{ padding: '8px 18px' }}>
                <Typography variant="subtitle1" fontSize="15px">
                  My Wishlist
                </Typography>
              </BuyButton2>
            </Link>
          </Stack>

          <Select sx={{
            display: {
              sm: "block",
              md: "none"
            }
          }} value={pageValue} onChange={handleChange}>
            <MenuItem value={'orders'}>My Orders</MenuItem>
            <MenuItem value={'gifts'}>My Gifts</MenuItem>
            <MenuItem value={'wishlist'}>My Wishlist</MenuItem>
          </Select>

        </Stack>
        <Stack direction={'row'} alignItems={'center'} gap={'10px'}>
          <Box
            sx={{
              padding: '10px',
            }}
            onClick={() => {
              appState?.logoutUser();
              router.push('/');
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{
                cursor: 'pointer',
              }}
            >
              Sign Out
            </Typography>
          </Box>
          <Stack
            direction={'row'}
            gap={'4px'}
            alignItems={'center'}
            sx={{
              cursor: 'pointer',
            }}
            onClick={() => {
              router.push('/profile/edit');
            }}
          >
            <EditIcon />
            <Typography variant="subtitle2" fontWeight={600}>
              Edit Profile
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      {children}

      <UpdatePasswordCard
        open={showUpdatePasswordModal}
        handleUpdatePassword={(password) => {
          handleUpdatePassword(password);
        }}
      />
    </>
  );
}
