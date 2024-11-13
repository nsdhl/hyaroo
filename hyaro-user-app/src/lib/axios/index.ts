import axios from 'axios';
import * as Cookies from 'js-cookie';

export const url = axios.create({
  baseURL: '',
});

url.interceptors.request.use(function (req) {
  const token = Cookies.default.get('token');
  if (token) {
    req.headers.authorization = `Bearer ${JSON.parse(token as string).token}`;
    return req;
  }
  return req;
});
