import { apiClient } from './client';
import type {
  LoginRequest,
  LogoutRequest,
  RefreshRequest,
  TokenPair,
  UserRead,
} from './types';

export async function login(data: LoginRequest): Promise<TokenPair> {
  const response = await apiClient.post<TokenPair>('/auth/login', data);
  return response.data;
}

export async function refreshToken(data: RefreshRequest): Promise<TokenPair> {
  const response = await apiClient.post<TokenPair>('/auth/refresh', data);
  return response.data;
}

export async function logout(data: LogoutRequest): Promise<void> {
  await apiClient.post<void>('/auth/logout', data);
}

export async function getMe(): Promise<UserRead> {
  const response = await apiClient.get<UserRead>('/auth/me');
  return response.data;
}
