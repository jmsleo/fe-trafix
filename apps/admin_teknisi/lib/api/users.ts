import { apiClient } from './client';
import type {
  PasswordReset,
  UserCreate,
  UserListParams,
  UserPage,
  UserRead,
  UserUpdate,
} from './types';

export async function listUsers(params?: UserListParams): Promise<UserPage> {
  const response = await apiClient.get<UserPage>('/users/', { params });
  return response.data;
}

export async function getUser(userId: string): Promise<UserRead> {
  const response = await apiClient.get<UserRead>(`/users/${userId}`);
  return response.data;
}

export async function createUser(data: UserCreate): Promise<UserRead> {
  const response = await apiClient.post<UserRead>('/users/', data);
  return response.data;
}

export async function updateUser(userId: string, data: UserUpdate): Promise<UserRead> {
  const response = await apiClient.put<UserRead>(`/users/${userId}`, data);
  return response.data;
}

export async function deleteUser(userId: string): Promise<void> {
  await apiClient.delete(`/users/${userId}`);
}

export async function resetUserPassword(userId: string, data: PasswordReset): Promise<UserRead> {
  const response = await apiClient.post<UserRead>(`/users/${userId}/reset-password`, data);
  return response.data;
}
