import { url } from '@/lib/axios/index';

export const useAxiosPost = () => {
  return async (endPoint: string, data: unknown) => {
    try {
      const res = await url.post(
        `${
          process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
        }/api/${endPoint}`,
        data,
      );
      return res;
    } catch (e) {
      throw e;
    }
  };
};

export const useAxiosPatch = () => {
  return async (endPoint: string, data: unknown) => {
    try {
      const res = await url.patch(
        `${
          process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
        }/api/${endPoint}`,
        data,
      );
      return res;
    } catch (e) {
      throw e;
    }
  };
};

export const useAxiosDelete = () => {
  return async (endPoint: string) => {
    try {
      const res = await url.delete(
        `${
          process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
        }/api/${endPoint}`,
      );
      return res;
    } catch (e) {
      throw e;
    }
  };
};
