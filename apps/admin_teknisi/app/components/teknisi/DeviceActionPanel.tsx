'use client';

import React, { useMemo, useState } from 'react';
import { useMonitoringDevices } from '@/hooks/useMonitoring';
import { KIND_LABELS, formatTime } from './constants';
import StatusBadge from './StatusBadge';
import type { DeviceKind, DeviceMonitorItem } from '@/lib/api/types';

interface DeviceActionPanelProps {
  title: string;
  description: string;
  actionLabel: string;
  pendingLabel: string;
  isPending: boolean;
  onRun: (device: DeviceMonitorItem) => void;
  renderResult?: React.ReactNode;
  initialKind?: string;
}

const KIND_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Semua Tipe' },
  { value: 'controller', label: 'Controller' },
  { value: 'lpr', label: 'Kamera LPR' },
  { value: 'reader', label: 'Reader' },
  { value: 'signage', label: 'Signage' },
];

export default function DeviceActionPanel({
  title,
  description,
  actionLabel,
  pendingLabel,
  isPending,
  onRun,
  renderResult,
  initialKind = '',
}: DeviceActionPanelProps) {
  const [kind, setKind] = useState(initialKind);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string>('');

  const { data, isLoading } = useMonitoringDevices(
    {
      search: search || null,
      kind: (kind === '' ? null : kind) as DeviceKind | null,
      page_size: 100,
    },
    10000,
  );

  const selected = useMemo(
    () => (data?.items ?? []).find((d) => d.id === selectedId) ?? null,
    [data, selectedId],
  );

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-[#EAE1D8]">{title}</h1>
      <p className="text-sm text-gray-400">{description}</p>

      <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent max-w-2xl">
        <div className="px-6 py-4 bg-[#231F1A] border-b border-[#B5884D]/30">
          <h2 className="text-lg font-bold text-[#BF8F51]">Pilih Device</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Tipe Device</label>
              <select
                value={kind}
                onChange={(e) => {
                  setKind(e.target.value);
                  setSelectedId('');
                }}
                className="w-full appearance-none px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]"
              >
                {KIND_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Cari Device</label>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedId('');
                }}
                placeholder="Cari nama / IP..."
                className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Device</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              disabled={isLoading}
              className="w-full appearance-none px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] disabled:opacity-50"
            >
              <option value="">{isLoading ? 'Memuat device...' : 'Pilih Device'}</option>
              {(data?.items ?? []).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.gate_code ?? '-'}) · {d.ip_address}
                </option>
              ))}
            </select>
          </div>

          {selected && (
            <div className="rounded-[9px] border border-[#B5884D]/40 bg-[#231F1A] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#EAE1D8]">{selected.name}</p>
                  <p className="text-xs text-gray-500">
                    {KIND_LABELS[selected.kind] ?? selected.type} · {selected.gate_code ?? '-'} ·{' '}
                    {selected.ip_address} · Last: {formatTime(selected.last_heartbeat)}
                  </p>
                </div>
                <StatusBadge status={selected.status} />
              </div>
            </div>
          )}

          <button
            onClick={() => selected && onRun(selected)}
            disabled={!selected || isPending}
            className="w-full px-4 py-2.5 text-sm font-semibold text-[#17130E] bg-gradient-to-r from-[#BF8F51] to-[#523D22] rounded-[9px] hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? pendingLabel : actionLabel}
          </button>

          {renderResult}
        </div>
      </div>
    </div>
  );
}