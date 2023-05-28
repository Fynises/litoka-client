import api from '@/util/authenticated-api-client';
import { JsonShoutoutConfig } from './api-shoutout-config';
import { ShoutoutValueType } from '@/redux-store/models/shoutout-config';

export async function sendUpdateConfig(body: JsonShoutoutConfig): Promise<void> {
  await api.post('/api/shoutout-config/update-config', body);
}

type BasicMap = {
  [key: string]: ShoutoutValueType;
}

export type UpdateRequestBody = {
  changes: BasicMap;
};

export async function sendUpdateConfigV2(body: UpdateRequestBody): Promise<void> {
  await api.patch('/api/shoutout-config/update-config/v2', body);
}

interface ConfigIdUpdateResponse {
  configId: string,
}

export async function getNewShoutoutId(): Promise<string> {
  const res = await api.patch<ConfigIdUpdateResponse>('/api/shoutout-config/update-id');
  return res.data.configId;
}