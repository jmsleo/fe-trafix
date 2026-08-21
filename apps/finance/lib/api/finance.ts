import { apiClient } from './client';
import type {
  ExecutiveInsightResponse,
  GateEventReportParams,
  GateEventReportResponse,
  MemberReportParams,
  MemberReportResponse,
  OperatorPerformanceParams,
  OperatorPerformanceResponse,
  PaymentDistributionResponse,
  PendingTicketParams,
  PendingTicketResponse,
  RevenueByShiftResponse,
  RevenueReportParams,
  RevenueReportResponse,
  RevenueTodayResponse,
  TransactionReportParams,
  TransactionReportResponse,
  VehicleDistributionResponse,
  VehicleReportParams,
  VehicleReportResponse,
} from './types';

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export async function getRevenueToday(): Promise<RevenueTodayResponse> {
  const response = await apiClient.get<RevenueTodayResponse>('/finance/dashboard/revenue/today');
  return response.data;
}

export async function getRevenueByShift(): Promise<RevenueByShiftResponse> {
  const response = await apiClient.get<RevenueByShiftResponse>('/finance/dashboard/revenue/shift');
  return response.data;
}

export async function getVehicleDistribution(): Promise<VehicleDistributionResponse> {
  const response = await apiClient.get<VehicleDistributionResponse>('/finance/dashboard/vehicle-distribution');
  return response.data;
}

export async function getPaymentDistribution(): Promise<PaymentDistributionResponse> {
  const response = await apiClient.get<PaymentDistributionResponse>('/finance/dashboard/payment-distribution');
  return response.data;
}

export async function getExecutiveInsight(): Promise<ExecutiveInsightResponse> {
  const response = await apiClient.get<ExecutiveInsightResponse>('/finance/dashboard/executive-insight');
  return response.data;
}

// ---------------------------------------------------------------------------
// Laporan
// ---------------------------------------------------------------------------

export async function getTransactionReport(
  params?: TransactionReportParams,
): Promise<TransactionReportResponse> {
  const response = await apiClient.get<TransactionReportResponse>('/finance/reports/transactions', { params });
  return response.data;
}

export async function getPendingTickets(
  params?: PendingTicketParams,
): Promise<PendingTicketResponse> {
  const response = await apiClient.get<PendingTicketResponse>('/finance/reports/pending-tickets', { params });
  return response.data;
}

export async function getRevenueReport(
  params?: RevenueReportParams,
): Promise<RevenueReportResponse> {
  const response = await apiClient.get<RevenueReportResponse>('/finance/reports/revenue', { params });
  return response.data;
}

export async function getVehicleSummaryReport(
  params?: VehicleReportParams,
): Promise<VehicleReportResponse> {
  const response = await apiClient.get<VehicleReportResponse>('/finance/reports/vehicles', { params });
  return response.data;
}

export async function getOperatorPerformance(
  params?: OperatorPerformanceParams,
): Promise<OperatorPerformanceResponse> {
  const response = await apiClient.get<OperatorPerformanceResponse>('/finance/reports/operator-performance', { params });
  return response.data;
}

export async function getMemberReport(
  params?: MemberReportParams,
): Promise<MemberReportResponse> {
  const response = await apiClient.get<MemberReportResponse>('/finance/reports/members', { params });
  return response.data;
}

export async function getGateEvents(
  params?: GateEventReportParams,
): Promise<GateEventReportResponse> {
  const response = await apiClient.get<GateEventReportResponse>('/finance/reports/gate-events', { params });
  return response.data;
}
