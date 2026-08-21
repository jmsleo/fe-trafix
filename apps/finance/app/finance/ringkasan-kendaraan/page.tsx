'use client';

import React, { useMemo, useState } from 'react';
import { useRevenueReport, useVehicleSummaryReport } from '@/hooks/useFinanceReports';
import { formatRupiah } from '@/lib/format';

const PIE_COLORS = ['#BF8F51', '#906B3D', '#604728'];

export default function RingkasanKendaraanPage() {
  // Class helper untuk card dengan efek cahaya (radial)
  const radialCardClass = "bg-[radial-gradient(ellipse_at_center,_#110C08_0%,_rgba(191,143,81,0.18)_100%)] border border-[#BF8F51] rounded-[15px] p-5 flex flex-col hover:border-[#BF8F51] transition-colors";

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const params = useMemo(
    () => ({
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    }),
    [startDate, endDate],
  );

  const { data, isLoading, isError } = useVehicleSummaryReport(params);
  const { data: revenueData } = useRevenueReport(params);

  const items = useMemo(() => data?.items ?? [], [data]);
  const totalTransactions = data?.summary.total_transactions ?? 0;
  const totalRevenue = data?.summary.total_revenue ?? 0;

  const topType = items.length > 0
    ? items.reduce((a, b) => (b.total_vehicles > a.total_vehicles ? b : a))
    : null;
  const topShare =
    topType && totalTransactions > 0
      ? Math.round((topType.total_vehicles / totalTransactions) * 100)
      : 0;

  const avgPerTransaction =
    totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;

  // Pie chart: 2 teratas + lainnya
  const pieSlices = useMemo(() => {
    if (items.length === 0) return [];
    const sorted = [...items].sort((a, b) => b.total_vehicles - a.total_vehicles);
    const top = sorted.slice(0, 2);
    const restCount = sorted.slice(2).reduce((sum, it) => sum + it.total_vehicles, 0);
    const slices = top.map((it) => ({
      label: it.vehicle_type_name ?? '-',
      count: it.total_vehicles,
    }));
    if (restCount > 0) slices.push({ label: 'Lainnya', count: restCount });
    const total = slices.reduce((s, it) => s + it.count, 0) || 1;
    let acc = 0;
    return slices.map((it, idx) => {
      const pct = (it.count / total) * 100;
      const slice = { ...it, pct, from: acc, color: PIE_COLORS[idx % PIE_COLORS.length] };
      acc += pct;
      return slice;
    });
  }, [items]);

  const pieGradient =
    pieSlices.length > 0
      ? `conic-gradient(${pieSlices
          .map((s) => `${s.color} ${s.from}% ${s.from + s.pct}%`)
          .join(', ')})`
      : undefined;

  const paymentMethods = revenueData?.payment_methods ?? [];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">

      {/* HEADER HALAMAN */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#EAE1D8]">Laporan Kendaraan</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#BF8F51] rounded-[7px] text-[#BF8F51] text-sm font-medium hover:bg-[#BF8F51]/10 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#BF8F51] rounded-[7px] text-[#BF8F51] text-sm font-medium hover:bg-[#BF8F51]/10 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>
            Export EXCEL
          </button>
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className="border border-[#BF8F51]/40 rounded-[10px] p-4 flex items-end gap-4 w-full">
        <div className="flex-1 max-w-[320px]">
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

        <div className="ml-auto">
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
            }}
            className="flex items-center gap-2 px-4 py-2 border border-[#BF8F51] rounded-[7px] text-[#BF8F51] text-sm font-medium hover:bg-[#BF8F51]/10 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Reset Filter
          </button>
        </div>
      </div>

      {/* STATISTIC CARDS (4 Kolom - Tinggi 160px) */}
      <div className="grid grid-cols-4 gap-4">
        <div className={`${radialCardClass} h-[160px] justify-between`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Total Kendaraan</p>
          <h3 className="text-[#BF8F51] text-[40px] font-bold leading-none mt-2">{totalTransactions.toLocaleString('id-ID')}</h3>
        </div>
        <div className={`${radialCardClass} h-[160px] justify-between`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Total Pendapatan</p>
          <h3 className="text-[#BF8F51] text-[40px] font-bold leading-none mt-2">{formatRupiah(totalRevenue)}</h3>
        </div>
        <div className={`${radialCardClass} h-[160px] justify-between`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Jenis Kendaraan Terbanyak</p>
          <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2 truncate">{(topType?.vehicle_type_name ?? '-').toUpperCase()}</h3>
          <p className="text-[#EAE1D8] text-[10px] mt-auto font-medium">{topShare}% dari seluruh kendaraan</p>
        </div>
        <div className={`${radialCardClass} h-[160px] justify-between`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Rata-rata per Transaksi</p>
          <h3 className="text-[#EAE1D8] text-[36px] font-bold leading-none mt-2">{formatRupiah(avgPerTransaction)}</h3>
        </div>
      </div>

      {/* BOTTOM SECTION (Layout 2 Kolom Kiri/Kanan) */}
      <div className="flex gap-4">

        {/* KIRI: Tabel Rincian Kendaraan */}
        <div className="flex-[1.65] border border-[#BF8F51] rounded-[15px] bg-[#14110E] overflow-hidden flex flex-col min-h-[504px]">
          <table className="w-full text-center whitespace-nowrap">
            <thead className="border-b border-[#BF8F51]/40 text-[#EAE1D8] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold text-left">JENIS KENDARAAN</th>
                <th className="px-6 py-4 font-semibold">JUMLAH</th>
                <th className="px-6 py-4 font-semibold">PENDAPATAN</th>
              </tr>
            </thead>
            <tbody className="text-[#EAE1D8] text-[14px]">
              {isLoading && (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">Memuat data…</td></tr>
              )}
              {!isLoading && isError && (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-[#FF5656]">Gagal memuat data. Coba lagi nanti.</td></tr>
              )}
              {!isLoading && !isError && items.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">Tidak ada data pada periode ini.</td></tr>
              )}
              {items.map((row, idx) => (
                <tr key={row.vehicle_type_id ?? idx} className={idx % 2 === 0 ? 'bg-[#322A1F]' : 'bg-transparent'}>
                  <td className="px-6 py-3.5 text-left">{row.vehicle_type_name ?? '-'}</td>
                  <td className="px-6 py-3.5">{row.total_vehicles.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-3.5">{formatRupiah(row.total_revenue)}</td>
                </tr>
              ))}
              {/* Baris Total Paling Bawah */}
              {!isLoading && !isError && items.length > 0 && (
                <tr className="border-t border-[#BF8F51] mt-auto">
                  <td className="px-6 py-4 text-left font-bold text-[#BF8F51] text-[16px]">TOTAL</td>
                  <td className="px-6 py-4 font-bold text-[#BF8F51] text-[16px]">{totalTransactions.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 font-bold text-[#BF8F51] text-[16px]">{formatRupiah(totalRevenue)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* KANAN: Kolom Metode Pembayaran & Grafik */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Metode Pembayaran Box */}
          <div className={`${radialCardClass} h-[280px]`}>
            <h4 className="text-[#BF8F51] font-semibold text-[15px] mb-6">Metode Pembayaran</h4>
            <div className="space-y-6 flex-1">
              {paymentMethods.length === 0 && (
                <p className="text-gray-400 text-[12px]">Tidak ada data pembayaran.</p>
              )}
              {paymentMethods.map((pm) => {
                const pct = Math.round(pm.percentage);
                return (
                  <div key={pm.method}>
                    <div className="flex justify-between text-[#EAE1D8] text-[11px] mb-2 font-medium">
                      <span>{pm.method}</span>
                      <span>{formatRupiah(pm.total_amount)}</span>
                    </div>
                    <div className="w-full h-2 bg-[#423C34] rounded-full overflow-hidden">
                      <div className="h-full bg-[#BF8F51]" style={{ width: `${Math.min(100, pct)}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Total Bawah */}
            <div className="flex justify-between items-end border-t border-[#BF8F51]/30 pt-4 mt-auto">
              <span className="text-[#BF8F51] font-bold text-[14px]">Total semua metode</span>
              <span className="text-[#EAE1D8] font-bold text-[16px]">{formatRupiah(revenueData?.summary.total_revenue ?? 0)}</span>
            </div>
          </div>

          {/* Grafik Kendaraan Box (Pie Chart Sederhana) */}
          <div className={`${radialCardClass} flex-1 justify-center`}>
            <h4 className="text-[#BF8F51] font-semibold text-[15px] mb-4">Grafik kendaraan</h4>
            <div className="flex items-center gap-6 h-full">
              {/* Pie Chart CSS */}
              <div
                className="w-[100px] h-[100px] shrink-0 rounded-full ml-2"
                style={{ background: pieGradient ?? '#423C34' }}
              ></div>

              {/* Legend */}
              <div className="space-y-3 text-[10px] font-medium text-[#BF8F51] w-full">
                {pieSlices.map((slice) => (
                  <div key={slice.label} className="flex justify-between items-center">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-[2px]" style={{ background: slice.color }}></div> {slice.label}</span>
                    <span>{slice.count.toLocaleString('id-ID')} ({Math.round(slice.pct)}%)</span>
                  </div>
                ))}
                {pieSlices.length === 0 && (
                  <p className="text-gray-400">Tidak ada data.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
