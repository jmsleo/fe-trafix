'use client';

import Button from '@/app/components/ui/Button';
import React, { useState, useEffect } from 'react';

// Struktur Data Member
interface MemberData {
  id: number;
  noMember: string;
  namaLengkap: string;
  platNomor: string;
  kodeProx: string;
  jenisKendaraan: string;
  status: 'AKTIF' | 'NON AKTIF';
  masaBerlakuHari: number;
}

export default function DaftarMemberPage() {
  // 1. STATE TABEL
  const [dataMember, setDataMember] = useState<MemberData[]>([
    { id: 1, noMember: 'MEM-24-0012', namaLengkap: 'Wendra Ardi Kusuma', platNomor: 'H 2320 PI', kodeProx: 'FP-001245', jenisKendaraan: 'Mobil', status: 'AKTIF', masaBerlakuHari: 30 },
    { id: 2, noMember: 'MEM-24-0013', namaLengkap: "Fa'iq Damar Pratama", platNomor: 'H 2320 PI', kodeProx: 'FP-001246', jenisKendaraan: 'Kendaraan Besar', status: 'AKTIF', masaBerlakuHari: 31 },
    { id: 3, noMember: 'MEM-24-0014', namaLengkap: 'Yerky Syabana', platNomor: 'H 2320 PI', kodeProx: 'FP-001247', jenisKendaraan: 'Motor', status: 'AKTIF', masaBerlakuHari: 32 },
    { id: 4, noMember: 'MEM-24-0015', namaLengkap: 'Yerky Syabana', platNomor: 'H 2320 PI', kodeProx: 'FP-001248', jenisKendaraan: 'Motor', status: 'AKTIF', masaBerlakuHari: 33 },
  ]);

  // 2. STATE MODAL FORM
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idYangDiedit, setIdYangDiedit] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    noMember: '',
    namaLengkap: '',
    kodeProx: '',
    platNomor: '',
    jenisKendaraan: 'Mobil',
    noTelepon: '',
    email: '',
    alamat: '',
    paketMembership: 'Mobil 30 Hari',
    tanggalMulai: '',
  });

  const [isStatusActive, setIsStatusActive] = useState(true);

  // 3. STATE MODAL HAPUS
  const [itemYangDihapus, setItemYangDihapus] = useState<MemberData | null>(null);

  // Set default date
  useEffect(() => {
    if (isModalOpen && !idYangDiedit) {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, tanggalMulai: today, noMember: `MEM-24-${Math.floor(Math.random() * 9000) + 1000}` }));
    }
  }, [isModalOpen, idYangDiedit]);

  const hitungTanggalBerakhir = (tanggalMulai: string) => {
    if (!tanggalMulai) return '';
    const date = new Date(tanggalMulai);
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

  // --- FUNGSI HANDLE FORM ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKlikTambah = () => {
    setIdYangDiedit(null);
    setFormData({
      noMember: '', namaLengkap: '', kodeProx: '', platNomor: '', jenisKendaraan: 'Mobil',
      noTelepon: '', email: '', alamat: '', paketMembership: 'Mobil 30 Hari', tanggalMulai: ''
    });
    setIsStatusActive(true);
    setIsModalOpen(true);
  };

  const handleKlikEdit = (member: MemberData) => {
    setIdYangDiedit(member.id);
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      noMember: member.noMember,
      namaLengkap: member.namaLengkap,
      kodeProx: member.kodeProx,
      platNomor: member.platNomor,
      jenisKendaraan: member.jenisKendaraan,
      noTelepon: '08123456789',
      email: 'member@email.com',
      alamat: 'Jl. Contoh Alamat No. 123',
      paketMembership: 'Mobil 30 Hari',
      tanggalMulai: today
    });
    setIsStatusActive(member.status === 'AKTIF');
    setIsModalOpen(true);
  };

  const handleSimpanMember = () => {
    if (!formData.namaLengkap || !formData.platNomor) {
      alert("Nama Lengkap dan No. Plat wajib diisi!");
      return;
    }

    const statusTerbaru: 'AKTIF' | 'NON AKTIF' = isStatusActive ? 'AKTIF' : 'NON AKTIF';

    if (idYangDiedit !== null) {
      const dataTerbaru = dataMember.map((item) => {
        if (item.id === idYangDiedit) {
          return {
            ...item,
            namaLengkap: formData.namaLengkap,
            platNomor: formData.platNomor.toUpperCase(),
            kodeProx: formData.kodeProx,
            jenisKendaraan: formData.jenisKendaraan,
            status: statusTerbaru,
          };
        }
        return item;
      });
      setDataMember(dataTerbaru);
    } else {
      const memberBaru: MemberData = {
        id: Date.now(), 
        noMember: formData.noMember,
        namaLengkap: formData.namaLengkap,
        platNomor: formData.platNomor.toUpperCase(),
        kodeProx: formData.kodeProx || 'FP-000000',
        jenisKendaraan: formData.jenisKendaraan,
        status: statusTerbaru,
        masaBerlakuHari: 30
      };
      setDataMember([...dataMember, memberBaru]);
    }

    setIsModalOpen(false);
  };

  const eksekusiHapus = () => {
    if (itemYangDihapus !== null) {
      const dataTerbaru = dataMember.filter((m) => m.id !== itemYangDihapus.id);
      setDataMember(dataTerbaru);
      setItemYangDihapus(null);
    }
  };

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
          <select className="w-full appearance-none px-4 py-2 pr-10 text-sm bg-[#231F1A] border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer">
            <option>Semua Status</option>
            <option>Aktif</option>
            <option>Non Aktif</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8L0.669873 0.5L9.33013 0.5L5 8Z" fill="#B5884D"/></svg>
          </div>
        </div>

        <div className="relative w-full sm:w-[320px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input type="text" placeholder="Cari Nama, Plat." className="w-full pl-10 pr-4 py-2 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:border-[#B5884D]" />
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
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">NO. PLAT<br/>KENDARAAN</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">KODE PROX</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">JENIS KENDARAAN</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">STATUS</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">MASA BERLAKU<br/>(HARI)</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {dataMember.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Belum ada data member.</td></tr>
              ) : (
                dataMember.map((m, index) => (
                  <tr key={m.id} className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326] transition-colors border-b border-[#B5884D]/10`}>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-300">{m.noMember}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{m.namaLengkap}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{m.platNomor}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-300">{m.kodeProx}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{m.jenisKendaraan}</td>
                    
                    {/* STATUS YANG SUDAH DISAMAKAN DENGAN TARIF PARKIR */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center justify-center mx-auto w-[97px] h-[23px] rounded-[9px] border text-[10px] font-semibold tracking-wide
                        ${m.status === 'AKTIF' ? 'border-[#79FF8D] bg-[#00FF2659] text-[#79FF8D]' : 'border-[#FF8080] bg-[#FF000059] text-[#FF8080]'}`}>
                        {m.status}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center whitespace-nowrap">{m.masaBerlakuHari}</td>
                    
                    {/* TOMBOL AKSI TEKS (EDIT & HAPUS) KONSISTEN */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center space-x-4">
                        <button onClick={() => handleKlikEdit(m)} className="text-[#B5884D] hover:text-white transition-colors">Edit</button>
                        <button onClick={() => setItemYangDihapus(m)} className="text-[#FF5656] hover:text-white transition-colors">Hapus</button>
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
          <span className="text-sm text-gray-400">Menampilkan 1-4 dari 15 Member</span>
          <div className="inline-flex items-center space-x-2">
            <button className="px-3 py-1 text-sm text-gray-400 border border-[#B5884D]/50 rounded-[4px] hover:text-white hover:border-[#B5884D] transition-colors bg-transparent">Sebelumnya</button>
            <button className="w-8 h-8 flex items-center justify-center text-sm text-[#17130E] bg-[#B5884D] rounded-[4px] font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center text-sm text-gray-400 border border-[#B5884D]/50 rounded-[4px] hover:text-white transition-colors bg-transparent">2</button>
            <button className="px-3 py-1 text-sm text-[#EAE1D8] border border-[#B5884D]/50 rounded-[4px] hover:bg-[#B5884D]/20 transition-colors bg-transparent">Berikutnya</button>
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
                  <input type="text" name="namaLengkap" value={formData.namaLengkap} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#EAE1D8]">No. Member <span className="text-gray-400 font-normal">(Otomatis)</span></label>
                  <input type="text" name="noMember" value={formData.noMember} disabled className="w-full px-4 py-2.5 text-sm bg-[#1A1612] border border-[#B5884D]/30 rounded-[7px] text-gray-500 cursor-not-allowed focus:outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#EAE1D8]">Kode Prox <span className="text-gray-400 font-normal">(Scan Kartu)</span></label>
                  <input type="text" name="kodeProx" value={formData.kodeProx} onChange={handleInputChange} placeholder="Scan Kartu Member" className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-gray-400 focus:outline-none focus:border-[#B5884D] placeholder-gray-600" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#EAE1D8]">No. Plat Kendaraan</label>
                  <input type="text" name="platNomor" value={formData.platNomor} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] uppercase" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#EAE1D8]">Jenis Kendaraan</label>
                  <div className="relative">
                    <select name="jenisKendaraan" value={formData.jenisKendaraan} onChange={handleInputChange} className="w-full appearance-none px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] cursor-pointer">
                      <option value="Mobil">Mobil</option>
                      <option value="Motor">Motor</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#B5884D]">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8L0.669873 0.5L9.33013 0.5L5 8Z" fill="#B5884D"/></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#EAE1D8]">No. Telepon</label>
                  <input type="text" name="noTelepon" value={formData.noTelepon} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#EAE1D8]">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#EAE1D8]">Alamat</label>
                  <textarea name="alamat" value={formData.alamat} onChange={handleInputChange} rows={3} className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] resize-none"></textarea>
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
                      <select name="paketMembership" value={formData.paketMembership} onChange={handleInputChange} className="w-full appearance-none px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] cursor-pointer">
                        <option value="Mobil 30 Hari">Mobil 30 Hari</option>
                        <option value="Motor 30 Hari">Motor 30 Hari</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#B5884D]">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8L0.669873 0.5L9.33013 0.5L5 8Z" fill="#B5884D"/></svg>
                      </div>
                    </div>
                  </div>

                  {/* Info Package Card di Dalam */}
                  <div className="border border-[#B5884D]/60 rounded-[8px] p-4 bg-transparent mt-2">
                    <h4 className="text-[#B5884D] font-bold text-sm mb-4">Member {formData.paketMembership}</h4>
                    <div className="grid grid-cols-3 gap-2 divide-x divide-[#B5884D]/30">
                      <div className="flex flex-col items-center justify-center text-center px-2">
                        <div className="flex items-center gap-2 text-[#EAE1D8] font-semibold text-sm mb-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                          {formData.jenisKendaraan}
                        </div>
                        <span className="text-[10px] text-gray-500">Jenis Kendaraan</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center px-2">
                        <div className="flex items-center gap-2 text-[#EAE1D8] font-semibold text-sm mb-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          30 Hari
                        </div>
                        <span className="text-[10px] text-gray-500">Durasi</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center px-2">
                        <div className="flex items-center gap-2 text-[#EAE1D8] font-semibold text-sm mb-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                          Rp 50.000
                        </div>
                        <span className="text-[10px] text-gray-500">Harga</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[#EAE1D8]">Tanggal Mulai</label>
                    <input type="date" name="tanggalMulai" value={formData.tanggalMulai} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" style={{ colorScheme: 'dark' }} />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[#EAE1D8]">Tanggal Berakhir <span className="text-gray-400 font-normal">(Otomatis)</span></label>
                    <input type="date" value={hitungTanggalBerakhir(formData.tanggalMulai)} disabled className="w-full px-4 py-2.5 text-sm bg-[#1A1612] border border-[#B5884D]/30 rounded-[7px] text-gray-500 cursor-not-allowed focus:outline-none" style={{ colorScheme: 'dark' }} />
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

                {/* --- TOMBOL BATAL & SIMPAN --- */}
                {/* Rata Bawah secara Otomatis mengisi gap yang tersisa */}
                <div className="flex justify-between items-center gap-4 w-full mt-4">
                  <button onClick={() => setIsModalOpen(false)} className="w-1/2 py-3.5 text-sm font-bold text-[#B5884D] border border-[#B5884D] rounded-[8px] hover:bg-[#B5884D]/10 transition-colors">
                    Batal
                  </button>
                  <button onClick={handleSimpanMember} className="w-1/2 py-3.5 text-sm font-bold text-[#1A1612] bg-[#B5884D] rounded-[8px] hover:bg-[#c99a5a] transition-colors shadow-[0_0_10px_rgba(181,136,77,0.3)]">
                    Simpan
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
              Apakah Anda yakin ingin menghapus Member <span className="text-[#B5884D] font-bold">{itemYangDihapus.namaLengkap}</span>? Aksi ini akan menghapus data secara instan.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setItemYangDihapus(null)} className="px-6 py-2.5 text-sm font-medium text-[#B5884D] border border-[#B5884D] rounded-[8px] hover:bg-[#B5884D]/10 transition-colors whitespace-nowrap">Batal</button>
              <button onClick={eksekusiHapus} className="px-6 py-2.5 text-sm font-medium text-white bg-[#583333] border border-[#FF5656]/50 rounded-[8px] hover:bg-[#6e3e3e] transition-colors whitespace-nowrap">Hapus</button>
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