'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSignage,
  createSignageAssignment,
  createSignageContent,
  createSignageSchedule,
  deleteSignage,
  deleteSignageAssignment,
  deleteSignageContent,
  deleteSignageSchedule,
  getSignage,
  getSignageAssignment,
  getSignageContent,
  getSignageSchedule,
  listSignages,
  listSignageAssignments,
  listSignageContents,
  listSignageSchedules,
  updateSignage,
  updateSignageAssignmentStatus,
  updateSignageContent,
  updateSignageContentStatus,
  updateSignageSchedule,
  updateSignageScheduleStatus,
  updateSignageStatus,
  uploadSignageContent,
} from '@/lib/api/signages';
import type {
  SearchStatusParams,
  SignageAssignmentCreate,
  SignageAssignmentListParams,
  SignageAssignmentStatusUpdate,
  SignageContentCreate,
  SignageContentListParams,
  SignageContentStatusUpdate,
  SignageContentUpdate,
  SignageCreate,
  SignageScheduleCreate,
  SignageScheduleListParams,
  SignageScheduleStatusUpdate,
  SignageScheduleUpdate,
  SignageStatusUpdate,
  SignageUpdate,
} from '@/lib/api/types';

export const signageKeys = {
  all: ['signages'] as const,
  list: (params?: SearchStatusParams) => [...signageKeys.all, 'list', params] as const,
  detail: (id: string) => [...signageKeys.all, 'detail', id] as const,
  contents: ['signage-contents'] as const,
  assignments: ['signage-assignments'] as const,
  schedules: ['signage-schedules'] as const,
};

// ---------------------------------------------------------------------------
// Signages (devices/screens)
// ---------------------------------------------------------------------------

export function useSignages(params?: SearchStatusParams) {
  return useQuery({
    queryKey: signageKeys.list(params),
    queryFn: () => listSignages(params),
  });
}

export function useSignage(id: string) {
  return useQuery({
    queryKey: signageKeys.detail(id),
    queryFn: () => getSignage(id),
    enabled: !!id,
  });
}

export function useCreateSignage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SignageCreate) => createSignage(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: signageKeys.all }),
  });
}

export function useUpdateSignage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SignageUpdate }) => updateSignage(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: signageKeys.all }),
  });
}

export function useDeleteSignage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSignage(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: signageKeys.all }),
  });
}

export function useUpdateSignageStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SignageStatusUpdate }) =>
      updateSignageStatus(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: signageKeys.all }),
  });
}

// ---------------------------------------------------------------------------
// Signage Contents
// ---------------------------------------------------------------------------

export function useSignageContents(params?: SignageContentListParams) {
  return useQuery({
    queryKey: [...signageKeys.contents, 'list', params] as const,
    queryFn: () => listSignageContents(params),
  });
}

export function useSignageContent(id: string) {
  return useQuery({
    queryKey: [...signageKeys.contents, 'detail', id] as const,
    queryFn: () => getSignageContent(id),
    enabled: !!id,
  });
}

export function useCreateSignageContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SignageContentCreate) => createSignageContent(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: signageKeys.contents }),
  });
}

export function useUpdateSignageContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SignageContentUpdate }) =>
      updateSignageContent(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: signageKeys.contents }),
  });
}

export function useDeleteSignageContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSignageContent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: signageKeys.contents }),
  });
}

export function useUpdateSignageContentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SignageContentStatusUpdate }) =>
      updateSignageContentStatus(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: signageKeys.contents }),
  });
}

export function useUploadSignageContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { file: File; title: string; content_type: string }) =>
      uploadSignageContent(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: signageKeys.contents }),
  });
}

// ---------------------------------------------------------------------------
// Signage Assignments
// ---------------------------------------------------------------------------

export function useSignageAssignments(params?: SignageAssignmentListParams) {
  return useQuery({
    queryKey: [...signageKeys.assignments, 'list', params] as const,
    queryFn: () => listSignageAssignments(params),
  });
}

export function useSignageAssignment(id: string) {
  return useQuery({
    queryKey: [...signageKeys.assignments, 'detail', id] as const,
    queryFn: () => getSignageAssignment(id),
    enabled: !!id,
  });
}

export function useCreateSignageAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SignageAssignmentCreate) => createSignageAssignment(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: signageKeys.assignments }),
  });
}

export function useDeleteSignageAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSignageAssignment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: signageKeys.assignments }),
  });
}

export function useUpdateSignageAssignmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SignageAssignmentStatusUpdate }) =>
      updateSignageAssignmentStatus(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: signageKeys.assignments }),
  });
}

// ---------------------------------------------------------------------------
// Signage Schedules
// ---------------------------------------------------------------------------

export function useSignageSchedules(params?: SignageScheduleListParams) {
  return useQuery({
    queryKey: [...signageKeys.schedules, 'list', params] as const,
    queryFn: () => listSignageSchedules(params),
  });
}

export function useSignageSchedule(id: string) {
  return useQuery({
    queryKey: [...signageKeys.schedules, 'detail', id] as const,
    queryFn: () => getSignageSchedule(id),
    enabled: !!id,
  });
}

export function useCreateSignageSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SignageScheduleCreate) => createSignageSchedule(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: signageKeys.schedules }),
  });
}

export function useUpdateSignageSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SignageScheduleUpdate }) =>
      updateSignageSchedule(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: signageKeys.schedules }),
  });
}

export function useDeleteSignageSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSignageSchedule(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: signageKeys.schedules }),
  });
}

export function useUpdateSignageScheduleStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SignageScheduleStatusUpdate }) =>
      updateSignageScheduleStatus(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: signageKeys.schedules }),
  });
}
