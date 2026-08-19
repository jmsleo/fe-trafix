'use client';

import React from 'react';
import type { DeviceMonitorItem } from '@/lib/api/types';
import { KIND_LABELS, formatTime } from './constants';
import StatusBadge from './StatusBadge';

interface DeviceMonitorTableProps {
  items: DeviceMonitorItem[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyText?: string;
  renderAction?: (device: DeviceMonitorItem) => React.ReactNode;
}

export default function DeviceMonitorTable({
  items,
  isLoading,
  isError,
  onRetry,
  emptyText = 'Belum ada device.',
  renderAction,
}: DeviceMonitorTableProps) {
  return (
    <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-[#EAE1D8]">
          <thead className="text-[11px] uppercase bg-[#231F1A] border-b border-[#B5884D]/30">
            <tr>
              <th className="px-6 py-4 font-medium tracking-wider text-center">NAMA DEVICE</th>
              <th className="px-6 py-4 font-medium tracking-wider text-center">TIPE</th>
              <th className="px-6 py-4 font-medium tracking-wider text-center">GATE</th>
              <th className="px-6 py-4 font-medium tracking-wider text-center">IP ADDRESS</th>
              <th className="px-6 py-4 font-medium tracking-wider text-center">LAST HEARTBEAT</th>
              <th className="px-6 py-4 font-medium tracking-wider text-center">STATUS</th>
              <th className="px-6 py-4 font-medium tracking-wider text-center">DETAIL</th>
              {renderAction && (
                <th className="px-6 py-4 font-medium tracking-wider text-center">AKSI</th>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={renderAction ? 8 : 7} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">
                  Memuat data device...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={renderAction ? 8 : 7} className="px-6 py-8 text-center bg-[#231F1A]">
                  <span className="text-[#FF5656]">Gagal memuat data.</span>{' '}
                  {onRetry && (
                    <button onClick={onRetry} className="text-[#B5884D] hover:underline">
                      Coba lagi
                    </button>
                  )}
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={renderAction ? 8 : 7} className="px-6 py-8 text-center text-gray-500 bg-[#231F1A]">
                  {emptyText}
                </td>
              </tr>
            ) : (
              items.map((d, index) => (
                <tr
                  key={d.id}
                  className={`${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-[#231F1A]'} hover:bg-[#3d3326] transition-colors`}
                >
                  <td className="px-6 py-4 text-center">{d.name}</td>
                  <td className="px-6 py-4 text-center">{KIND_LABELS[d.kind] ?? d.type}</td>
                  <td className="px-6 py-4 text-center">{d.gate_code ?? d.gate_name ?? '-'}</td>
                  <td className="px-6 py-4 text-center">{d.ip_address}</td>
                  <td className="px-6 py-4 text-center text-xs">{formatTime(d.last_heartbeat)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <StatusBadge status={d.status} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-gray-400">
                    {d.probe?.detail ?? d.signage_status ?? '-'}
                  </td>
                  {renderAction && (
                    <td className="px-6 py-4">
                      <div className="flex justify-center">{renderAction(d)}</div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}