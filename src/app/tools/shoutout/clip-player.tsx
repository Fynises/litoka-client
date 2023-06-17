'use client';
import * as React from 'react';
import { useEffect } from 'react';
import { ShoutoutWrapper } from './shoutout-queue';
import { Box, Typography, alpha } from '@mui/material';

interface ClipPlayerProps {
  so: ShoutoutWrapper,
  signalShift: () => void,
}

export default function ClipPlayer(props: ClipPlayerProps) {
  console.log('loaded ClipShoutoutPlayer');
  const clipDuration = props.so.shoutout.getClipDuration();
  console.log(`clip duration: ${clipDuration}`);
  const clipTimeout = setTimeout(() => props.signalShift(), clipDuration);

  useEffect(() => {
    return () => clearTimeout(clipTimeout);
  }, [clipTimeout]);

  let source = `${props.so.shoutout.clipDetails?.embedUrl}&parent=${process.env.NEXT_PUBLIC_CLIP_EMBED_PARENT}&autoplay=true`;
  if (props.so.shoutout.clipDetails?.muted) {
    source += '&muted=true';
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: alpha('#505050', 0.3),
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingY: 1
      }}>
        <Typography color='white' fontSize={72} sx={{
          WebkitTextStroke: 3,
          WebkitTextStrokeColor: 'black',
          fontWeight: 'bold'
        }}>
          Check out {props.so.shoutout.channelName}
        </Typography>
        <img src={props.so.shoutout.channelProfile} width={128} height={128} />
      </Box>
      <Box>
        <iframe
          style={{ border: '0px' }}
          src={source}
          width='1280'
          height='720'
        >
        </iframe>
      </Box>
    </Box>
  );
}
