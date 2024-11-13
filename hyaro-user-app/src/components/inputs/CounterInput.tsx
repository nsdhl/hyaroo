'use client';

import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';

interface ICounterInput {
  getCounterValue: (v: number) => void;
  initValue: number;
}

const CounterInput: FC<ICounterInput> = ({ getCounterValue, initValue }) => {
  const [value, setValue] = useState(initValue);

  useEffect(() => {
    getCounterValue(value);
  }, [value]);

  return (
    <Stack direction="row" columnGap="20px" alignItems="center">
      <RemoveCircleOutline
        sx={{
          cursor: 'pointer',
        }}
        onClick={() => {
          if (value === 1) {
            setValue(1);
            return;
          }
          setValue((prev) => prev - 1);
        }}
      />
      <Typography
        variant="body2"
        sx={{
          width: '30px',
          textAlign: 'center',
        }}
      >
        {value}
      </Typography>
      <AddCircleOutline
        onClick={() => {
          setValue((prev) => prev + 1);
        }}
        sx={{
          cursor: 'pointer',
        }}
      />
    </Stack>
  );
};

export default CounterInput;
