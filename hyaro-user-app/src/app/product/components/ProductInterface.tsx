'use client';

import { AddToCartButton, BuyButton2 } from '@/components/buttons/BuyButton';
import QuickBuy from '@/components/cards/QuickBuy';
import When from '@/components/hoc/When';
import CounterInput from '@/components/inputs/CounterInput';
import { useAppState } from '@/hooks/useAppState';
import { useAxiosPost } from '@/hooks/useAxios';
import { IDeliveryAddress, IProduct, IVariantType } from '@/types/types';
import { Box, Divider, Rating, Stack, Typography, styled } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import GiftNow from './GiftNow';
import { CheckoutDrawer } from '@/components/drawer/CheckoutDrawer';
import { generateQueryString } from '@/utils/encodeQueryParams';

interface IProductInterface {
  product: IProduct;
  deliveryAdress: IDeliveryAddress[]
}

const VariantContainer = styled(Stack)(({ theme }) => ({
  background: '#fff',
  border: `2px solid ${theme.color.gray.primary}`,
  padding: '2px 5px',
  cursor: 'pointer',
}));

const ProductInterface: FC<IProductInterface> = ({ product, deliveryAdress }) => {
  const [totalCost, setTotalCost] = useState<number>(product.basePrice);
  const [selectedVariants, setSelectedVariants] =
    //variantType: color, variantName: blue, additionCost: 10
    useState<
      {
        variantType: string;
        variantName: string;
        additionCost: number;
        isAvailable: boolean;
      }[]
    >([]);

  const [isAvailable, setIsAvailable] = useState(true);
  const [productCount, setProductCount] = useState(1);

  const appState = useAppState()
  const router = useRouter();

  const handleSelectVariant = (variant: IVariantType, variantType: string) => {
    setSelectedVariants((prev) => {
      let filteredVariant = prev.filter((el) => el.variantType !== variantType);

      if (selectedVariants.some((el) => el.variantName === variant.name)) {
        return [...filteredVariant];
      }

      return [
        ...filteredVariant,
        {
          variantType: variantType,
          variantName: variant.name,
          additionCost: parseInt(variant.additionalCost),
          isAvailable: variant.variantStock,
        },
      ];
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    appState?.setAppState((prev) => ({ ...prev, showCheckoutDrawer: false }));
    Object.keys(product?.variants).map((variantType) => {
      if (product.variants[variantType].length === 1) {
        handleSelectVariant(product.variants[variantType][0], variantType);
      }
    });
  }, []);

  useEffect(() => {
    let t: number = product.basePrice;

    selectedVariants.map((el) => {
      t = t + el.additionCost;
    });

    setTotalCost(t);
  }, [selectedVariants, product.basePrice]);

  useEffect(() => {
    if (selectedVariants.some((variant) => !variant.isAvailable)) {
      setIsAvailable(false);
    } else {
      setIsAvailable(true);
    }
  }, [selectedVariants]);

  const postRequest = useAxiosPost();

  const addToCart = async (showToast: boolean) => {
    try {
      const variant = selectedVariants.map(
        ({ additionCost: _, isAvailable: __, ...rest }) => rest,
      );
      if (selectedVariants.length === 0) {
        toast.error('Please select variants!');
        return;
      }
      const res = await postRequest('cart', {
        product: product._id,
        variant: variant,
        cost: totalCost,
        productCount: productCount,
      });
      if (showToast) {
        toast.success('Added to your cart!');
      }

      return res.data;
    } catch (e) {
      toast.error('Something went wrong!');
    }
  };

  const addToCartWithoutLogin = () => {
    const variant = selectedVariants.map(
      ({ additionCost: _, isAvailable: __, ...rest }) => rest,
    );
    if (selectedVariants.length === 0) {
      toast.error('Please select variants!');
      return;
    }
    const oldCartItems = JSON.parse(localStorage.getItem('cart') as string);
    let cartItems: any;
    if (oldCartItems && oldCartItems.length > 0) {
      const filteredItem = oldCartItems.filter(
        (item: any) => item.product.name !== product.name,
      );
      const newCartItem = {
        _id: oldCartItems[oldCartItems.length - 1]?._id + 1,
        product: product,
        variant: variant,
        cost: totalCost,
        productCount: productCount,
        totalCost: totalCost * productCount,
      };
      cartItems = [...filteredItem, newCartItem];
    } else {
      cartItems = [
        {
          _id: 1,
          product: product,
          variant: variant,
          cost: totalCost,
          productCount: productCount,
          totalCost: totalCost * productCount,
        },
      ];
    }
    localStorage.setItem('cart', JSON.stringify(cartItems));
    toast.success('Added to your cart!');
  };

  const buyNowWithoutLogin = () => {
    const variant = selectedVariants.map(
      ({ additionCost: _, isAvailable: __, ...rest }) => rest,
    );
    if (selectedVariants.length === 0) {
      toast.error('Please select variants!');
      return;
    }
    const checkOutItem = [
      {
        _id: 1,
        product: product,
        variant: variant,
        cost: totalCost,
        productCount: productCount,
        totalCost: totalCost * productCount,
      },
    ];

    appState?.setAppState((prev) => ({ ...prev, showCheckoutDrawer: true }));

    appState?.setAppState((prev) => ({
      ...prev,
      checkOutItems: checkOutItem as any,
      checkOutTotal: checkOutItem[0].totalCost,
    }));
  };


  return (
    <Stack direction="column">
      <Typography variant="h3">
        Rs. {totalCost > product.basePrice ? totalCost : product.basePrice}
      </Typography>

      <Rating value={product.rating} readOnly />

      <Divider
        variant="fullWidth"
        sx={{
          p: '0.5em 0em',
        }}
      />

      <Stack p="1.5em 0em" direction="column" rowGap="1.33em">
        {Object.keys(product?.variants).map((variantType, key) => {
          return (
            <Stack key={key}>
              <Typography variant="body1">
                {variantType.toUpperCase()}
              </Typography>
              <Stack
                direction="row"
                columnGap="0.9em"
                flexWrap="wrap"
                rowGap="0.5em"
              >
                {product?.variants[variantType].map((variant, key) => {
                  return (
                    <VariantContainer
                      key={key}
                      sx={{
                        background: selectedVariants.some(
                          (el) => el.variantName === variant.name,
                        )
                          ? (theme) => theme.color.black.primary
                          : '',
                        color: selectedVariants.some(
                          (el) => el.variantName === variant.name,
                        )
                          ? (theme) => '#fff'
                          : '',
                        border: selectedVariants.some(
                          (el) => el.variantName === variant.name,
                        )
                          ? (theme) => `2px solid ${theme.color.black.primary}`
                          : '',
                      }}
                      onClick={() => handleSelectVariant(variant, variantType)}
                    >
                      <Typography fontWeight={600} variant="caption" key={key}>
                        {variant.name.toUpperCase()}
                      </Typography>
                    </VariantContainer>
                  );
                })}
              </Stack>
            </Stack>
          );
        })}
      </Stack>

      <Box minHeight="10em">
        <When condition={!!isAvailable}>
          <CounterInput
            initValue={productCount}
            getCounterValue={(v) => setProductCount(v)}
          />
          <Stack direction="column" rowGap="1.5em" m="1.3em 0em">
            <Stack
              alignSelf="flex-end"
              onClick={async () => {
                if (!appState?.appState.isLoggedIn) {
                  router.push('/auth/signin');
                  return;
                }
                const cartItem = await addToCart(false);
                if (!cartItem) return;
                router.push(
                  `/order/${[cartItem._id, cartItem.totalCost, 'g'].join('/')}`,
                );
              }}
            >
              <GiftNow />
            </Stack>
            <AddToCartButton
              onClick={async () => {
                if (!appState?.appState.isLoggedIn) {
                  addToCartWithoutLogin();
                  return;
                }
                await addToCart(true);
              }}
            >
              <Typography variant="body1">Add to Cart</Typography>
            </AddToCartButton>
            <BuyButton2>
              <Typography
                variant="body1"
                onClick={async () => {
                  if (!appState?.appState.isLoggedIn) {
                    buyNowWithoutLogin();
                    return;
                  }
                  const cartItem: { _id: string; totalCost: number } =
                    await addToCart(false);
                  if (!cartItem) return;
                  async function getCheckOutItems(
                    token: string,
                    cartItemIds: string,
                  ) {
                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_API_URL}/api/cart/id?${cartItemIds}`,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'application/json',
                        },
                      },
                    );
                    return res.json();
                  }

                  const query = generateQueryString('cartItemIds', [
                    cartItem._id,
                  ]);
                  const checkOutItems = await getCheckOutItems(
                    appState?.appState.token,
                    query,
                  );
                  appState?.setAppState((prev) => ({
                    ...prev,
                    showCheckoutDrawer: true,
                  }));
                  appState?.setAppState((prev) => ({
                    ...prev,
                    checkOutItems: checkOutItems,
                    checkOutTotal: cartItem.totalCost,
                  }));
                }}
              >
                Buy Now
              </Typography>
            </BuyButton2>
            <Stack>
              <QuickBuy product={product} showTitle={true} />
            </Stack>
          </Stack>
        </When>

        <When condition={!isAvailable}>
          <Typography variant="h4">
            Some selected variants is not available!
          </Typography>
        </When>
      </Box>

      <Stack>
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: product.description }}
          sx={{
            fontSize: { xs: '16px', md: '22px' },
          }}
        ></Typography>
      </Stack>

      <CheckoutDrawer
        fetchedDeliveryAddress={deliveryAdress}
        open={appState?.appState.showCheckoutDrawer as boolean}
        onClose={() =>
          appState?.setAppState((prev) => ({
            ...prev,
            showCheckoutDrawer: false,
          }))
        }
      />
    </Stack>
  );
};

export default ProductInterface;
