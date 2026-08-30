'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useOperatorShiftAssignments, useAllOperatorShiftAssignments, useCreateOperatorShiftAssignment, useUpdateOperatorShiftAssignment, useDeleteOperatorShiftAssignment, useShifts } from '@/hooks/useShifts';
import { useUsers } from '@/hooks/useUsers';
import type { OperatorShiftAssignmentRead, OperatorShiftAssignmentStatus } from '@/lib/api/types';
import { getApiErrorMessage } from '@/lib/api/errors';

function formatDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const mon = months[d.getMonth()];
  const yy = d.getFullYear();
  return `${dd} ${mon} ${yy}`;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const mon = months[d.getMonth()];
  const yy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${dd} ${mon} ${yy} ${hh}:${mm}`;
}

export default function OperatorAssignmentPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, error, refetch } = useOperatorShiftAssignments({ page, page_size: pageSize });
  const { data: allAssignmentsData } = useAllOperatorShiftAssignments();
  const { data: shiftsData } = useShifts({ page_size: 100 });
  const { data: usersData } = useUsers({ page_size: 100, role: 'operator' });

  const createAssignment = useCreateOperatorShiftAssignment();
  const updateAssignment = useUpdateOperatorShiftAssignment();
  const deleteAssignment = useDeleteOperatorShiftAssignment();

  const items = useMemo(() => data?.items ?? [], [data]);
  const total = useMemo(() => data?.total ?? 0, [data]);
  const totalPages = useMemo(() => data?.total_pages ?? 1, [data]);
  const allAssignments = useMemo(() => allAssignmentsData ?? [], [allAssignmentsData]);

  const activeShifts = useMemo(
    () => (shiftsData?.items ?? []).filter((s) => s.status === 'active'),
    [shiftsData],
  );
  const operators = useMemo(() => usersData?.items ?? [], [usersData]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<OperatorShiftAssignmentRead | null>(null);
  const [isStatusActive, setIsStatusActive] = useState(true);
  const [selectedOperator, setSelectedOperator] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [deleteItem, setDeleteItem] = useState<OperatorShiftAssignmentRead | null>(null);

  const openCreate = useCallback(() => {
    setEditItem(null);
    setIsStatusActive(true);
    setSelectedOperator('');
    setSelectedShift('');
    setIsModalOpen(true);
  }, []);

  const openEdit = useCallback((item: OperatorShiftAssignmentRead) => {
    setEditItem(item);
    setIsStatusActive(item.status === 'active');
    setSelectedOperator(item.operator_id);
    setSelectedShift(item.shift_id);
    setIsModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!selectedOperator || !selectedShift) {
      alert('Operator dan Shift wajib dipilih!');
      return;
    }

    const status: OperatorShiftAssignmentStatus = isStatusActive ? 'active' : 'inactive';

    if (editItem) {
      updateAssignment.mutate(
        {
          id: editItem.id,
          data: { operator_id: selectedOperator, shift_id: selectedShift, status },
        },
        {
          onSuccess: () => setIsModalOpen(false),
          onError: (err) => alert(getApiErrorMessage(err, 'Gagal mengupdate assignment')),
        },
      );
    } else {
      createAssignment.mutate(
        { operator_id: selectedOperator, shift_id: selectedShift },
        {
          onSuccess: () => setIsModalOpen(false),
          onError: (err) => alert(getApiErrorMessage(err, 'Gagal membuat assignment')),
        },
      );
    }
  }, [selectedOperator, selectedShift, isStatusActive, editItem, createAssignment, updateAssignment]);

  const handleDelete = useCallback(() => {
    if (!deleteItem) return;
    deleteAssignment.mutate(deleteItem.id, {
      onSuccess: () => setDeleteItem(null),
      onError: (err) => alert(getApiErrorMessage(err, 'Gagal menghapus assignment')),
    });
  }, [deleteItem, deleteAssignment]);

  const occupiedShiftIds = useMemo(
    () =>
      new Set(
        allAssignments
          .filter((a) => a.id !== (editItem?.id ?? null))
          .map((a) => a.shift_id),
      ),
    [allAssignments, editItem],
  );

  const selectableShifts = useMemo(
    () => activeShifts.filter((s) => !occupiedShiftIds.has(s.id)),
    [activeShifts, occupiedShiftIds],
  );

  return (
    <div className="space-y-4 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <h1 className="text-[32px] font-bold text-[#EAE1D8] whitespace-nowrap leading-none">Operator Shift Assignment</h1>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-[6px] h-[44px] px-6 rounded-[9px] font-medium transition-opacity shrink-0 bg-gradient-to-r from-[#BF8F51] to-[#523D22] border border-[#BF8F51] text-[#17130E] shadow-lg hover:opacity-90 w-full md:w-auto md:px-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#17130E" className="flex-shrink-0">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[18px] leading-none font-medium whitespace-nowrap">Tambah Assignment</span>
        </button>
      </div>

      {/* Table */}
      <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent w-full flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-[#EAE1D8]">
            <thead className="text-[11px] uppercase bg-[#231F1A] border-b border-[#B5884D]/30">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">NO.</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">OPERATOR</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">SHIFT</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">JAM</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">STATUS</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">TANGGAL DIBUAT</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">LAST UPDATE</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Memuat data assignment...</td></tr>
              ) : isError ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center bg-[#231F1A]">
                  <p className="text-[#FF5656] text-sm mb-2">{getApiErrorMessage(error, 'Gagal memuat data assignment')}</p>
                  <button onClick={() => refetch()} className="text-[#B5884D] hover:text-[#EAE1D8] text-sm underline">Coba lagi</button>
                </td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Belum ada data assignment.</td></tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326] transition-colors border-b border-[#B5884D]/10`}>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-400">{(page - 1) * pageSize + index + 1}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap font-medium text-[#EAE1D8]">{item.operator.name}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-300">{item.shift.name}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="bg-black border border-[#B5884D]/30 px-3 py-1.5 rounded-md font-mono text-gray-300 text-[12px]">
                        {item.shift.start_time} - {item.shift.finish_time}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center justify-center mx-auto w-[85px] h-[23px] rounded-[9px] border text-[10px] font-semibold tracking-wide
                        ${item.status === 'active' ? 'border-[#79FF8D] bg-[#00FF2659] text-[#79FF8D]' : 'border-[#FF8080] bg-[#FF000059] text-[#FF8080]'}`}>
                        {item.status === 'active' ? 'AKTIF' : 'NON AKTIF'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-400">{formatDate(item.created_at)}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-400">{formatDateTime(item.updated_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center space-x-4">
                        <button onClick={() => openEdit(item)} className="text-[#B5884D] hover:text-white transition-colors font-medium">Edit</button>
                        <button
                          onClick={() => setDeleteItem(item)}
                          className="text-[#FF5656] hover:text-white transition-colors font-medium"
                        >
                          Hapus
                        </button>
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
            Menampilkan {total > 0 ? (page - 1) * pageSize + 1 : 0}-{Math.min(page * pageSize, total)} dari {total} Assignment
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

      {/* Modal Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1C1814] border-2 border-[#B5884D] w-full max-w-[480px] rounded-[16px] shadow-2xl relative px-[32px] pt-[32px] pb-[32px]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-[#B5884D] hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <h2 className="text-[26px] font-bold text-[#B5884D] mb-8 tracking-wide">
              {editItem ? 'Edit Assignment' : 'Tambah Assignment'}
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#EAE1D8] tracking-wide">Operator</label>
                <select
                  value={selectedOperator}
                  onChange={(e) => { setSelectedOperator(e.target.value); setSelectedShift(''); }}
                  className="w-full px-4 py-3 text-sm bg-[#0B0908] border border-[#B5884D]/60 rounded-[8px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] appearance-none"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="">Pilih Operator</option>
                  {operators.map((op) => (
                    <option key={op.id} value={op.id}>{op.name} ({op.username})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#EAE1D8] tracking-wide">Shift</label>
                <select
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-[#0B0908] border border-[#B5884D]/60 rounded-[8px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] appearance-none"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="">Pilih Shift</option>
                  {selectableShifts.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.start_time} - {s.finish_time})</option>
                  ))}
                </select>
              </div>

              {editItem && (
                <div className="flex items-center justify-between gap-4 pt-2">
                  <label className="text-sm font-medium text-[#EAE1D8] tracking-wide">Status Assignment</label>
                  <div className="flex items-center gap-3">
                    <div
                      role="switch"
                      aria-checked={isStatusActive}
                      aria-label="Status assignment aktif atau non aktif"
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
              )}
            </div>
            <div className="flex justify-end items-center gap-3 mt-10">
              <button onClick={() => setIsModalOpen(false)} className="px-7 py-2.5 text-sm font-bold text-[#B5884D] border border-[#B5884D] rounded-[8px] hover:bg-[#B5884D]/10 transition-colors">Batal</button>
              <button
                onClick={handleSave}
                disabled={createAssignment.isPending || updateAssignment.isPending}
                className="px-7 py-2.5 text-sm font-bold text-[#1A1612] bg-[#B5884D] rounded-[8px] hover:bg-[#c99a5a] transition-colors shadow-[0_0_10px_rgba(181,136,77,0.3)] disabled:opacity-50"
              >
                {createAssignment.isPending || updateAssignment.isPending ? 'Menyimpan...' : 'Simpan'}
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
              <h2 className="text-[24px] font-bold text-[#B5884D]">Hapus Assignment</h2>
            </div>
            <p className="text-[15px] text-[#EAE1D8] mb-8 leading-relaxed">
              Apakah Anda yakin ingin menghapus assignment <span className="text-[#B5884D] font-bold">{deleteItem.operator.name} → {deleteItem.shift.name}</span>?
            </p>
            <div className="flex items-center justify-end gap-4">
              <button onClick={() => setDeleteItem(null)} className="px-8 py-2.5 text-sm font-bold text-[#B5884D] border border-[#B5884D] rounded-[8px] hover:bg-[#B5884D]/10 transition-colors">Batal</button>
              <button
                onClick={handleDelete}
                disabled={deleteAssignment.isPending}
                className="px-8 py-2.5 text-sm font-bold text-[#EAE1D8] bg-[#583333] border border-[#FF5656]/50 rounded-[8px] hover:bg-[#6e3e3e] transition-colors disabled:opacity-50"
              >
                {deleteAssignment.isPending ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
