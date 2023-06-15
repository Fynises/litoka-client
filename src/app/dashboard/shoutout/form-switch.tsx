'use client';
import * as React from 'react';
import { RootState, useAppDispatch } from '@/redux-store/store';
import { Box, FormControlLabel, Switch } from '@mui/material';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { setConfigField } from '@/redux-store/models/shoutout-config';

type FormSwitchProps = {
  id: string;
  children?: React.ReactNode,
};

export default function FormSwitch(props: FormSwitchProps) {

  const selector = useSelector((state: RootState) => state.shoutoutConfig);
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    dispatch(setConfigField({ key: props.id, value: checked }));
  };

  return (
    <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', marginLeft: 2 }}>
      <FormControlLabel label={undefined}
        control={<Switch id={props.id}
          checked={_.get(selector.data, props.id)}
          onChange={(e) => handleChange(e)} />}
      />
      <Box>{props.children}</Box>
    </Box>
  );
}
