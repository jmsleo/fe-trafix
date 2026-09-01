'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  endPosSession,
  getMyAssignedShifts,
  getPosRefs,
  getPosSession,
  manualTransaction,
  printReceipt,
  quoteTransaction,
  reprintTicket,
  settleTransaction,
  startPosSession,
  voidTransaction,
} from '@/lib/api/pos';
import type {
  PosManualRequest,
  PosPrintRequest,
  PosQuoteRequest,
  PosVoidRequest,
  SessionStartRequest,
} from '@/lib/api/types';

export const posKeys = {
  refs: ['pos', 'refs'] as const,
  session: ['pos', 'session'] as const,
  myShifts: ['pos', 'my-shifts'] as const,
};

export function usePosRefs() {
  return useQuery({
    queryKey: posKeys.refs,
    queryFn: getPosRefs,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMyShifts(enabled = true) {
  return useQuery({
    queryKey: posKeys.myShifts,
    queryFn: getMyAssignedShifts,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePosSession() {
  return useQuery({
    queryKey: posKeys.session,
    queryFn: getPosSession,
    retry: false,
  });
}

export function useStartPosSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SessionStartRequest) => startPosSession(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: posKeys.session }),
  });
}

export function useEndPosSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => endPosSession(sessionId),
    onSettled: () => queryClient.invalidateQueries({ queryKey: posKeys.session }),
  });
}

export function useQuote() {
  return useMutation({
    mutationFn: (payload: PosQuoteRequest) => quoteTransaction(payload),
  });
}

export function useSettle() {
  return useMutation({
    mutationFn: (payload: PosQuoteRequest) => settleTransaction(payload),
  });
}

export function useManualTransaction() {
  return useMutation({
    mutationFn: (payload: PosManualRequest) => manualTransaction(payload),
  });
}

export function useVoid() {
  return useMutation({
    mutationFn: (payload: PosVoidRequest) => voidTransaction(payload),
  });
}

export function useReprint() {
  return useMutation({
    mutationFn: (payload: PosPrintRequest) => reprintTicket(payload),
  });
}

export function useReceipt() {
  return useMutation({
    mutationFn: (payload: PosPrintRequest) => printReceipt(payload),
  });
}