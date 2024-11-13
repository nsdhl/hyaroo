'use client';

import { TextField, TextFieldVariants } from '@mui/material';
import { FC } from 'react';

interface IBasicInput {
  label: string;
  variant: TextFieldVariants;
  type: string;
  getText: (text: string) => void;
  size?: 'small' | 'medium';
  autofocus?: boolean;
  value?: string;
}

const BasicInput: FC<IBasicInput> = ({
  size,
  label,
  variant,
  getText,
  type,
  autofocus,
  value,
}) => {
  return (
    <TextField
      type={type}
      id={label}
      label={label}
      variant={variant}
      sx={{
        width: '100%',
        fontSize: '8px',
        '& label.Mui-focused': {
          color: (theme) => theme.color.black.secondary,
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: (theme) => theme.color.black.secondary,
        },
        '& .MuiFilledInput-underline:after': {
          borderBottomColor: (theme) => theme.color.black.secondary,
        },
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: (theme) => theme.color.black.secondary,
          },
        },
      }}
      onChange={(e) => getText(e.target.value)}
      size={size ? size : 'medium'}
      InputLabelProps={{
        sx: {
          fontSize: '12px',
        },
      }}
      autoComplete="off"
      autoFocus={autofocus ? autofocus : false}
      value={value && value}
    />
  );
};

export default BasicInput;
