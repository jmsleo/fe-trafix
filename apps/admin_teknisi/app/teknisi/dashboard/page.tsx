'use client';

import React, { useMemo } from 'react';
import { useMonitoringSnapshot } from '@/hooks/useMonitoringStream';

const kindLabels: Record<string, string> = {
  controller: 'Controller',
  lpr: 'Kamera LPR',
  camera: 'Camera',
  reader: 'Reader',
  signage: 'Signage',
  other: 'Lainnya',
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    online: {
      label: 'ONLINE',
      cls: 'border-[#79FF8D] bg-[#00FF2659] text-[#79FF8D]',
    },
    offline: {
      label: 'OFFLINE',
      cls: 'border-[#FF8080] bg-[#FF000059] text-[#FF8080]',
    },
    trouble: {
      label: 'TROUBLE',
      cls: 'border-[#FFC15C] bg-[#FF990059] text-[#FFC15C]',
    },
  };
  const s = map[status] ?? map.offline;
  return (
    <div className={`inline-flex items-center justify-center w-[97px] h-[23px] rounded-[9px] border text-[10px] font-semibold tracking-wide ${s.cls}`}>
      {s.label}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent = 'text-[#BF8F51]',
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-[12px] border border-[#B5884D]/50 bg-[#231F1A] p-5 shadow-lg">
      <p className="text-[13px] font-medium text-gray-400 tracking-wide">{label}</p>
      <p className={`mt-2 text-[30px] font-bold leading-none ${accent}`}>{value}</p>
      {sub && <p className="mt-2 text-[12px] text-gray-500">{sub}</p>}
    </div>
  );
}

export default function TeknisiDashboardPage() {
  const { data: snapshot, isLoading, refetch, dataUpdatedAt } = useMonitoringSnapshot();
  const devicesPage = snapshot?.devices;
  const mqtt = snapshot?.mqtt;

  const stats = useMemo(() => {
    const items = devicesPage?.items ?? [];
    const byKind: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    for (const item of items) {
      byKind[item.kind] = (byKind[item.kind] ?? 0) + 1;
      byStatus[item.status] = (byStatus[item.status] ?? 0) + 1;
    }
    return { byKind, byStatus, total: items.length };
  }, [devicesPage]);

  const problemDevices = useMemo(
    () => (devicesPage?.items ?? []).filter((d) => d.status !== 'online'),
    [devicesPage],
  );

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('id-ID')
    : '—';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className="text-3xl font-bold text-[#EAE1D8]">Dashboard Teknisi</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Terakhir diperbarui: {lastUpdated}</span>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-sm font-medium text-[#17130E] bg-gradient-to-r from-[#BF8F51] to-[#523D22] rounded-[9px] hover:opacity-90 transition-opacity"
          >
            Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-gray-500 text-sm">Memuat data monitoring...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Device" value={stats.total} sub="Semua perangkat terdaftar" />
            <StatCard
              label="Device Online"
              value={stats.byStatus.online ?? 0}
              accent="text-[#79FF8D]"
              sub={`Offline: ${stats.byStatus.offline ?? 0}`}
            />
            <StatCard
              label="Device Bermasalah"
              value={stats.byStatus.trouble ?? 0}
              accent="text-[#FFC15C]"
              sub="Perlu perhatian teknisi"
            />
            <StatCard
              label="MQTT Broker"
              value={mqtt?.mqtt.connected ? 'Terhubung' : 'Terputus'}
              accent={mqtt?.mqtt.connected ? 'text-[#79FF8D]' : 'text-[#FF5656]'}
              sub={
                mqtt?.mqtt.connected && mqtt?.mqtt.host
                  ? `${mqtt.mqtt.host}:${mqtt.mqtt.port ?? ''}`
                  : 'Tidak ada koneksi'
              }
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(kindLabels).map(([kind, label]) => (
              <div
                key={kind}
                className="rounded-[10px] border border-[#B5884D]/30 bg-transparent p-4 text-center"
              >
                <p className="text-[24px] font-bold text-[#BF8F51]">{stats.byKind[kind] ?? 0}</p>
                <p className="text-[12px] text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent w-full">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-[#EAE1D8]">
                <thead className="text-[11px] uppercase bg-[#231F1A] border-b border-[#B5884D]/30">
                  <tr>
                    <th className="px-6 py-4 font-medium tracking-wider text-center">NAMA DEVICE</th>
                    <th className="px-6 py-4 font-medium tracking-wider text-center">TIPE</th>
                    <th className="px-6 py-4 font-medium tracking-wider text-center">GATE</th>
                    <th className="px-6 py-4 font-medium tracking-wider text-center">IP ADDRESS</th>
                    <th className="px-6 py-4 font-medium tracking-wider text-center">STATUS</th>
                    <th className="px-6 py-4 font-medium tracking-wider text-center">DETAIL</th>
                  </tr>
                </thead>
                <tbody>
                  {(devicesPage?.items ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">
                        Belum ada device terdaftar.
                      </td>
                    </tr>
                  ) : (
                    (devicesPage?.items ?? []).map((d, index) => (
                      <tr
                        key={d.id}
                        className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326] transition-colors`}
                      >
                        <td className="px-6 py-4 text-center">{d.name}</td>
                        <td className="px-6 py-4 text-center">{kindLabels[d.kind] ?? d.type}</td>
                        <td className="px-6 py-4 text-center">{d.gate_code ?? d.gate_name ?? '-'}</td>
                        <td className="px-6 py-4 text-center">{d.ip_address}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <StatusBadge status={d.status} />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-xs text-gray-400">
                          {d.probe?.detail ?? '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[10px] border border-[#B5884D]/60 overflow-hidden shadow-lg bg-transparent w-full">
            <div className="flex items-center justify-between px-6 py-4 bg-[#231F1A] border-b border-[#B5884D]/30">
              <h2 className="text-lg font-bold text-[#FFC15C]">Daftar Device Bermasalah</h2>
              <span className="text-sm text-gray-400">{problemDevices.length} perangkat</span>
            </div>
            {problemDevices.length === 0 ? (
              <p className="px-6 py-8 text-center text-gray-500 text-sm">
                Semua device dalam kondisi baik.
              </p>
            ) : (
              <div className="divide-y divide-[#B5884D]/20">
                {problemDevices.map((d) => (
                  <div key={d.id} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <p className="text-sm font-semibold text-[#EAE1D8]">{d.name}</p>
                      <p className="text-xs text-gray-500">
                        {kindLabels[d.kind]} · {d.gate_code ?? '-'} · {d.ip_address}
                      </p>
                    </div>
                    <StatusBadge status={d.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}