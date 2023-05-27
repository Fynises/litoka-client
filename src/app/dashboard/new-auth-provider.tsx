'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import api from '@/util/authenticated-api-client';
import { ValidationResponse, validationComplete } from '@/redux-store/models/auth';
import { useAppDispatch } from '@/redux-store/store';
import LocalStorageUtil from '@/auth-util/local-storage-util';

type AuthProviderProps = {
  children: React.ReactNode;
};

async function validate(): Promise<ValidationResponse> {
  const res = await api.get<ValidationResponse>('/auth/validate-login');
  return res.data;
}

export default function NewAuthProvider({ children }: AuthProviderProps) {

  const [loading, setLoading] = useState<boolean>(true);

  const dispatch = useAppDispatch();

  const onFail = (e: unknown) => {
    console.log(`error validating: ${e}`);
    LocalStorageUtil.remove('session_token');
    window.location.href = '/';
  };

  useEffect(() => {
    if (localStorage.getItem('session_token') !== null) {
      validate().then(res => {
        console.log(`sucessfully validated`);
        dispatch(validationComplete(res));
        setLoading(false);
      }).catch(e => onFail(e));
    } else {
      onFail('session token not found');
    }
  }, [dispatch]);

  if (loading) {
    return (<>loading</>);
  } else {
    return (
      <>
        {children}
      </>
    );
  }
}
