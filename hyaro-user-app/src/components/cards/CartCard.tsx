'use client';

import { Box, Checkbox, Divider, Stack, Typography } from '@mui/material';
import React, { ChangeEvent, FC } from 'react';
import { ICartItem } from '@/types/types';
import CounterInput from '../inputs/CounterInput';
import When from '../hoc/When';

interface ICartCard {
  cartItem: ICartItem;
  updateCartItem?: (count: number, cartItem: ICartItem) => void;
  deleteCartItem?: (id: string) => void;
  getSelectedItem?: (selected: boolean, cartItem: ICartItem) => void;
  isSelected?: boolean;
  readOnly: boolean;
}

const CartCard: FC<ICartCard> = ({
  readOnly,
  isSelected,
  cartItem,
  updateCartItem,
  deleteCartItem,
  getSelectedItem,
}) => {
  return (
    <Stack
      alignItems="flex-start"
      sx={{
        padding: '1.2em',
        borderTop: (theme) => `1px solid ${theme.color.gray.primary}`,
        borderBottom: (theme) => `1px solid ${theme.color.gray.primary}`,
        backgroundColor: '#fff',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'flex-start',
        columnGap: '10px',
      }}
    >
      <Stack
        sx={{
          flexDirection: { xs: 'row', md: 'row' },
          flex: { xs: 2, md: 1 },
          columnGap: '1.3em',
        }}
      >
        <When condition={!readOnly}>
          <Checkbox
            sx={{
              '&.Mui-checked': {
                color: '#000',
              },
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              getSelectedItem && getSelectedItem(e.target.checked, cartItem);
            }}
            checked={isSelected}
          />
        </When>
        <Stack direction="row" columnGap="5em">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/product/${cartItem?.product?.images[0]}`}
            alt={cartItem.product.name}
            width={120}
            height={80}
            style={{ objectFit: 'contain' }}
          />
        </Stack>

        <Stack direction="column">
          <Typography variant="h5">{cartItem.product.name}</Typography>
          <Typography
            variant="body1"
            sx={{
              color: (theme) => theme.color.gray.primary,
            }}
          >
            {cartItem.product.user.fullName}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
          flex: 1,
          m: { xs: '0.9em 0em', md: '' },
          width: '100%',
        }}
      >
        <Stack direction="column" flex="1">
          <Typography variant="h4">Variants</Typography>
          {cartItem.variant.map((el, key) => {
            return (
              <Stack
                key={key}
                direction="row"
                sx={{
                  alignItems: { xs: '', md: 'center' },
                  flexWrap: 'wrap',
                }}
                columnGap="0.5em"
              >
                <Typography variant="body1" fontWeight={600}>
                  {el?.variantType}
                </Typography>
                <Typography variant="body1">-</Typography>
                <Typography variant="body1">{el?.variantName}</Typography>
              </Stack>
            );
          })}
        </Stack>
        <When condition={!readOnly}>
          <Box
            sx={{
              flex: 1,
              alignSelf: { xs: 'flex-start', md: 'center' },
              m: { xs: '10px 0px', md: '' },
            }}
          >
            <CounterInput
              initValue={cartItem.productCount}
              getCounterValue={(v) => {
                updateCartItem && updateCartItem(v, cartItem);
              }}
            />
          </Box>
        </When>
        <When condition={!!readOnly}>
          <Box
            sx={{
              flex: 1,
              alignSelf: { xs: 'flex-start', md: 'center' },
              m: { xs: '10px 0px', md: '' },
            }}
          >
            <Typography variant="body1">
              {cartItem.productCount} items
            </Typography>
          </Box>
        </When>
      </Stack>

      <Divider
        orientation="horizontal"
        flexItem
        sx={{
          display: { xs: 'flex', md: 'none' },
          m: '12px 0px',
        }}
      />

      <Stack
        sx={{
          flexDirection: 'row',
          flex: 1,
          width: '100%',
          m: { xs: '0.9em 0em', md: '' },
        }}
      >
        <Box flex="1">
          <Typography variant="h4">Total Cost</Typography>
          <Typography variant="body2">Rs.{cartItem.totalCost}</Typography>
        </Box>

        <When condition={!readOnly}>
          <Typography
            variant="body1"
            sx={{
              color: (theme) => theme.color.red.primary,
              alignSelf: 'flex-end',
              cursor: 'pointer',
            }}
            onClick={() => {
              deleteCartItem && deleteCartItem(cartItem._id);
            }}
          >
            Delete
          </Typography>
        </When>
      </Stack>
    </Stack>
  );
};

export default CartCard;
