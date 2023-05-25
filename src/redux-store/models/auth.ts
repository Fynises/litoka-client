import { createModel } from '@rematch/core';
import { RootModel } from '../root-model';
import api from '@/util/api-client';

type ValidationResponse = {
  userId: string;
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
  sessionToken: localStorage.getItem('session-token'),
  userId: null,
  userName: null,
  profilePicture: null
};

export const auth = createModel<RootModel>()({
  state: initialState,
  reducers: {
    validationComplete(state, res: ValidationResponse) {
      state.userId = res.userId;
      state.userName = res.userName;
      state.profilePicture = res.profilePicture;
    }
  },
  effects: (dispatch) => ({
    async validate(_payload: null, state): Promise<void> {
      if (state.auth.sessionToken === null) throw 'session-token empty, cannot validate';
      const res = await api.get<ValidationResponse>('/auth/validate-login', {
        headers: { Authorization: state.auth.sessionToken }
      });
      dispatch.auth.validationComplete(res.data);
    },
  }),
});
