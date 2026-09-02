'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createParkingRate,
  deleteParkingRate,
  getParkingRate,
  listParkingRates,
  updateParkingRate,
  updateParkingRateStatus,
} from '@/lib/api/parkingRates';
import type {
  ParkingRateCreate,
  ParkingRateStatusUpdate,
  ParkingRateUpdate,
  SearchStatusParams,
} from '@/lib/api/types';

export const parkingRateKeys = {
  all: ['parking-rates'] as const,
  list: (params?: SearchStatusParams) => [...parkingRateKeys.all, 'list', params] as const,
  detail: (id: string) => [...parkingRateKeys.all, 'detail', id] as const,
};

export function useParkingRates(params?: SearchStatusParams) {
  return useQuery({
    queryKey: parkingRateKeys.list(params),
    queryFn: () => listParkingRates(params),
  });
}

export function useAllParkingRates() {
  return useQuery({
    queryKey: parkingRateKeys.list({ page: 1, page_size: 100 }),
    queryFn: () => listParkingRates({ page: 1, page_size: 100 }),
  });
}

export function useParkingRate(id: string) {
  return useQuery({
    queryKey: parkingRateKeys.detail(id),
    queryFn: () => getParkingRate(id),
    enabled: !!id,
  });
}

export function useCreateParkingRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ParkingRateCreate) => createParkingRate(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: parkingRateKeys.all }),
  });
}

export function useUpdateParkingRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ParkingRateUpdate }) =>
      updateParkingRate(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: parkingRateKeys.all }),
  });
}

export function useUpdateParkingRateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ParkingRateStatusUpdate }) =>
      updateParkingRateStatus(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: parkingRateKeys.all }),
  });
}

export function useDeleteParkingRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteParkingRate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: parkingRateKeys.all }),
  });
}
