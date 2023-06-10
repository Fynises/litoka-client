'use client';
import * as React from 'react';
import { Button, Tooltip } from '@mui/material';
import { useSnackbar } from 'notistack';
import api from '@/util/authenticated-api-client';

async function sendForceJoin(): Promise<void> {
  await api.post('/api/chat-bot/force-join');
}

export default function ForceJoinButton() {

  const { enqueueSnackbar } = useSnackbar();

  const handleForceJoin = () => {
    sendForceJoin()
      .then(() => enqueueSnackbar('successfully joined channel', { variant: 'success' }))
      .catch(e => {
        console.log(`error sending force join request: ${e}`);
        enqueueSnackbar('error sending force join request', { variant: 'error' });
      });
  };

  return (
    <>
      <Tooltip title='request bot to join your channel'>
        <Button sx={{ borderRadius: 4, marginRight: 2 }}
          variant='contained'
          disableElevation={true}
          size='small'
          onClick={handleForceJoin}
        >
          join channel
        </Button>
      </Tooltip>
    </>
  );

}
