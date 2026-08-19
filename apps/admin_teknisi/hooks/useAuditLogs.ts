'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAuditCleanupConfig,
  getAuditLog,
  listAuditLogs,
  updateAuditCleanupConfig,
} from '@/lib/api/auditLogs';
import type { AuditCleanupConfig, AuditLogListParams } from '@/lib/api/types';

export const auditLogKeys = {
  all: ['audit-logs'] as const,
  list: (params?: AuditLogListParams) => [...auditLogKeys.all, 'list', params] as const,
  detail: (id: string) => [...auditLogKeys.all, 'detail', id] as const,
  cleanupConfig: ['audit-logs', 'cleanup-config'] as const,
};

export function useAuditLogs(params?: AuditLogListParams) {
  return useQuery({
    queryKey: auditLogKeys.list(params),
    queryFn: () => listAuditLogs(params),
  });
}

export function useAuditLog(id: string) {
  return useQuery({
    queryKey: auditLogKeys.detail(id),
    queryFn: () => getAuditLog(id),
    enabled: !!id,
  });
}

export function useAuditCleanupConfig() {
  return useQuery({
    queryKey: auditLogKeys.cleanupConfig,
    queryFn: getAuditCleanupConfig,
  });
}

export function useUpdateAuditCleanupConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AuditCleanupConfig) => updateAuditCleanupConfig(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: auditLogKeys.cleanupConfig }),
  });
}
