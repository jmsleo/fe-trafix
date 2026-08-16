'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  blockMember,
  createMember,
  createMemberSubscription,
  createMemberVehicle,
  createSubscriptionPlan,
  cancelMemberSubscription,
  deleteMember,
  deleteMemberSubscription,
  deleteMemberVehicle,
  deleteSubscriptionPlan,
  getMember,
  getMemberSubscription,
  getMemberVehicle,
  getSubscriptionPlan,
  listMembers,
  listMemberSubscriptions,
  listMemberVehicles,
  listSubscriptionPlans,
  updateMember,
  updateMemberVehicle,
  updateSubscriptionPlan,
  updateSubscriptionPlanStatus,
} from '@/lib/api/members';
import type {
  MemberCreate,
  MemberListParams,
  MemberSubscriptionCreate,
  MemberUpdate,
  MemberVehicleCreate,
  MemberVehicleListParams,
  MemberVehicleUpdate,
  MemberSubscriptionListParams,
  SubscriptionPlanCreate,
  SubscriptionPlanListParams,
  SubscriptionPlanStatusUpdate,
  SubscriptionPlanUpdate,
} from '@/lib/api/types';

export const memberKeys = {
  all: ['members'] as const,
  list: (params?: MemberListParams) => [...memberKeys.all, 'list', params] as const,
  detail: (id: string) => [...memberKeys.all, 'detail', id] as const,
  vehicles: ['member-vehicles'] as const,
  subscriptions: ['member-subscriptions'] as const,
  plans: ['subscription-plans'] as const,
};

// ---------------------------------------------------------------------------
// Members
// ---------------------------------------------------------------------------

export function useMembers(params?: MemberListParams) {
  return useQuery({
    queryKey: memberKeys.list(params),
    queryFn: () => listMembers(params),
  });
}

export function useMember(id: string) {
  return useQuery({
    queryKey: memberKeys.detail(id),
    queryFn: () => getMember(id),
    enabled: !!id,
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MemberCreate) => createMember(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.all }),
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MemberUpdate }) => updateMember(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.all }),
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMember(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.all }),
  });
}

export function useBlockMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blockMember(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.all }),
  });
}

// ---------------------------------------------------------------------------
// Member Vehicles
// ---------------------------------------------------------------------------

export function useMemberVehicles(params?: MemberVehicleListParams) {
  return useQuery({
    queryKey: [...memberKeys.vehicles, 'list', params] as const,
    queryFn: () => listMemberVehicles(params),
  });
}

export function useMemberVehicle(id: string) {
  return useQuery({
    queryKey: [...memberKeys.vehicles, 'detail', id] as const,
    queryFn: () => getMemberVehicle(id),
    enabled: !!id,
  });
}

export function useCreateMemberVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MemberVehicleCreate) => createMemberVehicle(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.vehicles }),
  });
}

export function useUpdateMemberVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MemberVehicleUpdate }) =>
      updateMemberVehicle(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.vehicles }),
  });
}

export function useDeleteMemberVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMemberVehicle(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.vehicles }),
  });
}

// ---------------------------------------------------------------------------
// Subscription Plans
// ---------------------------------------------------------------------------

export function useSubscriptionPlans(params?: SubscriptionPlanListParams) {
  return useQuery({
    queryKey: [...memberKeys.plans, 'list', params] as const,
    queryFn: () => listSubscriptionPlans(params),
  });
}

export function useSubscriptionPlan(id: string) {
  return useQuery({
    queryKey: [...memberKeys.plans, 'detail', id] as const,
    queryFn: () => getSubscriptionPlan(id),
    enabled: !!id,
  });
}

export function useCreateSubscriptionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SubscriptionPlanCreate) => createSubscriptionPlan(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.plans }),
  });
}

export function useUpdateSubscriptionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubscriptionPlanUpdate }) =>
      updateSubscriptionPlan(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.plans }),
  });
}

export function useDeleteSubscriptionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSubscriptionPlan(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.plans }),
  });
}

export function useUpdateSubscriptionPlanStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubscriptionPlanStatusUpdate }) =>
      updateSubscriptionPlanStatus(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.plans }),
  });
}

// ---------------------------------------------------------------------------
// Member Subscriptions
// ---------------------------------------------------------------------------

export function useMemberSubscriptions(params?: MemberSubscriptionListParams) {
  return useQuery({
    queryKey: [...memberKeys.subscriptions, 'list', params] as const,
    queryFn: () => listMemberSubscriptions(params),
  });
}

export function useMemberSubscription(id: string) {
  return useQuery({
    queryKey: [...memberKeys.subscriptions, 'detail', id] as const,
    queryFn: () => getMemberSubscription(id),
    enabled: !!id,
  });
}

export function useCreateMemberSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MemberSubscriptionCreate) => createMemberSubscription(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.subscriptions }),
  });
}

export function useDeleteMemberSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMemberSubscription(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.subscriptions }),
  });
}

export function useCancelMemberSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelMemberSubscription(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memberKeys.subscriptions }),
  });
}
