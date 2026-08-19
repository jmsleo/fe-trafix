import { apiClient } from './client';
import type {
  MonitoringMqtt,
  MqttConfig,
  MqttConfigUpdate,
  SystemHealth,
} from './types';

export async function getSystemHealth(): Promise<SystemHealth> {
  const response = await apiClient.get<SystemHealth>('/api/system/health');
  return response.data;
}

export async function getMonitoringMqtt(): Promise<MonitoringMqtt> {
  const response = await apiClient.get<MonitoringMqtt>('/api/monitoring/mqtt');
  return response.data;
}

export async function getMqttConfig(): Promise<MqttConfig> {
  const response = await apiClient.get<MqttConfig>('/api/system/mqtt/config');
  return response.data;
}

export async function updateMqttConfig(data: MqttConfigUpdate): Promise<MqttConfig> {
  const response = await apiClient.put<MqttConfig>('/api/system/mqtt/config', data);
  return response.data;
}