'use client';

import React, { useCallback, useEffect, useSyncExternalStore } from 'react';
import TeknisiSidebar from '../components/layout/TeknisiSidebar';
import Header from '../components/layout/Header';
import { usePathname, useRouter } from 'next/navigation';
import { useMe, useLogout, useAuthEvents } from '@/hooks/useAuth';

const emptySubscribe = () => () => {};

function homePathFor(role?: string): string {
  switch (role) {
    case 'admin':
      return '/admin/tarif-parkir';
    case 'teknisi':
      return '/teknisi/dashboard';
    default:
      return '/';
  }
}

export default function TeknisiLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: me, isLoading } = useMe();
  const logout = useLogout();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useAuthEvents(
    useCallback(() => {
      router.push('/');
    }, [router]),
  );

  useEffect(() => {
    if (!mounted || isLoading) return;
    if (!me) {
      router.push('/');
    } else if (me.role !== 'teknisi') {
      router.push(homePathFor(me.role));
    }
  }, [mounted, isLoading, me, router]);

  const getPageTitle = () => {
    if (pathname.includes('/gate')) return 'Mengelola Gate';
    if (pathname.includes('/monitoring')) return 'Monitoring Device';
    if (pathname.includes('/config')) return 'Konfigurasi Device';
    if (pathname.includes('/test-connection')) return 'Test Connection';
    if (pathname.includes('/restart-device')) return 'Restart Device';
    if (pathname.includes('/device-log')) return 'Device Log';
    return 'Dashboard Teknisi';
  };

  const handleLogout = useCallback(() => {
    logout.mutate(undefined, {
      onSuccess: () => router.push('/'),
    });
  }, [logout, router]);

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen bg-[#17130E] items-center justify-center">
        <p className="text-[#B5884D] text-sm">Memuat...</p>
      </div>
    );
  }

  if (!me) return null;

  return (
    <div className="flex min-h-screen bg-[#17130E] overflow-x-hidden">
      <div className="hidden lg:flex">
        <TeknisiSidebar />
      </div>

      <div className="flex flex-col flex-1 p-4 lg:pl-12 lg:pr-10 lg:pt-[40px] w-full max-w-full">
        <Header
          title={getPageTitle()}
          userName={me.name}
          userRole={me.role}
          onLogout={handleLogout}
        />

        <main className="mt-4 pb-10 w-full">{children}</main>
      </div>
    </div>
  );
}