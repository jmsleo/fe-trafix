'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ExportButtons from '@/app/components/ExportButtons';
import { usePendingTickets } from '@/hooks/useFinanceReports';
import type { PendingTicketItem } from '@/lib/api/types';
import { formatDateTime } from '@/lib/format';

const PAGE_SIZE = 20;
const OVERDUE_THRESHOLD_MS = 24 * 60 * 60 * 1000;

function formatElapsed(entryIso: string, now: number): string {
  const ms = Math.max(0, now - new Date(entryIso).getTime());
  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const s = String(totalSec % 60).padStart(2, '0');
  return `${h} : ${m} : ${s}`;
}

export default function TiketGantungPage() {
  // State untuk menyimpan data tiket yang sedang diklik (untuk pop-up rincian)
  const [selectedTicket, setSelectedTicket] = useState<PendingTicketItem | null>(null);

  // Class bawaan untuk card dengan efek radial gradient (Hitam di tengah, coklat di pinggir)
  const radialCardClass = "bg-[radial-gradient(ellipse_at_center,_#110C08_0%,_rgba(191,143,81,0.18)_100%)] border border-[#BF8F51] rounded-[15px] p-5 flex flex-col hover:border-[#BF8F51] transition-colors";

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [page, setPage] = useState(1);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = usePendingTickets({
    page,
    size: PAGE_SIZE,
    search: search || undefined,
    entry_date: entryDate || undefined,
  });

  const rows = useMemo(() => data?.items ?? [], [data]);
  const pagination = data?.pagination;

  const stats = useMemo(() => {
    let oldest: PendingTicketItem | null = null;
    const gateCounts = new Map<string, number>();
    for (const row of rows) {
      if (!oldest || new Date(row.entry_time) < new Date(oldest.entry_time)) oldest = row;
      const gate = row.entry_gate_name ?? '-';
      gateCounts.set(gate, (gateCounts.get(gate) ?? 0) + 1);
    }
    const topGate = [...gateCounts.entries()].sort((a, b) => b[1] - a[1])[0];
    return {
      total: pagination?.total_items ?? rows.length,
      oldest,
      topGateName: topGate?.[0] ?? '-',
      topGateCount: topGate?.[1] ?? 0,
    };
  }, [rows, pagination]);

  const isOverdue = (row: PendingTicketItem) =>
    now - new Date(row.entry_time).getTime() > OVERDUE_THRESHOLD_MS;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6 pb-10 relative">

      {/* HEADER HALAMAN */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#EAE1D8]">Tiket Gantung</h2>
        <div className="flex items-center gap-3">
          <ExportButtons
            report="pending-tickets"
            params={{
              search: search || undefined,
              entry_date: entryDate || undefined,
            }}
          />
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className="border border-[#BF8F51]/40 rounded-[10px] p-4 flex items-end gap-4 w-full">
        {/* Jangka Waktu */}
        <div className="flex-1 max-w-[280px]">
          <label className="block text-[#BF8F51] text-[11px] font-semibold mb-2 uppercase">Tanggal Masuk</label>
          <div className="relative flex-1">
            <input
              type="date"
              value={entryDate}
              onChange={(e) => {
                setEntryDate(e.target.value);
                setPage(1);
              }}
              className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] pl-3 pr-8 py-2 text-sm outline-none focus:border-[#BF8F51] [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Reset Filter */}
        <div>
          <button
            onClick={() => {
              setEntryDate('');
              setSearchInput('');
              setPage(1);
            }}
            className="flex items-center gap-2 px-4 py-2 border border-[#BF8F51] rounded-[7px] text-[#BF8F51] text-sm font-medium hover:bg-[#BF8F51]/10 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Reset Filter
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative ml-auto w-[240px]">
          <svg className="absolute left-3 top-2.5 text-[#BF8F51]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari Kode, Plat..."
            className="w-full bg-transparent border border-[#BF8F51] rounded-[7px] pl-9 pr-3 py-2 text-sm text-[#EAE1D8] placeholder-gray-500 outline-none focus:border-[#BF8F51] transition-colors"
          />
        </div>
      </div>

      {/* 4 STAT CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <div className={`${radialCardClass} h-[130px]`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Total Pending</p>
          <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2">{stats.total} <br/><span className="text-[12px] font-medium tracking-widest text-[#BF8F51]">KENDARAAN</span></h3>
        </div>
        <div className={`${radialCardClass} h-[130px]`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Terlama</p>
          <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2">
            {stats.oldest ? formatElapsed(stats.oldest.entry_time, now) : '00 : 00 : 00'}
          </h3>
        </div>
        <div className={`${radialCardClass} h-[130px]`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Gate Terbanyak</p>
          <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2 truncate">{stats.topGateName}</h3>
        </div>
        {/* Special Red Card for Alert */}
        <div className={`rounded-[15px] p-5 flex flex-col justify-center h-[130px] ${stats.total > 10 ? 'bg-[#FF0000]/10 border border-[#FF4343]' : `${radialCardClass}`}`}>
          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${stats.total > 10 ? 'text-[#FF4343]' : 'text-[#EAE1D8]'}`}>STATUS</p>
          <h3 className={`text-[18px] font-bold mb-1 ${stats.total > 10 ? 'text-[#FF4343]' : 'text-[#79FF8D]'}`}>
            {stats.total > 10 ? 'Peringatan Tinggi' : 'Terkendali'}
          </h3>
          <p className="text-[#EAE1D8] text-[11px] leading-snug">
            {stats.total > 10
              ? 'Jumlah pending tiket melampaui ambang batas. Audit segera diperlukan.'
              : 'Jumlah pending tiket masih dalam ambang batas aman.'}
          </p>
        </div>
      </div>

      {/* TABEL DATA DETAIL TIKET GANTUNG */}
      <div className="border border-[#BF8F51] rounded-[15px] bg-[#14110E] overflow-hidden flex flex-col w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-center whitespace-nowrap">
            <thead className="border-b border-[#BF8F51] text-[#EAE1D8] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5 font-semibold">KODE TRANSAKSI</th>
                <th className="px-6 py-5 font-semibold">PLAT NOMOR</th>
                <th className="px-6 py-5 font-semibold">GATE</th>
                <th className="px-6 py-5 font-semibold">WAKTU MASUK</th>
                <th className="px-6 py-5 font-semibold text-center">STATUS</th>
                <th className="px-6 py-5 font-semibold">AKSI</th>
              </tr>
            </thead>
            <tbody className="text-[#EAE1D8] text-[14px]">
              {isLoading && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Memuat data…</td></tr>
              )}
              {!isLoading && isError && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-[#FF5656]">Gagal memuat data. Coba lagi nanti.</td></tr>
              )}
              {!isLoading && !isError && rows.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Tidak ada tiket gantung.</td></tr>
              )}
              {rows.map((row, index) => (
                <tr key={row.id} className={`hover:bg-[#BF8F51]/10 transition-colors ${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-transparent'}`}>
                  {/* Tambahan onClick pada ID (KODE TRANSAKSI) untuk memunculkan modal */}
                  <td
                    className="px-6 py-4 font-semibold text-[#BF8F51] cursor-pointer hover:underline"
                    onClick={() => setSelectedTicket(row)}
                  >
                    {row.ticket_number ?? '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{row.police_number ?? '-'}</td>
                  <td className="px-6 py-4">{row.entry_gate_name ?? '-'}</td>
                  <td className="px-6 py-4 text-[13px] text-gray-300">{formatDateTime(row.entry_time)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-[92px] h-[22px] text-[11px] font-bold rounded-[9px] border ${
                      isOverdue(row)
                        ? 'border-[#FF7E7E] text-[#FF7E7E] bg-[#FF0000]/[0.35]'
                        : 'border-[#FFD94E] text-[#FFD94E] bg-[#FFBC2C]/[0.24]'
                    }`}>
                      {isOverdue(row) ? 'OVERDUE' : 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {/* Tambahan onClick juga pada tombol DETAIL */}
                    <button
                      onClick={() => setSelectedTicket(row)}
                      className="text-[#BF8F51] font-bold text-[12px] hover:underline uppercase"
                    >
                      DETAIL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#BF8F51] text-sm">
          <p className="text-gray-400 text-[13px]">
            Menampilkan {rows.length} dari {pagination?.total_items ?? 0} Transaksi
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={!pagination || pagination.current_page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 text-[#BF8F51] border border-[#BF8F51] rounded hover:bg-[#BF8F51]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <button className="px-3 py-1 text-black font-semibold bg-[#BF8F51] border border-[#BF8F51] rounded">
              {pagination?.current_page ?? 1}
            </button>
            <button
              disabled={!pagination || pagination.current_page >= pagination.total_pages}
              onClick={() => setPage((p) => Math.min(pagination?.total_pages ?? 1, p + 1))}
              className="px-3 py-1 text-[#EAE1D8] border border-[#BF8F51] rounded hover:bg-[#EAE1D8]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {/* MODAL POP-UP RINCIAN PENDING */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">

          <div className="w-[714px] max-h-[90vh] bg-[#17130E] border-[3px] border-[#BF8F51] rounded-[15px] p-10 flex flex-col relative shadow-2xl overflow-y-auto">

            {/* Header Modal */}
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[28px] font-bold text-[#BF8F51]">
                Rincian Pending <span className="text-[#EAE1D8] font-medium text-[24px] ml-2">#{selectedTicket.ticket_number ?? '-'}</span>
              </h3>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-[#BF8F51] hover:text-[#EAE1D8] transition-colors"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Top Section (Kamera & Info Kendaraan) */}
            <div className="grid grid-cols-2 gap-6 mb-6 h-[240px]">

              {/* LPR Masuk */}
              <div className="flex flex-col">
                <span className="text-[#BF8F51] mb-3 font-semibold text-[15px]">LPR Pintu masuk</span>
                <div className="flex-1 border border-[#BF8F51]/60 rounded-[12px] flex items-center justify-center bg-[#17130E] relative overflow-hidden">
                   <div className="absolute top-[20%] w-[80%] h-[1px] bg-black/50"></div>
                   <div className="text-center text-[#BF8F51]">
                     <p className="font-bold text-lg">LPR</p>
                     <p className="font-medium">Preview</p>
                   </div>
                </div>
              </div>

              {/* Info Plat Box (Sejajar dengan box LPR, label margin atas 34px) */}
              <div className="mt-[34px] flex-1 border border-[#BF8F51]/60 rounded-[12px] p-6 flex flex-col justify-center gap-4">
                <div>
                  <p className="text-[#BF8F51] text-[13px] font-semibold mb-1">No. Plat</p>
                  <p className="text-[#EAE1D8] text-[16px] font-bold">{selectedTicket.police_number ?? '-'}</p>
                </div>
                <div>
                  <p className="text-[#BF8F51] text-[13px] font-semibold mb-1">Jenis Kendaraan</p>
                  <p className="text-[#EAE1D8] text-[16px] font-bold">{selectedTicket.vehicle_type_name ?? '-'}</p>
                </div>
                <div>
                  <p className="text-[#BF8F51] text-[13px] font-semibold mb-1">Gate masuk</p>
                  <p className="text-[#EAE1D8] text-[16px] font-bold">{selectedTicket.entry_gate_name ?? '-'}</p>
                </div>
              </div>

            </div>

            {/* Middle Section (Durasi, Status, dll) */}
            <div className="border border-[#BF8F51]/60 rounded-[12px] p-6 flex justify-between items-center mb-6">
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[14px] font-semibold mb-2">Durasi</p>
                <p className="text-[#EAE1D8] text-[16px] font-bold">{formatElapsed(selectedTicket.entry_time, now)}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[14px] font-semibold mb-2">Status Parkir</p>
                <p className="text-[#EAE1D8] text-[16px] font-bold">{selectedTicket.status_parking}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[14px] font-semibold mb-2">Status Pembayaran</p>
                <p className="text-[#EAE1D8] text-[16px] font-bold">{selectedTicket.payment_status ?? 'Belum ada'}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[14px] font-semibold mb-2">Waktu Masuk</p>
                <p className="text-[#EAE1D8] text-[16px] font-bold">{formatDateTime(selectedTicket.entry_time)}</p>
              </div>
            </div>

            {/* Bottom Section (Timeline) */}
            <div className="border border-[#BF8F51]/60 rounded-[12px] p-6 flex-1 flex flex-col">
              <h4 className="text-[#BF8F51] text-[18px] font-bold mb-4">Timeline</h4>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#EAE1D8] font-medium">- Kendaraan masuk</span>
                  <span className="text-[#EAE1D8]">{formatDateTime(selectedTicket.entry_time)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#EAE1D8] font-medium">- Tiket diterbitkan</span>
                  <span className="text-[#EAE1D8]">{formatDateTime(selectedTicket.entry_time)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[#EAE1D8] font-medium">- Belum keluar</span>
                  <span className="text-[#EAE1D8]">Saat ini</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
