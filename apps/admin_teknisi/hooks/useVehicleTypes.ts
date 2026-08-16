'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createVehicleType,
  deleteVehicleType,
  getVehicleType,
  listVehicleTypes,
  updateVehicleType,
} from '@/lib/api/vehicleTypes';
import type { SearchStatusParams, VehicleTypeCreate, VehicleTypeUpdate } from '@/lib/api/types';

export const vehicleTypeKeys = {
  all: ['vehicle-types'] as const,
  list: (params?: SearchStatusParams) => [...vehicleTypeKeys.all, 'list', params] as const,
  detail: (id: string) => [...vehicleTypeKeys.all, 'detail', id] as const,
};

export function useVehicleTypes(params?: SearchStatusParams) {
  return useQuery({
    queryKey: vehicleTypeKeys.list(params),
    queryFn: () => listVehicleTypes(params),
  });
}

export function useVehicleType(id: string) {
  return useQuery({
    queryKey: vehicleTypeKeys.detail(id),
    queryFn: () => getVehicleType(id),
    enabled: !!id,
  });
}

export function useCreateVehicleType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VehicleTypeCreate) => createVehicleType(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: vehicleTypeKeys.all }),
  });
}

export function useUpdateVehicleType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VehicleTypeUpdate }) =>
      updateVehicleType(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: vehicleTypeKeys.all }),
  });
}

export function useDeleteVehicleType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVehicleType(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: vehicleTypeKeys.all }),
  });
}
