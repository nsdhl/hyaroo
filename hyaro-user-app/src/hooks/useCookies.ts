import { cookies } from 'next/headers';

export const useCookies = () => {
  const cookie = cookies();
  if (cookie.get('token')) {
    const _token = cookie.get('token')?.value;
    const token = JSON.parse(_token as string).token;
    return token;
  }
};
