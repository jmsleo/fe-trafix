'use client';

import React, { useMemo, useState } from 'react';
import ExportButtons from '@/app/components/ExportButtons';
import { useRevenueReport } from '@/hooks/useFinanceReports';
import { formatRupiah } from '@/lib/format';

const DONUT_COLORS = ['#BF8F51', '#906B3D', '#604728', '#4B5563', '#9CA3AF'];

export default function LaporanPendapatanPage() {
  // Class bawaan untuk card dengan Radial Gradient: Hitam di tengah (#110C08), memudar ke coklat di pinggir
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

  const { data, isLoading, isError } = useRevenueReport(params);

  const summary = data?.summary;
  const totalRevenue = summary?.total_revenue ?? 0;
  const totalTransactions = summary?.total_transactions ?? 0;
  const avgTransaction =
    totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;

  const paymentMethods = useMemo(
    () => [...(data?.payment_methods ?? [])].sort((a, b) => b.total_amount - a.total_amount),
    [data],
  );
  const topMethod = paymentMethods[0] ?? null;

  // Area chart dari daily trend
  const trend = useMemo(() => data?.items ?? [], [data]);
  const chart = useMemo(() => {
    if (trend.length === 0) return null;
    const W = 700;
    const H = 130;
    const max = Math.max(...trend.map((d) => d.total_revenue), 1);
    const stepX = trend.length > 1 ? W / (trend.length - 1) : W;
    const points = trend.map((d, i) => ({
      x: i * stepX,
      y: H - 5 - (d.total_revenue / max) * (H - 15),
    }));
    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const area = `${line} L ${W} ${H} L 0 ${H} Z`;
    return { line, area, max };
  }, [trend]);

  // Donut chart dari metode pembayaran
  const donutGradient = useMemo(() => {
    if (paymentMethods.length === 0) return undefined;
    let acc = 0;
    const parts = paymentMethods.slice(0, 5).map((pm, idx) => {
      const from = acc;
      acc += pm.percentage;
      return `${DONUT_COLORS[idx % DONUT_COLORS.length]} ${from}% ${acc}%`;
    });
    if (acc < 100) parts.push(`${DONUT_COLORS[0]} ${acc}% 100%`);
    return `conic-gradient(${parts.join(', ')})`;
  }, [paymentMethods]);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">

      {/* HEADER HALAMAN */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#EAE1D8]">Laporan Pendapatan</h2>
        <div className="flex items-center gap-3">
          <ExportButtons
            report="revenue"
            params={{
              start_date: startDate || undefined,
              end_date: endDate || undefined,
            }}
          />
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
        {/* Card 1 */}
        <div className={`${radialCardClass} h-[160px] justify-between`}>
          <p className="text-[#EAE1D8] text-[12px] font-semibold uppercase tracking-wide">Total Keseluruhan Pendapatan</p>
          <h3 className="text-[#BF8F51] text-[40px] font-bold leading-none mt-2">{formatRupiah(totalRevenue)}</h3>
        </div>
        {/* Card 2 */}
        <div className={`${radialCardClass} h-[160px] justify-between relative`}>
          <p className="text-[#EAE1D8] text-[12px] font-semibold uppercase tracking-wide">Total Transaksi</p>
          <h3 className="text-[#BF8F51] text-[40px] font-bold leading-none mt-2">{totalTransactions.toLocaleString('id-ID')}</h3>
          <p className="text-[#BF8F51] text-[12px] font-semibold mt-auto">Qty</p>
        </div>
        {/* Card 3 */}
        <div className={`${radialCardClass} h-[160px] justify-between`}>
          <p className="text-[#EAE1D8] text-[12px] font-semibold uppercase tracking-wide">Rata-Rata. Nilai Transaksi</p>
          <h3 className="text-[#BF8F51] text-[40px] font-bold leading-none mt-2">{formatRupiah(avgTransaction)}</h3>
        </div>
        {/* Card 4 */}
        <div className={`${radialCardClass} h-[160px] justify-between`}>
          <p className="text-[#EAE1D8] text-[12px] font-semibold uppercase tracking-wide">Metode Pembayaran Teratas</p>
          <h3 className="text-[#EAE1D8] text-[40px] font-bold leading-none mt-2 truncate">{topMethod?.method ?? '-'}</h3>
          <div className="mt-auto flex items-center justify-between w-full">
            <div className="w-[60%] h-[4px] bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-[#BF8F51]" style={{ width: `${Math.min(100, Math.round(topMethod?.percentage ?? 0))}%` }}></div>
            </div>
            <span className="text-[#EAE1D8] text-[10px] font-medium">{Math.round(topMethod?.percentage ?? 0)}% Kontribusi</span>
          </div>
        </div>
      </div>

        {/* CHARTS SECTION */}
         <div className="grid grid-cols-[1fr_240px] gap-4 min-h-[300px]">

        {/* Area Chart (Grafik Tren Pendapatan) */}
        <div className={`${radialCardClass} relative`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-[#BF8F51] font-semibold text-[15px]">Grafik tren pendapatan</h4>
              <p className="text-[12px] text-[#BF8F51]/60 mt-0.5">Per hari dalam periode terpilih</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col relative mt-2 text-[12px] text-[#BF8F51]">
            {/* Y-Axis */}
            <div className="absolute inset-0 flex flex-col justify-between pb-8 z-0">
              {[4, 3, 2, 1, 0].map((i) => {
                const val = chart ? Math.round((chart.max * i) / 4) : 0;
                return (
                  <div key={i} className="flex items-center w-full">
                    <span className="w-14 text-left text-[10px]">{formatRupiah(val)}</span>
                    <div className="flex-1 border-b border-[#BF8F51]/20 ml-2"></div>
                  </div>
                );
              })}
            </div>
            {/* SVG Area Chart */}
            <div className="absolute inset-0 pl-16 pb-8 z-10">
              {chart ? (
                <svg className="w-full h-full" viewBox="0 0 700 130" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradientArea2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#BF8F51" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#BF8F51" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d={chart.area} fill="url(#gradientArea2)" />
                  <path d={chart.line} fill="none" stroke="#BF8F51" strokeWidth="2.5" />
                </svg>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                  {isLoading ? 'Memuat…' : 'Tidak ada data tren.'}
                </div>
              )}
            </div>
            {/* X-Axis */}
            {trend.length > 0 && (
              <div className="absolute bottom-4 left-16 right-0 flex justify-around z-20 px-1 text-[#EAE1D8] text-[10px]">
                {trend
                  .filter((_, idx) =>
                    trend.length <= 6 ||
                    idx === 0 ||
                    idx === trend.length - 1 ||
                    idx % Math.ceil(trend.length / 5) === 0,
                  )
                  .map((d) => (
                    <span key={d.date}>{new Date(d.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Donut Chart (Grafik Pembayaran) */}
        <div className={`${radialCardClass}`}>
          <h4 className="text-[#BF8F51] font-semibold text-[15px] mb-4">Grafik Pembayaran</h4>
          <div className="flex-1 flex flex-col items-center justify-between">
            <div
              className="relative w-[110px] h-[110px] rounded-full flex items-center justify-center shadow-lg mt-2"
              style={{ background: donutGradient ?? '#423C34' }}
            >
              <div className="w-[80px] h-[80px] bg-[#17130E] rounded-full"></div>
            </div>

            <div className="w-full space-y-2 mt-4 text-[12px] font-medium text-[#BF8F51]">
              {paymentMethods.slice(0, 5).map((pm, idx) => (
                <div key={pm.method} className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: DONUT_COLORS[idx % DONUT_COLORS.length] }}></div> {pm.method}
                  </span>
                  <span>{pm.total_transactions.toLocaleString('id-ID')} ({Math.round(pm.percentage)}%)</span>
                </div>
              ))}
              {paymentMethods.length === 0 && (
                <p className="text-gray-400 text-center">Tidak ada data.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION (Tabel & Executive Insight) */}
      <div className="grid grid-cols-[1fr_240px] gap-4">

      {/* Table Laporan */}
        <div className="border border-[#BF8F51] rounded-[15px] bg-[#14110E] overflow-hidden">
          <table className="w-full text-center whitespace-nowrap">
            <thead className="border-b border-[#BF8F51] text-[#EAE1D8] text-[15px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5 font-regular">METODE PEMBAYARAN</th>
                <th className="px-6 py-5 font-regular">JUMLAH TRANSAKSI</th>
                <th className="px-6 py-5 font-regular">TOTAL NOMINAL</th>
                <th className="px-6 py-5 font-regular">KONTRIBUSI</th>
              </tr>
            </thead>
            <tbody className="text-[#EAE1D8] text-[14px]">
              {isLoading && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Memuat data…</td></tr>
              )}
              {!isLoading && isError && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-[#FF5656]">Gagal memuat data. Coba lagi nanti.</td></tr>
              )}
              {!isLoading && !isError && paymentMethods.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Tidak ada data pada periode ini.</td></tr>
              )}
              {paymentMethods.map((pm, idx) => (
                <tr key={pm.method} className={idx % 2 === 0 ? 'bg-[#322A1F]' : 'bg-transparent'}>
                  <td className="px-6 py-4">{pm.method}</td>
                  <td className="px-6 py-4">{pm.total_transactions.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">{formatRupiah(pm.total_amount)}</td>
                  <td className="px-6 py-4">{Math.round(pm.percentage)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Executive Insight */}
        <div className={`${radialCardClass}`}>
          <h4 className="text-[#BF8F51] font-bold text-[15px] mb-5">Executive Insight</h4>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center text-[#BF8F51]">
              <span className="leading-tight">Revenue:<br/>{formatRupiah(totalRevenue)}</span>
              <span className="text-right leading-tight text-[12px]">{totalTransactions.toLocaleString('id-ID')}<br/>transaksi</span>
            </div>
            {paymentMethods.slice(0, 3).map((pm, idx) => (
              <div key={pm.method} className="flex justify-between items-center text-[#BF8F51]">
                <span className="leading-tight">{pm.method}:<br/>{idx === 0 ? 'Kontribusi terbesar' : 'Berkontribusi'}</span>
                <span className="text-right leading-tight text-[12px]">({Math.round(pm.percentage)}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
