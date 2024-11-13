'use client';

import { ICartItem, IDeliveryAddress } from '@/types/types';
import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import { Box, Button, Checkbox, Stack, Typography } from '@mui/material';
import CartCard from '@/components/cards/CartCard';
import { AddToCartButton, BuyButton2 } from '@/components/buttons/BuyButton';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import When from '@/components/hoc/When';
import PlaceCenter from '@/components/hoc/PlaceCenter';
import { useAppState } from '@/hooks/useAppState';
import { CheckoutDrawer } from '@/components/drawer/CheckoutDrawer';

interface ICartInterface {
  cartItems: ICartItem[] | undefined;
  updateCartItem: (count: number, cartItem: ICartItem) => void;
  deleteCartItem: (id: string) => void;
  deliveryAddress:IDeliveryAddress[]
}

const CartInterface: FC<ICartInterface> = ({
  cartItems,
  deleteCartItem,
  updateCartItem,
  deliveryAddress
}) => {
  const [checkOutItems, setCheckOutItems] = useState<ICartItem[]>([]);
  const [checkOutTotal, setCheckOutTotal] = useState(0);
  const [selectAll, setSelectAll] = useState(false);

  const appState = useAppState();

  const [synchronizedCartItems, setSynchronizedCartItems] = useState<
    ICartItem[]
  >([]);


  useMemo(() => {
    if (!appState?.appState.isLoggedIn) {
      setSynchronizedCartItems(
        JSON.parse(localStorage.getItem('cart') as string) || [],
      );
    } else {
      setSynchronizedCartItems(cartItems || []);
    }
  }, [cartItems, appState?.appState.isLoggedIn]);

  const router = useRouter();

  const handleCheckOut = (update: boolean) => {
    let t = 0;
    const filteredCartItemsFromCheckOutItems = synchronizedCartItems.filter(
      (obj1) => checkOutItems.some((obj2) => obj2._id === obj1._id),
    );
    filteredCartItemsFromCheckOutItems.map((el) => {
      t = t + el.totalCost;
    });
    setCheckOutTotal(t);
    if (update) {
      setCheckOutItems([...filteredCartItemsFromCheckOutItems]);
    }
  };

  useEffect(() => {
    handleCheckOut(true);
  }, [synchronizedCartItems]);

  useEffect(() => {
    handleCheckOut(false);
  }, [checkOutItems]);

  return (
    <Box position="relative">
      <When
        condition={synchronizedCartItems && synchronizedCartItems.length > 0}
      >
        <Stack direction="row" alignItems="center" pl="1.2em" mt="1em">
          <Checkbox
            sx={{
              '&.Mui-checked': {
                color: '#000',
              },
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.checked) {
                setSelectAll(e.target.checked);
                setCheckOutItems([]);
                setCheckOutItems([...synchronizedCartItems]);
              } else {
                setSelectAll(e.target.checked);
                setCheckOutItems([]);
              }
            }}
            checked={
              selectAll ||
              (checkOutItems?.length === synchronizedCartItems?.length &&
                synchronizedCartItems?.length > 0)
            }
            id="select-all"
          />
          <Typography
            variant="body1"
            component="label"
            htmlFor="select-all"
            sx={{
              cursor: 'pointer',
            }}
          >
            Select all
          </Typography>
        </Stack>
      </When>

      <Stack
        direction="column"
        rowGap="0.8em"
        mt="1.5em"
        sx={{
          mb: { xs: '15em', md: '8em' },
        }}
      >
        {synchronizedCartItems.map((item: ICartItem, key: number) => {
          return (
            <CartCard
              isSelected={checkOutItems.some((el) => el._id === item._id)}
              cartItem={item}
              key={key}
              deleteCartItem={(id) => {
                if (appState?.appState.isLoggedIn) {
                  deleteCartItem(id);
                  const filtered = checkOutItems.filter((el) => el._id !== id);
                  setCheckOutItems([...filtered]);
                } else {
                  const filteredCartItems = synchronizedCartItems.filter(
                    (item: ICartItem) => item._id !== id,
                  );
                  setSynchronizedCartItems([...filteredCartItems]);
                  setCheckOutItems([...filteredCartItems]);
                  localStorage.setItem(
                    'cart',
                    JSON.stringify(filteredCartItems),
                  );
                }
              }}
              updateCartItem={(count, cartItem) => {
                if (!appState?.appState.isLoggedIn) {
                  let cartItemToUpdate: ICartItem = synchronizedCartItems.find(
                    (item) => item._id === cartItem._id,
                  ) as ICartItem;
                  cartItemToUpdate = {
                    ...cartItemToUpdate,
                    productCount: count,
                    totalCost: count * cartItem.cost,
                  };
                  let updatedCartItems = synchronizedCartItems.map((item) =>
                    item._id === cartItemToUpdate._id ? cartItemToUpdate : item,
                  );
                  setSynchronizedCartItems([...updatedCartItems]);
                  localStorage.setItem(
                    'cart',
                    JSON.stringify([...updatedCartItems]),
                  );
                  return;
                }
                updateCartItem(count, cartItem);
              }}
              getSelectedItem={(selected, cartItem) => {
                setCheckOutItems((prev) => {
                  if (selected) {
                    return [...prev, cartItem];
                  } else {
                    const filtered = prev.filter(
                      (el) => el._id !== cartItem._id,
                    );
                    return [...filtered];
                  }
                });
              }}
              readOnly={false}
            />
          );
        })}
      </Stack>

      <When
        condition={synchronizedCartItems && synchronizedCartItems.length > 0}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            position: 'fixed',
            bottom: { xs: 90, md: 0 },
            backgroundColor: (theme) => theme.color.blue.primary,
            padding: '0.5em 0.5em',
            width: { xs: '100%', md: '90%' },
          }}
        >
          <Typography variant="h4">Total</Typography>
          <Stack direction="row" alignItems="center" columnGap="1.33em">
            <Typography variant="h4">Rs. {checkOutTotal}</Typography>
            <BuyButton2
              onClick={() => {
                if (checkOutItems.length === 0) {
                  return toast.error('Select some items!');
                }

                appState?.setAppState((prev) => ({
                  ...prev,
                  showCheckoutDrawer: true,
                }));

                appState?.setAppState((prev) => ({
                  ...prev,
                  checkOutItems: checkOutItems,
                  checkOutTotal: checkOutTotal,
                }));

                // router.push(`/order/${[...checkOutItems.map(el => el._id), checkOutTotal].join('/')}`)
              }}
            >
              Check Out
            </BuyButton2>
          </Stack>
        </Stack>
      </When>

      <When
        condition={synchronizedCartItems && synchronizedCartItems.length === 0}
      >
        <PlaceCenter>
          <Stack direction="column" rowGap="1.3em">
            <Typography variant="h3">No Items in Cart</Typography>
            <AddToCartButton onClick={() => router.push('/')}>
              Shop Now
            </AddToCartButton>
          </Stack>
        </PlaceCenter>
      </When>

      <CheckoutDrawer
        fetchedDeliveryAddress={ deliveryAddress}
        open={appState?.appState.showCheckoutDrawer as boolean}
        onClose={() =>
          appState?.setAppState((prev) => ({
            ...prev,
            showCheckoutDrawer: false,
          }))
        }
      />
    </Box>
  );
};

export default CartInterface;
