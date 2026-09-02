'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Button from '../../components/ui/Button';
import {
  useAllParkingRates,
  useCreateParkingRate,
  useDeleteParkingRate,
  useParkingRates,
  useUpdateParkingRate,
} from '@/hooks/useParkingRates';
import { useVehicleTypes } from '@/hooks/useVehicleTypes';
import { getApiErrorMessage } from '@/lib/api/errors';
import type { ActiveStatus, FeeCategory, ParkingRateRead } from '@/lib/api/types';

interface TarifForm {
  name: string;
  vehicle_type_id: string;
  base_price: string;
  fee_category: FeeCategory;
  grace_period_minutes: string;
  ticket_charge: string;
  stay_charge: string;
  status: ActiveStatus;
}

const emptyForm: TarifForm = {
  name: '',
  vehicle_type_id: '',
  base_price: '',
  fee_category: 'flat',
  grace_period_minutes: '',
  ticket_charge: '',
  stay_charge: '',
  status: 'active',
};

const toNumberOrNull = (value: string): number | null => (value === '' ? null : Number(value));

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

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

export default function TarifParkirPage() {
  const { data: vehicleTypesData } = useVehicleTypes({ page_size: 100 });

  const vehicleTypeNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const vt of vehicleTypesData?.items ?? []) {
      map.set(vt.id, vt.name);
    }
    return map;
  }, [vehicleTypesData]);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const status = (statusFilter === '' ? null : statusFilter) as ActiveStatus | null;

  const { data, isLoading, isError, refetch } = useParkingRates({
    search: debouncedSearch || null,
    status,
    page,
    page_size: 10,
  });

  const { data: allRatesData } = useAllParkingRates();

  const createTarif = useCreateParkingRate();
  const updateTarif = useUpdateParkingRate();
  const deleteTarif = useDeleteParkingRate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idYangDiedit, setIdYangDiedit] = useState<string | null>(null);
  const [formData, setFormData] = useState<TarifForm>(emptyForm);
  const [itemYangDihapus, setItemYangDihapus] = useState<ParkingRateRead | null>(null);
  const [hapusError, setHapusError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'fee_category' && value === 'flat') {
        next.stay_charge = '';
        next.ticket_charge = '';
      }
      return next;
    });
  };

  const handleKlikTambah = () => {
    setIdYangDiedit(null);
    setFormData({ ...emptyForm, status: 'active' });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleKlikEdit = (tarif: ParkingRateRead) => {
    setIdYangDiedit(tarif.id);
    setFormData({
      name: tarif.name,
      vehicle_type_id: tarif.vehicle_type_id,
      base_price: tarif.base_price.toString(),
      fee_category: tarif.fee_category ?? 'flat',
      grace_period_minutes: tarif.grace_period_minutes?.toString() ?? '',
      ticket_charge: tarif.ticket_charge?.toString() ?? '',
      stay_charge: tarif.stay_charge?.toString() ?? '',
      status: tarif.status ?? 'active',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSimpanTarif = () => {
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Nama tarif wajib diisi.');
      return;
    }
    const normalizedName = formData.name.trim().toLowerCase();
    const nameTaken = (allRatesData?.items ?? []).some(
      (rate) =>
        rate.id !== idYangDiedit && rate.name.trim().toLowerCase() === normalizedName,
    );
    if (nameTaken) {
      setFormError('Nama tarif sudah digunakan. Silakan gunakan nama lain.');
      return;
    }
    if (!formData.vehicle_type_id) {
      setFormError('Jenis kendaraan wajib dipilih.');
      return;
    }
    if (!formData.base_price) {
      setFormError('Tarif dasar wajib diisi.');
      return;
    }

    if (formData.fee_category !== 'flat') {
      const ticketCharge = toNumberOrNull(formData.ticket_charge);
      const stayCharge = toNumberOrNull(formData.stay_charge);
      
      if (ticketCharge !== null && stayCharge !== null && ticketCharge < stayCharge) {
        setFormError('Biaya maksimal harus tidak kurang dari tarif per jam.');
        return;
      }
    }

    const payload = {
      name: formData.name.trim(),
      vehicle_type_id: formData.vehicle_type_id,
      base_price: Number(formData.base_price),
      fee_category: formData.fee_category,
      grace_period_minutes: toNumberOrNull(formData.grace_period_minutes),
      ticket_charge: toNumberOrNull(formData.ticket_charge),
      stay_charge: toNumberOrNull(formData.stay_charge),
      status: formData.status,
    };

    const onSettled = () => {
      setIsModalOpen(false);
      setIdYangDiedit(null);
      setFormData(emptyForm);
    };

    if (idYangDiedit !== null) {
      updateTarif.mutate(
        { id: idYangDiedit, data: payload },
        {
          onSuccess: onSettled,
          onError: (error) => setFormError(getApiErrorMessage(error, 'Gagal menyimpan perubahan. Coba lagi.')),
        },
      );
    } else {
      createTarif.mutate(payload, {
        onSuccess: onSettled,
        onError: (error) => setFormError(getApiErrorMessage(error, 'Gagal menyimpan tarif. Coba lagi.')),
      });
    }
  };

  const eksekusiHapus = () => {
    if (itemYangDihapus !== null) {
      deleteTarif.mutate(itemYangDihapus.id, {
        onSuccess: () => {
          setItemYangDihapus(null);
          setHapusError(null);
        },
        onError: (err) => setHapusError(getApiErrorMessage(err, 'Gagal menghapus tarif.')),
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
        <h1 className="text-3xl font-bold text-[#EAE1D8]">Manajemen Tarif</h1>

        <Button onClick={handleKlikTambah} className="w-full md:w-[190px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#17130E" className="flex-shrink-0">
            <path d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z" />
          </svg>
          <span className="text-[18px] leading-none text-[#17130E]">
            Tambah Tarif
          </span>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center p-4 rounded-[10px] border border-[#B5884D]/50 bg-transparent w-full gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-auto">
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
        </div>
        <div className="relative w-full lg:w-[280px]">
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
            placeholder="Cari Nama Tarif..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:border-[#B5884D]"
          />
        </div>
      </div>

      <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-[#EAE1D8]">
            <thead className="text-[11px] uppercase bg-[#231F1A] border-b border-[#B5884D]/30">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider text-center">NO.</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">NAMA TARIF</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">JENIS KENDARAAN</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">SKEMA</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">TARIF DASAR</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">PER JAM</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">BIAYA MAKSIMAL</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">STATUS</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">TANGGAL UPDATE</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={10} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Memuat data tarif...</td></tr>
              ) : isError ? (
                <tr><td colSpan={10} className="px-6 py-8 text-center bg-[#231F1A]">
                  <span className="text-[#FF5656]">Gagal memuat data.</span>{' '}
                  <button onClick={() => refetch()} className="text-[#B5884D] hover:underline">Coba lagi</button>
                </td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={10} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Belum ada data tarif.</td></tr>
              ) : (
                items.map((tarif, index) => (
                  <tr key={tarif.id} className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326] transition-colors`}>
                    <td className="px-6 py-4 font-medium text-center">{startIndex + index}.</td>
                    <td className="px-6 py-4 text-center">{tarif.name}</td>
                    <td className="px-6 py-4 text-center">{vehicleTypeNames.get(tarif.vehicle_type_id) ?? '-'}</td>
                    <td className="px-6 py-4 text-center">{tarif.fee_category === 'progresif' ? 'Progresif' : 'Flat'}</td>
                    <td className="px-6 py-4 text-center">{formatRupiah(tarif.base_price)}</td>
                    <td className="px-6 py-4 text-center">{tarif.stay_charge != null ? formatRupiah(tarif.stay_charge) : '-'}</td>
                    <td className="px-6 py-4 text-center">{tarif.ticket_charge != null ? formatRupiah(tarif.ticket_charge) : '-'}</td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center justify-center mx-auto w-[97px] h-[23px] rounded-[9px] border text-[10px] font-semibold tracking-wide
                        ${tarif.status === 'active' ? 'border-[#79FF8D] bg-[#00FF2659] text-[#79FF8D]' : 'border-[#FF8080] bg-[#FF000059] text-[#FF8080]'}`}>
                        {tarif.status === 'active' ? 'AKTIF' : 'NON AKTIF'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-xs">{formatTanggalUpdate(tarif.updated_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-4">
                        <button onClick={() => handleKlikEdit(tarif)} className="text-[#B5884D] hover:text-white transition-colors">Edit</button>
                        <button onClick={() => { setItemYangDihapus(tarif); setHapusError(null); }} className="text-[#FF5656] hover:text-white transition-colors">Hapus</button>
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
            {total === 0 ? 'Tidak ada data' : `Menampilkan ${startIndex}-${endIndex} dari ${total} Tarif`}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#17130E] border border-[#B5884D] w-full max-w-lg rounded-[10px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-[#B5884D]/30 bg-[#231F1A]">
              <h2 className="text-xl font-bold text-[#EAE1D8]">{idYangDiedit ? 'Edit Tarif' : 'Tambah Tarif Baru'}</h2>
              <button onClick={() => { setIsModalOpen(false); setIdYangDiedit(null); setFormData(emptyForm); setFormError(null); }} className="text-gray-400 hover:text-[#FF5656] transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Nama Tarif</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Contoh: Tarif Reguler" className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Jenis Kendaraan</label>
                  <select name="vehicle_type_id" value={formData.vehicle_type_id} onChange={handleInputChange} className="w-full appearance-none px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]">
                    <option value="">Pilih Kendaraan</option>
                    {(vehicleTypesData?.items ?? []).map((vt) => (
                      <option key={vt.id} value={vt.id}>{vt.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Skema</label>
                  <select name="fee_category" value={formData.fee_category} onChange={handleInputChange} className="w-full appearance-none px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]">
                    <option value="flat">Flat</option>
                    <option value="progresif">Progresif</option>
                  </select>
                </div>
              </div>
              {formData.fee_category === 'flat' ? (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Tarif Dasar (Rp)</label>
                  <input type="number" name="base_price" value={formData.base_price} onChange={handleInputChange} placeholder="Contoh: 10000" className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Tarif Dasar (Rp)</label>
                    <input type="number" name="base_price" value={formData.base_price} onChange={handleInputChange} placeholder="Contoh: 10000" className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Tarif Per Jam (Rp)</label>
                    <input type="number" name="stay_charge" value={formData.stay_charge} onChange={handleInputChange} placeholder="Contoh: 5000" className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" />
                  </div>
                </div>
              )}
              {formData.fee_category !== 'flat' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Biaya Maksimal (Rp)</label>
                    <input type="number" name="ticket_charge" value={formData.ticket_charge} onChange={handleInputChange} placeholder="Contoh: 2000" className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Grace Period (menit)</label>
                    <input type="number" name="grace_period_minutes" value={formData.grace_period_minutes} onChange={handleInputChange} placeholder="Contoh: 15" className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" />
                  </div>
                </div>
              )}
              {formData.fee_category === 'flat' && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Grace Period (menit)</label>
                  <input type="number" name="grace_period_minutes" value={formData.grace_period_minutes} onChange={handleInputChange} placeholder="Contoh: 15" className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full appearance-none px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]">
                  <option value="active">Aktif</option>
                  <option value="inactive">Non Aktif</option>
                </select>
              </div>

              {formError && <p className="text-sm text-[#FF5656]">{formError}</p>}
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-[#B5884D]/30 bg-[#231F1A]">
              <button onClick={() => { setIsModalOpen(false); setIdYangDiedit(null); setFormData(emptyForm); setFormError(null); }} className="px-6 py-2.5 text-sm font-medium text-[#EAE1D8] border border-gray-600 rounded-[7px] hover:bg-gray-800 transition-colors">Batal</button>
              <Button onClick={handleSimpanTarif} className="px-6 !h-auto py-2.5 !w-auto" disabled={createTarif.isPending || updateTarif.isPending}>
                {(createTarif.isPending || updateTarif.isPending) ? 'Menyimpan...' : (idYangDiedit ? 'Simpan Perubahan' : 'Simpan Tarif')}
              </Button>
            </div>
          </div>
        </div>
      )}

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
              <h2 className="text-[22px] font-bold text-[#B5884D]">Hapus Tarif</h2>
            </div>
            <p className="text-sm text-[#EAE1D8] mb-4 leading-relaxed">
              Apakah Anda yakin ingin menghapus Tarif <span className="text-[#B5884D] font-bold">{itemYangDihapus.name}</span>? Aksi ini akan menghapus di list secara instan.
            </p>
            {hapusError && <p className="text-sm text-[#FF5656] mb-4">{hapusError}</p>}
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setItemYangDihapus(null)} className="px-6 py-2.5 text-sm font-medium text-[#B5884D] border border-[#B5884D] rounded-[8px] hover:bg-[#B5884D]/10 transition-colors">Batal</button>
              <button onClick={eksekusiHapus} disabled={deleteTarif.isPending} className="px-6 py-2.5 text-sm font-medium text-white bg-[#583333] border border-[#FF5656]/50 rounded-[8px] hover:bg-[#6e3e3e] transition-colors disabled:opacity-50">
                {deleteTarif.isPending ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
