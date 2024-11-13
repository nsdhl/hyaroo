import axios from "axios";
import * as Cookies from "js-cookie"
const apiUrl = import.meta.env.VITE_API_URL

export const url = axios.create({
  baseURL: `${apiUrl}/api`,
})

url.interceptors.request.use(function(req) {
  const token = Cookies.default.get("token");
  if (token) {
    req.headers.authorization = `Bearer ${JSON.parse(token as string).token}`
    return req;
  }
  return req;
})



