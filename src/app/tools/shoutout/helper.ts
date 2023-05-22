type WsParams = {
  connectionType: string,
  id: string,
}

export function validateParams(params: URLSearchParams): WsParams {
  if (params.has('connectionType') && params.has('id')) {
    return {
      connectionType: params.get('connectionType'),
      id: params.get('id'),
    } as WsParams;
  }
  throw 'param error';
}
