'use client';

import { useQuery } from '@tanstack/react-query';
import type { DashboardFilterParams } from '@/lib/api/types';
import {
  getDashboardShifts,
  getExecutiveInsight,
  getPaymentDistribution,
  getRevenueByShift,
  getRevenueToday,
  getVehicleDistribution,
} from '@/lib/api/finance';

export const financeDashboardKeys = {
  all: ['finance-dashboard'] as const,
  shifts: () => [...financeDashboardKeys.all, 'shifts'] as const,
  revenueToday: (params?: DashboardFilterParams) =>
    [...financeDashboardKeys.all, 'revenue-today', params] as const,
  revenueByShift: (params?: DashboardFilterParams) =>
    [...financeDashboardKeys.all, 'revenue-by-shift', params] as const,
  vehicleDistribution: (params?: DashboardFilterParams) =>
    [...financeDashboardKeys.all, 'vehicle-distribution', params] as const,
  paymentDistribution: (params?: DashboardFilterParams) =>
    [...financeDashboardKeys.all, 'payment-distribution', params] as const,
  executiveInsight: (params?: DashboardFilterParams) =>
    [...financeDashboardKeys.all, 'executive-insight', params] as const,
};

export function useDashboardShifts() {
  return useQuery({
    queryKey: financeDashboardKeys.shifts(),
    queryFn: getDashboardShifts,
  });
}

export function useRevenueToday(params?: DashboardFilterParams) {
  return useQuery({
    queryKey: financeDashboardKeys.revenueToday(params),
    queryFn: () => getRevenueToday(params),
  });
}

export function useRevenueByShift(params?: DashboardFilterParams) {
  return useQuery({
    queryKey: financeDashboardKeys.revenueByShift(params),
    queryFn: () => getRevenueByShift(params),
  });
}

export function useVehicleDistribution(params?: DashboardFilterParams) {
  return useQuery({
    queryKey: financeDashboardKeys.vehicleDistribution(params),
    queryFn: () => getVehicleDistribution(params),
  });
}

export function usePaymentDistribution(params?: DashboardFilterParams) {
  return useQuery({
    queryKey: financeDashboardKeys.paymentDistribution(params),
    queryFn: () => getPaymentDistribution(params),
  });
}

export function useExecutiveInsight(params?: DashboardFilterParams) {
  return useQuery({
    queryKey: financeDashboardKeys.executiveInsight(params),
    queryFn: () => getExecutiveInsight(params),
  });
}
