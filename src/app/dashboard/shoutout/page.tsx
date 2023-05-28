'use client';
import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { RootState, useAppDispatch } from '@/redux-store/store';
import { useSelector } from 'react-redux';
import { ShoutoutConfigBody } from './body';
import api from '@/util/authenticated-api-client';
import { JsonShoutoutConfig } from './api-shoutout-config';
import { loadConfig } from '@/redux-store/models/shoutout-config';

async function getConfig(): Promise<JsonShoutoutConfig> {
  return (await api.get('/api/shoutout-config/get-config')).data;
}

export default function ShoutoutConfigEntry() {

  const selector = useSelector((state: RootState) => state.shoutoutConfig);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(selector.data === null);

  const onFail = (e: unknown): void => {
    console.log(`error initialising shoutout config: ${e}`);
    window.location.href = '/';
  };

  const initializeConfig = useCallback((): void => {
    getConfig().then(res => {
      dispatch(loadConfig(res));
      setLoading(false);
    }).catch(e => onFail(e));
  }, [dispatch]);

  useEffect(() => {
    if (loading) initializeConfig();
  }, [initializeConfig, loading]);

  if (loading) {
    return (<>loading</>);
  } else {
    return (
      <>
        <ShoutoutConfigBody />
      </>
    );
  }

}
