'use client';

import React from 'react';

export default function LaporanPendapatanPage() {
  // Class bawaan untuk card dengan Radial Gradient: Hitam di tengah (#110C08), memudar ke coklat di pinggir
  const radialCardClass = "bg-[radial-gradient(ellipse_at_center,_#110C08_0%,_rgba(191,143,81,0.18)_100%)] border border-[#BF8F51] rounded-[15px] p-5 flex flex-col hover:border-[#BF8F51] transition-colors";

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">
      
      {/* HEADER HALAMAN */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#EAE1D8]">Laporan Pendapatan</h2>
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
        <div className="flex-1 max-w-[320px]">
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

        {['SHIFT', 'GATE', 'PEMBAYARAN'].map((label, idx) => (
          <div key={idx} className="flex-1 max-w-[160px]">
            <label className="block text-[#BF8F51] text-[11px] font-semibold mb-2 uppercase">{label}</label>
            <div className="relative">
              <select className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] pl-3 pr-8 py-2 text-sm appearance-none outline-none focus:border-[#BF8F51]">
                <option className="bg-[#14110E]">Semua Tipe</option>
              </select>
              <svg className="absolute right-3 top-[11px] text-[#BF8F51] pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        ))}

        <div className="ml-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#BF8F51] rounded-[7px] text-[#BF8F51] text-sm font-medium hover:bg-[#BF8F51]/10 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Reset Filter
          </button>
        </div>
      </div>

      {/* STATISTIC CARDS (4 Kolom - Tinggi 160px) */}
      <div className="grid grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className={`${radialCardClass} h-[160px] justify-between`}>
          <p className="text-[#EAE1D8] text-[12px] font-semibold uppercase tracking-wide">Total Keseluruhan Pendapatan</p>
          <h3 className="text-[#BF8F51] text-[40px] font-bold leading-none mt-2">Rp 8 Jt</h3>
          <p className="text-[#79FF8D] text-[10px] mt-auto">↑ 12,5% dari periode sebelumnya</p>
        </div>
        {/* Card 2 */}
        <div className={`${radialCardClass} h-[160px] justify-between relative`}>
          <p className="text-[#EAE1D8] text-[12px] font-semibold uppercase tracking-wide">Total Transaksi</p>
          <h3 className="text-[#BF8F51] text-[40px] font-bold leading-none mt-2">15,240</h3>
          <p className="text-[#BF8F51] text-[12px] font-semibold mt-auto">Qty</p>
        </div>
        {/* Card 3 */}
        <div className={`${radialCardClass} h-[160px] justify-between`}>
          <p className="text-[#EAE1D8] text-[12px] font-semibold uppercase tracking-wide">Rata-Rata. Nilai Transaksi</p>
          <h3 className="text-[#BF8F51] text-[40px] font-bold leading-none mt-2">Rp 10,000</h3>
          <p className="text-[#F87171] text-[10px] mt-auto">↓ 12,5% dari periode sebelumnya</p>
        </div>
        {/* Card 4 */}
        <div className={`${radialCardClass} h-[160px] justify-between`}>
          <p className="text-[#EAE1D8] text-[12px] font-semibold uppercase tracking-wide">Metode Pembayaran Teratas</p>
          <h3 className="text-[#EAE1D8] text-[40px] font-bold leading-none mt-2">QRIS</h3>
          <div className="mt-auto flex items-center justify-between w-full">
            <div className="w-[60%] h-[4px] bg-gray-700 rounded-full overflow-hidden">
              <div className="w-[58%] h-full bg-[#BF8F51]"></div>
            </div>
            <span className="text-[#EAE1D8] text-[10px] font-medium">58% Kontribusi</span>
          </div>
        </div>
      </div>

        {/* CHARTS SECTION */}
         <div className="grid grid-cols-[1fr_240px] gap-4 min-h-[300px]">
        
        {/* Area Chart (Grafik Tren Pendapatan) */}
        <div className={`${radialCardClass} relative`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-[#BF8F51] font-semibold text-[15px]">Grafik tren pendapatan</h4>
              <p className="text-[12px] text-[#BF8F51]/60 mt-0.5">↑ 12,5% dari periode sebelumnya</p>
            </div>
            <select className="bg-transparent border border-[#BF8F51]/50 text-[12px] text-[#BF8F51] rounded px-3 py-1 outline-none">
              <option className="bg-[#14110E]">Mingguan</option>
            </select>
          </div>
          
          <div className="flex-1 flex flex-col relative mt-2 text-[12px] text-[#BF8F51]">
            {/* Y-Axis */}
            <div className="absolute inset-0 flex flex-col justify-between pb-8 z-0">
              {['10 jt', '8 jt', '6 jt', '4 jt', '2 jt'].map((val, i) => (
                <div key={i} className="flex items-center w-full">
                  <span className="w-8 text-left">{val}</span>
                  <div className="flex-1 border-b border-[#BF8F51]/20 ml-2"></div>
                </div>
              ))}
            </div>
            {/* SVG Area Chart */}
            <div className="absolute inset-0 pl-10 pb-8 z-10">
              <svg className="w-full h-full" viewBox="0 0 700 130" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradientArea2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#BF8F51" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#BF8F51" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {/* Bayangan belakang (Periode sebelumnya) */}
                <path d="M0 120 C 100 100, 150 110, 250 80 C 350 50, 400 90, 500 110 C 600 130, 650 50, 700 80" fill="none" stroke="#5C4328" strokeWidth="2" strokeDasharray="4 4" />
                {/* Area utama (Periode saat ini) */}
                <path d="M0 130 C 100 130, 150 70, 250 80 C 350 90, 450 10, 500 30 C 550 50, 600 120, 700 120 L 700 130 L 0 130 Z" fill="url(#gradientArea2)" />
                <path d="M0 130 C 100 130, 150 70, 250 80 C 350 90, 450 10, 500 30 C 550 50, 600 120, 700 120" fill="none" stroke="#BF8F51" strokeWidth="2.5" />
              </svg>
            </div>
            {/* X-Axis */}
            <div className="absolute bottom-4 left-10 right-0 flex justify-around z-20 px-1 text-[#EAE1D8]">
              {['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'].map((day, i) => (
                <span key={i}>{day}</span>
              ))}
            </div>
            {/* Legend Bawah */}
            <div className="absolute bottom-0 left-10 right-0 flex gap-6 z-20 px-1 text-[12px] text-gray-400">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#BF8F51] rounded-sm"></div> Periode saat ini</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#5C4328] rounded-sm"></div> Periode sebelumnya</span>
            </div>
          </div>
        </div>

        {/* Donut Chart (Grafik Pembayaran) */}
        <div className={`${radialCardClass}`}>
          <h4 className="text-[#BF8F51] font-semibold text-[15px] mb-4">Grafik Pembayaran</h4>
          <div className="flex-1 flex flex-col items-center justify-between">
            <div className="relative w-[110px] h-[110px] rounded-full bg-[conic-gradient(#4B5563_0%_58%,_#BF8F51_58%_84%,_#9CA3AF_84%_100%)] flex items-center justify-center shadow-lg mt-2">
              <div className="w-[80px] h-[80px] bg-[#17130E] rounded-full"></div>
            </div>
            
            <div className="w-full space-y-2 mt-4 text-[12px] font-medium text-[#BF8F51]">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-[#4B5563] rounded-sm"></div> QRIS</span>
                <span>8.840 (58%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-[#BF8F51] rounded-sm"></div> Tunai</span>
                <span>3.962 (26%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-[#9CA3AF] rounded-sm"></div> E-Wallet</span>
                <span>2.438 (16%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION (Tabel & Executive Insight) */}
      <div className="grid grid-cols-[1fr_240px] gap-4">
        
      {/* Table Laporan */}
        {/* HAPUS radialCardClass dan ganti dengan styling flat seperti tabel Laporan Transaksi */}
        <div className="border border-[#BF8F51] rounded-[15px] bg-[#14110E] overflow-hidden">
          <table className="w-full text-center whitespace-nowrap">
            <thead className="border-b border-[#BF8F51] text-[#EAE1D8] text-[15px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5 font-regular">METODE PEMBAYARAN</th>
                <th className="px-6 py-5 font-regular">JUMLAH TRANSAKSI</th>
                <th className="px-6 py-5 font-regular">TOTAL NOMINAL</th>
                <th className="px-6 py-5 font-regular">KONTRIBUSI</th>
                <th className="px-6 py-5 font-regular">TREND</th>
              </tr>
            </thead>
            <tbody className="text-[#EAE1D8] text-[14px]">
              
              {/* Baris 1: QRIS (Background Coklat Gelap #322A1F) */}
              <tr className="bg-[#322A1F]">
                <td className="px-6 py-4">QRIS</td>
                <td className="px-6 py-4">8.840</td>
                <td className="px-6 py-4">Rp 4.640.000</td>
                <td className="px-6 py-4">58%</td>
                <td className="px-6 py-4 flex justify-center">
                  <svg className="text-[#79FF8D]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                </td>
              </tr>
              
              {/* Baris 2: Tunai (Transparan ke background #14110E) */}
              <tr className="bg-transparent">
                <td className="px-6 py-4">Tunai</td>
                <td className="px-6 py-4">3.962</td>
                <td className="px-6 py-4">Rp 2.080.000</td>
                <td className="px-6 py-4">26%</td>
                <td className="px-6 py-4 flex justify-center">
                  <svg className="text-[#79FF8D]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                </td>
              </tr>
              
              {/* Baris 3: E-Wallet (Background Coklat Gelap #322A1F) */}
              <tr className="bg-[#322A1F]">
                <td className="px-6 py-4">E-Wallet</td>
                <td className="px-6 py-4">2.438</td>
                <td className="px-6 py-4">Rp 8.000.000</td>
                <td className="px-6 py-4">16%</td>
                <td className="px-6 py-4 flex justify-center">
                  <svg className="text-[#FF4343]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* Executive Insight */}
        <div className={`${radialCardClass}`}>
          <h4 className="text-[#BF8F51] font-bold text-[15px] mb-5">Executive Insight</h4>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center text-[#BF8F51]">
              <span className="leading-tight">Revenue:<br/>Rp8 Juta</span>
              <span className="text-right leading-tight text-[12px]">15.240<br/>transaksi</span>
            </div>
            <div className="flex justify-between items-center text-[#BF8F51]">
              <span className="leading-tight">QRIS:<br/>Kontribusi terbesar</span>
              <span className="text-right leading-tight text-[12px]">(58%)</span>
            </div>
            <div className="flex justify-between items-center text-[#BF8F51]">
              <span className="leading-tight">Tunai:<br/>Berkontribusi</span>
              <span className="text-right leading-tight text-[12px]">(26%)</span>
            </div>
            <div className="flex justify-between items-center text-[#BF8F51]">
              <span className="leading-tight">E-Wallet:<br/>Berkontribusi</span>
              <span className="text-right leading-tight text-[12px]">(16%)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}