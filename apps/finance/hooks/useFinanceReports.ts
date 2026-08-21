'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getGateEvents,
  getMemberReport,
  getOperatorPerformance,
  getPendingTickets,
  getRevenueReport,
  getTransactionReport,
  getVehicleSummaryReport,
} from '@/lib/api/finance';
import type {
  GateEventReportParams,
  MemberReportParams,
  OperatorPerformanceParams,
  PendingTicketParams,
  RevenueReportParams,
  TransactionReportParams,
  VehicleReportParams,
} from '@/lib/api/types';

export const financeReportsKeys = {
  all: ['finance-reports'] as const,
  transactions: (params?: TransactionReportParams) =>
    [...financeReportsKeys.all, 'transactions', params ?? {}] as const,
  pendingTickets: (params?: PendingTicketParams) =>
    [...financeReportsKeys.all, 'pending-tickets', params ?? {}] as const,
  revenue: (params?: RevenueReportParams) =>
    [...financeReportsKeys.all, 'revenue', params ?? {}] as const,
  vehicles: (params?: VehicleReportParams) =>
    [...financeReportsKeys.all, 'vehicles', params ?? {}] as const,
  operatorPerformance: (params?: OperatorPerformanceParams) =>
    [...financeReportsKeys.all, 'operator-performance', params ?? {}] as const,
  members: (params?: MemberReportParams) =>
    [...financeReportsKeys.all, 'members', params ?? {}] as const,
  gateEvents: (params?: GateEventReportParams) =>
    [...financeReportsKeys.all, 'gate-events', params ?? {}] as const,
};

export function useTransactionReport(params?: TransactionReportParams) {
  return useQuery({
    queryKey: financeReportsKeys.transactions(params),
    queryFn: () => getTransactionReport(params),
    placeholderData: (previous) => previous,
  });
}

export function usePendingTickets(params?: PendingTicketParams) {
  return useQuery({
    queryKey: financeReportsKeys.pendingTickets(params),
    queryFn: () => getPendingTickets(params),
    placeholderData: (previous) => previous,
  });
}

export function useRevenueReport(params?: RevenueReportParams) {
  return useQuery({
    queryKey: financeReportsKeys.revenue(params),
    queryFn: () => getRevenueReport(params),
  });
}

export function useVehicleSummaryReport(params?: VehicleReportParams) {
  return useQuery({
    queryKey: financeReportsKeys.vehicles(params),
    queryFn: () => getVehicleSummaryReport(params),
  });
}

export function useOperatorPerformance(params?: OperatorPerformanceParams) {
  return useQuery({
    queryKey: financeReportsKeys.operatorPerformance(params),
    queryFn: () => getOperatorPerformance(params),
  });
}

export function useMemberReport(params?: MemberReportParams) {
  return useQuery({
    queryKey: financeReportsKeys.members(params),
    queryFn: () => getMemberReport(params),
    placeholderData: (previous) => previous,
  });
}

export function useGateEvents(params?: GateEventReportParams) {
  return useQuery({
    queryKey: financeReportsKeys.gateEvents(params),
    queryFn: () => getGateEvents(params),
    placeholderData: (previous) => previous,
  });
}
