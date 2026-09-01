'use client';

import React, { useMemo, useState } from 'react';
import {
  useDashboardShifts,
  useExecutiveInsight,
  usePaymentDistribution,
  useRevenueByShift,
  useRevenueToday,
  useVehicleDistribution,
} from '@/hooks/useFinanceDashboard';
import type { DashboardFilterParams } from '@/lib/api/types';
import { formatRupiah } from '@/lib/format';

function todayWib(): string {
  // Format YYYY-MM-DD dalam zona waktu lokal
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const PIE_COLORS = ['#BF8F51', '#866236', '#42301A', '#9CA3AF', '#4B5563', '#D9B380'];

function buildConicGradient(percentages: number[], colors: string[]): string {
  let cursor = 0;
  const stops = percentages.map((p, i) => {
    const start = cursor;
    cursor += p;
    return `${colors[i % colors.length]} ${start}% ${cursor}%`;
  });
  return `conic-gradient(${stops.join(', ')})`;
}

export default function DashboardPage() {
  // Class bawaan untuk card dengan Radial Gradient: Hitam di tengah (#110C08), memudar ke coklat transparan di pinggir
  const radialCardClass = "bg-[radial-gradient(ellipse_at_center,_#110C08_0%,_rgba(191,143,81,0.18)_100%)] border border-[#BF8F51]/40 rounded-[10px] p-5 flex flex-col hover:border-[#BF8F51] transition-colors";

  const [selectedDate, setSelectedDate] = useState(todayWib());
  const [selectedShiftId, setSelectedShiftId] = useState('');

  const filterParams = useMemo<DashboardFilterParams>(
    () => ({
      ...(selectedDate ? { date: selectedDate } : {}),
      ...(selectedShiftId ? { shift_id: selectedShiftId } : {}),
    }),
    [selectedDate, selectedShiftId],
  );

  const { data: dashboardShifts } = useDashboardShifts();
  const { data: revenueToday, isLoading: revenueLoading } = useRevenueToday(filterParams);
  const { data: revenueShift } = useRevenueByShift(filterParams);
  const { data: vehicleDist } = useVehicleDistribution(filterParams);
  const { data: paymentDist } = usePaymentDistribution(filterParams);
  const { data: insight } = useExecutiveInsight(filterParams);

  const shifts = revenueShift?.shifts ?? [];
  const vehicleSegments = (vehicleDist?.distribution ?? []).filter((d) => d.percentage > 0);
  const paymentSegments = (paymentDist?.distribution ?? []).filter((d) => d.percentage > 0);
  const topVehicle = vehicleSegments.reduce<(typeof vehicleSegments)[number] | null>(
    (top, cur) => (!top || cur.percentage > top.percentage ? cur : top), null);
  const topPayment = paymentSegments.reduce<(typeof paymentSegments)[number] | null>(
    (top, cur) => (!top || cur.percentage > top.percentage ? cur : top), null);

  const statCards = [
    {
      title: 'Total Pendapatan',
      value: revenueLoading ? '…' : formatRupiah(revenueToday?.total_revenue ?? 0),
      desc: revenueToday ? `Hari ini, ${revenueToday.date}` : 'Hari ini',
    },
    ...shifts.map((shift, idx) => ({
      title: shift.shift_name ?? `Shift ${idx + 1}`,
      value: formatRupiah(shift?.total_revenue ?? 0),
      desc: `${shift?.total_transactions ?? 0} transaksi`,
    })),
  ];

  const pendingTickets = insight?.total_pending_tickets ?? 0;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">

      <h2 className="text-2xl font-bold text-[#EAE1D8]">Dashboard</h2>

      {/* FILTER & SEARCH BAR */}
      {/* Tambahan border pembungkus luar (wrapper) */}
      <div className="border border-[#BF8F51]/40 rounded-[10px] p-4 flex items-center justify-between mb-2">

        <div className="flex items-center gap-4">
          {/* Input Pilih Tanggal (native date picker, diwarnai sesuai tema) */}
          <div className="relative">
            <svg className="absolute left-3 top-2.5 text-[#BF8F51] pointer-events-none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-[150px] pl-9 pr-3 py-2 bg-transparent border border-[#BF8F51] rounded-[7px] text-sm text-[#BF8F51] outline-none focus:border-[#BF8F51] [color-scheme:dark] transition-colors"
            />
          </div>

          {/* Select Shift (dinamis dari daftar shift aktif yang dibuat admin) */}
          <select
            value={selectedShiftId}
            onChange={(e) => setSelectedShiftId(e.target.value)}
            className="px-4 py-2 bg-transparent border border-[#BF8F51] rounded-[7px] text-sm text-[#BF8F51] appearance-none outline-none focus:border-[#BF8F51] cursor-pointer w-48 transition-colors"
          >
            <option className="bg-[#14110E]" value="">Semua Shift</option>
            {(dashboardShifts ?? []).map((shift) => (
              <option key={shift.id} className="bg-[#14110E]" value={shift.id}>
                {shift.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative w-72">
          {/* Ikon kaca pembesar diubah menjadi warna BF8F51 */}
          <svg className="absolute left-3 top-2.5 text-[#BF8F51]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            placeholder="Cari Jenis, Tipe..."
            className="w-full bg-transparent border border-[#BF8F51] rounded-[7px] pl-10 pr-4 py-2 text-sm text-[#EAE1D8] placeholder-gray-500 outline-none focus:border-[#BF8F51] transition-colors"
          />
        </div>

      </div>

      {/* STATISTIC CARDS */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div key={idx} className={`${radialCardClass} justify-between h-32`}>
            <p className="text-gray-400 text-sm font-medium">{card.title}</p>
            <h3 className="text-[#BF8F51] text-3xl font-bold mt-1">{card.value}</h3>
            <p className="text-[#BF8F51]/70 text-xs mt-2">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-3 gap-4 h-[280px]">

        {/* Chart 1: Tren Pendapatan (Area Chart kustom SVG) */}
        <div className={`${radialCardClass} relative col-span-1`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-[#BF8F51] font-semibold text-sm">Grafik tren pendapatan</h4>
              <p className="text-[10px] text-[#BF8F51]/60 mt-0.5">
                {insight
                  ? `${insight.revenue_growth_percentage >= 0 ? '↑' : '↓'} ${Math.abs(insight.revenue_growth_percentage).toLocaleString('id-ID')}% dari kemarin`
                  : '— dari periode sebelumnya'}
              </p>
            </div>
            <select className="bg-transparent border border-[#BF8F51]/50 text-[10px] text-[#BF8F51] rounded px-2 py-1 outline-none">
              <option className="bg-[#14110E]">Harian</option>
            </select>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-[11px] text-[#BF8F51]">
            <p className="text-[#BF8F51] text-xl font-bold">{formatRupiah(insight?.revenue_today ?? 0)}</p>
            <p className="mt-1 text-[#BF8F51]/60">Kemarin {formatRupiah(insight?.revenue_yesterday ?? 0)}</p>
          </div>
        </div>

        {/* Chart 2: Grafik Kendaraan (Pie Chart Menggunakan CSS Conic-Gradient) */}
        <div className={`${radialCardClass}`}>
          <div className="mb-6">
            <h4 className="text-[#BF8F51] font-semibold text-sm">Grafik kendaraan</h4>
          </div>
          <div className="flex-1 flex flex-col items-center justify-between">
            {/* Full Pie Chart */}
            <div
              className="w-[110px] h-[110px] rounded-full"
              style={{ background: buildConicGradient(vehicleSegments.map((s) => s.percentage), PIE_COLORS) }}
            ></div>

            {/* Legend */}
            <div className="w-full space-y-1.5 mt-6 text-xs font-medium">
              {vehicleSegments.length === 0 && (
                <div className="flex justify-between items-center"><span className="text-gray-400">Belum ada data</span><span className="text-[#BF8F51]">-</span></div>
              )}
              {vehicleSegments.map((seg, i) => (
                <div key={seg.vehicle_type_id} className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-gray-400">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}></div>
                    {seg.vehicle_type_name ?? seg.vehicle_type_id.slice(0, 8)}
                  </span>
                  <span className="text-[#BF8F51]">{seg.total_vehicles} ({seg.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 3: Grafik Pembayaran (Donut Chart) */}
        <div className={`${radialCardClass}`}>
          <div className="mb-6">
            <h4 className="text-[#BF8F51] font-semibold text-sm">Grafik Pembayaran</h4>
          </div>
          <div className="flex-1 flex flex-col items-center justify-between">
            {/* Donut Chart */}
            <div
              className="relative w-[110px] h-[110px] rounded-full flex items-center justify-center shadow-lg"
              style={{ background: buildConicGradient(paymentSegments.map((s) => s.percentage), [...PIE_COLORS].reverse()) }}
            >
              {/* Lubang Tengah (Warna disesuaikan agar menyatu dengan latar) */}
              <div className="w-[80px] h-[80px] bg-[#1B140D] rounded-full"></div>
            </div>

            {/* Legend */}
            <div className="w-full space-y-1.5 mt-6 text-xs font-medium">
              {paymentSegments.length === 0 && (
                <div className="flex justify-between items-center"><span className="text-gray-400">Belum ada data</span><span className="text-[#BF8F51]">-</span></div>
              )}
              {paymentSegments.map((seg, i) => (
                <div key={seg.payment_method} className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-gray-400">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: [...PIE_COLORS].reverse()[i % PIE_COLORS.length] }}></div>
                    {seg.payment_method}
                  </span>
                  <span className="text-[#BF8F51]">{seg.total_transactions} ({seg.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: Insight & Alerts */}
      <div className="grid grid-cols-2 gap-4">

        {/* Executive Insight */}
        <div className={`${radialCardClass} justify-center`}>
          <h4 className="text-[#BF8F51] font-semibold text-[15px] mb-5">Executive Insight</h4>
          <div className="space-y-4 text-sm font-medium">
            <div className="flex justify-between">
              <span className="text-[#BF8F51]">Pendapatan hari ini</span>
              <span className="text-[#BF8F51]">{formatRupiah(insight?.revenue_today ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#BF8F51]">Jenis kendaraan terbanyak</span>
              <span className="text-[#BF8F51]">{topVehicle ? `(${topVehicle.percentage}%)` : '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#BF8F51]">Metode pembayaran terbanyak</span>
              <span className="text-[#BF8F51]">{topPayment ? `${topPayment.payment_method} (${topPayment.percentage}%)` : '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#BF8F51]">Tiket gantung tertunda</span>
              <span className="text-[#BF8F51]">{pendingTickets} tiket</span>
            </div>
          </div>
        </div>

        {/* Peringatan Operasional */}
        <div className={`${radialCardClass}`}>
          <h4 className="text-[#BF8F51] font-semibold text-[15px] mb-4">Peringatan Operasional</h4>
          <div className="space-y-3 text-sm font-medium">

            {/* Alert Merah (Tiket) - Segitiga Tanda Seru */}
            {pendingTickets > 10 && (
              <div className="flex items-center gap-3 bg-[#FF8383]/[0.24] border border-[#FF4343] px-4 py-3 rounded-[7px]">
                <svg className="text-[#FF4343]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span className="text-[#EAE1D8]">Tiket gantung melebihi kapasitas {pendingTickets} / 10 tiket</span>
              </div>
            )}

            {/* Alert Kuning (Revenue) - Lingkaran Tanda Seru Kebalik (Info 'i') */}
            {(insight?.revenue_growth_percentage ?? 0) < 0 && (
              <div className="flex items-center gap-3 bg-[#FFD94E]/[0.24] border border-[#FFBC2C] px-4 py-3 rounded-[7px]">
                <svg className="text-[#FFBC2C]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span className="text-[#EAE1D8]">Revenue turun {Math.abs(insight?.revenue_growth_percentage ?? 0).toLocaleString('id-ID')}%</span>
              </div>
            )}

            {/* Alert Abu-abu (Pembayaran) */}
            {topPayment && (
              <div className="flex items-center gap-3 bg-[#767676]/[0.24] border border-[#B5B5B5] px-4 py-3 rounded-[7px]">
                <svg className="text-[#B5B5B5]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span className="text-[#EAE1D8]">{topPayment.payment_method} mendominasi pembayaran ({topPayment.percentage}%)</span>
              </div>
            )}

            {!pendingTickets && !insight && !topPayment && (
              <div className="flex items-center gap-3 bg-[#767676]/[0.24] border border-[#B5B5B5] px-4 py-3 rounded-[7px]">
                <svg className="text-[#B5B5B5]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span className="text-[#EAE1D8]">Tidak ada peringatan operasional</span>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
