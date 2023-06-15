import { immerable } from 'immer';
import api from '@/util/authenticated-api-client';

export interface JsonShoutoutConfig {
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
  clipUnmuted: boolean,      // -cu
  nameOnly: boolean,         // -n
  messageOnly: boolean,      // -m
  directClip: boolean,       // -d
}

interface ConfigIdUpdateResponse {
  configId: string,
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
    const res = await api.get<ApiShoutoutConfig>(`${apiBase}get-config`);
    return res.data;
  }

  async sendUpdateConfig(): Promise<void> {
    await api.post(`${apiBase}update-config`, this);
  }

  async getNewShoutoutId(): Promise<this> {
    const res = await api.patch<ConfigIdUpdateResponse>(`${apiBase}update-id`);
    this.configId = res.data.configId;
    return this;
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
    await api.post(`${apiBase}test-shoutout`, requestBody);
  }

}
