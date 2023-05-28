'use client';
import * as React from 'react';
import { RootState } from '@/redux-store/store';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux-store/store';
import { setConfigField } from '@/redux-store/models/shoutout-config';

export function ShoutoutModeSelector() {
  const selector = useSelector((state: RootState) => state.shoutoutConfig);
  const dispatch = useAppDispatch();

  const handleChangeMode = (_e: React.MouseEvent<HTMLElement, MouseEvent>, val: string) => {
    const path = 'settings.shoutoutMode';
    dispatch(setConfigField({ key: path, value: val }));
  };

  return (
    <Box sx={{ margin: 1, display: 'flex', direction: 'row', alignItems: 'center' }}>
      <Box>
        <ToggleButtonGroup
          size='small'
          color='primary'
          value={selector.data?.settings.shoutoutMode}
          exclusive
          onChange={handleChangeMode}
        >
          <ToggleButton value='clip'>Clip</ToggleButton>
          <ToggleButton value='name_only'>Name Only</ToggleButton>
          <ToggleButton value='message_only'>Message Only</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box>
        <Typography sx={{ marginLeft: 2 }}>
          Select Mode
        </Typography>
      </Box>
    </Box>
  );
}
