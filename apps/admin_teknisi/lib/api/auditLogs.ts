import { apiClient } from './client';
import type {
  AuditCleanupConfig,
  AuditLogListParams,
  AuditLogPage,
  AuditLogRead,
} from './types';

export async function listAuditLogs(params?: AuditLogListParams): Promise<AuditLogPage> {
  const response = await apiClient.get<AuditLogPage>('/audit-logs/', { params });
  return response.data;
}

export async function getAuditLog(auditId: string): Promise<AuditLogRead> {
  const response = await apiClient.get<AuditLogRead>(`/audit-logs/${auditId}`);
  return response.data;
}

export async function getAuditCleanupConfig(): Promise<AuditCleanupConfig> {
  const response = await apiClient.get<AuditCleanupConfig>('/audit-logs/cleanup-config');
  return response.data;
}

export async function updateAuditCleanupConfig(
  data: AuditCleanupConfig,
): Promise<AuditCleanupConfig> {
  const response = await apiClient.put<AuditCleanupConfig>(
    '/audit-logs/cleanup-config',
    data,
  );
  return response.data;
}
