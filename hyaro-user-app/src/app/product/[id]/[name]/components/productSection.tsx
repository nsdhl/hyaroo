'use client';
import Gallery from '@/components/carousel/Gallery';
import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import ProductInterface from '../../../components/ProductInterface';
import ReviewsCard from '@/components/cards/ReviewsCard';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import { url } from '@/lib/axios';
import { useState } from 'react';
import { IDeliveryAddress, IProduct, IRating, IWishListRepsonse } from '@/types/types';
import toast from 'react-hot-toast';
import { useAxiosDelete, useAxiosPost } from '@/hooks/useAxios';

function ProductSection({
  product,
  productComments,
  fav,
  deliveryAddress
}: {
  product: IProduct;
  productComments: IRating[];
  fav: IWishListRepsonse | undefined;
  deliveryAddress: IDeliveryAddress[]
}) {
  const [favourite, setFavorite] = useState<IWishListRepsonse | undefined>(fav);
  const deleteWishlist = useAxiosDelete();
  const addToWishlist = useAxiosPost();
  return (
    <>
      <Box width="100%" minHeight="70vh">
        <Stack
          justifyContent="space-between"
          sx={{
            width: { xs: '95%', md: '90%' },
            margin: '0 auto',
            flexDirection: { xs: 'column', md: 'row' },
            alignContent: 'flex-start',
            pb: '3.5em',
          }}
        >
          <Box
            sx={{
              flexBasis: '50%',
            }}
          >
            <Gallery images={product.images} videos={product.videos} />
          </Box>
          <Stack
            direction="column"
            sx={{
              flexBasis: '45%',
              rowGap: '1.3em',
              padding: { xs: '2em 0em', md: '0em' },
              mt: { xs: '3em', md: '0em' },
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  gap={'10px'}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { xs: '18px', md: '28px' },
                    }}
                  >
                    {product.name}
                  </Typography>
                  {favourite?.isWishList ? (
                    <Box
                      onClick={async () => {
                        try {
                          if (favourite?._id) {
                            const response = await deleteWishlist(
                              `wishlist/${favourite?._id}`,
                            );
                            setFavorite(undefined);
                            toast.success('Removed from wishlist');
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
                            productId: product._id,
                          }).then((res) => res);

                          setFavorite({
                            _id: response.data._id,
                            isWishList: true,
                          });

                          toast.success('Sucessfully Added to wishlist');
                        } catch (e) {
                          toast.error('Something went wrong!');
                        }
                      }}
                    >
                      <FavoriteBorderIcon />
                    </Box>
                  )}
                </Stack>

                <Typography variant="subtitle1">
                  By {product.user.fullName}
                </Typography>
              </Box>
            </Stack>

            <ProductInterface product={product} deliveryAdress={deliveryAddress} />
          </Stack>
        </Stack>

        <Stack
          sx={{
            width: { xs: '95%', md: '90%' },
            margin: '0em auto 3em auto',
            backgroundColor: '#fff',
          }}
        >
          <Stack direction="column" rowGap={4}>
            {product.promotionalImages.map((image, index) => {
              return (
                <Box
                  component="img"
                  src={`${process.env.NEXT_PUBLIC_API_URL}/product/${image}`}
                  alt={image}
                  sx={{
                    objectFit: 'contain',
                    width: '100%',
                    height: { xs: 'auto', md: '95vh' },
                  }}
                  key={index}
                />
              );
            })}
          </Stack>
        </Stack>

        <Stack
          sx={{
            width: { xs: '95%', md: '90%' },
            margin: '1.5em auto 3em auto',
            backgroundColor: '#fff',
          }}
        >
          <Typography variant="h3" p="1.5em 0em">
            Ratings &amp; Reviews
          </Typography>
          <Stack direction="column" rowGap={2}>
            {productComments.length === 0 && (
              <Typography variant="caption">No comments recorded!</Typography>
            )}
            {productComments.map((comment, index) => {
              return <ReviewsCard comment={comment} key={index} />;
            })}
          </Stack>
        </Stack>
      </Box>
    </>
  );
}

export default ProductSection;
