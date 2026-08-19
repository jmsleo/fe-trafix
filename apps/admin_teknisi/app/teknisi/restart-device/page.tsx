'use client';

import React, { useState } from 'react';
import DeviceActionPanel from '@/app/components/teknisi/DeviceActionPanel';
import { useRestartDevice } from '@/hooks/useMonitoring';
import { getApiErrorMessage } from '@/lib/api/errors';
import type { RestartResult } from '@/lib/api/types';

const STATUS_CLS: Record<string, string> = {
  restarted: 'border-[#79FF8D] bg-[#00FF2659] text-[#79FF8D]',
  failed: 'border-[#FF8080] bg-[#FF000059] text-[#FF8080]',
  not_supported: 'border-[#FFC15C] bg-[#FF990059] text-[#FFC15C]',
};

const STATUS_LABEL: Record<string, string> = {
  restarted: 'RESTARTED',
  failed: 'FAILED',
  not_supported: 'NOT SUPPORTED',
};

export default function RestartDevicePage() {
  const restart = useRestartDevice();
  const [result, setResult] = useState<RestartResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = (device: { id: string }) => {
    setError(null);
    setResult(null);
    restart.mutate(device.id, {
      onSuccess: (res) => setResult(res),
      onError: (err) => setError(getApiErrorMessage(err, 'Gagal merestart device.')),
    });
  };

  const renderResult = (
    <>
      {error && <p className="text-sm text-[#FF5656]">{error}</p>}

      {result && (
        <div className="rounded-[9px] border border-[#B5884D]/40 bg-[#231F1A] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#EAE1D8]">{result.name}</p>
            <div className={`inline-flex items-center justify-center w-[110px] h-[23px] rounded-[9px] border text-[10px] font-semibold tracking-wide ${STATUS_CLS[result.status] ?? STATUS_CLS.failed}`}>
              {STATUS_LABEL[result.status] ?? result.status}
            </div>
          </div>
          {result.detail && <p className="text-xs text-gray-400">{result.detail}</p>}
        </div>
      )}
    </>
  );

  return (
    <DeviceActionPanel
      title="Restart Device"
      description="Kirim perintah restart ke device. Controller di-restart melalui koneksi TCP, sedangkan LPR / camera hanya didukung jika konfigurasi reboot_path tersedia."
      actionLabel="Restart Device"
      pendingLabel="Mengirim perintah restart..."
      isPending={restart.isPending}
      onRun={handleRun}
      renderResult={renderResult}
    />
  );
}