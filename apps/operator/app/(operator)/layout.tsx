'use client';

import React, { useCallback, useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthEvents, useMe } from '@/hooks/useAuth';
import { tokenStorage } from '@/lib/api/client';

const emptySubscribe = () => () => {};

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: me, isLoading } = useMe();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const handleUnauthorized = useCallback(() => {
    queryClient.clear();
    tokenStorage.clearTokens();
    router.replace('/login');
  }, [queryClient, router]);

  useAuthEvents(handleUnauthorized);

  useEffect(() => {
    if (!mounted || isLoading) return;
    if (!me) {
      router.replace('/login');
    } else if (me.role !== 'operator') {
      // Bukan role operator: sesi tidak dipakai di portal ini.
      tokenStorage.clearTokens();
      queryClient.clear();
      router.replace('/login');
    }
  }, [mounted, isLoading, me, queryClient, router]);

  if (!mounted || isLoading || !me || me.role !== 'operator') {
    return (
      <div className="min-h-screen bg-[#17130E] flex items-center justify-center">
        <p className="text-[#BF8F51] font-bold text-lg">Memuat…</p>
      </div>
    );
  }

  return <>{children}</>;
}
