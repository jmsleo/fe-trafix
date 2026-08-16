'use client';

import Button from '@/app/components/ui/Button';
import React, { useState, useEffect } from 'react';

// Struktur Data Signage
interface SignageData {
  id: number;
  no: number;
  foto: string; 
  namaSignage: string;
  lokasi: string;
  tipe: string;
  status: 'AKTIF' | 'NON AKTIF';
  terakhirUpdate: string;
  deskripsi: string;
  tipeKonten: string;
}

export default function SignageManagementPage() {
  // 1. STATE TABEL
  const [dataSignage, setDataSignage] = useState<SignageData[]>([
    { id: 1, no: 1, foto: '/foto-1.png', namaSignage: 'Dilarang Parkir', lokasi: 'Gate - in A', tipe: 'LED DISPLAY', status: 'AKTIF', terakhirUpdate: '01/08/2026 14:30', deskripsi: '', tipeKonten: 'Gambar' },
    { id: 2, no: 2, foto: '/foto-2.png', namaSignage: 'Maks. Kecepatan', lokasi: 'Gate - Out A', tipe: 'LED DISPLAY', status: 'AKTIF', terakhirUpdate: '01/08/2026 14:30', deskripsi: '', tipeKonten: 'Gambar' },
    { id: 3, no: 3, foto: '/foto-3.png', namaSignage: 'Area Parkir', lokasi: 'Gate - in B', tipe: 'LED DISPLAY', status: 'AKTIF', terakhirUpdate: '01/08/2026 14:30', deskripsi: '', tipeKonten: 'Gambar' },
  ]);

  // 2. STATE MODAL FORM
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idYangDiedit, setIdYangDiedit] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    namaSignage: '',
    lokasi: '',
    tipe: 'LED DISPLAY',
    status: 'AKTIF',
    deskripsi: '',
    tipeKonten: 'Gambar',
    foto: ''
  });

  // 3. STATE MODAL HAPUS
  const [itemYangDihapus, setItemYangDihapus] = useState<SignageData | null>(null);

  // Mendapatkan waktu saat ini untuk format Terakhir Update
  const getWaktuSekarang = () => {
    const now = new Date();
    const tgl = String(now.getDate()).padStart(2, '0');
    const bln = String(now.getMonth() + 1).padStart(2, '0');
    const thn = now.getFullYear();
    const jam = String(now.getHours()).padStart(2, '0');
    const mnt = String(now.getMinutes()).padStart(2, '0');
    return `${tgl}/${bln}/${thn} ${jam}:${mnt}`;
  };

  // --- FUNGSI HANDLE FORM ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- FUNGSI KHUSUS UPLOAD FOTO ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Cek ukuran maksimal (contoh: 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 5MB!");
        return;
      }
      
      // Buat URL sementara (local preview) untuk gambar yang di-upload
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, foto: imageUrl }));
    }
  };

  const handleKlikTambah = () => {
    setIdYangDiedit(null);
    setFormData({ namaSignage: '', lokasi: '', tipe: 'LED DISPLAY', status: 'AKTIF', deskripsi: '', tipeKonten: 'Gambar', foto: '' });
    setIsModalOpen(true);
  };

  const handleKlikEdit = (signage: SignageData) => {
    setIdYangDiedit(signage.id);
    setFormData({
      namaSignage: signage.namaSignage,
      lokasi: signage.lokasi,
      tipe: signage.tipe,
      status: signage.status,
      deskripsi: signage.deskripsi || '',
      tipeKonten: signage.tipeKonten || 'Gambar',
      foto: signage.foto
    });
    setIsModalOpen(true);
  };

  const handleKlikHapus = (signage: SignageData) => {
    setItemYangDihapus(signage);
  };

  const handleSimpanSignage = () => {
    if (!formData.namaSignage || !formData.lokasi) {
      alert("Nama Signage dan Lokasi wajib diisi!");
      return;
    }

    if (idYangDiedit !== null) {
      // EDIT
      const dataTerbaru = dataSignage.map((item) => {
        if (item.id === idYangDiedit) {
          return {
            ...item,
            namaSignage: formData.namaSignage,
            lokasi: formData.lokasi,
            tipe: formData.tipe,
            status: formData.status as 'AKTIF' | 'NON AKTIF',
            deskripsi: formData.deskripsi,
            tipeKonten: formData.tipeKonten,
            foto: formData.foto || item.foto,
            terakhirUpdate: getWaktuSekarang()
          };
        }
        return item;
      });
      setDataSignage(dataTerbaru);
    } else {
      // TAMBAH BARU
      const signageBaru: SignageData = {
        id: Date.now(), 
        no: dataSignage.length + 1,
        foto: formData.foto || '', // Menggunakan foto yang baru di-upload (jika ada)
        namaSignage: formData.namaSignage,
        lokasi: formData.lokasi,
        tipe: formData.tipe,
        status: formData.status as 'AKTIF' | 'NON AKTIF',
        deskripsi: formData.deskripsi,
        tipeKonten: formData.tipeKonten,
        terakhirUpdate: getWaktuSekarang()
      };
      setDataSignage([...dataSignage, signageBaru]);
    }

    setIsModalOpen(false);
  };

  const eksekusiHapus = () => {
    if (itemYangDihapus !== null) {
      const dataTerbaru = dataSignage.filter((s) => s.id !== itemYangDihapus.id);
      
      // Update nomor urut ulang
      const dataDiurutkan = dataTerbaru.map((item, idx) => ({
        ...item,
        no: idx + 1
      }));

      setDataSignage(dataDiurutkan);
      setItemYangDihapus(null);
    }
  };

  return (
    <div className="space-y-4 relative">
      
      {/* Header Konten */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <h1 className="text-[32px] font-bold text-[#EAE1D8] whitespace-nowrap leading-none">Signage Management</h1>
        
        <Button onClick={handleKlikTambah} className="w-full md:w-auto md:px-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#17130E" className="flex-shrink-0">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[18px] leading-none text-[#17130E] font-medium whitespace-nowrap">
            Tambah Signage
          </span>
        </Button>
      </div>

      {/* CONTAINER 1: Filter & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-end p-5 rounded-[10px] border border-[#B5884D]/50 bg-transparent w-full gap-4">
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#B5884D] tracking-wide">Lokasi</label>
            <div className="relative w-full sm:w-[150px]">
              <select className="w-full appearance-none px-4 py-2.5 pr-10 text-sm bg-transparent border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer">
                <option>Semua Lokasi</option>
                <option>Gate - in A</option>
                <option>Gate - Out A</option>
                <option>Gate - in B</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#B5884D]">▼</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#B5884D] tracking-wide">Status</label>
            <div className="relative w-full sm:w-[150px]">
              <select className="w-full appearance-none px-4 py-2.5 pr-10 text-sm bg-transparent border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer">
                <option>Semua Status</option>
                <option>AKTIF</option>
                <option>NON AKTIF</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#B5884D]">▼</div>
            </div>
          </div>
        </div>

        <div className="relative w-full sm:w-[320px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input type="text" placeholder="Cari Nama, Lokasi.." className="w-full pl-10 pr-4 py-2.5 text-sm bg-transparent border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:border-[#B5884D]" />
        </div>
      </div>

      {/* CONTAINER 2: Tabel Dinamis */}
      <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent w-full flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-[#EAE1D8]">
            <thead className="text-[11px] uppercase bg-[#231F1A] border-b border-[#B5884D]/30">
              <tr>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-[#EAE1D8]">NO.</th>
                <th className="px-6 py-5 font-medium tracking-wider text-left whitespace-nowrap text-[#EAE1D8]">NAMA SIGNAGE</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-[#EAE1D8]">LOKASI</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-[#EAE1D8]">TIPE</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-[#EAE1D8]">STATUS</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-[#EAE1D8]">TERAKHIR UPDATE</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-[#EAE1D8]">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {dataSignage.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Belum ada data signage.</td></tr>
              ) : (
                dataSignage.map((s, index) => (
                  <tr key={s.id} className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326] transition-colors border-b border-[#B5884D]/10`}>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-300">{s.no}</td>
                    
                    {/* FOTO & NAMA */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-[42px] h-[42px] bg-white rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                           {s.foto ? (
                             <img src={s.foto} alt={s.namaSignage} className="w-full h-full object-contain" />
                           ) : (
                             <div className="w-full h-full flex justify-center items-center bg-gray-800 text-gray-400 text-[10px]">No Img</div>
                           )}
                        </div>
                        <span className="font-medium text-[#EAE1D8]">{s.namaSignage}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-300">{s.lokasi}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-300">{s.tipe}</td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center justify-center mx-auto w-[80px] h-[26px] rounded-[14px] border text-[11px] font-bold tracking-wide
                        ${s.status === 'AKTIF' ? 'border-[#79FF8D] bg-[#00FF2659] text-[#79FF8D]' : 'border-[#FF8080] bg-[#FF000059] text-[#FF8080]'}`}>
                        {s.status}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-300">{s.terakhirUpdate}</td>

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

        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-transparent border-t border-[#B5884D]/30 gap-4 mt-auto">
          <span className="text-sm text-gray-400">Menampilkan 1-{dataSignage.length} dari {dataSignage.length} Signage</span>
          <div className="inline-flex items-center space-x-2">
            <button className="px-3 py-1 text-sm text-gray-400 border border-[#B5884D]/50 rounded-[4px] hover:text-white hover:border-[#B5884D] transition-colors bg-transparent">Sebelumnya</button>
            <button className="w-8 h-8 flex items-center justify-center text-sm text-[#17130E] bg-[#B5884D] rounded-[4px] font-bold">1</button>
            <button className="px-3 py-1 text-sm text-[#EAE1D8] border border-[#B5884D]/50 rounded-[4px] hover:bg-[#B5884D]/20 transition-colors bg-transparent">Berikutnya</button>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL POPUP FORM (Tambah & Edit Signage)  */}
      {/* ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#1C1814] border-2 border-[#B5884D] w-full max-w-[920px] rounded-[16px] shadow-2xl relative px-[32px] pt-[28px] pb-[32px] animate-in fade-in zoom-in duration-200">
            
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-[#B5884D] hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <h2 className="text-[26px] font-bold text-[#B5884D] mb-6 tracking-wide">
              {idYangDiedit ? 'Edit Signage' : 'Tambah Signage'}
            </h2>

            {/* Bungkusan 2 Kolom Sejajar */}
            <div className="flex flex-col md:flex-row gap-6">
              
              {/* KOLOM KIRI: Informasi Signage */}
              <div className="flex-1 border border-[#B5884D]/60 rounded-[15px] p-5 space-y-4">
                <h3 className="text-[18px] font-bold text-[#B5884D] mb-2">Informasi Signage</h3>
                
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#EAE1D8] tracking-wide">Nama Signage</label>
                  <input 
                    type="text" 
                    name="namaSignage" 
                    value={formData.namaSignage} 
                    onChange={handleInputChange} 
                    placeholder="Misal: Area Parkir" 
                    className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/60 rounded-[6px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#EAE1D8] tracking-wide">Lokasi</label>
                  <div className="relative">
                    <select 
                      name="lokasi" 
                      value={formData.lokasi} 
                      onChange={handleInputChange} 
                      className="w-full appearance-none px-4 py-2.5 text-sm bg-black border border-[#B5884D]/60 rounded-[6px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] cursor-pointer"
                    >
                      <option value="" disabled hidden>Pilih Lokasi</option>
                      <option value="Gate - in A">Gate - in A</option>
                      <option value="Gate - Out A">Gate - Out A</option>
                      <option value="Gate - in B">Gate - in B</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#B5884D]">▼</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#EAE1D8] tracking-wide">Tipe Signage</label>
                  <div className="relative">
                    <select 
                      name="tipe" 
                      value={formData.tipe} 
                      onChange={handleInputChange} 
                      className="w-full appearance-none px-4 py-2.5 text-sm bg-black border border-[#B5884D]/60 rounded-[6px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] cursor-pointer"
                    >
                      <option value="LED DISPLAY">LED DISPLAY</option>
                      <option value="LCD PANEL">LCD PANEL</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#B5884D]">▼</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#EAE1D8] tracking-wide">Status</label>
                  <div className="relative">
                    <select 
                      name="status" 
                      value={formData.status} 
                      onChange={handleInputChange} 
                      className="w-full appearance-none px-4 py-2.5 text-sm bg-black border border-[#B5884D]/60 rounded-[6px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] cursor-pointer"
                    >
                      <option value="AKTIF">Aktif</option>
                      <option value="NON AKTIF">Non Aktif</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#B5884D]">▼</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#EAE1D8] tracking-wide">Deskripsi (Opsional)</label>
                  <textarea 
                    name="deskripsi" 
                    value={formData.deskripsi} 
                    onChange={handleInputChange} 
                    rows={3} 
                    className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/60 rounded-[6px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] resize-none"
                  ></textarea>
                </div>
              </div>

              {/* KOLOM KANAN: Konten Signage & Tombol Aksi */}
              <div className="flex-1 flex flex-col justify-between">
                
                {/* Card Konten Signage */}
                <div className="w-full h-[374px] border border-[#B5884D]/60 rounded-[15px] p-5">
                  <h3 className="text-[18px] font-bold text-[#B5884D] mb-4">Konten Signage</h3>
                  
                  {/* Tipe Konten (Radio) */}
                  <div className="space-y-2 mb-4">
                    <label className="text-[13px] font-medium text-[#EAE1D8] tracking-wide">Tipe Konten</label>
                    <div className="flex items-center gap-6 mt-1">
                      {['Gambar', 'Video', 'Teks'].map((opsi) => (
                        <label key={opsi} className="flex items-center gap-2 cursor-pointer">
                          <div className="w-[16px] h-[16px] rounded-full border border-[#B5884D] flex items-center justify-center">
                            {formData.tipeKonten === opsi && <div className="w-[8px] h-[8px] rounded-full bg-[#B5884D]"></div>}
                          </div>
                          <span className="text-sm text-[#EAE1D8]">{opsi}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Area Upload Gambar Berfungsi */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#EAE1D8] tracking-wide">Upload Gambar</label>
                    
                    {/* BUNGKUSAN LABEL AGAR BISA DI KLIK UNTUK UPLOAD FOTO */}
                    <label 
                      htmlFor="upload-foto" 
                      className="block w-full h-[180px] bg-[#1C1814] border border-[#B5884D]/60 rounded-[8px] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:bg-black/40 transition-colors"
                    >
                      {formData.foto ? (
                        <>
                          <img src={formData.foto} alt="Preview" className="w-full h-full object-contain p-2" 
                               onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2NjIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiPjwvcmVjdD48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSI+PC9jaXJjbGU+PHBvbHlsaW5lIHBvaW50cz0iMjEgMTUgMTYgMTAgNSAyMSI+PC9wb2x5bGluZT48L3N2Zz4='; }} />
                          
                          {/* Efek Hover Ubah Gambar */}
                          <div className="absolute bottom-0 w-full bg-black/90 pt-2 pb-3 text-center border-t border-[#B5884D]/30 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-[#B5884D] font-bold text-[13px]">Ubah Gambar</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">PNG, JPG, JPEG (Maks. 5MB)</p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center flex flex-col items-center p-4">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                          <p className="text-[12px] text-gray-400 mt-2">Klik atau drag & drop gambar disini</p>
                          <p className="text-[10px] text-gray-500 mt-1">PNG, JPG, JPEG (Maks. 5MB)</p>
                        </div>
                      )}

                      {/* INPUT FILE DISEMBUNYIKAN */}
                      <input 
                        type="file" 
                        id="upload-foto" 
                        accept="image/png, image/jpeg, image/jpg" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                      />
                    </label>
                  </div>
                </div>

                {/* Tombol Aksi - Di Luar Card Konten */}
                <div className="flex justify-end items-center gap-3 mt-6">
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="px-10 py-2.5 text-sm font-bold text-[#B5884D] border border-[#B5884D] rounded-[6px] hover:bg-[#B5884D]/10 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleSimpanSignage} 
                    className="px-10 py-2.5 text-sm font-bold text-[#1A1612] bg-[#B5884D] rounded-[6px] hover:bg-[#c99a5a] transition-colors shadow-[0_0_10px_rgba(181,136,77,0.3)]"
                  >
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
          <div className="bg-[#1C1814] border-2 border-[#B5884D]/80 w-full max-w-[480px] rounded-[16px] shadow-2xl p-8 relative animate-in fade-in zoom-in duration-200">
            
            <button onClick={() => setItemYangDihapus(null)} className="absolute top-6 right-6 text-[#B5884D] hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="text-[#FF5656]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <h2 className="text-[24px] font-bold text-[#B5884D]">Hapus Signage</h2>
            </div>

            <p className="text-[15px] text-[#EAE1D8] mb-10 leading-relaxed">
              Apakah Anda yakin ingin menghapus Signage <span className="text-[#B5884D] font-bold">{itemYangDihapus.namaSignage} ({itemYangDihapus.lokasi})</span>? Aksi ini akan menghapus secara instan.
            </p>

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