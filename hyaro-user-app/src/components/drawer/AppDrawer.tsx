'use client';

import { Stack, styled } from '@mui/material';
import { FancyButton } from '../buttons/FancyButton';
import { useAppState } from '@/hooks/useAppState';
import When from '../hoc/When';
import Image from 'next/image';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const FancyButtonExtended = styled(FancyButton)({
  width: '90%',
  margin: '0 auto',
  borderRadius: '12px',
});

interface IAppDrawer {
  handleClose: () => void;
}

const AppDrawer = ({ handleClose }: IAppDrawer) => {
  const appState = useAppState();

  const router = useRouter();

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" p="1.5em 2em">
        <ArrowBack onClick={() => handleClose()} />
      </Stack>
      <Stack
        direction="column"
        justifyContent="center"
        sx={{
          width: '300px',
          textAlign: 'center',
          rowGap: '1.3em',
          pt: '2em',
        }}
      >
        {/* change later: this is set to display: 'none' for now */}
        <FancyButtonExtended
          onClick={() => router.push('/categories/vendor')}
          sx={{ display: 'none' }}
        >
          Shop by Vendors
        </FancyButtonExtended>
        {/* change later: this is set to display: 'none' for now */}
        <FancyButtonExtended
          onClick={() => router.push('/categories/supplier')}
          sx={{ display: 'none' }}
        >
          Wholesale
        </FancyButtonExtended>

        <When condition={appState?.appState.isLoggedIn as boolean}>
          <FancyButtonExtended onClick={() => router.push('/profile/orders')}>
            My Profile
          </FancyButtonExtended>
          <FancyButtonExtended
            onClick={() => {
              appState?.logoutUser();
              router.push('/');
            }}
          >
            Sign Out
          </FancyButtonExtended>
        </When>

        <When condition={!appState?.appState.isLoggedIn}>
          <FancyButtonExtended
            onClick={() => router.push('/auth/signin')}
            sx={{
              background: (theme) => theme.color.black.primary,
              color: '#fff',
            }}
          >
            Sign In
          </FancyButtonExtended>
        </When>

        <Stack direction="row" justifyContent="center" mt="6em">
          <Image
            src="/likenp_logo.svg"
            alt="LikeNP Logo"
            width={197.5}
            height={22.5}
          />
        </Stack>
      </Stack>
    </>
  );
};

export default AppDrawer;
