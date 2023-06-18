'use client';
import * as React from 'react';
import { ShoutoutWrapper } from './shoutout-queue';
import { Box, Typography, alpha } from '@mui/material';
import Image from 'next/image';

interface NameProps {
  so: ShoutoutWrapper
  signalShift: () => void,
}

export default function NamePlayer(props: NameProps) {
  console.log('name shoutout mounted');
  setTimeout(() => props.signalShift(), props.so.shoutout.duration);
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      position: 'absolute',
      top: '40%',
      width: '100%',
      backgroundColor: alpha('#505050', 0.8),
      backdropFilter: 'blur(10px)',
      borderRadius: 24
    }}>
      <Typography color='white' fontSize={64} sx={{
        WebkitTextStroke: 3,
        WebkitTextStrokeColor: 'black',
        fontWeight: 'bold'
      }}>
        Check out {props.so.shoutout.channelName}
      </Typography>
      <Image src={props.so.shoutout.channelProfile}
        width={128}
        height={128}
        style={{ marginTop: 4, marginBottom: 4 }}
        alt=''
      />
    </Box>
  );
}
