'use client';

import React, { useCallback, useEffect, useSyncExternalStore } from 'react';
import AdminSidebar from '../components/layout/AdminSidebar';
import Header from '../components/layout/Header';
import { usePathname, useRouter } from 'next/navigation';
import { useMe, useLogout, useAuthEvents } from '@/hooks/useAuth';

const emptySubscribe = () => () => {};

function homePathFor(role?: string): string {
  switch (role) {
    case 'teknisi':
      return '/teknisi/dashboard';
    case 'admin':
    default:
      return '/admin/tarif-parkir';
  }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: me, isLoading } = useMe();
  const logout = useLogout();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useAuthEvents(useCallback(() => {
    router.push('/');
  }, [router]));

  useEffect(() => {
    if (!mounted || isLoading) return;
    if (!me) {
      router.push('/');
    } else if (me.role !== 'admin') {
      router.push(homePathFor(me.role));
    }
  }, [mounted, isLoading, me, router]);

  const getPageTitle = () => {
    if (pathname.includes('/tarif-parkir')) return 'Dashboard Admin';
    return 'Dashboard Admin';
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
        <AdminSidebar />
      </div>

      <div className="flex flex-col flex-1 p-4 lg:pl-12 lg:pr-10 lg:pt-[40px] w-full max-w-full">
        <Header
          title={getPageTitle()}
          userName={me.name}
          userRole={me.role}
          onLogout={handleLogout}
        />
        
        <main className="mt-4 pb-10 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
