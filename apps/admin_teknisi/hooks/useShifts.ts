'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createOperatorShiftAssignment,
  createShift,
  deleteOperatorShiftAssignment,
  deleteShift,
  getOperatorShiftAssignment,
  getShift,
  listAllOperatorShiftAssignments,
  listOperatorShiftAssignments,
  listShifts,
  updateOperatorShiftAssignment,
  updateShift,
} from '@/lib/api/shifts';
import type {
  OperatorShiftAssignmentCreate,
  OperatorShiftAssignmentListParams,
  OperatorShiftAssignmentUpdate,
  SearchStatusParams,
  ShiftCreate,
  ShiftUpdate,
} from '@/lib/api/types';

export const shiftKeys = {
  all: ['shifts'] as const,
  list: (params?: SearchStatusParams) => [...shiftKeys.all, 'list', params] as const,
  detail: (id: string) => [...shiftKeys.all, 'detail', id] as const,
  assignments: ['operator-shifts'] as const,
};

// ---------------------------------------------------------------------------
// Shifts
// ---------------------------------------------------------------------------

export function useShifts(params?: SearchStatusParams) {
  return useQuery({
    queryKey: shiftKeys.list(params),
    queryFn: () => listShifts(params),
  });
}

export function useShift(id: string) {
  return useQuery({
    queryKey: shiftKeys.detail(id),
    queryFn: () => getShift(id),
    enabled: !!id,
  });
}

export function useCreateShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ShiftCreate) => createShift(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shiftKeys.all }),
  });
}

export function useUpdateShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ShiftUpdate }) => updateShift(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shiftKeys.all }),
  });
}

export function useDeleteShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteShift(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shiftKeys.all }),
  });
}

// ---------------------------------------------------------------------------
// Operator Shift Assignments
// ---------------------------------------------------------------------------

export function useOperatorShiftAssignments(params?: OperatorShiftAssignmentListParams) {
  return useQuery({
    queryKey: [...shiftKeys.assignments, 'list', params] as const,
    queryFn: () => listOperatorShiftAssignments(params),
  });
}

export function useAllOperatorShiftAssignments() {
  return useQuery({
    queryKey: [...shiftKeys.assignments, 'all'] as const,
    queryFn: () => listAllOperatorShiftAssignments(),
  });
}

export function useOperatorShiftAssignment(id: string) {
  return useQuery({
    queryKey: [...shiftKeys.assignments, 'detail', id] as const,
    queryFn: () => getOperatorShiftAssignment(id),
    enabled: !!id,
  });
}

export function useCreateOperatorShiftAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: OperatorShiftAssignmentCreate) => createOperatorShiftAssignment(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shiftKeys.assignments }),
  });
}

export function useUpdateOperatorShiftAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: OperatorShiftAssignmentUpdate;
    }) => updateOperatorShiftAssignment(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shiftKeys.assignments }),
  });
}

export function useDeleteOperatorShiftAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOperatorShiftAssignment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shiftKeys.assignments }),
  });
}
