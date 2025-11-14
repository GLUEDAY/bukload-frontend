// src/api/http.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const ACCESS_TOKEN_KEY = "bukload_access_token";
export const REFRESH_TOKEN_KEY = "bukload_refresh_token";

// ✅ 다른 파일에서도 쓰게 export 해두자
export const BASE_URL = import.meta.env.VITE_API_URL;
export const WITH_CREDENTIALS = import.meta.env.VITE_WITH_CREDENTIALS === "true";

// ✅ 공통 응답 래퍼 타입 (API 명세에서 success/data/message 구조)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: WITH_CREDENTIALS,
  timeout: 15000,
});

// ✅ 요청마다 Access Token 붙이기
http.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let waiters: Array<(t: string) => void> = [];

// ✅ Refresh 토큰으로 Access 토큰 재발급
async function refreshToken() {
  const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refresh) throw new Error("NO_REFRESH");

  const { data } = await axios.post(
    `${BASE_URL}/auth/refresh`,
    { refreshToken: refresh },
    { withCredentials: WITH_CREDENTIALS }
  );

  const newAccess = (data as any)?.accessToken;
  if (!newAccess) throw new Error("NO_ACCESS");

  localStorage.setItem(ACCESS_TOKEN_KEY, newAccess);
  return newAccess;
}

// ✅ 401 발생 시 한 번만 refresh, 나머지는 큐에 쌓았다가 재요청
http.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const original = err.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (err.response?.status === 401 && original && !original._retry) {
      if (isRefreshing) {
        // 이미 refresh 중이면 끝날 때까지 기다렸다가 재요청
        return new Promise((resolve, reject) => {
          waiters.push((token) => {
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${token}`;
            original._retry = true;
            http.request(original).then(resolve).catch(reject);
          });
        });
      }

      try {
        isRefreshing = true;
        const token = await refreshToken();

        // 기다리던 요청들 다시 보내기
        waiters.forEach((w) => w(token));
        waiters = [];

        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${token}`;
        original._retry = true;
        return http.request(original);
      } catch {
        // refresh 실패 → 로컬 토큰 제거
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
