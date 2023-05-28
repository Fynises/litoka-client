import { configureStore } from '@reduxjs/toolkit';
import authReducer from './models/auth';
import shoutoutConfigReducer from './models/shoutout-config';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shoutoutConfig: shoutoutConfigReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
