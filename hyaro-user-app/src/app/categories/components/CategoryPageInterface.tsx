'use client';

import ScrollableFilter from '@/components/carousel/ScrollableFilter';
import { ICategory, IProduct } from '@/types/types';
import { Box, Stack, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { url } from '@/lib/axios/index';
import { generateQueryString } from '@/utils/encodeQueryParams';
import When from '@/components/hoc/When';
import LoaderComponent from '@/components/loaders/LoaderComponent';
import ProductListInterface from '@/app/components/ProductListInterface';

interface ICategoryPageInterface {
  categories: ICategory[];
  displayField: string;
  type: string;
  searchKeyword: string;
}

const CategoryPageInterface: FC<ICategoryPageInterface> = ({
  type,
  categories,
  displayField,
  searchKeyword,
}) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [queryString, setQueryString] = useState('');
  const [loading, setLoading] = useState(true);

  const getProducts = async (
    query: string,
    type: string,
    searchKeyword: string,
  ) => {
    const res = await url.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product?${query}&role=${type}&searchKeyword=${searchKeyword}`,
    );
    return res.data;
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const products = await getProducts(
        queryString,
        type === 'product' ? '' : type,
        searchKeyword,
      );
      setProducts(products);
      setLoading(false);
    })();
  }, [queryString]);

  return (
    <>
      <Box
        sx={{
          width: { xs: '100%', sm: '90%', md: '70%' },
          m: '1.3em 0em',
        }}
      >
        <ScrollableFilter
          filterValues={categories}
          getValues={(values) => {
            if (type === 'product') {
              const query = generateQueryString(
                'categories',
                values.map((el) => el._id),
              );
              setQueryString(query);
            } else {
              const query = generateQueryString(
                'user',
                values.map((el) => el._id),
              );
              setQueryString(query);
            }
          }}
          displayField={displayField}
        />
      </Box>
      {/* <When condition={products.length > 0}> */}

      {/*   <ProductListInterface products={products} /> */}

      {/* </When> */}
      <When condition={products.length === 0 && !loading}>
        <Stack
          sx={{
            alignItems: 'center',
            m: '2em 0em',
          }}
        >
          <Typography variant="h5">No Items Found :( </Typography>
        </Stack>
      </When>

      <When condition={loading}>
        <LoaderComponent />
      </When>
    </>
  );
};

export default CategoryPageInterface;
