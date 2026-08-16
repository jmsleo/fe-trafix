'use client';

import React, { useState } from 'react';

// Struktur Data Histori Backup
interface BackupHistory {
  id: number;
  timestamp: string;
  fileName: string;
  size: string;
  status: 'Selesai' | 'Gagal';
}

export default function BackupDatabasePage() {
  // Data Tabel Histori (Persis seperti di desain)
  const [dataBackup] = useState<BackupHistory[]>([
    { id: 1, timestamp: '01/08/26 14:03:05', fileName: 'fixp_db_prod_20260801_0200.sql.gz', size: '41.2 GB', status: 'Selesai' },
    { id: 2, timestamp: '01/08/26 14:03:05', fileName: 'fixp_db_prod_20260801_0200.sql.gz', size: '41.2 GB', status: 'Selesai' },
    { id: 3, timestamp: '01/08/26 14:03:05', fileName: 'fixp_db_prod_20260801_0200.sql.gz', size: '-', status: 'Gagal' },
  ]);

  return (
    <div className="space-y-6 relative">
      
      {/* Header Judul */}
      <div>
        <h1 className="text-[32px] font-bold text-[#EAE1D8] whitespace-nowrap leading-none tracking-wide">
          Backup Database
        </h1>
      </div>

      {/* --- GRID ATAS: ACTIVE OPERATION & SYSTEM HEALTH --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CARD KIRI: ACTIVE OPERATION (Makan 2 kolom) */}
        <div className="lg:col-span-2 bg-[#231F1A]/80 border border-[#B5884D]/30 rounded-[12px] p-6 flex flex-col justify-between relative overflow-hidden">
          {/* Header Card Kiri */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
              </svg>
              <h2 className="text-[22px] font-bold text-[#EAE1D8] tracking-wide">Active Operation</h2>
            </div>
            
            {/* Badge IN PROGRESS */}
            <div className="border border-[#B5884D] text-[#B5884D] text-[11px] font-bold px-3 py-1 rounded-full tracking-wider bg-[#B5884D]/10">
              IN PROGRESS
            </div>
          </div>

          {/* Bagian Progress Bar */}
          <div className="space-y-2 mb-8">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-[#EAE1D8]">FixParking_DB_Production_v4</span>
              <span className="text-[#EAE1D8]">67%</span>
            </div>
            
            {/* Track Bar (Latar) */}
            <div className="w-full h-[10px] bg-black/60 rounded-full overflow-hidden">
              {/* Progress Isi Emas */}
              <div className="h-full bg-[#B5884D] w-[67%] rounded-full shadow-[0_0_10px_rgba(181,136,77,0.8)]"></div>
            </div>
            
            <div className="text-right text-[11px] text-[#B5884D] mt-1">
              Perkiraan waktu tersisa: 5m 12s
            </div>
          </div>

          {/* Footer Card Kiri: Target, Size, & Tombol */}
          <div className="flex justify-between items-end">
            <div className="flex gap-12">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#B5884D] font-bold mb-1 tracking-wider uppercase">TARGET</span>
                <span className="text-sm font-medium text-[#EAE1D8]">AWS S3 (US-East-1)</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#B5884D] font-bold mb-1 tracking-wider uppercase">Est. Ukuran</span>
                <span className="text-sm font-medium text-[#EAE1D8]">42.7 GB</span>
              </div>
            </div>

            <button className="bg-[#B5884D] hover:bg-[#c99a5a] text-[#1A1612] font-bold py-2.5 px-6 rounded-[8px] text-sm flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(181,136,77,0.3)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                <path d="M12 12v3"></path>
                <path d="m9 15 3 3 3-3"></path>
              </svg>
              Start Backup Proses
            </button>
          </div>
        </div>

        {/* CARD KANAN: SYSTEM HEALTH (Makan 1 kolom) */}
        <div className="lg:col-span-1 bg-[#231F1A]/80 border border-[#B5884D]/30 rounded-[12px] p-6 flex flex-col">
          <h2 className="text-[22px] font-bold text-[#EAE1D8] tracking-wide mb-6">System Health</h2>
          
          <div className="flex flex-col gap-6 flex-grow justify-center">
            
            {/* Storage Capacity */}
            <div className="flex items-center justify-between border-b border-[#B5884D]/20 pb-4">
              <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EAE1D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
                <span className="text-sm font-medium text-[#EAE1D8]">Storage Capacity</span>
              </div>
              <span className="text-sm font-bold text-[#EAE1D8]">67%</span>
            </div>

            {/* Last Successful */}
            <div className="flex items-center justify-between border-b border-[#B5884D]/20 pb-4">
              <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EAE1D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span className="text-sm font-medium text-[#EAE1D8]">Last Successful</span>
              </div>
              <div className="text-right">
                <span className="block text-sm font-bold text-[#EAE1D8]">Today,</span>
                <span className="block text-[12px] text-gray-400">02:00 AM</span>
              </div>
            </div>

            {/* Encryption */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EAE1D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span className="text-sm font-medium text-[#EAE1D8]">Encryption</span>
              </div>
              <span className="text-sm font-bold text-[#79FF8D]">AES-256</span>
            </div>

          </div>
        </div>
      </div>

      {/* --- TABEL BAWAH: HISTORI BACKUP --- */}
      <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent w-full flex flex-col mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-[#EAE1D8]">
            <thead className="text-[11px] uppercase bg-transparent border-b border-[#B5884D]/30">
              <tr>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-gray-400">TIMESTAMP</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-gray-400">FILE NAME</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-gray-400">SIZE</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-gray-400">STATUS</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-gray-400">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {dataBackup.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 bg-transparent">Belum ada histori backup.</td></tr>
              ) : (
                dataBackup.map((item, index) => (
                  <tr key={item.id} className={`hover:bg-[#3d3326]/30 transition-colors border-b border-[#B5884D]/30`}>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-400">{item.timestamp}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-400">{item.fileName}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-400">{item.size}</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center justify-center mx-auto px-4 h-[24px] rounded-full border text-[11px] font-bold tracking-wide w-fit
                        ${item.status === 'Selesai' ? 'border-[#79FF8D] bg-transparent text-[#79FF8D]' : 
                          'border-[#FF8080] bg-[#FF000059] text-[#FF8080]'}`}>
                        {item.status}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center items-center">
                        <button className="text-[#B5884D] hover:text-[#EAE1D8] transition-colors p-2 rounded-md hover:bg-[#B5884D]/10">
                          {item.status === 'Selesai' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" y1="13" x2="8" y2="13"></line>
                              <line x1="16" y1="17" x2="8" y2="17"></line>
                              <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-transparent border-t border-[#B5884D]/30 gap-4 mt-auto">
          <span className="text-sm text-gray-400">Menampilkan 1-3 dari 3 Backup History</span>
          <div className="inline-flex items-center space-x-2">
            <button className="px-3 py-1 text-sm text-gray-400 border border-[#B5884D]/50 rounded-[4px] hover:text-white hover:border-[#B5884D] transition-colors bg-transparent">Sebelumnya</button>
            <button className="w-8 h-8 flex items-center justify-center text-sm text-[#17130E] bg-[#B5884D] rounded-[4px] font-bold">1</button>
            <button className="px-3 py-1 text-sm text-[#EAE1D8] border border-[#B5884D]/50 rounded-[4px] hover:bg-[#B5884D]/20 transition-colors bg-transparent">Berikutnya</button>
          </div>
        </div>
      </div>

    </div>
  );
}