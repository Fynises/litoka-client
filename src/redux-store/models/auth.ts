import LocalStorageUtil from '@/auth-util/local-storage-util';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ValidationResponse = {
  userName: string;
  profilePicture: string;
}

type AuthModel = {
  isAuthorized: boolean;
  sessionToken: string | null;
  userId: string | null;
  userName: string | null;
  profilePicture: string | null;
};

const initialState: AuthModel = {
  isAuthorized: false,
  sessionToken: LocalStorageUtil.getOrNull('jwt'),
  userId: null,
  userName: null,
  profilePicture: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    validationComplete(state, action: PayloadAction<ValidationResponse>) {
      state.userName = action.payload.userName;
      state.profilePicture = action.payload.profilePicture;
    }
  },
});

export const { validationComplete } = authSlice.actions;

export default authSlice.reducer;
