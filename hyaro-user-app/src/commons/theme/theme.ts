import { createTheme } from '@mui/material';

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 940,
      lg: 1200,
      xl: 1940,
    },
  },
  color: {
    black: {
      primary: '#222223',
      secondary: '#312F35',
    },
    red: {
      primary: '#FF3E49',
      secondary: '#ffd8db',
    },
    blue: {
      primary: '#ebf1f8',
    },
    gray: {
      primary: '#95939A',
    },
  },
  typography: {
    fontFamily: 'Manrope',
    h2: {
      fontFamily: 'Manrope',
      fontWeight: 600,
      fontSize: '56px',
      '@media (max-width:940px)': {
        fontSize: '30px',
      },
    },
    h3: {
      fontFamily: 'Manrope',
      fontWeight: 500,
      fontSize: '22px',
    },
    h4: {
      fontFamily: 'Manrope',
      fontWeight: 700,
      fontSize: '15px',
      letterSpacing: '4px',
      '@media (max-width:600px)': {
        fontSize: '13px',
        letterSpacing: '2px',
      },
    },
    h5: {
      fontFamily: 'Manrope',
      fontWeight: 700,
      fontSize: '22px',
      '@media (max-width:940px)': {
        fontSize: '18px',
      },
    },
    subtitle1: {
      fontFamily: 'Manrope',
      fontWeight: 500,
      fontSize: '12px',
    },

    subtitle2: {
      fontFamily: 'Manrope',
      fontWeight: 400,
      fontSize: '12px',
      textTransform: 'uppercase',
    },

    body1: {
      fontFamily: 'Manrope',
      fontWeight: 500,
      fontSize: '14px',
    },

    body2: {
      fontFamily: 'Manrope',
      fontWeight: 500,
      fontSize: '18px',
    },
  },
});
