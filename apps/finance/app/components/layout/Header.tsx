'use client';

import React from 'react';

interface HeaderProps {
  title: string;
  userName: string;
  userRole: string;
  onLogout?: () => void;
}

export default function Header({ title, userName, userRole, onLogout }: HeaderProps) {
  return (
    <header className="flex items-center justify-between pb-5 border-b-[2px] border-[#BF8F51]">

      <div className="flex items-center">
        <h2 className="text-2xl md:text-[28px] font-bold text-[#BF8F51]">
          {title}
        </h2>
      </div>

      {/* Tambahkan pr-6 atau mr-6 di sini agar tidak mepet ke kanan */}
      <div className="flex items-center gap-6 pr-6">

        {/* Garis Vertikal Pemisah Profil */}
        <div className="hidden sm:block w-[1px] h-[62px] bg-[#BF8F51]"></div>

        {/* Grup Avatar & Nama */}
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 bg-[#EAEAEA] rounded-full text-black font-bold text-lg">
            {userName.charAt(0)}
          </div>
          <div className="flex flex-col items-start justify-center hidden sm:flex">
            <p className="text-[17px] font-bold text-white leading-tight mb-0.5">
              {userName}
            </p>
            <p className="text-[13px] text-[#868D9A] font-medium leading-tight capitalize">
              {userRole}
            </p>
          </div>
        </div>

        {/* Tombol Logout */}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            title="Keluar"
            className="flex items-center justify-center w-10 h-10 rounded-[10px] border border-[#BF8F51]/50 text-[#BF8F51] hover:bg-[#BF8F51]/10 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        )}

      </div>
    </header>
  );
}
