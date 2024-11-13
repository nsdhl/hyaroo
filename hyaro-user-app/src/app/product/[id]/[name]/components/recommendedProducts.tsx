'use client';

import ProductCard from '@/components/cards/ProductCard';
import { IProduct } from '@/types/types';
import { Box, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Stack } from '@mui/system';
import { FC } from 'react';

interface IRecommendedProducts {
  recommendedProducts: IProduct[];
}

const RecommendedProducts: FC<IRecommendedProducts> = ({ recommendedProducts }) => {

  return (
    <Box width="100%">
      <Box
        sx={{
          width: { xs: '100%', md: '90%' },
          margin: '0 auto',
          minHeight: '70vh',
        }}
      >
        <Typography variant="h3" m={'1.5em 0em'}>Similar Products</Typography>
        {
          recommendedProducts?.length > 0 &&
          <Grid2
            container
            rowSpacing={4}
            sx={{
              width: '100%',
              pb: '2.5em',
            }}
          >
            {recommendedProducts?.map((el: IProduct, key: number) => {
              return (
                <Grid2
                  lg={2}
                  md={3}
                  sm={4}
                  xs={6}
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'center', md: 'unset' },
                  }}
                  key={key}
                >
                  <ProductCard product={el} key={key} />
                </Grid2>
              );
            })}
          </Grid2>
        }
      </Box>
    </Box>
  );
};

export default RecommendedProducts;
