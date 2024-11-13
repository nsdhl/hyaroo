import * as Cookies from 'js-cookie';
import { useAppState } from '@/hooks/useAppState';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Collapse,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  Stack,
  SwipeableDrawer,
  Typography,
  radioClasses,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CartCard from '../cards/CartCard';
import { useEffect, useMemo, useState } from 'react';
import When from '../hoc/When';
import BasicInput from '../inputs/BasicInput';
import { IDeliveryAddress, ISignup, IUser } from '@/types/types';
import { BuyButton, BuyButton2 } from '../buttons/BuyButton';
import LoaderComponent from '../loaders/LoaderComponent';
import { useAxiosPatch, useAxiosPost } from '@/hooks/useAxios';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FancyButton } from '../buttons/FancyButton';
import { Api, CancelOutlined, ExpandMoreRounded } from '@mui/icons-material';

interface IProps {
  open: boolean;
  onClose: () => void;
  fetchedDeliveryAddress: IDeliveryAddress[]
}

export const CheckoutDrawer = ({ open, onClose, fetchedDeliveryAddress }: IProps) => {
  const theme = useTheme();
  const appState = useAppState();
  const signinRequest = useAxiosPost();
  const orderRequest = useAxiosPost();
  const orderAfterSigninRequest = useAxiosPost();
  const addAdress = useAxiosPost();
  const deleteAddress = useAxiosPatch();
  const router = useRouter();

  const cartItems = appState?.appState.checkOutItems;

  const [selectedProcess, setSelectedProcess] = useState<
    'login' | 'signup' | null
  >(null);

  const [payload, setPayload] = useState<Omit<ISignup, 'email'>>({
    fullName: '',
    phone: '',
    password: '',
    address: appState?.appState.userInfo?.address || '',
    roles: ['shopper'],
  });

  const [deliveryAddress, setDeliveryAddress] = useState(fetchedDeliveryAddress?.length > 0 ?
    [
      {
        detailAddress: appState?.appState?.userInfo?.address
          ? appState?.appState?.userInfo?.address
          : '',
      },
      ...fetchedDeliveryAddress
    ] :
    [
      {
        detailAddress: appState?.appState?.userInfo?.address
          ? appState?.appState?.userInfo?.address
          : '',
      }
    ]

  );

  useMemo(() => {
    fetchedDeliveryAddress
      ? setDeliveryAddress([
        {
          detailAddress: appState?.appState?.userInfo?.address
            ? appState?.appState?.userInfo?.address
            : '',
        },
        ...fetchedDeliveryAddress,
      ])
      : setDeliveryAddress([
        {
          detailAddress: appState?.appState?.userInfo?.address
            ? appState?.appState?.userInfo?.address
            : '',
        },
      ]);
  }, [appState?.appState.userInfo]);

  const [addedAdress, setAddedAddress] = useState<IDeliveryAddress>({
    detailAddress: '',
  });

  const [loading, setLoading] = useState(false);

  const orderFlow = async () => {
    try {
      await orderRequest('order/direct', {
        orderItem: cartItems,
        detailAddress: payload.address,
      });

      localStorage.removeItem('cart');
      appState?.setAppState((prev) => ({ ...prev, showCheckoutDrawer: false }));
      router.push('/profile/orders');
      setLoading(false);
      toast.success("You're logged in!");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Something went wrong!');
      setLoading(false);
    }
  };

  const signupAndOrder = async () => {
    try {
      if (
        !payload.phone ||
        !payload.fullName ||
        !payload.password ||
        !payload.address ||
        !payload.roles
      ) {
        return toast.error('Please enter all fields!');
      }
      setLoading(true);
      const signupRes = await signinRequest('user/register', {
        phone: payload.phone,
        fullName: payload.fullName,
        password: payload.password,
        address: payload.address,
        roles: payload.roles,
      });
      Cookies.default.set(
        'token',
        JSON.stringify({
          token: signupRes?.data?.token,
        }),
        { expires: 1200 },
      );
      appState?.setLoggedInUser(signupRes.data.token);
      const userInfo: Omit<IUser, '_id'> & { userId: string } = jwtDecode(
        signupRes.data.token,
      );
      appState?.setUserInfo(userInfo);
      await orderFlow();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Something went wrong!');
      setLoading(false);
    }
  };

  const signinAndOrder = async () => {
    try {
      if (!payload.phone || !payload.password) {
        return toast.error('Please enter all fields!');
      }
      setLoading(true);
      const res = await signinRequest('user/login', {
        phone: payload.phone.includes('@') ? '' : payload.phone,
        email: payload.phone.includes('@') ? payload.phone : '',
        password: payload.password,
      });
      Cookies.default.set(
        'token',
        JSON.stringify({
          token: res?.data?.token,
        }),
        { expires: 1200 },
      );
      appState?.setLoggedInUser(res.data.token);
      const userInfo: Omit<IUser, '_id'> & { userId: string } = jwtDecode(
        res.data.token,
      );
      appState?.setUserInfo(userInfo);
      await orderFlow();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Something went wrong!');
      setLoading(false);
    }
  };
  const [selectedDelivery, setSelectedDelivery] = useState<number>();

  const handleOrderAfterSignin = async () => {
    if (selectedDelivery == undefined || !deliveryAddress[selectedDelivery]) {
      return toast.error('Please enter your delivery address!');
    }

    try {
      orderAfterSigninRequest('order', {
        cartItems: cartItems?.map((el) => el._id),
        detailAddress: deliveryAddress[selectedDelivery].detailAddress,
      });
      localStorage.removeItem('cart');
      appState?.setAppState((prev) => ({ ...prev, showCheckoutDrawer: false }));
      toast.success('Order is placed!');
      router.push('/profile/orders');
    } catch (e) {
      toast.error('Something went wrong!');
    }
  };
  const handleAddAddress = (data: IDeliveryAddress) => {
    try {
      addAdress('user/add-address', data);
      toast.success('Adress Added');
      setDeliveryAddress((prev) => [...prev, addedAdress]);

    } catch (e) {
      toast.error('Something went wrong!');
    }
  };
  const handleDeleteAddress = (data: IDeliveryAddress) => {
    try {
      deleteAddress('user/delete-address', data);
      toast.success('Adress Removed');
      setDeliveryAddress((prev) => prev.filter((val) => val != data));

    } catch (e) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onOpen={() =>
        appState?.setAppState((prev) => ({ ...prev, showCheckoutDrawer: true }))
      }
      onClose={onClose}
      disableSwipeToOpen
      sx={{
        '&.MuiDrawer-root': {
          overflowY: 'scroll',
        },
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          maxHeight: '80vh',
          boxSizing: 'border-box',
          borderTopRightRadius: '20px',
          borderTopLeftRadius: '20px',
          boxShadow: '0px -3px 24px -7px rgba(35,34,34,1)',
        },
      }}
    >
      <StyledBox
        sx={{
          position: 'absolute',
          top: -5,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          visibility: 'visible',
          right: 0,
          left: 0,
        }}
      >
        <Puller />
      </StyledBox>
      <Stack
        sx={{
          padding: { xs: '2rem 0.5rem', sm: '2rem 4.5rem' },
          mb: { xs: '6em', sm: '5em' },
        }}
      >
        <Typography variant="h5" m="0.5em 0em">
          Your Orders
        </Typography>

        {cartItems &&
          cartItems?.length > 0 &&
          cartItems.map((item, key) => {
            return <CartCard key={key} readOnly={true} cartItem={item} />;
          })}
        <Stack direction="row" justifyContent="space-between" m="0.5rem 0rem">
          <Typography variant="h5">This order will cost you </Typography>
          <Typography variant="h5">
            Rs. {appState?.appState.checkOutTotal}
          </Typography>
        </Stack>

        <When condition={!!appState?.appState.isLoggedIn}>
          <Stack
            direction="column"
            rowGap={2}
            sx={{
              width: '100%',
            }}
          >
            <RadioGroup
              onChange={(e) => {
                setSelectedDelivery(parseInt(e.target.value));
              }}
            >
              {deliveryAddress.map((address, index) => {
                return (
                  <Stack
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    key={index}
                  >
                    <FormControlLabel
                      key={index}
                      control={<Radio sx={{
                        '&, &.Mui-checked': {
                          color: 'black',
                        },
                      }} />}
                      value={index}
                      label={address.detailAddress}
                    />
                    {index != 0 ? (
                      <Box
                        onClick={() =>
                          handleDeleteAddress(deliveryAddress[index])
                        }
                      >
                        <CancelOutlined color={'error'} />
                      </Box>
                    ) : null}
                  </Stack>
                );
              })}
            </RadioGroup>
            <Stack mb="2.5em">
              <Accordion sx={{ width: '350px' }}>
                <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                  <Typography>Add Address</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack
                    gap={'10px'}
                    direction={
                      useMediaQuery(theme.breakpoints.down('sm'))
                        ? 'column'
                        : 'row'
                    }
                  >
                    <BasicInput
                      value={addedAdress.detailAddress}
                      label="Delivery Address"
                      variant="outlined"
                      type="text"
                      getText={(data) => {
                        setAddedAddress((prev) => ({
                          ...prev,
                          detailAddress: data,
                        }));
                      }}
                    />
                    <BuyButton2
                      onClick={() => {
                        for (var key in addedAdress) {
                          // @ts-ignore
                          var value = addedAdress[key];
                          if (value == '') {
                            toast.error('Please fill ' + key + ' field.');
                          }
                        }

                        handleAddAddress(addedAdress);
                      }}
                    >
                      Add
                    </BuyButton2>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </Stack>
          <BuyButton onClick={handleOrderAfterSignin}>
            <Typography variant="body1">Order Now</Typography>
          </BuyButton>
        </When>

        <When condition={!appState?.appState.isLoggedIn}>
          <RadioGroup
            row
            aria-labelledby="order-without-login-radio-button"
            name="order-without-login-radio-button-group"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSelectedProcess(
                (event.target as HTMLInputElement).value as string as
                | 'login'
                | 'signup',
              );
            }}
            value={selectedProcess}
          >
            <FormControlLabel
              value="login"
              control={<StyledRadio />}
              label="Login"
            />
            <FormControlLabel
              value="signup"
              control={<StyledRadio />}
              label="Sign Up"
            />
          </RadioGroup>

          <When condition={selectedProcess === 'signup'}>
            <Stack direction="column" rowGap={1.5} m="0.5rem 0rem">
              <BasicInput
                value={payload.fullName}
                label="Full Name"
                variant="outlined"
                type="text"
                getText={(data) => {
                  setPayload((prev) => ({ ...prev, fullName: data }));
                }}
              />

              <BasicInput
                value={payload.phone}
                label="Phone"
                variant="outlined"
                type="text"
                getText={(data) => {
                  setPayload((prev) => ({ ...prev, phone: data }));
                }}
              />

              <BasicInput
                value={payload.password}
                label="Password"
                variant="outlined"
                type="password"
                getText={(password) => {
                  setPayload((prev) => ({ ...prev, password: password }));
                }}
              />

              <BasicInput
                value={payload.address}
                label="Delivery Address"
                variant="outlined"
                type="text"
                getText={(data) => {
                  setPayload((prev) => ({ ...prev, address: data }));
                }}
              />
              <BuyButton onClick={signupAndOrder}>
                <Typography variant="body1">Sign Up and Order</Typography>
              </BuyButton>
            </Stack>
          </When>

          <When condition={selectedProcess === 'login'}>
            <Stack direction="column" rowGap={1.5} m="0.5rem 0rem">
              <BasicInput
                value={payload.phone}
                label="Phone/Email"
                variant="outlined"
                type="text"
                getText={(data) => {
                  setPayload((prev) => ({ ...prev, phone: data }));
                }}
              />

              <BasicInput
                value={payload.password}
                label="Password"
                variant="outlined"
                type="password"
                getText={(password) => {
                  setPayload((prev) => ({ ...prev, password: password }));
                }}
              />

              <BasicInput
                value={payload.address}
                label="Delivery Address"
                variant="outlined"
                type="text"
                getText={(data) => {
                  setPayload((prev) => ({ ...prev, address: data }));
                }}
              />
            </Stack>
            <BuyButton onClick={signinAndOrder}>
              <Typography variant="body1">Login and Order</Typography>
            </BuyButton>
          </When>
        </When>
      </Stack>
      <When condition={loading}>
        <LoaderComponent />
      </When>
    </SwipeableDrawer>
  );
};

const StyledRadio = styled(Radio)({
  color: '#000',
  '&.Mui-checked': { color: '#000' },
});

const StyledBox = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
}));

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.color.gray.primary,
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));
