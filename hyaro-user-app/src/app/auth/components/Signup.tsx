'use client';

import { BuyButton } from '@/components/buttons/BuyButton';
import BasicInput from '@/components/inputs/BasicInput';
import { useAxiosPost } from '@/hooks/useAxios';
import { ISignup, IUser } from '@/types/types';
import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/hooks/useAppState';
import When from '@/components/hoc/When';
import LoaderComponent from '@/components/loaders/LoaderComponent';
import { jwtDecode } from 'jwt-decode';

const Signup = () => {
  const [signupPayload, setSignupPayload] = useState<ISignup>({
    phone: '',
    email: '',
    password: '',
    fullName: '',
    address: '',
    roles: ['shopper'],
  });

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const appState = useAppState();

  const clearSignupPayload = () =>
    setSignupPayload({
      roles: ['shopper'],
      phone: '',
      email: '',
      password: '',
      address: '',
      fullName: '',
    });

  const signinRequest = useAxiosPost();
  const handleSignup = async () => {
    try {
      setLoading(true);
      const res = await signinRequest('user/register', {
        ...signupPayload,
      });
      Cookies.default.set(
        'token',
        JSON.stringify({
          token: res?.data?.token,
        }),
        { expires: 1200 },
      );
      clearSignupPayload();
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
        <Typography variant="h2">Sign Up</Typography>

        <BasicInput
          label="Full Name"
          variant="outlined"
          type="text"
          getText={(data) => {
            setSignupPayload((prev) => ({ ...prev, fullName: data }));
          }}
        />
        <BasicInput
          label="Email"
          variant="outlined"
          type="text"
          getText={(data) => {
            setSignupPayload((prev) => ({ ...prev, email: data }));
          }}
        />

        <BasicInput
          label="Phone"
          variant="outlined"
          type="text"
          getText={(data) => {
            setSignupPayload((prev) => ({ ...prev, phone: data }));
          }}
        />

        <BasicInput
          label="Password"
          variant="outlined"
          type="password"
          getText={(password) => {
            setSignupPayload((prev) => ({ ...prev, password: password }));
          }}
        />

        <BasicInput
          label="Address"
          variant="outlined"
          type="text"
          getText={(data) => {
            setSignupPayload((prev) => ({ ...prev, address: data }));
          }}
        />

        <Box
          sx={{
            width: { xs: '100%', md: '60%' },
          }}
        >
          <BuyButton onClick={handleSignup}>
            <Typography variant="body1">Sign Up</Typography>
          </BuyButton>
        </Box>

        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              cursor: 'pointer',
            }}
          >
            Already have an account?{' '}
            <span
              style={{
                textDecoration: 'underline',
              }}
              onClick={() => router.push('/auth/signin')}
            >
              Sign In
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

export default Signup;
