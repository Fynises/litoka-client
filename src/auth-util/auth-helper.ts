import axios from 'axios';

interface ApiSessionValidation {
  is_authorized: boolean,
  user_id: string,
  user_name: string,
  profile_picture_uri: string,
}

interface UserDetailResponse {
  user_name: string,
  profile_picture_uri: string,
}

export type AuthHeader = {
  Authorization: string,
}

// localstorage keys
const sessionTokenKey = 'session_token';
const userNameKey = 'user_name';
const profilePictureUriKey = 'profile_picture_uri';

export default class AuthHelper {

  isAuthorized: boolean;
  userName?: string;
  profilePictureUri?: string;
  sessionToken: string | null;

  constructor() {
    this.isAuthorized = false;
    this.sessionToken = localStorage.getItem(sessionTokenKey);
    const userName = localStorage.getItem(userNameKey);
    this.userName = userName !== null ? userName : undefined;
    const profilePictureUri = localStorage.getItem(profilePictureUriKey);
    this.profilePictureUri = profilePictureUri !== null ? profilePictureUri : undefined;
  }

  async logout() {
    const token = localStorage.getItem(sessionTokenKey);
    if (token !== null) {
      console.log(`session token from logout function: ${token}`);
      axios.post('/auth/logout', null, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } else {
      localStorage.clear();
    }
  }

  async validate() { // return number as if it were a response code
    console.log(this.sessionToken);
    if (this.sessionToken !== null) {
      return axios.get<ApiSessionValidation>('/auth/validate', {
        headers: { 'Authorization': `Bearer ${this.sessionToken}` }
      }).then(res => {
        this.isAuthorized = true;
        this.getUserDetails().then(() => {
          return res;
        });
      }).catch(err => {
        localStorage.clear();
        throw err;
      });
    } else {
      localStorage.clear();
      throw null;
    }
  }

  async getUserDetails() {
    if (this.sessionToken === null) throw 'unauthorized';
    if (this.userName !== undefined || this.profilePictureUri !== undefined) return;
    return axios.get<UserDetailResponse>('/auth/get-user-details', {
      headers: this.getAuthHeader()
    }).then(res => {
      this.setDetails(res.data);
      return;
    }).catch(err => {
      throw err;
    });
  }

  private setDetails(data: UserDetailResponse) {
    localStorage.setItem(userNameKey, data.user_name);
    localStorage.setItem(profilePictureUriKey, data.profile_picture_uri);
    this.userName = data.user_name;
    this.profilePictureUri = data.profile_picture_uri;
  }

  getAuthHeader(): AuthHeader {
    let token: string;
    if (this.sessionToken !== null) {
      token = this.sessionToken;
    } else {
      token = 'err';
    }
    return { Authorization: `Bearer ${token}` };
  }

}
