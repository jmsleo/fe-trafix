import { apiClient } from './client';
import type { AuditLogListParams, AuditLogPage, AuditLogRead } from './types';

export async function listAuditLogs(params?: AuditLogListParams): Promise<AuditLogPage> {
  const response = await apiClient.get<AuditLogPage>('/audit-logs/', { params });
  return response.data;
}

export async function getAuditLog(auditId: string): Promise<AuditLogRead> {
  const response = await apiClient.get<AuditLogRead>(`/audit-logs/${auditId}`);
  return response.data;
}
