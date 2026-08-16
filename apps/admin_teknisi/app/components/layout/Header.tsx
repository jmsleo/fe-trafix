import React from 'react';

interface HeaderProps {
  title: string;
  userName: string;
  userRole: string;
}

export default function Header({ title, userName, userRole }: HeaderProps) {
  return (
    <header className="flex items-center justify-between pb-5 border-b-[2px] border-[#B5884D]">
      
      <div className="flex items-center">
        <h2 className="text-2xl md:text-[28px] font-bold text-[#B5884D]">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        
        {/* Garis Vertikal Pemisah Profil (Sesuai Gambar Figma) */}
        <div className="hidden sm:block w-[1px] h-[62px] bg-[#B5884D]"></div>
        
        {/* Grup Avatar & Nama */}
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-11 h-11 bg-[#EAEAEA] rounded-full text-black font-bold text-lg">
            {userName.charAt(0)}
          </div>
          <div className="flex flex-col items-start justify-center hidden sm:flex">
            <p className="text-[17px] font-bold text-white leading-tight mb-0.5">
              {userName}
            </p>
            <p className="text-[13px] text-[#868D9A] font-medium leading-tight">
              {userRole}
            </p>
          </div>
        </div>
        
        {/* Ikon Logout */}
        <button className="text-[#B5884D] hover:opacity-80 transition-opacity ml-1">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>

      </div>
    </header>
  );
}