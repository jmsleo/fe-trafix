'use client';

import React, { useState } from 'react';

export default function TiketGantungPage() {
  // State untuk menyimpan data tiket yang sedang diklik (untuk pop-up rincian)
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // Class bawaan untuk card dengan efek radial gradient (Hitam di tengah, coklat di pinggir)
  const radialCardClass = "bg-[radial-gradient(ellipse_at_center,_#110C08_0%,_rgba(191,143,81,0.18)_100%)] border border-[#BF8F51] rounded-[15px] p-5 flex flex-col hover:border-[#BF8F51] transition-colors";

  // Data statis untuk tabel Tiket Gantung
  const tableData = [
    { id: 'FIX - 001', plat: 'H 2320 PI', gate: 'GATE - 002', waktu: '28 Juli 2026\n18:07:05', status: 'OVERDUE' },
    { id: 'FIX - 002', plat: 'H 2320 PI', gate: 'GATE - 002', waktu: '28 Juli 2026\n18:07:05', status: 'OVERDUE' },
    { id: 'FIX - 003', plat: 'H 2320 PI', gate: 'GATE - 002', waktu: '28 Juli 2026\n18:07:05', status: 'OVERDUE' },
    { id: 'FIX - 004', plat: 'H 2320 PI', gate: 'GATE - 002', waktu: '28 Juli 2026\n18:07:05', status: 'PENDING' },
    { id: 'FIX - 005', plat: 'H 2320 PI', gate: 'GATE - 002', waktu: '28 Juli 2026\n18:07:05', status: 'PENDING' },
  ];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6 pb-10 relative">
      
      {/* HEADER HALAMAN */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#EAE1D8]">Tiket Gantung</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#BF8F51] rounded-[7px] text-[#BF8F51] text-sm font-medium hover:bg-[#BF8F51]/10 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#BF8F51] rounded-[7px] text-[#BF8F51] text-sm font-medium hover:bg-[#BF8F51]/10 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>
            Export EXCEL
          </button>
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className="border border-[#BF8F51]/40 rounded-[10px] p-4 flex items-end gap-4 w-full">
        {/* Jangka Waktu */}
        <div className="flex-1 max-w-[280px]">
          <label className="block text-[#BF8F51] text-[11px] font-semibold mb-2 uppercase">Jangka Waktu</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input type="text" className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] pl-3 pr-8 py-2 text-sm outline-none focus:border-[#BF8F51]" />
              <svg className="absolute right-2.5 top-2.5 text-[#BF8F51]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <span className="text-[#BF8F51] font-bold">-</span>
            <div className="relative flex-1">
              <input type="text" className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] pl-3 pr-8 py-2 text-sm outline-none focus:border-[#BF8F51]" />
              <svg className="absolute right-2.5 top-2.5 text-[#BF8F51]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
          </div>
        </div>

        {/* Dropdown Kendaraan */}
        <div className="w-[150px]">
          <label className="block text-[#BF8F51] text-[11px] font-semibold mb-2 uppercase">KENDARAAN</label>
          <div className="relative">
            <select className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] pl-3 pr-8 py-2 text-sm appearance-none outline-none focus:border-[#BF8F51]">
              <option className="bg-[#14110E]">Semua Tipe</option>
            </select>
            <svg className="absolute right-3 top-[11px] text-[#BF8F51] pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>

        {/* Reset Filter */}
        <div>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#BF8F51] rounded-[7px] text-[#BF8F51] text-sm font-medium hover:bg-[#BF8F51]/10 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Reset Filter
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative ml-auto w-[240px]">
          <svg className="absolute left-3 top-2.5 text-[#BF8F51]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Cari Kode, Plat..." 
            className="w-full bg-transparent border border-[#BF8F51] rounded-[7px] pl-9 pr-3 py-2 text-sm text-[#EAE1D8] placeholder-gray-500 outline-none focus:border-[#BF8F51] transition-colors"
          />
        </div>
      </div>

      {/* 4 STAT CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <div className={`${radialCardClass} h-[130px]`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Total Pending</p>
          <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2">28 <br/><span className="text-[12px] font-medium tracking-widest text-[#BF8F51]">KENDARAAN</span></h3>
        </div>
        <div className={`${radialCardClass} h-[130px]`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Terlama</p>
          <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2">03 : 25 : 35</h3>
        </div>
        <div className={`${radialCardClass} h-[130px]`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Gate Terbanyak</p>
          <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2">GATE 2</h3>
        </div>
        {/* Special Red Card for Alert */}
        <div className="bg-[#FF0000]/10 border border-[#FF4343] rounded-[15px] p-5 flex flex-col justify-center h-[130px]">
          <p className="text-[#FF4343] text-[10px] font-bold uppercase tracking-wider mb-1">STATUS</p>
          <h3 className="text-[#FF4343] text-[18px] font-bold mb-1">Peringatan Tinggi</h3>
          <p className="text-[#EAE1D8] text-[11px] leading-snug">Jumlah pending tiket melampaui ambang batas. Audit segera diperlukan.</p>
        </div>
      </div>

      {/* MIDDLE SECTION (Grafik & Peringatan) */}
      <div className="grid grid-cols-[1fr_300px] gap-6">
        
        {/* AREA CHART */}
        <div className={`${radialCardClass} min-h-[260px] relative`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-[#BF8F51] font-semibold text-[15px]">Grafik Kendaraan Masuk/Keluar</h4>
              <p className="text-[10px] text-[#BF8F51]/60 mt-0.5">↑ 12,5% dari periode sebelumnya</p>
            </div>
            <div className="flex gap-2">
              <select className="bg-transparent border border-[#BF8F51]/50 text-[10px] text-[#BF8F51] rounded px-3 py-1 outline-none">
                <option className="bg-[#14110E]">Semua Gate</option>
              </select>
              <select className="bg-transparent border border-[#BF8F51]/50 text-[10px] text-[#BF8F51] rounded px-3 py-1 outline-none">
                <option className="bg-[#14110E]">Mingguan</option>
              </select>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col relative mt-2 text-[10px] text-[#BF8F51]">
            <div className="absolute inset-0 flex flex-col justify-between pb-8 z-0">
              {['100', '80', '60', '40', '20'].map((val, i) => (
                <div key={i} className="flex items-center w-full">
                  <span className="w-8 text-left">{val}</span>
                  <div className="flex-1 border-b border-[#BF8F51]/20 ml-2"></div>
                </div>
              ))}
            </div>
            
            {/* SVG Area Chart */}
            <div className="absolute inset-0 pl-10 pb-8 z-10">
              <svg className="w-full h-full" viewBox="0 0 600 130" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradientAreaTicket" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#BF8F51" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#BF8F51" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0 120 C 80 110, 120 120, 200 90 C 280 60, 320 100, 400 115 C 480 130, 520 60, 600 90" fill="none" stroke="#5C4328" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M0 130 C 80 130, 120 80, 200 90 C 280 100, 350 20, 400 20 C 450 20, 500 120, 600 120 L 600 130 L 0 130 Z" fill="url(#gradientAreaTicket)" />
                <path d="M0 130 C 80 130, 120 80, 200 90 C 280 100, 350 20, 400 20 C 450 20, 500 120, 600 120" fill="none" stroke="#BF8F51" strokeWidth="2.5" />
              </svg>
            </div>

            <div className="absolute bottom-4 left-10 right-0 flex justify-around z-20 px-1 text-[#EAE1D8]">
              {['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'].map((day, i) => (
                <span key={i}>{day}</span>
              ))}
            </div>
            <div className="absolute bottom-0 left-10 right-0 flex gap-6 z-20 px-1 text-[10px] text-gray-400">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#BF8F51] rounded-sm"></div> Periode saat ini</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#5C4328] rounded-sm"></div> Periode sebelumnya</span>
            </div>
          </div>
        </div>

        {/* PERINGATAN OPERASIONAL */}
        <div className={`${radialCardClass} h-full`}>
          <h4 className="text-[#BF8F51] font-bold text-[16px] mb-4">Peringatan Operasional</h4>
          <div className="flex flex-col gap-3 flex-1">
            
            {/* Alert Merah */}
            <div className="flex items-center gap-3 bg-[#FF0000]/10 border border-[#FF4343] rounded-[8px] p-3">
              <svg className="text-[#FF4343] shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <p className="text-[#EAE1D8] text-[12px] font-medium leading-tight">Pending melebihi batas :<br/>28 tiket</p>
            </div>
            
            {/* Alert Kuning */}
            <div className="flex items-center gap-3 bg-[#FFBC2C]/10 border border-[#FFBC2C] rounded-[8px] p-3">
              <svg className="text-[#FFBC2C] shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <p className="text-[#EAE1D8] text-[12px] font-medium leading-tight">GATE 2 memiliki pending<br/>terbanyak : 12 tiket</p>
            </div>

            {/* Alert Abu-abu (Ikon Jam) */}
            <div className="flex items-center gap-3 bg-[#B5B5B5]/10 border border-[#B5B5B5] rounded-[8px] p-3">
              <svg className="text-[#B5B5B5] shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <p className="text-[#EAE1D8] text-[12px] font-medium leading-tight">Pending terlama<br/>3j 25m</p>
            </div>

          </div>
        </div>

      </div>

      {/* TABEL DATA DETAIL TIKET GANTUNG */}
      <div className="border border-[#BF8F51] rounded-[15px] bg-[#14110E] overflow-hidden flex flex-col w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-center whitespace-nowrap">
            <thead className="border-b border-[#BF8F51] text-[#EAE1D8] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5 font-semibold">KODE TRANSAKSI</th>
                <th className="px-6 py-5 font-semibold">PLAT NOMOR</th>
                <th className="px-6 py-5 font-semibold">GATE</th>
                <th className="px-6 py-5 font-semibold">WAKTU MASUK</th>
                <th className="px-6 py-5 font-semibold text-center">STATUS</th>
                <th className="px-6 py-5 font-semibold">AKSI</th>
              </tr>
            </thead>
            <tbody className="text-[#EAE1D8] text-[14px]">
              {tableData.map((row, index) => (
                <tr key={index} className={`hover:bg-[#BF8F51]/10 transition-colors ${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-transparent'}`}>
                  {/* Tambahan onClick pada ID (KODE TRANSAKSI) untuk memunculkan modal */}
                  <td 
                    className="px-6 py-4 font-semibold text-[#BF8F51] cursor-pointer hover:underline"
                    onClick={() => setSelectedTicket(row)}
                  >
                    {row.id}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{row.plat}</td>
                  <td className="px-6 py-4">{row.gate}</td>
                  <td className="px-6 py-4 text-[13px] text-gray-300">
                    {row.waktu.split('\n').map((txt: string, i: number) => <div key={i}>{txt}</div>)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-[92px] h-[22px] text-[11px] font-bold rounded-[9px] border ${
                      row.status === 'OVERDUE' 
                        ? 'border-[#FF7E7E] text-[#FF7E7E] bg-[#FF0000]/[0.35]' 
                        : 'border-[#FFD94E] text-[#FFD94E] bg-[#FFBC2C]/[0.24]'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {/* Tambahan onClick juga pada tombol DETAIL */}
                    <button 
                      onClick={() => setSelectedTicket(row)}
                      className="text-[#BF8F51] font-bold text-[12px] hover:underline uppercase"
                    >
                      DETAIL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#BF8F51] text-sm">
          <p className="text-gray-400 text-[13px]">Menampilkan 1 - 5 dari 10 Transaksi</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-[#BF8F51] border border-[#BF8F51] rounded hover:bg-[#BF8F51]/10 transition-colors">Sebelumnya</button>
            <button className="px-3 py-1 text-black font-semibold bg-[#BF8F51] border border-[#BF8F51] rounded">1</button>
            <button className="px-3 py-1 text-[#EAE1D8] border border-[#BF8F51] rounded hover:bg-[#EAE1D8]/10 transition-colors">2</button>
            <button className="px-3 py-1 text-[#EAE1D8] border border-[#BF8F51] rounded hover:bg-[#EAE1D8]/10 transition-colors">Berikutnya</button>
          </div>
        </div>
      </div>

      {/* MODAL POP-UP RINCIAN PENDING */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          
          <div className="w-[714px] h-[816px] bg-[#17130E] border-[3px] border-[#BF8F51] rounded-[15px] p-10 flex flex-col relative shadow-2xl">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[28px] font-bold text-[#BF8F51]">
                Rincian Pending <span className="text-[#EAE1D8] font-medium text-[24px] ml-2">#{selectedTicket.id.replace(' - ', '-')}</span>
              </h3>
              <button 
                onClick={() => setSelectedTicket(null)} 
                className="text-[#BF8F51] hover:text-[#EAE1D8] transition-colors"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Top Section (Kamera & Info Kendaraan) */}
            <div className="grid grid-cols-2 gap-6 mb-6 h-[240px]">
              
              {/* LPR Masuk */}
              <div className="flex flex-col">
                <span className="text-[#BF8F51] mb-3 font-semibold text-[15px]">LPR Pintu masuk</span>
                <div className="flex-1 border border-[#BF8F51]/60 rounded-[12px] flex items-center justify-center bg-[#17130E] relative overflow-hidden">
                   <div className="absolute top-[20%] w-[80%] h-[1px] bg-black/50"></div>
                   <div className="text-center text-[#BF8F51]">
                     <p className="font-bold text-lg">LPR</p>
                     <p className="font-medium">Preview</p>
                   </div>
                </div>
              </div>
              
              {/* Info Plat Box (Sejajar dengan box LPR, label margin atas 34px) */}
              <div className="mt-[34px] flex-1 border border-[#BF8F51]/60 rounded-[12px] p-6 flex flex-col justify-center gap-4">
                <div>
                  <p className="text-[#BF8F51] text-[13px] font-semibold mb-1">No. Plat</p>
                  <p className="text-[#EAE1D8] text-[16px] font-bold">{selectedTicket.plat}</p>
                </div>
                <div>
                  <p className="text-[#BF8F51] text-[13px] font-semibold mb-1">Jenis Kendaraan</p>
                  <p className="text-[#EAE1D8] text-[16px] font-bold">Motor</p>
                </div>
                <div>
                  <p className="text-[#BF8F51] text-[13px] font-semibold mb-1">Gate masuk</p>
                  <p className="text-[#EAE1D8] text-[16px] font-bold">Masuk A</p>
                </div>
              </div>

            </div>

            {/* Middle Section (Durasi, Total, dll) */}
            <div className="border border-[#BF8F51]/60 rounded-[12px] p-6 flex justify-between items-center mb-6">
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[14px] font-semibold mb-2">Durasi</p>
                <p className="text-[#EAE1D8] text-[16px] font-bold">02 : 15 : 20</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[14px] font-semibold mb-2">Pembayaran</p>
                <p className="text-[#EAE1D8] text-[16px] font-bold">QRIS</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[14px] font-semibold mb-2">Total</p>
                <p className="text-[#EAE1D8] text-[16px] font-bold">Rp 10.000</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[14px] font-semibold mb-2">Staff (shift)</p>
                <p className="text-[#EAE1D8] text-[16px] font-bold">Yerky (Pagi)</p>
              </div>
            </div>

            {/* Bottom Section (Timeline) */}
            <div className="border border-[#BF8F51]/60 rounded-[12px] p-6 flex-1 flex flex-col">
              <h4 className="text-[#BF8F51] text-[18px] font-bold mb-4">Timeline</h4>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#EAE1D8] font-medium">- Kendaraan masuk</span>
                  <span className="text-[#EAE1D8]">08:15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#EAE1D8] font-medium">- Tiket diterbitkan</span>
                  <span className="text-[#EAE1D8]">08:16</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[#EAE1D8] font-medium">- Belum keluar</span>
                  <span className="text-[#EAE1D8]">Saat ini</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}