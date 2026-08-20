'use client';

import React, { useState } from 'react';

export default function KinerjaOperatorPage() {
  // State untuk mengontrol muncul/hilangnya pop-up Filter
  const [showFilter, setShowFilter] = useState(false);

  // Class bawaan untuk card dengan efek radial gradient (Hitam di tengah, coklat di pinggir)
  const radialCardClass = "bg-[radial-gradient(ellipse_at_center,_#110C08_0%,_rgba(191,143,81,0.18)_100%)] border border-[#BF8F51] rounded-[15px] p-5 flex flex-col hover:border-[#BF8F51] transition-colors";

  // Data statis untuk tabel Kinerja Operator
  const tableData = [
    { no: '1.', nama: 'Yerky', transaksi: '4.250', pendapatan: 'Rp 2.300.000', rataPelayanan: '02:10' },
    { no: '2.', nama: 'Yerki', transaksi: '3.850', pendapatan: 'Rp 2.100.000', rataPelayanan: '02:10' },
    { no: '3.', nama: 'Syabana', transaksi: '3.620', pendapatan: 'Rp 1.900.000', rataPelayanan: '02:10' },
    { no: '4.', nama: 'Syaban', transaksi: '1.760', pendapatan: 'Rp 850.000', rataPelayanan: '02:10' },
    { no: '5.', nama: 'Erky', transaksi: '1.760', pendapatan: 'Rp 850.000', rataPelayanan: '02:10' },
  ];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6 pb-10 relative">
      
      {/* HEADER HALAMAN */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#EAE1D8]">Kinerja Operator</h2>
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

      {/* SEARCH BAR & FILTER BUTTON */}
      <div className="flex items-center gap-4 w-full border border-[#BF8F51]/40 rounded-[15px] p-4 bg-transparent">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BF8F51]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Cari Staff, Jenis..." 
            className="w-full bg-[#14110E] border border-[#BF8F51]/60 rounded-[10px] pl-12 pr-4 py-3 text-sm text-[#EAE1D8] placeholder-gray-500 outline-none focus:border-[#BF8F51] transition-colors"
          />
        </div>
        {/* Tombol Filter (tanpa border sendiri, karena sudah dibungkus border luar) */}
        <button 
          onClick={() => setShowFilter(true)}
          className="flex-shrink-0 px-2 text-[#BF8F51] hover:text-[#EAE1D8] transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
        </button>
      </div>

      {/* 4 STAT CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <div className={`${radialCardClass} h-[130px] justify-center`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Transaksi</p>
          <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2">15.240</h3>
        </div>
        <div className={`${radialCardClass} h-[130px] justify-center`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Pendapatan</p>
          <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2">Rp. 8 Jt</h3>
        </div>
        <div className={`${radialCardClass} h-[130px] justify-center`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Operator/Staff</p>
          <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2">Yerky</h3>
        </div>
        <div className={`${radialCardClass} h-[130px] justify-center`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Rata-rata Pelayanan</p>
          <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2">01 : 00</h3>
        </div>
      </div>

      {/* MIDDLE SECTION (Tabel Kiri & Box Kanan) */}
      <div className="grid grid-cols-[1fr_300px] gap-6">
        
        {/* KIRI: TABEL KINERJA OPERATOR */}
        <div className="border border-[#BF8F51] rounded-[15px] bg-[#14110E] overflow-hidden flex flex-col w-full h-full">
          <div className="overflow-x-auto">
            <table className="w-full text-center whitespace-nowrap">
              <thead className="border-b border-[#BF8F51] text-[#EAE1D8] text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-5 font-semibold">NO.</th>
                  <th className="px-6 py-5 font-semibold text-left">OPERATOR</th>
                  <th className="px-6 py-5 font-semibold">
                    <div className="flex items-center justify-center gap-1">
                      TRANSAKSI 
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 15l5 5 5-5"/><path d="M7 9l5-5 5 5"/></svg>
                    </div>
                  </th>
                  <th className="px-6 py-5 font-semibold">
                    <div className="flex items-center justify-center gap-1">
                      PENDAPATAN 
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 15l5 5 5-5"/><path d="M7 9l5-5 5 5"/></svg>
                    </div>
                  </th>
                  <th className="px-6 py-5 font-semibold">RATA- RATA<br/>PELAYANAN</th>
                  <th className="px-6 py-5 font-semibold">AKSI</th>
                </tr>
              </thead>
              <tbody className="text-[#EAE1D8] text-[14px]">
                {tableData.map((row, index) => (
                  <tr key={index} className={`hover:bg-[#BF8F51]/10 transition-colors ${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-transparent'}`}>
                    <td className="px-6 py-5">{row.no}</td>
                    <td className="px-6 py-5 text-left">{row.nama}</td>
                    <td className="px-6 py-5">{row.transaksi}</td>
                    <td className="px-6 py-5">{row.pendapatan}</td>
                    <td className="px-6 py-5">{row.rataPelayanan}</td>
                    <td className="px-6 py-5">
                      <button className="text-[#BF8F51] font-bold text-[12px] hover:underline uppercase">DETAIL</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#BF8F51] text-sm mt-auto">
            <p className="text-[#EAE1D8] text-[13px]">Menampilkan 1 - 5 dari 10 STAFF</p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-[#BF8F51] border border-[#BF8F51] rounded hover:bg-[#BF8F51]/10 transition-colors">Sebelumnya</button>
              <button className="px-3 py-1 text-black font-semibold bg-[#BF8F51] border border-[#BF8F51] rounded">1</button>
              <button className="px-3 py-1 text-[#EAE1D8] border border-[#BF8F51] rounded hover:bg-[#EAE1D8]/10 transition-colors">2</button>
              <button className="px-3 py-1 text-[#EAE1D8] border border-[#BF8F51] rounded hover:bg-[#EAE1D8]/10 transition-colors">Berikutnya</button>
            </div>
          </div>
        </div>

        {/* KANAN: PANELS (Metode Pembayaran & Transaksi Perlu Perhatian) */}
        <div className="flex flex-col gap-6">
          
          {/* Panel Metode Pembayaran */}
          <div className={`${radialCardClass} py-6 px-5`}>
            <h4 className="text-[#EAE1D8] font-bold text-[12px] uppercase tracking-wide mb-4">Metode Pembayaran</h4>
            <div className="flex flex-col gap-2.5 text-[13px]">
              <div className="flex justify-between items-center text-[#BF8F51]">
                <span>QRIS</span>
                <span className="font-medium">6.500</span>
              </div>
              <div className="flex justify-between items-center text-[#BF8F51]">
                <span>Tunai</span>
                <span className="font-medium">5.200</span>
              </div>
              <div className="flex justify-between items-center text-[#BF8F51]">
                <span>Member</span>
                <span className="font-medium">2.100</span>
              </div>
              <div className="flex justify-between items-center text-[#BF8F51]">
                <span>Manual</span>
                <span className="font-medium">900</span>
              </div>
              <div className="flex justify-between items-center text-[#BF8F51]">
                <span>Tiket Hilang</span>
                <span className="font-medium">540</span>
              </div>
            </div>
          </div>

          {/* Panel Transaksi Perlu Perhatian */}
          <div className={`${radialCardClass} flex-1 py-6 px-5 flex flex-col`}>
            <h4 className="text-[#EAE1D8] font-bold text-[12px] uppercase tracking-wide mb-5 leading-relaxed">Transaksi Perlu<br/>Perhatian</h4>
            
            {/* Box Inner Border untuk 125 & 80 */}
            <div className="border border-[#BF8F51]/60 rounded-[12px] py-4 grid grid-cols-2 gap-2 mb-6 text-center">
              <div>
                <h3 className="text-[#BF8F51] text-[24px] font-bold leading-none mb-1.5">125</h3>
                <p className="text-[#A7A6A5] text-[9px] font-bold uppercase tracking-wider">Input Manual</p>
              </div>
              <div>
                <h3 className="text-[#BF8F51] text-[24px] font-bold leading-none mb-1.5">80</h3>
                <p className="text-[#A7A6A5] text-[9px] font-bold uppercase tracking-wider">Tiket Hilang</p>
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-[#FF7E7E] text-[24px] font-bold leading-none mb-1.5">45</h3>
              <p className="text-[#EAE1D8] text-[9px] font-bold uppercase tracking-wider">Buka Gate Manual</p>
            </div>

            {/* Tombol dengan Background Gelap */}
            <button className="mt-auto bg-[#110C08] text-[#EAE1D8] font-bold text-[11px] uppercase tracking-wider hover:bg-[#BF8F51]/20 transition-colors text-center w-full py-2.5 rounded-[8px]">
              Detail Transaksi →
            </button>
          </div>

        </div>
      </div>

      {/* MODAL POP-UP FILTER (Berukuran persis 383 x 374 px) */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-[383px] h-[374px] bg-[#17130E] border-[2px] border-[#BF8F51] rounded-[15px] p-6 flex flex-col relative shadow-2xl">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[22px] font-bold text-[#BF8F51]">Filter</h3>
              <button 
                onClick={() => setShowFilter(false)} 
                className="text-[#BF8F51] hover:text-[#EAE1D8] transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex-1 flex flex-col gap-4">
              
              {/* Jangka Waktu */}
              <div>
                <label className="block text-[#BF8F51] text-[11px] font-semibold mb-2 uppercase">Jangka Waktu</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input type="text" className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] px-3 py-2 text-sm outline-none focus:border-[#BF8F51]" />
                    <svg className="absolute right-2.5 top-2.5 text-[#BF8F51]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                  <span className="text-[#BF8F51] font-bold">-</span>
                  <div className="relative flex-1">
                    <input type="text" className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] px-3 py-2 text-sm outline-none focus:border-[#BF8F51]" />
                    <svg className="absolute right-2.5 top-2.5 text-[#BF8F51]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                </div>
              </div>

              {/* Operator & Shift */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#BF8F51] text-[11px] font-semibold mb-2 uppercase">Operator</label>
                  <div className="relative">
                    <select className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] pl-3 pr-8 py-2 text-sm appearance-none outline-none focus:border-[#BF8F51]">
                      <option className="bg-[#14110E]">Semua Tipe</option>
                    </select>
                    <svg className="absolute right-3 top-[11px] text-[#BF8F51] pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
                <div>
                  <label className="block text-[#BF8F51] text-[11px] font-semibold mb-2 uppercase">Shift</label>
                  <div className="relative">
                    <select className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] pl-3 pr-8 py-2 text-sm appearance-none outline-none focus:border-[#BF8F51]">
                      <option className="bg-[#14110E]">Semua Tipe</option>
                    </select>
                    <svg className="absolute right-3 top-[11px] text-[#BF8F51] pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>

              {/* Gate */}
              <div className="w-1/2 pr-2">
                <label className="block text-[#BF8F51] text-[11px] font-semibold mb-2 uppercase">Gate</label>
                <div className="relative">
                  <select className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] pl-3 pr-8 py-2 text-sm appearance-none outline-none focus:border-[#BF8F51]">
                    <option className="bg-[#14110E]">Semua Tipe</option>
                  </select>
                  <svg className="absolute right-3 top-[11px] text-[#BF8F51] pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>

            </div>

            {/* Buttons Bawah */}
            <div className="flex justify-end gap-3 mt-4 pt-2">
              <button 
                onClick={() => setShowFilter(false)}
                className="px-5 py-2 rounded-[7px] border border-[#BF8F51] text-[#BF8F51] font-semibold text-sm hover:bg-[#BF8F51]/10 transition-colors"
              >
                Atur Ulang
              </button>
              <button 
                onClick={() => setShowFilter(false)}
                className="px-5 py-2 rounded-[7px] bg-[#BF8F51] text-[#14110E] font-bold text-sm hover:bg-[#906B3D] transition-colors"
              >
                Terapkan
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}