import { apiClient } from './client';
import type {
  ParkingRateCreate,
  ParkingRatePage,
  ParkingRateRead,
  ParkingRateStatusUpdate,
  ParkingRateUpdate,
  SearchStatusParams,
} from './types';

export async function listParkingRates(params?: SearchStatusParams): Promise<ParkingRatePage> {
  const response = await apiClient.get<ParkingRatePage>('/parking-rates/', { params });
  return response.data;
}

export async function getParkingRate(parkingRateId: string): Promise<ParkingRateRead> {
  const response = await apiClient.get<ParkingRateRead>(`/parking-rates/${parkingRateId}`);
  return response.data;
}

export async function createParkingRate(data: ParkingRateCreate): Promise<ParkingRateRead> {
  const response = await apiClient.post<ParkingRateRead>('/parking-rates/', data);
  return response.data;
}

export async function updateParkingRate(
  parkingRateId: string,
  data: ParkingRateUpdate,
): Promise<ParkingRateRead> {
  const response = await apiClient.put<ParkingRateRead>(`/parking-rates/${parkingRateId}`, data);
  return response.data;
}

export async function deleteParkingRate(parkingRateId: string): Promise<void> {
  await apiClient.delete(`/parking-rates/${parkingRateId}`);
}

export async function updateParkingRateStatus(
  parkingRateId: string,
  data: ParkingRateStatusUpdate,
): Promise<ParkingRateRead> {
  const response = await apiClient.patch<ParkingRateRead>(
    `/parking-rates/${parkingRateId}/status`,
    data,
  );
  return response.data;
}
