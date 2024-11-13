'use client';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import {
  Category,
  Home,
  Person,
  ShoppingCart,
  Widgets,
} from '@mui/icons-material';
import { usePathname } from 'next/navigation';

interface INavigation {
  handleClick: (value: string) => void;
}

const Navigation: FC<INavigation> = ({ handleClick }) => {
  const pathname = usePathname();

  const [value, setValue] = useState('home');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    handleClick(newValue);
    setValue(newValue);
  };

  useEffect(() => {
    if (pathname === '/') {
      setValue('home');
    }
    if (pathname.includes('cart')) {
      setValue('cart');
    }
    if (pathname.includes('profile')) {
      setValue('profile');
    }
  }, [pathname]);

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '18px 0px',
        '&.MuiPaper-root': {
          zIndex: 9999,
        },
      }}
      elevation={3}
    >
      <BottomNavigation
        sx={{
          width: '100%',
          '& .MuiButtonBase-root': {
            minWidth: '30px',
          },
        }}
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Home"
          value="home"
          icon={<Home sx={{ color: (theme) => theme.color.black.primary }} />}
          sx={{
            '&.MuiButtonBase-root': {
              color: (theme) => theme.color.black.primary,
            },
          }}
          showLabel
        />
        <BottomNavigationAction
          label="Cart"
          value="cart"
          icon={
            <ShoppingCart
              sx={{ color: (theme) => theme.color.black.primary }}
            />
          }
          sx={{
            '&.MuiButtonBase-root': {
              color: (theme) => theme.color.black.primary,
            },
          }}
          showLabel
        />
        <BottomNavigationAction
          label="Profile"
          value="profile"
          icon={<Person sx={{ color: (theme) => theme.color.black.primary }} />}
          sx={{
            '&.MuiButtonBase-root': {
              color: (theme) => theme.color.black.primary,
            },
          }}
          showLabel
        />
        <BottomNavigationAction
          label="Menu"
          value="menu"
          icon={
            <Widgets sx={{ color: (theme) => theme.color.black.primary }} />
          }
          sx={{
            '&.MuiButtonBase-root': {
              color: (theme) => theme.color.black.primary,
            },
          }}
          showLabel
        />
      </BottomNavigation>
    </Paper>
  );
};

export default Navigation;
