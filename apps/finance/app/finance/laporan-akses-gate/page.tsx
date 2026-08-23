'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ExportButtons from '@/app/components/ExportButtons';
import { useGateEvents } from '@/hooks/useFinanceReports';
import type { GateEventReportItem } from '@/lib/api/types';
import { formatDateTime } from '@/lib/format';

const PAGE_SIZE = 15;

const METHOD_LABELS: Record<string, string> = {
  gatein: 'Gate In',
  'gatein-card': 'Gate In (Kartu)',
  'lpr-gatein': 'LPR Gate In',
  'lpr-gateinimage': 'LPR Gate In (Foto)',
  gatein_manual: 'Gate In Manual',
  gateout: 'Gate Out',
  gateout_notfound: 'Gate Out (Tiket Tidak Ditemukan)',
  gateout_plate_mismatch: 'Gate Out (Plat Tidak Cocok)',
  gateout_lost: 'Gate Out (Tiket Hilang)',
  'gateout-rfid': 'Gate Out (RFID)',
  gateout_rfid_notfound: 'Gate Out RFID (Tidak Ditemukan)',
  gateout_rfid_used: 'Gate Out RFID (Sudah Terpakai)',
  void: 'Void Transaksi',
  reprint: 'Cetak Ulang',
  receipt: 'Cetak Struk',
};

