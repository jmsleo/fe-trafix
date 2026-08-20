import React from 'react';

interface HeaderProps {
  title: string;
  userName: string;
  userRole: string;
}

export default function Header({ title, userName, userRole }: HeaderProps) {
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
            <p className="text-[13px] text-[#868D9A] font-medium leading-tight">
              {userRole}
            </p>
          </div>
        </div>
        
      </div>
    </header>
  );
}