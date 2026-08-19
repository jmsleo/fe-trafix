'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createGate,
  deleteGate,
  getGate,
  listGates,
  updateGate,
} from '@/lib/api/gates';
import type { GateCreate, GateListParams, GateUpdate } from '@/lib/api/types';

export const gateKeys = {
  all: ['gates'] as const,
  list: (params?: GateListParams) => [...gateKeys.all, 'list', params] as const,
  detail: (id: string) => [...gateKeys.all, 'detail', id] as const,
};

export function useGates(params?: GateListParams) {
  return useQuery({
    queryKey: gateKeys.list(params),
    queryFn: () => listGates(params),
  });
}

export function useGate(id: string) {
  return useQuery({
    queryKey: gateKeys.detail(id),
    queryFn: () => getGate(id),
    enabled: !!id,
  });
}

export function useCreateGate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GateCreate) => createGate(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: gateKeys.all }),
  });
}

export function useUpdateGate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GateUpdate }) => updateGate(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: gateKeys.all }),
  });
}

export function useDeleteGate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: gateKeys.all }),
  });
}