'use client';

import React from 'react';

export default function RingkasanKendaraanPage() {
  // Class helper untuk card dengan efek cahaya (radial)
  const radialCardClass = "bg-[radial-gradient(ellipse_at_center,_#110C08_0%,_rgba(191,143,81,0.18)_100%)] border border-[#BF8F51] rounded-[15px] p-5 flex flex-col hover:border-[#BF8F51] transition-colors";

  // Data statis untuk tabel kendaraan
  const vehicleData = [
    { jenis: 'Motor', jumlah: '8.500', pendapatan: 'Rp 3.200.000' },
    { jenis: 'Mobil', jumlah: '4.500', pendapatan: 'Rp 3.000.000' },
    { jenis: 'Bus', jumlah: '800', pendapatan: 'Rp 700.000' },
    { jenis: 'Truck', jumlah: '600', pendapatan: 'Rp 500.000' },
    { jenis: 'Emergency', jumlah: '168', pendapatan: 'Rp 120.000' },
    { jenis: 'Member', jumlah: '168', pendapatan: 'Rp 120.000' },
    { jenis: 'Tamu', jumlah: '168', pendapatan: 'Rp 120.000' },
    { jenis: 'Tiket Hilang', jumlah: '168', pendapatan: 'Rp 240.000' },
  ];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6">
      
      {/* HEADER HALAMAN */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#EAE1D8]">Laporan Kendaraan</h2>
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

      {/* FILTER SECTION (Border biru di screenshot) */}
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

        {['SHIFT', 'GATE'].map((label, idx) => (
          <div key={idx} className="flex-1 max-w-[180px]">
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
        <div className={`${radialCardClass} h-[160px] justify-between`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Total Kendaraan</p>
          <h3 className="text-[#BF8F51] text-[40px] font-bold leading-none mt-2">15.240</h3>
          <p className="text-[#79FF8D] text-[10px] mt-auto">↑ 12,5% dari periode sebelumnya</p>
        </div>
        <div className={`${radialCardClass} h-[160px] justify-between`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Total Pendapatan</p>
          <h3 className="text-[#BF8F51] text-[40px] font-bold leading-none mt-2">Rp 8 Jt</h3>
          <p className="text-[#79FF8D] text-[10px] mt-auto">↑ 12,5% dari periode sebelumnya</p>
        </div>
        <div className={`${radialCardClass} h-[160px] justify-between`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Jenis Kendaraan Terbanyak</p>
          <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2">MOTOR</h3>
          <p className="text-[#EAE1D8] text-[10px] mt-auto font-medium">58% dari seluruh kendaraan</p>
        </div>
        <div className={`${radialCardClass} h-[160px] justify-between`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Highest Revenue Shift</p>
          <h3 className="text-[#EAE1D8] text-[36px] font-bold leading-none mt-2">Shift 2</h3>
          <p className="text-[#EAE1D8] text-[10px] mt-auto font-medium">37,5% dari seluruh shift</p>
        </div>
      </div>

      {/* BOTTOM SECTION (Layout 2 Kolom Kiri/Kanan) */}
      <div className="flex gap-4">
        
        {/* KIRI: Tabel Rincian Kendaraan (Tinggi 504px) */}
        <div className="flex-[1.65] border border-[#BF8F51] rounded-[15px] bg-[#14110E] overflow-hidden flex flex-col justify-between min-h-[504px]">
          <table className="w-full text-center whitespace-nowrap">
            <thead className="border-b border-[#BF8F51]/40 text-[#EAE1D8] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold text-left">JENIS KENDARAAN</th>
                <th className="px-6 py-4 font-semibold">JUMLAH</th>
                <th className="px-6 py-4 font-semibold">PENDAPATAN</th>
              </tr>
            </thead>
            <tbody className="text-[#EAE1D8] text-[14px]">
              {vehicleData.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-[#322A1F]' : 'bg-transparent'}>
                  <td className="px-6 py-3.5 text-left">{row.jenis}</td>
                  <td className="px-6 py-3.5">{row.jumlah}</td>
                  <td className="px-6 py-3.5">{row.pendapatan}</td>
                </tr>
              ))}
              {/* Baris Total Paling Bawah */}
              <tr className="border-t border-[#BF8F51]">
                <td className="px-6 py-4 text-left font-bold text-[#BF8F51] text-[16px]">TOTAL</td>
                <td className="px-6 py-4 font-bold text-[#BF8F51] text-[16px]">15.240</td>
                <td className="px-6 py-4 font-bold text-[#BF8F51] text-[16px]">Rp 8.000.000</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* KANAN: Kolom Performa Shift & Grafik (Flex Column) */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* Performa Shift Box (Tinggi 280px) */}
          <div className={`${radialCardClass} h-[280px]`}>
            <h4 className="text-[#BF8F51] font-semibold text-[15px] mb-6">Performa Shift</h4>
            <div className="space-y-6 flex-1">
              
              {/* Shift 1 */}
              <div>
                <div className="flex justify-between text-[#EAE1D8] text-[11px] mb-2 font-medium">
                  <span>Shift 1 (06:00 - 14:00)</span>
                  <span>Rp 2,5 Jt</span>
                </div>
                <div className="w-full h-2 bg-[#423C34] rounded-full overflow-hidden">
                  <div className="h-full bg-[#BF8F51] w-[30%]"></div>
                </div>
              </div>
              
              {/* Shift 2 */}
              <div>
                <div className="flex justify-between text-[#EAE1D8] text-[11px] mb-2 font-medium">
                  <span>Shift 2 (14:00 - 22:00)</span>
                  <span>Rp 3,0 Jt</span>
                </div>
                <div className="w-full h-2 bg-[#423C34] rounded-full overflow-hidden">
                  <div className="h-full bg-[#BF8F51] w-[45%]"></div>
                </div>
              </div>

              {/* Shift 3 */}
              <div>
                <div className="flex justify-between text-[#EAE1D8] text-[11px] mb-2 font-medium">
                  <span>Shift 3 (22:00 - 06:00)</span>
                  <span>Rp 2,5 Jt</span>
                </div>
                <div className="w-full h-2 bg-[#423C34] rounded-full overflow-hidden">
                  <div className="h-full bg-[#BF8F51] w-[30%]"></div>
                </div>
              </div>

            </div>
            {/* Total Bawah */}
            <div className="flex justify-between items-end border-t border-[#BF8F51]/30 pt-4 mt-auto">
              <span className="text-[#BF8F51] font-bold text-[14px]">Total semua shift</span>
              <span className="text-[#EAE1D8] font-bold text-[16px]">Rp 8 Jt</span>
            </div>
          </div>

          {/* Grafik Kendaraan Box (Pie Chart Sederhana) */}
          <div className={`${radialCardClass} flex-1 justify-center`}>
            <h4 className="text-[#BF8F51] font-semibold text-[15px] mb-4">Grafik kendaraan</h4>
            <div className="flex items-center gap-6 h-full">
              {/* Pie Chart Mockup CSS */}
              <div className="w-[100px] h-[100px] shrink-0 rounded-full bg-[conic-gradient(#BF8F51_0%_58%,_#906B3D_58%_84%,_#604728_84%_100%)] ml-2"></div>
              
              {/* Legend */}
              <div className="space-y-3 text-[10px] font-medium text-[#BF8F51] w-full">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><div className="w-2 h-2 bg-[#BF8F51] rounded-[2px]"></div> Motor</span>
                  <span>8.500 (58%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><div className="w-2 h-2 bg-[#906B3D] rounded-[2px]"></div> Mobil</span>
                  <span>4.500 (26%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><div className="w-2 h-2 bg-[#604728] rounded-[2px]"></div> Lainnya</span>
                  <span>2.240 (16%)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}