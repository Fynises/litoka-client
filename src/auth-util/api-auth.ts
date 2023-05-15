import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import AuthJson from './auth-json';

interface ApiAuthParams {
  client_id: string,
  redirect_uri: string,
  scope: string,
}

export async function getAuthUri() {
  const twitchAuthBaseUrl = 'https://id.twitch.tv/oauth2/authorize?';
  const apiAuthParams = await fetchAuthParams();
  if (apiAuthParams !== null) {
    const params = new URLSearchParams({
      client_id: apiAuthParams.client_id,
      redirect_uri: apiAuthParams.redirect_uri,
      response_type: 'code',
      scope: apiAuthParams.scope,
      state: uuidv4(),
    }).toString();
    return twitchAuthBaseUrl + params;
  } else {
    throw 'err';
  }
}

async function fetchAuthParams() {
  return axios.get<ApiAuthParams>('/api/get-auth-params').then(res => {
    return res.data;
  }).catch(err => {
    if (axios.isAxiosError(err)) {
      console.log(err.status);
    }
    return null;
  });
}

export interface LoginResponse {
  session_token: string,
  user_id: string,
}

export async function handleTwitchCallback(params: URLSearchParams) {
  if (params.has('code')) {
    const successJson = new AuthJson(params).getSuccessJson();
    return axios.post<LoginResponse>('/auth/login', successJson).then(res => {
      return res.data;
    }).catch(err => {
      throw err;
    });
  } else {
    throw 'error';
  }
}
