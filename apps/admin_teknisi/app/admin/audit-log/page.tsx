'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import type { AuditLogRead } from '@/lib/api/types';
import { getApiErrorMessage } from '@/lib/api/errors';

function formatDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const mon = months[d.getMonth()];
  const yy = d.getFullYear();
  return `${dd} ${mon} ${yy}`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function toISODate(dateStr: string): string | null {
  if (!dateStr) return null;
  return dateStr;
}

const getBadgeColor = (action: string) => {
  switch (action) {
    case 'UPDATE':
    case 'LOGIN':
      return 'border-[#79FF8D] bg-[#00FF2620] text-[#79FF8D]';
    case 'DELETE':
      return 'border-[#FF5656] bg-[#FF565620] text-[#FF5656]';
    case 'ADD':
      return 'border-[#567DFF] bg-[#567DFF20] text-[#567DFF]';
    default:
      return 'border-gray-400 bg-gray-400/20 text-gray-400';
  }
};

export default function AuditLogPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageSize = 10;

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  const handleFilterChange = useCallback(() => {
    setPage(1);
  }, []);

  const { data, isLoading, isError, error, refetch } = useAuditLogs({
    search: search || null,
    module: moduleFilter || null,
    action: actionFilter || null,
    role: roleFilter || null,
    date_from: toISODate(dateFrom) || null,
    date_to: toISODate(dateTo) || null,
    page,
    page_size: pageSize,
  });

  const items: AuditLogRead[] = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-bold text-[#EAE1D8] whitespace-nowrap leading-none tracking-wide">
          Audit Log System
        </h1>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col p-5 rounded-[10px] border border-[#B5884D]/50 bg-transparent w-full gap-5">
        {/* Row 1: Filters */}
        <div className="flex flex-wrap items-end gap-5 w-full">
          {/* TIME RANGE */}
          <div className="space-y-1.5 flex-grow lg:flex-grow-0">
            <label className="text-[12px] font-bold text-[#B5884D] tracking-wide uppercase">TIME RANGE</label>
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-[150px]">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => { setDateFrom(e.target.value); handleFilterChange(); }}
                  className="w-full appearance-none px-4 py-2.5 text-sm bg-transparent border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#B5884D]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
              </div>

              <span className="text-[#B5884D] font-bold text-sm">TO</span>

              <div className="relative w-full sm:w-[150px]">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => { setDateTo(e.target.value); handleFilterChange(); }}
                  className="w-full appearance-none px-4 py-2.5 text-sm bg-transparent border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#B5884D]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filter ROLE */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-[#B5884D] tracking-wide uppercase">ROLE</label>
            <div className="relative w-full sm:w-[140px]">
              <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); handleFilterChange(); }}
                className="w-full appearance-none px-4 py-2.5 pr-10 text-sm bg-transparent border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer"
              >
                <option value="">Semua Role</option>
                <option value="admin">Admin</option>
                <option value="teknisi">Teknisi</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#B5884D]">▼</div>
            </div>
          </div>

          {/* Filter MODULES */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-[#B5884D] tracking-wide uppercase">MODULES</label>
            <div className="relative w-full sm:w-[140px]">
              <select
                value={moduleFilter}
                onChange={(e) => { setModuleFilter(e.target.value); handleFilterChange(); }}
                className="w-full appearance-none px-4 py-2.5 pr-10 text-sm bg-transparent border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer"
              >
                <option value="">Semua Modul</option>
                <option value="tarif">Tarif</option>
                <option value="gate">Gate</option>
                <option value="member">Member</option>
                <option value="shift">Shift</option>
                <option value="user">User</option>
                <option value="vehicle">Vehicle</option>
                <option value="signage">Signage</option>
                <option value="backup">Backup</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#B5884D]">▼</div>
            </div>
          </div>

          {/* Filter AKSI */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-[#B5884D] tracking-wide uppercase">AKSI</label>
            <div className="relative w-full sm:w-[140px]">
              <select
                value={actionFilter}
                onChange={(e) => { setActionFilter(e.target.value); handleFilterChange(); }}
                className="w-full appearance-none px-4 py-2.5 pr-10 text-sm bg-transparent border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer"
              >
                <option value="">Semua Aksi</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
                <option value="ADD">ADD</option>
                <option value="LOGIN">LOGIN</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#B5884D]">▼</div>
            </div>
          </div>
        </div>

        {/* Row 2: Search */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari Nama, Deskripsi.."
            className="w-full pl-12 pr-4 py-3 text-sm bg-black border border-[#B5884D]/50 rounded-[8px] text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:border-[#B5884D]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent w-full flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-[#EAE1D8]">
            <thead className="text-[11px] uppercase bg-[#231F1A] border-b border-[#B5884D]/30">
              <tr>
                <th className="px-6 py-5 font-medium tracking-wider text-left whitespace-nowrap text-gray-300">WAKTU AKTIVITAS</th>
                <th className="px-6 py-5 font-medium tracking-wider text-left whitespace-nowrap text-gray-300">NAMA USER</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-gray-300">ROLE</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-gray-300">MODUL</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-gray-300">AKSI</th>
                <th className="px-6 py-5 font-medium tracking-wider text-left whitespace-nowrap text-gray-300">DESKRIPSI</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Memuat data audit log...</td></tr>
              ) : isError ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center bg-[#231F1A]">
                  <p className="text-[#FF5656] text-sm mb-2">{getApiErrorMessage(error, 'Gagal memuat data audit log')}</p>
                  <button onClick={() => refetch()} className="text-[#B5884D] hover:text-[#EAE1D8] text-sm underline">Coba lagi</button>
                </td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Belum ada aktivitas log.</td></tr>
              ) : (
                items.map((log, index) => (
                  <tr key={log.id} className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326]/50 transition-colors border-b border-[#B5884D]/10`}>
                    <td className="px-6 py-4 text-left whitespace-nowrap">
                      <div className="flex flex-col text-[13px] text-gray-300 leading-snug">
                        <span>{formatDate(log.created_at)}</span>
                        <span>{formatTime(log.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-left text-[#EAE1D8] font-medium max-w-[150px] truncate" title={log.user?.name ?? '-'}>
                      {log.user?.name ?? '-'}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-400">
                      {log.role ?? '-'}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-300">
                      {log.module}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center justify-center mx-auto w-[85px] h-[28px] rounded-full border text-[11px] font-bold tracking-wider ${getBadgeColor(log.action)}`}>
                        {log.action}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-left text-gray-400 min-w-[300px] max-w-[400px] leading-relaxed">
                      {log.description ?? '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-transparent border-t border-[#B5884D]/30 gap-4 mt-auto">
          <span className="text-sm text-gray-400">
            Menampilkan {total > 0 ? (page - 1) * pageSize + 1 : 0}-{Math.min(page * pageSize, total)} dari {total} Audit Log
          </span>
          <div className="inline-flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 text-sm text-gray-400 border border-[#B5884D]/50 rounded-[4px] hover:text-white hover:border-[#B5884D] transition-colors bg-transparent disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center text-sm rounded-[4px] font-bold transition-colors ${
                    page === pageNum
                      ? 'text-[#17130E] bg-[#B5884D]'
                      : 'text-[#EAE1D8] border border-[#B5884D]/50 hover:bg-[#B5884D]/20 bg-transparent'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
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
