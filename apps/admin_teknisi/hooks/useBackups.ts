'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBackup,
  deleteBackup,
  downloadBackup,
  getAutoBackupConfig,
  getBackup,
  listBackups,
  restoreBackup,
  updateAutoBackupConfig,
  uploadBackup,
} from '@/lib/api/backups';
import type { AutoBackupConfig, BackupListParams, BackupRestoreRequest } from '@/lib/api/types';

export const backupKeys = {
  all: ['backups'] as const,
  list: (params?: BackupListParams) => [...backupKeys.all, 'list', params] as const,
  detail: (id: string) => [...backupKeys.all, 'detail', id] as const,
  autoBackup: ['backups', 'auto-backup'] as const,
};

export function useBackups(params?: BackupListParams) {
  return useQuery({
    queryKey: backupKeys.list(params),
    queryFn: () => listBackups(params),
    refetchInterval: 5000,
  });
}

export function useBackup(id: string) {
  return useQuery({
    queryKey: backupKeys.detail(id),
    queryFn: () => getBackup(id),
    enabled: !!id,
  });
}

export function useAutoBackupConfig() {
  return useQuery({
    queryKey: backupKeys.autoBackup,
    queryFn: getAutoBackupConfig,
  });
}

export function useUpdateAutoBackupConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AutoBackupConfig) => updateAutoBackupConfig(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: backupKeys.autoBackup }),
  });
}

export function useCreateBackup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => createBackup(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: backupKeys.all }),
  });
}

export function useUploadBackup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { file: File }) => uploadBackup(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: backupKeys.all }),
  });
}

export function useDeleteBackup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBackup(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: backupKeys.all }),
  });
}

export function useRestoreBackup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: BackupRestoreRequest }) =>
      restoreBackup(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: backupKeys.all }),
  });
}

export function useDownloadBackup() {
  return useMutation({
    mutationFn: (id: string) => downloadBackup(id),
  });
}
