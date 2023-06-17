'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { getIdFromUrl } from './util';
import Player from './player';

export default function Shoutout() {

  const [id, setId] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const id = getIdFromUrl(new URLSearchParams(document.location.search));
      setId(id);
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
        <Player id={id} />
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
