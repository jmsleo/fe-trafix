import { apiClient } from './client';
import type { SearchStatusParams, VehicleTypeCreate, VehicleTypePage, VehicleTypeRead, VehicleTypeUpdate } from './types';

export async function listVehicleTypes(params?: SearchStatusParams): Promise<VehicleTypePage> {
  const response = await apiClient.get<VehicleTypePage>('/vehicle-types/', { params });
  return response.data;
}

export async function getVehicleType(vehicleTypeId: string): Promise<VehicleTypeRead> {
  const response = await apiClient.get<VehicleTypeRead>(`/vehicle-types/${vehicleTypeId}`);
  return response.data;
}

export async function createVehicleType(data: VehicleTypeCreate): Promise<VehicleTypeRead> {
  const response = await apiClient.post<VehicleTypeRead>('/vehicle-types/', data);
  return response.data;
}

export async function updateVehicleType(
  vehicleTypeId: string,
  data: VehicleTypeUpdate,
): Promise<VehicleTypeRead> {
  const response = await apiClient.put<VehicleTypeRead>(`/vehicle-types/${vehicleTypeId}`, data);
  return response.data;
}

export async function deleteVehicleType(vehicleTypeId: string): Promise<void> {
  await apiClient.delete(`/vehicle-types/${vehicleTypeId}`);
}
