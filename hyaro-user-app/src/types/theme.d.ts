import { TypographyVariant, TypographyVariantsOptions } from '@mui/material';
import React from 'react';

export declare module '@mui/material/styles' {
  interface Theme {
    color: {
      black: {
        primary: string;
        secondary: string;
      };
      red: {
        primary: string;
        secondary: string;
      };
      blue: {
        primary: string;
      };
      gray: {
        primary: string;
      };
    };
  }

  interface ThemeOptions {
    color: {
      black: {
        primary: React.CSSProperties['color'];
        secondary: React.CSSProperties['color'];
      };
      red: {
        primary: React.CSSProperties['color'];
        secondary: React.CSSProperties['color'];
      };
      blue: {
        primary: React.CSSProperties['color'];
      };
      gray: {
        primary: React.CSSProperties['color'];
      };
    };
  }
}
