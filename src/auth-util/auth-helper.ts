import api from '@/util/api-client';
import AuthJson from './auth-json';
import { v4 as uuidv4 } from 'uuid';
import LocalStorageUtil from './local-storage-util';
import { getHeader } from '@/util/api-util';

interface ApiSessionValidation {
  isAuthorized: boolean,
  userId: string,
  userName: string,
  profilePictureUri: string,
}

interface UserDetailResponse {
  userName: string,
  profilePictureUri: string,
}

class AuthHelper {

  isAuthorized: boolean;

  constructor() {
    this.isAuthorized = false;
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout', null, getHeader());
  }

  async validate(): Promise<void> { // return number as if it were a response code
    try {
      await api.get<ApiSessionValidation>('/auth/validate', getHeader());
      this.getUserDetails;
    } catch (e) {
      LocalStorageUtil.clear();
    }
  }

  private async getUserDetails(): Promise<void> {
    const res = await api.get<UserDetailResponse>('/auth/get-user-details', getHeader());
    LocalStorageUtil.set('user_name' ,res.data.userName);
    LocalStorageUtil.set('profile_picture_uri', res.data.profilePictureUri);
  }

  getAuthUri(): string {
    const twitchAuthBaseUrl = 'https://id.twitch.tv/oauth2/authorize?';
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      redirect_uri: process.env.NEXT_PUBLIC_TWITCH_AUTH_REDIRECT,
      response_type: 'code',
      scope: process.env.NEXT_PUBLIC_TWITCH_AUTH_SCOPE,
      state: uuidv4(),
    }).toString();
    return twitchAuthBaseUrl + params;
  }

  async handleTwitchCallback(params: URLSearchParams): Promise<void> {
    if (params.has('code')) {
      const successJson = new AuthJson(params).getSuccessJson();
      const res = await api.post<string>('/auth/login', successJson);
      LocalStorageUtil.set('jwt', res.data);
    } else {
      throw 'code not found';
    }
  }

}

const apiHelper = new AuthHelper();

export default apiHelper;
