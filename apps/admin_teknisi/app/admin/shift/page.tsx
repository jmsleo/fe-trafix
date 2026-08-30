'use client';

import Button from '@/app/components/ui/Button';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useShifts, useCreateShift, useUpdateShift, useDeleteShift } from '@/hooks/useShifts';
import type { ShiftRead, ShiftStatus } from '@/lib/api/types';
import { getApiErrorMessage } from '@/lib/api/errors';

function minutesOf(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
}

function shiftsOverlap(
  aStart: string,
  aFinish: string,
  aCrosses: boolean,
  bStart: string,
  bFinish: string,
  bCrosses: boolean,
): boolean {
  const DAY = 24 * 60;
  const aRanges: [number, number][] = aCrosses
    ? [[minutesOf(aStart), DAY], [0, minutesOf(aFinish)]]
    : [[minutesOf(aStart), minutesOf(aFinish)]];
  const bRanges: [number, number][] = bCrosses
    ? [[minutesOf(bStart), DAY], [0, minutesOf(bFinish)]]
    : [[minutesOf(bStart), minutesOf(bFinish)]];
  for (const [as, ae] of aRanges) {
    for (const [bs, be] of bRanges) {
      if (as < be && bs < ae) return true;
    }
  }
  return false;
}

export default function ShiftPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
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

  const { data, isLoading, isError, error, refetch } = useShifts({
    search: search || null,
    status: (statusFilter as ShiftStatus) || null,
    page,
    page_size: pageSize,
  });

  // All active shifts, used to guard against time-overlapping shifts in the
  // create/edit form (mirrors backend /shifts validation).
  const { data: activeShiftsData } = useShifts({ status: 'active', page_size: 100 });
  const activeShifts: ShiftRead[] = useMemo(() => activeShiftsData?.items ?? [], [activeShiftsData]);

  const createShift = useCreateShift();
  const updateShift = useUpdateShift();
  const deleteShift = useDeleteShift();

  const items: ShiftRead[] = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<ShiftRead | null>(null);
  const [formData, setFormData] = useState({ name: '', start_time: '', finish_time: '' });
  const [isStatusActive, setIsStatusActive] = useState(true);
  const [deleteItem, setDeleteItem] = useState<ShiftRead | null>(null);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    const update = () => {
      setLastUpdate(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB');
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = useCallback(() => {
    setEditItem(null);
    setFormData({ name: '', start_time: '', finish_time: '' });
    setIsStatusActive(true);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((shift: ShiftRead) => {
    setEditItem(shift);
    setFormData({ name: shift.name, start_time: shift.start_time, finish_time: shift.finish_time });
    setIsStatusActive(shift.status === 'active');
    setIsModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!formData.name || !formData.start_time || !formData.finish_time) {
      alert('Nama Shift, Jam Mulai, dan Jam Selesai wajib diisi!');
      return;
    }

    const crossesMidnight = formData.finish_time < formData.start_time;
    const status: ShiftStatus = isStatusActive ? 'active' : 'inactive';

    if (isStatusActive) {
      const conflicting = activeShifts.find(
        (s) =>
          s.id !== (editItem?.id ?? null) &&
          shiftsOverlap(
            formData.start_time,
            formData.finish_time,
            crossesMidnight,
            s.start_time,
            s.finish_time,
            !!s.crosses_midnight,
          ),
      );
      if (conflicting) {
        alert(
          `Waktu shift bentrok dengan shift aktif '${conflicting.name}' (${conflicting.start_time} - ${conflicting.finish_time}).`,
        );
        return;
      }
    }

    if (editItem) {
      updateShift.mutate(
        { id: editItem.id, data: { ...formData, crosses_midnight: crossesMidnight, status } },
        {
          onSuccess: () => setIsModalOpen(false),
          onError: (err) => alert(getApiErrorMessage(err, 'Gagal mengupdate shift')),
        },
      );
    } else {
      createShift.mutate(
        { ...formData, crosses_midnight: crossesMidnight, status },
        {
          onSuccess: () => setIsModalOpen(false),
          onError: (err) => alert(getApiErrorMessage(err, 'Gagal membuat shift')),
        },
      );
    }
  }, [formData, isStatusActive, editItem, activeShifts, createShift, updateShift]);

  const handleDelete = useCallback(() => {
    if (!deleteItem) return;
    deleteShift.mutate(deleteItem.id, {
      onSuccess: () => setDeleteItem(null),
      onError: (err) => alert(getApiErrorMessage(err, 'Gagal menghapus shift')),
    });
  }, [deleteItem, deleteShift]);

  const formatStatus = (s: ShiftStatus) => s === 'active' ? 'AKTIF' : 'NON AKTIF';

  return (
    <div className="space-y-4 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[32px] font-bold text-[#EAE1D8] whitespace-nowrap leading-none">Shift Operasional</h1>
          <div className="flex items-center gap-2 text-gray-400 text-[13px] font-medium tracking-wide">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
              <path d="M12 7v5l4 2"></path>
            </svg>
            <span>Last Update: {lastUpdate}</span>
          </div>
        </div>
        <Button onClick={handleAdd} className="w-full md:w-auto md:px-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#17130E" className="flex-shrink-0">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[18px] leading-none text-[#17130E] font-medium whitespace-nowrap">Tambah Shift</span>
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 rounded-[10px] border border-[#B5884D]/50 bg-transparent w-full gap-4">
        <div className="relative w-full sm:w-[200px]">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="w-full appearance-none px-4 py-2 pr-10 text-sm bg-[#231F1A] border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Non Aktif</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M5 8L0.669873 0.5L9.33013 0.5L5 8Z" fill="#B5884D"/></svg>
          </div>
        </div>
        <div className="relative w-full sm:w-[320px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari Nama Shift..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:border-[#B5884D]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent w-full flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-[#EAE1D8]">
            <thead className="text-[11px] uppercase bg-[#231F1A] border-b border-[#B5884D]/30">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">NAMA SHIFT</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">JAM MULAI</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">JAM SELESAI</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">STATUS</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Memuat data shift...</td></tr>
              ) : isError ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center bg-[#231F1A]">
                  <p className="text-[#FF5656] text-sm mb-2">{getApiErrorMessage(error, 'Gagal memuat data shift')}</p>
                  <button onClick={() => refetch()} className="text-[#B5884D] hover:text-[#EAE1D8] text-sm underline">Coba lagi</button>
                </td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Belum ada data shift.</td></tr>
              ) : (
                items.map((s, index) => (
                  <tr key={s.id} className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326] transition-colors border-b border-[#B5884D]/10`}>
                    <td className="px-6 py-4 text-center whitespace-nowrap font-medium text-[#B5884D]">{s.name}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="bg-black border border-[#B5884D]/30 px-3 py-1.5 rounded-md font-mono text-gray-300">{s.start_time}</span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="bg-black border border-[#B5884D]/30 px-3 py-1.5 rounded-md font-mono text-gray-300">{s.finish_time}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center justify-center mx-auto w-[97px] h-[23px] rounded-[9px] border text-[10px] font-semibold tracking-wide
                        ${s.status === 'active' ? 'border-[#79FF8D] bg-[#00FF2659] text-[#79FF8D]' : 'border-[#FF8080] bg-[#FF000059] text-[#FF8080]'}`}>
                        {formatStatus(s.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center space-x-4">
                        <button onClick={() => handleEdit(s)} className="text-[#B5884D] hover:text-white transition-colors">Edit</button>
                        <button onClick={() => setDeleteItem(s)} className="text-[#FF5656] hover:text-white transition-colors">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-transparent border-t border-[#B5884D]/30 gap-4 mt-auto">
          <span className="text-sm text-gray-400">
            Menampilkan {total > 0 ? (page - 1) * pageSize + 1 : 0}-{Math.min(page * pageSize, total)} dari {total} Shift
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
              if (totalPages <= 5) pageNum = i + 1;
              else if (page <= 3) pageNum = i + 1;
              else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = page - 2 + i;
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

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1C1814] border-2 border-[#B5884D] w-full max-w-[480px] rounded-[16px] shadow-2xl relative px-[32px] pt-[32px] pb-[32px]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-[#B5884D] hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <h2 className="text-[26px] font-bold text-[#B5884D] mb-8 tracking-wide">
              {editItem ? 'Edit Shift' : 'Tambah Shift'}
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#EAE1D8] tracking-wide">Jenis Shift</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Pagi, Siang..." className="w-full px-4 py-3 text-sm bg-[#0B0908] border border-[#B5884D]/60 rounded-[8px] text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:border-[#B5884D]" />
              </div>
              <div className="flex items-end gap-4 w-full">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-[#EAE1D8] tracking-wide">Start Time</label>
                  <input type="time" name="start_time" value={formData.start_time} onChange={handleInputChange} className="w-full px-4 py-3 text-sm bg-[#0B0908] border border-[#B5884D]/60 rounded-[8px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] appearance-none" style={{ colorScheme: 'dark' }} />
                </div>
                <div className="mb-3 font-bold text-[#B5884D] text-[16px]">To</div>
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-[#EAE1D8] tracking-wide">Finish Time</label>
                  <input type="time" name="finish_time" value={formData.finish_time} onChange={handleInputChange} className="w-full px-4 py-3 text-sm bg-[#0B0908] border border-[#B5884D]/60 rounded-[8px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] appearance-none" style={{ colorScheme: 'dark' }} />
                </div>
              </div>

              {/* Status Shift */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <label className="text-sm font-medium text-[#EAE1D8] tracking-wide">Status Shift</label>
                <div className="flex items-center gap-3">
                  <div
                    role="switch"
                    aria-checked={isStatusActive}
                    aria-label="Status shift aktif atau non aktif"
                    onClick={() => setIsStatusActive(!isStatusActive)}
                    className={`w-[52px] h-[28px] rounded-full p-1 cursor-pointer transition-colors border flex items-center ${isStatusActive ? 'border-[#B5884D] bg-[#B5884D]' : 'border-gray-500 bg-transparent'}`}
                  >
                    <div className={`bg-[#EAE1D8] w-[20px] h-[20px] rounded-full shadow-md transform transition-transform ${isStatusActive ? 'translate-x-[22px]' : 'translate-x-0'}`}></div>
                  </div>
                  <span className={`text-[12px] font-bold tracking-wide w-[80px] ${isStatusActive ? 'text-[#79FF8D]' : 'text-[#FF8080]'}`}>
                    {isStatusActive ? 'AKTIF' : 'NON AKTIF'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end items-center gap-3 mt-10">
              <button onClick={() => setIsModalOpen(false)} className="px-7 py-2.5 text-sm font-bold text-[#B5884D] border border-[#B5884D] rounded-[8px] hover:bg-[#B5884D]/10 transition-colors">Batal</button>
              <button
                onClick={handleSave}
                disabled={createShift.isPending || updateShift.isPending}
                className="px-7 py-2.5 text-sm font-bold text-[#1A1612] bg-[#B5884D] rounded-[8px] hover:bg-[#c99a5a] transition-colors shadow-[0_0_10px_rgba(181,136,77,0.3)] disabled:opacity-50"
              >
                {createShift.isPending || updateShift.isPending ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#1C1814] border-2 border-[#B5884D]/80 w-full max-w-[480px] rounded-[16px] shadow-2xl p-8 relative">
            <button onClick={() => setDeleteItem(null)} className="absolute top-6 right-6 text-[#B5884D] hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="text-[#FF5656]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <h2 className="text-[24px] font-bold text-[#B5884D]">Hapus Shift</h2>
            </div>
            <p className="text-[15px] text-[#EAE1D8] mb-8 leading-relaxed">
              Apakah Anda yakin ingin menghapus shift <span className="text-[#B5884D] font-bold">{deleteItem.name} ({deleteItem.start_time} - {deleteItem.finish_time})</span>? Aksi ini akan menghapus shift secara instan.
            </p>
            <div className="flex items-center justify-end gap-4">
              <button onClick={() => setDeleteItem(null)} className="px-8 py-2.5 text-sm font-bold text-[#B5884D] border border-[#B5884D] rounded-[8px] hover:bg-[#B5884D]/10 transition-colors">Batal</button>
              <button
                onClick={handleDelete}
                disabled={deleteShift.isPending}
                className="px-8 py-2.5 text-sm font-bold text-[#EAE1D8] bg-[#583333] border border-[#FF5656]/50 rounded-[8px] hover:bg-[#6e3e3e] transition-colors disabled:opacity-50"
              >
                {deleteShift.isPending ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
