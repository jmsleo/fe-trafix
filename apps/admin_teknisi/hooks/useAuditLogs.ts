'use client';

import { useQuery } from '@tanstack/react-query';
import { getAuditLog, listAuditLogs } from '@/lib/api/auditLogs';
import type { AuditLogListParams } from '@/lib/api/types';

export const auditLogKeys = {
  all: ['audit-logs'] as const,
  list: (params?: AuditLogListParams) => [...auditLogKeys.all, 'list', params] as const,
  detail: (id: string) => [...auditLogKeys.all, 'detail', id] as const,
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
