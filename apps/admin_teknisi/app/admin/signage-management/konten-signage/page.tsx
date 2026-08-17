'use client';

import Button from '@/app/components/ui/Button';
import React, { useEffect, useState } from 'react';
import {
  useCreateSignageContent,
  useDeleteSignageContent,
  useSignageContents,
  useUpdateSignageContent,
  useUploadSignageContent,
} from '@/hooks/useSignages';
import { getApiErrorMessage } from '@/lib/api/errors';
import type { SignageContentRead, SignageContentType } from '@/lib/api/types';

interface ContentForm {
  title: string;
  content_type: SignageContentType;
  body: string;
}

const emptyForm: ContentForm = { title: '', content_type: 'text', body: '' };

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

function contentTypeLabel(t: SignageContentType): string {
  if (t === 'text') return 'Teks';
  if (t === 'image') return 'Gambar';
  return 'Video';
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function KontenSignagePage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const contentType = (typeFilter === '' ? null : typeFilter) as SignageContentType | null;
  const isActive = statusFilter === '' ? null : statusFilter === 'active';

  const { data, isLoading, isError, refetch } = useSignageContents({
    search: debouncedSearch || null,
    content_type: contentType,
    is_active: isActive,
    page,
    page_size: 10,
  });

  const createContent = useCreateSignageContent();
  const updateContent = useUpdateSignageContent();
  const deleteContent = useDeleteSignageContent();
  const uploadContent = useUploadSignageContent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idYangDiedit, setIdYangDiedit] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContentForm>(emptyForm);
  const [itemYangDihapus, setItemYangDihapus] = useState<SignageContentRead | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setFormError('Ukuran file maksimal 50MB.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFormError(null);
    }
  };

  const handleKlikTambah = () => {
    setIdYangDiedit(null);
    setFormData({ ...emptyForm });
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleKlikEdit = (content: SignageContentRead) => {
    setIdYangDiedit(content.id);
    setFormData({
      title: content.title,
      content_type: content.content_type ?? 'text',
      body: content.body ?? '',
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSimpanContent = async () => {
    setFormError(null);

    if (!formData.title.trim()) {
      setFormError('Judul wajib diisi.');
      return;
    }

    const isMedia = formData.content_type === 'image' || formData.content_type === 'video';
    if (isMedia && !selectedFile && idYangDiedit === null) {
      setFormError('File wajib diupload untuk tipe Gambar/Video.');
      return;
    }

    setIsSaving(true);
    try {
      if (idYangDiedit !== null) {
        await updateContent.mutateAsync({
          id: idYangDiedit,
          data: {
            title: formData.title.trim(),
            content_type: formData.content_type,
            body: formData.body.trim() || null,
          },
        });
      } else if (isMedia && selectedFile) {
        await uploadContent.mutateAsync({
          file: selectedFile,
          title: formData.title.trim(),
          content_type: formData.content_type,
        });
      } else {
        await createContent.mutateAsync({
          title: formData.title.trim(),
          content_type: formData.content_type,
          body: formData.body.trim(),
          is_active: true,
        });
      }
      setIsModalOpen(false);
      setIdYangDiedit(null);
      setFormData(emptyForm);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Gagal menyimpan konten. Coba lagi.'));
    } finally {
      setIsSaving(false);
    }
  };

  const eksekusiHapus = () => {
    if (itemYangDihapus !== null) {
      deleteContent.mutate(itemYangDihapus.id, {
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

  const isMedia = formData.content_type === 'image' || formData.content_type === 'video';

  return (
    <div className="space-y-4 relative">
      {/* Header Konten */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className="text-[32px] font-bold text-[#EAE1D8] whitespace-nowrap">Konten Signage</h1>

        <Button onClick={handleKlikTambah} className="w-full md:w-auto md:px-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#17130E" className="flex-shrink-0">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[18px] leading-none text-[#17130E] font-medium">
            Tambah Konten
          </span>
        </Button>
      </div>

      {/* CONTAINER 1: Filter & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 rounded-[10px] border border-[#B5884D]/50 bg-transparent w-full gap-4">
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-[170px]">
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="w-full appearance-none px-4 py-2 pr-10 text-sm bg-[#231F1A] border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer"
            >
              <option value="">Semua Tipe</option>
              <option value="text">Teks</option>
              <option value="image">Gambar</option>
              <option value="video">Video</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8L0.669873 0.5L9.33013 0.5L5 8Z" fill="#B5884D"/></svg>
            </div>
          </div>

          <div className="relative w-full sm:w-[170px]">
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
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8L0.669873 0.5L9.33013 0.5L5 8Z" fill="#B5884D"/></svg>
            </div>
          </div>
        </div>

        <div className="relative w-full sm:w-[320px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari Judul Konten."
            className="w-full pl-10 pr-4 py-2 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:border-[#B5884D]"
          />
        </div>
      </div>

      {/* CONTAINER 2: Tabel Dinamis */}
      <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent w-full flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-[#EAE1D8]">
            <thead className="text-[11px] uppercase bg-[#231F1A] border-b border-[#B5884D]/30">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">NO.</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">JUDUL</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">TIPE KONTEN</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">UKURAN FILE</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">STATUS</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">TERAKHIR UPDATE</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Memuat data konten...</td></tr>
              ) : isError ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center bg-[#231F1A]">
                  <span className="text-[#FF5656]">Gagal memuat data.</span>{' '}
                  <button onClick={() => refetch()} className="text-[#B5884D] hover:underline">Coba lagi</button>
                </td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Belum ada data konten.</td></tr>
              ) : (
                items.map((c, index) => (
                  <tr key={c.id} className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326] transition-colors border-b border-[#B5884D]/10`}>
                    <td className="px-6 py-4 font-medium text-center whitespace-nowrap">{startIndex + index}.</td>
                    <td className="px-6 py-4 font-semibold text-[#B5884D] text-center whitespace-nowrap">{c.title}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-300">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border
                        ${c.content_type === 'text' ? 'border-[#B5884D]/50 bg-[#B5884D]/10 text-[#B5884D]' :
                          c.content_type === 'image' ? 'border-[#79FF8D]/50 bg-[#00FF2610] text-[#79FF8D]' :
                          'border-[#80BFFF]/50 bg-[#80BFFF10] text-[#80BFFF]'}`}>
                        {contentTypeLabel(c.content_type ?? 'text')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-400 text-xs">
                      {c.file_size_bytes ? formatBytes(c.file_size_bytes) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center justify-center mx-auto w-[97px] h-[23px] rounded-[9px] border text-[10px] font-semibold tracking-wide
                        ${c.is_active ? 'border-[#79FF8D] bg-[#00FF2659] text-[#79FF8D]' : 'border-[#FF8080] bg-[#FF000059] text-[#FF8080]'}`}>
                        {c.is_active ? 'AKTIF' : 'NON AKTIF'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-xs whitespace-nowrap text-gray-400">
                      {formatTanggalUpdate(c.updated_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center space-x-4">
                        <button onClick={() => handleKlikEdit(c)} className="text-[#B5884D] hover:text-white transition-colors">Edit</button>
                        <button onClick={() => setItemYangDihapus(c)} className="text-[#FF5656] hover:text-white transition-colors">Hapus</button>
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
            {total === 0 ? 'Tidak ada data' : `Menampilkan ${startIndex}-${endIndex} dari ${total} Konten`}
          </span>
          <div className="inline-flex items-center space-x-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1 text-sm text-gray-400 border border-[#B5884D]/50 rounded-[4px] hover:text-white hover:border-[#B5884D] transition-colors bg-transparent disabled:opacity-40 disabled:cursor-not-allowed">Sebelumnya</button>
            <button className="w-8 h-8 flex items-center justify-center text-sm text-[#17130E] bg-[#B5884D] rounded-[4px] font-bold">{page}</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1 text-sm text-[#EAE1D8] border border-[#B5884D]/50 rounded-[4px] hover:bg-[#B5884D]/20 transition-colors bg-transparent disabled:opacity-40 disabled:cursor-not-allowed">Berikutnya</button>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL POPUP FORM (Tambah & Edit Konten)   */}
      {/* ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#17130E] border border-[#B5884D] w-full max-w-md rounded-[10px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-[#B5884D]/30 bg-[#231F1A]">
              <h2 className="text-xl font-bold text-[#EAE1D8]">{idYangDiedit ? 'Edit Konten' : 'Tambah Konten'}</h2>
              <button onClick={() => { setIsModalOpen(false); setIdYangDiedit(null); setFormData(emptyForm); setSelectedFile(null); setPreviewUrl(null); setFormError(null); }} className="text-gray-400 hover:text-[#FF5656] transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Judul</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul konten" className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Tipe Konten</label>
                <div className="relative">
                  <select name="content_type" value={formData.content_type} onChange={handleInputChange} disabled={idYangDiedit !== null} className="w-full appearance-none px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] cursor-pointer disabled:cursor-not-allowed disabled:bg-[#1A1612] disabled:border-[#B5884D]/30 disabled:text-gray-500">
                    <option value="text">Teks</option>
                    <option value="image">Gambar</option>
                    <option value="video">Video</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#B5884D]">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8L0.669873 0.5L9.33013 0.5L5 8Z" fill="#B5884D"/></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Body / Deskripsi</label>
                <textarea name="body" value={formData.body} onChange={handleInputChange} rows={3} className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] resize-none" placeholder={isMedia ? 'Deskripsi singkat (opsional)' : 'Masukkan konten teks'}></textarea>
              </div>

              {isMedia && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">
                    Upload File {idYangDiedit && <span className="text-gray-500 font-normal">(Kosongkan jika tidak diubah)</span>}
                  </label>
                  <label htmlFor="upload-content-file" className="block w-full h-[120px] bg-black border border-[#B5884D]/50 rounded-[7px] flex flex-col items-center justify-center cursor-pointer hover:bg-black/40 transition-colors">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain p-2" />
                    ) : selectedFile ? (
                      <span className="text-sm text-[#EAE1D8]">{selectedFile.name}</span>
                    ) : (
                      <div className="text-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <p className="text-[11px] text-gray-400">Klik untuk upload {formData.content_type === 'video' ? 'video' : 'gambar'}</p>
                        <p className="text-[10px] text-gray-500">Maks. 50MB</p>
                      </div>
                    )}
                    <input type="file" id="upload-content-file" accept={formData.content_type === 'video' ? 'video/*' : 'image/*'} className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              )}

              {formError && <p className="text-sm text-[#FF5656]">{formError}</p>}
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-[#B5884D]/30 bg-[#231F1A]">
              <button onClick={() => { setIsModalOpen(false); setIdYangDiedit(null); setFormData(emptyForm); setSelectedFile(null); setPreviewUrl(null); setFormError(null); }} className="px-6 py-2.5 text-sm font-medium text-[#EAE1D8] border border-gray-600 rounded-[7px] hover:bg-gray-800 transition-colors whitespace-nowrap">Batal</button>
              <Button onClick={handleSimpanContent} className="px-6 !h-auto py-2.5 !w-auto whitespace-nowrap" disabled={isSaving}>
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
              <h2 className="text-[22px] font-bold text-[#B5884D]">Hapus Konten</h2>
            </div>
            <p className="text-sm text-[#EAE1D8] mb-8 leading-relaxed">
              Apakah Anda yakin ingin menghapus konten <span className="text-[#B5884D] font-bold">{itemYangDihapus.title}</span>? Aksi ini akan menghapus secara instan.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setItemYangDihapus(null)} className="px-6 py-2.5 text-sm font-medium text-[#B5884D] border border-[#B5884D] rounded-[8px] hover:bg-[#B5884D]/10 transition-colors whitespace-nowrap">Batal</button>
              <button onClick={eksekusiHapus} disabled={deleteContent.isPending} className="px-6 py-2.5 text-sm font-medium text-white bg-[#583333] border border-[#FF5656]/50 rounded-[8px] hover:bg-[#6e3e3e] transition-colors whitespace-nowrap disabled:opacity-50">
                {deleteContent.isPending ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
