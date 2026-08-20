'use client';

import React from 'react';

export default function LaporanMemberPage() {
  // Class bawaan untuk card dengan efek radial gradient (Hitam di tengah, coklat di pinggir)
  const radialCardClass = "bg-[radial-gradient(ellipse_at_center,_#110C08_0%,_rgba(191,143,81,0.18)_100%)] border border-[#BF8F51] rounded-[15px] p-5 flex flex-col hover:border-[#BF8F51] transition-colors";

  // Data statis untuk mensimulasikan tabel member
  const tableData = [
    { id: 'MEM-24-0012', nama: 'Wendra Ardi Kusuma', plat: 'H 2320 PI', jenis: 'Mobil', tanggal: '28 Juli 2026\n18:07:05', fee: 'Rp 100K', status: 'AKTIF' },
    { id: 'MEM-24-0013', nama: "Fa'iq Damar Pratama", plat: 'H 2320 PI', jenis: 'Kendaraan Besar', tanggal: '28 Juli 2026\n18:07:05', fee: 'Rp 100K', status: 'AKTIF' },
    { id: 'MEM-24-0014', nama: 'Yerky Syabana', plat: 'H 2320 PI', jenis: 'Motor', tanggal: '28 Juli 2026\n18:07:05', fee: 'Rp 100K', status: 'DIBLOKIR' },
    { id: 'MEM-24-0015', nama: 'Yerky Syabana', plat: 'H 2320 PI', jenis: 'Motor', tanggal: '28 Juli 2026\n18:07:05', fee: 'Rp 100K', status: 'DIBLOKIR' },
    { id: 'MEM-24-0016', nama: 'Yerky Syabana', plat: 'H 2320 PI', jenis: 'Motor', tanggal: '28 Juli 2026\n18:07:05', fee: 'Rp 100K', status: 'EXP' },
    { id: 'MEM-24-0017', nama: 'Yerky Syabana', plat: 'H 2320 PI', jenis: 'Motor', tanggal: '28 Juli 2026\n18:07:05', fee: 'Rp 100K', status: 'DIBLOKIR' },
    { id: 'MEM-24-0018', nama: 'Yerky Syabana', plat: 'H 2320 PI', jenis: 'Motor', tanggal: '28 Juli 2026\n18:07:05', fee: 'Rp 100K', status: 'EXP' },
    { id: 'MEM-24-0019', nama: 'Yerky Syabana', plat: 'H 2320 PI', jenis: 'Motor', tanggal: '28 Juli 2026\n18:07:05', fee: 'Rp 100K', status: 'DIBLOKIR' },
  ];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6 pb-10">
      
      {/* HEADER HALAMAN */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#EAE1D8]">Laporan Member</h2>
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

        {/* Dropdown Kendaraan & Status */}
        {['KENDARAAN', 'STATUS'].map((label, idx) => (
          <div key={idx} className="w-[150px]">
            <label className="block text-[#BF8F51] text-[11px] font-semibold mb-2 uppercase">{label}</label>
            <div className="relative">
              <select className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] pl-3 pr-8 py-2 text-sm appearance-none outline-none focus:border-[#BF8F51]">
                <option className="bg-[#14110E]">Semua Tipe</option>
              </select>
              <svg className="absolute right-3 top-[11px] text-[#BF8F51] pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        ))}

        {/* Reset Filter */}
        <div>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#BF8F51] rounded-[7px] text-[#BF8F51] text-sm font-medium hover:bg-[#BF8F51]/10 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Reset Filter
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative ml-auto w-[200px]">
          <svg className="absolute left-3 top-2.5 text-[#BF8F51]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Cari Member, Plat..." 
            className="w-full bg-transparent border border-[#BF8F51] rounded-[7px] pl-9 pr-3 py-2 text-sm text-[#EAE1D8] placeholder-gray-500 outline-none focus:border-[#BF8F51] transition-colors"
          />
        </div>
      </div>

      {/* MIDDLE SECTION (Grid Layout Kiri Kanan) */}
      <div className="grid grid-cols-[1fr_270px] gap-6">
        
        {/* KIRI: 3 Cards Stat & Grafik Tren */}
        <div className="flex flex-col gap-6">
          
          {/* 3 STAT CARDS */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`${radialCardClass} h-[160px] justify-between`}>
              <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Total Member</p>
              <h3 className="text-[#BF8F51] text-[40px] font-bold leading-none mt-2">1.250</h3>
              <p className="text-[#79FF8D] text-[10px] mt-auto">↑ 12,5% dari periode sebelumnya</p>
            </div>
            <div className={`${radialCardClass} h-[160px] justify-between`}>
              <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Total Pendaftar</p>
              <h3 className="text-[#BF8F51] text-[40px] font-bold leading-none mt-2">85 <span className="text-[24px]">Member</span></h3>
              <p className="text-[#79FF8D] text-[10px] mt-auto">↑ 12,5% dari periode sebelumnya</p>
            </div>
            <div className={`${radialCardClass} h-[160px] justify-between`}>
              <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Pendapatan Pendaftaran</p>
              <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2">Rp8.500.000</h3>
              <p className="text-[#79FF8D] text-[10px] mt-auto">↑ 12,5% dari periode sebelumnya</p>
            </div>
          </div>

          {/* AREA CHART */}
          <div className={`${radialCardClass} h-[250px] relative`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-[#BF8F51] font-semibold text-[15px]">Grafik tren Pendaftaran Member</h4>
                <p className="text-[10px] text-[#BF8F51]/60 mt-0.5">↑ 12,5% dari periode sebelumnya</p>
              </div>
              <select className="bg-transparent border border-[#BF8F51]/50 text-[10px] text-[#BF8F51] rounded px-3 py-1 outline-none">
                <option className="bg-[#14110E]">Mingguan</option>
              </select>
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
              
              {/* SVG Area Chart (Mockup Path) */}
              <div className="absolute inset-0 pl-10 pb-8 z-10">
                <svg className="w-full h-full" viewBox="0 0 600 130" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradientAreaMem" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#BF8F51" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#BF8F51" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {/* Garis putus-putus periode sebelumnya */}
                  <path d="M0 120 C 80 110, 120 120, 200 90 C 280 60, 320 100, 400 115 C 480 130, 520 60, 600 90" fill="none" stroke="#5C4328" strokeWidth="2" strokeDasharray="4 4" />
                  {/* Area utama periode saat ini */}
                  <path d="M0 130 C 80 130, 120 80, 200 90 C 280 100, 350 20, 400 20 C 450 20, 500 120, 600 120 L 600 130 L 0 130 Z" fill="url(#gradientAreaMem)" />
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
        </div>

        {/* KANAN: Member Insight */}
        <div className={`${radialCardClass} h-full`}>
          <h4 className="text-[#BF8F51] font-bold text-[18px] mb-6">Member Insight</h4>
          <div className="space-y-6 text-[14px]">
            <div className="flex justify-between items-start text-[#BF8F51]">
              <span className="w-2/3 leading-tight">pertumbuhan<br/>member</span>
              <span className="w-1/3 text-right">↑ 12,5 %</span>
            </div>
            <div className="flex justify-between items-center text-[#BF8F51]">
              <span>member terdaftar</span>
              <span>85</span>
            </div>
            <div className="flex justify-between items-center text-[#BF8F51]">
              <span>member aktif</span>
              <span>76</span>
            </div>
            <div className="flex justify-between items-center text-[#BF8F51]">
              <span>revenue registrasi</span>
              <span>Rp8,5 juta</span>
            </div>
            <div className="flex justify-between items-start text-[#BF8F51]">
              <span className="w-2/3 leading-tight">rata-rata<br/>registrasi</span>
              <span className="w-1/3 text-right leading-tight">Rp100.000</span>
            </div>
            <div className="flex justify-between items-center text-[#BF8F51]">
              <span>member aktif</span>
              <span>72</span>
            </div>
            <div className="flex justify-between items-center text-[#BF8F51]">
              <span>member expired</span>
              <span>13</span>
            </div>
          </div>
        </div>

      </div>

      {/* TABLE DATA MEMBER */}
      <div className="border border-[#BF8F51] rounded-[15px] bg-[#14110E] overflow-hidden flex flex-col w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-center whitespace-nowrap">
            <thead className="border-b border-[#BF8F51] text-[#EAE1D8] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5 font-semibold text-left">NO. MEMBER</th>
                <th className="px-6 py-5 font-semibold text-left">NAMA LENGKAP</th>
                <th className="px-6 py-5 font-semibold">NO. PLAT KENDARAAN</th>
                <th className="px-6 py-5 font-semibold">JENIS KENDARAAN</th>
                <th className="px-6 py-5 font-semibold">TANGGAL PENDAFTARAN</th>
                <th className="px-6 py-5 font-semibold">FEE</th>
                <th className="px-6 py-5 font-semibold text-center">STATUS</th>
              </tr>
            </thead>
            
            <tbody className="text-[#EAE1D8] text-[14px]">
              {tableData.map((row, index) => (
                <tr 
                  key={index} 
                  className={`hover:bg-[#BF8F51]/10 transition-colors ${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-transparent'}`}
                >
                  <td className="px-6 py-3 text-left font-medium text-gray-300">{row.id}</td>
                  <td className="px-6 py-3 text-left">
                    {/* Memisahkan Nama jika ada line break */}
                    {row.nama.split(' ').map((n, i) => <React.Fragment key={i}>{n}{i === 0 ? <br/> : ' '}</React.Fragment>)}
                  </td>
                  <td className="px-6 py-3">{row.plat}</td>
                  <td className="px-6 py-3">{row.jenis}</td>
                  <td className="px-6 py-3 text-[13px] text-gray-300">
                    {/* Render Date with break */}
                    {row.tanggal.split('\n').map((txt, i) => <div key={i}>{txt}</div>)}
                  </td>
                  <td className="px-6 py-3">{row.fee}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`inline-flex items-center justify-center w-[92px] h-[22px] text-[11px] font-bold rounded-[9px] border ${
                      row.status === 'AKTIF' 
                        ? 'border-[#79FF8D] text-[#79FF8D] bg-[#00FF26]/[0.35]' 
                        : row.status === 'DIBLOKIR'
                        ? 'border-[#FF7E7E] text-[#FF7E7E] bg-[#FF0000]/[0.35]'
                        : 'border-[#D9D9D9] text-[#D9D9D9] bg-[#A7A6A5]/[0.24]'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#BF8F51] text-sm">
          <p className="text-gray-400 text-[13px]">Menampilkan 1-8 dari 15 Member</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-[#BF8F51] border border-[#BF8F51] rounded hover:bg-[#BF8F51]/10 transition-colors">Sebelumnya</button>
            <button className="px-3 py-1 text-black font-semibold bg-[#BF8F51] border border-[#BF8F51] rounded">1</button>
            <button className="px-3 py-1 text-[#EAE1D8] border border-[#BF8F51] rounded hover:bg-[#EAE1D8]/10 transition-colors">2</button>
            <button className="px-3 py-1 text-[#EAE1D8] border border-[#BF8F51] rounded hover:bg-[#EAE1D8]/10 transition-colors">Berikutnya</button>
          </div>
        </div>
      </div>

    </div>
  );
}