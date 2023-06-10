export default class AuthUrlParams {
  code: string;
  scope: string;
  state: string;

  constructor(params: URLSearchParams) {
    this.code = AuthUrlParams.getOrThrow(params, 'code');
    this.scope = AuthUrlParams.getOrThrow(params, 'scope');
    this.state = AuthUrlParams.getOrThrow(params, 'state');
  }

  private static getOrThrow(params: URLSearchParams, key: string): string {
    const value = params.get(key);
    if (value === null) throw 'value not found';
    return value;
  }

}