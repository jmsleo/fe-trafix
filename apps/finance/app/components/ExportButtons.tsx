'use client';

import React, { useEffect, useState } from 'react';

import { downloadReportExport, type ExportFormat, type ReportName } from '@/lib/api/export';

const FORMATS: { format: ExportFormat; label: string; icon: React.ReactNode }[] = [
  {
    format: 'pdf',
    label: 'Export PDF',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    format: 'xlsx',
    label: 'Export EXCEL',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M8 13h2" />
        <path d="M8 17h2" />
        <path d="M14 13h2" />
        <path d="M14 17h2" />
      </svg>
    ),
  },
  {
    format: 'csv',
    label: 'Export CSV',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="12" y1="3" x2="12" y2="21" />
      </svg>
    ),
  },
];

interface ExportButtonsProps {
  report: ReportName;
  /** Current filters so the exported file matches what is on screen. */
  params?: Record<string, unknown>;
}

export default function ExportButtons({ report, params = {} }: ExportButtonsProps) {
  const [downloading, setDownloading] = useState<ExportFormat | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 6000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleExport = async (format: ExportFormat) => {
    if (downloading) return;
    setDownloading(format);
    setError(null);
    try {
      await downloadReportExport(report, format, params);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengunduh file.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <>
      {FORMATS.map(({ format, label, icon }) => (
        <button
          key={format}
          type="button"
          disabled={downloading !== null}
          onClick={() => handleExport(format)}
          className="flex items-center gap-2 px-4 py-2 border border-[#BF8F51] rounded-[7px] text-[#BF8F51] text-sm font-medium hover:bg-[#BF8F51]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {icon}
          {downloading === format ? 'Mengunduh…' : label}
        </button>
      ))}
      {error && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm px-4 py-3 bg-[#14110E] border border-[#FF5656] rounded-[10px] text-[#FF5656] text-sm shadow-2xl">
          {error}
        </div>
      )}
    </>
  );
}
