import { apiClient } from './client';
import type {
  DeviceLogEntry,
  DeviceLogPage,
  DeviceLogParams,
  DeviceMonitorListParams,
  DeviceMonitorPage,
  ReaderEventPage,
  RestartResult,
  SignageDisplayStatus,
  TestResult,
} from './types';

// ---------------------------------------------------------------------------
// Consolidated live device monitoring
// ---------------------------------------------------------------------------

export async function listMonitoringDevices(
  params?: DeviceMonitorListParams,
): Promise<DeviceMonitorPage> {
  const response = await apiClient.get<DeviceMonitorPage>('/api/monitoring/devices', { params });
  return response.data;
}

export async function getSignageDisplayStatus(gateCode: string): Promise<SignageDisplayStatus> {
  const response = await apiClient.get<SignageDisplayStatus>(`/api/monitoring/signage/${gateCode}`);
  return response.data;
}

export async function listReaderEvents(params?: {
  gate?: string | null;
  page?: number;
  page_size?: number;
}): Promise<ReaderEventPage> {
  const response = await apiClient.get<ReaderEventPage>('/api/monitoring/reader-events', { params });
  return response.data;
}

export async function listDeviceLogs(params?: DeviceLogParams): Promise<DeviceLogPage> {
  const response = await apiClient.get<DeviceLogPage>('/api/monitoring/logs', { params });
  return response.data;
}

// ---------------------------------------------------------------------------
// Device actions
// ---------------------------------------------------------------------------

export async function testDeviceConnection(deviceId: string): Promise<TestResult> {
  const response = await apiClient.post<TestResult>(`/api/monitoring/devices/${deviceId}/test`);
  return response.data;
}

export async function restartDevice(deviceId: string): Promise<RestartResult> {
  const response = await apiClient.post<RestartResult>(
    `/api/monitoring/devices/${deviceId}/restart`,
  );
  return response.data;
}

// Re-export for consumers that filter the log by device source.
export type { DeviceLogEntry };