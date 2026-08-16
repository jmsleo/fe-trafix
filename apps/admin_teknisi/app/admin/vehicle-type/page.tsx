'use client';

import React, { useState } from 'react';
import Button from '../../components/ui/Button'; 

// Struktur Data Vehicle Type
interface VehicleType {
  id: number;
  kode: string;
  jenis: string;
  status: 'AKTIF' | 'NON AKTIF';
  tanggalUpdate: string;
}

export default function VehicleTypePage() {
  // 1. STATE TABEL
  const [dataVehicle, setDataVehicle] = useState<VehicleType[]>([
    { id: 1, kode: 'MBL-001', jenis: 'Mobil', status: 'AKTIF', tanggalUpdate: '16/08/26 15:03:00' },
    { id: 2, kode: 'MTR-001', jenis: 'Motor', status: 'AKTIF', tanggalUpdate: '16/08/26 15:03:00' },
    { id: 3, kode: 'KBS-001', jenis: 'Kendaraan Besar', status: 'NON AKTIF', tanggalUpdate: '16/08/26 15:03:00' },
  ]);

  // 2. STATE MODAL FORM
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idYangDiedit, setIdYangDiedit] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    kode: '',
    jenis: ''
  });

  // 3. STATE MODAL HAPUS
  const [itemYangDihapus, setItemYangDihapus] = useState<VehicleType | null>(null);

  // --- FUNGSI HANDLE FORM ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKlikTambah = () => {
    setIdYangDiedit(null);
    setFormData({ kode: '', jenis: '' });
    setIsModalOpen(true);
  };

  const handleKlikEdit = (vehicle: VehicleType) => {
    setIdYangDiedit(vehicle.id);
    setFormData({ 
      kode: vehicle.kode, 
      jenis: vehicle.jenis 
    });
    setIsModalOpen(true);
  };

  const handleSimpanVehicle = () => {
    if (!formData.jenis) {
      alert("Harap isi Jenis Kendaraan!");
      return;
    }

    const waktuSekarang = new Date().toLocaleString('id-ID', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).replace(/\./g, ':');

    if (idYangDiedit !== null) {
      // EDIT
      const dataTerbaru = dataVehicle.map((item) => {
        if (item.id === idYangDiedit) {
          return {
            ...item,
            jenis: formData.jenis,
            tanggalUpdate: waktuSekarang
          };
        }
        return item;
      });
      setDataVehicle(dataTerbaru);
    } else {
      // TAMBAH BARU
      const randomCode = `VHC-${Math.floor(Math.random() * 900) + 100}`;
      const vehicleBaru: VehicleType = {
        id: Date.now(), 
        kode: randomCode, 
        jenis: formData.jenis,
        status: 'AKTIF',
        tanggalUpdate: waktuSekarang
      };
      setDataVehicle([...dataVehicle, vehicleBaru]);
    }

    setIsModalOpen(false);
    setIdYangDiedit(null);
    setFormData({ kode: '', jenis: '' });
  };

  const eksekusiHapus = () => {
    if (itemYangDihapus !== null) {
      const dataTerbaru = dataVehicle.filter((v) => v.id !== itemYangDihapus.id);
      setDataVehicle(dataTerbaru);
      setItemYangDihapus(null);
    }
  };

  return (
    <div className="space-y-4 relative">
      
      {/* Header Konten */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className="text-3xl font-bold text-[#EAE1D8] whitespace-nowrap">Jenis Kendaraan</h1>
        
        {/* Tombol pakai w-auto dan px-6 biar memanjang ke samping otomatis */}
        <Button onClick={handleKlikTambah} className="w-full md:w-auto md:px-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#17130E" className="flex-shrink-0">
            <path d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z" />
          </svg>
          <span className="text-[18px] leading-none text-[#17130E] whitespace-nowrap">
            Tambah Kendaraan
          </span>
        </Button>
      </div>

      {/* CONTAINER 1: Filter Dropdown & Search */}
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
          <input type="text" placeholder="Cari Nama, Kode." className="w-full pl-10 pr-4 py-2 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:border-[#B5884D]" />
        </div>
      </div>

      {/* CONTAINER 2: Tabel Dinamis */}
      <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-[#EAE1D8]">
            <thead className="text-[11px] uppercase bg-[#231F1A] border-b border-[#B5884D]/30">
              <tr>
                {/* Tambah whitespace-nowrap di semua header tabel */}
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">KODE KENDARAAN</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">JENIS KENDARAAN</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">STATUS</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">Tanggal update</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {dataVehicle.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Belum ada data tipe kendaraan.</td></tr>
              ) : (
                dataVehicle.map((v, index) => (
                  <tr key={v.id} className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326] transition-colors`}>
                    {/* Tambah whitespace-nowrap di semua isi tabel */}
                    <td className="px-6 py-4 font-semibold text-[#B5884D] text-center whitespace-nowrap">{v.kode}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{v.jenis}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center justify-center mx-auto w-[97px] h-[23px] rounded-[9px] border text-[10px] font-semibold tracking-wide
                        ${v.status === 'AKTIF' ? 'border-[#79FF8D] bg-[#00FF2659] text-[#79FF8D]' : 'border-[#FF8080] bg-[#FF000059] text-[#FF8080]'}`}>
                        {v.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-xs whitespace-nowrap">{v.tanggalUpdate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center space-x-4">
                        <button onClick={() => handleKlikEdit(v)} className="text-[#B5884D] hover:text-white transition-colors">Edit</button>
                        <button onClick={() => setItemYangDihapus(v)} className="text-[#FF5656] hover:text-white transition-colors">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL POPUP FORM (Tambah & Edit)          */}
      {/* ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#17130E] border border-[#B5884D] w-full max-w-sm rounded-[10px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-[#B5884D]/30 bg-[#231F1A]">
              <h2 className="text-xl font-bold text-[#EAE1D8]">{idYangDiedit ? 'Edit Kendaraan' : 'Tambah Kendaraan'}</h2>
              <button onClick={() => {setIsModalOpen(false); setIdYangDiedit(null);}} className="text-gray-400 hover:text-[#FF5656] transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              
              {/* INPUT KODE KENDARAAN */}
              {idYangDiedit !== null && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Kode Kendaraan</label>
                  <input 
                    type="text" 
                    name="kode" 
                    value={formData.kode} 
                    disabled 
                    className="w-full px-4 py-2.5 text-sm bg-black/50 border border-[#B5884D]/30 rounded-[7px] text-gray-500 cursor-not-allowed focus:outline-none" 
                  />
                </div>
              )}

              {/* INPUT JENIS KENDARAAN */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Jenis Kendaraan</label>
                <input 
                  type="text" 
                  name="jenis" 
                  value={formData.jenis} 
                  onChange={handleInputChange} 
                  placeholder="Contoh: Mobil Box" 
                  className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" 
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-[#B5884D]/30 bg-[#231F1A]">
              <button onClick={() => {setIsModalOpen(false); setIdYangDiedit(null);}} className="px-6 py-2.5 text-sm font-medium text-[#EAE1D8] border border-gray-600 rounded-[7px] hover:bg-gray-800 transition-colors whitespace-nowrap">
                Batal
              </button>
              <Button onClick={handleSimpanVehicle} className="px-6 !h-auto py-2.5 !w-auto whitespace-nowrap">
                {idYangDiedit ? 'Simpan' : 'Tambah'}
              </Button>
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
              <h2 className="text-[22px] font-bold text-[#B5884D]">Hapus Jenis Kendaraan</h2>
            </div>
            <p className="text-sm text-[#EAE1D8] mb-8 leading-relaxed">
              Apakah Anda yakin ingin menghapus <span className="text-[#B5884D] font-bold uppercase">{itemYangDihapus.kode} - {itemYangDihapus.jenis}</span>? Aksi ini akan menghapus di list secara instan.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setItemYangDihapus(null)} className="px-6 py-2.5 text-sm font-medium text-[#B5884D] border border-[#B5884D] rounded-[8px] hover:bg-[#B5884D]/10 transition-colors whitespace-nowrap">Batal</button>
              <button onClick={eksekusiHapus} className="px-6 py-2.5 text-sm font-medium text-white bg-[#583333] border border-[#FF5656]/50 rounded-[8px] hover:bg-[#6e3e3e] transition-colors whitespace-nowrap">Hapus</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}