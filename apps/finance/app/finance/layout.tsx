'use client';

import React, { useCallback, useEffect, useSyncExternalStore } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Sidebar from '@/app/components/layout/Sidebar';
import Header from '@/app/components/layout/Header';
import { useAuthEvents, useLogout, useMe } from '@/hooks/useAuth';
import { tokenStorage } from '@/lib/api/client';

const emptySubscribe = () => () => {};

const PAGE_TITLES: Record<string, string> = {
  '/finance/dashboard': 'Dashboard Executive',
  '/finance/kinerja-operator': 'Kinerja Operator',
  '/finance/laporan-akses-gate': 'Laporan Akses Gate',
  '/finance/laporan-member': 'Laporan Member',
  '/finance/laporan-pendapatan': 'Laporan Pendapatan',
  '/finance/laporan-transaksi': 'Laporan Transaksi',
  '/finance/ringkasan-kendaraan': 'Ringkasan Kendaraan',
  '/finance/tiket-gantung': 'Tiket Gantung',
};

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: me, isLoading } = useMe();
  const logout = useLogout();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useAuthEvents(useCallback(() => {
    router.push('/login');
  }, [router]));

  useEffect(() => {
    if (mounted && !isLoading && !me) {
      router.push('/login');
    }
  }, [mounted, isLoading, me, router]);

  useEffect(() => {
    if (mounted && !isLoading && me && me.role !== 'finance') {
      // Bukan role finance: sesi tidak dipakai di portal ini.
      tokenStorage.clearTokens();
      queryClient.clear();
      router.push('/login');
    }
  }, [mounted, isLoading, me, queryClient, router]);

  const getPageTitle = () => PAGE_TITLES[pathname] ?? 'Dashboard Executive';

  const handleLogout = useCallback(() => {
    logout.mutate(undefined, {
      onSuccess: () => router.push('/login'),
    });
  }, [logout, router]);

  if (!mounted || isLoading || !me || me.role !== 'finance') {
    return (
      <div className="flex min-h-screen bg-[#14110E] items-center justify-center">
        <p className="text-[#BF8F51] text-sm">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#14110E] text-[#EAE1D8] font-sans overflow-hidden">

      {/* 1. SIDEBAR (Kiri) */}
      <Sidebar />

      {/* 2. AREA KANAN (Header + Konten) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

       {/* HEADER (Atas) */}
        <Header
          title={getPageTitle()}
          userName={me.name}
          userRole={me.role}
          onLogout={handleLogout}
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
