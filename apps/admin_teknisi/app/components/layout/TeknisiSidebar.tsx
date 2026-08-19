'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  hasDropdown?: boolean;
  subMenus?: { name: string; path: string; icon: React.ReactNode }[];
}

const monitoringIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 14v3"/><path d="M11 10v7"/><path d="M15 7v10"/><path d="M19 4v13"/></svg>
);

const configIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
);

const manlessIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
);

const mqttIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/></svg>
);

const lprIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);

const readerIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="8" width="20" height="8" rx="2"/><path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/><circle cx="8" cy="12" r="1"/><circle cx="16" cy="12" r="1"/></svg>
);

const signageIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V2"/><path d="M6 6h12"/><rect x="8" y="6" width="8" height="6" rx="1"/></svg>
);

const gateIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h18"/><path d="M5 10l1.5-4.5A2 2 0 0 1 8.4 4h7.2a2 2 0 0 1 1.9 1.5L19 10"/><path d="M4 10v6a2 2 0 0 0 2 2h1"/><path d="M19 10v6a2 2 0 0 1-2 2h-1"/><circle cx="7" cy="14" r="1"/><circle cx="17" cy="14" r="1"/></svg>
);

const dashboardIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
);

const testIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="m11 8 3 3-3 3"/><path d="M8 8v6"/></svg>
);

const restartIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
);

const logIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><line x1="8" y1="9" x2="10" y2="9"/></svg>
);

const teknisiMenus: MenuItem[] = [
  {
    name: 'Dashboard',
    path: '/teknisi/dashboard',
    icon: dashboardIcon,
  },
  {
    name: 'Mengelola Gate',
    path: '/teknisi/gate',
    icon: gateIcon,
  },
  {
    name: 'Monitoring',
    path: '/teknisi/monitoring',
    icon: monitoringIcon,
    hasDropdown: true,
    subMenus: [
      { name: 'Device Manless', path: '/teknisi/monitoring/manless', icon: manlessIcon },
      { name: 'MQTT', path: '/teknisi/monitoring/mqtt', icon: mqttIcon },
      { name: 'Kamera LPR', path: '/teknisi/monitoring/kamera-lpr', icon: lprIcon },
      { name: 'Reader', path: '/teknisi/monitoring/reader', icon: readerIcon },
      { name: 'Signage', path: '/teknisi/monitoring/signage', icon: signageIcon },
    ],
  },
  {
    name: 'Konfigurasi',
    path: '/teknisi/config',
    icon: configIcon,
    hasDropdown: true,
    subMenus: [
      { name: 'Konfigurasi MQTT', path: '/teknisi/config/mqtt', icon: mqttIcon },
      { name: 'Konfigurasi Device', path: '/teknisi/config/device', icon: manlessIcon },
      { name: 'Konfigurasi Kamera LPR', path: '/teknisi/config/kamera-lpr', icon: lprIcon },
      { name: 'Konfigurasi Signage', path: '/teknisi/config/signage', icon: signageIcon },
    ],
  },
  {
    name: 'Test Connection',
    path: '/teknisi/test-connection',
    icon: testIcon,
  },
  {
    name: 'Restart Device',
    path: '/teknisi/restart-device',
    icon: restartIcon,
  },
  {
    name: 'Device Log',
    path: '/teknisi/device-log',
    icon: logIcon,
  },
];

export default function TeknisiSidebar() {
  const pathname = usePathname();
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  return (
    <aside className="w-[253px] ml-[20px] pt-[40px] flex flex-col shrink-0 min-h-screen">
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
            HPMS Teknisi Portal
          </p>
        </div>
      </div>

      <nav className="bg-[#231F1A] rounded-[10px] p-4 space-y-2 h-[874px] overflow-y-auto shadow-xl">
        {teknisiMenus.map((menu, index) => {
          const isActive = pathname.includes(menu.path);
          const isDropdownOpen = menu.hasDropdown && openDropdownIndex === index;

          return (
            <div key={index} className="flex flex-col">
              {menu.hasDropdown ? (
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
                  <div className="flex items-center">
                    <span className={`mr-4 ${isActive ? 'text-[#B5884D]' : 'text-gray-400'}`}>
                      {menu.icon}
                    </span>
                    <span className="text-[20px] tracking-wide">{menu.name}</span>
                  </div>
                  <span className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''} ${isActive ? 'text-[#B5884D]' : 'text-gray-400'}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </button>
              ) : (
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
                    <span className="text-[20px] tracking-wide">{menu.name}</span>
                  </div>
                </Link>
              )}

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
                        <span className="mr-3 scale-90">{subMenu.icon}</span>
                        <span className="text-[15px]">{subMenu.name}</span>
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