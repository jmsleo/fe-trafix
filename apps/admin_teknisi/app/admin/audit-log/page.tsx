'use client';

import React, { useState } from 'react';

// Struktur Data Audit Log
interface AuditLogData {
  id: number;
  tanggal: string;
  jam: string;
  namaUser: string;
  role: string;
  modul: string;
  aksi: 'UPDATE' | 'DELETE' | 'ADD' | 'LOGIN';
  deskripsi: string;
}

export default function AuditLogPage() {
  // 1. STATE TABEL
  const [dataLog] = useState<AuditLogData[]>([
    { id: 1, tanggal: '24 Oct 2023,', jam: '14:32:01', namaUser: 'Wendra Ardi Kusuma', role: 'Admin', modul: 'Tarif', aksi: 'UPDATE', deskripsi: 'Mengubah tarif dasar mobil dari Rp 5.000 jadi Rp 6.000.' },
    { id: 2, tanggal: '24 Oct 2023,', jam: '13:15:44', namaUser: "Fa'iq Damar Pratama", role: 'Teknisi', modul: 'Gate', aksi: 'DELETE', deskripsi: 'Menghapus konfigurasi perangkat keras untuk Gate Selatan-02 akibat kerusakan sensor.' },
    { id: 3, tanggal: '24 Oct 2023,', jam: '10:05:12', namaUser: 'Yerky Syabana', role: 'Teknisi', modul: 'Member', aksi: 'ADD', deskripsi: 'Mendaftarkan member VIP baru.' },
    { id: 4, tanggal: '24 Oct 2023,', jam: '10:05:12', namaUser: 'Yerky Syabana', role: 'Admin', modul: 'Shift', aksi: 'LOGIN', deskripsi: 'Inisialisasi pergantian shift pagi otomatis. Rekapitulasi transaksi shift malam berhasil disimpan.' },
    { id: 5, tanggal: '24 Oct 2023,', jam: '10:05:12', namaUser: 'Yerky Syabana', role: 'Admin', modul: 'Tarif', aksi: 'UPDATE', deskripsi: 'Mengubah tarif dasar mobil dari Rp 5.000 jadi Rp 6.000.' },
    { id: 6, tanggal: '24 Oct 2023,', jam: '10:05:12', namaUser: 'Yerky Syabana', role: 'Teknisi', modul: 'Gate', aksi: 'DELETE', deskripsi: 'Menghapus konfigurasi perangkat keras untuk Gate Selatan-02 akibat kerusakan sensor.' },
    { id: 7, tanggal: '24 Oct 2023,', jam: '10:05:12', namaUser: 'Yerky Syabana', role: 'Teknisi', modul: 'Member', aksi: 'ADD', deskripsi: 'Mendaftarkan member VIP baru.' },
  ]);

  // Fungsi warna Badge (Dikembalikan hanya output warnanya)
  const getBadgeColor = (aksi: string) => {
    switch (aksi) {
      case 'UPDATE':
      case 'LOGIN':
        return 'border-[#79FF8D] bg-[#00FF2620] text-[#79FF8D]';
      case 'DELETE':
        return 'border-[#FF5656] bg-[#FF565620] text-[#FF5656]';
      case 'ADD':
        return 'border-[#567DFF] bg-[#567DFF20] text-[#567DFF]';
      default:
        return 'border-gray-400 bg-gray-400/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Header Judul */}
      <div>
        <h1 className="text-[32px] font-bold text-[#EAE1D8] whitespace-nowrap leading-none tracking-wide">
          Audit Log System
        </h1>
      </div>

      {/* CONTAINER 1: Filter & Search Kompleks */}
      <div className="flex flex-col p-5 rounded-[10px] border border-[#B5884D]/50 bg-transparent w-full gap-5">
        
        {/* Baris Atas: Kumpulan Dropdown & Date Range */}
        <div className="flex flex-wrap items-end gap-5 w-full">
          
          {/* Filter TIME RANGE */}
          <div className="space-y-1.5 flex-grow lg:flex-grow-0">
            <label className="text-[12px] font-bold text-[#B5884D] tracking-wide uppercase">TIME RANGE</label>
            <div className="flex items-center gap-3">
              
              {/* Input Date 1 dengan Custom Gold Icon */}
              <div className="relative w-full sm:w-[150px]">
                {/* Input Asli (Ikon native disembunyikan pakai CSS opacity-0, tapi areanya di-full-kan) */}
                <input 
                  type="date" 
                  className="w-full appearance-none px-4 py-2.5 text-sm bg-transparent border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                {/* Ikon Kalender Emas Custom */}
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#B5884D]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
              </div>

              {/* Tulisan TO Putih */}
              <span className="text-[#B5884D] font-bold text-sm">TO</span>
              
              {/* Input Date 2 dengan Custom Gold Icon */}
              <div className="relative w-full sm:w-[150px]">
                <input 
                  type="date" 
                  className="w-full appearance-none px-4 py-2.5 text-sm bg-transparent border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#B5884D]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filter USER */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-[#B5884D] tracking-wide uppercase">USER</label>
            <div className="relative w-full sm:w-[140px]">
              <select className="w-full appearance-none px-4 py-2.5 pr-10 text-sm bg-transparent border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer">
                <option>Semua Tipe</option>
                <option>Admin</option>
                <option>Teknisi</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#B5884D]">▼</div>
            </div>
          </div>

          {/* Filter MODULES */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-[#B5884D] tracking-wide uppercase">MODULES</label>
            <div className="relative w-full sm:w-[140px]">
              <select className="w-full appearance-none px-4 py-2.5 pr-10 text-sm bg-transparent border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer">
                <option>Semua Tipe</option>
                <option>Tarif</option>
                <option>Gate</option>
                <option>Member</option>
                <option>Shift</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#B5884D]">▼</div>
            </div>
          </div>

          {/* Filter AKSI */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-[#B5884D] tracking-wide uppercase">AKSI</label>
            <div className="relative w-full sm:w-[140px]">
              <select className="w-full appearance-none px-4 py-2.5 pr-10 text-sm bg-transparent border border-[#B5884D]/50 rounded-[7px] text-[#B5884D] focus:outline-none focus:border-[#B5884D] cursor-pointer">
                <option>Semua Level</option>
                <option>UPDATE</option>
                <option>DELETE</option>
                <option>ADD</option>
                <option>LOGIN</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#B5884D]">▼</div>
            </div>
          </div>

        </div>

        {/* Baris Bawah: Kotak Pencarian Panjang */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input 
            type="text" 
            placeholder="Cari Nama, Deskripsi.." 
            className="w-full pl-12 pr-4 py-3 text-sm bg-black border border-[#B5884D]/50 rounded-[8px] text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:border-[#B5884D]" 
          />
        </div>
      </div>

      {/* CONTAINER 2: Tabel Dinamis Audit Log */}
      <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent w-full flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-[#EAE1D8]">
            <thead className="text-[11px] uppercase bg-[#231F1A] border-b border-[#B5884D]/30">
              <tr>
                <th className="px-6 py-5 font-medium tracking-wider text-left whitespace-nowrap text-gray-300">WAKTU AKTIVITAS</th>
                <th className="px-6 py-5 font-medium tracking-wider text-left whitespace-nowrap text-gray-300">NAMA USER</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-gray-300">ROLE</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-gray-300">MODUL</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-gray-300">AKSI</th>
                <th className="px-6 py-5 font-medium tracking-wider text-left whitespace-nowrap text-gray-300">DESKRIPSI</th>
              </tr>
            </thead>
            <tbody>
              {dataLog.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">Belum ada aktivitas log.</td></tr>
              ) : (
                dataLog.map((log, index) => (
                  <tr key={log.id} className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326]/50 transition-colors border-b border-[#B5884D]/10`}>
                    
                    {/* Waktu Aktivitas (Tanggal di atas, Jam di bawah) */}
                    <td className="px-6 py-4 text-left whitespace-nowrap">
                      <div className="flex flex-col text-[13px] text-gray-300 leading-snug">
                        <span>{log.tanggal}</span>
                        <span>{log.jam}</span>
                      </div>
                    </td>

                    {/* Nama User */}
                    <td className="px-6 py-4 text-left text-[#EAE1D8] font-medium max-w-[150px] truncate" title={log.namaUser}>
                      {log.namaUser}
                    </td>

                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-400">
                      {log.role}
                    </td>

                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-300">
                      {log.modul}
                    </td>
                    
                    {/* Badge Aksi (Dengan Lebar Tetap w-[85px] agar seragam) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center justify-center mx-auto w-[85px] h-[28px] rounded-full border text-[11px] font-bold tracking-wider ${getBadgeColor(log.aksi)}`}>
                        {log.aksi}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-left text-gray-400 min-w-[300px] max-w-[400px] leading-relaxed">
                      {log.deskripsi}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-transparent border-t border-[#B5884D]/30 gap-4 mt-auto">
          <span className="text-sm text-gray-400">Menampilkan 1-7 dari 15 Audit Log</span>
          <div className="inline-flex items-center space-x-2">
            <button className="px-3 py-1 text-sm text-[#B5884D] border border-[#B5884D]/50 rounded-[4px] hover:text-white hover:border-[#B5884D] transition-colors bg-transparent">Sebelumnya</button>
            <button className="w-8 h-8 flex items-center justify-center text-sm text-[#17130E] bg-[#B5884D] rounded-[4px] font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center text-sm text-gray-400 border border-[#B5884D]/50 rounded-[4px] hover:text-white transition-colors bg-transparent">2</button>
            <button className="px-3 py-1 text-sm text-[#EAE1D8] border border-[#B5884D]/50 rounded-[4px] hover:bg-[#B5884D]/20 transition-colors bg-transparent">Berikutnya</button>
          </div>
        </div>
      </div>

    </div>
  );
}