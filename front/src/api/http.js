// src/api/http.js
import axios from "axios";

export const ACCESS_TOKEN_KEY = "bukload_access_token";
export const REFRESH_TOKEN_KEY = "bukload_refresh_token";

export const BASE_URL = import.meta.env.VITE_API_URL || "http://18.118.143.23";
export const WITH_CREDENTIALS = import.meta.env.VITE_WITH_CREDENTIALS === "true";

const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: WITH_CREDENTIALS,
  timeout: 15000,
});

export const api = http;

// 요청마다 Access Token 붙이기
http.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let waiters = [];

async function refreshToken() {
  const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refresh) throw new Error("NO_REFRESH");

  const { data } = await axios.post(
    `${BASE_URL}/auth/refresh`,
    { refreshToken: refresh },
    { withCredentials: WITH_CREDENTIALS }
  );

  const newAccess = data && data.accessToken;
  if (!newAccess) throw new Error("NO_ACCESS");

  localStorage.setItem(ACCESS_TOKEN_KEY, newAccess);
  return newAccess;
}

http.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    const status = err.response && err.response.status;

    if (
      (status === 401 || status === 403) && // ⭐ 403도 함께 처리
      original &&
      !original._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          waiters.push((token) => {
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${token}`;
            original._retry = true;
            http
              .request(original)
              .then(resolve)
              .catch(reject);
          });
        });
      }

      try {
        isRefreshing = true;
        const token = await refreshToken();

        waiters.forEach((w) => w(token));
        waiters = [];

        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${token}`;
        original._retry = true;

        return http.request(original);
      } catch (e) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);


export default http;
