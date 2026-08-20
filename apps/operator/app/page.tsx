'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useMe } from '@/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { data: me, isLoading } = useMe();

  useEffect(() => {
    if (isLoading) return;
    router.replace(me ? '/dashboard-operator' : '/login');
  }, [isLoading, me, router]);

  return (
    <div className="min-h-screen bg-[#17130E] flex items-center justify-center">
      <p className="text-[#BF8F51] font-bold text-lg">Memuat…</p>
    </div>
  );
}