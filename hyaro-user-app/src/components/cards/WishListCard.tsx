'use client';

import { IUserOrder, IUserWishList, OrderStatus } from '@/types/types';
import { Box, Divider, Rating, Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { FavoriteBorder, StarOutline } from '@mui/icons-material';
import When from '../hoc/When';
import BasicInput from '../inputs/BasicInput';
import { BuyButton } from '../buttons/BuyButton';
import { url } from '@/lib/axios/index';
import LoaderComponent from '../loaders/LoaderComponent';
import toast from 'react-hot-toast';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAxiosDelete, useAxiosPost } from '@/hooks/useAxios';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface IWishListCard {
  wishListItem: IUserWishList;
}

const WishlistCard: FC<IWishListCard> = ({ wishListItem }) => {
  const [loading, setLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(true);
  const deleteWishlist = useAxiosDelete();
  const addToWishlist = useAxiosPost();
  return (
    <>

      <Stack
        direction="row"
        alignItems={'center'}
        sx={{
          backgroundColor: '#fff',
          borderTop: (theme) => `1px solid ${theme.color.gray.primary}`,
          borderBottom: (theme) => `1px solid ${theme.color.gray.primary}`,
          columnGap: '1.33em',
          padding: '10px 0px',
        }}
      >
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/product/${wishListItem.product?.images[0]}`}
          alt={wishListItem.product?.name}
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
              <Link href={`/product/${wishListItem.product._id}/${wishListItem.product.name.split(" ").join("-")}`}>
              <Typography variant="h5">{wishListItem.product?.name}</Typography>
              </Link>
              <Typography variant="body1">
                By {wishListItem.product?.user?.fullName}
              </Typography>
            </Box>
            <Stack
              direction="column"
              rowGap="1em"
              sx={{
                alignSelf: { xs: 'flex-start', md: 'flex-end' },
              }}
            ></Stack>
          </Stack>
        </Stack>
        {isClicked ? (
          <Box
            onClick={async () => {
              try {
                if (wishListItem._id) {
                  const response = await deleteWishlist(
                    `wishlist/${wishListItem._id}`,
                  );
                  setIsClicked(false);
                  toast.success('Removed From Wishlist');
                }
              } catch (e) {
                toast.error('Something went wrong!');
              }
            }}
          >
            <FavoriteIcon />
          </Box>
        ) : (
          <Box
            onClick={async () => {
              try {
                const response = await addToWishlist(`wishlist`, {
                  productId: wishListItem.product._id,
                }).then((res: any) => res);
                setIsClicked(true);
                toast.success('Added to Wishlist');
              } catch (e) {
                toast.error('Something went wrong!');
              }
            }}
          >
            <FavoriteBorder />
          </Box>
        )}
      </Stack>
    </>
  );
};

export default WishlistCard;
