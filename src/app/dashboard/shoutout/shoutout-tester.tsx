'use client';
import * as React from 'react';
import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import api from '@/util/authenticated-api-client';
import { useSnackbar } from 'notistack';

type TestShououtRequest = {
  tokens: string[]
};

async function sendTestShoutout(target: string): Promise<void> {
  let targetTokens: string[] = ['!so'];
  targetTokens = targetTokens.concat(target.split(''));
  const reqBody: TestShououtRequest = {
    tokens: targetTokens
  };
  await api.post(`/api/shoutout-config/test-shoutout`, reqBody);
}

export default function ShoutoutTester() {

  const [body, setBody] = useState<string>('');

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleSubmit = () => {
    sendTestShoutout(body)
      .then(() => enqueueSnackbar('Successfully sent test shoutout', { variant: 'success' }))
      .catch(() => enqueueSnackbar('Error sending test shoutout', { variant: 'error' }));
  };

  return (
    <Box sx={{ display: 'flex', direction: 'row', alignItems: 'center', margin: 1 }}>
      <TextField sx={{ width: 400 }}
        size='small'
        label='shoutout body'
        value={body}
        onChange={e => handleChange(e)}
      />
      <Button sx={{ borderRadius: 4, marginLeft: 2 }}
        variant='contained'
        disableElevation={true}
        size='small'
        onClick={handleSubmit}
      >
        send test shoutout
      </Button>
    </Box>
  );
}
