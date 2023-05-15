import * as React from 'react';
import { ScaleLoader } from 'react-spinners';
import { Box, Card } from '@mui/material';

export default function BasicPageLoad() {
  return (
    <Box sx={{ margin: 'auto' }}>
      <Card variant='outlined' elevation={0}>
        <ScaleLoader
          cssOverride={{ display: 'block', margin: 'auto' }}
        />
      </Card>
    </Box>
  );
}
