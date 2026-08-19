'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMonitoringMqtt,
  getMqttConfig,
  getSystemHealth,
  updateMqttConfig,
} from '@/lib/api/system';
import type { MqttConfigUpdate } from '@/lib/api/types';

export const systemKeys = {
  all: ['system'] as const,
  health: ['system', 'health'] as const,
  mqtt: ['system', 'mqtt'] as const,
  mqttConfig: ['system', 'mqtt', 'config'] as const,
};

export function useSystemHealth(refetchInterval?: number) {
  return useQuery({
    queryKey: systemKeys.health,
    queryFn: getSystemHealth,
    refetchInterval,
  });
}

export function useMonitoringMqtt(refetchInterval?: number) {
  return useQuery({
    queryKey: systemKeys.mqtt,
    queryFn: getMonitoringMqtt,
    refetchInterval,
  });
}

export function useMqttConfig() {
  return useQuery({
    queryKey: systemKeys.mqttConfig,
    queryFn: getMqttConfig,
  });
}

export function useUpdateMqttConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MqttConfigUpdate) => updateMqttConfig(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: systemKeys.mqttConfig }),
  });
}