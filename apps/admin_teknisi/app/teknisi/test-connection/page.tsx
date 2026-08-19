'use client';

import React, { useState } from 'react';
import DeviceActionPanel from '@/app/components/teknisi/DeviceActionPanel';
import { useTestDeviceConnection } from '@/hooks/useMonitoring';
import { getApiErrorMessage } from '@/lib/api/errors';
import type { TestResult } from '@/lib/api/types';

export default function TestConnectionPage() {
  const test = useTestDeviceConnection();
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = (device: { id: string }) => {
    setError(null);
    setResult(null);
    test.mutate(device.id, {
      onSuccess: (res) => setResult(res),
      onError: (err) => setError(getApiErrorMessage(err, 'Gagal melakukan test koneksi.')),
    });
  };

  const renderResult = (
    <>
      {error && <p className="text-sm text-[#FF5656]">{error}</p>}

      {result && (
        <div className="rounded-[9px] border border-[#B5884D]/40 bg-[#231F1A] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#EAE1D8]">{result.name}</p>
            <div className={`inline-flex items-center justify-center w-[97px] h-[23px] rounded-[9px] border text-[10px] font-semibold tracking-wide ${result.reachable ? 'border-[#79FF8D] bg-[#00FF2659] text-[#79FF8D]' : 'border-[#FF8080] bg-[#FF000059] text-[#FF8080]'}`}>
              {result.reachable ? 'REACHABLE' : 'TIDAK REACHABLE'}
            </div>
          </div>
          {result.latency_ms != null && (
            <p className="text-xs text-gray-400">Latensi: {result.latency_ms} ms</p>
          )}
          {result.status_code != null && (
            <p className="text-xs text-gray-400">HTTP Status: {result.status_code}</p>
          )}
          {result.detail && <p className="text-xs text-gray-400">{result.detail}</p>}
        </div>
      )}
    </>
  );

  return (
    <DeviceActionPanel
      title="Test Connection"
      description="Uji koneksi device secara langsung (ping / HTTP) untuk memastikan device dapat dijangkau oleh server."
      actionLabel="Test Connection"
      pendingLabel="Menjalankan test..."
      isPending={test.isPending}
      onRun={handleRun}
      renderResult={renderResult}
    />
  );
}