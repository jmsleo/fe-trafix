'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useUploadBackup, useRestoreBackup } from '@/hooks/useBackups';
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
  return d.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
}

type Phase = 'idle' | 'uploading' | 'uploaded' | 'restoring' | 'done' | 'error';

export default function RestoreDatabasePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedBackup, setUploadedBackup] = useState<BackupRead | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadBackup = useUploadBackup();
  const restoreBackup = useRestoreBackup();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadedBackup(null);
      setPhase('idle');
      setErrorMessage('');
    }
  };

  const handleClickUploadArea = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = useCallback(() => {
    if (!selectedFile) return;
    setPhase('uploading');
    setErrorMessage('');
    uploadBackup.mutate(
      { file: selectedFile },
      {
        onSuccess: (data) => {
          setUploadedBackup(data);
          setPhase('uploaded');
        },
        onError: (err) => {
          setPhase('error');
          setErrorMessage(getApiErrorMessage(err, 'Gagal mengupload file'));
        },
      },
    );
  }, [selectedFile, uploadBackup]);

  const handleRestore = useCallback(() => {
    if (!uploadedBackup) return;
    setPhase('restoring');
    setErrorMessage('');
    restoreBackup.mutate(
      { id: uploadedBackup.id, data: { confirm: true } },
      {
        onSuccess: () => {
          setPhase('done');
        },
        onError: (err) => {
          setPhase('error');
          setErrorMessage(getApiErrorMessage(err, 'Gagal melakukan restore'));
        },
      },
    );
  }, [uploadedBackup, restoreBackup]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setUploadedBackup(null);
    setPhase('idle');
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const stepUpload = phase === 'uploaded' || phase === 'restoring' || phase === 'done';
  const stepRestore = phase === 'done';

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-bold text-[#EAE1D8] whitespace-nowrap leading-none tracking-wide">
          Restore Database
        </h1>
      </div>

      {/* GRID: Source File + Verification Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source File Card */}
        <div className="bg-[#231F1A]/80 border border-[#B5884D]/30 rounded-[12px] p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EAE1D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <h2 className="text-[20px] font-bold text-[#EAE1D8] tracking-wide">Source File</h2>
          </div>

          <div
            onClick={handleClickUploadArea}
            className="flex-grow w-full bg-[#110E0C] border border-[#B5884D]/20 rounded-[10px] flex flex-col items-center justify-center cursor-pointer hover:bg-black/60 transition-colors py-12 mb-6"
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6B5233" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
              <path d="M12 12v3"></path>
              <path d="m9 15 3 3 3-3"></path>
            </svg>
            {selectedFile ? (
              <p className="text-sm font-medium text-[#B5884D]">{selectedFile.name}</p>
            ) : (
              <>
                <p className="text-sm font-bold text-[#EAE1D8] mb-1">Drop backup file here or click to browse.</p>
                <p className="text-[12px] text-gray-500">Accepted formats: .sql, .bak, .gz</p>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".sql,.bak,.gz"
            />
          </div>

          <div className="flex justify-between items-center mt-auto">
            <span className="text-[13px] text-gray-500 font-medium">
              {phase === 'uploading' ? 'Mengupload...' :
               phase === 'uploaded' ? 'File terupload' :
               phase === 'restoring' ? 'Merestore...' :
               phase === 'done' ? 'Restore selesai' :
               selectedFile ? 'File selected' : 'Ready for upload'}
            </span>
            {phase === 'done' ? (
              <button
                onClick={handleReset}
                className="bg-transparent hover:bg-[#B5884D]/10 text-[#EAE1D8] border border-[#B5884D] font-bold py-2 px-5 rounded-[6px] text-sm transition-colors"
              >
                Upload Baru
              </button>
            ) : (
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploadBackup.isPending}
                className="bg-transparent hover:bg-[#B5884D]/10 text-[#EAE1D8] border border-[#B5884D] font-bold py-2 px-5 rounded-[6px] text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {uploadBackup.isPending ? 'Mengupload...' : 'Upload & Validate'}
              </button>
            )}
          </div>
        </div>

        {/* Verification Details Card */}
        <div className="bg-[#231F1A]/80 border border-[#B5884D]/30 rounded-[12px] p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EAE1D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h2 className="text-[20px] font-bold text-[#EAE1D8] tracking-wide">Verification Details</h2>
          </div>

          {uploadedBackup ? (
            <>
              <div className="bg-[#110E0C] border border-[#B5884D]/30 rounded-[8px] p-5 space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Filename</span>
                  <span className="text-[#EAE1D8] font-mono text-[13px] text-right truncate w-[200px]" title={uploadedBackup.filename}>
                    {uploadedBackup.filename}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Size</span>
                  <span className="text-[#EAE1D8] font-medium">{formatBytes(uploadedBackup.size_bytes)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Format</span>
                  <span className="text-[#EAE1D8] font-medium uppercase">{uploadedBackup.format}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Creation Date</span>
                  <span className="text-[#EAE1D8] font-medium text-[13px]">{formatDate(uploadedBackup.created_at)}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-6">
                <div className="mt-0.5 text-[#FF5656]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <p className="text-[12px] text-[#FF5656] leading-relaxed pr-2">
                  Restoring the database will overwrite current data. All active sessions will be terminated. This action cannot be undone.
                </p>
              </div>

              <button
                onClick={handleRestore}
                disabled={restoreBackup.isPending || phase === 'restoring' || phase === 'done'}
                className="mt-auto w-full bg-[#B5884D] hover:bg-[#c99a5a] text-[#1A1612] font-bold py-3 px-6 rounded-[8px] text-sm flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(181,136,77,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
                {restoreBackup.isPending ? 'Merestore...' : phase === 'done' ? 'Restore Selesai' : 'Run System Restore'}
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow py-12">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#B5884D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 mb-4">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
              <p className="text-sm text-[#EAE1D8]/40 text-center">Pilih file backup terlebih dahulu</p>
            </div>
          )}
        </div>
      </div>

      {/* Operation Status Card */}
      <div className="bg-[#231F1A]/80 border border-[#B5884D]/30 rounded-[12px] p-6">
        <div className="flex items-center gap-3 mb-8">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EAE1D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
          <h2 className="text-[20px] font-bold text-[#EAE1D8] tracking-wide">Operation Status</h2>
        </div>

        {/* Stepper */}
        <div className="relative mb-8 px-2">
          <div className="absolute top-[10px] left-0 w-full h-[2px] bg-gray-700/50 rounded-full z-0"></div>
          <div
            className="absolute top-[10px] left-0 h-[2px] bg-[#B5884D] rounded-full z-0 shadow-[0_0_8px_rgba(181,136,77,0.8)] transition-all duration-700"
            style={{ width: phase === 'idle' ? '0%' : phase === 'uploading' ? '25%' : stepUpload ? '50%' : stepRestore ? '100%' : '50%' }}
          ></div>

          <div className="relative z-10 flex justify-between">
            <div className="flex flex-col items-start w-1/4">
              <span className={`text-[12px] font-bold bg-[#231F1A] pr-2 mt-[2px] ${stepUpload || phase === 'uploading' ? 'text-[#B5884D]' : 'text-gray-500'}`}>
                Upload
              </span>
            </div>
            <div className="flex flex-col items-center w-1/4">
              <span className={`text-[12px] font-bold bg-[#231F1A] px-2 mt-[2px] ${stepRestore || phase === 'restoring' ? 'text-[#B5884D]' : 'text-gray-500'}`}>
                Restore
              </span>
            </div>
            <div className="flex flex-col items-end w-1/4">
              <span className={`text-[12px] font-bold bg-[#231F1A] pl-2 mt-[2px] ${phase === 'done' ? 'text-[#79FF8D]' : 'text-gray-500'}`}>
                Selesai
              </span>
            </div>
          </div>
        </div>

        {/* Status Log */}
        <div className="bg-[#0B0908] border border-[#B5884D]/20 rounded-[8px] p-5 font-mono text-[13px] leading-relaxed shadow-inner min-h-[120px]">
          {phase === 'idle' && (
            <div className="flex gap-3 text-[#EAE1D8]">
              <span className="text-gray-500 font-bold whitespace-nowrap">[ -- ]</span>
              <span className="text-gray-500">Menunggu file backup...</span>
            </div>
          )}
          {phase === 'uploading' && (
            <div className="flex gap-3 text-[#EAE1D8]">
              <span className="text-[#B5884D] font-bold whitespace-nowrap">[ WAIT ]</span>
              <span>Mengupload file backup ke server...</span>
            </div>
          )}
          {phase === 'uploaded' && (
            <>
              <div className="flex gap-3 text-[#EAE1D8]">
                <span className="text-[#79FF8D] font-bold whitespace-nowrap">[ OK ]</span>
                <span>File berhasil diupload.</span>
              </div>
              <div className="flex gap-3 text-[#EAE1D8]">
                <span className="text-[#B5884D] font-bold whitespace-nowrap">[ WAIT ]</span>
                <span>Menunggu konfirmasi restore...</span>
              </div>
            </>
          )}
          {phase === 'restoring' && (
            <>
              <div className="flex gap-3 text-[#EAE1D8]">
                <span className="text-[#79FF8D] font-bold whitespace-nowrap">[ OK ]</span>
                <span>File berhasil diupload.</span>
              </div>
              <div className="flex gap-3 text-[#EAE1D8]">
                <span className="text-[#B5884D] font-bold whitespace-nowrap">[ WAIT ]</span>
                <span>Memulai proses restore database...</span>
              </div>
              <div className="flex gap-3 text-[#EAE1D8]">
                <span className="text-[#B5884D] font-bold whitespace-nowrap">[ WAIT ]</span>
                <span className="animate-pulse">Merestore data dari backup...</span>
              </div>
            </>
          )}
          {phase === 'done' && (
            <>
              <div className="flex gap-3 text-[#EAE1D8]">
                <span className="text-[#79FF8D] font-bold whitespace-nowrap">[ OK ]</span>
                <span>File berhasil diupload.</span>
              </div>
              <div className="flex gap-3 text-[#EAE1D8]">
                <span className="text-[#79FF8D] font-bold whitespace-nowrap">[ OK ]</span>
                <span>Restore database selesai.</span>
              </div>
              <div className="flex gap-3 text-[#EAE1D8]">
                <span className="text-[#79FF8D] font-bold whitespace-nowrap">[ OK ]</span>
                <span>Semua koneksi aktif telah dipulihkan.</span>
              </div>
            </>
          )}
          {phase === 'error' && (
            <>
              <div className="flex gap-3 text-[#EAE1D8]">
                <span className="text-[#79FF8D] font-bold whitespace-nowrap">[ OK ]</span>
                <span>File berhasil diupload.</span>
              </div>
              <div className="flex gap-3 text-[#FF5656]">
                <span className="font-bold whitespace-span">[ ERR ]</span>
                <span>{errorMessage}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
