import axios from 'axios';
import { AxiosResponse, InternalAxiosRequestConfig, AxiosInstance } from 'axios';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

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
      newConfig.params = snakecaseKeys(config.params);
    }

    if (config.data) {
      newConfig.data = snakecaseKeys(config.data);
    }
    return newConfig;
  });
  return api;
}

const apiClient = buildClient();

export default apiClient;
