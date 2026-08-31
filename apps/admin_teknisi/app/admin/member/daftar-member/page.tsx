'use client';

import Button from '@/app/components/ui/Button';
import React, { useEffect, useMemo, useState } from 'react';
import {
  useBlockMember,
  useCreateMember,
  useDeleteMember,
  useMembers,
  useSubscriptionPlans,
  useUnblockMember,
  useUpdateMember,
} from '@/hooks/useMembers';
import { useVehicleTypes } from '@/hooks/useVehicleTypes';
import { getApiErrorMessage } from '@/lib/api/errors';
import type { MemberRead, MemberStatus, MemberSubscriptionBrief } from '@/lib/api/types';

interface MemberForm {
  name: string;
  member_code: string;
  card_number: string;
  police_number: string;
  vehicle_type_id: string;
  phone_number: string;
  email: string;
  plan_id: string;
}

const emptyForm: MemberForm = {
  name: '',
  member_code: '',
  card_number: '',
  police_number: '',
  vehicle_type_id: '',
  phone_number: '',
  email: '',
  plan_id: '',
};

function formatTanggalInput(iso?: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function tambahHari(tanggal: string, hari: number): string {
  if (!tanggal) return '';
  const date = new Date(`${tanggal}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '';
  date.setDate(date.getDate() + hari);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function hitungSisaHari(endDate: string): number {
  const end = new Date(endDate).getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((end - now) / 86400000));
}

function getActiveSubscription(
  subs?: MemberSubscriptionBrief[],
): MemberSubscriptionBrief | undefined {
  if (!subs || subs.length === 0) return undefined;
  return subs.find((s) => s.status === 'active') ?? subs[0];
}

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

export default function DaftarMemberPage() {
  // 1. STATE TABEL + FILTER
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const status = (statusFilter === '' ? null : statusFilter) as MemberStatus | null;

  const { data, isLoading, isError, refetch } = useMembers({
    search: debouncedSearch || null,
    status,
    page,
    page_size: 10,
  });

  const { data: vehicleTypesData } = useVehicleTypes({ page_size: 100 });
  const { data: plansData } = useSubscriptionPlans({ page_size: 100 });

  const vehicleTypeNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const vt of vehicleTypesData?.items ?? []) map.set(vt.id, vt.name);
    return map;
  }, [vehicleTypesData]);

  // 2. MUTATIONS
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();
  const blockMember = useBlockMember();
  const unblockMember = useUnblockMember();

  // 3. STATE MODAL FORM
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idYangDiedit, setIdYangDiedit] = useState<string | null>(null);
  const [formData, setFormData] = useState<MemberForm>(emptyForm);
  const [isStatusActive, setIsStatusActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // 4. STATE MODAL HAPUS
  const [itemYangDihapus, setItemYangDihapus] = useState<MemberRead | null>(null);

  // 5. STATE MODAL BLOKIR / BUKA BLOKIR
  const [itemYangDiubahStatus, setItemYangDiubahStatus] = useState<MemberRead | null>(null);
  const [isBlockAction, setIsBlockAction] = useState(true);

  const selectedPlan = plansData?.items?.find((p) => p.id === formData.plan_id);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const editedMember = useMemo(() => {
    if (!idYangDiedit) return null;
    return (data?.items ?? []).find((m) => m.id === idYangDiedit) ?? null;
  }, [idYangDiedit, data]);

  const currentSub = getActiveSubscription(editedMember?.subscriptions);
  const todayStr = new Date().toISOString().split('T')[0];

  const handleKlikTambah = () => {
    setIdYangDiedit(null);
    setFormData(emptyForm);
    setIsStatusActive(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleKlikEdit = (member: MemberRead) => {
    const sub = getActiveSubscription(member.subscriptions);
    const vehicle = member.vehicles?.[0];
    setIdYangDiedit(member.id);
    setFormData({
      name: member.name,
      member_code: member.member_code,
      card_number: member.card_number ?? '',
      police_number: vehicle?.police_number ?? '',
      vehicle_type_id: vehicle?.vehicle_type?.id ?? '',
      phone_number: member.phone_number ?? '',
      email: member.email ?? '',
      plan_id: sub?.plan?.id ?? '',
    });
    setIsStatusActive(member.status !== 'inactive');
    setFormError(null);
    setIsModalOpen(true);
  };

  const hitungTanggalBerakhir = () => {
    if (idYangDiedit !== null && currentSub && formData.plan_id === currentSub.plan?.id) {
      return formatTanggalInput(currentSub.end_date);
    }
    if (!selectedPlan) return '';
    return tambahHari(todayStr, selectedPlan.duration_in_days);
  };

  const handleSimpanMember = async () => {
    setFormError(null);

    const cardNumber = formData.card_number.trim();
    const policeNumber = formData.police_number.trim().toUpperCase();
    const email = formData.email.trim();
    const phoneNumber = formData.phone_number.trim();

    if (!formData.name.trim()) {
      setFormError('Nama lengkap wajib diisi.');
      return;
    }
    if (!phoneNumber) {
      setFormError('No. Telepon wajib diisi.');
      return;
    }
    if (!email) {
      setFormError('Email wajib diisi.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Format email tidak valid.');
      return;
    }

    if (idYangDiedit === null && cardNumber && !/^\d+$/.test(cardNumber)) {
      setFormError('No. Member hanya boleh berupa angka.');
      return;
    }

    if (!policeNumber) {
      setFormError('No. plat kendaraan wajib diisi.');
      return;
    }
    if (!formData.vehicle_type_id) {
      setFormError('Jenis kendaraan wajib dipilih.');
      return;
    }
    if (idYangDiedit === null && !formData.plan_id) {
      setFormError('Paket membership wajib dipilih.');
      return;
    }

    const statusTerbaru: MemberStatus = isStatusActive ? 'active' : 'inactive';

    setIsSaving(true);
    try {
      if (idYangDiedit !== null) {
        await updateMember.mutateAsync({
          id: idYangDiedit,
          data: {
            name: formData.name.trim(),
            email,
            phone_number: phoneNumber,
            card_number: cardNumber || undefined,
            status: statusTerbaru,
            plan_id: formData.plan_id || undefined,
            police_number: policeNumber,
            vehicle_type_id: formData.vehicle_type_id,
          },
        });
      } else {
        await createMember.mutateAsync({
          name: formData.name.trim(),
          email,
          phone_number: phoneNumber,
          card_number: cardNumber,
          status: statusTerbaru,
          police_number: policeNumber,
          vehicle_type_id: formData.vehicle_type_id,
          plan_id: formData.plan_id,
        });
      }

      setIsModalOpen(false);
      setIdYangDiedit(null);
      setFormData(emptyForm);
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Gagal menyimpan data member. Coba lagi.'));
    } finally {
      setIsSaving(false);
    }
  };

  const eksekusiHapus = () => {
    if (itemYangDihapus !== null) {
      deleteMember.mutate(itemYangDihapus.id, {
        onSuccess: () => setItemYangDihapus(null),
      });
    }
  };

  const eksekusiUbahStatus = () => {
    if (itemYangDiubahStatus === null) return;
    const id = itemYangDiubahStatus.id;
    const mutate = isBlockAction ? blockMember : unblockMember;
    mutate.mutate(id, { onSuccess: () => setItemYangDiubahStatus(null) });
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
        <h1 className="text-[32px] font-bold text-[#EAE1D8] whitespace-nowrap">Daftar Member</h1>

        <Button onClick={handleKlikTambah} className="w-full md:w-auto md:px-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#17130E" className="flex-shrink-0">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[18px] leading-none text-[#17130E] font-medium">
            Tambah Member
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
            <option value="blocked">Terblokir</option>
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
            placeholder="Cari Nama, No. Member."
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
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">No.<br/>MEMBER</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">NAMA LENGKAP</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">NO. KARTU</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">NO. PLAT<br/>KENDARAAN</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">JENIS KENDARAAN</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">STATUS</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">MASA BERLAKU<br/>(HARI)</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Memuat data member...</td></tr>
              ) : isError ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center bg-[#231F1A]">
                  <span className="text-[#FF5656]">Gagal memuat data.</span>{' '}
                  <button onClick={() => refetch()} className="text-[#B5884D] hover:underline">Coba lagi</button>
                </td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Belum ada data member.</td></tr>
              ) : (
                items.map((m, index) => {
                  const sub = getActiveSubscription(m.subscriptions);
                  const badge = m.status === 'active'
                    ? 'border-[#79FF8D] bg-[#00FF2659] text-[#79FF8D]'
                    : m.status === 'inactive'
                      ? 'border-[#FF8080] bg-[#FF000059] text-[#FF8080]'
                      : 'border-[#FFB74D] bg-[#FF980059] text-[#FFB74D]';
                  const label = m.status === 'active' ? 'AKTIF' : m.status === 'inactive' ? 'NON AKTIF' : 'TERBLOKIR';
                  return (
                    <tr key={m.id} className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326] transition-colors border-b border-[#B5884D]/10`}>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-gray-300">{m.member_code}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">{m.name}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">{m.card_number ?? '-'}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">{m.vehicles?.[0]?.police_number ?? '-'}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">{m.vehicles?.[0]?.vehicle_type?.name ?? '-'}</td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center justify-center mx-auto w-[97px] h-[23px] rounded-[9px] border text-[10px] font-semibold tracking-wide ${badge}`}>
                          {label}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {sub ? hitungSisaHari(sub.end_date) : '-'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center space-x-4">
                          <button onClick={() => handleKlikEdit(m)} className="text-[#B5884D] hover:text-white transition-colors">Edit</button>
                          {m.status === 'blocked' ? (
                            <button
                              onClick={() => { setIsBlockAction(false); setItemYangDiubahStatus(m); }}
                              className="text-[#79FF8D] hover:text-white transition-colors"
                            >
                              Buka Blokir
                            </button>
                          ) : (
                            <button
                              onClick={() => { setIsBlockAction(true); setItemYangDiubahStatus(m); }}
                              className="text-[#FFB74D] hover:text-white transition-colors"
                            >
                              Blokir
                            </button>
                          )}
                          <button onClick={() => setItemYangDihapus(m)} className="text-[#FF5656] hover:text-white transition-colors">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-transparent border-t border-[#B5884D]/30 gap-4 mt-auto">
          <span className="text-sm text-gray-400">
            {total === 0 ? 'Tidak ada data' : `Menampilkan ${startIndex}-${endIndex} dari ${total} Member`}
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
      {/* MODAL POPUP FORM (Tambah & Edit Member)   */}
      {/* ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">

          {/* --- OUTER CARD (Fix: 886 x 731, flex-col untuk auto-height ke dalam) --- */}
          <div className="bg-[#130F0C] border-2 border-[#B5884D]/80 w-[886px] h-[731px] rounded-[16px] shadow-2xl flex flex-col relative px-[24px] py-[24px] animate-in fade-in zoom-in duration-200">

            {/* Header Modal & Tombol Close (Tinggi Tetap) */}
            <div className="flex justify-between items-center mb-5 px-1 flex-shrink-0">
              <h2 className="text-[24px] font-bold text-[#B5884D]">{idYangDiedit ? 'Edit Member' : 'Tambah Member'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#B5884D] hover:text-white transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Bungkusan Konten Bawah (Otomatis mengisi sisa tinggi / flex-1) */}
            <div className="flex justify-between w-full flex-1 overflow-hidden">

              {/* --- KIRI: INFORMASI MEMBER (Otomatis tinggi penuh dari flex-1) --- */}
              <div className="w-[414px] h-full border border-[#B5884D]/50 rounded-[12px] p-5 flex flex-col gap-4 overflow-y-auto custom-scrollbar bg-transparent">
                <h3 className="text-[18px] font-bold text-[#B5884D] mb-1">Informasi Member</h3>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#EAE1D8]">Nama Lengkap</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#EAE1D8]">Kode Member <span className="text-gray-400 font-normal">(Otomatis)</span></label>
                  <input type="text" name="member_code" value={formData.member_code} disabled placeholder="Otomatis dibuat sistem" className="w-full px-4 py-2.5 text-sm bg-[#1A1612] border border-[#B5884D]/30 rounded-[7px] text-gray-500 cursor-not-allowed focus:outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#EAE1D8]">No. Member <span className="text-gray-400 font-normal">(No. Kartu)</span></label>
                  <input type="text" name="card_number" value={formData.card_number} onChange={handleInputChange} inputMode="numeric" maxLength={20} placeholder="Contoh: 0006248873" className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#EAE1D8]">No. Plat Kendaraan</label>
                  <input type="text" name="police_number" value={formData.police_number} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] uppercase" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#EAE1D8]">Jenis Kendaraan</label>
                  <div className="relative">
                    <select name="vehicle_type_id" value={formData.vehicle_type_id} onChange={handleInputChange} className="w-full appearance-none px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] cursor-pointer">
                      <option value="">Pilih Kendaraan</option>
                      {(vehicleTypesData?.items ?? []).map((vt) => (
                        <option key={vt.id} value={vt.id}>{vt.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#B5884D]">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8L0.669873 0.5L9.33013 0.5L5 8Z" fill="#B5884D"/></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#EAE1D8]">No. Telepon</label>
                  <input type="text" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#EAE1D8]">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" />
                </div>
              </div>

              {/* --- KANAN: BUNGKUSAN CARD MEMBERSHIP & TOMBOL AKSI --- */}
              <div className="w-[414px] h-full flex flex-col justify-between">

                {/* INNER CARD KANAN (Tinggi Tetap 492px) */}
                <div className="w-full h-[492px] border border-[#B5884D]/50 rounded-[12px] p-5 flex flex-col gap-4 overflow-y-auto custom-scrollbar bg-transparent flex-shrink-0">
                  <h3 className="text-[18px] font-bold text-[#B5884D] mb-1">Paket Membership</h3>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#EAE1D8]">Pilih Package</label>
                    <div className="relative">
                      <select
                        name="plan_id"
                        value={formData.plan_id}
                        onChange={handleInputChange}
                        className="w-full appearance-none px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] cursor-pointer"
                      >
                        <option value="">Pilih Package</option>
                        {(plansData?.items ?? []).map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#B5884D]">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8L0.669873 0.5L9.33013 0.5L5 8Z" fill="#B5884D"/></svg>
                      </div>
                    </div>
                  </div>

                  {/* Info Package Card di Dalam */}
                  <div className="border border-[#B5884D]/60 rounded-[8px] p-4 bg-transparent mt-2">
                    <h4 className="text-[#B5884D] font-bold text-sm mb-4">Member {selectedPlan?.name ?? '—'}</h4>
                    <div className="grid grid-cols-3 gap-2 divide-x divide-[#B5884D]/30">
                      <div className="flex flex-col items-center justify-center text-center px-2">
                        <div className="flex items-center gap-2 text-[#EAE1D8] font-semibold text-sm mb-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                          {vehicleTypeNames.get(formData.vehicle_type_id) ?? '-'}
                        </div>
                        <span className="text-[10px] text-gray-500">Jenis Kendaraan</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center px-2">
                        <div className="flex items-center gap-2 text-[#EAE1D8] font-semibold text-sm mb-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          {selectedPlan ? `${selectedPlan.duration_in_days} Hari` : '-'}
                        </div>
                        <span className="text-[10px] text-gray-500">Durasi</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center px-2">
                        <div className="flex items-center gap-2 text-[#EAE1D8] font-semibold text-sm mb-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                          {selectedPlan ? formatRupiah(selectedPlan.price) : '-'}
                        </div>
                        <span className="text-[10px] text-gray-500">Harga</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[#EAE1D8]">Tanggal Mulai <span className="text-gray-400 font-normal">(Otomatis)</span></label>
                    <input
                      type="date"
                      value={
                        idYangDiedit !== null && currentSub && formData.plan_id === currentSub.plan?.id
                          ? formatTanggalInput(currentSub?.start_date) || todayStr
                          : todayStr
                      }
                      disabled
                      className="w-full px-4 py-2.5 text-sm bg-[#1A1612] border border-[#B5884D]/30 rounded-[7px] text-gray-500 cursor-not-allowed focus:outline-none"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[#EAE1D8]">Tanggal Berakhir <span className="text-gray-400 font-normal">(Otomatis)</span></label>
                    <input type="date" value={hitungTanggalBerakhir()} disabled className="w-full px-4 py-2.5 text-sm bg-[#1A1612] border border-[#B5884D]/30 rounded-[7px] text-gray-500 cursor-not-allowed focus:outline-none" style={{ colorScheme: 'dark' }} />
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="text-sm font-medium text-[#EAE1D8]">Status</label>
                    <div
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors border ${isStatusActive ? 'border-[#B5884D] bg-[#B5884D]' : 'border-gray-500 bg-transparent'}`}
                      onClick={() => setIsStatusActive(!isStatusActive)}
                    >
                      <div className={`bg-[#EAE1D8] w-4 h-4 rounded-full shadow-md transform transition-transform ${isStatusActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                </div>

                {formError && <p className="text-sm text-[#FF5656] mt-3">{formError}</p>}

                {/* --- TOMBOL BATAL & SIMPAN --- */}
                <div className="flex justify-between items-center gap-4 w-full mt-4">
                  <button onClick={() => setIsModalOpen(false)} disabled={isSaving} className="w-1/2 py-3.5 text-sm font-bold text-[#B5884D] border border-[#B5884D] rounded-[8px] hover:bg-[#B5884D]/10 transition-colors disabled:opacity-50">
                    Batal
                  </button>
                  <button onClick={handleSimpanMember} disabled={isSaving} className="w-1/2 py-3.5 text-sm font-bold text-[#1A1612] bg-[#B5884D] rounded-[8px] hover:bg-[#c99a5a] transition-colors shadow-[0_0_10px_rgba(181,136,77,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSaving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>

              </div>
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
              <h2 className="text-[22px] font-bold text-[#B5884D]">Hapus Member</h2>
            </div>
            <p className="text-sm text-[#EAE1D8] mb-8 leading-relaxed">
              Apakah Anda yakin ingin menghapus Member <span className="text-[#B5884D] font-bold">{itemYangDihapus.name}</span>? Aksi ini akan menghapus data secara instan.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setItemYangDihapus(null)} className="px-6 py-2.5 text-sm font-medium text-[#B5884D] border border-[#B5884D] rounded-[8px] hover:bg-[#B5884D]/10 transition-colors whitespace-nowrap">Batal</button>
              <button onClick={eksekusiHapus} disabled={deleteMember.isPending} className="px-6 py-2.5 text-sm font-medium text-white bg-[#583333] border border-[#FF5656]/50 rounded-[8px] hover:bg-[#6e3e3e] transition-colors whitespace-nowrap disabled:opacity-50">
                {deleteMember.isPending ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL KONFIRMASI BLOKIR / BUKA BLOKIR     */}
      {/* ========================================= */}
      {itemYangDiubahStatus !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#17130E] border border-[#B5884D] w-full max-w-md rounded-[14px] shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setItemYangDiubahStatus(null)} className="absolute top-5 right-5 text-[#B5884D] hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className={isBlockAction ? 'text-[#FFB74D]' : 'text-[#79FF8D]'}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h2 className="text-[22px] font-bold text-[#B5884D]">{isBlockAction ? 'Blokir Member' : 'Buka Blokir Member'}</h2>
            </div>
            <p className="text-sm text-[#EAE1D8] mb-8 leading-relaxed">
              {isBlockAction ? (
                <>Apakah Anda yakin ingin memblokir Member <span className="text-[#B5884D] font-bold">{itemYangDiubahStatus.name}</span>? Member yang diblokir tidak dapat mengakses layanan.</>
              ) : (
                <>Apakah Anda yakin ingin membuka blokir Member <span className="text-[#B5884D] font-bold">{itemYangDiubahStatus.name}</span>?</>
              )}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setItemYangDiubahStatus(null)} className="px-6 py-2.5 text-sm font-medium text-[#B5884D] border border-[#B5884D] rounded-[8px] hover:bg-[#B5884D]/10 transition-colors whitespace-nowrap">Batal</button>
              <button onClick={eksekusiUbahStatus} disabled={isBlockAction ? blockMember.isPending : unblockMember.isPending} className={`px-6 py-2.5 text-sm font-medium text-white rounded-[8px] transition-colors whitespace-nowrap disabled:opacity-50 ${isBlockAction ? 'bg-[#6e4f1a] border border-[#FFB74D]/50 hover:bg-[#8a6522]' : 'bg-[#2f6e3a] border border-[#79FF8D]/50 hover:bg-[#3a8448]'}`}>
                {isBlockAction
                  ? (blockMember.isPending ? 'Memblokir...' : 'Blokir')
                  : (unblockMember.isPending ? 'Membuka Blokir...' : 'Buka Blokir')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles tambahan untuk scrollbar elegan */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(181, 136, 77, 0.4); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(181, 136, 77, 0.7); }
      `}} />

    </div>
  );
}
