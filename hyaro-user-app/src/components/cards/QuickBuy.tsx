'use client';

import { Stack, Typography } from '@mui/material';
import When from '../hoc/When';
import BasicInput from '../inputs/BasicInput';
import { ArrowCircleRightOutlined } from '@mui/icons-material';
import { FC, useEffect, useState } from 'react';
import { IOneClickPurchasePayload, IProduct } from '@/types/types';
import * as Cookies from 'js-cookie';
import { useAppState } from '@/hooks/useAppState';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAxiosPost } from '@/hooks/useAxios';
import LoaderComponent from '../loaders/LoaderComponent';

interface IQuickBuy {
  product: IProduct;
  showTitle: boolean;
}

const QuickBuy: FC<IQuickBuy> = ({ product, showTitle }) => {
  const appState = useAppState();
  const router = useRouter();
  const url = useAxiosPost();

  const [loading, setLoading] = useState(false);

  const [quickBuyStep, setQuickBuyStep] = useState(1);

  const [showOneClickPurchase, setShowOneClickPurchase] = useState<
    boolean | undefined
  >(false);

  const oneClickPurchaseStatus = Cookies.default.get('oneClickPurchase');

  const [oneClickPurchasePayload, setOneClickPurchasePayload] =
    useState<IOneClickPurchasePayload>({
      fullName: '',
      phone: '',
    });

  const handleQuickBuySteps = () => {
    if (
      (quickBuyStep === 1 && !oneClickPurchasePayload.phone) ||
      oneClickPurchasePayload.phone.length !== 10
    ) {
      toast.error('Please enter correct phone number!');
      return;
    }
    if (quickBuyStep === 2 && !oneClickPurchasePayload.fullName) {
      return;
    }
    setQuickBuyStep((prev) => prev + 1);
  };

  useEffect(() => {
    if (quickBuyStep === 3) {
      registerOneClickPurchaseUser();
    }
  }, [quickBuyStep, oneClickPurchasePayload]);

  useEffect(() => {
    if (oneClickPurchaseStatus === 'true' || appState?.appState.isLoggedIn) {
      setShowOneClickPurchase(false);
    } else {
      setShowOneClickPurchase(true);
    }
  }, [oneClickPurchaseStatus, appState?.appState.isLoggedIn]);

  const registerOneClickPurchaseUser = async () => {
    setLoading(true);
    try {
      const res = await url('user/register', {
        fullName: oneClickPurchasePayload.fullName,
        phone: oneClickPurchasePayload.phone,
        address: '',
        password: 'iaminlovewithhyaroonepalproducts098',
        roles: ['shopper'],
      });
      Cookies.default.set(
        'token',
        JSON.stringify({
          token: res?.data?.token,
        }),
        { expires: 1200 },
      );
      appState?.setLoggedInUser(res.data.token);
      toast.success("You're logged In!");
      Cookies.default.set('oneClickPurchase', 'true');
      setShowOneClickPurchase(false);

      const cartItem = await url('cart', {
        product: product._id,
        variant: [
          {
            variantType: '',
            variantName: '',
          },
        ],
        cost: product.basePrice,
        productCount: 1,
      });

      await url('order', {
        cartItems: [cartItem.data._id],
        city: 'oneclickpurchase',
        detailAddress: 'oneclickpurchase',
      });

      await url('quick-buy', {});

      router.push('/profile/orders');
      setLoading(false);
    } catch (e: any) {
      if (e.response?.data?.error === 'Unauthorized') {
        Cookies.default.set('oneClickPurchase', 'true');
        setLoading(false);
        setShowOneClickPurchase(false);
        return toast.error(
          'Phone number alredy registered! Please login to buy!',
        );
      }
      setLoading(false);
      toast.error('Something went wrong! Try again later!');
      setQuickBuyStep(1);
    }
  };

  return (
    <>
      <When condition={!!loading}>
        <LoaderComponent />
      </When>
      <When condition={showOneClickPurchase === false ? false : true}>
        {showTitle && <Typography variant="body1">Or Else, </Typography>}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          p="2px 0px"
        >
          <When condition={quickBuyStep === 1}>
            <BasicInput
              size="small"
              type="number"
              label="Enter phone to buy!"
              variant="standard"
              getText={(text) =>
                setOneClickPurchasePayload((prev) => ({ ...prev, phone: text }))
              }
            />
            <ArrowCircleRightOutlined
              fontSize="medium"
              cursor="pointer"
              onClick={handleQuickBuySteps}
            />
          </When>

          <When condition={quickBuyStep === 2}>
            <BasicInput
              autofocus={true}
              size="small"
              type="text"
              label="Full Name"
              variant="standard"
              getText={(text) =>
                setOneClickPurchasePayload((prev) => ({
                  ...prev,
                  fullName: text,
                }))
              }
            />
            <ArrowCircleRightOutlined
              fontSize="medium"
              cursor="pointer"
              onClick={handleQuickBuySteps}
            />
          </When>
        </Stack>
      </When>
    </>
  );
};

export default QuickBuy;
