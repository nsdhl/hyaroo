'use client';

import { BuyButton } from '@/components/buttons/BuyButton';
import BasicInput from '@/components/inputs/BasicInput';
import { useAxiosPost } from '@/hooks/useAxios';
import { ISignin, IUser } from '@/types/types';
import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/hooks/useAppState';
import When from '@/components/hoc/When';
import LoaderComponent from '@/components/loaders/LoaderComponent';
import { jwtDecode } from 'jwt-decode';

const Signin = () => {
  const [signinPayload, setSigninPayload] = useState<ISignin>({
    phone: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const appState = useAppState();

  const clearSigninPayload = () =>
    setSigninPayload({ phone: '', email: '', password: '' });

  const signinRequest = useAxiosPost();
  const handleSignin = async () => {
    try {
      setLoading(true);
      const res = await signinRequest('user/login', {
        phone: signinPayload.phone.includes('@') ? '' : signinPayload.phone,
        email: signinPayload.phone.includes('@') ? signinPayload.phone : '',
        password: signinPayload.password,
      });
      Cookies.default.set(
        'token',
        JSON.stringify({
          token: res?.data?.token,
        }),
        { expires: 365 },
      );
      clearSigninPayload();
      appState?.setLoggedInUser(res.data.token);
      const userInfo: Omit<IUser, '_id'> & { userId: string } = jwtDecode(
        res.data.token,
      );
      appState?.setUserInfo(userInfo);
      setLoading(false);
      toast.success("You're logged in!");
      router.push('/');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Something went wrong!');
      setLoading(false);
    }
  };

  return (
    <>
      <Stack
        direction="column"
        alignItems="center"
        rowGap="1.5em"
        sx={{
          width: { xs: '90%', md: '30%' },
          pt: '3em',
        }}
      >
        <Typography variant="h2">Sign In</Typography>

        <BasicInput
          label="Phone/Email"
          variant="outlined"
          type="text"
          getText={(data) => {
            setSigninPayload((prev) => ({ ...prev, phone: data }));
          }}
        />
        <BasicInput
          label="Password"
          variant="outlined"
          type="password"
          getText={(password) => {
            setSigninPayload((prev) => ({ ...prev, password: password }));
          }}
        />

        <Box
          sx={{
            width: { xs: '100%', md: '60%' },
          }}
        >
          <BuyButton onClick={handleSignin}>
            <Typography variant="body1">Sign In</Typography>
          </BuyButton>
        </Box>

        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              cursor: 'pointer',
            }}
          >
            Don&apos;t have an account?{' '}
            <span
              style={{
                textDecoration: 'underline',
              }}
              onClick={() => router.push('/auth/signup')}
            >
              Create One
            </span>
          </Typography>
        </Box>
      </Stack>
      <When condition={loading}>
        <LoaderComponent />
      </When>
    </>
  );
};

export default Signin;
