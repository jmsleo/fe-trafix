'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getExecutiveInsight,
  getPaymentDistribution,
  getRevenueByShift,
  getRevenueToday,
  getVehicleDistribution,
} from '@/lib/api/finance';

export const financeDashboardKeys = {
  all: ['finance-dashboard'] as const,
  revenueToday: () => [...financeDashboardKeys.all, 'revenue-today'] as const,
  revenueByShift: () => [...financeDashboardKeys.all, 'revenue-by-shift'] as const,
  vehicleDistribution: () => [...financeDashboardKeys.all, 'vehicle-distribution'] as const,
  paymentDistribution: () => [...financeDashboardKeys.all, 'payment-distribution'] as const,
  executiveInsight: () => [...financeDashboardKeys.all, 'executive-insight'] as const,
};

export function useRevenueToday() {
  return useQuery({
    queryKey: financeDashboardKeys.revenueToday(),
    queryFn: getRevenueToday,
  });
}

export function useRevenueByShift() {
  return useQuery({
    queryKey: financeDashboardKeys.revenueByShift(),
    queryFn: getRevenueByShift,
  });
}

export function useVehicleDistribution() {
  return useQuery({
    queryKey: financeDashboardKeys.vehicleDistribution(),
    queryFn: getVehicleDistribution,
  });
}

export function usePaymentDistribution() {
  return useQuery({
    queryKey: financeDashboardKeys.paymentDistribution(),
    queryFn: getPaymentDistribution,
  });
}

export function useExecutiveInsight() {
  return useQuery({
    queryKey: financeDashboardKeys.executiveInsight(),
    queryFn: getExecutiveInsight,
  });
}
