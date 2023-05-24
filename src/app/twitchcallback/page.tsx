'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Button, Card, CardHeader, Typography } from '@mui/material';
import { ScaleLoader } from 'react-spinners';
import authHelper from '@/auth-util/auth-helper';
import { useRouter } from 'next/navigation';

export default function AuthPage() {

  const router = useRouter();

  const [authHasFailed, setAuthHasFailed] = useState<boolean>(false);

  useEffect(() => {
    const searchParams: URLSearchParams = new URLSearchParams(document.location.search);
    authHelper.handleTwitchCallback(searchParams).then(() => {
      router.push('/dashboard/home');
    }).catch(() => {
      setAuthHasFailed(true);
    });
  }, [router]);

  if (!authHasFailed) {
    return (
      <Box sx={{ marginTop: 4 }}>
        <Card sx={{ maxWidth: 200, margin: 'auto' }}>
          <CardHeader
            title='Authenticating'
          />
          <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
            <ScaleLoader
              cssOverride={{ display: 'block', margin: 'auto' }}
            />
          </Box>
        </Card>
      </Box>
    );
  } else {
    return (
      <Card variant='outlined' elevation={0} sx={{ marginTop: 4, display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ marginTop: 2 }}>
          authentication has failed. internal server error
        </Typography>
        <Button onClick={() => router.push('/')} sx={{ marginY: 2 }}>
          return to home
        </Button>
      </Card>
    );
  }

}
