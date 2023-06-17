export function getIdFromUrl(params: URLSearchParams): string {
  const id = params.get('id');
  if (id !== null) {
    return id;
  } else {
    throw 'id not found in url params';
  }
}
