'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useMe } from '@/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { data: me, isLoading } = useMe();

  useEffect(() => {
    if (isLoading) return;
    router.replace(me ? '/finance/dashboard' : '/login');
  }, [isLoading, me, router]);

  return (
    <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
      <p className="text-[#B5884D] font-bold text-lg">Memuat…</p>
    </div>
  );
}
