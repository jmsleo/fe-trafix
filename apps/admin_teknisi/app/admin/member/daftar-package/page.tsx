'use client';

import Button from '@/app/components/ui/Button';
import React, { useEffect, useState } from 'react';
import {
  useCreateSubscriptionPlan,
  useDeleteSubscriptionPlan,
  useSubscriptionPlans,
  useUpdateSubscriptionPlan,
} from '@/hooks/useMembers';
import { getApiErrorMessage } from '@/lib/api/errors';
import type { SubscriptionPlanRead } from '@/lib/api/types';

interface PackageForm {
  nama: string;
  durasiHari: string;
  harga: string;
}

const emptyForm: PackageForm = { nama: '', durasiHari: '', harga: '' };

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

export default function DaftarPackagePage() {
  // 1. STATE TABEL + FILTER
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const isActive = statusFilter === '' ? null : statusFilter === 'active';

  const { data, isLoading, isError, refetch } = useSubscriptionPlans({
    search: debouncedSearch || null,
    is_active: isActive,
    page,
    page_size: 10,
  });

  // 2. MUTATIONS
  const createPackage = useCreateSubscriptionPlan();
  const updatePackage = useUpdateSubscriptionPlan();
  const deletePackage = useDeleteSubscriptionPlan();

  // 3. STATE MODAL FORM
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idYangDiedit, setIdYangDiedit] = useState<string | null>(null);
  const [formData, setFormData] = useState<PackageForm>(emptyForm);
  const [isStatusActive, setIsStatusActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // 4. STATE MODAL HAPUS
  const [itemYangDihapus, setItemYangDihapus] = useState<SubscriptionPlanRead | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKlikTambah = () => {
    setIdYangDiedit(null);
    setFormData(emptyForm);
    setIsStatusActive(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleKlikEdit = (pkg: SubscriptionPlanRead) => {
    setIdYangDiedit(pkg.id);
    setFormData({
      nama: pkg.name,
      durasiHari: pkg.duration_in_days.toString(),
      harga: pkg.price.toString(),
    });
    setIsStatusActive(pkg.is_active ?? true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSimpanPackage = () => {
    setFormError(null);

    if (!formData.nama.trim()) {
      setFormError('Nama package wajib diisi.');
      return;
    }
    if (!formData.durasiHari) {
      setFormError('Durasi wajib diisi.');
      return;
    }
    if (!formData.harga) {
      setFormError('Harga wajib diisi.');
      return;
    }

    const payload = {
      name: formData.nama.trim(),
      duration_in_days: Number(formData.durasiHari),
      price: Number(formData.harga),
      is_active: isStatusActive,
    };

    const onSettled = () => {
      setIsModalOpen(false);
      setIdYangDiedit(null);
      setFormData(emptyForm);
      setFormError(null);
    };

    if (idYangDiedit !== null) {
      updatePackage.mutate(
        { id: idYangDiedit, data: payload },
        {
          onSuccess: onSettled,
          onError: (error) => setFormError(getApiErrorMessage(error, 'Gagal menyimpan perubahan. Coba lagi.')),
        },
      );
    } else {
      createPackage.mutate(payload, {
        onSuccess: onSettled,
        onError: (error) => setFormError(getApiErrorMessage(error, 'Gagal menyimpan package. Coba lagi.')),
      });
    }
  };

  const eksekusiHapus = () => {
    if (itemYangDihapus !== null) {
      deletePackage.mutate(itemYangDihapus.id, {
        onSuccess: () => setItemYangDihapus(null),
      });
    }
  };

  const items = [...(data?.items ?? [])].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
  const total = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;
  const startIndex = total === 0 ? 0 : (page - 1) * 10 + 1;
  const endIndex = Math.min(page * 10, total);

  return (
    <div className="space-y-4 relative">

      {/* Header Konten */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className="text-[32px] font-bold text-[#EAE1D8] whitespace-nowrap">Daftar Package</h1>

        <Button onClick={handleKlikTambah} className="w-full md:w-auto md:px-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#17130E" className="flex-shrink-0">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[18px] leading-none text-[#17130E] font-medium whitespace-nowrap">
            Tambah Package
          </span>
        </Button>
      </div>

      {/* CONTAINER 1: Filter & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 rounded-[10px] border border-[#B5884D]/50 bg-transparent w-full gap-4">
        <div className="relative w-full sm:w-[200px]">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
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

        <div className="relative w-full sm:w-[320px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari Nama Paket..."
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
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">NAMA PACKAGE</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">DURASI (HARI)</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">HARGA (Rp)</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">STATUS</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Memuat data package...</td></tr>
              ) : isError ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center bg-[#231F1A]">
                  <span className="text-[#FF5656]">Gagal memuat data.</span>{' '}
                  <button onClick={() => refetch()} className="text-[#B5884D] hover:underline">Coba lagi</button>
                </td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Belum ada data package.</td></tr>
              ) : (
                items.map((p, index) => (
                  <tr key={p.id} className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326] transition-colors border-b border-[#B5884D]/10`}>
                    <td className="px-6 py-4 font-medium text-center">{startIndex + index}.</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{p.name}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{p.duration_in_days} Hari</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap font-medium">{formatRupiah(p.price)}</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center justify-center mx-auto w-[97px] h-[23px] rounded-[9px] border text-[10px] font-semibold tracking-wide
                        ${p.is_active ? 'border-[#79FF8D] bg-[#00FF2659] text-[#79FF8D]' : 'border-[#FF8080] bg-[#FF000059] text-[#FF8080]'}`}>
                        {p.is_active ? 'AKTIF' : 'NON AKTIF'}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center space-x-4">
                        <button onClick={() => handleKlikEdit(p)} className="text-[#B5884D] hover:text-white transition-colors">Edit</button>
                        <button onClick={() => setItemYangDihapus(p)} className="text-[#FF5656] hover:text-white transition-colors">Hapus</button>
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
            {total === 0 ? 'Tidak ada data' : `Menampilkan ${startIndex}-${endIndex} dari ${total} Package`}
          </span>
          <div className="inline-flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 text-sm text-gray-400 border border-[#B5884D]/50 rounded-[4px] hover:text-white hover:border-[#B5884D] transition-colors bg-transparent disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-sm text-[#17130E] bg-[#B5884D] rounded-[4px] font-bold">
              {page}
            </button>
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

      {/* ========================================= */}
      {/* MODAL POPUP FORM (Tambah & Edit Package)  */}
      {/* ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">

          {/* --- OUTER CARD (469 x 560) --- */}
          <div className="bg-[#181410] border-2 border-[#B5884D]/80 w-[469px] h-[560px] rounded-[16px] shadow-2xl flex flex-col relative px-[27px] py-[30px] animate-in fade-in zoom-in duration-200">

            {/* Header Modal & Tombol Close */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[24px] font-bold text-[#B5884D]">{idYangDiedit ? 'Edit Package' : 'Tambah Package'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#B5884D] hover:text-white transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* --- INNER CARD --- */}
            <div className="w-[414px] h-[380px] border border-[#B5884D]/50 rounded-[12px] p-5 flex flex-col gap-4 overflow-y-auto mx-auto bg-transparent">
              <h3 className="text-[18px] font-bold text-[#B5884D] mb-1">Informasi Package</h3>

              {/* Nama Package */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#EAE1D8]">Nama Package</label>
                <input type="text" name="nama" value={formData.nama} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" />
                <p className="text-[10px] text-gray-500 pl-1 mt-0.5">Contoh: Member Mobil 30 Hari</p>
              </div>

              {/* Durasi */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#EAE1D8]">Durasi</label>
                <div className="relative flex items-center">
                  <input type="number" name="durasiHari" value={formData.durasiHari} onChange={handleInputChange} className="w-full pl-4 pr-12 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" />
                  <span className="absolute right-4 text-sm text-[#B5884D]">Hari</span>
                </div>
              </div>

              {/* Harga */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#EAE1D8]">Harga</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-sm text-[#B5884D]">Rp</span>
                  <input type="number" name="harga" value={formData.harga} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" />
                </div>
              </div>

              {/* Status Toggle */}
              <div className="space-y-2 pt-1">
                <label className="text-sm font-medium text-[#EAE1D8]">Status</label>
                <div
                  className={`w-[44px] h-[24px] flex items-center rounded-full p-1 cursor-pointer transition-colors border ${isStatusActive ? 'border-[#B5884D] bg-[#B5884D]' : 'border-gray-500 bg-transparent'}`}
                  onClick={() => setIsStatusActive(!isStatusActive)}
                >
                  <div className={`bg-[#EAE1D8] w-[16px] h-[16px] rounded-full shadow-md transform transition-transform ${isStatusActive ? 'translate-x-[20px]' : 'translate-x-0'}`}></div>
                </div>
              </div>

              {formError && <p className="text-sm text-[#FF5656]">{formError}</p>}
            </div>

            {/* Tombol Aksi di Luar Inner Card */}
            <div className="flex justify-between items-center gap-4 mt-auto pt-6">
              <button onClick={() => setIsModalOpen(false)} disabled={createPackage.isPending || updatePackage.isPending} className="w-1/2 py-3 text-sm font-bold text-[#B5884D] border border-[#B5884D] rounded-[8px] hover:bg-[#B5884D]/10 transition-colors disabled:opacity-50">
                Batal
              </button>
              <button onClick={handleSimpanPackage} disabled={createPackage.isPending || updatePackage.isPending} className="w-1/2 py-3 text-sm font-bold text-[#1A1612] bg-[#B5884D] rounded-[8px] hover:bg-[#c99a5a] transition-colors shadow-[0_0_10px_rgba(181,136,77,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
                {(createPackage.isPending || updatePackage.isPending) ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL KONFIRMASI HAPUS                    */}
      {/* ========================================= */}
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
              <h2 className="text-[22px] font-bold text-[#B5884D]">Hapus Package</h2>
            </div>
            <p className="text-sm text-[#EAE1D8] mb-8 leading-relaxed">
              Apakah Anda yakin ingin menghapus Package <span className="text-[#B5884D] font-bold">{itemYangDihapus.name}</span>? Aksi ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setItemYangDihapus(null)} className="px-6 py-2.5 text-sm font-medium text-[#B5884D] border border-[#B5884D] rounded-[8px] hover:bg-[#B5884D]/10 transition-colors whitespace-nowrap">Batal</button>
              <button onClick={eksekusiHapus} disabled={deletePackage.isPending} className="px-6 py-2.5 text-sm font-medium text-white bg-[#583333] border border-[#FF5656]/50 rounded-[8px] hover:bg-[#6e3e3e] transition-colors whitespace-nowrap disabled:opacity-50">
                {deletePackage.isPending ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
