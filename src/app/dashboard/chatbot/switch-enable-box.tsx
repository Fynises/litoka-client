'use client';
import * as React from 'react';
import { RootState, useAppDispatch } from '@/redux-store/store';
import { Box, FormControlLabel, Switch, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { updateConfigField } from '@/redux-store/models/chatbot-default-config';

type Props = {
  prefix: string
};

export default function CommandEnableSwitch(props: Props) {

  const selector = useSelector((state: RootState) => state.defaultCommands);
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedState = e.target.checked;
    dispatch(updateConfigField({
      prefix: props.prefix,
      key: 'enabled',
      value: selectedState
    }));
  };

  return (
    <Box>
      <Tooltip title='toggle'>
        <FormControlLabel label={undefined}
          control={
            <Switch
              checked={selector.commands[props.prefix].enabled}
              onChange={(e) => handleChange(e)}
            />
          }
        />
      </Tooltip>
    </Box>
  );

}
