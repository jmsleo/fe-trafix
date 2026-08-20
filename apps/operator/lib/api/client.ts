import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { TokenPair } from './types';

const ACCESS_TOKEN_KEY = 'trafix_access_token';
const REFRESH_TOKEN_KEY = 'trafix_refresh_token';

export const tokenStorage = {
  getAccessToken: () => (typeof window !== 'undefined' ? window.localStorage.getItem(ACCESS_TOKEN_KEY) : null),
  getRefreshToken: () => (typeof window !== 'undefined' ? window.localStorage.getItem(REFRESH_TOKEN_KEY) : null),
  setTokens: (tokens: TokenPair) => {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
  },
  clearTokens: () => {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshingPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axios.post<TokenPair>(
    `${apiClient.defaults.baseURL}/auth/refresh`,
    { refresh_token: refreshToken },
    { headers: { 'Content-Type': 'application/json' } },
  );

  tokenStorage.setTokens(response.data);
  return response.data.access_token;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!original || error.response?.status !== 401 || original._retry || original.url?.includes('/auth/')) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      if (!refreshingPromise) {
        refreshingPromise = refreshAccessToken().finally(() => {
          refreshingPromise = null;
        });
      }
      const accessToken = await refreshingPromise;
      original.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(original);
    } catch (refreshError) {
      tokenStorage.clearTokens();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
      return Promise.reject(refreshError);
    }
  },
);

export function getDownloadUrl(path: string): string {
  const token = tokenStorage.getAccessToken();
  const base = apiClient.defaults.baseURL ?? '';
  const query = token ? `${path.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}` : '';
  return `${base}${path}${query}`;
}