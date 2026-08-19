import { tokenStorage } from './client';
import type { MonitoringSnapshot } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const MIN_RETRY_MS = 1000;
const MAX_RETRY_MS = 30000;

export type StreamStatus = 'connecting' | 'connected' | 'disconnected';

export interface MonitoringEventSourceOptions {
  onSnapshot: (snapshot: MonitoringSnapshot) => void;
  onStateChange?: (status: StreamStatus) => void;
}

/**
 * Fetch-based Server-Sent Events client for the monitoring stream.
 *
 * Native `EventSource` cannot send an `Authorization` header, so we read the
 * stream manually with `fetch` + `ReadableStream` and reconnect with backoff.
 * The monitoring stream endpoint is open, but we still attach the JWT when
 * present so it works behind auth-gated proxies too.
 */
export class MonitoringEventSource {
  private controller: AbortController | null = null;
  private retryMs = MIN_RETRY_MS;
  private closed = false;
  private status: StreamStatus = 'disconnected';

  constructor(private readonly options: MonitoringEventSourceOptions) {}

  start(): void {
    this.closed = false;
    void this.connect();
  }

  close(): void {
    this.closed = true;
    this.controller?.abort();
    this.controller = null;
    this.setStatus('disconnected');
  }

  private async connect(): Promise<void> {
    if (this.closed) return;
    this.setStatus('connecting');

    const controller = new AbortController();
    this.controller = controller;
    const token = tokenStorage.getAccessToken();

    try {
      const response = await fetch(`${BASE_URL}/api/monitoring/stream`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        throw new Error(`SSE stream HTTP ${response.status}`);
      }

      this.retryMs = MIN_RETRY_MS;
      this.setStatus('connected');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (!this.closed && this.controller === controller) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let sep = buffer.indexOf('\n\n');
        while (sep !== -1) {
          const frame = buffer.slice(0, sep);
          buffer = buffer.slice(sep + 2);
          this.handleFrame(frame);
          sep = buffer.indexOf('\n\n');
        }
      }

      reader.releaseLock();
      if (this.closed) return;
    } catch {
      // Aborted on purpose or network error — either way schedule a reconnect
      // unless the consumer closed the stream.
      if (this.closed) return;
    }

    this.setStatus('disconnected');
    this.scheduleReconnect();
  }

  private scheduleReconnect(): void {
    if (this.closed) return;
    const delay = this.retryMs;
    this.retryMs = Math.min(this.retryMs * 2, MAX_RETRY_MS);
    setTimeout(() => void this.connect(), delay);
  }

  private handleFrame(raw: string): void {
    let event = 'message';
    let data = '';

    for (const line of raw.split('\n')) {
      if (line.startsWith(':')) continue;
      if (line.startsWith('event:')) {
        event = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        const value = line.slice(5).trimStart();
        data = data ? `${data}\n${value}` : value;
      }
    }

    if (event === 'snapshot' && data) {
      try {
        this.options.onSnapshot(JSON.parse(data) as MonitoringSnapshot);
      } catch {
        // Ignore malformed frames.
      }
    }
  }

  private setStatus(status: StreamStatus): void {
    if (this.status === status) return;
    this.status = status;
    this.options.onStateChange?.(status);
  }
}