'use client';

import React, { useEffect, useState } from 'react';
import ExportButtons from '@/app/components/ExportButtons';
import { useTransactionReport } from '@/hooks/useFinanceReports';
import type { ParkingStatus, TransactionReportItem } from '@/lib/api/types';
import { durationMinutes, formatDateTime, formatRupiah } from '@/lib/format';

const PAGE_SIZE = 20;

const STATUS_OPTIONS: { value: ParkingStatus | ''; label: string }[] = [
  { value: '', label: 'Semua Status' },
  { value: 'Completed', label: 'Selesai' },
  { value: 'Parked', label: 'Aktif' },
  { value: 'Void', label: 'Void' },
];

function statusBadge(status: ParkingStatus) {
  if (status === 'Completed') {
    return { label: 'SELESAI', className: 'border-[#79FF8D] text-[#79FF8D] bg-[#00FF26]/[0.35]' };
  }
  if (status === 'Parked') {
    return { label: 'AKTIF', className: 'border-[#80CEFF] text-[#80CEFF] bg-[#0051FF]/[0.35]' };
  }
  return { label: 'VOID', className: 'border-[#B5B5B5] text-[#B5B5B5] bg-[#767676]/[0.24]' };
}

export default function LaporanTransaksiPage() {
  // State untuk pop-up Filter
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // State untuk pop-up Rincian Transaksi (menyimpan data baris yang diklik)
  const [selectedTx, setSelectedTx] = useState<TransactionReportItem | null>(null);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ParkingStatus | ''>('');
  const [draftStartDate, setDraftStartDate] = useState('');
  const [draftEndDate, setDraftEndDate] = useState('');
  const [appliedRange, setAppliedRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

  // Debounce pencarian agar tidak menembak API setiap ketikan
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError, isFetching } = useTransactionReport({
    page,
    size: PAGE_SIZE,
    search: search || undefined,
    status: status || undefined,
    start_date: appliedRange.start || undefined,
    end_date: appliedRange.end || undefined,
  });

  const rows = data?.items ?? [];
  const pagination = data?.pagination;
  const rangeLabel = pagination
    ? `Menampilkan ${rows.length} dari ${pagination.total_items} transaksi`
    : 'Memuat…';

  const handleApplyFilter = () => {
    setAppliedRange({ start: draftStartDate, end: draftEndDate });
    setPage(1);
    setIsFilterOpen(false);
  };

  const handleResetFilter = () => {
    setDraftStartDate('');
    setDraftEndDate('');
    setAppliedRange({ start: '', end: '' });
    setStatus('');
    setPage(1);
  };

  const totalPages = pagination?.total_pages ?? 0;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6 relative pb-10">

      {/* HEADER HALAMAN */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#EAE1D8]">Laporan Transaksi</h2>

        <div className="flex items-center gap-3">
          <ExportButtons
            report="transactions"
            params={{
              search: search || undefined,
              status: status || undefined,
              start_date: appliedRange.start || undefined,
              end_date: appliedRange.end || undefined,
            }}
          />
        </div>
      </div>

      {/* SEARCH BAR & FILTER BUTTON */}
      <div className="flex items-center gap-4 w-full border border-[#BF8F51]/40 rounded-[15px] p-4 bg-transparent">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BF8F51]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari plat nomor atau kode tiket..."
            className="w-full bg-[#14110E] border border-[#BF8F51]/60 rounded-[10px] pl-12 pr-4 py-3 text-sm text-[#EAE1D8] placeholder-gray-500 outline-none focus:border-[#BF8F51] transition-colors"
          />
        </div>
       {/* Tombol Filter */}
        <button
          type="button"
          onClick={() => {
            setDraftStartDate(appliedRange.start);
            setDraftEndDate(appliedRange.end);
            setIsFilterOpen(true);
          }}
          className="relative z-10 flex-shrink-0 px-2 cursor-pointer text-[#BF8F51] hover:text-[#EAE1D8] transition-colors"
        >
          <svg className="pointer-events-none" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        </button>
      </div>

      {/* TABLE DATA */}
      <div className="border border-[#BF8F51] rounded-[10px] overflow-hidden flex flex-col bg-[#14110E]">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="border-b border-[#BF8F51] text-[#EAE1D8] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Kode Transaksi</th>
                <th className="px-6 py-4 font-semibold">Staff</th>
                <th className="px-6 py-4 font-semibold">Jenis Kendaraan</th>
                <th className="px-6 py-4 font-semibold">No. Plat</th>
                <th className="px-6 py-4 font-semibold">Waktu Masuk / Keluar</th>
                <th className="px-6 py-4 font-semibold">Durasi (menit)</th>
                <th className="px-6 py-4 font-semibold">Metode Pembayaran</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>

            <tbody className="text-[#EAE1D8] text-[14px]">
              {isLoading && (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-400">Memuat data…</td>
                </tr>
              )}
              {!isLoading && isError && (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-[#FF5656]">Gagal memuat data. Coba lagi nanti.</td>
                </tr>
              )}
              {!isLoading && !isError && rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-400">Tidak ada transaksi yang cocok.</td>
                </tr>
              )}
              {rows.map((row, index) => {
                const badge = statusBadge(row.status_parking);
                const durasi = row.exit_time ? durationMinutes(row.entry_time, row.exit_time) : null;
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-[#BF8F51]/10 transition-colors ${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-transparent'}`}
                  >
                    <td
                      className="px-6 py-3 font-semibold text-[#BF8F51] cursor-pointer hover:underline"
                      onClick={() => setSelectedTx(row)}
                    >
                      {row.ticket_number ?? '-'}
                    </td>
                    <td className="px-6 py-3">{row.exit_operator_name ?? '-'}</td>
                    <td className="px-6 py-3">{row.vehicle_type_name ?? '-'}</td>
                    <td className="px-6 py-3">{row.police_number ?? '-'}</td>
                    <td className="px-6 py-3 flex flex-col justify-center">
                      <span>{formatDateTime(row.entry_time)}</span>
                      <span className="text-[#BF8F51]">{row.exit_time ? formatDateTime(row.exit_time) : '-'}</span>
                    </td>
                    <td className="px-6 py-3">{durasi ?? '-'}</td>
                    <td className="px-6 py-3">{row.payment_method ?? '-'}</td>
                    <td className="px-6 py-3">{formatRupiah(row.total_fee)}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-[92px] h-[22px] text-[11px] font-bold rounded-[9px] border ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#BF8F51] text-sm">
          <p className="text-gray-400 text-[13px]">{isFetching && !isLoading ? 'Memperbarui…' : rangeLabel}</p>
          <div className="flex items-center gap-2">
            <button
              disabled={!pagination || pagination.current_page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 text-[#BF8F51] border border-[#BF8F51] rounded hover:bg-[#BF8F51]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => (
                <React.Fragment key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-gray-500 px-1">…</span>}
                  <button
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded transition-colors ${
                      p === page
                        ? 'text-black font-semibold bg-[#BF8F51] border border-[#BF8F51]'
                        : 'text-[#EAE1D8] border border-[#BF8F51] hover:bg-[#EAE1D8]/10'
                    }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              ))}
            <button
              disabled={!pagination || pagination.current_page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 text-[#BF8F51] border border-[#BF8F51] rounded hover:bg-[#BF8F51]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {/* MODAL POP-UP FILTER */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-[400px] h-auto bg-[#14110E] border border-[#BF8F51] rounded-[10px] p-6 flex flex-col relative shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[20px] font-bold text-[#BF8F51]">Filter</h3>
              <button onClick={() => setIsFilterOpen(false)} className="text-[#BF8F51] hover:text-[#EAE1D8] transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-[#BF8F51] mb-2 uppercase tracking-wide">Jangka Waktu</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={draftStartDate}
                    onChange={(e) => setDraftStartDate(e.target.value)}
                    className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] px-3 py-2 pr-8 text-sm outline-none focus:border-[#BF8F51] [color-scheme:dark]"
                  />
                </div>
                <span className="text-[#BF8F51] font-bold">-</span>
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={draftEndDate}
                    onChange={(e) => setDraftEndDate(e.target.value)}
                    className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] px-3 py-2 pr-8 text-sm outline-none focus:border-[#BF8F51] [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            <div className="mb-auto">
              <label className="block text-[11px] font-semibold text-[#BF8F51] mb-2 uppercase tracking-wide">STATUS</label>
              <div className="w-[calc(50%-8px)] relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ParkingStatus | '')}
                  className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] pl-3 pr-8 py-2 text-sm appearance-none outline-none focus:border-[#BF8F51]"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#14110E]">{opt.label}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-[11px] text-[#BF8F51] pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-2">
              <button onClick={handleResetFilter} className="px-5 py-2 border border-[#BF8F51] text-[#BF8F51] rounded-[7px] text-[13px] font-semibold hover:bg-[#BF8F51]/10 transition-colors">Atur Ulang</button>
              <button onClick={handleApplyFilter} className="px-5 py-2 bg-[#BF8F51] text-[#14110E] rounded-[7px] text-[13px] font-bold hover:opacity-90 transition-opacity">Terapkan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POP-UP RINCIAN TRANSAKSI */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-[729px] max-h-[90vh] bg-[#17130E] border-[3px] border-[#BF8F51] rounded-[15px] p-10 flex flex-col relative shadow-2xl overflow-y-auto">

            {/* Header Modal */}
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[28px] font-bold text-[#BF8F51]">
                Rincian Transaksi <span className="text-[#EAE1D8] font-medium text-[24px]">#{selectedTx.ticket_number ?? '-'}</span>
              </h3>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-[#BF8F51] hover:text-[#EAE1D8] transition-colors"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Kamera LPR Section */}
            <div className="grid grid-cols-2 gap-8 flex-1 mb-8 min-h-[220px]">
              {/* LPR Masuk */}
              <div className="flex flex-col">
                <span className="text-[#BF8F51] mb-3 font-semibold text-[17px]">LPR Pintu masuk</span>
                <div className="flex-1 border border-[#BF8F51]/60 rounded-[12px] flex items-center justify-center bg-[#17130E] relative overflow-hidden">
                   <div className="absolute top-[20%] w-[80%] h-[1px] bg-black/50"></div>
                   <div className="text-center text-[#BF8F51]">
                     <p className="font-bold text-lg">LPR</p>
                     <p className="font-medium">Preview</p>
                   </div>
                </div>
              </div>

              {/* LPR Keluar */}
              <div className="flex flex-col">
                <span className="text-[#BF8F51] mb-3 font-semibold text-[17px]">LPR Pintu keluar</span>
                <div className="flex-1 border border-[#BF8F51]/60 rounded-[12px] flex items-center justify-center bg-[#17130E] relative overflow-hidden">
                   <div className="absolute top-[20%] w-[80%] h-[1px] bg-black/50"></div>
                   <div className="text-center text-[#BF8F51]">
                     <p className="font-bold text-lg">LPR</p>
                     <p className="font-medium">Preview</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Info Box 1 */}
            <div className="border border-[#BF8F51]/60 rounded-[12px] p-6 flex justify-between items-center mb-6">
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[15px] font-medium mb-2">No. Plat</p>
                <p className="text-[#EAE1D8] text-[17px] font-semibold">{selectedTx.police_number ?? '-'}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[15px] font-medium mb-2">Jenis Kendaraan</p>
                <p className="text-[#EAE1D8] text-[17px] font-semibold">{selectedTx.vehicle_type_name ?? '-'}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[15px] font-medium mb-2">Waktu Masuk / Keluar</p>
                <p className="text-[#EAE1D8] text-[17px] font-semibold">
                  {formatDateTime(selectedTx.entry_time)} / {selectedTx.exit_time ? formatDateTime(selectedTx.exit_time) : '-'}
                </p>
              </div>
            </div>

            {/* Info Box 2 */}
            <div className="border border-[#BF8F51]/60 rounded-[12px] p-6 flex justify-between items-center">
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[15px] font-medium mb-2">Durasi (menit)</p>
                <p className="text-[#EAE1D8] text-[17px] font-semibold">
                  {selectedTx.exit_time ? durationMinutes(selectedTx.entry_time, selectedTx.exit_time) ?? '-' : '-'}
                </p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[15px] font-medium mb-2">Pembayaran</p>
                <p className="text-[#EAE1D8] text-[17px] font-semibold">{selectedTx.payment_method ?? '-'}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[15px] font-medium mb-2">Total</p>
                <p className="text-[#EAE1D8] text-[17px] font-semibold">{formatRupiah(selectedTx.total_fee)}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[15px] font-medium mb-2">Staff</p>
                <p className="text-[#EAE1D8] text-[17px] font-semibold">{selectedTx.exit_operator_name ?? '-'}</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
