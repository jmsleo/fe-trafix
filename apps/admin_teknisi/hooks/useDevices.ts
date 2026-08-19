'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDevice,
  deleteDevice,
  getDevice,
  listDevices,
  updateDevice,
} from '@/lib/api/devices';
import type { DeviceCreate, DeviceListParams, DeviceUpdate } from '@/lib/api/types';

export const deviceKeys = {
  all: ['devices'] as const,
  list: (params?: DeviceListParams) => [...deviceKeys.all, 'list', params] as const,
  detail: (id: string) => [...deviceKeys.all, 'detail', id] as const,
};

export function useDevices(params?: DeviceListParams) {
  return useQuery({
    queryKey: deviceKeys.list(params),
    queryFn: () => listDevices(params),
  });
}

export function useDevice(id: string) {
  return useQuery({
    queryKey: deviceKeys.detail(id),
    queryFn: () => getDevice(id),
    enabled: !!id,
  });
}

export function useCreateDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeviceCreate) => createDevice(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: deviceKeys.all }),
  });
}

export function useUpdateDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DeviceUpdate }) => updateDevice(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: deviceKeys.all }),
  });
}

export function useDeleteDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDevice(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: deviceKeys.all }),
  });
}