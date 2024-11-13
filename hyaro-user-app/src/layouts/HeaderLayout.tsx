'use client';

import { FancyButton } from '@/components/buttons/FancyButton';
import AppDrawer from '@/components/drawer/AppDrawer';
import When from '@/components/hoc/When';
import SearchInputBox from '@/components/inputs/SearchInputBox';
import { useAppState } from '@/hooks/useAppState';
import {
  PersonOutlined,
  Search,
  ShoppingCartOutlined,
} from '@mui/icons-material';
import { Box, Drawer, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navigation from './Navigation';

const HeaderLayout = () => {
  const router = useRouter();
  const path = usePathname();
  const appState = useAppState();

  const [searchPressed, setSearchPressed] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const [showDrawer, setShowDrawer] = useState(false);

  const handleSearch = () => {
    if (!searchKeyword) return;
    router.push(`/?keyword=${searchKeyword.replaceAll(' ', '-')}`);
    appState?.setSearchKeyword(searchKeyword);
  };

  useEffect(() => {
    setShowDrawer(false);
  }, [path]);

  return (
    <>
      <Stack width="100%" direction="column">
        <Stack
          direction="row"
          sx={{
            padding: '24px 0px',
            width: { xs: '97%', md: '90%' },
            margin: '0 auto',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: '90px',
          }}
        >
          <Stack
            direction="row"
            columnGap="16px"
            alignItems="center"
            sx={{
              display: 'flex',
              flex: 1,
            }}
          >
            <Stack>
              <Link href="/">
                <Image
                  src="/logo.svg"
                  alt="LikeNP Logo"
                  width={207.5}
                  height={40.5}
                />
                
              </Link>
            </Stack>
            {/* change later: this is set to display: 'none' for now */}
            <FancyButton sx={{ display: 'none' }}>
              <Typography
                variant="h4"
                onClick={() => router.push('/categories/vendor')}
              >
                SHOP BY VENDORS
              </Typography>
            </FancyButton>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              columnGap: { lg: '3em', md: '16px' },
              flex: 1,
              justifyContent: 'end',
            }}
          >
            {/* change later: this is set to display: 'none' for now */}
            <FancyButton
              sx={{
                // display: { xs: "none", md: "flex" },
                display: 'none',
              }}
            >
              <Typography
                variant="h4"
                onClick={() => router.push('/categories/supplier')}
              >
                WHOLESALE
              </Typography>
            </FancyButton>
            <Stack direction="row" alignItems="center" columnGap="16px">
              <When condition={!searchPressed}>
                <Search
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setSearchPressed((prev) => !prev)}
                />
              </When>
              <When condition={!!searchPressed}>
                <Stack
                  direction="row"
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                  }}
                >
                  <SearchInputBox
                    label="Search"
                    variant="outlined"
                    getText={(keyword) => {
                      setSearchKeyword(keyword);
                    }}
                    handleCancel={() => {
                      setSearchPressed(false);
                      setSearchKeyword('');
                      router.push(`?keyword=`);
                    }}
                    handleSearch={() => {
                      handleSearch();
                    }}
                    handleKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                </Stack>
              </When>
              <PersonOutlined
                sx={{
                  cursor: 'pointer',
                  display: { xs: 'none', md: 'flex' },
                }}
                onClick={() =>
                  appState?.appState.isLoggedIn
                    ? router.push('/profile/orders')
                    : router.push('/auth/signin')
                }
              />
              <ShoppingCartOutlined
                sx={{
                  cursor: 'pointer',
                  display: { xs: 'none', md: 'block' },
                }}
                onClick={() => {
                  router.push('/cart');
                }}
              />
              {/* <MenuOutlined sx={{ */}
              {/*   display: { xs: "block", md: "none" } */}
              {/* }} onClick={() => setShowDrawer(prev => !prev)} /> */}
            </Stack>
          </Stack>
        </Stack>
        <When condition={!!searchPressed}>
          <Stack
            direction="row"
            sx={{
              display: { xs: 'block', sm: 'none' },
              width: '90%',
              margin: '0 auto',
              mb: '1.33em',
            }}
          >
            <SearchInputBox
              label="Search"
              variant="outlined"
              getText={(keyword) => {
                setSearchKeyword(keyword);
              }}
              handleCancel={() => {
                setSearchPressed(false);
                setSearchKeyword('');
                router.push(`?keyword=`);
              }}
              handleSearch={() => {
                handleSearch();
              }}
              handleKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </Stack>
        </When>
      </Stack>
      <Drawer
        anchor="left"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
      >
        <AppDrawer handleClose={() => setShowDrawer(false)} />
      </Drawer>
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        <Navigation
          handleClick={(value) => {
            if (value === 'menu') {
              setShowDrawer((prev) => !prev);
            }
            if (value === 'profile') {
              appState?.appState.isLoggedIn
                ? router.push('/profile/orders')
                : router.push('/auth/signin');
            }

            if (value === 'cart') {
              router.push('/cart');
            }

            if (value === 'home') {
              router.push('/');
            }
          }}
        />
      </Box>
    </>
  );
};

export default HeaderLayout;
