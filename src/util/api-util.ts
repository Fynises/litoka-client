import LocalStorageUtil from '@/auth-util/local-storage-util';

type AuthHeader = {
  Authorization: string,
};

type ApiHeaders = {
  headers: AuthHeader,
};

export function getHeader(): ApiHeaders {
  return {
    headers: {
      Authorization: `Bearer ${LocalStorageUtil.get('jwt')}`
    }
  };
}
