import { apiClient } from './client';
import type {
  MemberCreate,
  MemberListParams,
  MemberPage,
  MemberRead,
  MemberSubscriptionCreate,
  MemberSubscriptionListParams,
  MemberSubscriptionPage,
  MemberSubscriptionRead,
  MemberUpdate,
  MemberVehicleCreate,
  MemberVehicleListParams,
  MemberVehiclePage,
  MemberVehicleRead,
  MemberVehicleUpdate,
  SubscriptionPlanCreate,
  SubscriptionPlanListParams,
  SubscriptionPlanPage,
  SubscriptionPlanRead,
  SubscriptionPlanStatusUpdate,
  SubscriptionPlanUpdate,
} from './types';

// ---------------------------------------------------------------------------
// Members
// ---------------------------------------------------------------------------

export async function listMembers(params?: MemberListParams): Promise<MemberPage> {
  const response = await apiClient.get<MemberPage>('/members/', { params });
  return response.data;
}

export async function getMember(memberId: string): Promise<MemberRead> {
  const response = await apiClient.get<MemberRead>(`/members/${memberId}`);
  return response.data;
}

export async function createMember(data: MemberCreate): Promise<MemberRead> {
  const response = await apiClient.post<MemberRead>('/members/', data);
  return response.data;
}

export async function updateMember(memberId: string, data: MemberUpdate): Promise<MemberRead> {
  const response = await apiClient.put<MemberRead>(`/members/${memberId}`, data);
  return response.data;
}

export async function deleteMember(memberId: string): Promise<void> {
  await apiClient.delete(`/members/${memberId}`);
}

export async function blockMember(memberId: string): Promise<MemberRead> {
  const response = await apiClient.patch<MemberRead>(`/members/${memberId}/block`);
  return response.data;
}

// ---------------------------------------------------------------------------
// Member Vehicles
// ---------------------------------------------------------------------------

export async function listMemberVehicles(
  params?: MemberVehicleListParams,
): Promise<MemberVehiclePage> {
  const response = await apiClient.get<MemberVehiclePage>('/member-vehicles/', { params });
  return response.data;
}

export async function getMemberVehicle(vehicleId: string): Promise<MemberVehicleRead> {
  const response = await apiClient.get<MemberVehicleRead>(`/member-vehicles/${vehicleId}`);
  return response.data;
}

export async function createMemberVehicle(data: MemberVehicleCreate): Promise<MemberVehicleRead> {
  const response = await apiClient.post<MemberVehicleRead>('/member-vehicles/', data);
  return response.data;
}

export async function updateMemberVehicle(
  vehicleId: string,
  data: MemberVehicleUpdate,
): Promise<MemberVehicleRead> {
  const response = await apiClient.put<MemberVehicleRead>(`/member-vehicles/${vehicleId}`, data);
  return response.data;
}

export async function deleteMemberVehicle(vehicleId: string): Promise<void> {
  await apiClient.delete(`/member-vehicles/${vehicleId}`);
}

// ---------------------------------------------------------------------------
// Subscription Plans
// ---------------------------------------------------------------------------

export async function listSubscriptionPlans(
  params?: SubscriptionPlanListParams,
): Promise<SubscriptionPlanPage> {
  const response = await apiClient.get<SubscriptionPlanPage>('/subscription-plans/', { params });
  return response.data;
}

export async function getSubscriptionPlan(planId: string): Promise<SubscriptionPlanRead> {
  const response = await apiClient.get<SubscriptionPlanRead>(`/subscription-plans/${planId}`);
  return response.data;
}

export async function createSubscriptionPlan(
  data: SubscriptionPlanCreate,
): Promise<SubscriptionPlanRead> {
  const response = await apiClient.post<SubscriptionPlanRead>('/subscription-plans/', data);
  return response.data;
}

export async function updateSubscriptionPlan(
  planId: string,
  data: SubscriptionPlanUpdate,
): Promise<SubscriptionPlanRead> {
  const response = await apiClient.put<SubscriptionPlanRead>(`/subscription-plans/${planId}`, data);
  return response.data;
}

export async function deleteSubscriptionPlan(planId: string): Promise<void> {
  await apiClient.delete(`/subscription-plans/${planId}`);
}

export async function updateSubscriptionPlanStatus(
  planId: string,
  data: SubscriptionPlanStatusUpdate,
): Promise<SubscriptionPlanRead> {
  const response = await apiClient.patch<SubscriptionPlanRead>(
    `/subscription-plans/${planId}/status`,
    data,
  );
  return response.data;
}

// ---------------------------------------------------------------------------
// Member Subscriptions
// ---------------------------------------------------------------------------

export async function listMemberSubscriptions(
  params?: MemberSubscriptionListParams,
): Promise<MemberSubscriptionPage> {
  const response = await apiClient.get<MemberSubscriptionPage>('/member-subscriptions/', {
    params,
  });
  return response.data;
}

export async function getMemberSubscription(
  subscriptionId: string,
): Promise<MemberSubscriptionRead> {
  const response = await apiClient.get<MemberSubscriptionRead>(
    `/member-subscriptions/${subscriptionId}`,
  );
  return response.data;
}

export async function createMemberSubscription(
  data: MemberSubscriptionCreate,
): Promise<MemberSubscriptionRead> {
  const response = await apiClient.post<MemberSubscriptionRead>('/member-subscriptions/', data);
  return response.data;
}

export async function deleteMemberSubscription(subscriptionId: string): Promise<void> {
  await apiClient.delete(`/member-subscriptions/${subscriptionId}`);
}

export async function cancelMemberSubscription(
  subscriptionId: string,
): Promise<MemberSubscriptionRead> {
  const response = await apiClient.post<MemberSubscriptionRead>(
    `/member-subscriptions/${subscriptionId}/cancel`,
  );
  return response.data;
}
