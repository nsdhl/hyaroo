export function isTokenExpired(decodedToken: any) {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTimestamp;
}
