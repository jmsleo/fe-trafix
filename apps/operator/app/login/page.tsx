'use client';

import React, { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin, useMe } from '@/hooks/useAuth';
import { usePosRefs, useStartPosSession } from '@/hooks/usePos';
import { getApiErrorMessage } from '@/lib/api/errors';

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const startSession = useStartPosSession();
  const { data: me, isLoading: meLoading } = useMe();
  const { data: refs, isLoading: refsLoading } = usePosRefs();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [shiftId, setShiftId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!meLoading && me) {
      router.replace('/dashboard-operator');
    }
  }, [meLoading, me, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Username dan kata sandi wajib diisi.');
      return;
    }
    if (!shiftId) {
      setError('Pilih shift kerja terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    try {
      await login.mutateAsync({ username, password });
      try {
        await startSession.mutateAsync({ shift_id: shiftId });
      } catch (sessionErr: unknown) {
        const status = (sessionErr as { response?: { status?: number } })?.response?.status;
        if (status !== 409) {
          throw sessionErr;
        }
      }
      router.replace('/dashboard-operator');
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 403) {
        setError('Akun ini bukan operator. Gunakan akun operator untuk masuk.');
      } else {
        setError(getApiErrorMessage(err, 'Login gagal. Periksa kembali username dan kata sandi Anda.'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0908] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[1100px] flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8">

        {/* --- Bagian Kiri: Logo & Tagline --- */}
        <div className="flex items-center gap-4">
          <img
            src="/image/logo-fp.svg"
            alt="Fix Parking Logo"
            className="w-[88px] h-[88px] object-cover rounded-xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/88x88/B5884D/17130E?text=P';
            }}
          />
          <div className="flex flex-col justify-center">
            <h1
              className="font-extrabold text-[#FFF4E5] tracking-wide text-[52px] leading-none mb-1"
              style={{
                fontFamily: "'Rubik', sans-serif",
                textShadow: '0px 0px 20px rgba(191, 143, 81, 0.8)',
              }}
            >
              Fix Parking
            </h1>
            <p className="text-[#AB8149] text-[12px] font-bold tracking-[0.15em] uppercase">
              Effortless Parking, Premium Experience
            </p>
          </div>
        </div>

        {/* --- Bagian Kanan: Form Login --- */}
        <div className="w-full max-w-[526px] relative flex justify-center">

          {/* Card Form */}
          <div
            className="relative rounded-[24px] px-10 py-12 flex flex-col justify-center w-full h-auto"
            style={{
              background: 'conic-gradient(from 80deg at 50% 82%, rgba(35, 31, 26, 0.5) 13%, rgba(191, 143, 81, 0.5) 63%, rgba(35, 31, 26, 0.5) 100%)',
              boxShadow: '15px 15px 40px rgba(191, 143, 81, 0.25), 30px 30px 80px rgba(191, 143, 81, 0.15)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <h2 className="text-[28px] font-bold text-center text-[#E7DED5] mb-8">
              Masuk ke Akun Anda
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Input Username */}
              <div className="space-y-2">
                <label className="block text-[17px] font-semibold text-[#FFFFFF]">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#EAE1D8]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Username operator"
                    autoComplete="username"
                    className="w-full h-[50px] pl-12 pr-4 bg-[#595148] border-none rounded-[12px] text-[#EAE1D8] text-[15px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#BF8F51] transition-all"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="space-y-2">
                <label className="block text-[17px] font-semibold text-[#FFFFFF]">Kata Sandi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#EAE1D8]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full h-[50px] pl-12 pr-4 bg-[#595148] border-none rounded-[12px] text-[#EAE1D8] text-[15px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#BF8F51] transition-all"
                  />
                </div>
              </div>

              {/* Select Shift Kerja */}
              <div className="space-y-2">
                <label className="block text-[17px] font-semibold text-[#FFFFFF]">Pilih Shift Kerja</label>
                <div className="relative">
                  <select
                    value={shiftId}
                    onChange={(e) => {
                      setShiftId(e.target.value);
                      if (error) setError(null);
                    }}
                    className="w-full h-[50px] pl-4 pr-10 bg-[#16120E] border border-[#BF8F51]/40 rounded-[12px] text-[#BF8F51] text-[17px] focus:outline-none focus:border-[#BF8F51] transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Pilih Shift</option>
                    {refsLoading && <option disabled>Memuat shift…</option>}
                    {(refs?.shifts ?? []).map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#BF8F51]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6,9 18,9 12,16"></polygon>
                    </svg>
                  </div>
                </div>
              </div>

              {/* UI Error Message */}
              {error && (
                <div className="flex items-start gap-2 pt-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF5656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <p className="text-[#FF5656] text-[15px] leading-snug">{error}</p>
                </div>
              )}

              {/* Tombol Submit */}
              <div className={`flex justify-center ${error ? 'pt-2' : 'pt-4'}`}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-[160px] h-[48px] bg-black hover:bg-[#111] text-[#BF8F51] text-[24px] font-semibold rounded-[10px] transition-colors shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex items-center justify-center relative z-10 disabled:opacity-50"
                >
                  {submitting ? 'Memproses…' : 'Masuk'}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}