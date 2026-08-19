'use client';

import { useSyncExternalStore, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listMonitoringDevices } from '@/lib/api/monitoring';
import { getMonitoringMqtt } from '@/lib/api/system';
import { MonitoringEventSource } from '@/lib/api/events';
import type { StreamStatus } from '@/lib/api/events';
import type { MonitoringSnapshot } from '@/lib/api/types';
import { monitoringKeys } from '@/hooks/useMonitoring';

const FALLBACK_POLL_MS = 30000;

let subscriberCount = 0;
let source: MonitoringEventSource | null = null;
let status: StreamStatus = 'disconnected';
const statusListeners = new Set<() => void>();

function setStatus(next: StreamStatus) {
  status = next;
  statusListeners.forEach((listener) => listener());
}

function subscribeStatus(listener: () => void) {
  statusListeners.add(listener);
  return () => {
    statusListeners.delete(listener);
  };
}

function getStatus(): StreamStatus {
  return status;
}

/**
 * Keeps a single shared SSE connection to `/api/monitoring/stream` alive while
 * at least one subscriber is mounted, writing every `snapshot` frame into the
 * React Query cache under `monitoringKeys.snapshot`.
 */
export function useMonitoringStream(): StreamStatus {
  const queryClient = useQueryClient();
  const current = useSyncExternalStore(subscribeStatus, getStatus, getStatus);

  useEffect(() => {
    subscriberCount += 1;
    if (subscriberCount === 1) {
      source = new MonitoringEventSource({
        onSnapshot: (snapshot: MonitoringSnapshot) => {
          queryClient.setQueryData<MonitoringSnapshot>(monitoringKeys.snapshot, snapshot);
        },
        onStateChange: setStatus,
      });
      source.start();
    }
    return () => {
      subscriberCount -= 1;
      if (subscriberCount === 0) {
        source?.close();
        source = null;
        setStatus('disconnected');
      }
    };
  }, [queryClient]);

  return current;
}

async function fetchSnapshotFallback(): Promise<MonitoringSnapshot> {
  const [devices, mqtt] = await Promise.all([
    listMonitoringDevices({ page_size: 100, probe: true }),
    getMonitoringMqtt(),
  ]);
  return { devices, mqtt };
}

/**
 * Live monitoring snapshot backed by the SSE stream. While the stream is
 * connected it is pushed into the query cache (no HTTP polling); when the
 * stream is down we fall back to a REST poll every 30s.
 */
export function useMonitoringSnapshot() {
  const streamStatus = useMonitoringStream();
  return useQuery({
    queryKey: monitoringKeys.snapshot,
    queryFn: fetchSnapshotFallback,
    refetchInterval: streamStatus === 'connected' ? false : FALLBACK_POLL_MS,
  });
}