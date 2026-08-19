'use client';

import React, { useState } from 'react';
import { useDeviceLogs } from '@/hooks/useMonitoring';
import { formatTime } from '@/app/components/teknisi/constants';

const POLL_MS = 10000;

const SOURCE_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Semua Sumber' },
  { value: 'mqtt', label: 'MQTT' },
  { value: 'tcp', label: 'TCP' },
  { value: 'reader', label: 'Reader' },
  { value: 'lpr', label: 'LPR' },
  { value: 'signage', label: 'Signage' },
  { value: 'controller', label: 'Controller' },
];

export default function DeviceLogPage() {
  const [gate, setGate] = useState('');
  const [source, setSource] = useState('');
  const [method, setMethod] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, dataUpdatedAt } = useDeviceLogs(
    {
      gate: gate || null,
      source: source || null,
      method: method || null,
      date_from: dateFrom || null,
      date_to: dateTo || null,
      page,
      page_size: 10,
    },
    POLL_MS,
  );

  const totalPages = data?.total_pages ?? 1;
  const total = data?.total ?? 0;
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString('id-ID') : '—';

  const resetPageAndRefetch = () => {
    setPage(1);
    refetch();
  };

  const inputCls =
    'w-full px-4 py-2 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:border-[#B5884D]';
  const selectCls =
    'w-full appearance-none px-4 py-2 pr-10 text-sm bg-[#231F1A] border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer';

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className="text-3xl font-bold text-[#EAE1D8]">Device Log</h1>
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

      <div className="rounded-[10px] border border-[#B5884D]/50 bg-transparent p-4 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Gate</label>
            <input
              type="text"
              value={gate}
              onChange={(e) => setGate(e.target.value)}
              onBlur={resetPageAndRefetch}
              onKeyDown={(e) => e.key === 'Enter' && resetPageAndRefetch()}
              placeholder="Contoh: GATE1"
              className={inputCls}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Sumber</label>
            <select
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setPage(1);
              }}
              className={selectCls}
            >
              {SOURCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Method</label>
            <input
              type="text"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              onBlur={resetPageAndRefetch}
              onKeyDown={(e) => e.key === 'Enter' && resetPageAndRefetch()}
              placeholder="Contoh: readCard"
              className={inputCls}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Dari Tanggal</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className={inputCls}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Sampai Tanggal</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className={inputCls}
            />
          </div>
        </div>
      </div>

      <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-[#EAE1D8]">
            <thead className="text-[11px] uppercase bg-[#231F1A] border-b border-[#B5884D]/30">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider text-center">WAKTU</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">GATE</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">SUMBER</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">METHOD</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">NO. TIKET</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">DETAIL</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">
                    Memuat device log...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center bg-[#231F1A]">
                    <span className="text-[#FF5656]">Gagal memuat data.</span>{' '}
                    <button onClick={() => refetch()} className="text-[#B5884D] hover:underline">Coba lagi</button>
                  </td>
                </tr>
              ) : (data?.events ?? []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">
                    Belum ada log yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                (data?.events ?? []).map((entry, index) => (
                  <tr key={entry.id} className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326] transition-colors`}>
                    <td className="px-6 py-4 text-center text-xs">{formatTime(entry.ts)}</td>
                    <td className="px-6 py-4 text-center font-mono">{entry.gate ?? '-'}</td>
                    <td className="px-6 py-4 text-center">{entry.source}</td>
                    <td className="px-6 py-4 text-center">{entry.method ?? '-'}</td>
                    <td className="px-6 py-4 text-center">{entry.ticket_number ?? '-'}</td>
                    <td className="px-6 py-4 text-center text-xs text-gray-400">{entry.detail ?? '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-transparent border-t border-[#B5884D]/30 gap-4 mt-auto">
          <span className="text-sm text-gray-400">
            {total === 0 ? 'Tidak ada data' : `${total} entri log`}
          </span>
          <div className="inline-flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 text-sm text-gray-400 border border-[#B5884D]/50 rounded-[4px] hover:text-white hover:border-[#B5884D] transition-colors bg-transparent disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-sm text-[#17130E] bg-[#B5884D] rounded-[4px] font-bold">
              {page}
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1 text-sm text-[#EAE1D8] border border-[#B5884D]/50 rounded-[4px] hover:bg-[#B5884D]/20 transition-colors bg-transparent disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}