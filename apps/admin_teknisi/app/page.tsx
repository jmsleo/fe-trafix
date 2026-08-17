'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Poppins } from 'next/font/google';
import { useEffect, useState, type FormEvent } from 'react';
import Button from '@/app/components/ui/Button';
import InputField from '@/app/components/ui/InputField';
import { useLogin, useMe } from '@/hooks/useAuth';
import { AxiosError } from 'axios';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const { data: me, isLoading: meLoading } = useMe();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!meLoading && me) {
      router.push('/admin/tarif-parkir');
    }
  }, [meLoading, me, router]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Username dan kata sandi wajib diisi.');
      return;
    }

    login.mutate(
      { username, password },
      {
        onSuccess: () => {
          router.push('/admin/tarif-parkir');
        },
        onError: (err) => {
          const axiosError = err as AxiosError<{ detail?: string }>;
          setError(
            axiosError?.response?.data?.detail ?? 'Login gagal. Periksa kembali username dan kata sandi Anda.',
          );
        },
      },
    );
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-black px-6 ${poppins.className}`}>
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center justify-items-center">
        <div className="flex justify-center">
          <Image
            src="/image/logo.png"
            width={600}
            height={100}
            alt="Trafix"
            priority
            className="max-w-full h-auto"
          />
        </div>

        <div className="w-full rounded-[16px] bg-[linear-gradient(110deg,#231F1A_0%,#231F1A_50%,#BF8F51_200%)] shadow-[0_0_30px_rgba(191,143,81,0.25)] p-8 md:p-10">
          <h1 className="text-[28px] md:text-[32px] font-bold text-[E7DED5] text-center tracking-wide mb-8">
            Masuk ke Akun Anda
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-[#EAE1D8] tracking-wide">
                Username
              </label>
              <InputField
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[#EAE1D8] tracking-wide">
                Kata Sandi
              </label>
              <InputField
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                autoComplete="current-password"
              />
            </div>

            {error && <p className="text-sm text-[#FF5656]">{error}</p>}

            <Button type="submit" disabled={login.isPending} className="w-full h-[48px] !w-full">
              {login.isPending ? 'Memproses…' : 'Masuk'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
