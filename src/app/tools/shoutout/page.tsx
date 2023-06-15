'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { validateParams } from './helper';
import Player from './player';

export default function Shoutout() {

  const [wsUrl, setWsUrl] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const searchParams: URLSearchParams = new URLSearchParams(document.location.search);
    try {
      const params = validateParams(searchParams);
      const queryString = new URLSearchParams(params).toString();
      setWsUrl(process.env.NEXT_PUBLIC_SHOUTOUT_URL + '?' + queryString);
      setLoading(false);
    } catch (e) {
      setIsError(true);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <>
        <p>loading</p>
      </>
    );
  }

  if (!isError) {
    return (
      <>
        <Player wsUrl={wsUrl} />
      </>
    );
  } else {
    return (
      <>
        <p>error</p>
      </>
    );
  }
}
