'use client';

import React, { useState, useRef } from 'react';

export default function RestoreDatabasePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fungsi simulasi pilih file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleClickUploadArea = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Header Judul */}
      <div>
        <h1 className="text-[32px] font-bold text-[#EAE1D8] whitespace-nowrap leading-none tracking-wide">
          Restore Database
        </h1>
      </div>

      {/* --- GRID ATAS: SOURCE FILE & VERIFICATION DETAILS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD KIRI: SOURCE FILE */}
        <div className="bg-[#231F1A]/80 border border-[#B5884D]/30 rounded-[12px] p-6 flex flex-col">
          {/* Header Card */}
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

          {/* Area Drag & Drop */}
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
                <p className="text-[12px] text-gray-500">Accepted formats: .sql, .bak (Max 5GB)</p>
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

          {/* Footer Card: Status & Tombol */}
          <div className="flex justify-between items-center mt-auto">
            <span className="text-[13px] text-gray-500 font-medium">
              {selectedFile ? "File selected" : "Ready for upload"}
            </span>
            <button className="bg-transparent hover:bg-[#B5884D]/10 text-[#EAE1D8] border border-[#B5884D] font-bold py-2 px-5 rounded-[6px] text-sm transition-colors">
              Upload & Validate
            </button>
          </div>
        </div>

        {/* CARD KANAN: VERIFICATION DETAILS */}
        <div className="bg-[#231F1A]/80 border border-[#B5884D]/30 rounded-[12px] p-6 flex flex-col">
          {/* Header Card */}
          <div className="flex items-center gap-3 mb-6">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EAE1D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h2 className="text-[20px] font-bold text-[#EAE1D8] tracking-wide">Verification Details</h2>
          </div>

          {/* Box Detail Info (Desain dengan border tipis dan latar gelap) */}
          <div className="bg-[#110E0C] border border-[#B5884D]/30 rounded-[8px] p-5 space-y-4 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">Filename</span>
              <span className="text-[#EAE1D8] font-mono text-[13px] text-right truncate w-[200px]" title="fixp_db_prod_20260801_0200.sql.gz">
                fixp_db_prod_20260801...
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">Size</span>
              <span className="text-[#EAE1D8] font-medium">2.5 GB</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">Creation Date</span>
              <span className="text-[#EAE1D8] font-medium text-[13px]">2026-10-25 04:30 UTC</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">Backup Version</span>
              <span className="text-[#EAE1D8] font-medium">v14.2.0</span>
            </div>
          </div>

          {/* Warning Message */}
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

          {/* Button Action */}
          <button className="mt-auto w-full bg-[#B5884D] hover:bg-[#c99a5a] text-[#1A1612] font-bold py-3 px-6 rounded-[8px] text-sm flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(181,136,77,0.3)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
            Run System Restore
          </button>
        </div>
      </div>

      {/* --- CARD BAWAH: OPERATION STATUS --- */}
      <div className="bg-[#231F1A]/80 border border-[#B5884D]/30 rounded-[12px] p-6">
        
        {/* Header Terminal */}
        <div className="flex items-center gap-3 mb-8">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EAE1D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
          <h2 className="text-[20px] font-bold text-[#EAE1D8] tracking-wide">Operation Status</h2>
        </div>

        {/* --- TIMELINE / PROGRESS STEPPER --- */}
        <div className="relative mb-8 px-2">
          {/* Garis Latar / Track */}
          <div className="absolute top-[10px] left-0 w-full h-[2px] bg-gray-700/50 rounded-full z-0"></div>
          {/* Garis Progress Aktif (Emas) - Width 50% berarti sampai Preparing */}
          <div className="absolute top-[10px] left-0 w-[50%] h-[2px] bg-[#B5884D] rounded-full z-0 shadow-[0_0_8px_rgba(181,136,77,0.8)]"></div>
          
          <div className="relative z-10 flex justify-between">
            {/* Step 1: Validating (Selesai / Aktif) */}
            <div className="flex flex-col items-start w-1/4">
              <span className="text-[12px] font-bold text-[#B5884D] bg-[#231F1A] pr-2 mt-[2px]">Validating</span>
            </div>
            {/* Step 2: Preparing (Aktif / Berjalan) */}
            <div className="flex flex-col items-center w-1/4">
              <span className="text-[12px] font-bold text-[#B5884D] bg-[#231F1A] px-2 mt-[2px]">Preparing</span>
            </div>
            {/* Step 3: Restoring (Mendatang) */}
            <div className="flex flex-col items-center w-1/4">
              <span className="text-[12px] font-bold text-gray-500 bg-[#231F1A] px-2 mt-[2px]">Restoring</span>
            </div>
            {/* Step 4: Finalizing (Mendatang) */}
            <div className="flex flex-col items-end w-1/4">
              <span className="text-[12px] font-bold text-gray-500 bg-[#231F1A] pl-2 mt-[2px]">Finalizing</span>
            </div>
          </div>
        </div>

        {/* --- TERMINAL WINDOW --- */}
        <div className="bg-[#0B0908] border border-[#B5884D]/20 rounded-[8px] p-5 font-mono text-[13px] leading-relaxed shadow-inner">
          <div className="flex gap-3 text-[#EAE1D8]">
            <span className="text-[#79FF8D] font-bold whitespace-nowrap">[ OK ]</span>
            <span>Starting validation sequence...</span>
          </div>
          <div className="flex gap-3 text-[#EAE1D8]">
            <span className="text-[#79FF8D] font-bold whitespace-nowrap">[ OK ]</span>
            <span>Checksum verified (MD5).</span>
          </div>
          <div className="flex gap-3 text-[#EAE1D8]">
            <span className="text-[#79FF8D] font-bold whitespace-nowrap">[ OK ]</span>
            <span>Schema compatibility check passed.</span>
          </div>
          <div className="flex gap-3 text-[#EAE1D8]">
            <span className="text-[#B5884D] font-bold whitespace-nowrap">[ WAIT ]</span>
            <span>Starting validation sequence...</span>
          </div>
          <div className="flex gap-3 text-[#EAE1D8]">
            <span className="text-[#B5884D] font-bold whitespace-nowrap">[ INFO ]</span>
            <span>Terminating 14 active connections...</span>
          </div>
          <div className="flex gap-3 pl-12">
            <span className="text-gray-500 italic animate-pulse">Awaiting exclusive lock...</span>
          </div>
        </div>

      </div>

    </div>
  );
}