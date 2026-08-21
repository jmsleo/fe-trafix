'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function FinanceSidebar() {
  const pathname = usePathname();
  
  // State untuk mengontrol Accordion dropdown menu (jika ke depannya ada submenu)
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  // DAFTAR MENU FINANCE (Berdasarkan Desain Terbaru)
  interface SubMenu {
    name: string;
    path: string;
    icon?: React.ReactNode;
  }
  interface FinanceMenu {
    name: string;
    path: string;
    icon: React.ReactNode;
    hasDropdown?: boolean;
    subMenus?: SubMenu[];
  }
  const financeMenus: FinanceMenu[] = [
    { 
      name: 'Dashboard', 
      path: '/finance/dashboard', // Sesuaikan path default-nya
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
    },
    { 
      name: 'Laporan Transaksi', 
      path: '/finance/laporan-transaksi',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
    },
    { 
      name: 'Laporan Pendapatan', 
      path: '/finance/laporan-pendapatan',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    },
    { 
      name: 'Ringkasan Kendaraan', 
      path: '/finance/ringkasan-kendaraan',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
    },
    { 
      name: 'Laporan Member', 
      path: '/finance/laporan-member', 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
    { 
      name: 'Laporan Akses Gate', 
      path: '/finance/laporan-akses-gate',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V2"/><path d="M8 12h14"/><path d="M20 12l2-2"/><path d="M16 12l2-2"/></svg>
    },
    { 
      name: 'Tiket Gantung', 
      path: '/finance/tiket-gantung',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
    },
    { 
      name: 'Kinerja Operator', 
      path: '/finance/kinerja-operator',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><circle cx="19" cy="11" r="2"/><path d="M19 8v1"/><path d="M19 13v1"/><path d="M21.6 9.5l-.87.5"/><path d="M17.27 12l-.87.5"/><path d="M21.6 12.5l-.87-.5"/><path d="M17.27 10l-.87-.5"/></svg>
    },
  ];

  return (
    <aside className="w-[253px] ml-[20px] pt-[40px] flex flex-col shrink-0 min-h-screen pb-6">
      
      {/* --- BAGIAN LOGO KIRI ATAS --- */}
      <div className="flex items-center gap-3.5 pl-4 mb-8">
        <Image 
          src="/image/logo-fp.svg"
          alt="Logo Fix Parking"
          width={36} 
          height={36}
          className="shrink-0"
        />
        <div className="flex flex-col mt-0.5">
          <h1 className="text-[22px] font-bold text-[#EAE1D8] leading-none mb-1.5 tracking-wide">
            Fix Parking
          </h1>
          <p className="text-[12px] font-medium text-gray-400 leading-none">
            HPMS Admin Portal
          </p>
        </div>
      </div>
      {/* ----------------------------- */}

      {/* Box Menu Navigasi */}
      {/* Mengubah tinggi agar dinamis mengisi sisa ruang (flex-1) sehingga Sign Out selalu ada di bawah */}
      <div className="bg-[#231F1A] rounded-[10px] p-4 shadow-xl flex flex-col flex-1 h-[874px] overflow-hidden">
        
        {/* AREA MENU UTAMA (Bisa discroll jika panjang) */}
        <nav className="flex-1 space-y-2 overflow-y-auto mb-4 scrollbar-hide">
          {financeMenus.map((menu, index) => {
            
            // Logika Active: Jika ada di halaman dashboard, pastikan exact path atau includes path.
            const isActive = pathname.includes(menu.path);
            const isDropdownOpen = menu.hasDropdown && openDropdownIndex === index;

            return (
              <div key={index} className="flex flex-col">
                
                {/* TOMBOL MENU UTAMA */}
                {(menu.hasDropdown) ? (
                  // Jika punya dropdown (Saat ini tidak ada di finance, tapi disisakan logikanya)
                  <button 
                    onClick={() => setOpenDropdownIndex(isDropdownOpen ? null : index)}
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-[7px] transition-all
                      ${isActive 
                        ? 'bg-[#17130E] text-[#B5884D] border border-[#B5884D] font-semibold' 
                        : 'text-[#EAE1D8] hover:bg-black/50 hover:text-[#B5884D] border border-transparent font-medium'
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`${isActive ? 'text-[#B5884D]' : 'text-gray-400'}`}>
                        {menu.icon}
                      </span>
                      <span className="text-[18px] tracking-wide text-left leading-tight">
                        {menu.name}
                      </span>
                    </div>
                    <span className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''} ${isActive ? 'text-[#B5884D]' : 'text-gray-400'}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </button>
                ) : (
                  // Jika tidak punya dropdown, gunakan <Link>
                  <Link 
                    href={menu.path}
                    className={`
                      flex items-center px-4 py-3 rounded-[7px] transition-all
                      ${isActive 
                        ? 'bg-[#17130E] text-[#B5884D] border border-[#B5884D] font-semibold' 
                        : 'text-[#EAE1D8] hover:bg-black/50 hover:text-[#B5884D] border border-transparent font-medium'
                      }
                    `}
                  >
                    <span className={`mr-4 shrink-0 ${isActive ? 'text-[#B5884D]' : 'text-gray-400'}`}>
                      {menu.icon}
                    </span>
                    <span className="text-[16px] tracking-wide leading-tight">
                      {menu.name}
                    </span>
                  </Link>
                )}

                {/* AREA SUB-MENU (DROPDOWN) - Jika suatu saat dipakai */}
                {menu.hasDropdown && isDropdownOpen && (
                  <div className="mt-2 ml-4 flex flex-col space-y-1 pl-2 border-l border-[#B5884D]/30 animate-in fade-in slide-in-from-top-2 duration-200">
                    {menu.subMenus?.map((subMenu, subIndex) => {
                      const isSubActive = pathname === subMenu.path;
                      return (
                        <Link 
                          key={subIndex}
                          href={subMenu.path}
                          className={`
                            flex items-center px-4 py-2.5 rounded-[7px] transition-all
                            ${isSubActive 
                              ? 'text-[#B5884D] font-semibold bg-black/30' 
                              : 'text-gray-400 hover:text-[#B5884D] hover:bg-black/30'
                            }
                          `}
                        >
                          <span className="mr-3 scale-90">
                            {subMenu.icon}
                          </span>
                          <span className="text-[15px]">
                            {subMenu.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* --- TOMBOL SIGN OUT (Fixed di Bawah Box Menu) --- */}
        <div className="pt-4 border-t border-gray-600/30">
          <button 
            className="flex items-center px-4 py-3 w-full rounded-[7px] text-[#EAE1D8] hover:bg-black/50 hover:text-[#B5884D] border border-transparent font-medium transition-all"
            onClick={() => {
               // Logika Sign Out nanti di sini
               console.log("Signing out...");
            }}
          >
            <span className="mr-4 text-gray-400 group-hover:text-[#B5884D]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            </span>
            <span className="text-[16px] tracking-wide">
              Sign Out
            </span>
          </button>
        </div>

      </div>
    </aside>
  );
}