import * as React from 'react';
import { useState, useEffect } from 'react';
import AuthHelper from './auth-helper';
import { Box, Card } from '@mui/material';
import { ScaleLoader } from 'react-spinners';

let authHelper: AuthHelper;

type Props = {
  children?: React.ReactNode
};

export function AuthProvider({ children }: Props) {

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    authHelper = new AuthHelper();
    authHelper.validate()
      .then(() => setIsLoading(false))
      .catch(() => window.location.href = '/');
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

export {
  authHelper,
};
