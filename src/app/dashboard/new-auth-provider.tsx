'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Dispatch } from '@/redux-store/store';
import { useDispatch } from 'react-redux';

type AuthProviderProps = {
  children: React.ReactNode;
};

export default function NewAuthProvider({ children }: AuthProviderProps) {

  const dispatch = useDispatch<Dispatch>();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    dispatch.auth.validate(null).then(() => {
      console.log(`sucessfully validated`);
      setLoading(false);
    }).catch(e => {
      console.log(`error validating: ${e}`);
      localStorage.removeItem('session_token');
      window.location.href = '/';
    });
  }, [dispatch.auth]);

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
