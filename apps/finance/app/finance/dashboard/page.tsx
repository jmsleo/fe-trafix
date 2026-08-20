'use client';

import React from 'react';

export default function DashboardPage() {
  // Class bawaan untuk card dengan Radial Gradient: Hitam di tengah (#110C08), memudar ke coklat transparan di pinggir
  const radialCardClass = "bg-[radial-gradient(ellipse_at_center,_#110C08_0%,_rgba(191,143,81,0.18)_100%)] border border-[#BF8F51]/40 rounded-[10px] p-5 flex flex-col hover:border-[#BF8F51] transition-colors";

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">
      
      <h2 className="text-2xl font-bold text-[#EAE1D8]">Dashboard</h2>

      {/* FILTER & SEARCH BAR */}
      {/* Tambahan border pembungkus luar (wrapper) */}
      <div className="border border-[#BF8F51]/40 rounded-[10px] p-4 flex items-center justify-between mb-2">
        
        <div className="flex items-center gap-4">
          {/* Button Pilih Tanggal (Disesuaikan dengan gambar: ikon di kanan, garis & warna BF8F51) */}
          <button className="flex items-center justify-end w-[110px] px-3 py-2 bg-transparent border border-[#BF8F51] rounded-[7px] text-[#BF8F51] hover:bg-[#BF8F51]/10 transition-colors">
            {/* Anda bisa menambahkan teks/variabel tanggal di sebelah kiri ikon nantinya */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </button>

          {/* Select Shift (Warna teks dan panah menjadi BF8F51) */}
          <select className="px-4 py-2 bg-transparent border border-[#BF8F51] rounded-[7px] text-sm text-[#BF8F51] appearance-none outline-none focus:border-[#BF8F51] cursor-pointer w-40 transition-colors">
            <option className="bg-[#14110E]">Semua Shift</option>
            <option className="bg-[#14110E]">Shift 1</option>
            <option className="bg-[#14110E]">Shift 2</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative w-72">
          {/* Ikon kaca pembesar diubah menjadi warna BF8F51 */}
          <svg className="absolute left-3 top-2.5 text-[#BF8F51]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Cari Jenis, Tipe..." 
            className="w-full bg-transparent border border-[#BF8F51] rounded-[7px] pl-10 pr-4 py-2 text-sm text-[#EAE1D8] placeholder-gray-500 outline-none focus:border-[#BF8F51] transition-colors"
          />
        </div>

      </div>

      {/* STATISTIC CARDS */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { title: 'Total Pendapatan', value: 'Rp 230.000', desc: 'Hari ini, 7 Agu 2026' },
          { title: 'Shift 1', value: 'Rp 230.000', desc: '01:00 - 08:00' },
          { title: 'Shift 2', value: 'Rp 230.000', desc: '08:00 - 16:00' },
          { title: 'Shift 3', value: 'Rp 230.000', desc: '16:00 - 23:00' },
        ].map((card, idx) => (
          <div key={idx} className={`${radialCardClass} justify-between h-32`}>
            <p className="text-gray-400 text-sm font-medium">{card.title}</p>
            <h3 className="text-[#BF8F51] text-3xl font-bold mt-1">{card.value}</h3>
            <p className="text-[#BF8F51]/70 text-xs mt-2">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-3 gap-4 h-[280px]">
        
        {/* Chart 1: Tren Pendapatan (Area Chart kustom SVG) */}
        <div className={`${radialCardClass} relative col-span-1`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-[#BF8F51] font-semibold text-sm">Grafik tren pendapatan</h4>
              <p className="text-[10px] text-[#BF8F51]/60 mt-0.5">↑ 12.5% dari periode sebelumnya</p>
            </div>
            <select className="bg-transparent border border-[#BF8F51]/50 text-[10px] text-[#BF8F51] rounded px-2 py-1 outline-none">
              <option className="bg-[#14110E]">Harian</option>
            </select>
          </div>
          
          <div className="flex-1 flex flex-col relative mt-2 text-[10px] text-[#BF8F51]">
            {/* Y-Axis & Grid */}
            <div className="absolute inset-0 flex flex-col justify-between pb-6 z-0">
              {['1 jt', '800 rb', '600 rb', '400 rb', '200 rb'].map((val, i) => (
                <div key={i} className="flex items-center w-full">
                  <span className="w-8 text-left">{val}</span>
                  <div className="flex-1 border-b border-[#BF8F51]/20 ml-2"></div>
                </div>
              ))}
            </div>
            
            {/* SVG Area Chart */}
            <div className="absolute inset-0 pl-10 pb-6 z-10">
              <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#BF8F51" stopOpacity="0.7"/>
                    <stop offset="100%" stopColor="#BF8F51" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0 100 C 50 100, 80 90, 120 90 C 160 90, 180 10, 220 10 C 260 10, 280 80, 320 80 C 360 80, 380 100, 400 100 L 400 120 L 0 120 Z" fill="url(#gradientArea)" />
                <path d="M0 100 C 50 100, 80 90, 120 90 C 160 90, 180 10, 220 10 C 260 10, 280 80, 320 80 C 360 80, 380 100, 400 100" fill="none" stroke="#BF8F51" strokeWidth="2.5" />
              </svg>
            </div>

            {/* X-Axis */}
            <div className="absolute bottom-0 left-10 right-0 flex justify-between z-20 px-1 text-[#D9D9D9]">
              {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day, i) => (
                <span key={i}>{day}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: Grafik Kendaraan (Pie Chart Menggunakan CSS Conic-Gradient) */}
        <div className={`${radialCardClass}`}>
          <div className="flex justify-between items-start mb-6">
            <h4 className="text-[#BF8F51] font-semibold text-sm">Grafik kendaraan</h4>
            <select className="bg-transparent border border-[#BF8F51]/50 text-[10px] text-[#BF8F51] rounded px-2 py-1 outline-none">
              <option className="bg-[#14110E]">Hari ini</option>
            </select>
          </div>
          <div className="flex-1 flex flex-col items-center justify-between">
            {/* Full Pie Chart */}
            <div className="w-[110px] h-[110px] rounded-full bg-[conic-gradient(#BF8F51_0%_58%,_#866236_58%_84%,_#42301A_84%_100%)]"></div>
            
            {/* Legend */}
            <div className="w-full space-y-1.5 mt-6 text-xs font-medium">
              <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-gray-400"><div className="w-2.5 h-2.5 bg-[#BF8F51] rounded-sm"></div> Motor</span><span className="text-[#BF8F51]">145 (58%)</span></div>
              <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-gray-400"><div className="w-2.5 h-2.5 bg-[#866236] rounded-sm"></div> Mobil</span><span className="text-[#BF8F51]">65 (26%)</span></div>
              <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-gray-400"><div className="w-2.5 h-2.5 bg-[#42301A] rounded-sm"></div> Kendaraan Besar</span><span className="text-[#BF8F51]">40 (16%)</span></div>
            </div>
          </div>
        </div>

        {/* Chart 3: Grafik Pembayaran (Donut Chart) */}
        <div className={`${radialCardClass}`}>
          <div className="flex justify-between items-start mb-6">
            <h4 className="text-[#BF8F51] font-semibold text-sm">Grafik Pembayaran</h4>
            <select className="bg-transparent border border-[#BF8F51]/50 text-[10px] text-[#BF8F51] rounded px-2 py-1 outline-none">
              <option className="bg-[#14110E]">Hari ini</option>
            </select>
          </div>
          <div className="flex-1 flex flex-col items-center justify-between">
            {/* Donut Chart */}
            <div className="relative w-[110px] h-[110px] rounded-full bg-[conic-gradient(#4B5563_0%_58%,_#BF8F51_58%_84%,_#9CA3AF_84%_100%)] flex items-center justify-center shadow-lg">
              {/* Lubang Tengah (Warna disesuaikan agar menyatu dengan latar) */}
              <div className="w-[80px] h-[80px] bg-[#1B140D] rounded-full"></div>
            </div>
            
            {/* Legend */}
            <div className="w-full space-y-1.5 mt-6 text-xs font-medium">
              <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-gray-400"><div className="w-2.5 h-2.5 bg-[#4B5563] rounded-sm"></div> QRIS</span><span className="text-[#BF8F51]">145 (58%)</span></div>
              <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-gray-400"><div className="w-2.5 h-2.5 bg-[#BF8F51] rounded-sm"></div> Tunai</span><span className="text-[#BF8F51]">65 (26%)</span></div>
              <div className="flex justify-between items-center"><span className="flex items-center gap-2 text-gray-400"><div className="w-2.5 h-2.5 bg-[#9CA3AF] rounded-sm"></div> E-Wallet</span><span className="text-[#BF8F51]">40 (16%)</span></div>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: Insight & Alerts */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Executive Insight */}
        <div className={`${radialCardClass} justify-center`}>
          <h4 className="text-[#BF8F51] font-semibold text-[15px] mb-5">Executive Insight</h4>
          <div className="space-y-4 text-sm font-medium">
            <div className="flex justify-between">
              <span className="text-[#BF8F51]">Pendapatan hari ini</span>
              <span className="text-[#BF8F51]">Rp230.000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#BF8F51]">Motor mendominasi kendaraan</span>
              <span className="text-[#BF8F51]">(58%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#BF8F51]">QRIS menjadi pembayaran terbanyak</span>
              <span className="text-[#BF8F51]">(58%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#BF8F51]">Performa setiap shift</span>
              <span className="text-[#BF8F51]">relatif merata</span>
            </div>
          </div>
        </div>

        {/* Peringatan Operasional */}
        <div className={`${radialCardClass}`}>
          <h4 className="text-[#BF8F51] font-semibold text-[15px] mb-4">Peringatan Operasional</h4>
          <div className="space-y-3 text-sm font-medium">
            
            {/* Alert Merah (Tiket) - Segitiga Tanda Seru */}
            <div className="flex items-center gap-3 bg-[#FF8383]/[0.24] border border-[#FF4343] px-4 py-3 rounded-[7px]">
              <svg className="text-[#FF4343]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span className="text-[#EAE1D8]">Tiket gantung melebihi kapasitas 12 / 10 tiket</span>
            </div>

            {/* Alert Kuning (Revenue) - Lingkaran Tanda Seru Kebalik (Info 'i') */}
            <div className="flex items-center gap-3 bg-[#FFD94E]/[0.24] border border-[#FFBC2C] px-4 py-3 rounded-[7px]">
              <svg className="text-[#FFBC2C]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span className="text-[#EAE1D8]">Revenue turun 15%</span>
            </div>

            {/* Alert Abu-abu (Pembayaran) */}
            <div className="flex items-center gap-3 bg-[#767676]/[0.24] border border-[#B5B5B5] px-4 py-3 rounded-[7px]">
              <svg className="text-[#B5B5B5]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span className="text-[#EAE1D8]">Pembayaran tunai naik 8%</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}