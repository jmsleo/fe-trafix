import { apiClient } from './client';
import type {
  OperatorShiftAssignmentCreate,
  OperatorShiftAssignmentListParams,
  OperatorShiftAssignmentPage,
  OperatorShiftAssignmentRead,
  OperatorShiftAssignmentUpdate,
  SearchStatusParams,
  ShiftCreate,
  ShiftPage,
  ShiftRead,
  ShiftUpdate,
} from './types';

// ---------------------------------------------------------------------------
// Shifts
// ---------------------------------------------------------------------------

export async function listShifts(params?: SearchStatusParams): Promise<ShiftPage> {
  const response = await apiClient.get<ShiftPage>('/shifts/', { params });
  return response.data;
}

export async function getShift(shiftId: string): Promise<ShiftRead> {
  const response = await apiClient.get<ShiftRead>(`/shifts/${shiftId}`);
  return response.data;
}

export async function createShift(data: ShiftCreate): Promise<ShiftRead> {
  const response = await apiClient.post<ShiftRead>('/shifts/', data);
  return response.data;
}

export async function updateShift(shiftId: string, data: ShiftUpdate): Promise<ShiftRead> {
  const response = await apiClient.put<ShiftRead>(`/shifts/${shiftId}`, data);
  return response.data;
}

export async function deleteShift(shiftId: string): Promise<void> {
  await apiClient.delete(`/shifts/${shiftId}`);
}

// ---------------------------------------------------------------------------
// Operator Shift Assignments
// ---------------------------------------------------------------------------

export async function listOperatorShiftAssignments(
  params?: OperatorShiftAssignmentListParams,
): Promise<OperatorShiftAssignmentPage> {
  const response = await apiClient.get<OperatorShiftAssignmentPage>('/operator-shifts/', {
    params,
  });
  return response.data;
}

export async function listAllOperatorShiftAssignments(): Promise<OperatorShiftAssignmentRead[]> {
  const pageSize = 100;
  const all: OperatorShiftAssignmentRead[] = [];
  let page = 1;
  for (;;) {
    const response = await apiClient.get<OperatorShiftAssignmentPage>('/operator-shifts/', {
      params: { page, page_size: pageSize },
    });
    all.push(...response.data.items);
    if (page >= response.data.total_pages) break;
    page += 1;
  }
  return all;
}

export async function getOperatorShiftAssignment(
  assignmentId: string,
): Promise<OperatorShiftAssignmentRead> {
  const response = await apiClient.get<OperatorShiftAssignmentRead>(
    `/operator-shifts/${assignmentId}`,
  );
  return response.data;
}

export async function createOperatorShiftAssignment(
  data: OperatorShiftAssignmentCreate,
): Promise<OperatorShiftAssignmentRead> {
  const response = await apiClient.post<OperatorShiftAssignmentRead>('/operator-shifts/', data);
  return response.data;
}

export async function updateOperatorShiftAssignment(
  assignmentId: string,
  data: OperatorShiftAssignmentUpdate,
): Promise<OperatorShiftAssignmentRead> {
  const response = await apiClient.put<OperatorShiftAssignmentRead>(
    `/operator-shifts/${assignmentId}`,
    data,
  );
  return response.data;
}

export async function deleteOperatorShiftAssignment(assignmentId: string): Promise<void> {
  await apiClient.delete(`/operator-shifts/${assignmentId}`);
}
