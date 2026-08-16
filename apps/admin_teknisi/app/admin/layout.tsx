'use client';

import React from 'react';
import AdminSidebar from '../components/layout/AdminSidebar';
import Header from '../components/layout/Header';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.includes('/tarif-parkir')) return 'Dashboard Admin';
    return 'Dashboard Admin';
  };

  return (
    <div className="flex min-h-screen bg-[#17130E] overflow-x-hidden">

      <div className="hidden lg:flex">
        <AdminSidebar />
      </div>

      <div className="flex flex-col flex-1 p-4 lg:pl-12 lg:pr-10 lg:pt-[40px] w-full max-w-full">
        <Header 
          title={getPageTitle()} 
          userName="Aku Adit" 
          userRole="Admin" 
        />
        
        <main className="mt-4 pb-10 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}