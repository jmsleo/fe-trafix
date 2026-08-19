'use client';

import React, { useMemo, useState } from 'react';
import { useMonitoringSnapshot } from '@/hooks/useMonitoringStream';
import DeviceMonitorTable from '@/app/components/teknisi/DeviceMonitorTable';

export default function MonitoringKameraLprPage() {
  const [search, setSearch] = useState('');
  const { data: snapshot, isLoading, isError, refetch, dataUpdatedAt } = useMonitoringSnapshot();

  const items = useMemo(() => {
    const all = snapshot?.devices.items ?? [];
    const q = search.trim().toLowerCase();
    return all.filter(
      (d) =>
        d.kind === 'lpr' &&
        (!q || d.name.toLowerCase().includes(q) || d.ip_address.toLowerCase().includes(q)),
    );
  }, [snapshot, search]);

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('id-ID')
    : '—';

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className="text-3xl font-bold text-[#EAE1D8]">Monitoring Kamera LPR</h1>
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
          Total {items.length} kamera LPR.
        </p>
        <div className="relative w-full lg:w-[280px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Kamera LPR..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:border-[#B5884D]"
          />
        </div>
      </div>

      <DeviceMonitorTable
        items={items}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyText="Belum ada kamera LPR."
      />
    </div>
  );
}