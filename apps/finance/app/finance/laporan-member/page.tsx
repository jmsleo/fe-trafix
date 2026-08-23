'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ExportButtons from '@/app/components/ExportButtons';
import { useMemberReport } from '@/hooks/useFinanceReports';
import type { MemberReportItem, MemberStatus } from '@/lib/api/types';
import { formatRupiah, formatDateTime } from '@/lib/format';

const PAGE_SIZE = 10;

const STATUS_LABEL: Record<MemberStatus, string> = {
  active: 'AKTIF',
  inactive: 'NONAKTIF',
  blocked: 'DIBLOKIR',
};

export default function LaporanMemberPage() {
  // Class bawaan untuk card dengan efek radial gradient (Hitam di tengah, coklat di pinggir)
  const radialCardClass = "bg-[radial-gradient(ellipse_at_center,_#110C08_0%,_rgba(191,143,81,0.18)_100%)] border border-[#BF8F51] rounded-[15px] p-5 flex flex-col hover:border-[#BF8F51] transition-colors";

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | MemberStatus>('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useMemberReport({
    page,
    size: PAGE_SIZE,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  // Query ringan (size 1) hanya untuk mengambil count per status dari pagination
  const { data: activeData } = useMemberReport({ page: 1, size: 1, status: 'active' });
  const { data: inactiveData } = useMemberReport({ page: 1, size: 1, status: 'inactive' });
  const { data: blockedData } = useMemberReport({ page: 1, size: 1, status: 'blocked' });

  const rows = data?.items ?? [];
  const pagination = data?.pagination;
  const totalMembers = pagination?.total_items ?? 0;
  const activeCount = activeData?.pagination.total_items ?? 0;
  const inactiveCount = inactiveData?.pagination.total_items ?? 0;
  const blockedCount = blockedData?.pagination.total_items ?? 0;

  const statusBar = useMemo(() => {
    const total = activeCount + inactiveCount + blockedCount;
    if (total === 0) return [];
    return [
      { label: 'Aktif', count: activeCount, pct: (activeCount / total) * 100, color: '#79FF8D' },
      { label: 'Nonaktif', count: inactiveCount, pct: (inactiveCount / total) * 100, color: '#D9D9D9' },
      { label: 'Diblokir', count: blockedCount, pct: (blockedCount / total) * 100, color: '#FF7E7E' },
    ].filter((s) => s.count > 0);
  }, [activeCount, inactiveCount, blockedCount]);

  const renderVehicles = (member: MemberReportItem) => {
    if (member.vehicles.length === 0) return '-';
    return member.vehicles.map((v) => v.police_number).join(', ');
  };

  const renderVehicleTypes = (member: MemberReportItem) => {
    const types = [...new Set(member.vehicles.map((v) => v.vehicle_type_name).filter(Boolean))];
    return types.length > 0 ? types.join(', ') : '-';
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6 pb-10">

      {/* HEADER HALAMAN */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#EAE1D8]">Laporan Member</h2>
        <div className="flex items-center gap-3">
          <ExportButtons
            report="members"
            params={{
              search: search || undefined,
              status: statusFilter || undefined,
            }}
          />
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className="border border-[#BF8F51]/40 rounded-[10px] p-4 flex items-end gap-4 w-full">
        {/* Dropdown Status */}
        <div className="w-[180px]">
          <label className="block text-[#BF8F51] text-[11px] font-semibold mb-2 uppercase">STATUS</label>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as '' | MemberStatus);
                setPage(1);
              }}
              className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] pl-3 pr-8 py-2 text-sm appearance-none outline-none focus:border-[#BF8F51]"
            >
              <option className="bg-[#14110E]" value="">Semua Status</option>
              <option className="bg-[#14110E]" value="active">Aktif</option>
              <option className="bg-[#14110E]" value="inactive">Nonaktif</option>
              <option className="bg-[#14110E]" value="blocked">Diblokir</option>
            </select>
            <svg className="absolute right-3 top-[11px] text-[#BF8F51] pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>

        {/* Reset Filter */}
        <div>
          <button
            onClick={() => {
              setStatusFilter('');
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
        <div className="relative ml-auto w-[200px]">
          <svg className="absolute left-3 top-2.5 text-[#BF8F51]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari Member, Plat..."
            className="w-full bg-transparent border border-[#BF8F51] rounded-[7px] pl-9 pr-3 py-2 text-sm text-[#EAE1D8] placeholder-gray-500 outline-none focus:border-[#BF8F51] transition-colors"
          />
        </div>
      </div>

      {/* MIDDLE SECTION (Grid Layout Kiri Kanan) */}
      <div className="grid grid-cols-[1fr_270px] gap-6">

        {/* KIRI: 3 Cards Stat & Distribusi Status */}
        <div className="flex flex-col gap-6">

          {/* 3 STAT CARDS */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`${radialCardClass} h-[160px] justify-between`}>
              <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Total Member</p>
              <h3 className="text-[#BF8F51] text-[40px] font-bold leading-none mt-2">{totalMembers.toLocaleString('id-ID')}</h3>
            </div>
            <div className={`${radialCardClass} h-[160px] justify-between`}>
              <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Member Aktif</p>
              <h3 className="text-[#BF8F51] text-[40px] font-bold leading-none mt-2">{activeCount.toLocaleString('id-ID')}</h3>
            </div>
            <div className={`${radialCardClass} h-[160px] justify-between`}>
              <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Member Diblokir</p>
              <h3 className="text-[#FF7E7E] text-[40px] font-bold leading-none mt-2">{blockedCount.toLocaleString('id-ID')}</h3>
            </div>
          </div>

          {/* DISTRIBUSI STATUS */}
          <div className={`${radialCardClass} h-[250px] relative`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-[#BF8F51] font-semibold text-[15px]">Distribusi Status Member</h4>
                <p className="text-[10px] text-[#BF8F51]/60 mt-0.5">Seluruh member terdaftar</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-6 px-2 pb-4">
              <div className="w-full h-4 bg-[#423C34] rounded-full overflow-hidden flex">
                {statusBar.map((s) => (
                  <div key={s.label} style={{ width: `${s.pct}%`, background: s.color }}></div>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-3 text-[12px] font-medium text-[#EAE1D8]">
                {statusBar.map((s) => (
                  <span key={s.label} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }}></div>
                    {s.label}: {s.count.toLocaleString('id-ID')} ({Math.round(s.pct)}%)
                  </span>
                ))}
                {statusBar.length === 0 && (
                  <span className="text-gray-400">Tidak ada data member.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* KANAN: Member Insight */}
        <div className={`${radialCardClass} h-full`}>
          <h4 className="text-[#BF8F51] font-bold text-[18px] mb-6">Member Insight</h4>
          <div className="space-y-6 text-[14px]">
            <div className="flex justify-between items-center text-[#BF8F51]">
              <span>total member</span>
              <span>{totalMembers.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center text-[#BF8F51]">
              <span>member aktif</span>
              <span>{activeCount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center text-[#BF8F51]">
              <span>member nonaktif</span>
              <span>{inactiveCount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center text-[#BF8F51]">
              <span>member diblokir</span>
              <span>{blockedCount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-start text-[#BF8F51]">
              <span className="w-2/3 leading-tight">persentase<br/>aktif</span>
              <span className="w-1/3 text-right leading-tight">
                {totalMembers > 0 ? `${Math.round((activeCount / totalMembers) * 100)} %` : '-'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* TABLE DATA MEMBER */}
      <div className="border border-[#BF8F51] rounded-[15px] bg-[#14110E] overflow-hidden flex flex-col w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-center whitespace-nowrap">
            <thead className="border-b border-[#BF8F51] text-[#EAE1D8] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5 font-semibold text-left">NO. MEMBER</th>
                <th className="px-6 py-5 font-semibold text-left">NAMA LENGKAP</th>
                <th className="px-6 py-5 font-semibold">NO. PLAT KENDARAAN</th>
                <th className="px-6 py-5 font-semibold">JENIS KENDARAAN</th>
                <th className="px-6 py-5 font-semibold">TANGGAL PENDAFTARAN</th>
                <th className="px-6 py-5 font-semibold">FEE</th>
                <th className="px-6 py-5 font-semibold text-center">STATUS</th>
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
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">Tidak ada data member.</td></tr>
              )}
              {rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`hover:bg-[#BF8F51]/10 transition-colors ${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-transparent'}`}
                >
                  <td className="px-6 py-3 text-left font-medium text-gray-300">{row.member_code}</td>
                  <td className="px-6 py-3 text-left">{row.name}</td>
                  <td className="px-6 py-3">{renderVehicles(row)}</td>
                  <td className="px-6 py-3">{renderVehicleTypes(row)}</td>
                  <td className="px-6 py-3 text-[13px] text-gray-300">{formatDateTime(row.created_at)}</td>
                  <td className="px-6 py-3">{row.plan ? formatRupiah(row.plan.price) : '-'}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`inline-flex items-center justify-center w-[92px] h-[22px] text-[11px] font-bold rounded-[9px] border ${
                      row.status === 'active'
                        ? 'border-[#79FF8D] text-[#79FF8D] bg-[#00FF26]/[0.35]'
                        : row.status === 'blocked'
                        ? 'border-[#FF7E7E] text-[#FF7E7E] bg-[#FF0000]/[0.35]'
                        : 'border-[#D9D9D9] text-[#D9D9D9] bg-[#A7A6A5]/[0.24]'
                    }`}>
                      {STATUS_LABEL[row.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#BF8F51] text-sm">
          <p className="text-gray-400 text-[13px]">
            Menampilkan {rows.length} dari {pagination?.total_items ?? 0} Member
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
            <span className="text-[#EAE1D8] text-[12px]">/ {pagination?.total_pages ?? 1}</span>
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

    </div>
  );
}
