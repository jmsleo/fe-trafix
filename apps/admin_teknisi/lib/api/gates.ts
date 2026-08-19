import { apiClient } from './client';
import type {
  GateCreate,
  GateHealthEntry,
  GateListParams,
  GatePage,
  GateRead,
  GateUpdate,
} from './types';

export async function listGates(params?: GateListParams): Promise<GatePage> {
  const response = await apiClient.get<GatePage>('/gates/', { params });
  return response.data;
}

export async function getGate(gateId: string): Promise<GateRead> {
  const response = await apiClient.get<GateRead>(`/gates/${gateId}`);
  return response.data;
}

export async function createGate(data: GateCreate): Promise<GateRead> {
  const response = await apiClient.post<GateRead>('/gates/', data);
  return response.data;
}

export async function updateGate(gateId: string, data: GateUpdate): Promise<GateRead> {
  const response = await apiClient.put<GateRead>(`/gates/${gateId}`, data);
  return response.data;
}

export async function deleteGate(gateId: string): Promise<void> {
  await apiClient.delete(`/gates/${gateId}`);
}

// ---------------------------------------------------------------------------
// Live gate health (open monitoring endpoints)
// ---------------------------------------------------------------------------

export async function listGateHealth(): Promise<GateHealthEntry[]> {
  const response = await apiClient.get<GateHealthEntry[]>('/api/gates/status');
  return response.data;
}

export async function openGateBarrier(gateCode: string): Promise<{ status: string }> {
  const response = await apiClient.post(`/api/gates/${gateCode}/barrier/open`);
  return response.data;
}

export async function pulseGateRelay(
  gateCode: string,
  outputId: string,
): Promise<{ status: string }> {
  const response = await apiClient.post(`/api/gates/${gateCode}/relay/${outputId}/pulse`);
  return response.data;
}