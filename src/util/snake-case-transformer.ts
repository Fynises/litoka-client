/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';

function filter(key: string): string {
  if (!key.includes('.')) return key;
  const tokens = _.split(key, '.').map(s => _.snakeCase(s));
  return tokens.join('.');
}

export const snakeize = (obj: any) => _.transform(obj, (result: any, value: unknown, key: string, target) => {
  const camelKey = _.isArray(target) ? key : filter(key);
  result[camelKey] = _.isObject(value) ? snakeize(value as any) : value;
});