export default function LaporanAksesGatePage() {
  // State untuk mengontrol muncul/hilangnya pop-up Filter
  const [showFilter, setShowFilter] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<GateEventReportItem | null>(null);

  // Class bawaan untuk card dengan efek radial gradient (Hitam di tengah, coklat di pinggir)
  const radialCardClass = "bg-[radial-gradient(ellipse_at_center,_#110C08_0%,_rgba(191,143,81,0.18)_100%)] border border-[#BF8F51] rounded-[15px] p-5 flex flex-col hover:border-[#BF8F51] transition-colors";

  const [gateInput, setGateInput] = useState('');
  const [gate, setGate] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGate(gateInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [gateInput]);

  const params = useMemo(
    () => ({
      page,
      size: PAGE_SIZE,
      gate: gate || undefined,
      source: sourceFilter || undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    }),
    [page, gate, sourceFilter, startDate, endDate],
  );

  const { data, isLoading, isError } = useGateEvents(params);
  const { data: apiData } = useGateEvents({ ...params, page: 1, size: 1, source: 'api' });
  const { data: posData } = useGateEvents({ ...params, page: 1, size: 1, source: 'pos' });

  const rows = data?.items ?? [];
  const pagination = data?.pagination;
  const totalEvents = pagination?.total_items ?? 0;
  const apiCount = apiData?.pagination.total_items ?? 0;
  const posCount = posData?.pagination.total_items ?? 0;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6 pb-10 relative">

      {/* HEADER HALAMAN */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#EAE1D8]">Laporan Akses Gate</h2>
        <div className="flex items-center gap-3">
          <ExportButtons
            report="gate-events"
            params={{
              gate: gate || undefined,
              source: sourceFilter || undefined,
              start_date: startDate || undefined,
              end_date: endDate || undefined,
            }}
          />
        </div>
      </div>

      {/* SEARCH BAR & FILTER BUTTON */}
      <div className="flex items-center gap-4 w-full border border-[#BF8F51]/40 rounded-[15px] p-4 bg-transparent">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BF8F51]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            value={gateInput}
            onChange={(e) => setGateInput(e.target.value)}
            placeholder="Cari Kode Gate..."
            className="w-full bg-[#14110E] border border-[#BF8F51]/60 rounded-[10px] pl-12 pr-4 py-3 text-sm text-[#EAE1D8] placeholder-gray-500 outline-none focus:border-[#BF8F51] transition-colors"
          />
        </div>
        {/* Tombol Filter yang memicu pop-up */}
        <button
          onClick={() => setShowFilter(true)}
          className="flex-shrink-0 px-2 text-[#BF8F51] hover:text-[#EAE1D8] transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
        </button>
      </div>

      {/* 4 STAT CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <div className={`${radialCardClass} h-[130px] justify-center`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Total Event</p>
          <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2">{totalEvents.toLocaleString('id-ID')}</h3>
        </div>
        <div className={`${radialCardClass} h-[130px] justify-center`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Event Gate (API)</p>
          <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2">{apiCount.toLocaleString('id-ID')}</h3>
        </div>
        <div className={`${radialCardClass} h-[130px] justify-center`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Event POS</p>
          <h3 className="text-[#BF8F51] text-[36px] font-bold leading-none mt-2">{posCount.toLocaleString('id-ID')}</h3>
        </div>
        <div className={`${radialCardClass} h-[130px] justify-center`}>
          <p className="text-[#EAE1D8] text-[11px] font-semibold uppercase tracking-wide">Periode</p>
          <h3 className="text-[#BF8F51] text-[20px] font-bold leading-tight mt-2">
            {startDate || 'Awal'} — {endDate || 'Sekarang'}
          </h3>
        </div>
      </div>

      {/* TABEL EVENT AKSES GATE */}
      <div className="border border-[#BF8F51] rounded-[15px] bg-[#14110E] overflow-hidden flex flex-col w-full h-full">
        <div className="overflow-x-auto">
          <table className="w-full text-center whitespace-nowrap">
            <thead className="border-b border-[#BF8F51] text-[#EAE1D8] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5 font-semibold">WAKTU</th>
                <th className="px-6 py-5 font-semibold">GATE</th>
                <th className="px-6 py-5 font-semibold">SUMBER</th>
                <th className="px-6 py-5 font-semibold">METODE</th>
                <th className="px-6 py-5 font-semibold">NO. TIKET</th>
                <th className="px-6 py-5 font-semibold">AKSI</th>
              </tr>
            </thead>
            <tbody className="text-[#EAE1D8] text-[14px]">
              {isLoading && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Memuat data…</td></tr>
              )}
              {!isLoading && isError && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-[#FF5656]">Gagal memuat data. Coba lagi nanti.</td></tr>
              )}
              {!isLoading && !isError && rows.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Tidak ada event akses gate.</td></tr>
              )}
              {rows.map((row, index) => (
                <tr key={row.id} className={`hover:bg-[#BF8F51]/10 transition-colors ${index % 2 === 0 ? 'bg-[#322A1F]' : 'bg-transparent'}`}>
                  <td className="px-6 py-4 text-[13px] text-gray-300">{formatDateTime(row.ts)}</td>
                  <td className="px-6 py-4">{row.gate_code ?? '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center w-[64px] h-[22px] text-[11px] font-bold rounded-[9px] border uppercase ${
                      row.source === 'pos'
                        ? 'border-[#FFD94E] text-[#FFD94E] bg-[#FFBC2C]/[0.24]'
                        : 'border-[#79FF8D] text-[#79FF8D] bg-[#00FF26]/[0.35]'
                    }`}>
                      {row.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">{METHOD_LABELS[row.method ?? ''] ?? row.method ?? '-'}</td>
                  <td className="px-6 py-4 text-gray-300">{row.ticket_number ?? '-'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedEvent(row)}
                      className="text-[#BF8F51] font-bold text-[12px] hover:underline uppercase"
                    >
                      DETAIL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#BF8F51] text-sm mt-auto">
          <p className="text-[#EAE1D8] text-[13px]">
            Menampilkan {rows.length} dari {totalEvents.toLocaleString('id-ID')} Event
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={!pagination || pagination.current_page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 text-[#BF8F51] border border-[#BF8F51] rounded hover:bg-[#BF8F51]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <button className="px-3 py-1 text-black font-semibold bg-[#BF8F51] border border-[#BF8F51] rounded">
              {pagination?.current_page ?? 1}
            </button>
            <span className="text-[#EAE1D8] text-[12px]">/ {pagination?.total_pages ?? 1}</span>
            <button
              disabled={!pagination || pagination.current_page >= pagination.total_pages}
              onClick={() => setPage((p) => Math.min(pagination?.total_pages ?? 1, p + 1))}
              className="px-3 py-1 text-[#EAE1D8] border border-[#BF8F51] rounded hover:bg-[#EAE1D8]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {/* MODAL POP-UP FILTER */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-[383px] bg-[#17130E] border-[2px] border-[#BF8F51] rounded-[15px] p-6 flex flex-col relative shadow-2xl">

            {/* Header Modal */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[22px] font-bold text-[#BF8F51]">Filter</h3>
              <button
                onClick={() => setShowFilter(false)}
                className="text-[#BF8F51] hover:text-[#EAE1D8] transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex-1 flex flex-col gap-4">

              {/* Jangka Waktu */}
              <div>
                <label className="block text-[#BF8F51] text-[11px] font-semibold mb-2 uppercase">Jangka Waktu</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] px-3 py-2 text-sm outline-none focus:border-[#BF8F51] [color-scheme:dark]"
                  />
                  <span className="text-[#BF8F51] font-bold">-</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] px-3 py-2 text-sm outline-none focus:border-[#BF8F51] [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Sumber */}
              <div>
                <label className="block text-[#BF8F51] text-[11px] font-semibold mb-2 uppercase">Sumber</label>
                <div className="relative">
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="w-full bg-transparent border border-[#BF8F51]/50 text-[#BF8F51] rounded-[7px] pl-3 pr-8 py-2 text-sm appearance-none outline-none focus:border-[#BF8F51]"
                  >
                    <option className="bg-[#14110E]" value="">Semua Sumber</option>
                    <option className="bg-[#14110E]" value="api">Gate (API)</option>
                    <option className="bg-[#14110E]" value="pos">POS</option>
                  </select>
                  <svg className="absolute right-3 top-[11px] text-[#BF8F51] pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>

            </div>

            {/* Buttons Bawah */}
            <div className="flex justify-end gap-3 mt-4 pt-2">
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setSourceFilter('');
                  setPage(1);
                }}
                className="px-5 py-2 rounded-[7px] border border-[#BF8F51] text-[#BF8F51] font-semibold text-sm hover:bg-[#BF8F51]/10 transition-colors"
              >
                Atur Ulang
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className="px-5 py-2 rounded-[7px] bg-[#BF8F51] text-[#14110E] font-bold text-sm hover:bg-[#906B3D] transition-colors"
              >
                Terapkan
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DETAIL EVENT */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-[480px] bg-[#17130E] border-[3px] border-[#BF8F51] rounded-[15px] p-8 flex flex-col relative shadow-2xl">

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[24px] font-bold text-[#BF8F51]">Detail Event</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-[#BF8F51] hover:text-[#EAE1D8] transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[#BF8F51] text-[13px] font-semibold mb-1">Waktu</p>
                <p className="text-[#EAE1D8] text-[16px] font-bold">{formatDateTime(selectedEvent.ts)}</p>
              </div>
              <div>
                <p className="text-[#BF8F51] text-[13px] font-semibold mb-1">Gate</p>
                <p className="text-[#EAE1D8] text-[16px] font-bold">{selectedEvent.gate_code ?? '-'}</p>
              </div>
              <div>
                <p className="text-[#BF8F51] text-[13px] font-semibold mb-1">Sumber</p>
                <p className="text-[#EAE1D8] text-[16px] font-bold uppercase">{selectedEvent.source}</p>
              </div>
              <div>
                <p className="text-[#BF8F51] text-[13px] font-semibold mb-1">Metode</p>
                <p className="text-[#EAE1D8] text-[16px] font-bold">{METHOD_LABELS[selectedEvent.method ?? ''] ?? selectedEvent.method ?? '-'}</p>
              </div>
              <div>
                <p className="text-[#BF8F51] text-[13px] font-semibold mb-1">No. Tiket</p>
                <p className="text-[#EAE1D8] text-[16px] font-bold">{selectedEvent.ticket_number ?? '-'}</p>
              </div>
              {selectedEvent.detail && (
                <div>
                  <p className="text-[#BF8F51] text-[13px] font-semibold mb-1">Detail</p>
                  <p className="text-[#EAE1D8] text-[14px] leading-snug break-words">{selectedEvent.detail}</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
