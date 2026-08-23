'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ExportButtons from '@/app/components/ExportButtons';
import { useOperatorPerformance, useRevenueReport } from '@/hooks/useFinanceReports';
import type { OperatorPerformanceItem } from '@/lib/api/types';
import { formatRupiah } from '@/lib/format';

const PAGE_SIZE = 10;

export default function KinerjaOperatorPage() {
  // State untuk mengontrol muncul/hilangnya pop-up Filter
  const [showFilter, setShowFilter] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<OperatorPerformanceItem | null>(null);

  // Class bawaan untuk card dengan efek radial gradient (Hitam di tengah, coklat di pinggir)
  const radialCardClass = "bg-[radial-gradient(ellipse_at_center,_#110C08_0%,_rgba(191,143,81,0.18)_100%)] border border-[#BF8F51] rounded-[15px] p-5 flex flex-col hover:border-[#BF8F51] transition-colors";

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim().toLowerCase());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const params = useMemo(
    () => ({
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    }),
    [startDate, endDate],
  );

  const { data, isLoading, isError } = useOperatorPerformance(params);
  const { data: revenueData } = useRevenueReport(params);

  const allRows = useMemo(() => data?.items ?? [], [data]);

  const totals = useMemo(
    () =>
      allRows.reduce(
        (acc, row) => ({
          transactions: acc.transactions + row.total_transactions,
          revenue: acc.revenue + row.total_revenue,
        }),
        { transactions: 0, revenue: 0 },
      ),
    [allRows],
  );

  const filteredRows = useMemo(
    () =>
      search
        ? allRows.filter((row) => row.operator_name.toLowerCase().includes(search))
        : allRows,
    [allRows, search],
  );

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const rows = filteredRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const topOperator = allRows.length > 0
    ? allRows.reduce((a, b) => (b.total_revenue > a.total_revenue ? b : a))
    : null;

  const avgOverall =
    totals.transactions > 0 ? Math.round(totals.revenue / totals.transactions) : 0;

  const paymentMethods = revenueData?.payment_methods ?? [];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6 pb-10 relative">

      {/* HEADER HALAMAN */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#EAE1D8]">Kinerja Operator</h2>
        <div className="flex items-center gap-3">
          <ExportButtons
            report="operator-performance"
            params={{
              start_date: startDate || undefined,
              end_date: endDate || undefined,
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
            placeholder="Cari Staff..."
            className="w-full bg-[#14110E] border border-[#BF8F51]/60 rounded-[10px] pl-12 pr-4 py-3 text-sm text-[#EAE1D8] placeholder-gray-500 outline-none focus:border-[#BF8F51] transition-colors"
          />
        </div>
        {/* Tombol Filter (tanpa border sendiri, karena sudah dibungkus border luar) */}
        <button
          onClick={() => setShowFilter(true)}
          className="flex-shrink-0 px-2 text-[#BF8F51] hover:text-[#EAE1D8] transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
        </button>
      </div>

      {/* 4 STAT CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <div className={`${radialCardClass} h-[130px] justify-center`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Transaksi</p>
          <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2">{totals.transactions.toLocaleString('id-ID')}</h3>
        </div>
        <div className={`${radialCardClass} h-[130px] justify-center`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Pendapatan</p>
          <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2">{formatRupiah(totals.revenue)}</h3>
        </div>
        <div className={`${radialCardClass} h-[130px] justify-center`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Operator Teratas</p>
          <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2 truncate">{topOperator?.operator_name ?? '-'}</h3>
        </div>
        <div className={`${radialCardClass} h-[130px] justify-center`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Rata-rata Nilai Transaksi</p>
          <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2">{formatRupiah(avgOverall)}</h3>
        </div>
      </div>

      {/* MIDDLE SECTION (Tabel Kiri & Box Kanan) */}
      <div className="grid grid-cols-[1fr_300px] gap-6">

        {/* KIRI: TABEL KINERJA OPERATOR */}
        <div className="border border-[#BF8F51] rounded-[15px] bg-[#14110E] overflow-hidden flex flex-col w-full h-full">
          <div className="overflow-x-auto">
            <table className="w-full text-center whitespace-nowrap">
              <thead className="border-b border-[#BF8F51] text-[#EAE1D8] text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-5 font-semibold">NO.</th>
                  <th className="px-6 py-5 font-semibold text-left">OPERATOR</th>
                  <th className="px-6 py-5 font-semibold">SESI</th>
                  <th className="px-6 py-5 font-semibold">TRANSAKSI</th>
                  <th className="px-6 py-5 font-semibold">PENDAPATAN</th>
                  <th className="px-6 py-5 font-semibold">RATA- RATA<br/>NILAI</th>
                  <th className="px-6 py-5 font-semibold">AKSI</th>
                </tr>
              </thead>
              <tbody className="text-[#EAE1D8] text-[14px]">
                {isLoading && (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">Memuat data…</td></tr>
                )}
                {!isLoading && isError && (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-[#FF5656]">Gagal memuat data. Coba lagi nanti.</td></tr>
                )}
                {!isLoading && !isError && rows.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">Tidak ada data operator.</td></tr>
                )}
                {rows.map((row, index) => (
                  <tr key={row.operator_id} className={`hover:bg-[#BF8F51]/10 transition-colors ${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-transparent'}`}>
                    <td className="px-6 py-5">{(safePage - 1) * PAGE_SIZE + index + 1}.</td>
                    <td className="px-6 py-5 text-left">{row.operator_name}</td>
                    <td className="px-6 py-5">{row.total_sessions.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-5">{row.total_transactions.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-5">{formatRupiah(row.total_revenue)}</td>
                    <td className="px-6 py-5">{formatRupiah(row.avg_transaction_value)}</td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => setSelectedOperator(row)}
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
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#BF8F51] text-sm mt-auto">
            <p className="text-[#EAE1D8] text-[13px]">
              Menampilkan {rows.length} dari {filteredRows.length} STAFF
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 text-[#BF8F51] border border-[#BF8F51] rounded hover:bg-[#BF8F51]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <button className="px-3 py-1 text-black font-semibold bg-[#BF8F51] border border-[#BF8F51] rounded">
                {safePage}
              </button>
              <span className="text-[#EAE1D8] text-[12px]">/ {totalPages}</span>
              <button
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 text-[#EAE1D8] border border-[#BF8F51] rounded hover:bg-[#EAE1D8]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>

        {/* KANAN: PANELS (Metode Pembayaran & Ringkasan) */}
        <div className="flex flex-col gap-6">

          {/* Panel Metode Pembayaran */}
          <div className={`${radialCardClass} py-6 px-5`}>
            <h4 className="text-[#EAE1D8] font-bold text-[12px] uppercase tracking-wide mb-4">Metode Pembayaran</h4>
            <div className="flex flex-col gap-2.5 text-[13px]">
              {paymentMethods.map((pm) => (
                <div key={pm.method} className="flex justify-between items-center text-[#BF8F51]">
                  <span>{pm.method}</span>
                  <span className="font-medium">{pm.total_transactions.toLocaleString('id-ID')}</span>
                </div>
              ))}
              {paymentMethods.length === 0 && (
                <p className="text-gray-400 text-[12px]">Tidak ada data.</p>
              )}
            </div>
          </div>

          {/* Panel Ringkasan */}
          <div className={`${radialCardClass} flex-1 py-6 px-5 flex flex-col`}>
            <h4 className="text-[#EAE1D8] font-bold text-[12px] uppercase tracking-wide mb-5 leading-relaxed">Ringkasan<br/>Kinerja</h4>

            <div className="border border-[#BF8F51]/60 rounded-[12px] py-4 grid grid-cols-2 gap-2 mb-6 text-center">
              <div>
                <h3 className="text-[#BF8F51] text-[24px] font-bold leading-none mb-1.5">{allRows.length}</h3>
                <p className="text-[#A7A6A5] text-[9px] font-bold uppercase tracking-wider">Total Operator</p>
              </div>
              <div>
                <h3 className="text-[#BF8F51] text-[24px] font-bold leading-none mb-1.5">
                  {allRows.reduce((sum, row) => sum + row.total_sessions, 0).toLocaleString('id-ID')}
                </h3>
                <p className="text-[#A7A6A5] text-[9px] font-bold uppercase tracking-wider">Total Sesi</p>
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-[#FF7E7E] text-[24px] font-bold leading-none mb-1.5">{formatRupiah(topOperator?.total_revenue ?? 0)}</h3>
              <p className="text-[#EAE1D8] text-[9px] font-bold uppercase tracking-wider">Pendapatan Operator Teratas</p>
            </div>

            <p className="mt-auto text-[#A7A6A5] text-[10px] leading-snug text-center">
              Periode: {startDate || 'awal'} — {endDate || 'sekarang'}
            </p>
          </div>

        </div>
      </div>

      {/* MODAL POP-UP FILTER */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-[383px] bg-[#17130E] border-[2px] border-[#BF8F51] rounded-[15px] p-6 flex flex-col relative shadow-2xl">

            {/* Header Modal */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[22px] font-bold text-[#BF8F51]">Filter</h3>
              <button
                onClick={() => setShowFilter(false)}
                className="text-[#BF8F51] hover:text-[#EAE1D8] transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex-1 flex flex-col gap-4">

              {/* Jangka Waktu */}
              <div>
                <label className="block text-[#BF8F51] text-[11px] font-semibold mb-2 uppercase">Jangka Waktu</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] px-3 py-2 text-sm outline-none focus:border-[#BF8F51] [color-scheme:dark]"
                  />
                  <span className="text-[#BF8F51] font-bold">-</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] px-3 py-2 text-sm outline-none focus:border-[#BF8F51] [color-scheme:dark]"
                  />
                </div>
              </div>

            </div>

            {/* Buttons Bawah */}
            <div className="flex justify-end gap-3 mt-4 pt-2">
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setPage(1);
                }}
                className="px-5 py-2 rounded-[7px] border border-[#BF8F51] text-[#BF8F51] font-semibold text-sm hover:bg-[#BF8F51]/10 transition-colors"
              >
                Atur Ulang
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className="px-5 py-2 rounded-[7px] bg-[#BF8F51] text-[#14110E] font-bold text-sm hover:bg-[#906B3D] transition-colors"
              >
                Terapkan
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DETAIL OPERATOR */}
      {selectedOperator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-[420px] bg-[#17130E] border-[3px] border-[#BF8F51] rounded-[15px] p-8 flex flex-col relative shadow-2xl">

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[24px] font-bold text-[#BF8F51]">{selectedOperator.operator_name}</h3>
              <button
                onClick={() => setSelectedOperator(null)}
                className="text-[#BF8F51] hover:text-[#EAE1D8] transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-[#BF8F51]/60 rounded-[12px] p-4 text-center">
                <p className="text-[#BF8F51] text-[12px] font-semibold mb-1">Total Sesi</p>
                <p className="text-[#EAE1D8] text-[20px] font-bold">{selectedOperator.total_sessions.toLocaleString('id-ID')}</p>
              </div>
              <div className="border border-[#BF8F51]/60 rounded-[12px] p-4 text-center">
                <p className="text-[#BF8F51] text-[12px] font-semibold mb-1">Total Transaksi</p>
                <p className="text-[#EAE1D8] text-[20px] font-bold">{selectedOperator.total_transactions.toLocaleString('id-ID')}</p>
              </div>
              <div className="border border-[#BF8F51]/60 rounded-[12px] p-4 text-center">
                <p className="text-[#BF8F51] text-[12px] font-semibold mb-1">Total Pendapatan</p>
                <p className="text-[#EAE1D8] text-[20px] font-bold">{formatRupiah(selectedOperator.total_revenue)}</p>
              </div>
              <div className="border border-[#BF8F51]/60 rounded-[12px] p-4 text-center">
                <p className="text-[#BF8F51] text-[12px] font-semibold mb-1">Rata-rata Nilai</p>
                <p className="text-[#EAE1D8] text-[20px] font-bold">{formatRupiah(selectedOperator.avg_transaction_value)}</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
