'use client';

import Button from '@/app/components/ui/Button';
import React, { useState } from 'react';
import {
  useCreateSignageSchedule,
  useDeleteSignageSchedule,
  useSignageContents,
  useSignageSchedules,
  useSignages,
  useUpdateSignageSchedule,
} from '@/hooks/useSignages';
import { getApiErrorMessage } from '@/lib/api/errors';
import type { SignageScheduleRead } from '@/lib/api/types';

interface ScheduleForm {
  signage_id: string;
  content_id: string;
  start_time: string;
  end_time: string;
}

const emptyForm: ScheduleForm = { signage_id: '', content_id: '', start_time: '', end_time: '' };

function formatTanggalUpdate(iso: string): string {
  const date = new Date(iso);
  return date
    .toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replace(/\./g, ':');
}

function formatDatetimeLocal(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day}T${h}:${min}`;
}

export default function JadwalSignagePage() {
  const [signageFilter, setSignageFilter] = useState<string>('');
  const [contentFilter, setContentFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  const signageId = signageFilter === '' ? null : signageFilter;
  const contentId = contentFilter === '' ? null : contentFilter;
  const isActive = statusFilter === '' ? null : statusFilter === 'active';

  const { data, isLoading, isError, refetch } = useSignageSchedules({
    signage_id: signageId,
    content_id: contentId,
    is_active: isActive,
    page,
    page_size: 10,
  });

  const { data: signagesData } = useSignages({ page_size: 100 });
  const { data: contentsData } = useSignageContents({ page_size: 100 });

  const createSchedule = useCreateSignageSchedule();
  const updateSchedule = useUpdateSignageSchedule();
  const deleteSchedule = useDeleteSignageSchedule();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idYangDiedit, setIdYangDiedit] = useState<string | null>(null);
  const [formData, setFormData] = useState<ScheduleForm>(emptyForm);
  const [itemYangDihapus, setItemYangDihapus] = useState<SignageScheduleRead | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKlikTambah = () => {
    setIdYangDiedit(null);
    setFormData({ ...emptyForm });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleKlikEdit = (schedule: SignageScheduleRead) => {
    setIdYangDiedit(schedule.id);
    setFormData({
      signage_id: schedule.signage_id,
      content_id: schedule.content_id,
      start_time: formatDatetimeLocal(schedule.start_time),
      end_time: formatDatetimeLocal(schedule.end_time),
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSimpan = async () => {
    setFormError(null);
    if (!formData.signage_id) {
      setFormError('Pilih signage terlebih dahulu.');
      return;
    }
    if (!formData.content_id) {
      setFormError('Pilih konten terlebih dahulu.');
      return;
    }
    if (!formData.start_time) {
      setFormError('Waktu mulai wajib diisi.');
      return;
    }
    if (!formData.end_time) {
      setFormError('Waktu selesai wajib diisi.');
      return;
    }

    setIsSaving(true);
    try {
      if (idYangDiedit !== null) {
        await updateSchedule.mutateAsync({
          id: idYangDiedit,
          data: {
            signage_id: formData.signage_id,
            content_id: formData.content_id,
            start_time: new Date(formData.start_time).toISOString(),
            end_time: new Date(formData.end_time).toISOString(),
          },
        });
      } else {
        await createSchedule.mutateAsync({
          signage_id: formData.signage_id,
          content_id: formData.content_id,
          start_time: new Date(formData.start_time).toISOString(),
          end_time: new Date(formData.end_time).toISOString(),
          is_active: true,
        });
      }
      setIsModalOpen(false);
      setIdYangDiedit(null);
      setFormData(emptyForm);
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Gagal menyimpan jadwal. Coba lagi.'));
    } finally {
      setIsSaving(false);
    }
  };

  const eksekusiHapus = () => {
    if (itemYangDihapus !== null) {
      deleteSchedule.mutate(itemYangDihapus.id, {
        onSuccess: () => setItemYangDihapus(null),
      });
    }
  };

  const items = [...(data?.items ?? [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  const total = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;
  const startIndex = total === 0 ? 0 : (page - 1) * 10 + 1;
  const endIndex = Math.min(page * 10, total);

  return (
    <div className="space-y-4 relative">
      {/* Header Konten */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className="text-[32px] font-bold text-[#EAE1D8] whitespace-nowrap">Jadwal Signage</h1>

        <Button onClick={handleKlikTambah} className="w-full md:w-auto md:px-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#17130E" className="flex-shrink-0">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[18px] leading-none text-[#17130E] font-medium">
            Tambah Jadwal
          </span>
        </Button>
      </div>

      {/* CONTAINER 1: Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 rounded-[10px] border border-[#B5884D]/50 bg-transparent w-full gap-4">
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-[180px]">
            <select value={signageFilter} onChange={(e) => { setSignageFilter(e.target.value); setPage(1); }} className="w-full appearance-none px-4 py-2 pr-10 text-sm bg-[#231F1A] border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer">
              <option value="">Semua Signage</option>
              {(signagesData?.items ?? []).map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8L0.669873 0.5L9.33013 0.5L5 8Z" fill="#B5884D"/></svg>
            </div>
          </div>

          <div className="relative w-full sm:w-[180px]">
            <select value={contentFilter} onChange={(e) => { setContentFilter(e.target.value); setPage(1); }} className="w-full appearance-none px-4 py-2 pr-10 text-sm bg-[#231F1A] border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer">
              <option value="">Semua Konten</option>
              {(contentsData?.items ?? []).map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8L0.669873 0.5L9.33013 0.5L5 8Z" fill="#B5884D"/></svg>
            </div>
          </div>

          <div className="relative w-full sm:w-[170px]">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="w-full appearance-none px-4 py-2 pr-10 text-sm bg-[#231F1A] border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer">
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Non Aktif</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8L0.669873 0.5L9.33013 0.5L5 8Z" fill="#B5884D"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* CONTAINER 2: Tabel Dinamis */}
      <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent w-full flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-[#EAE1D8]">
            <thead className="text-[11px] uppercase bg-[#231F1A] border-b border-[#B5884D]/30">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">NO.</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">SIGNAGE</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">KONTEN</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">WAKTU MULAI</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">WAKTU SELESAI</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Memuat data jadwal...</td></tr>
              ) : isError ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center bg-[#231F1A]">
                  <span className="text-[#FF5656]">Gagal memuat data.</span>{' '}
                  <button onClick={() => refetch()} className="text-[#B5884D] hover:underline">Coba lagi</button>
                </td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Belum ada data jadwal.</td></tr>
              ) : (
                items.map((s, index) => (
                  <tr key={s.id} className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326] transition-colors border-b border-[#B5884D]/10`}>
                    <td className="px-6 py-4 font-medium text-center whitespace-nowrap">{startIndex + index}.</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-300">{s.signage.name}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-300">{s.content.title}</td>
                    <td className="px-6 py-4 text-center text-xs whitespace-nowrap text-gray-400">
                      {formatTanggalUpdate(s.start_time)}
                    </td>
                    <td className="px-6 py-4 text-center text-xs whitespace-nowrap text-gray-400">
                      {formatTanggalUpdate(s.end_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center space-x-4">
                        <button onClick={() => handleKlikEdit(s)} className="text-[#B5884D] hover:text-white transition-colors">Edit</button>
                        <button onClick={() => setItemYangDihapus(s)} className="text-[#FF5656] hover:text-white transition-colors">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-transparent border-t border-[#B5884D]/30 gap-4 mt-auto">
          <span className="text-sm text-gray-400">
            {total === 0 ? 'Tidak ada data' : `Menampilkan ${startIndex}-${endIndex} dari ${total} Jadwal`}
          </span>
          <div className="inline-flex items-center space-x-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1 text-sm text-gray-400 border border-[#B5884D]/50 rounded-[4px] hover:text-white hover:border-[#B5884D] transition-colors bg-transparent disabled:opacity-40 disabled:cursor-not-allowed">Sebelumnya</button>
            <button className="w-8 h-8 flex items-center justify-center text-sm text-[#17130E] bg-[#B5884D] rounded-[4px] font-bold">{page}</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1 text-sm text-[#EAE1D8] border border-[#B5884D]/50 rounded-[4px] hover:bg-[#B5884D]/20 transition-colors bg-transparent disabled:opacity-40 disabled:cursor-not-allowed">Berikutnya</button>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL POPUP FORM (Tambah & Edit Jadwal)   */}
      {/* ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#17130E] border border-[#B5884D] w-full max-w-md rounded-[10px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-[#B5884D]/30 bg-[#231F1A]">
              <h2 className="text-xl font-bold text-[#EAE1D8]">{idYangDiedit ? 'Edit Jadwal' : 'Tambah Jadwal'}</h2>
              <button onClick={() => { setIsModalOpen(false); setIdYangDiedit(null); setFormData(emptyForm); setFormError(null); }} className="text-gray-400 hover:text-[#FF5656] transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Pilih Signage</label>
                <div className="relative">
                  <select name="signage_id" value={formData.signage_id} onChange={handleInputChange} className="w-full appearance-none px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] cursor-pointer">
                    <option value="">-- Pilih Signage --</option>
                    {(signagesData?.items ?? []).map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#B5884D]">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8L0.669873 0.5L9.33013 0.5L5 8Z" fill="#B5884D"/></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Pilih Konten</label>
                <div className="relative">
                  <select name="content_id" value={formData.content_id} onChange={handleInputChange} className="w-full appearance-none px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] cursor-pointer">
                    <option value="">-- Pilih Konten --</option>
                    {(contentsData?.items ?? []).map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#B5884D]">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8L0.669873 0.5L9.33013 0.5L5 8Z" fill="#B5884D"/></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Waktu Mulai</label>
                <input type="datetime-local" name="start_time" value={formData.start_time} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" style={{ colorScheme: 'dark' }} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Waktu Selesai</label>
                <input type="datetime-local" name="end_time" value={formData.end_time} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" style={{ colorScheme: 'dark' }} />
              </div>

              {formError && <p className="text-sm text-[#FF5656]">{formError}</p>}
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-[#B5884D]/30 bg-[#231F1A]">
              <button onClick={() => { setIsModalOpen(false); setIdYangDiedit(null); setFormData(emptyForm); setFormError(null); }} className="px-6 py-2.5 text-sm font-medium text-[#EAE1D8] border border-gray-600 rounded-[7px] hover:bg-gray-800 transition-colors whitespace-nowrap">Batal</button>
              <Button onClick={handleSimpan} className="px-6 !h-auto py-2.5 !w-auto whitespace-nowrap" disabled={isSaving}>
                {isSaving ? 'Menyimpan...' : (idYangDiedit ? 'Simpan' : 'Tambah')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS */}
      {itemYangDihapus !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#17130E] border border-[#B5884D] w-full max-w-md rounded-[14px] shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setItemYangDihapus(null)} className="absolute top-5 right-5 text-[#B5884D] hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-[#FF5656]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <h2 className="text-[22px] font-bold text-[#B5884D]">Hapus Jadwal</h2>
            </div>
            <p className="text-sm text-[#EAE1D8] mb-8 leading-relaxed">
              Apakah Anda yakin ingin menghapus jadwal <span className="text-[#B5884D] font-bold">{itemYangDihapus.signage.name}</span> → <span className="text-[#B5884D] font-bold">{itemYangDihapus.content.title}</span>? Aksi ini akan menghapus secara instan.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setItemYangDihapus(null)} className="px-6 py-2.5 text-sm font-medium text-[#B5884D] border border-[#B5884D] rounded-[8px] hover:bg-[#B5884D]/10 transition-colors whitespace-nowrap">Batal</button>
              <button onClick={eksekusiHapus} disabled={deleteSchedule.isPending} className="px-6 py-2.5 text-sm font-medium text-white bg-[#583333] border border-[#FF5656]/50 rounded-[8px] hover:bg-[#6e3e3e] transition-colors whitespace-nowrap disabled:opacity-50">
                {deleteSchedule.isPending ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
