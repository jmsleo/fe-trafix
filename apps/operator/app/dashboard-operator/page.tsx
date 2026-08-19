'use client';

import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';

export default function OperatorDashboardPage() {
  const [waktu, setWaktu] = useState('Senin, 3 Agustus 2026 - 23:53:54');
  
  // ==========================================
  // STATE UNTUK LOGIKA FORM & POPUP
  // ==========================================
  const [platKendaraan, setPlatKendaraan] = useState('');
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [metodeBayar, setMetodeBayar] = useState('TUNAI');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      const dateStr = now.toLocaleDateString('id-ID', options);
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setWaktu(`${dateStr} - ${timeStr}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLanjutkan = () => {
    if (!platKendaraan.trim()) {
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 10000);
    } else {
      setShowPaymentModal(true);
    }
  };

  const radialBgStyle = {
    background: 'radial-gradient(50% 50% at 50% 50%, #231F1A 0%, #32291E 100%)'
  };

  return (
    <div className="min-h-screen bg-[#17130E] font-sans text-[#EAE1D8] py-8 px-[60px] flex flex-col items-center overflow-x-auto relative">
      
      <div className="w-full min-w-[1100px] flex flex-col gap-5">

        {/* 1. BARIS HEADER */}
        <div className="flex items-end gap-[20px] w-full mb-2">
          <div className="flex items-center gap-3 w-[260px] pb-5 flex-shrink-0">
             <img 
               src="/image/logo-fp.svg" 
               alt="Logo Fix Parking" 
               className="w-[34px] h-[34px] object-contain flex-shrink-0 ml-[-46px]" 
             />
             <div className="flex flex-col">
                <h1 className="text-[18px] font-bold text-white leading-none tracking-wide">Fix Parking</h1>
                <p className="text-[10px] text-gray-500 mt-1">HPMS Admin Portal</p>
             </div>
          </div>
          <div className="flex-grow w-full">
            <Header 
              title="Dashboard Operator" 
              userName="Yerky" 
              userRole="Operator" 
              avatarUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=Yerky&backgroundColor=e5e5e5"
              onLogout={() => alert('Logout clicked!')}
            />
          </div>
        </div>

        {/* 2. KONTEN UTAMA */}
        <div className="flex gap-[20px] w-full items-start">
          
          {/* KOLOM KIRI (Area Form) */}
          <div className="flex flex-col gap-[16px] flex-1 flex-shrink-0">
            
            {/* CARD 1: PILIH KENDARAAN */}
            <div className="w-full h-[182px] rounded-[15px] border border-[#BF8F51] p-5 flex flex-col justify-between" style={radialBgStyle}>
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-[18px] text-[#BF8F51] tracking-wide">Pilih Kendaraan</h2>
                <div className="border border-[#10B981]/50 bg-[#00FF26]/10 text-[#10B981] text-[12px] px-3 py-1 rounded-full font-medium tracking-wide">
                  Gunakan tombol F1-F10 pada keyboard
                </div>
              </div>
              <div className="grid grid-cols-5 gap-3 mt-2 w-full">
                {[
                  { k: 'F1', v: 'Motor' }, { k: 'F2', v: 'Mobil' }, { k: 'F3', v: 'Taksi/Ojol' }, { k: 'F4', v: 'Bus' }, { k: 'F5', v: 'Box/Truk Sedang' },
                  { k: 'F6', v: 'Bus Besar' }, { k: 'F7', v: 'Emergency' }, { k: 'F8', v: 'Guest' }, { k: 'F9', v: 'Tiket Manual' }, { k: 'F10', v: 'Tiket Hilang' }
                ].map(item => (
                  <button key={item.k} className="border border-[#BF8F51] text-[#BF8F51] rounded-[8px] h-[36px] px-2 text-[13px] hover:bg-[#BF8F51]/10 transition flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <span className="font-bold text-[#BF8F51]">{item.k}</span>
                    <span className="font-medium text-[#BF8F51]">{item.v}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CARD 2: INPUT KENDARAAN */}
            <div className="w-full rounded-[15px] border border-[#BF8F51] p-5 flex flex-col gap-4" style={radialBgStyle}>
              <div className="flex gap-[11px] w-full">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-[13px] font-semibold text-[#BF8F51]/70">No. Plat Kendaraan</label>
                  <input 
                    type="text" 
                    value={platKendaraan}
                    onChange={(e) => setPlatKendaraan(e.target.value)}
                    placeholder="Scan/input manual.." 
                    className="w-full h-[36px] bg-black/60 border border-[#BF8F51] rounded-[9px] px-4 text-sm text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#BF8F51]" 
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-[13px] font-semibold text-[#BF8F51]/70">Kode Tiket</label>
                  <input 
                    type="text" 
                    placeholder="Scan Tiket Masuk" 
                    className="w-full h-[36px] bg-black/60 border border-[#BF8F51] rounded-[9px] px-4 text-sm text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#BF8F51]" 
                  />
                </div>
              </div>

              {[
                { label: 'Waktu Masuk', placeholder: '-' },
                { label: 'Waktu Keluar', placeholder: '-' },
                { label: 'Durasi Parkir', placeholder: '-' }
              ].map(field => (
                <div className="flex flex-col gap-1.5 w-full" key={field.label}>
                  <label className="text-[13px] font-semibold text-[#BF8F51]/70">{field.label}</label>
                  <input 
                    type="text" 
                    placeholder={field.placeholder} 
                    className="w-full h-[36px] bg-black/60 border border-[#BF8F51] rounded-[9px] px-4 text-sm text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#BF8F51]" 
                  />
                </div>
              ))}

              <button 
                onClick={handleLanjutkan}
                className="w-full h-[36px] mt-1 bg-transparent border border-[#BF8F51] rounded-[9px] text-[#BF8F51] font-bold text-sm hover:bg-[#BF8F51]/10 transition-colors"
              >
                Lanjutkan Pembayaran
              </button>
            </div>

            {/* TOOLBAR BAWAH */}
            <div className="flex items-center gap-[11px] w-full">
              <div className="flex items-center gap-[11px] flex-shrink-0">
                 {[
                   { id: 'cc', svg: 'M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM3 10h18M7 15h2m2 0h2m2 0h2m2 0h2' }, 
                   { id: 'link', svg: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' }, 
                   { id: 'vol', svg: 'M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07' }, 
                   { id: 'full', svg: 'M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3' }, 
                   { id: 'print', svg: 'M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z' } 
                 ].map(icon => (
                    <button key={icon.id} className="w-[36px] h-[36px] flex items-center justify-center border border-[#BF8F51] rounded-[9px] text-[#BF8F51] hover:bg-[#BF8F51]/10 transition">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={icon.svg}></path>
                      </svg>
                    </button>
                 ))}
              </div>
              <div className="flex-1 h-[36px] border border-[#BF8F51] rounded-[9px] flex items-center justify-center text-[#BF8F51] text-[13px] font-bold">
                {waktu}
              </div>
            </div>

          </div>

          {/* KOLOM KANAN (Area Utilitas & Kamera) */}
          <div className="flex flex-col gap-[16px] w-[460px] flex-shrink-0">
            
            {/* TOMBOL UTILITIES KEMBALI KE FONT DEFAULT, UKURAN 18px */}
            <div className="flex justify-between items-center w-full gap-[8px]">
              <button className="flex-1 xl:flex-none border border-[#BF8F51] text-[#BF8F51] font-bold text-[18px] px-3 py-[7px] rounded-[8px] hover:bg-[#BF8F51]/10 transition">
                Re-print Struk
              </button>
              <button className="flex-1 xl:flex-none border border-[#BF8F51] text-[#BF8F51] font-bold text-[18px] px-3 py-[7px] rounded-[8px] hover:bg-[#BF8F51]/10 transition">
                Shift 2
              </button>
              <button className="flex-1 xl:flex-none border border-[#BF8F51] text-[#BF8F51] font-bold text-[18px] px-3 py-[7px] rounded-[8px] hover:bg-[#BF8F51]/10 transition">
                Yerky
              </button>
              <button className="flex-1 xl:flex-none border border-[#BF8F51] text-[#BF8F51] font-bold text-[18px] px-3 py-[7px] rounded-[8px] hover:bg-[#BF8F51]/10 transition flex items-center justify-center gap-1.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path></svg> 
                Refresh
              </button>
            </div>

            <div className="w-full h-[327px] rounded-[15px] border border-[#BF8F51] flex flex-col items-center justify-center gap-3" style={radialBgStyle}>
              <p className="text-[#BF8F51] text-[13px] font-bold text-center leading-relaxed">LPR<br/>preview cam<br/>in</p>
            </div>
            <div className="w-full h-[327px] rounded-[15px] border border-[#BF8F51] flex flex-col items-center justify-center gap-3 border-[#3498DB]" style={radialBgStyle}>
              <p className="text-[#BF8F51] text-[13px] font-bold text-center leading-relaxed">LPR<br/>preview cam<br/>out</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* POPUP NOTIFIKASI ERROR (TOAST) DI BAWAH                   */}
      {/* ========================================================= */}
      {showErrorToast && (
        <div className="fixed bottom-10 left-0 right-0 mx-auto w-max bg-[#2E1818] border border-[#A64444] rounded-[12px] px-8 py-4 shadow-2xl z-50 flex flex-col items-center justify-center animate-popIn">
          <div className="flex items-center gap-2 text-[#FF5A5A] font-bold text-[15px] mb-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Data Tidak Ditemukan
          </div>
          <p className="text-[#B39E9E] text-[12px] text-center leading-relaxed">
            Silakan masukkan nomor plat secara manual<br/>atau scan ulang tiket.
          </p>
        </div>
      )}

      {/* ========================================================= */}
      {/* POPUP MODAL PEMBAYARAN                                    */}
      {/* ========================================================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-[2px] z-50 flex items-center justify-center">
          
          <div className="w-[480px] rounded-[20px] border border-[#BF8F51] p-8 flex flex-col gap-6 shadow-2xl animate-popIn" style={radialBgStyle}>
            
            {/* Bagian Tarif */}
            <div>
              <p className="text-[#868D9A] text-[13px] font-medium mb-1">Tarif Parkir</p>
              <h2 className="text-[#BF8F51] text-[40px] font-bold leading-none">Rp 0,00</h2>
            </div>

            {/* Metode Pembayaran */}
            <div className="flex flex-col gap-2">
              <p className="text-[#868D9A] text-[13px] font-medium">Pilih Metode Pembayaran</p>
              <div className="flex gap-3">
                {[
                  { 
                    id: 'TUNAI', 
                    icon: <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /> 
                  },
                  { 
                    id: 'QRIS', 
                    icon: (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8V5h3m8 0h3v3m0 8v3h-3m-8 0H5v-3" />
                        <rect x="9" y="9" width="2.5" height="2.5" rx="0.5" />
                        <rect x="13" y="9" width="2.5" height="2.5" rx="0.5" />
                        <rect x="9" y="13" width="2.5" height="2.5" rx="0.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 14h1.5v1.5H14V14z" />
                      </>
                    )
                  },
                  { 
                    id: 'E-MONEY', 
                    icon: (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" fill="currentColor" stroke="none" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.5a5 5 0 010 7" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5.5a9.5 9.5 0 010 13" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 2.5a14 14 0 010 19" />
                      </>
                    )
                  }
                ].map(metode => (
                  <button 
                    key={metode.id}
                    onClick={() => setMetodeBayar(metode.id)}
                    className={`flex-1 flex flex-col items-center justify-center gap-2 h-[80px] rounded-[12px] border transition-all ${
                      metodeBayar === metode.id 
                        ? 'border-[#BF8F51] text-[#BF8F51] bg-[#BF8F51]/10' 
                        : 'border-[#5A5A5A] text-[#868D9A] hover:border-[#BF8F51]/50'
                    }`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      {metode.icon}
                    </svg>
                    <span className="text-[12px] font-bold">{metode.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Jumlah Pembayaran Input */}
            <div className="flex flex-col gap-2">
              <p className="text-[#868D9A] text-[13px] font-medium">Jumlah Pembayaran (Rp)</p>
              <input 
                type="text" 
                defaultValue="0"
                className="w-full h-[40px] bg-[#0A0A0A] border border-[#5A5A5A] rounded-[9px] px-4 text-sm text-[#EAE1D8] focus:outline-none focus:border-[#BF8F51]" 
              />
            </div>

            {/* Kembalian */}
            <div>
              <p className="text-[#868D9A] text-[13px] font-medium mb-1">Total Kembalian</p>
              <h2 className="text-[#BF8F51] text-[32px] font-bold leading-none">Rp 0,00</h2>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-2">
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="px-6 h-[40px] border border-[#BF8F51] rounded-[8px] text-[#BF8F51] font-bold text-[13px] hover:bg-[#BF8F51]/10 transition"
              >
                Batal
              </button>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="px-6 h-[40px] bg-[#BF8F51]/20 border border-[#BF8F51] rounded-[8px] text-[#BF8F51] font-bold text-[13px] hover:bg-[#BF8F51]/30 transition"
              >
                Lanjutkan & Buka Gate
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Animasi halus untuk memunculkan modal & notifikasi */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes popIn {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-popIn {
          animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

    </div>
  );
}