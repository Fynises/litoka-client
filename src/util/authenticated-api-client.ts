import LocalStorageUtil from '@/auth-util/local-storage-util';
import axios from 'axios';
import { AxiosResponse, InternalAxiosRequestConfig, AxiosInstance } from 'axios';
import camelcaseKeys from 'camelcase-keys';
import { snakeize } from './snake-case-transformer';

function buildClient(): AxiosInstance {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOST
  });

  api.interceptors.response.use((res: AxiosResponse) => {
    if (res.data && res.headers['content-type'] === 'application/json') {
      res.data = camelcaseKeys(res.data, { deep: true });
    }
    return res;
  });

  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const newConfig = { ...config };
    if (newConfig.headers !== undefined && newConfig.headers['Content-Type'] === 'multipart/form-data') {
      return newConfig;
    }

    if (config.params) {
      newConfig.params = snakeize(config.params);
    }

    if (config.data) {
      newConfig.data = snakeize(config.data);
    }
    return newConfig;
  });

  api.defaults.headers.common['Authorization'] = `Bearer ${LocalStorageUtil.getOrNull('jwt')}`;

  return api;
}

const authApi = buildClient();

export default authApi;
