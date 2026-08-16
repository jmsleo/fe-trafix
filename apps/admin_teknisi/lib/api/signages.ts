import { apiClient } from './client';
import type {
  SearchStatusParams,
  SignageAssignmentCreate,
  SignageAssignmentListParams,
  SignageAssignmentPage,
  SignageAssignmentRead,
  SignageAssignmentStatusUpdate,
  SignageContentCreate,
  SignageContentListParams,
  SignageContentPage,
  SignageContentRead,
  SignageContentStatusUpdate,
  SignageContentUpdate,
  SignageCreate,
  SignagePage,
  SignageRead,
  SignageScheduleCreate,
  SignageScheduleListParams,
  SignageSchedulePage,
  SignageScheduleRead,
  SignageScheduleStatusUpdate,
  SignageScheduleUpdate,
  SignageStatusUpdate,
  SignageUpdate,
} from './types';

// ---------------------------------------------------------------------------
// Signages (devices/screens)
// ---------------------------------------------------------------------------

export async function listSignages(params?: SearchStatusParams): Promise<SignagePage> {
  const response = await apiClient.get<SignagePage>('/signages/', { params });
  return response.data;
}

export async function getSignage(signageId: string): Promise<SignageRead> {
  const response = await apiClient.get<SignageRead>(`/signages/${signageId}`);
  return response.data;
}

export async function createSignage(data: SignageCreate): Promise<SignageRead> {
  const response = await apiClient.post<SignageRead>('/signages/', data);
  return response.data;
}

export async function updateSignage(signageId: string, data: SignageUpdate): Promise<SignageRead> {
  const response = await apiClient.put<SignageRead>(`/signages/${signageId}`, data);
  return response.data;
}

export async function deleteSignage(signageId: string): Promise<void> {
  await apiClient.delete(`/signages/${signageId}`);
}

export async function updateSignageStatus(
  signageId: string,
  data: SignageStatusUpdate,
): Promise<SignageRead> {
  const response = await apiClient.patch<SignageRead>(`/signages/${signageId}/status`, data);
  return response.data;
}

// ---------------------------------------------------------------------------
// Signage Contents
// ---------------------------------------------------------------------------

export async function listSignageContents(
  params?: SignageContentListParams,
): Promise<SignageContentPage> {
  const response = await apiClient.get<SignageContentPage>('/signages/contents', { params });
  return response.data;
}

export async function getSignageContent(contentId: string): Promise<SignageContentRead> {
  const response = await apiClient.get<SignageContentRead>(`/signages/contents/${contentId}`);
  return response.data;
}

export async function createSignageContent(
  data: SignageContentCreate,
): Promise<SignageContentRead> {
  const response = await apiClient.post<SignageContentRead>('/signages/contents', data);
  return response.data;
}

export async function updateSignageContent(
  contentId: string,
  data: SignageContentUpdate,
): Promise<SignageContentRead> {
  const response = await apiClient.put<SignageContentRead>(`/signages/contents/${contentId}`, data);
  return response.data;
}

export async function deleteSignageContent(contentId: string): Promise<void> {
  await apiClient.delete(`/signages/contents/${contentId}`);
}

export async function updateSignageContentStatus(
  contentId: string,
  data: SignageContentStatusUpdate,
): Promise<SignageContentRead> {
  const response = await apiClient.patch<SignageContentRead>(
    `/signages/contents/${contentId}/status`,
    data,
  );
  return response.data;
}

export async function uploadSignageContent(
  data: { file: File; title: string; content_type: string },
): Promise<SignageContentRead> {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('title', data.title);
  formData.append('content_type', data.content_type);
  const response = await apiClient.post<SignageContentRead>('/signages/contents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function getSignageContentFileUrl(contentId: string): Promise<string> {
  const response = await apiClient.get<Blob>(`/signages/contents/${contentId}/file`, {
    responseType: 'blob',
  });
  return URL.createObjectURL(response.data);
}

// ---------------------------------------------------------------------------
// Signage Assignments
// ---------------------------------------------------------------------------

export async function listSignageAssignments(
  params?: SignageAssignmentListParams,
): Promise<SignageAssignmentPage> {
  const response = await apiClient.get<SignageAssignmentPage>('/signages/assignments', { params });
  return response.data;
}

export async function getSignageAssignment(
  assignmentId: string,
): Promise<SignageAssignmentRead> {
  const response = await apiClient.get<SignageAssignmentRead>(
    `/signages/assignments/${assignmentId}`,
  );
  return response.data;
}

export async function createSignageAssignment(
  data: SignageAssignmentCreate,
): Promise<SignageAssignmentRead> {
  const response = await apiClient.post<SignageAssignmentRead>('/signages/assignments', data);
  return response.data;
}

export async function deleteSignageAssignment(assignmentId: string): Promise<void> {
  await apiClient.delete(`/signages/assignments/${assignmentId}`);
}

export async function updateSignageAssignmentStatus(
  assignmentId: string,
  data: SignageAssignmentStatusUpdate,
): Promise<SignageAssignmentRead> {
  const response = await apiClient.patch<SignageAssignmentRead>(
    `/signages/assignments/${assignmentId}/status`,
    data,
  );
  return response.data;
}

// ---------------------------------------------------------------------------
// Signage Schedules
// ---------------------------------------------------------------------------

export async function listSignageSchedules(
  params?: SignageScheduleListParams,
): Promise<SignageSchedulePage> {
  const response = await apiClient.get<SignageSchedulePage>('/signages/schedules', { params });
  return response.data;
}

export async function getSignageSchedule(scheduleId: string): Promise<SignageScheduleRead> {
  const response = await apiClient.get<SignageScheduleRead>(`/signages/schedules/${scheduleId}`);
  return response.data;
}

export async function createSignageSchedule(
  data: SignageScheduleCreate,
): Promise<SignageScheduleRead> {
  const response = await apiClient.post<SignageScheduleRead>('/signages/schedules', data);
  return response.data;
}

export async function updateSignageSchedule(
  scheduleId: string,
  data: SignageScheduleUpdate,
): Promise<SignageScheduleRead> {
  const response = await apiClient.put<SignageScheduleRead>(
    `/signages/schedules/${scheduleId}`,
    data,
  );
  return response.data;
}

export async function deleteSignageSchedule(scheduleId: string): Promise<void> {
  await apiClient.delete(`/signages/schedules/${scheduleId}`);
}

export async function updateSignageScheduleStatus(
  scheduleId: string,
  data: SignageScheduleStatusUpdate,
): Promise<SignageScheduleRead> {
  const response = await apiClient.patch<SignageScheduleRead>(
    `/signages/schedules/${scheduleId}/status`,
    data,
  );
  return response.data;
}
