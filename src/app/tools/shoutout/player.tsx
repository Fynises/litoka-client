'use client';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import WebSocket from 'isomorphic-ws';
import { ShoutoutQueue, ShoutoutWrapper } from './shoutout-queue';
import ClipPlayer from './clip-player';
import NamePlayer from './name-player';
import { ShoutoutObject } from './shoutout-object';

interface PlayerProps {
  id: string,
}

const websocketUrlBase = process.env.NEXT_PUBLIC_SHOUTOUT_WS_URL;

export default function Player(props: PlayerProps) {

  const websocketUrl = `${websocketUrlBase}?id=${props.id}`;

  const shoutoutObjects = useRef(new ShoutoutQueue());
  const websocketClient = useRef<WebSocket | null>(null);
  const [currentSo, setCurrentSo] = useState<ShoutoutWrapper | null>(null);

  const addFromNew = useCallback((shoutout: ShoutoutWrapper) => {
    if (currentSo !== null) {
      shoutoutObjects.current.add(shoutout);
    } else {
      setCurrentSo(shoutout);
    }
  }, [currentSo]);

  useEffect(() => {
    console.log('making new websocket connection');
    websocketClient.current = new WebSocket(websocketUrl);
    return () => {
      websocketClient.current.close();
    };
  }, [websocketUrl]);

  useEffect(() => {
    websocketClient.current.onmessage = (data: WebSocket.MessageEvent) => {
      try {
        const shoutout = ShoutoutObject.makeObjectWithId(data.data.toString());
        console.log(`received data from websocket connection: ${data.data.toString()}`);
        addFromNew(shoutout);
      } catch (e) {
        console.log('error occurred after receiving websocket');
      }
    };
  }, [addFromNew, props.id]);

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
      return (<><ClipPlayer so={currentSo} signalShift={() => shiftNext()} /></>);
    } else {
      return (<><NamePlayer so={currentSo} signalShift={() => shiftNext()} /></>);
    }
  } else {
    console.log('no clips');
    return (<></>);
  }
}
