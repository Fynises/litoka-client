import api from '@/util/api-client';

interface ShoutoutWsDetailResponse {
  wsUrl: string,
  embedParent: string,
}

export async function fetchWsUrl(): Promise<ShoutoutWsDetailResponse> {
  return api.get<ShoutoutWsDetailResponse>('/api/getwebsocket').then(res => {
    return res.data;
  }).catch(err => {
    throw err;
  });
}
