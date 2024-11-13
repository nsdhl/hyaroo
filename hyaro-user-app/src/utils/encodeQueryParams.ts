export function generateQueryString(key: string, arr: string[]) {
  const queryString = arr.map((itemId) => `${key}=${itemId}`).join('&');
  return queryString;
}
