import { apiClient, requestDownload } from './client';
import type {
  AutoBackupConfig,
  BackupListParams,
  BackupPage,
  BackupRead,
  BackupRestoreRequest,
} from './types';

export async function listBackups(params?: BackupListParams): Promise<BackupPage> {
  const response = await apiClient.get<BackupPage>('/backups/', { params });
  return response.data;
}

export async function getAutoBackupConfig(): Promise<AutoBackupConfig> {
  const response = await apiClient.get<AutoBackupConfig>('/backups/auto-backup');
  return response.data;
}

export async function updateAutoBackupConfig(
  data: AutoBackupConfig,
): Promise<AutoBackupConfig> {
  const response = await apiClient.put<AutoBackupConfig>('/backups/auto-backup', data);
  return response.data;
}

export async function createBackup(): Promise<BackupRead> {
  const response = await apiClient.post<BackupRead>('/backups/');
  return response.data;
}

export async function uploadBackup(data: { file: File }): Promise<BackupRead> {
  const formData = new FormData();
  formData.append('file', data.file);
  const response = await apiClient.post<BackupRead>('/backups/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function getBackup(backupId: string): Promise<BackupRead> {
  const response = await apiClient.get<BackupRead>(`/backups/${backupId}`);
  return response.data;
}

export async function deleteBackup(backupId: string): Promise<void> {
  await apiClient.delete(`/backups/${backupId}`);
}

export async function downloadBackup(backupId: string): Promise<Blob> {
  return requestDownload(`/backups/${backupId}/download`);
}

export async function restoreBackup(
  backupId: string,
  data: BackupRestoreRequest = {},
): Promise<BackupRead> {
  const response = await apiClient.post<BackupRead>(`/backups/${backupId}/restore`, data);
  return response.data;
}
