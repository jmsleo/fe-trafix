'use client';

import React, { useState } from 'react';

export default function LaporanTransaksiPage() {
  // State untuk pop-up Filter
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // State untuk pop-up Rincian Transaksi (menyimpan data baris yang diklik)
  const [selectedTx, setSelectedTx] = useState<any>(null);

  // Data statis untuk mensimulasikan tabel sesuai desain
  const tableData = [
    { id: 'FIX-001', staff: 'Yerky', jenis: 'Mobil', plat: 'H 2320 PI', masuk: '23 Agst, 10:15', keluar: '23 Agst, 13:30', durasi: '120', metode: 'Tunai', total: 'Rp 10.000', status: 'SELESAI' },
    { id: 'FIX-002', staff: 'Yerky', jenis: 'Mobil', plat: 'H 2320 PI', masuk: '23 Agst, 10:15', keluar: '23 Agst, 13:30', durasi: '120', metode: 'QRIS', total: 'Rp 10.000', status: 'SELESAI' },
    { id: 'FIX-003', staff: 'Yerky', jenis: 'Mobil', plat: 'H 2320 PI', masuk: '23 Agst, 10:15', keluar: '23 Agst, 13:30', durasi: '120', metode: 'QRIS', total: 'Rp 10.000', status: 'AKTIF' },
    { id: 'FIX-004', staff: 'Yerky', jenis: 'Motor', plat: 'H 2320 PI', masuk: '23 Agst, 10:15', keluar: '23 Agst, 13:30', durasi: '120', metode: 'E-Wallet', total: 'Rp 10.000', status: 'AKTIF' },
    { id: 'FIX-005', staff: 'Yerky', jenis: 'Motor', plat: 'H 2320 PI', masuk: '23 Agst, 10:15', keluar: '23 Agst, 13:30', durasi: '120', metode: 'Tunai', total: 'Rp 10.000', status: 'AKTIF' },
    { id: 'FIX-006', staff: 'Yerky', jenis: 'Motor', plat: 'H 2320 PI', masuk: '23 Agst, 10:15', keluar: '23 Agst, 13:30', durasi: '120', metode: 'Tunai', total: 'Rp 10.000', status: 'SELESAI' },
    { id: 'FIX-007', staff: 'Yerky', jenis: 'Kendaraan Besar', plat: 'H 2320 PI', masuk: '23 Agst, 10:15', keluar: '23 Agst, 13:30', durasi: '120', metode: 'QRIS', total: 'Rp 10.000', status: 'SELESAI' },
    { id: 'FIX-008', staff: 'Yerky', jenis: 'Kendaraan Besar', plat: 'H 2320 PI', masuk: '23 Agst, 10:15', keluar: '23 Agst, 13:30', durasi: '120', metode: 'E-Wallet', total: 'Rp 10.000', status: 'SELESAI' },
    { id: 'FIX-009', staff: 'Yerky', jenis: 'Kendaraan Besar', plat: 'H 2320 PI', masuk: '23 Agst, 10:15', keluar: '23 Agst, 13:30', durasi: '120', metode: 'Tunai', total: 'Rp 10.000', status: 'SELESAI' },
  ];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6 relative pb-10">
      
      {/* HEADER HALAMAN */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#EAE1D8]">Laporan Transaksi</h2>
        
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
       {/* Tombol Filter */}
        <button 
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="relative z-10 flex-shrink-0 px-2 cursor-pointer text-[#BF8F51] hover:text-[#EAE1D8] transition-colors"
        >
          <svg className="pointer-events-none" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        </button>
      </div>

      {/* TABLE DATA */}
      <div className="border border-[#BF8F51] rounded-[10px] overflow-hidden flex flex-col bg-[#14110E]">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="border-b border-[#BF8F51] text-[#EAE1D8] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Kode Transaksi</th>
                <th className="px-6 py-4 font-semibold">Staff</th>
                <th className="px-6 py-4 font-semibold">Jenis Kendaraan</th>
                <th className="px-6 py-4 font-semibold">No. Plat</th>
                <th className="px-6 py-4 font-semibold">Waktu Masuk / Keluar</th>
                <th className="px-6 py-4 font-semibold">Durasi (menit)</th>
                <th className="px-6 py-4 font-semibold">Metode Pembayaran</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            
            <tbody className="text-[#EAE1D8] text-[14px]">
              {tableData.map((row, index) => (
                <tr 
                  key={index} 
                  className={`hover:bg-[#BF8F51]/10 transition-colors ${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-transparent'}`}
                >
                  <td 
                    className="px-6 py-3 font-semibold text-[#BF8F51] cursor-pointer hover:underline"
                    onClick={() => setSelectedTx(row)}
                  >
                    {row.id}
                  </td>
                  <td className="px-6 py-3">{row.staff}</td>
                  <td className="px-6 py-3">{row.jenis}</td>
                  <td className="px-6 py-3">{row.plat}</td>
                  <td className="px-6 py-3 flex flex-col justify-center">
                    <span>{row.masuk}</span>
                    <span className="text-[#BF8F51]">{row.keluar}</span>
                  </td>
                  <td className="px-6 py-3">{row.durasi}</td>
                  <td className="px-6 py-3">{row.metode}</td>
                  <td className="px-6 py-3">{row.total}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`inline-flex items-center justify-center w-[92px] h-[22px] text-[11px] font-bold rounded-[9px] border ${
                      row.status === 'SELESAI' 
                        ? 'border-[#79FF8D] text-[#79FF8D] bg-[#00FF26]/[0.35]' 
                        : 'border-[#80CEFF] text-[#80CEFF] bg-[#0051FF]/[0.35]'
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
          <p className="text-gray-400 text-[13px]">Menampilkan 1-9 dari 15 tarif</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-[#BF8F51] border border-[#BF8F51] rounded hover:bg-[#BF8F51]/10 transition-colors">Sebelumnya</button>
            <button className="px-3 py-1 text-black font-semibold bg-[#BF8F51] border border-[#BF8F51] rounded">1</button>
            <button className="px-3 py-1 text-[#EAE1D8] border border-[#BF8F51] rounded hover:bg-[#EAE1D8]/10 transition-colors">2</button>
            <button className="px-3 py-1 text-[#EAE1D8] border border-[#BF8F51] rounded hover:bg-[#EAE1D8]/10 transition-colors">Berikutnya</button>
          </div>
        </div>
      </div>

      {/* MODAL POP-UP FILTER */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-[400px] h-[453px] bg-[#14110E] border border-[#BF8F51] rounded-[10px] p-6 flex flex-col relative shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[20px] font-bold text-[#BF8F51]">Filter</h3>
              <button onClick={() => setIsFilterOpen(false)} className="text-[#BF8F51] hover:text-[#EAE1D8] transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-[#BF8F51] mb-2 uppercase tracking-wide">Jangka Waktu</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input type="text" className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] px-3 py-2 pr-8 text-sm outline-none focus:border-[#BF8F51]" />
                  <svg className="absolute right-2.5 top-2.5 text-[#BF8F51]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <span className="text-[#BF8F51] font-bold">-</span>
                <div className="relative flex-1">
                  <input type="text" className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] px-3 py-2 pr-8 text-sm outline-none focus:border-[#BF8F51]" />
                  <svg className="absolute right-2.5 top-2.5 text-[#BF8F51]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {['STAFF', 'JENIS KENDARAAN', 'GATE', 'SHIFT'].map((label, i) => (
                <div key={i}>
                  <label className="block text-[11px] font-semibold text-[#BF8F51] mb-2 uppercase tracking-wide">{label}</label>
                  <div className="relative">
                    <select className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] pl-3 pr-8 py-2 text-sm appearance-none outline-none focus:border-[#BF8F51]">
                      <option className="bg-[#14110E]">Semua Tipe</option>
                    </select>
                    <svg className="absolute right-3 top-[11px] text-[#BF8F51] pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mb-auto">
              <label className="block text-[11px] font-semibold text-[#BF8F51] mb-2 uppercase tracking-wide">PEMBAYARAN</label>
              <div className="w-[calc(50%-8px)] relative">
                <select className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] pl-3 pr-8 py-2 text-sm appearance-none outline-none focus:border-[#BF8F51]">
                  <option className="bg-[#14110E]">Semua Tipe</option>
                </select>
                <svg className="absolute right-3 top-[11px] text-[#BF8F51] pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-2">
              <button onClick={() => setIsFilterOpen(false)} className="px-5 py-2 border border-[#BF8F51] text-[#BF8F51] rounded-[7px] text-[13px] font-semibold hover:bg-[#BF8F51]/10 transition-colors">Atur Ulang</button>
              <button onClick={() => setIsFilterOpen(false)} className="px-5 py-2 bg-[#BF8F51] text-[#14110E] rounded-[7px] text-[13px] font-bold hover:opacity-90 transition-opacity">Terapkan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POP-UP RINCIAN TRANSAKSI */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-[729px] h-[788px] bg-[#17130E] border-[3px] border-[#BF8F51] rounded-[15px] p-10 flex flex-col relative shadow-2xl">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[28px] font-bold text-[#BF8F51]">
                Rincian Transaksi <span className="text-[#EAE1D8] font-medium text-[24px]">#{selectedTx.id}</span>
              </h3>
              <button 
                onClick={() => setSelectedTx(null)} 
                className="text-[#BF8F51] hover:text-[#EAE1D8] transition-colors"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Kamera LPR Section */}
            <div className="grid grid-cols-2 gap-8 flex-1 mb-8">
              {/* LPR Masuk */}
              <div className="flex flex-col">
                <span className="text-[#BF8F51] mb-3 font-semibold text-[17px]">LPR Pintu masuk</span>
                <div className="flex-1 border border-[#BF8F51]/60 rounded-[12px] flex items-center justify-center bg-[#17130E] relative overflow-hidden">
                   <div className="absolute top-[20%] w-[80%] h-[1px] bg-black/50"></div>
                   <div className="text-center text-[#BF8F51]">
                     <p className="font-bold text-lg">LPR</p>
                     <p className="font-medium">Preview</p>
                   </div>
                </div>
              </div>
              
              {/* LPR Keluar */}
              <div className="flex flex-col">
                <span className="text-[#BF8F51] mb-3 font-semibold text-[17px]">LPR Pintu keluar</span>
                <div className="flex-1 border border-[#BF8F51]/60 rounded-[12px] flex items-center justify-center bg-[#17130E] relative overflow-hidden">
                   <div className="absolute top-[20%] w-[80%] h-[1px] bg-black/50"></div>
                   <div className="text-center text-[#BF8F51]">
                     <p className="font-bold text-lg">LPR</p>
                     <p className="font-medium">Preview</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Info Box 1 */}
            <div className="border border-[#BF8F51]/60 rounded-[12px] p-6 flex justify-between items-center mb-6">
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[15px] font-medium mb-2">No. Plat</p>
                <p className="text-[#EAE1D8] text-[17px] font-semibold">{selectedTx.plat}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[15px] font-medium mb-2">Jenis Kendaraan</p>
                <p className="text-[#EAE1D8] text-[17px] font-semibold">{selectedTx.jenis}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[15px] font-medium mb-2">Gate masuk / keluar</p>
                <p className="text-[#EAE1D8] text-[17px] font-semibold">Masuk A / Keluar B</p>
              </div>
            </div>

            {/* Info Box 2 */}
            <div className="border border-[#BF8F51]/60 rounded-[12px] p-6 flex justify-between items-center">
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[15px] font-medium mb-2">Durasi (menit)</p>
                <p className="text-[#EAE1D8] text-[17px] font-semibold">{selectedTx.durasi}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[15px] font-medium mb-2">Pembayaran</p>
                <p className="text-[#EAE1D8] text-[17px] font-semibold">{selectedTx.metode}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[15px] font-medium mb-2">Total</p>
                <p className="text-[#EAE1D8] text-[17px] font-semibold">{selectedTx.total}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[#BF8F51] text-[15px] font-medium mb-2">Staff (shift)</p>
                <p className="text-[#EAE1D8] text-[17px] font-semibold">{selectedTx.staff} (Pagi)</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}