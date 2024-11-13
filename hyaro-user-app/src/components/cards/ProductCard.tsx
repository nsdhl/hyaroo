'use client';

import { Box, Rating, Stack, Typography } from '@mui/material';
import { IProduct } from '@/types/types';
import { useRouter } from 'next/navigation';
import QuickBuy from './QuickBuy';

interface IProductCard {
  product: IProduct;
}

const ProductCard = ({ product }: IProductCard) => {
  const router = useRouter();

  return (
    <Stack
      direction="column"
      sx={{
        width: { xs: '160px', md: '204px' },
        bgcolor: '#fff',
        pb: '12px',
      }}
      borderRadius="6px 6px 0px 0px"
    >
      <Box
        onClick={() =>
          router.push(
            `/product/${product._id}/${product.name.replaceAll(' ', '-')}`,
          )
        }
      >
        <Box
          component="img"
          src={`${process.env.NEXT_PUBLIC_API_URL}/product/${product.images[0]}`}
          alt="product"
          sx={{
            objectFit: 'fill',
            borderRadius: '6px 6px 0px 0px',
            width: { xs: '160px', md: '204px' },
            height: '152px',
            cursor: 'pointer',
          }}
        />
      </Box>
      <Stack direction="column" p="0px 14px" rowGap="6px">
        <Typography
          variant="subtitle2"
          sx={{
            color: (theme) => theme.color.gray.primary,
            cursor: 'pointer',
          }}
          onClick={() =>
            router.push(
              `/product/${product._id}/${product.name.replaceAll(' ', '-')}`,
            )
          }
        >
          {product?.user?.fullName}
        </Typography>

        <Box
          sx={{
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            display: '-webkit-box',
            whiteSpace: 'normal',
            lineHeight: '18px',
            overflow: 'hidden',
            minHeight: '3em',
          }}
        >
          <Typography
            sx={{
              cursor: 'pointer',
            }}
            variant="body1"
            component="span"
            onClick={() =>
              router.push(
                `/product/${product._id}/${product.name.replaceAll(' ', '-')}`,
              )
            }
          >
            {product.name}
          </Typography>
        </Box>

        <Typography variant="body2">Rs. {product.basePrice}</Typography>

        <Rating
          name="product-rating"
          value={product.rating}
          readOnly
          size="small"
        />

        <QuickBuy product={product} showTitle={false} />
      </Stack>
    </Stack>
  );
};

export default ProductCard;
