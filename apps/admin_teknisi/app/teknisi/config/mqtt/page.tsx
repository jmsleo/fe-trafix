'use client';

import React, { useState } from 'react';
import Button from '@/app/components/ui/Button';
import { useMqttConfig, useUpdateMqttConfig } from '@/hooks/useSystem';
import { getApiErrorMessage } from '@/lib/api/errors';
import type { MqttConfig } from '@/lib/api/types';

interface MqttForm {
  host: string;
  port: string;
  keepalive: string;
  username: string;
  password: string;
  client_id_prefix: string;
}

function toForm(data: MqttConfig): MqttForm {
  return {
    host: data.host ?? '',
    port: String(data.port ?? 1883),
    keepalive: String(data.keepalive ?? 60),
    username: data.username ?? '',
    password: data.password ?? '',
    client_id_prefix: data.client_id_prefix ?? '',
  };
}

function MqttConfigForm({ initial }: { initial: MqttForm }) {
  const updateMqtt = useUpdateMqttConfig();
  const [formData, setFormData] = useState<MqttForm>(initial);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSimpan = () => {
    setFormError(null);
    setSuccess(null);

    if (!formData.host.trim()) {
      setFormError('Host MQTT wajib diisi.');
      return;
    }
    const port = Number(formData.port);
    if (!Number.isFinite(port) || port <= 0 || port > 65535) {
      setFormError('Port harus antara 1 - 65535.');
      return;
    }
    const keepalive = Number(formData.keepalive);
    if (!Number.isFinite(keepalive) || keepalive <= 0) {
      setFormError('Keepalive harus berupa angka positif.');
      return;
    }

    updateMqtt.mutate(
      {
        host: formData.host.trim(),
        port,
        keepalive,
        username: formData.username.trim() || null,
        password: formData.password || null,
        client_id_prefix: formData.client_id_prefix.trim() || 'trafix',
      },
      {
        onSuccess: () => {
          setSuccess('Konfigurasi MQTT berhasil disimpan.');
          setFormError(null);
        },
        onError: (error) =>
          setFormError(getApiErrorMessage(error, 'Gagal menyimpan konfigurasi MQTT.')),
      },
    );
  };

  return (
    <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent max-w-2xl">
      <div className="px-6 py-4 bg-[#231F1A] border-b border-[#B5884D]/30">
        <h2 className="text-lg font-bold text-[#BF8F51]">Pengaturan Broker MQTT</h2>
        <p className="text-xs text-gray-500 mt-1">
          Perubahan konfigurasi akan{' '}
          <span className="text-[#FFC15C]">diterapkan saat aplikasi di-restart</span>.
        </p>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Host</label>
            <input
              type="text"
              name="host"
              value={formData.host}
              onChange={handleInputChange}
              placeholder="Contoh: 192.168.1.100"
              className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Port</label>
            <input
              type="number"
              name="port"
              value={formData.port}
              onChange={handleInputChange}
              placeholder="1883"
              className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Keepalive (detik)</label>
            <input
              type="number"
              name="keepalive"
              value={formData.keepalive}
              onChange={handleInputChange}
              placeholder="60"
              className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Client ID Prefix</label>
            <input
              type="text"
              name="client_id_prefix"
              value={formData.client_id_prefix}
              onChange={handleInputChange}
              placeholder="trafix"
              className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Kosongkan jika tanpa autentikasi"
              className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Kosongkan jika tanpa autentikasi"
              className="w-full px-4 py-2.5 text-sm bg-black border border-[#B5884D]/50 rounded-[7px] text-[#EAE1D8] focus:outline-none focus:border-[#B5884D]"
            />
          </div>
        </div>

        {formError && <p className="text-sm text-[#FF5656]">{formError}</p>}
        {success && <p className="text-sm text-[#79FF8D]">{success}</p>}
      </div>

      <div className="flex justify-end gap-3 p-5 border-t border-[#B5884D]/30 bg-[#231F1A]">
        <Button
          onClick={handleSimpan}
          className="px-6 !h-auto py-2.5 !w-auto"
          disabled={updateMqtt.isPending}
        >
          {updateMqtt.isPending ? 'Menyimpan...' : 'Simpan Konfigurasi'}
        </Button>
      </div>
    </div>
  );
}

export default function KonfigurasiMqttPage() {
  const { data, isLoading, isError, refetch } = useMqttConfig();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-[#EAE1D8]">Konfigurasi MQTT</h1>

      {isLoading ? (
        <p className="text-gray-500 text-sm">Memuat konfigurasi MQTT...</p>
      ) : isError ? (
        <div className="rounded-[10px] border border-[#B5884D]/50 bg-[#231F1A] p-6 text-center">
          <span className="text-[#FF5656]">Gagal memuat konfigurasi.</span>{' '}
          <button onClick={() => refetch()} className="text-[#B5884D] hover:underline">
            Coba lagi
          </button>
        </div>
      ) : data ? (
        <MqttConfigForm key={data.host + data.port} initial={toForm(data)} />
      ) : null}
    </div>
  );
}