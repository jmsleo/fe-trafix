'use client';

import React from 'react';
import { useMonitoringSnapshot } from '@/hooks/useMonitoringStream';
import { formatTime } from '@/app/components/teknisi/constants';

function InfoRow({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#B5884D]/20 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`text-sm text-[#EAE1D8] font-medium ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

function ConnectedBadge({ connected }: { connected: boolean }) {
  return (
    <div className={`inline-flex items-center justify-center w-[97px] h-[23px] rounded-[9px] border text-[10px] font-semibold tracking-wide ${connected ? 'border-[#79FF8D] bg-[#00FF2659] text-[#79FF8D]' : 'border-[#FF8080] bg-[#FF000059] text-[#FF8080]'}`}>
      {connected ? 'TERHUBUNG' : 'TERPUTUS'}
    </div>
  );
}

export default function MonitoringMqttPage() {
  const { data: snapshot, isLoading, isError, refetch, dataUpdatedAt } = useMonitoringSnapshot();
  const data = snapshot?.mqtt;

  const mqtt = data?.mqtt;
  const tcp = data?.tcp;

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('id-ID')
    : '—';

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className="text-3xl font-bold text-[#EAE1D8]">Monitoring MQTT</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Auto-refresh · Terakhir: {lastUpdated}</span>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-sm font-medium text-[#17130E] bg-gradient-to-r from-[#BF8F51] to-[#523D22] rounded-[9px] hover:opacity-90 transition-opacity"
          >
            Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-gray-500 text-sm">Memuat status MQTT...</p>
      ) : isError ? (
        <div className="rounded-[10px] border border-[#B5884D]/50 bg-[#231F1A] p-6 text-center">
          <span className="text-[#FF5656]">Gagal memuat status MQTT.</span>{' '}
          <button onClick={() => refetch()} className="text-[#B5884D] hover:underline">Coba lagi</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-[10px] border border-[#B5884D]/60 bg-transparent overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-6 py-4 bg-[#231F1A] border-b border-[#B5884D]/30">
              <h2 className="text-lg font-bold text-[#BF8F51]">MQTT Broker</h2>
              <ConnectedBadge connected={mqtt?.connected ?? false} />
            </div>
            <div className="px-6 py-4">
              <InfoRow label="Host" value={mqtt?.host ?? '-'} mono />
              <InfoRow label="Port" value={mqtt?.port ?? '-'} mono />
              <InfoRow
                label="Uptime"
                value={
                  mqtt?.uptime_seconds != null
                    ? `${Math.floor(mqtt.uptime_seconds / 60)} menit`
                    : '-'
                }
              />
              <InfoRow label="Reconnect Count" value={mqtt?.reconnect_count ?? 0} />
              <InfoRow label="Disconnect Count" value={mqtt?.disconnect_count ?? 0} />
              <InfoRow label="Terakhir Terhubung" value={formatTime(mqtt?.last_connect_at)} />
              <InfoRow label="Terakhir Terputus" value={formatTime(mqtt?.last_disconnect_at)} />
            </div>
          </div>

          <div className="rounded-[10px] border border-[#B5884D]/60 bg-transparent overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-6 py-4 bg-[#231F1A] border-b border-[#B5884D]/30">
              <h2 className="text-lg font-bold text-[#BF8F51]">TCP Gateway</h2>
              <ConnectedBadge connected={(tcp?.connected_gates ?? 0) > 0} />
            </div>
            <div className="px-6 py-4">
              <InfoRow label="Enabled" value={tcp?.enabled ? 'Ya' : 'Tidak'} />
              <InfoRow label="Gate Terhubung" value={`${tcp?.connected_gates ?? 0} / ${tcp?.total_gates ?? 0}`} />
            </div>
          </div>
        </div>
      )}

      <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-[#EAE1D8]">
            <thead className="text-[11px] uppercase bg-[#231F1A] border-b border-[#B5884D]/30">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider text-center">GATE CODE</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">HOST</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">PORT</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">STATUS</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">LAST RX</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">HEARTBEAT FAIL</th>
              </tr>
            </thead>
            <tbody>
              {(tcp?.connections ?? []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">
                    Tidak ada koneksi TCP aktif.
                  </td>
                </tr>
              ) : (
                (tcp?.connections ?? []).map((conn, index) => (
                  <tr key={conn.gate_code} className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326] transition-colors`}>
                    <td className="px-6 py-4 text-center font-mono">{conn.gate_code}</td>
                    <td className="px-6 py-4 text-center font-mono">{conn.host}</td>
                    <td className="px-6 py-4 text-center font-mono">{conn.port}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <ConnectedBadge connected={conn.connected} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-xs">{formatTime(conn.last_rx_at)}</td>
                    <td className="px-6 py-4 text-center">{conn.heartbeat_fail_streak ?? 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}