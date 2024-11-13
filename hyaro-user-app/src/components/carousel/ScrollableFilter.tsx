'use client';

import { Box, Stack, Typography } from '@mui/material';
import { FC, MutableRefObject, useEffect, useRef, useState } from 'react';
import { useDraggable } from 'react-use-draggable-scroll';
import When from '../hoc/When';
import { ArrowRight, EastRounded } from '@mui/icons-material';

interface IScrollableFilter<T> {
  filterValues: T[];
  getValues: (v: any[]) => void;
  displayField: string;
  value?: any[];
}

const ScrollableFilter: FC<IScrollableFilter<any>> = ({
  displayField,
  getValues,
  filterValues,
  value,
}) => {
  const ref = useRef<HTMLDivElement>() as MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(ref);

  const [values, setValues] = useState<any[]>(value || []);

  useEffect(() => {
    getValues(values);
  }, [values]);

  useEffect(() => {
    setValues(value || []);
  }, [value]);

  return (
    <Stack position="relative">
      <Stack
        direction="row"
        sx={{
          overflowX: 'scroll',
          columnGap: '1rem',
          overflowY: 'hidden',
          backgroundColor: '#fff',
          padding: '1.5em 0.7em',
          borderRadius: '12px',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
        {...events}
        ref={ref}
      >
        {filterValues.map((el, key) => {
          return (
            <Stack
              key={key}
              sx={{
                minWidth: 'fit-content',
                border: (theme) =>
                  values.includes(el)
                    ? `3px solid ${theme.color.red.secondary}`
                    : `3px solid ${theme.color.gray.primary}`,
                borderRadius: '12px',
                padding: '8px 16px',
                cursor: 'pointer',
                backgroundColor: (theme) =>
                  values.includes(el) ? theme.color.blue.primary : '',
              }}
              onClick={() => {
                setValues((prev) => {
                  if (prev.some((item) => item._id === el._id)) {
                    const filtered = prev.filter((p) => p._id !== el._id);
                    return [...filtered];
                  } else {
                    return [...prev, el];
                  }
                });
              }}
            >
              <Typography variant="h4">{el[displayField]}</Typography>
            </Stack>
          );
        })}
      </Stack>
      <When condition={values.length > 0}>
        <Stack
          direction="row"
          columnGap="5px"
          sx={{
            padding: '0em 0.7em',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="subtitle1">Searching for:</Typography>
          {values.map((el, key) => {
            return (
              <Typography key={key} variant="subtitle1">
                {el[displayField]}
                {key === values.length - 1 ? '' : ','}
              </Typography>
            );
          })}
        </Stack>
      </When>
      <Stack position="absolute" right={10}>
        <EastRounded />
      </Stack>
    </Stack>
  );
};

export default ScrollableFilter;
