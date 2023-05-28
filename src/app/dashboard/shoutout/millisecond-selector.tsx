'use client';
import * as React from 'react';
import { setConfigField } from '@/redux-store/models/shoutout-config';
import { RootState, useAppDispatch } from '@/redux-store/store';
import { Box, TextField, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import _ from 'lodash';

type MillisecondSelectorProps = {
  id: string;
  label: string;
};

export default function MillisecondSelector(props: MillisecondSelectorProps) {
  const selector = useSelector((state: RootState) => state.shoutoutConfig);
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value: number = parseInt(e.target.value);
    if (Number.isNaN(value)) {
      console.log(`${e.target.value} is not a number`);
      value = 0;
    }
    if (value < 0) {
      value = 0;
    }
    dispatch(setConfigField({ key: props.id, value: value }));
  };

  return (
    <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', margin: 1 }}>
      <TextField sx={{ width: 96 }}
        size='small'
        type='number'
        label='milliseconds'
        value={_.get(selector.data, props.id, 0)}
        onChange={e => handleChange(e)}
      />
      <Typography sx={{ marginLeft: 2 }}>
        {`${props.label} (${_.get(selector.data, props.id, 0) / 1000} seconds)`}
      </Typography>
    </Box>
  );
}