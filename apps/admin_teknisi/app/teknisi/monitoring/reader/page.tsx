'use client';

import React, { useMemo, useState } from 'react';
import { useMonitoringSnapshot } from '@/hooks/useMonitoringStream';
import { useReaderEvents } from '@/hooks/useMonitoring';
import DeviceMonitorTable from '@/app/components/teknisi/DeviceMonitorTable';
import { formatTime } from '@/app/components/teknisi/constants';

const POLL_MS = 5000;

export default function MonitoringReaderPage() {
  const [search, setSearch] = useState('');
  const [eventPage, setEventPage] = useState(1);

  const { data: snapshot, isLoading, isError, refetch, dataUpdatedAt } = useMonitoringSnapshot();
  const { data: events } = useReaderEvents({ page: eventPage, page_size: 10 }, POLL_MS);

  const items = useMemo(() => {
    const all = snapshot?.devices.items ?? [];
    const q = search.trim().toLowerCase();
    return all.filter(
      (d) =>
        d.kind === 'reader' &&
        (!q || d.name.toLowerCase().includes(q) || d.ip_address.toLowerCase().includes(q)),
    );
  }, [snapshot, search]);

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('id-ID')
    : '—';

  const totalPages = events?.total_pages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className="text-3xl font-bold text-[#EAE1D8]">Monitoring Reader</h1>
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
          Total {items.length} device reader.
        </p>
        <div className="relative w-full lg:w-[280px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Reader..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:border-[#B5884D]"
          />
        </div>
      </div>

      <DeviceMonitorTable
        items={items}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyText="Belum ada device reader."
      />

      <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent w-full">
        <div className="flex items-center justify-between px-6 py-4 bg-[#231F1A] border-b border-[#B5884D]/30">
          <h2 className="text-lg font-bold text-[#BF8F51]">Log Kejadian Reader (Tap)</h2>
          <span className="text-sm text-gray-400">{events?.total ?? 0} kejadian</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-[#EAE1D8]">
            <thead className="text-[11px] uppercase bg-[#231F1A] border-b border-[#B5884D]/30">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider text-center">WAKTU</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">GATE</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">SUMBER</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">DETAIL</th>
              </tr>
            </thead>
            <tbody>
              {(events?.events ?? []).length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">
                    Belum ada kejadian reader.
                  </td>
                </tr>
              ) : (
                (events?.events ?? []).map((ev, index) => (
                  <tr key={ev.id} className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326] transition-colors`}>
                    <td className="px-6 py-3 text-center text-xs">{formatTime(ev.ts)}</td>
                    <td className="px-6 py-3 text-center font-mono">{ev.gate ?? '-'}</td>
                    <td className="px-6 py-3 text-center">{ev.source}</td>
                    <td className="px-6 py-3 text-center text-xs text-gray-400">{ev.detail ?? '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {(events?.total ?? 0) > 0 && (
          <div className="flex items-center justify-between px-6 py-4 bg-transparent border-t border-[#B5884D]/30">
            <span className="text-sm text-gray-400">
              Halaman {eventPage} dari {totalPages}
            </span>
            <div className="inline-flex items-center space-x-2">
              <button
                onClick={() => setEventPage((p) => Math.max(1, p - 1))}
                disabled={eventPage <= 1}
                className="px-3 py-1 text-sm text-gray-400 border border-[#B5884D]/50 rounded-[4px] hover:text-white hover:border-[#B5884D] transition-colors bg-transparent disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setEventPage((p) => Math.min(totalPages, p + 1))}
                disabled={eventPage >= totalPages}
                className="px-3 py-1 text-sm text-[#EAE1D8] border border-[#B5884D]/50 rounded-[4px] hover:bg-[#B5884D]/20 transition-colors bg-transparent disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}