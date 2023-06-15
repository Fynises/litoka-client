'use client';
import * as React from 'react';
import { RootState, useAppDispatch } from '@/redux-store/store';
import { Button, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { update } from '@/redux-store/models/chatbot-default-config';
import { useSnackbar } from 'notistack';
import ConfigUpdateHelper from './config-update-helper';

export default function SubmitUpdateButton() {
  const selector = useSelector((state: RootState) => state.defaultCommands);
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleUpdateButton = () => {
    new ConfigUpdateHelper(selector.changes).sendRequest()
      .then(() => {
        dispatch(update());
        enqueueSnackbar('successfully updated config', { variant: 'success' });
      })
      .catch(e => {
        console.log(`error sending update request: ${e}`);
        enqueueSnackbar('error updating config', { variant: 'error' });
      });
  };

  return (
    <>
      <Tooltip title='update configuration'>
        <Button sx={{ borderRadius: 4, marginRight: 2 }}
          variant='contained'
          disableElevation={true}
          size='small'
          onClick={handleUpdateButton}
        >
          update
        </Button>
      </Tooltip>
    </>
  );

}
