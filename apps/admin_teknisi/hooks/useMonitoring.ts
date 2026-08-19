'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import {
  listDeviceLogs,
  listMonitoringDevices,
  listReaderEvents,
  restartDevice,
  testDeviceConnection,
} from '@/lib/api/monitoring';
import type { DeviceLogParams, DeviceMonitorListParams } from '@/lib/api/types';

export const monitoringKeys = {
  all: ['monitoring'] as const,
  snapshot: ['monitoring', 'snapshot'] as const,
  devices: (params?: DeviceMonitorListParams) => [...monitoringKeys.all, 'devices', params] as const,
  logs: (params?: DeviceLogParams) => [...monitoringKeys.all, 'logs', params] as const,
  readerEvents: (params?: object) => [...monitoringKeys.all, 'reader-events', params] as const,
};

export function useMonitoringDevices(
  params?: DeviceMonitorListParams,
  refetchInterval?: number,
) {
  return useQuery({
    queryKey: monitoringKeys.devices(params),
    queryFn: () => listMonitoringDevices(params),
    refetchInterval,
  });
}

export function useDeviceLogs(params?: DeviceLogParams, refetchInterval?: number) {
  return useQuery({
    queryKey: monitoringKeys.logs(params),
    queryFn: () => listDeviceLogs(params),
    refetchInterval,
  });
}

export function useReaderEvents(
  params?: { gate?: string | null; page?: number; page_size?: number },
  refetchInterval?: number,
) {
  return useQuery({
    queryKey: monitoringKeys.readerEvents(params),
    queryFn: () => listReaderEvents(params),
    refetchInterval,
  });
}

export function useTestDeviceConnection() {
  return useMutation({
    mutationFn: (deviceId: string) => testDeviceConnection(deviceId),
  });
}

export function useRestartDevice() {
  return useMutation({
    mutationFn: (deviceId: string) => restartDevice(deviceId),
  });
}