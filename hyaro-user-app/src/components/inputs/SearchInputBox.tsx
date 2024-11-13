'use client';

import { CancelOutlined, Search } from '@mui/icons-material';
import { InputAdornment, TextField, TextFieldVariants } from '@mui/material';
import { FC, KeyboardEvent } from 'react';

interface ISearchInput {
  label: string;
  variant: TextFieldVariants;
  getText: (text: string) => void;
  handleSearch: () => void;
  handleCancel: () => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const SearchInputBox: FC<ISearchInput> = ({
  handleKeyDown,
  label,
  variant,
  getText,
  handleSearch,
  handleCancel,
}) => {
  return (
    <TextField
      size="small"
      type={'search'}
      id="basic-input"
      label={label}
      variant={variant}
      sx={{
        width: '100%',
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
      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e)}
      autoFocus
      InputProps={{
        endAdornment: (
          <InputAdornment
            position="end"
            sx={{
              cursor: 'pointer',
            }}
          >
            <Search fontSize="small" onClick={() => handleSearch()} />
          </InputAdornment>
        ),
        startAdornment: (
          <InputAdornment
            position="start"
            sx={{
              cursor: 'pointer',
            }}
          >
            <CancelOutlined fontSize="small" onClick={() => handleCancel()} />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchInputBox;
