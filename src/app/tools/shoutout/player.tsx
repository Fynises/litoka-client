import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import WebSocket from 'isomorphic-ws';
import { ShoutoutObject, ShoutoutWrapper } from './shoutout-types';
import { Box, Fade, Typography, alpha } from '@mui/material';

interface PlayerProps {
  wsUrl: string,
}

class ShoutoutQueue {
  wrappers: ShoutoutWrapper[];

  constructor() {
    this.wrappers = [];
  }

  add(shoutout: ShoutoutWrapper): void {
    this.wrappers.push(shoutout);
  }

  popFront(): ShoutoutWrapper | undefined {
    console.log('pop front');
    return this.wrappers.shift();
  }

  getFront(): ShoutoutWrapper | undefined {
    if (this.wrappers.length > 0) {
      return this.wrappers[0];
    } else {
      return undefined;
    }
  }

  isEmpty(): boolean {
    return this.wrappers.length === 0;
  }

}

export default function Player(props: PlayerProps) {

  //const [shoutoutObjects, setShoutoutObjects] = useState<ShoutoutWrapper[]>([]);
  const shoutoutObjects = useRef(new ShoutoutQueue());
  const [currentSo, setCurrentSo] = useState<ShoutoutWrapper | null>(null);

  const addFromNew = useCallback((shoutout: ShoutoutWrapper) => {
    if (currentSo !== null) {
      shoutoutObjects.current.add(shoutout);
    } else {
      setCurrentSo(shoutout);
    }
  }, [currentSo]);

  useEffect(() => {
    const websocket = new WebSocket(props.wsUrl);
    websocket.onmessage = (data: WebSocket.MessageEvent) => {
      try {
        const shoutout = ShoutoutObject.makeObjectWithId(data.data.toString());
        console.log(`recieved data from websocket connection: ${data.data.toString()}`);
        addFromNew(shoutout);
      } catch (e) {
        console.log('error occurred after recieving websocket');
      }
    };
    return () => {
      websocket.close();
    };
  }, [addFromNew, props.wsUrl]);

  const shiftNext = () => {
    console.log('shiftnext called');
    if (shoutoutObjects.current.isEmpty()) {
      setCurrentSo(null);
    } else {
      const newShoutoutObject = shoutoutObjects.current.popFront();
      if (newShoutoutObject !== undefined) {
        setCurrentSo(newShoutoutObject);
      } else {
        throw 'err';
      }
    }
  };

  if (currentSo !== null) {
    if (currentSo.shoutout.clipDetails !== null) {
      return (<><ClipShoutoutPlayer so={currentSo} signalShift={() => shiftNext()} /></>);
    } else {
      return (<><NameShoutoutPlayer so={currentSo} signalShift={() => shiftNext()} /></>);
    }
  } else {
    console.log('no clips');
    return (<></>);
  }
}

interface ShoutoutProps {
  so: ShoutoutWrapper
  signalShift: () => void,
}

function ClipShoutoutPlayer(props: ShoutoutProps) {
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

function NameShoutoutPlayer(props: ShoutoutProps) {
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
      <img src={props.so.shoutout.channelProfile} width={128} height={128} style={{ marginTop: 4, marginBottom: 4 }} />
    </Box>
  );
}

interface FixedFadeProps {
  children?: React.ReactNode,
  enter: number,
  exit: number,
  duration: number,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FixedFade(props: FixedFadeProps) {
  const [fade, setFade] = useState<boolean>(true);
  setTimeout(() => setFade(false), props.duration);
  return (
    <Box>
      <Fade in={fade} timeout={{ enter: props.enter, exit: props.exit }} unmountOnExit>
        <Box>{props.children}</Box>
      </Fade>
    </Box>
  );
}
