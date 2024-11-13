'use client';

import { AddToCartButton, BuyButton } from '@/components/buttons/BuyButton';
import BasicInput from '@/components/inputs/BasicInput';
import { useAxiosPost } from '@/hooks/useAxios';
import { Stack, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/hooks/useAppState';
import When from '@/components/hoc/When';

interface IOrderInterface {
  totalCost: string;
  item: string[];
  isGift: boolean;
}

const OrderInterface: FC<IOrderInterface> = ({ totalCost, item, isGift }) => {
  const appState = useAppState();

  const [city, setCity] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const postRequest = useAxiosPost();

  const router = useRouter();

  useEffect(() => {
    if (appState?.appState.userInfo && !isGift) {
      setCity(appState?.appState.userInfo.address);
    }
  }, [appState?.appState.userInfo, isGift]);

  const handleConfirmOrder = async () => {
    if (!isGift) {
      if (!city || !detailAddress) {
        return toast.error('Please enter delivery details!');
      }
    } else {
      if (!detailAddress || !receiverName || !receiverPhone) {
        return toast.error('Please enter all details!');
      }
    }
    try {
      postRequest('order', {
        cartItems: item,
        city: city,
        detailAddress: detailAddress,
        receiverName: receiverName,
        receiverPhone: receiverPhone,
      });
      toast.success('Order is placed!');
      router.push('/profile/orders');
    } catch (e) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <Stack
      direction="column"
      rowGap="1em"
      mb="2em"
      mt="0.5em"
      sx={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: { xs: '1em 1.3em', md: '1em 0em' },
      }}
    >
      <Typography variant="h4" fontWeight={600}>
        {isGift ? 'Gift' : 'Order'} Details
      </Typography>

      <Typography variant="body2" m="0.5em 0em">
        This {isGift ? 'gift' : 'Order'} will cost you Rs.{totalCost}
      </Typography>

      <Stack
        direction="column"
        rowGap="1.3em"
        sx={{
          width: { xs: '100%', md: '50%' },
          margin: { xs: '0 auto', md: 'unset' },
        }}
      >
        <When condition={!isGift}>
          <BasicInput
            label="City"
            variant="outlined"
            type="text"
            getText={(data) => {
              setCity(data);
            }}
            value={city}
          />
        </When>
        <BasicInput
          label={isGift ? "Receiver's Address" : 'Detail Address'}
          variant="outlined"
          type="text"
          getText={(data) => {
            setDetailAddress(data);
          }}
          value={detailAddress}
        />

        <When condition={isGift}>
          <BasicInput
            label="Receiver's Name"
            variant="outlined"
            type="text"
            getText={(data) => {
              setReceiverName(data);
            }}
            value={receiverName}
          />
          <BasicInput
            label="Receiver's Phone"
            variant="outlined"
            type="text"
            getText={(data) => {
              setReceiverPhone(data);
            }}
            value={receiverPhone}
          />
        </When>

        <AddToCartButton
          onClick={handleConfirmOrder}
          sx={{
            bgcolor: '#000',
            color: '#fff',
          }}
        >
          <Typography variant="body1">
            {isGift ? 'Confirm Gift Order' : 'Confirm Order'}
          </Typography>
        </AddToCartButton>
      </Stack>
    </Stack>
  );
};

export default OrderInterface;
