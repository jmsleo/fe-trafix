'use client';

import Button from '@/app/components/ui/Button';
import React, { useState, useEffect } from 'react';

// Struktur Data Shift
interface ShiftData {
  id: number;
  namaShift: string;
  jamMulai: string;
  jamSelesai: string;
  status: 'AKTIF' | 'NON AKTIF';
}

export default function ShiftPage() {
  // 1. STATE TABEL
  const [dataShift, setDataShift] = useState<ShiftData[]>([
    { id: 1, namaShift: 'Shift Pagi', jamMulai: '07:00', jamSelesai: '15:00', status: 'AKTIF' },
    { id: 2, namaShift: 'Shift Siang', jamMulai: '15:00', jamSelesai: '23:00', status: 'AKTIF' },
    { id: 3, namaShift: 'Shift Malam', jamMulai: '23:00', jamSelesai: '07:00', status: 'AKTIF' },
    { id: 4, namaShift: 'Shift Cadangan', jamMulai: '09:00', jamSelesai: '17:00', status: 'NON AKTIF' },
  ]);

  // 2. STATE MODAL FORM
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idYangDiedit, setIdYangDiedit] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    namaShift: '',
    jamMulai: '',
    jamSelesai: ''
  });

  const [isStatusActive, setIsStatusActive] = useState(true);

  // 3. STATE MODAL HAPUS
  const [itemYangDihapus, setItemYangDihapus] = useState<ShiftData | null>(null);
  const [alasanHapus, setAlasanHapus] = useState('');

  // 4. STATE LAST UPDATE
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Set waktu Last Update saat halaman pertama dimuat
  useEffect(() => {
    perbaruiWaktu();
  }, []);

  // Fungsi memperbarui string jam saat aksi selesai
  const perbaruiWaktu = () => {
    const now = new Date();
    const jam = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastUpdate(jam + ' WIB');
  };

  // --- FUNGSI HANDLE FORM ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKlikTambah = () => {
    setIdYangDiedit(null);
    setFormData({ namaShift: '', jamMulai: '', jamSelesai: '' });
    setIsStatusActive(true);
    setIsModalOpen(true);
  };

  const handleKlikEdit = (shift: ShiftData) => {
    setIdYangDiedit(shift.id);
    setFormData({
      namaShift: shift.namaShift,
      jamMulai: shift.jamMulai,
      jamSelesai: shift.jamSelesai
    });
    setIsStatusActive(shift.status === 'AKTIF');
    setIsModalOpen(true);
  };

  const handleKlikHapus = (shift: ShiftData) => {
    setItemYangDihapus(shift);
    setAlasanHapus('');
  };

  const handleSimpanShift = () => {
    if (!formData.namaShift || !formData.jamMulai || !formData.jamSelesai) {
      alert("Jenis Shift, Jam Mulai, dan Jam Selesai wajib diisi!");
      return;
    }

    const statusTerbaru: 'AKTIF' | 'NON AKTIF' = isStatusActive ? 'AKTIF' : 'NON AKTIF';

    if (idYangDiedit !== null) {
      // EDIT
      const dataTerbaru = dataShift.map((item) => {
        if (item.id === idYangDiedit) {
          return {
            ...item,
            namaShift: formData.namaShift,
            jamMulai: formData.jamMulai,
            jamSelesai: formData.jamSelesai,
            status: statusTerbaru,
          };
        }
        return item;
      });
      setDataShift(dataTerbaru);
    } else {
      // TAMBAH BARU
      const shiftBaru: ShiftData = {
        id: Date.now(), 
        namaShift: formData.namaShift,
        jamMulai: formData.jamMulai,
        jamSelesai: formData.jamSelesai,
        status: 'AKTIF'
      };
      setDataShift([...dataShift, shiftBaru]);
    }

    setIsModalOpen(false);
    perbaruiWaktu(); // Update jam setelah simpan
  };

  const eksekusiHapus = () => {
    if (itemYangDihapus !== null) {
      const dataTerbaru = dataShift.filter((s) => s.id !== itemYangDihapus.id);
      setDataShift(dataTerbaru);
      setItemYangDihapus(null);
      perbaruiWaktu(); // Update jam setelah hapus
    }
  };

  return (
    <div className="space-y-4 relative">
      
      {/* Header Konten dengan Judul & Last Update */}
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
        
        <Button onClick={handleKlikTambah} className="w-full md:w-auto md:px-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#17130E" className="flex-shrink-0">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[18px] leading-none text-[#17130E] font-medium whitespace-nowrap">
            Tambah Shift
          </span>
        </Button>
      </div>

      {/* CONTAINER 1: Filter & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 rounded-[10px] border border-[#B5884D]/50 bg-transparent w-full gap-4">
        {/* Dropdown Status */}
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

        {/* Kotak Pencarian */}
        <div className="relative w-full sm:w-[320px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input type="text" placeholder="Cari Nama Shift..." className="w-full pl-10 pr-4 py-2 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:border-[#B5884D]" />
        </div>
      </div>

      {/* CONTAINER 2: Tabel Dinamis */}
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
              {dataShift.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Belum ada data shift.</td></tr>
              ) : (
                dataShift.map((s, index) => (
                  <tr key={s.id} className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326] transition-colors border-b border-[#B5884D]/10`}>
                    <td className="px-6 py-4 text-center whitespace-nowrap font-medium text-[#B5884D]">{s.namaShift}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="bg-black border border-[#B5884D]/30 px-3 py-1.5 rounded-md font-mono text-gray-300">{s.jamMulai}</span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="bg-black border border-[#B5884D]/30 px-3 py-1.5 rounded-md font-mono text-gray-300">{s.jamSelesai}</span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center justify-center mx-auto w-[97px] h-[23px] rounded-[9px] border text-[10px] font-semibold tracking-wide
                        ${s.status === 'AKTIF' ? 'border-[#79FF8D] bg-[#00FF2659] text-[#79FF8D]' : 'border-[#FF8080] bg-[#FF000059] text-[#FF8080]'}`}>
                        {s.status}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center space-x-4">
                        <button onClick={() => handleKlikEdit(s)} className="text-[#B5884D] hover:text-white transition-colors">Edit</button>
                        <button onClick={() => handleKlikHapus(s)} className="text-[#FF5656] hover:text-white transition-colors">Hapus</button>
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
          <span className="text-sm text-gray-400">Menampilkan 1-4 dari 4 Shift</span>
          <div className="inline-flex items-center space-x-2">
            <button className="px-3 py-1 text-sm text-gray-400 border border-[#B5884D]/50 rounded-[4px] hover:text-white hover:border-[#B5884D] transition-colors bg-transparent">Sebelumnya</button>
            <button className="w-8 h-8 flex items-center justify-center text-sm text-[#17130E] bg-[#B5884D] rounded-[4px] font-bold">1</button>
            <button className="px-3 py-1 text-sm text-[#EAE1D8] border border-[#B5884D]/50 rounded-[4px] hover:bg-[#B5884D]/20 transition-colors bg-transparent">Berikutnya</button>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL POPUP FORM (Tambah & Edit)          */}
      {/* ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1C1814] border-2 border-[#B5884D] w-full max-w-[480px] rounded-[16px] shadow-2xl relative px-[32px] pt-[32px] pb-[32px] animate-in fade-in zoom-in duration-200">
            
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-[#B5884D] hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <h2 className="text-[26px] font-bold text-[#B5884D] mb-8 tracking-wide">
              {idYangDiedit ? 'Edit Shift' : 'Tambah Shift'}
            </h2>

            <div className="space-y-6">
              
              {/* Jenis/Nama Shift */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#EAE1D8] tracking-wide">Jenis Shift</label>
                <input 
                  type="text" 
                  name="namaShift" 
                  value={formData.namaShift} 
                  onChange={handleInputChange} 
                  placeholder="Pagi, Siang..." 
                  className="w-full px-4 py-3 text-sm bg-[#0B0908] border border-[#B5884D]/60 rounded-[8px] text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:border-[#B5884D]" 
                />
              </div>

              {/* Start Time - TO - Finish Time */}
              <div className="flex items-end gap-4 w-full">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-[#EAE1D8] tracking-wide">Start Time</label>
                  <div className="relative">
                    <input 
                      type="time" 
                      name="jamMulai" 
                      value={formData.jamMulai} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3 text-sm bg-[#0B0908] border border-[#B5884D]/60 rounded-[8px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] appearance-none" 
                      style={{ colorScheme: 'dark' }} 
                    />
                  </div>
                </div>

                <div className="mb-3 font-bold text-[#B5884D] text-[16px]">To</div>

                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-[#EAE1D8] tracking-wide">Finish Time</label>
                  <div className="relative">
                    <input 
                      type="time" 
                      name="jamSelesai" 
                      value={formData.jamSelesai} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3 text-sm bg-[#0B0908] border border-[#B5884D]/60 rounded-[8px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] appearance-none" 
                      style={{ colorScheme: 'dark' }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end items-center gap-3 mt-10">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-7 py-2.5 text-sm font-bold text-[#B5884D] border border-[#B5884D] rounded-[8px] hover:bg-[#B5884D]/10 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSimpanShift} 
                className="px-7 py-2.5 text-sm font-bold text-[#1A1612] bg-[#B5884D] rounded-[8px] hover:bg-[#c99a5a] transition-colors shadow-[0_0_10px_rgba(181,136,77,0.3)]"
              >
                Simpan
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
          
          <div className="bg-[#1C1814] border-2 border-[#B5884D]/80 w-full max-w-[480px] rounded-[16px] shadow-2xl p-8 relative animate-in fade-in zoom-in duration-200">
            
            <button onClick={() => setItemYangDihapus(null)} className="absolute top-6 right-6 text-[#B5884D] hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="text-[#FF5656]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <h2 className="text-[24px] font-bold text-[#B5884D]">Hapus Shift</h2>
            </div>

            <p className="text-[15px] text-[#EAE1D8] mb-6 leading-relaxed">
              Apakah Anda yakin ingin Menghapus Shift <span className="text-[#B5884D] font-bold">{itemYangDihapus.namaShift} ({itemYangDihapus.jamMulai} SAMPAI {itemYangDihapus.jamSelesai})</span>? Aksi ini akan menghapus shift secara instan.
            </p>

            <div className="space-y-2 mb-8">
              <label className="text-sm font-medium text-gray-400">Alasan Penghapusan</label>
              <input 
                type="text" 
                value={alasanHapus}
                onChange={(e) => setAlasanHapus(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-black border border-[#B5884D]/60 rounded-[8px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" 
              />
            </div>

            <div className="flex items-center justify-end gap-4">
              <button 
                onClick={() => setItemYangDihapus(null)} 
                className="px-8 py-2.5 text-sm font-bold text-[#B5884D] border border-[#B5884D] rounded-[8px] hover:bg-[#B5884D]/10 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={eksekusiHapus} 
                className="px-8 py-2.5 text-sm font-bold text-[#EAE1D8] bg-[#583333] border border-[#FF5656]/50 rounded-[8px] hover:bg-[#6e3e3e] transition-colors"
              >
                Hapus
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}