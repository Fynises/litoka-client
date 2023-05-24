'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import authHelper from './auth-helper';
import { Box, Card } from '@mui/material';
import { ScaleLoader } from 'react-spinners';

type Props = {
  children?: React.ReactNode
};

export default function AuthProvider({ children }: Props) {

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    authHelper.validate()
      .then(() => setIsLoading(false))
      .catch(e => {
        console.log(`error occurred in auth provider: ${e}`);
        window.location.href = '/';
      });
  }, []);

  if (isLoading) {
    return (
      <>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Card variant='outlined' elevation={0}>
            <ScaleLoader
              cssOverride={{ display: 'block', margin: 'auto' }}
            />
          </Card>
        </Box>
      </>
    );
  } else {
    return (
      <>
        {children}
      </>
    );
  }

}
