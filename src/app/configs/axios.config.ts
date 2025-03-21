import axios from "axios";
import { EnvConfig } from "./env.config";
import queryString from 'query-string';
import { Const } from "../common";
import { aesDecode, aesEncodeAuthSaveLocal } from "../utils";
import dayjs from "dayjs";

interface Options {
  token?: string
}
// export const baseURL = EnvConfig.API_URL;
export const baseURL = EnvConfig.API_URL_DEV;

export const AxiosConfig = (options?: Options) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    paramsSerializer: {
      //@ts-ignore
      serialize: (params: Record<string, any>) => queryString.stringify(params),
      indexes: false,
    },
  });

  instance.interceptors.request.use(async (config) => {
    const token = options?.token || await authHandler();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    response => response.data,
    error => {
      const customError = {
        statusCode: error.response?.status,
        data: error.response?.data,
        message: error.message,
      };
      return Promise.reject(customError);
    },
  );

  return instance;
};

const authHandler = async () => {
  let token;
  try {
    const { token: tokenLocal, refresh_token, token_expired_at } = JSON.parse(aesDecode(localStorage.getItem(Const.StorageKey.sig) || ''));
    token = tokenLocal;
    if (dayjs().isAfter(dayjs(token_expired_at))) {
      const response = await axios.post(`${EnvConfig.API_URL}/auth/refresh`, { refresh: refresh_token });
      token = response.data.context.token;
      aesEncodeAuthSaveLocal(response.data.context.token, refresh_token, response.data.context.token_expired_at);
    }
  } catch (error) {}
  return token
}
