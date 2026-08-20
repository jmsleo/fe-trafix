import React from 'react';
// Pastikan path import ini sesuai dengan lokasi file Anda
import Sidebar from '@/app/components/layout/Sidebar';
import Header from '@/app/components/layout/Header'; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#14110E] text-[#EAE1D8] font-sans overflow-hidden">
      
      {/* 1. SIDEBAR (Kiri) */}
      <Sidebar />
      
      {/* 2. AREA KANAN (Header + Konten) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
       {/* HEADER (Atas) */}
        <Header 
          title="Dashboard Executive" 
          userName="Aku Adit" 
          userRole="Admin" 
        />
        
        {/* KONTEN UTAMA (Bawah Header) */}
        {/* 'overflow-y-auto' membuat area ini bisa di-scroll jika isinya panjang, 
            sementara Sidebar dan Header tetap diam (fixed) */}
        <main className="flex-1 p-8 overflow-y-auto bg-[#14110E]">
          {children}
        </main>
        
      </div>
    </div>
  );
}