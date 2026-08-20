'use client';

import React, { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [shift, setShift] = useState('1');
  
  // State untuk menampilkan UI Error
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulasi memunculkan error jika kosong atau salah (untuk tes UI Slicing)
    if (!username || !password || username !== 'admin') {
      setShowError(true);
      return;
    }
    
    setShowError(false);
    console.log({ username, password, shift });
  };

  return (
    <div className="min-h-screen bg-[#0a0908] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[1100px] flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8">
        
        {/* --- Bagian Kiri: Logo & Tagline --- */}
        <div className="flex items-center gap-4">
          <img 
            src="/image/logo-fp.svg" 
            alt="Fix Parking Logo" 
            className="w-[88px] h-[88px] object-cover rounded-xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/88x88/B5884D/17130E?text=P';
            }}
          />
          <div className="flex flex-col justify-center">
            <h1 
              className="font-extrabold text-[#FFF4E5] tracking-wide text-[52px] leading-none mb-1"
              style={{
                fontFamily: "'Rubik', sans-serif",
                textShadow: '0px 0px 20px rgba(191, 143, 81, 0.8)'
              }}
            >
              Fix Parking
            </h1>
            <p className="text-[#BF8F51] text-[12px] font-bold tracking-[0.15em] uppercase">
              Effortless Parking, Premium Experience
            </p>
          </div>
        </div>

        {/* --- Bagian Kanan: Form Login --- */}
        <div className="w-full max-w-[526px] relative flex justify-center">
          
          {/* Card Form */}
          <div 
            className="relative rounded-[24px] px-10 py-12 flex flex-col justify-center w-full h-[595px]"
            style={{
              background: 'conic-gradient(from 80deg at 50% 82%, rgba(35, 31, 26, 0.5) 13%, rgba(191, 143, 81, 0.5) 63%, rgba(35, 31, 26, 0.5) 100%)',
              boxShadow: '15px 15px 40px rgba(191, 143, 81, 0.25), 30px 30px 80px rgba(191, 143, 81, 0.15)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <h2 className="text-[28px] font-bold text-center text-[#E7DED5] mb-10">
              Masuk ke Akun Anda
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input Username */}
              <div className="space-y-2">
                <label className="block text-[19px] font-semibold text-[#FFFFFF]">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#EAE1D8]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (showError) setShowError(false); // Sembunyikan error saat user mulai mengetik
                    }}
                    placeholder="halo_fixparking"
                    className="w-full h-[52px] pl-12 pr-4 bg-[#595148] border-none rounded-[12px] text-[#EAE1D8] text-[15px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#BF8F51] transition-all"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="space-y-2">
                <label className="block text-[19px] font-semibold text-[#FFFFFF]">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#EAE1D8]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (showError) setShowError(false);
                    }}
                    placeholder="••••••••"
                    className="w-full h-[52px] pl-12 pr-4 bg-[#595148] border-none rounded-[12px] text-[#EAE1D8] text-[15px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#BF8F51] transition-all"
                  />
                </div>
              </div>



              {/* UI Error Message Slicing */}
              {showError && (
                <div className="flex items-start gap-2 pt-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <p className="text-[#EF4444] text-[15px] leading-snug">
                    Login gagal, silakan periksa Username dan <br className="hidden md:block" /> kata sandi Anda.
                  </p>
                </div>
              )}

              {/* Tombol Submit */}
              <div className={`flex justify-center ${showError ? 'pt-2' : 'pt-6'}`}>
                <button
                  type="submit"
                  className="w-[160px] h-[48px] bg-black hover:bg-[#111] text-[#BF8F51] text-[27px] font-semibold rounded-[10px] transition-colors shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex items-center justify-center relative z-10"
                >
                  Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
}