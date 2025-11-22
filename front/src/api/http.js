// src/api/http.js
import axios from "axios";
export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const BASE_URL = import.meta.env.VITE_API_URL || "http://18.118.143.23";
export const WITH_CREDENTIALS =
  import.meta.env.VITE_WITH_CREDENTIALS === "true";

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,

});


export const api = http;


http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`; // Bearer 토큰
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let waiters = [];

async function refreshToken() {
  const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refresh) throw new Error("NO_REFRESH");

  // 🔹 refresh 토큰은 body 로 전달
  const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
    refreshToken: refresh,
  });

  const newAccess = data && data.accessToken;
  if (!newAccess) throw new Error("NO_ACCESS");

  // 새 access 토큰 저장
  localStorage.setItem(ACCESS_TOKEN_KEY, newAccess);
  return newAccess;
}


http.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const status = err.response && err.response.status;

    if ((status === 401 || status === 403) && original && !original._retry) {
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
