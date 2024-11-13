'use client';

import { BuyButton } from '@/components/buttons/BuyButton';
import When from '@/components/hoc/When';
import BasicInput from '@/components/inputs/BasicInput';
import LoaderComponent from '@/components/loaders/LoaderComponent';
import { useAppState } from '@/hooks/useAppState';
import { useAxiosPatch, useAxiosPost } from '@/hooks/useAxios';
import { Box, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const appState = useAppState();
  const router = useRouter();

  const [editPayload, setEditPayload] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });

  useMemo(() => {
    setEditPayload({
      fullName: appState?.appState.userInfo?.fullName || '',
      email: appState?.appState.userInfo?.email || '',
      phone: appState?.appState.userInfo?.phone || '',
      address: appState?.appState.userInfo?.address || '',
    })
  }, [appState?.appState.userInfo])

  const [loading, setLoading] = useState(false);
  const editRequest = useAxiosPatch();
  const handleEdit = async () => {
    try {
      setLoading(true);
      const res = await editRequest('user/edit', {
        ...editPayload,
      });
      appState?.setUserInfo({ ...appState?.appState.userInfo, ...res.data });
      setLoading(false);
      toast.success('Sucessfully Edited!');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Something went wrong!');
      setLoading(false);
    }
  };
  return (
    <Stack alignItems={'left'} width={'100%'} sx={{
      p: { xs: "0em 0em 2em 2em", md: "0em 0em 4em 5em" }
    }}>
      <Stack
        direction="column"
        justifyContent={'left'}
        rowGap="1.5em"
        sx={{
          width: { xs: '90%', md: '50%' },
          // width: { xs: '90%', md: '90%' },
          pt: '3em',
        }}
      >
        <Typography variant="h2">Edit Porfile</Typography>

        <BasicInput
          label="Full Name"
          variant="outlined"
          type="text"
          value={editPayload.fullName}
          getText={(data) => {
            setEditPayload((prev) => ({ ...prev, fullName: data }));
          }}
        />
        <BasicInput
          label="Email"
          variant="outlined"
          type="text"
          value={editPayload.email}
          getText={(data) => {
            setEditPayload((prev) => ({ ...prev, email: data }));
          }}
        />

        <BasicInput
          label="Phone"
          variant="outlined"
          type="text"
          value={editPayload.phone}
          getText={(data) => {
            setEditPayload((prev) => ({ ...prev, phone: data }));
          }}
        />

        <BasicInput
          label="Address"
          variant="outlined"
          type="text"
          value={editPayload.address}
          getText={(data) => {
            setEditPayload((prev) => ({ ...prev, address: data }));
          }}
        />

        <Box
          sx={{
            width: '100%'
          }}
        >
          <BuyButton onClick={handleEdit}>
            <Typography variant="body1">Edit Profile</Typography>
          </BuyButton>
        </Box>
      </Stack>
      <When condition={loading}>
        <LoaderComponent />
      </When>
    </Stack>
  );
}
