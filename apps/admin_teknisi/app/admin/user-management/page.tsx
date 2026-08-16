'use client';

import Button from '@/app/components/ui/Button';
import React, { useState, useEffect } from 'react';

// Struktur Data User
interface UserData {
  id: number;
  namaLengkap: string;
  username: string;
  role: string;
  status: 'Active' | 'In active';
  lastLoginDate: string;
  lastLoginTime: string;
}

export default function UserManagementPage() {
  // 1. STATE TABEL
  const [dataUser, setDataUser] = useState<UserData[]>([
    { id: 1, namaLengkap: "Fa'iq Damar", username: 'Paemoonx_tek', role: 'Teknisi', status: 'Active', lastLoginDate: '24 Juli 2026', lastLoginTime: '18:07:05' },
    { id: 2, namaLengkap: 'Wendra Cihuyy', username: 'Wencuyy_adm', role: 'Admin', status: 'In active', lastLoginDate: '28 Juli 2026', lastLoginTime: '18:07:05' },
    { id: 3, namaLengkap: 'Sophia', username: 'Syopia_tek', role: 'Teknisi', status: 'Active', lastLoginDate: '30 Juli 2026', lastLoginTime: '18:07:05' },
  ]);

  // 2. STATE MODAL FORM
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idYangDiedit, setIdYangDiedit] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    namaLengkap: '',
    username: '',
    role: 'Admin'
  });

  // State untuk menyimpan status asli saat diedit
  const [statusAsli, setStatusAsli] = useState<'Active' | 'In active'>('Active');

  // 3. STATE MODAL HAPUS
  const [itemYangDihapus, setItemYangDihapus] = useState<UserData | null>(null);
  const [alasanHapus, setAlasanHapus] = useState('');

  // 4. STATE LAST UPDATE
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    perbaruiWaktu();
  }, []);

  const perbaruiWaktu = () => {
    const now = new Date();
    const jam = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastUpdate(jam + ' WIB');
  };

  // --- FUNGSI HANDLE FORM ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKlikTambah = () => {
    setIdYangDiedit(null);
    setFormData({ namaLengkap: '', username: '', role: 'Admin' });
    setStatusAsli('Active'); // Default untuk user baru
    setIsModalOpen(true);
  };

  const handleKlikEdit = (user: UserData) => {
    setIdYangDiedit(user.id);
    setFormData({
      namaLengkap: user.namaLengkap,
      username: user.username,
      role: user.role
    });
    setStatusAsli(user.status); // Simpan status lama agar tidak berubah
    setIsModalOpen(true);
  };

  const handleKlikHapus = (user: UserData) => {
    setItemYangDihapus(user);
    setAlasanHapus('');
  };

  const handleSimpanUser = () => {
    if (!formData.namaLengkap || !formData.username) {
      alert("Nama Lengkap dan Username wajib diisi!");
      return;
    }

    if (idYangDiedit !== null) {
      // EDIT
      const dataTerbaru = dataUser.map((item) => {
        if (item.id === idYangDiedit) {
          return {
            ...item,
            namaLengkap: formData.namaLengkap,
            username: formData.username,
            role: formData.role,
            status: statusAsli, // Pertahankan status aslinya
          };
        }
        return item;
      });
      setDataUser(dataTerbaru);
    } else {
      // TAMBAH BARU
      const userBaru: UserData = {
        id: Date.now(), 
        namaLengkap: formData.namaLengkap,
        username: formData.username,
        role: formData.role,
        status: 'Active',
        lastLoginDate: '-',
        lastLoginTime: 'Baru dibuat'
      };
      setDataUser([...dataUser, userBaru]);
    }

    setIsModalOpen(false);
    perbaruiWaktu();
  };

  const eksekusiHapus = () => {
    if (itemYangDihapus !== null) {
      const dataTerbaru = dataUser.filter((u) => u.id !== itemYangDihapus.id);
      setDataUser(dataTerbaru);
      setItemYangDihapus(null);
      perbaruiWaktu();
    }
  };

  return (
    <div className="space-y-4 relative">
      
      {/* Header Konten dengan Judul & Last Update */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[32px] font-bold text-[#EAE1D8] whitespace-nowrap leading-none">User Management</h1>
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
            Tambah User
          </span>
        </Button>
      </div>

      {/* CONTAINER 1: Filter & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-end p-4 rounded-[10px] border border-[#B5884D]/50 bg-transparent w-full gap-4">
        
        {/* Kumpulan Dropdown Kiri */}
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#B5884D] tracking-wide">Role</label>
            <div className="relative w-full sm:w-[200px]">
              <select className="w-full appearance-none px-4 py-2 pr-10 text-sm bg-[#231F1A] border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer">
                <option>Semua Role</option>
                <option>Admin</option>
                <option>Teknisi</option>
                <option>Operator</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8L0.669873 0.5L9.33013 0.5L5 8Z" fill="#B5884D"/></svg>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#B5884D] tracking-wide">Status</label>
            <div className="relative w-full sm:w-[200px]">
              <select className="w-full appearance-none px-4 py-2 pr-10 text-sm bg-[#231F1A] border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer">
                <option>Semua Status</option>
                <option>Active</option>
                <option>In active</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8L0.669873 0.5L9.33013 0.5L5 8Z" fill="#B5884D"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Kotak Pencarian Kanan */}
        <div className="relative w-full sm:w-[320px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input type="text" placeholder="Cari Nama, Role.." className="w-full pl-10 pr-4 py-2 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:border-[#B5884D]" />
        </div>
      </div>

      {/* CONTAINER 2: Tabel Dinamis */}
      <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent w-full flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-[#EAE1D8]">
            <thead className="text-[11px] uppercase bg-[#231F1A] border-b border-[#B5884D]/30">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">NAMA LENGKAP</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">USERNAME</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">ROLE</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">STATUS</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">LAST LOGIN</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center whitespace-nowrap">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {dataUser.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Belum ada data user.</td></tr>
              ) : (
                dataUser.map((u, index) => (
                  <tr key={u.id} className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326] transition-colors border-b border-[#B5884D]/10`}>
                    <td className="px-6 py-4 text-center whitespace-nowrap font-medium text-[#B5884D]">{u.namaLengkap}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-300">{u.username}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-300">{u.role}</td>
                    
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-300">
                      {u.status}
                    </td>

                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center justify-center text-[12px] text-gray-400 leading-snug">
                        <span>{u.lastLoginDate}</span>
                        <span>{u.lastLoginTime}</span>
                      </div>
                    </td>

                    {/* TOMBOL AKSI TEKS */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center space-x-4">
                        <button onClick={() => handleKlikEdit(u)} className="text-[#B5884D] hover:text-white transition-colors">Edit</button>
                        <button onClick={() => handleKlikHapus(u)} className="text-[#FF5656] hover:text-white transition-colors">Hapus</button>
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
          <span className="text-sm text-gray-400">Menampilkan 1-3 dari 3 User</span>
          <div className="inline-flex items-center space-x-2">
            <button className="px-3 py-1 text-sm text-gray-400 border border-[#B5884D]/50 rounded-[4px] hover:text-white hover:border-[#B5884D] transition-colors bg-transparent">Sebelumnya</button>
            <button className="w-8 h-8 flex items-center justify-center text-sm text-[#17130E] bg-[#B5884D] rounded-[4px] font-bold">1</button>
            <button className="px-3 py-1 text-sm text-[#EAE1D8] border border-[#B5884D]/50 rounded-[4px] hover:bg-[#B5884D]/20 transition-colors bg-transparent">Berikutnya</button>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL POPUP FORM (Tambah & Edit User)     */}
      {/* ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1C1814] border-2 border-[#B5884D] w-full max-w-[480px] rounded-[16px] shadow-2xl relative px-[32px] pt-[32px] pb-[32px] animate-in fade-in zoom-in duration-200">
            
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-[#B5884D] hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <h2 className="text-[26px] font-bold text-[#B5884D] mb-8 tracking-wide">
              {idYangDiedit ? 'Edit User' : 'Tambah User'}
            </h2>

            <div className="space-y-5">
              
              {/* Nama Lengkap - Lebar Penuh */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#EAE1D8] tracking-wide">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="namaLengkap" 
                  value={formData.namaLengkap} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 text-sm bg-black border border-[#B5884D]/60 rounded-[8px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" 
                />
              </div>

              {/* Username dan Role Sejajar */}
              <div className="flex gap-4">
                {/* Username (Lebih Lebar) */}
                <div className="w-2/3 space-y-2">
                  <label className="text-sm font-medium text-[#EAE1D8] tracking-wide">Username</label>
                  <input 
                    type="text" 
                    name="username" 
                    value={formData.username} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 text-sm bg-black border border-[#B5884D]/60 rounded-[8px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]" 
                  />
                </div>

                {/* Role (Lebih Kecil) */}
                <div className="w-1/3 space-y-2">
                  <label className="text-sm font-medium text-[#EAE1D8] tracking-wide">Role</label>
                  <div className="relative">
                    <select 
                      name="role" 
                      value={formData.role} 
                      onChange={handleInputChange} 
                      className="w-full appearance-none px-4 py-3 text-sm bg-black border border-[#B5884D]/60 rounded-[8px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D] cursor-pointer"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Teknisi">Teknisi</option>
                      <option value="Operator">Operator</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#B5884D]">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8L0.669873 0.5L9.33013 0.5L5 8Z" fill="#B5884D"/></svg>
                    </div>
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
                onClick={handleSimpanUser} 
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
              <h2 className="text-[24px] font-bold text-[#B5884D]">Hapus User</h2>
            </div>

            <p className="text-[15px] text-[#EAE1D8] mb-6 leading-relaxed">
              Apakah Anda yakin ingin Menghapus User <span className="text-[#B5884D] font-bold">{itemYangDihapus.namaLengkap} ({itemYangDihapus.role})</span>? Aksi ini akan menghapus akses login user tersebut secara permanen.
            </p>

            <div className="space-y-2 mb-8">
              <label className="text-sm font-medium text-gray-400">Alasan Penghapusan</label>
              <input 
                type="text" 
                value={alasanHapus}
                onChange={(e) => setAlasanHapus(e.target.value)}
                placeholder="Misal: Sudah resign..."
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