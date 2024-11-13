'use client';

import { IUserOrder, OrderStatus } from '@/types/types';
import { Box, Divider, Rating, Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { StarOutline } from '@mui/icons-material';
import When from '../hoc/When';
import BasicInput from '../inputs/BasicInput';
import { BuyButton } from '../buttons/BuyButton';
import { url } from '@/lib/axios/index';
import LoaderComponent from '../loaders/LoaderComponent';
import toast from 'react-hot-toast';

interface IOrderCard {
  orderItem: IUserOrder;
}

const OrderCard: FC<IOrderCard> = ({ orderItem }) => {
  const [loading, setLoading] = useState(false);
  const [rate, setRate] = useState(false);

  const [comment, setComment] = useState('');
  const [ratingValue, setRatingValue] = useState(0);

  const postRating = async () => {
    try {
      setLoading(true);
      const rating = await url.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/rating`,
        {
          rating: ratingValue,
          comment: comment,
          productId: orderItem.product._id,
        },
      );
      toast.success(rating.data);
      setLoading(false);
    } catch (e: any) {
      toast.error(e.response.data.message || 'Something went wrong!');
      setLoading(false);
    }
  };

  return (
    <>
      <Stack
        direction="row"
        sx={{
          backgroundColor: '#fff',
          borderTop: (theme) => `1px solid ${theme.color.gray.primary}`,
          borderBottom: (theme) => `1px solid ${theme.color.gray.primary}`,
          columnGap: '1.33em',
          padding: '10px 0px',
        }}
      >
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/product/${orderItem.product?.images[0]}`}
          alt={orderItem.product?.name}
          width={120}
          height={80}
          style={{ objectFit: 'contain' }}
        />

        <Stack direction="column">
          <Stack
            sx={{
              flexDirection: { sm: 'row', xs: 'column' },
            }}
            columnGap="1.3em"
          >
            <Box
              sx={{
                width: { sm: '200px', xs: '120px' },
              }}
            >
              <Typography variant="h5">{orderItem.product?.name}</Typography>
              <Typography variant="body1">
                By {orderItem.product?.user?.fullName}
              </Typography>
              <Typography variant="body1">
                Quantity: {orderItem.productCount}
              </Typography>
            </Box>
            <Stack
              direction="column"
              rowGap="1em"
              sx={{
                alignSelf: { xs: 'flex-start', md: 'flex-end' },
              }}
            >
              <When condition={orderItem.orderStatus === OrderStatus.DELIVERED}>
                <Stack
                  direction="row"
                  sx={{
                    backgroundColor: (theme) => theme.color.blue.primary,
                    justifyContent: 'center',
                    padding: '2px 5px',
                    columnGap: '2px',
                    alignItems: 'center',
                    alignSelf: { xs: 'flex-start', md: 'flex-end' },
                    borderRadius: '12px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setRate((prev) => !prev)}
                >
                  <Typography variant="body1">Rate</Typography>
                  <StarOutline fontSize="small" />
                </Stack>
              </When>
              <Box
                sx={{
                  backgroundColor: (theme) =>
                    orderItem.orderStatus === OrderStatus.DELIVERED
                      ? '#b9ffb3'
                      : theme.color.red.secondary,
                  padding: '2px 5px',
                  textAlign: 'center',
                }}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  {orderItem.orderStatus}
                </Typography>
              </Box>
            </Stack>
          </Stack>
          <Divider
            flexItem
            orientation="horizontal"
            sx={{
              margin: '5px 0px',
            }}
          />
          <Stack direction="row" flexWrap="wrap" columnGap="1.5em">
            <Box
              sx={{
                width: { sm: '200px', xs: '120px' },
              }}
            >
              <When condition={!!orderItem.variant[0]?.variantType}>
                <Typography variant="h4" mb="5px">
                  Variants
                </Typography>
                {orderItem.variant.map((variant, key) => {
                  return (
                    <Stack
                      key={key}
                      sx={{
                        flexDirection: { md: 'row', xs: 'column' },
                        alignItems: { md: 'center', xs: 'flex-start' },
                      }}
                      columnGap="1.3em"
                      alignItems="center"
                    >
                      <Typography variant="subtitle1" fontWeight={700}>
                        {variant?.variantType}
                      </Typography>
                      <Typography variant="subtitle2">
                        {variant?.variantName}
                      </Typography>
                    </Stack>
                  );
                })}
              </When>
            </Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              alignSelf="flex-end"
            >
              Rs.{orderItem.totalCost}
            </Typography>
          </Stack>
          <When condition={rate}>
            <Divider
              flexItem
              orientation="horizontal"
              sx={{
                margin: '5px 0px',
              }}
            />
            <Stack
              direction="row"
              columnGap="10px"
              flexWrap="wrap"
              rowGap="10px"
            >
              <Stack direction="column" rowGap="10px">
                <BasicInput
                  label="Comment"
                  variant="standard"
                  type="text"
                  getText={(comment) => {
                    setComment(comment);
                  }}
                />
                <Rating
                  onChange={(_, value) => {
                    setRatingValue(value as number);
                  }}
                  value={ratingValue}
                />
              </Stack>
              <BuyButton
                sx={{
                  alignSelf: 'flex-end',
                  padding: '5px 15px',
                }}
                onClick={postRating}
              >
                <Typography variant="subtitle1">Submit</Typography>
              </BuyButton>
            </Stack>
          </When>
        </Stack>
      </Stack>
      <When condition={loading}>
        <LoaderComponent />
      </When>
    </>
  );
};

export default OrderCard;
