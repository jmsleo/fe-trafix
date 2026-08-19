'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMonitoringSnapshot } from '@/hooks/useMonitoringStream';
import { getSignageDisplayStatus } from '@/lib/api/monitoring';
import StatusBadge from '@/app/components/teknisi/StatusBadge';
import { formatTime } from '@/app/components/teknisi/constants';
import type { DeviceMonitorItem } from '@/lib/api/types';

const POLL_MS = 5000;

const signageKeys = {
  display: (gateCode: string) => ['monitoring', 'signage-display', gateCode] as const,
};

function DisplayPanel({ gateCode }: { gateCode: string }) {
  const { data, isError, refetch } = useQuery({
    queryKey: signageKeys.display(gateCode),
    queryFn: () => getSignageDisplayStatus(gateCode),
    refetchInterval: POLL_MS,
  });

  if (isError) {
    return (
      <div className="px-6 py-3 text-sm text-[#FF5656]">
        Gagal memuat status display.{' '}
        <button onClick={() => refetch()} className="text-[#B5884D] hover:underline">Coba lagi</button>
      </div>
    );
  }
  if (!data) {
    return <p className="px-6 py-3 text-sm text-gray-500">Memuat status display...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6 py-4">
      <div className="rounded-[9px] border border-[#B5884D]/40 bg-[#231F1A] p-4">
        <p className="text-xs text-gray-400">STATUS DISPLAY</p>
        <div className="mt-2">
          <StatusBadge status={data.status === 'online' ? 'online' : 'offline'} />
        </div>
      </div>
      <div className="rounded-[9px] border border-[#B5884D]/40 bg-[#231F1A] p-4">
        <p className="text-xs text-gray-400">PLAT NOMOR</p>
        <p className="mt-2 text-lg font-bold text-[#EAE1D8]">{data.plate_number ?? '-'}</p>
      </div>
      <div className="rounded-[9px] border border-[#B5884D]/40 bg-[#231F1A] p-4">
        <p className="text-xs text-gray-400">KODE TRANSAKSI</p>
        <p className="mt-2 text-lg font-bold text-[#EAE1D8]">{data.transaction_code ?? '-'}</p>
      </div>
      <div className="rounded-[9px] border border-[#B5884D]/40 bg-[#231F1A] p-4">
        <p className="text-xs text-gray-400">JUMLAH ADS</p>
        <p className="mt-2 text-lg font-bold text-[#EAE1D8]">{data.ads_count}</p>
      </div>
      <div className="rounded-[9px] border border-[#B5884D]/40 bg-[#231F1A] p-4">
        <p className="text-xs text-gray-400">JUMLAH MEDIA</p>
        <p className="mt-2 text-lg font-bold text-[#EAE1D8]">{data.media_count}</p>
      </div>
      <div className="rounded-[9px] border border-[#B5884D]/40 bg-[#231F1A] p-4">
        <p className="text-xs text-gray-400">IDLE IMAGE</p>
        <p className="mt-2 text-lg font-bold text-[#EAE1D8]">{data.has_idle_image ? 'Ada' : 'Tidak'}</p>
      </div>
      <div className="rounded-[9px] border border-[#B5884D]/40 bg-[#231F1A] p-4 col-span-full">
        <p className="text-xs text-gray-400">TERAKHIR DIPERBARUI</p>
        <p className="mt-2 text-sm text-[#EAE1D8]">{formatTime(data.last_updated)}</p>
      </div>
    </div>
  );
}

function SignageCard({ device }: { device: DeviceMonitorItem }) {
  return (
    <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent">
      <div className="flex items-center justify-between px-6 py-4 bg-[#231F1A] border-b border-[#B5884D]/30">
        <div>
          <h2 className="text-lg font-bold text-[#EAE1D8]">{device.name}</h2>
          <p className="text-xs text-gray-500">
            {device.gate_code ?? '-'} · {device.ip_address} · {device.type}
          </p>
        </div>
        <StatusBadge status={device.status} />
      </div>
      {device.gate_code && <DisplayPanel gateCode={device.gate_code} />}
    </div>
  );
}

export default function MonitoringSignagePage() {
  const [search, setSearch] = useState('');
  const { data: snapshot, isLoading, isError, refetch, dataUpdatedAt } = useMonitoringSnapshot();

  const items = useMemo(() => {
    const all = snapshot?.devices.items ?? [];
    const q = search.trim().toLowerCase();
    return all.filter(
      (d) =>
        d.kind === 'signage' &&
        (!q || d.name.toLowerCase().includes(q) || d.ip_address.toLowerCase().includes(q)),
    );
  }, [snapshot, search]);

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('id-ID')
    : '—';

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className="text-3xl font-bold text-[#EAE1D8]">Monitoring Signage</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Auto-refresh · Terakhir: {lastUpdated}</span>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-sm font-medium text-[#17130E] bg-gradient-to-r from-[#BF8F51] to-[#523D22] rounded-[9px] hover:opacity-90 transition-opacity"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center p-4 rounded-[10px] border border-[#B5884D]/50 bg-transparent w-full gap-4">
        <p className="text-sm text-gray-400">
          Total {items.length} device signage.
        </p>
        <div className="relative w-full lg:w-[280px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Signage..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:border-[#B5884D]"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-gray-500 text-sm">Memuat data signage...</p>
      ) : isError ? (
        <div className="rounded-[10px] border border-[#B5884D]/50 bg-[#231F1A] p-6 text-center">
          <span className="text-[#FF5656]">Gagal memuat data.</span>{' '}
          <button onClick={() => refetch()} className="text-[#B5884D] hover:underline">Coba lagi</button>
        </div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-sm">Belum ada device signage.</p>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {items.map((device) => (
            <SignageCard key={device.id} device={device} />
          ))}
        </div>
      )}
    </div>
  );
}