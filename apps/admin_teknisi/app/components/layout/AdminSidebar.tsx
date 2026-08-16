'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function AdminSidebar() {
  const pathname = usePathname();
  
  // State untuk mengontrol Accordion khusus menu "Member"
  const [isMemberOpen, setIsMemberOpen] = useState(false);

  const adminMenus = [
    { 
      name: 'Tarif Parkir', 
      path: '/admin/tarif-parkir',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
    },
    { 
      name: 'Vehicle Type', 
      path: '/admin/vehicle-type',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h18"/><path d="M5 10l1.5-4.5A2 2 0 0 1 8.4 4h7.2a2 2 0 0 1 1.9 1.5L19 10"/><path d="M4 10v6a2 2 0 0 0 2 2h1"/><path d="M19 10v6a2 2 0 0 1-2 2h-1"/><circle cx="7" cy="14" r="1"/><circle cx="17" cy="14" r="1"/></svg>
    },
    { 
      name: 'Member', 
      path: '/admin/member', // Parent Path
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      hasDropdown: true,
      // Tambahan submenu
      subMenus: [
        {
          name: 'Daftar Member',
          path: '/admin/member/daftar-member',
          icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        },
        {
          name: 'Daftar Package',
          path: '/admin/member/daftar-package',
          icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        }
      ]
    },
    { 
      name: 'Shift', 
      path: '/admin/shift',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    },
    { 
      name: 'User Management', 
      path: '/admin/user-management',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><circle cx="19" cy="11" r="2"/><path d="M19 8v1"/><path d="M19 13v1"/><path d="M21.6 9.5l-.87.5"/><path d="M17.27 12l-.87.5"/><path d="M21.6 12.5l-.87-.5"/><path d="M17.27 10l-.87-.5"/></svg>
    },
    { 
      name: 'Signage Management', 
      path: '/admin/signage-management',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V2"/><path d="M6 6h12"/><rect x="8" y="6" width="8" height="6" rx="1"/></svg>
    },
    { 
      name: 'Backup Database', 
      path: '/admin/backup-database',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
    },
    { 
      name: 'Restore Database', 
      path: '/admin/restore-database',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
    },
    { 
      name: 'Audit Log', 
      path: '/admin/audit-log',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><circle cx="11.5" cy="14.5" r="2.5"/><path d="M13.25 16.25 15.5 18.5"/></svg>
    },
  ];

  return (
    <aside className="w-[253px] ml-[20px] pt-[40px] flex flex-col shrink-0 min-h-screen">
      
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
      <nav className="bg-[#231F1A] rounded-[10px] p-4 space-y-2 h-[874px] overflow-y-auto shadow-xl">
        {adminMenus.map((menu, index) => {
          
          // Cek apakah menu ini sedang aktif
          // Khusus "Member", dianggap aktif jika pathname mengandung kata '/admin/member'
          const isActive = pathname.includes(menu.path);

          return (
            <div key={index} className="flex flex-col">
              
              {/* TOMBOL MENU UTAMA */}
              {menu.hasDropdown ? (
                // Jika punya dropdown (Member), gunakan <button> agar bisa dibuka-tutup
                <button 
                  onClick={() => setIsMemberOpen(!isMemberOpen)}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-[7px] transition-all
                    ${isActive 
                      ? 'bg-[#17130E] text-[#B5884D] border border-[#B5884D] font-semibold' 
                      : 'text-[#EAE1D8] hover:bg-black/50 hover:text-[#B5884D] border border-transparent font-medium'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <span className={`mr-4 ${isActive ? 'text-[#B5884D]' : 'text-gray-400'}`}>
                      {menu.icon}
                    </span>
                    <span className="text-[20px] tracking-wide">
                      {menu.name}
                    </span>
                  </div>
                  <span className={`transition-transform duration-300 ${isMemberOpen ? 'rotate-180' : ''} ${isActive ? 'text-[#B5884D]' : 'text-gray-400'}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </button>
              ) : (
                // Jika tidak punya dropdown, gunakan <Link> seperti biasa
                <Link 
                  href={menu.path}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-[7px] transition-all
                    ${isActive 
                      ? 'bg-[#17130E] text-[#B5884D] border border-[#B5884D] font-semibold' 
                      : 'text-[#EAE1D8] hover:bg-black/50 hover:text-[#B5884D] border border-transparent font-medium'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <span className={`mr-4 ${isActive ? 'text-[#B5884D]' : 'text-gray-400'}`}>
                      {menu.icon}
                    </span>
                    <span className="text-[20px] tracking-wide">
                      {menu.name}
                    </span>
                  </div>
                </Link>
              )}

              {/* AREA SUB-MENU (DROPDOWN) */}
              {menu.hasDropdown && isMemberOpen && (
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
    </aside>
  );
}