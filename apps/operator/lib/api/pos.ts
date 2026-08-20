import { apiClient, tokenStorage } from './client';
import type {
  OperatorSession,
  PosActionResponse,
  PosManualRequest,
  PosPrintRequest,
  PosQuoteRequest,
  PosQuoteResponse,
  PosRefs,
  PosSettleResponse,
  PosVoidRequest,
  SessionStartRequest,
} from './types';

export async function getPosRefs(): Promise<PosRefs> {
  const response = await apiClient.get<PosRefs>('/api/pos/refs');
  return response.data;
}

export async function getPosSession(): Promise<OperatorSession> {
  const response = await apiClient.get<OperatorSession>('/api/pos/session');
  return response.data;
}

export async function startPosSession(data: SessionStartRequest): Promise<OperatorSession> {
  const response = await apiClient.post<OperatorSession>('/operator-sessions/start', data);
  return response.data;
}

export async function endPosSession(sessionId: string): Promise<OperatorSession> {
  const response = await apiClient.post<OperatorSession>(`/operator-sessions/${sessionId}/end`);
  return response.data;
}

export async function quoteTransaction(payload: PosQuoteRequest): Promise<PosQuoteResponse> {
  const response = await apiClient.post<PosQuoteResponse>('/api/pos/transactions/quote', payload);
  return response.data;
}

export async function settleTransaction(payload: PosQuoteRequest): Promise<PosSettleResponse> {
  const response = await apiClient.post<PosSettleResponse>('/api/pos/transactions/settle', payload);
  return response.data;
}

export async function manualTransaction(payload: PosManualRequest): Promise<PosSettleResponse> {
  const response = await apiClient.post<PosSettleResponse>('/api/pos/transactions/manual', payload);
  return response.data;
}

export async function voidTransaction(payload: PosVoidRequest): Promise<PosActionResponse> {
  const response = await apiClient.post<PosActionResponse>('/api/pos/transactions/void', payload);
  return response.data;
}

export async function reprintTicket(payload: PosPrintRequest): Promise<PosActionResponse> {
  const response = await apiClient.post<PosActionResponse>('/api/pos/transactions/reprint', payload);
  return response.data;
}

export async function printReceipt(payload: PosPrintRequest): Promise<PosActionResponse> {
  const response = await apiClient.post<PosActionResponse>('/api/pos/transactions/receipt', payload);
  return response.data;
}

export function posEventStreamUrl(gate?: string): string {
  const base = apiClient.defaults.baseURL ?? '';
  const token = tokenStorage.getAccessToken();
  const params = new URLSearchParams();
  if (gate) params.set('gate', gate);
  if (token) params.set('token', token);
  const qs = params.toString();
  return `${base}/api/pos/events/stream${qs ? `?${qs}` : ''}`;
}

export function formatRupiah(value: number | null | undefined): string {
  const amount = Number(value ?? 0);
  return `Rp ${amount.toLocaleString('id-ID')},00`;
}