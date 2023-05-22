import axios from 'axios';
import { authHelper } from '@/auth-util/auth-provider';
import { immerable } from 'immer';
import api from '@/util/api-client';

interface JsonShoutoutConfig {
  userId: string,
  configId: string,
  settings: ShoutoutSettings,
  filterConfig: ShoutoutFilterConfig,
  overrideConfig: ShoutoutOverrideConfig,
}

interface ShoutoutSettings {
  enableAutoShoutout: boolean,
  enableChatResponse: boolean,
  shoutoutMode: string, // experimental
  defaultMute: boolean,
  useMaxClipDuration: boolean,
  maxClipDuration: number,
  clipEndDelay: number,
  nameDuration: number,
}

interface ShoutoutFilterConfig {
  filterType: string,
  topViewedRange: number,
}

/**
 * planned overrides:
 * top viewed: -t
 * recent: -r
 */

interface ShoutoutOverrideConfig {
  clip: boolean,             // -c
  clipMuted: boolean,        // -cm
  cliupUnmuted: boolean,     // -cu
  nameOnly: boolean,         // -n
  messageOnly: boolean,      // -m
  directClip: boolean,       // -d
}

interface ConfigIdUpdateResponse {
  configId: string,
}

interface ShoutoutUriBase {
  uri: string,
}

interface TestShoutoutRequest {
  tokens: string[],
}

const apiBase = '/api/shoutout-config/';

export default class ApiShoutoutConfig implements JsonShoutoutConfig {

  [immerable] = true;
  userId: string;
  configId: string;
  settings: ShoutoutSettings;
  filterConfig: ShoutoutFilterConfig;
  overrideConfig: ShoutoutOverrideConfig;

  constructor(data: JsonShoutoutConfig) {
    this.userId = data.userId;
    this.configId = data.configId;
    this.settings = data.settings;
    this.filterConfig = data.filterConfig;
    this.overrideConfig = data.overrideConfig;
  }

  static async getConfig(): Promise<ApiShoutoutConfig> {
    if (!authHelper.isAuthorized) throw 'not authorized';
    return api.get<ApiShoutoutConfig>(`${apiBase}get-config`, {
      headers: authHelper.getAuthHeader()
    }).then(res => {
      return res.data;
    }).catch(err => {
      if (axios.isAxiosError(err)) {
        throw err;
      }
      throw err;
    });
  }

  async sendUpdateConfig(): Promise<void> {
    if (!authHelper.isAuthorized) throw 'not authorized';
    return api.post(`${apiBase}update-config`, this, {
      headers: authHelper.getAuthHeader()
    }).then(() => {
      return;
    }).catch(err => {
      if (axios.isAxiosError(err)) {
        throw err;
      }
      throw err;
    });
  }

  async getNewShoutoutId(): Promise<this> {
    if (!authHelper.isAuthorized) throw 'not authorized';
    return api.patch<ConfigIdUpdateResponse>(`${apiBase}update-id`, null, {
      headers: authHelper.getAuthHeader(),
    }).then(res => {
      this.configId = res.data.configId;
      return this;
    }).catch(err => {
      if (axios.isAxiosError(err)) {
        throw err;
      }
      throw err;
    });
  }

  static async getShoutoutUriBase(): Promise<string> {
    return api.get<ShoutoutUriBase>(`${apiBase}get-base-uri`).then(res => {
      return res.data.uri;
    }).catch(err => {
      throw err;
    });
  }

  async sendTestShoutout(message: string): Promise<void> {
    console.log(message);
    console.log(message.split(' '));
    let messageTokens: string[] = ['!so'];
    messageTokens = messageTokens.concat(message.split(' '));
    const requestBody: TestShoutoutRequest = {
      tokens: messageTokens
    };
    console.log(messageTokens);
    return api.post(`${apiBase}test-shoutout`, requestBody, {
      headers: authHelper.getAuthHeader(),
    }).then(() => {
      return;
    }).catch(err => {
      throw err;
    });
  }

}
