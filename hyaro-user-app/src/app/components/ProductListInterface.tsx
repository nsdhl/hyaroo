'use client';

import ProductCard from '@/components/cards/ProductCard';
import { IAnnouncement, ICategory, IProduct } from '@/types/types';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { url } from '@/lib/axios/index';
import { FC, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  AppBar,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import ScrollableFilter from '@/components/carousel/ScrollableFilter';
import { generateQueryString } from '@/utils/encodeQueryParams';
import { useSearchParams } from 'next/navigation';
import { useAppState } from '@/hooks/useAppState';
import Announcement from './Announcement';

interface IProductListInterface {
  categoryList: ICategory[];

  children?: React.ReactNode;

  announcement?: IAnnouncement;

}

const ProductListInterface: FC<IProductListInterface> = ({
  categoryList,

  children,

  announcement,

}) => {
  const [hasMore, setHasMore] = useState(true);
  const [queryString, setQueryString] = useState('');
  const keyword = useSearchParams().get('keyword');
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<any[]>([]);

  const allProductRef = useRef<HTMLDivElement | null>(null)

  const appState = useAppState();

  const fetchProduct = async (page: number) => {
    console.log("url", `${process.env.NEXT_PUBLIC_API_URL
      }/api/product?page=${page}&limit=${12}&${queryString}`)
    const { data } = await url.get(
      `${process.env.NEXT_PUBLIC_API_URL
      }/api/product?page=${page}&limit=${12}&${queryString}`,
    );
    appState?.setProductList(data.products, 'normal');
    setHasMore(data.hasNextPage);
    // setPage(prev => prev + 1)
    appState?.setPage(appState?.appState.page + 1);
  };

  const fetchProductWithQuery = async (page: number, queryString: string) => {
    setLoading(true);
    const { data } = await url.get(
      `${process.env.NEXT_PUBLIC_API_URL
      }/api/product?page=${page}&limit=${12}&${queryString}&searchKeyword=${keyword ? keyword?.replaceAll('-', ' ') : ''
      }`,
    );
    appState?.setProductList(data.products, 'query');
    setHasMore(data.hasNextPage);
    setLoading(false);
  };

  // useEffect(() => {
  //   if (
  //     appState?.appState.productList.length === 0 &&
  //     (!queryString || !keyword)
  //   ) {
  //     appState?.setPage(1);
  //     fetchProductWithQuery(1, queryString);
  //   }
  // }, [queryString, keyword]);

  useEffect(() => {
    if (
      (appState?.appState.productList.length === 0 && !queryString && !keyword) ||
      (queryString || keyword)
    ) {
      appState?.setPage(1); // Reset page for new queries
      if (queryString || keyword) {
        fetchProductWithQuery(1, queryString);
      } else {
        fetchProduct(1); // Initial fetch for all products
      }
    }
  }, [queryString, keyword]);

  useEffect(() => {
    if (value.length > 0) {
      allProductRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const query = generateQueryString(
      'categories',
      value.map((el) => el._id),
    );
    appState?.setPage(1);
    fetchProductWithQuery(1, query);
  }, [value]);

  useEffect(() => {
    if (keyword) {
      allProductRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setQueryString('');
    setValue([]);
    appState?.setPage(1);
    fetchProductWithQuery(1, queryString);
  }, [keyword]);
  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          color: '#000',
          backgroundColor: '#fff',
          margin: '10px 0px',
        }}
        elevation={1}
      >
        <Stack spacing={2}>
          {announcement && <Announcement data={announcement} />}
          <ScrollableFilter
            filterValues={categoryList}
            getValues={(values) => {
              setValue(values);
              const query = generateQueryString(
                'categories',
                values.map((el) => el._id),
              );
              setQueryString(query);
            }}
            displayField={'category'}
            value={value}
          />
        </Stack>
      </AppBar>
      {children}
      <InfiniteScroll
        style={{
          overflow: 'unset',
        }}
        dataLength={appState?.appState.productList.length as number}
        next={() => fetchProduct(appState?.appState.page as number)}
        hasMore={hasMore}
        loader={
          <div>
            <CircularProgress
              sx={{
                color: '#000',
                zIndex: 100,
                position: 'sticky',
                left: 5,
              }}
              size={60}
            />
          </div>
        }
        endMessage={
          <Box textAlign="center" mb="20px">
            <Typography variant="caption">No more products to show!</Typography>
          </Box>
        }
      >
        <Grid2
          container
          rowSpacing={4}
          sx={{
            width: '100%',
            pb: '2.5em',
          }}
        >
          <Grid2 xs={12} sx={{
            padding: { xs: '4px 20px', md: '4px 0px' }
          }}
            ref={allProductRef}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '18px', md: '28px' },
              }}
            >
              All Products
            </Typography>
          </Grid2>
          {appState?.appState.productList &&
            appState?.appState.productList.length > 0 &&
            appState?.appState.productList?.map((el: IProduct, key: number) => {
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
      </InfiniteScroll>
    </>
  );
};

export default ProductListInterface;
