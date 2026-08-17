'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useBackups, useCreateBackup, useDeleteBackup, useDownloadBackup, useRestoreBackup, useUploadBackup } from '@/hooks/useBackups';
import type { BackupRead } from '@/lib/api/types';
import { getApiErrorMessage } from '@/lib/api/errors';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${dd}/${mm}/${yy} ${hh}:${min}:${ss}`;
}

function formatRelative(iso: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} jam lalu`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD} hari lalu`;
}

export default function BackupDatabasePage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, error, refetch } = useBackups({ page, page_size: pageSize });
  const createBackup = useCreateBackup();
  const deleteBackup = useDeleteBackup();
  const downloadBackup = useDownloadBackup();
  const restoreBackup = useRestoreBackup();
  const uploadBackup = useUploadBackup();

  const items: BackupRead[] = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;

  const runningBackup = items.find((b) => b.status === 'running');
  const lastSuccessful = items.find((b) => b.status === 'completed');

  const [confirmRestore, setConfirmRestore] = useState<BackupRead | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<BackupRead | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartBackup = useCallback(() => {
    createBackup.mutate(undefined, {
      onError: (err) => alert(getApiErrorMessage(err, 'Gagal memulai backup')),
    });
  }, [createBackup]);

  const handleDownload = useCallback(
    (backup: BackupRead) => {
      downloadBackup.mutate(backup.id, {
        onSuccess: (blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = backup.filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        },
        onError: (err) => alert(getApiErrorMessage(err, 'Gagal mengunduh file')),
      });
    },
    [downloadBackup],
  );

  const handleRestore = useCallback(() => {
    if (!confirmRestore) return;
    restoreBackup.mutate(
      { id: confirmRestore.id, data: { confirm: true } },
      {
        onSuccess: () => setConfirmRestore(null),
        onError: (err) => alert(getApiErrorMessage(err, 'Gagal restore backup')),
      },
    );
  }, [confirmRestore, restoreBackup, setConfirmRestore]);

  const handleDelete = useCallback(() => {
    if (!confirmDelete) return;
    deleteBackup.mutate(confirmDelete.id, {
      onSuccess: () => setConfirmDelete(null),
      onError: (err) => alert(getApiErrorMessage(err, 'Gagal menghapus backup')),
    });
  }, [confirmDelete, deleteBackup, setConfirmDelete]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      uploadBackup.mutate(
        { file },
        {
          onSuccess: () => {
            if (fileInputRef.current) fileInputRef.current.value = '';
          },
          onError: (err) => alert(getApiErrorMessage(err, 'Gagal mengupload file')),
        },
      );
    },
    [uploadBackup],
  );

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] font-bold text-[#EAE1D8] whitespace-nowrap leading-none tracking-wide">
          Backup Database
        </h1>
        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".gz,.sql,.sql.gz,.bak"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadBackup.isPending}
            className="bg-[#231F1A] border border-[#B5884D]/50 hover:border-[#B5884D] text-[#B5884D] font-bold py-2.5 px-5 rounded-[8px] text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            {uploadBackup.isPending ? 'Mengupload...' : 'Upload Backup'}
          </button>
        </div>
      </div>

      {/* GRID: Active Operation + System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Operation Card */}
        <div className="lg:col-span-2 bg-[#231F1A]/80 border border-[#B5884D]/30 rounded-[12px] p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
              </svg>
              <h2 className="text-[22px] font-bold text-[#EAE1D8] tracking-wide">Active Operation</h2>
            </div>
            {runningBackup ? (
              <div className="border border-[#B5884D] text-[#B5884D] text-[11px] font-bold px-3 py-1 rounded-full tracking-wider bg-[#B5884D]/10">
                IN PROGRESS
              </div>
            ) : (
              <div className="border border-[#79FF8D] text-[#79FF8D] text-[11px] font-bold px-3 py-1 rounded-full tracking-wider bg-[#79FF8D]/10">
                IDLE
              </div>
            )}
          </div>

          {runningBackup ? (
            <>
              <div className="space-y-2 mb-8">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-[#EAE1D8] truncate max-w-[280px]">{runningBackup.filename}</span>
                  <span className="text-[#EAE1D8]">{runningBackup.progress ?? 0}%</span>
                </div>
                <div className="w-full h-[10px] bg-black/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#B5884D] rounded-full shadow-[0_0_10px_rgba(181,136,77,0.8)] transition-all duration-500"
                    style={{ width: `${runningBackup.progress ?? 0}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button disabled className="bg-[#B5884D]/50 text-[#1A1612] font-bold py-2.5 px-6 rounded-[8px] text-sm cursor-not-allowed opacity-60">
                  Backup Berlangsung...
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center py-8 mb-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 mb-4">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 12h8"></path>
                </svg>
                <p className="text-[#EAE1D8]/50 text-sm">Tidak ada operasi backup yang sedang berjalan</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleStartBackup}
                  disabled={createBackup.isPending}
                  className="bg-[#B5884D] hover:bg-[#c99a5a] text-[#1A1612] font-bold py-2.5 px-6 rounded-[8px] text-sm flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(181,136,77,0.3)] disabled:opacity-50"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                    <path d="M12 12v3"></path>
                    <path d="m9 15 3 3 3-3"></path>
                  </svg>
                  {createBackup.isPending ? 'Memulai...' : 'Start Backup Proses'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* System Health Card */}
        <div className="lg:col-span-1 bg-[#231F1A]/80 border border-[#B5884D]/30 rounded-[12px] p-6 flex flex-col">
          <h2 className="text-[22px] font-bold text-[#EAE1D8] tracking-wide mb-6">System Health</h2>
          <div className="flex flex-col gap-6 flex-grow justify-center">
            <div className="flex items-center justify-between border-b border-[#B5884D]/20 pb-4">
              <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EAE1D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span className="text-sm font-medium text-[#EAE1D8]">Last Successful</span>
              </div>
              <div className="text-right">
                {lastSuccessful ? (
                  <>
                    <span className="block text-sm font-bold text-[#EAE1D8]">{formatRelative(lastSuccessful.created_at)}</span>
                    <span className="block text-[12px] text-gray-400">{formatDate(lastSuccessful.created_at)}</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-400">Belum ada</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-[#B5884D]/20 pb-4">
              <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EAE1D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
                <span className="text-sm font-medium text-[#EAE1D8]">Total Backup</span>
              </div>
              <span className="text-sm font-bold text-[#EAE1D8]">{total}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EAE1D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                </svg>
                <span className="text-sm font-medium text-[#EAE1D8]">Status</span>
              </div>
              <span className={`text-sm font-bold ${runningBackup ? 'text-[#B5884D]' : 'text-[#79FF8D]'}`}>
                {runningBackup ? 'Running' : 'Healthy'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Histori Backup Table */}
      <div className="rounded-[10px] border border-[#B5884D] overflow-hidden shadow-lg bg-transparent w-full flex flex-col mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-[#EAE1D8]">
            <thead className="text-[11px] uppercase bg-transparent border-b border-[#B5884D]/30">
              <tr>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-gray-400">NO.</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-gray-400">TIMESTAMP</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-gray-400">FILE NAME</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-gray-400">SIZE</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-gray-400">STATUS</th>
                <th className="px-6 py-5 font-medium tracking-wider text-center whitespace-nowrap text-gray-400">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500 bg-transparent">Memuat data backup...</td></tr>
              ) : isError ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center bg-transparent">
                  <p className="text-[#FF5656] text-sm mb-2">{getApiErrorMessage(error, 'Gagal memuat data backup')}</p>
                  <button onClick={() => refetch()} className="text-[#B5884D] hover:text-[#EAE1D8] text-sm underline">Coba lagi</button>
                </td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500 bg-transparent">Belum ada histori backup.</td></tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-[#3d3326]/30 transition-colors border-b border-[#B5884D]/30">
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-400">{(page - 1) * pageSize + index + 1}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-400">{formatDate(item.created_at)}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-400">{item.filename}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-400">{formatBytes(item.size_bytes)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center justify-center mx-auto px-4 h-[24px] rounded-full border text-[11px] font-bold tracking-wide w-fit
                        ${item.status === 'completed' ? 'border-[#79FF8D] bg-transparent text-[#79FF8D]' :
                          item.status === 'running' ? 'border-[#B5884D] bg-[#B5884D]/10 text-[#B5884D]' :
                          'border-[#FF8080] bg-[#FF000059] text-[#FF8080]'}`}>
                        {item.status === 'completed' ? 'Selesai' : item.status === 'running' ? 'Berjalan' : 'Gagal'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center items-center gap-1">
                        {item.status === 'completed' && (
                          <button
                            onClick={() => handleDownload(item)}
                            disabled={downloadBackup.isPending}
                            title="Download"
                            className="text-[#B5884D] hover:text-[#EAE1D8] transition-colors p-2 rounded-md hover:bg-[#B5884D]/10 disabled:opacity-50"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                          </button>
                        )}
                        {item.status === 'completed' && (
                          <button
                            onClick={() => setConfirmRestore(item)}
                            title="Restore"
                            className="text-[#79FF8D] hover:text-[#EAE1D8] transition-colors p-2 rounded-md hover:bg-[#79FF8D]/10"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                              <path d="M3 3v5h5"></path>
                            </svg>
                          </button>
                        )}
                        {item.status !== 'running' && (
                          <button
                            onClick={() => setConfirmDelete(item)}
                            title="Hapus"
                            className="text-[#FF8080] hover:text-[#EAE1D8] transition-colors p-2 rounded-md hover:bg-[#FF8080]/10"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-transparent border-t border-[#B5884D]/30 gap-4 mt-auto">
          <span className="text-sm text-gray-400">
            Menampilkan {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} dari {total} Backup
          </span>
          <div className="inline-flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 text-sm text-gray-400 border border-[#B5884D]/50 rounded-[4px] hover:text-white hover:border-[#B5884D] transition-colors bg-transparent disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center text-sm rounded-[4px] font-bold transition-colors ${
                    page === pageNum
                      ? 'text-[#17130E] bg-[#B5884D]'
                      : 'text-[#EAE1D8] border border-[#B5884D]/50 hover:bg-[#B5884D]/20 bg-transparent'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1 text-sm text-[#EAE1D8] border border-[#B5884D]/50 rounded-[4px] hover:bg-[#B5884D]/20 transition-colors bg-transparent disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Restore */}
      {confirmRestore && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setConfirmRestore(null)}>
          <div className="bg-[#231F1A] border border-[#B5884D]/30 rounded-[12px] p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-[#EAE1D8] mb-4">Konfirmasi Restore</h3>
            <p className="text-sm text-gray-400 mb-2">Apakah Anda yakin ingin restore dari backup ini?</p>
            <p className="text-sm text-[#B5884D] font-mono mb-6">{confirmRestore.filename}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmRestore(null)}
                className="px-4 py-2 text-sm text-gray-400 border border-[#B5884D]/50 rounded-[6px] hover:text-white hover:border-[#B5884D] transition-colors bg-transparent"
              >
                Batal
              </button>
              <button
                onClick={handleRestore}
                disabled={restoreBackup.isPending}
                className="px-4 py-2 text-sm font-bold text-[#1A1612] bg-[#79FF8D] hover:bg-[#5ce675] rounded-[6px] transition-colors disabled:opacity-50"
              >
                {restoreBackup.isPending ? 'Merestore...' : 'Ya, Restore'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setConfirmDelete(null)}>
          <div className="bg-[#231F1A] border border-[#B5884D]/30 rounded-[12px] p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-[#EAE1D8] mb-4">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-400 mb-2">Apakah Anda yakin ingin menghapus backup ini?</p>
            <p className="text-sm text-[#B5884D] font-mono mb-6">{confirmDelete.filename}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm text-gray-400 border border-[#B5884D]/50 rounded-[6px] hover:text-white hover:border-[#B5884D] transition-colors bg-transparent"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteBackup.isPending}
                className="px-4 py-2 text-sm font-bold text-[#1A1612] bg-[#FF5656] hover:bg-[#e04444] rounded-[6px] transition-colors disabled:opacity-50"
              >
                {deleteBackup.isPending ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
