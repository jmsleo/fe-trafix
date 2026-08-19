import { apiClient } from './client';
import type {
  DeviceCreate,
  DeviceListParams,
  DevicePage,
  DeviceRead,
  DeviceUpdate,
} from './types';

export async function listDevices(params?: DeviceListParams): Promise<DevicePage> {
  const response = await apiClient.get<DevicePage>('/devices/', { params });
  return response.data;
}

export async function getDevice(deviceId: string): Promise<DeviceRead> {
  const response = await apiClient.get<DeviceRead>(`/devices/${deviceId}`);
  return response.data;
}

export async function createDevice(data: DeviceCreate): Promise<DeviceRead> {
  const response = await apiClient.post<DeviceRead>('/devices/', data);
  return response.data;
}

export async function updateDevice(deviceId: string, data: DeviceUpdate): Promise<DeviceRead> {
  const response = await apiClient.put<DeviceRead>(`/devices/${deviceId}`, data);
  return response.data;
}

export async function deleteDevice(deviceId: string): Promise<void> {
  await apiClient.delete(`/devices/${deviceId}`);
}