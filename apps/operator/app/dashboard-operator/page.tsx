'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Header from '../layout/Header';
import { useAuthEvents, useLogout, useMe } from '@/hooks/useAuth';
import { usePosRefs, usePosSession, useQuote, useSettle, useManualTransaction, useVoid, useReprint, useReceipt, useEndPosSession } from '@/hooks/usePos';
import { posEventStreamUrl, formatRupiah } from '@/lib/api/pos';
import { tokenStorage } from '@/lib/api/client';
import { getApiErrorMessage } from '@/lib/api/errors';

type Mode = 'normal' | 'manual' | 'lost';

// How many vehicle classes get an F-key shortcut; the rest stay clickable.
const KEYED_SLOTS = 8;

export default function OperatorDashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const { data: session } = usePosSession();
  const { data: refs } = usePosRefs();
  const quote = useQuote();
  const settle = useSettle();
  const manualTx = useManualTransaction();
  const voidTx = useVoid();
  const reprint = useReprint();
  const receipt = useReceipt();
  const endSession = useEndPosSession();
  const logout = useLogout();

  const [waktu, setWaktu] = useState('');
  const [platKendaraan, setPlatKendaraan] = useState('');
  const [ticketCode, setTicketCode] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('normal');
  const [quoteData, setQuoteData] = useState<{ total: number; duration: string; breakdown: string; member: boolean; name?: string | null; plate?: string | null; timeIn?: string | null; timeOut?: string | null; vehicleId?: number | null } | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [metodeBayar, setMetodeBayar] = useState('TUNAI');
  const [amountReceived, setAmountReceived] = useState('');
  const [toast, setToast] = useState<{ type: 'error' | 'success'; title: string; body: string } | null>(null);
  const [gateOpen, setGateOpen] = useState(false);
  const [settled, setSettled] = useState<{ code?: string; total?: number } | null>(null);
  const [reprintModal, setReprintModal] = useState(false);
  const [reprintCode, setReprintCode] = useState('');
  const [voidModal, setVoidModal] = useState(false);
  const [voidCode, setVoidCode] = useState('');
  const [voidReason, setVoidReason] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The backend binds the session to the exit gate; the code rides along on
  // the session payload itself.
  const gateCode = useMemo(() => session?.gate?.gate_code ?? null, [session]);

  // The grid mirrors exactly what admin configured (ACTIVE classes from
  // /pos/refs), sorted by name; the first KEYED_SLOTS get F-key shortcuts.
  const vehicleTypes = useMemo(
    () => [...(refs?.vehicle_types ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
    [refs],
  );
  const hotkeyByTypeId = useMemo(() => {
    const map = new Map<string, string>();
    vehicleTypes.slice(0, KEYED_SLOTS).forEach((vt, i) => map.set(vt.id, `F${i + 1}`));
    return map;
  }, [vehicleTypes]);

  // Falls back to the first class while the stored pick is missing/stale
  // (initial load, admin removed the type).
  const effectiveTypeId = useMemo(() => {
    if (selectedTypeId && vehicleTypes.some((vt) => vt.id === selectedTypeId)) {
      return selectedTypeId;
    }
    return vehicleTypes[0]?.id ?? null;
  }, [selectedTypeId, vehicleTypes]);

  const showToast = useCallback((type: 'error' | 'success', title: string, body: string) => {
    setToast({ type, title, body });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  }, []);

  const selectType = useCallback((vtId: string) => {
    setSelectedTypeId(vtId);
    setMode('normal');
  }, []);

  const resetAfterSuccess = useCallback(() => {
    setPlatKendaraan('');
    setTicketCode('');
    setQuoteData(null);
    setSelectedTypeId(null);
    setMode('normal');
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setWaktu(`${dateStr} - ${timeStr}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnauthorized = useCallback(() => {
    queryClient.clear();
    tokenStorage.clearTokens();
    router.replace('/login');
  }, [queryClient, router]);

  useAuthEvents(handleUnauthorized);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const upper = e.key.toUpperCase();
      if (upper === 'F9') {
        e.preventDefault();
        setMode('manual');
        return;
      }
      if (upper === 'F10') {
        e.preventDefault();
        setMode('lost');
        return;
      }
      const match = [...hotkeyByTypeId.entries()].find(([, hotkey]) => hotkey === upper);
      if (match) {
        e.preventDefault();
        selectType(match[0]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hotkeyByTypeId, selectType]);

  useEffect(() => {
    if (!gateCode) return;
    const source = new EventSource(posEventStreamUrl(gateCode));
    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'barrier_opened') {
          setGateOpen(true);
          setTimeout(() => setGateOpen(false), 5000);
        } else if (data.type === 'transaction_settled') {
          showToast('success', 'Transaksi Sukses', `Transaksi ${data.transaction_code ?? ''} telah diselesaikan.`);
        }
      } catch {
        /* ignore malformed frame */
      }
    };
    source.onerror = () => {
      /* EventSource reconnects automatically */
    };
    return () => source.close();
  }, [gateCode, showToast]);

  const handleLanjutkan = async () => {
    if (mode === 'manual' || mode === 'lost') {
      if (!platKendaraan.trim()) {
        showToast('error', 'Data Tidak Ditemukan', 'Silakan masukkan nomor plat kendaraan terlebih dahulu.');
        return;
      }
      if (!effectiveTypeId) {
        showToast('error', 'Jenis Kendaraan', 'Pilih jenis kendaraan untuk tiket manual / hilang.');
        return;
      }
      // Ask the backend what this ticket will actually cost before taking
      // money — nothing is written by a quote.
      try {
        const res = await quote.mutateAsync({
          manual: mode === 'manual',
          lost_ticket: mode === 'lost',
          police_number: platKendaraan.trim(),
          vehicle_type_id: effectiveTypeId,
        });
        if (res.status !== 'success' || !res.data) {
          showToast('error', 'Data Tidak Ditemukan', res.message || 'Tarif tidak dapat dihitung.');
          return;
        }
        setQuoteData({
          total: res.data.total,
          duration: res.data.duration,
          breakdown: res.data.breakdown || (mode === 'lost' ? 'Tarif tiket hilang' : 'Input manual'),
          member: false,
          plate: platKendaraan,
        });
        setAmountReceived(String(res.data.total));
        setShowPaymentModal(true);
      } catch (err) {
        showToast('error', 'Gagal', getApiErrorMessage(err, 'Terjadi kesalahan saat memeriksa tarif.'));
      }
      return;
    }

    if (!platKendaraan.trim() && !ticketCode.trim()) {
      showToast('error', 'Data Tidak Ditemukan', 'Silakan masukkan nomor plat atau scan tiket.');
      return;
    }

    try {
      const res = await quote.mutateAsync({
        transaction_code: ticketCode.trim() || null,
        police_number: platKendaraan.trim() || null,
        vehicle_type_id: effectiveTypeId,
      });
      if (res.status !== 'success' || !res.data) {
        showToast('error', 'Data Tidak Ditemukan', res.message || 'Silakan masukkan nomor plat secara manual atau scan ulang tiket.');
        return;
      }
      setQuoteData({
        total: res.data.total,
        duration: res.data.duration,
        breakdown: res.data.breakdown,
        member: res.data.member,
        name: res.data.name,
        plate: res.data.police_number,
        timeIn: res.data.time_checkin,
        timeOut: res.data.time_checkout,
        vehicleId: res.data.vehicle_id,
      });
      setAmountReceived(String(res.data.total));
      setShowPaymentModal(true);
    } catch (err) {
      showToast('error', 'Gagal', getApiErrorMessage(err, 'Terjadi kesalahan saat memeriksa transaksi.'));
    }
  };

  const handleConfirmPayment = async () => {
    try {
      if (mode === 'manual') {
        const res = await manualTx.mutateAsync({
          police_number: platKendaraan.trim(),
          vehicle_type_id: effectiveTypeId,
        });
setShowPaymentModal(false);
      setSettled({ code: res.data?.transaction_code ?? undefined, total: res.data?.total ?? undefined });
      showToast('success', 'Transaksi Berhasil', 'Transaksi manual tercatat. Gate dibuka.');
      resetAfterSuccess();
      return;
      }

      const res = await settle.mutateAsync({
        transaction_code: mode === 'lost' ? null : (ticketCode.trim() || null),
        police_number: platKendaraan.trim() || null,
        lost_ticket: mode === 'lost',
        vehicle_type_id: effectiveTypeId,
      });
      if (res.status !== 'success' || !res.data) {
        showToast('error', 'Gagal', res.message || 'Transaksi tidak dapat diselesaikan.');
        return;
      }
      setShowPaymentModal(false);
      setSettled({ code: res.data.transaction_code ?? undefined, total: res.data.total ?? undefined });
      try {
        await receipt.mutateAsync({ transaction_code: res.data.transaction_code ?? '', gate: gateCode });
      } catch {
        /* receipt printing is best-effort */
      }
      showToast('success', 'Transaksi Berhasil', `Total ${formatRupiah(res.data.total)}. Gate dibuka.`);
      resetAfterSuccess();
    } catch (err) {
      showToast('error', 'Gagal', getApiErrorMessage(err, 'Terjadi kesalahan saat pembayaran.'));
    }
  };

  const handleLogout = async () => {
    if (session) {
      try {
        await endSession.mutateAsync(session.id);
      } catch {
        /* session may already be closed */
      }
    }
    try {
      await logout.mutateAsync();
    } catch {
      /* token cleanup happens onSettled */
    }
    tokenStorage.clearTokens();
    router.replace('/login');
  };

  const change = Math.max(0, Number(amountReceived || 0) - (quoteData?.total ?? 0));

  const radialBgStyle = {
    background: 'radial-gradient(50% 50% at 50% 50%, #231F1A 0%, #32291E 100%)',
  };

  const inputCls = 'w-full h-[36px] bg-black/60 border border-[#BF8F51] rounded-[9px] px-4 text-sm text-[#EAE1D8] placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#BF8F51]';

  return (
    <div className="min-h-screen bg-[#17130E] font-sans text-[#EAE1D8] py-8 px-[60px] flex flex-col items-center overflow-x-auto relative">

      <div className="w-full min-w-[1100px] flex flex-col gap-5">

        {/* 1. BARIS HEADER */}
        <div className="flex items-end gap-[20px] w-full mb-2">
          <div className="flex items-center gap-3 w-[260px] pb-5 flex-shrink-0">
            <img
              src="/image/logo-fp.svg"
              alt="Logo Fix Parking"
              className="w-[34px] h-[34px] object-contain flex-shrink-0 ml-[-46px]"
            />
            <div className="flex flex-col">
              <h1 className="text-[18px] font-bold text-white leading-none tracking-wide">Fix Parking</h1>
              <p className="text-[10px] text-gray-500 mt-1">HPMS Admin Portal</p>
            </div>
          </div>
          <div className="flex-grow w-full">
            <Header
              title="Dashboard Operator"
              userName={me?.name ?? 'Operator'}
              userRole={`Operator · ${session?.shift?.name ?? '-'}`}
              avatarUrl={undefined}
              onLogout={handleLogout}
            />
          </div>
        </div>

        {!session && (
          <div className="w-full rounded-[15px] border border-[#A64444] bg-[#2E1818] p-4 flex items-center justify-between gap-4">
            <p className="text-[#FF5A5A] text-[13px] font-bold">
              Tidak ada sesi operator aktif. Mulai sesi terlebih dahulu sebelum mengoperasikan gerbang.
            </p>
            <p className="text-[#B39E9E] text-[11px]">Gate keluar belum siap — pastikan tepat satu gate keluar dikonfigurasi.</p>
          </div>
        )}

        {/* 2. KONTEN UTAMA */}
        <div className="flex gap-[20px] w-full items-start">

          {/* KOLOM KIRI (Area Form) */}
          <div className="flex flex-col gap-[16px] flex-1 flex-shrink-0">

            {/* CARD 1: PILIH KENDARAAN */}
            <div className="w-full h-auto rounded-[15px] border border-[#BF8F51] p-5 flex flex-col justify-between" style={radialBgStyle}>
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-[18px] text-[#BF8F51] tracking-wide">Pilih Kendaraan</h2>
                <div className="border border-[#10B981]/50 bg-[#00FF26]/10 text-[#10B981] text-[12px] px-3 py-1 rounded-full font-medium tracking-wide">
                  Gunakan tombol F1-F10 pada keyboard
                </div>
              </div>
              <div className="grid grid-cols-5 gap-3 mt-2 w-full">
                {vehicleTypes.map((vt) => {
                  const hotkey = hotkeyByTypeId.get(vt.id);
                  return (
                    <button
                      key={vt.id}
                      onClick={() => selectType(vt.id)}
                      className={`border rounded-[8px] min-h-[36px] px-2 py-1 text-[13px] transition flex flex-col items-center justify-center gap-0.5 whitespace-nowrap ${
                        effectiveTypeId === vt.id && mode === 'normal'
                          ? 'bg-[#BF8F51] text-[#17130E] border-[#BF8F51] font-bold'
                          : 'border-[#BF8F51] text-[#BF8F51] hover:bg-[#BF8F51]/10'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {hotkey && <span className="font-bold">{hotkey}</span>}
                        <span>{vt.name}</span>
                      </span>
                      {vt.price !== null && (
                        <span className="text-[10px] leading-none opacity-80">
                          {vt.price === 0 ? 'Gratis' : formatRupiah(vt.price)}
                        </span>
                      )}
                    </button>
                  );
                })}
                <button
                  onClick={() => setMode('manual')}
                  className={`border rounded-[8px] min-h-[36px] px-2 py-1 text-[13px] transition flex items-center justify-center whitespace-nowrap ${
                    mode === 'manual'
                      ? 'bg-[#BF8F51] text-[#17130E] border-[#BF8F51] font-bold'
                      : 'border-dashed border-[#BF8F51]/70 text-[#BF8F51]/80 hover:bg-[#BF8F51]/10'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="font-bold">F9</span>
                    <span>Tiket Manual</span>
                  </span>
                </button>
                <button
                  onClick={() => setMode('lost')}
                  className={`border rounded-[8px] min-h-[36px] px-2 py-1 text-[13px] transition flex items-center justify-center whitespace-nowrap ${
                    mode === 'lost'
                      ? 'bg-[#BF8F51] text-[#17130E] border-[#BF8F51] font-bold'
                      : 'border-dashed border-[#BF8F51]/70 text-[#BF8F51]/80 hover:bg-[#BF8F51]/10'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="font-bold">F10</span>
                    <span>Tiket Hilang</span>
                  </span>
                </button>
              </div>
            </div>

            {/* CARD 2: INPUT KENDARAAN */}
            <div className="w-full rounded-[15px] border border-[#BF8F51] p-5 flex flex-col gap-4" style={radialBgStyle}>
              <div className="flex gap-[11px] w-full">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-[13px] font-semibold text-[#BF8F51]/70">No. Plat Kendaraan</label>
                  <input
                    type="text"
                    value={platKendaraan}
                    onChange={(e) => setPlatKendaraan(e.target.value)}
                    placeholder="Scan/input manual.."
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-[13px] font-semibold text-[#BF8F51]/70">Kode Tiket</label>
                  <input
                    type="text"
                    value={ticketCode}
                    onChange={(e) => setTicketCode(e.target.value)}
                    placeholder="Scan Tiket Masuk"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-[11px] w-full">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#BF8F51]/70">Waktu Masuk</label>
                  <div className={`${inputCls} flex items-center text-gray-500`}>{quoteData?.timeIn ?? '-'}</div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#BF8F51]/70">Waktu Keluar</label>
                  <div className={`${inputCls} flex items-center text-gray-500`}>{quoteData?.timeOut ?? '-'}</div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#BF8F51]/70">Durasi Parkir</label>
                  <div className={`${inputCls} flex items-center text-gray-500`}>{quoteData?.duration ?? '-'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[11px] w-full">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#BF8F51]/70">Mode Transaksi</label>
                  <div className={`${inputCls} flex items-center`}>
                    {mode === 'manual' ? 'TIKET MANUAL (F9)' : mode === 'lost' ? 'TIKET HILANG (F10)' : quoteData?.member ? `MEMBER · ${quoteData.name ?? ''}` : 'NORMAL'}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#BF8F51]/70">Rincian Tarif</label>
                  <div className={`${inputCls} flex items-center`}>{quoteData?.breakdown || '-'}</div>
                </div>
              </div>

              <button
                onClick={handleLanjutkan}
                disabled={quote.isPending}
                className="w-full h-[36px] mt-1 bg-transparent border border-[#BF8F51] rounded-[9px] text-[#BF8F51] font-bold text-sm hover:bg-[#BF8F51]/10 transition-colors disabled:opacity-50"
              >
                {quote.isPending ? 'Memeriksa…' : 'Lanjutkan Pembayaran'}
              </button>
            </div>

            {/* TOOLBAR BAWAH */}
            <div className="flex items-center gap-[11px] w-full">
              <div className="flex items-center gap-[11px] flex-shrink-0">
                <button onClick={() => setReprintModal(true)} className="w-[36px] h-[36px] flex items-center justify-center border border-[#BF8F51] rounded-[9px] text-[#BF8F51] hover:bg-[#BF8F51]/10 transition" title="Re-print Struk">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"></path></svg>
                </button>
                <button onClick={() => setVoidModal(true)} className="w-[36px] h-[36px] flex items-center justify-center border border-[#BF8F51] rounded-[9px] text-[#BF8F51] hover:bg-[#BF8F51]/10 transition" title="Void Transaksi">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                </button>
                <button onClick={() => { quote.reset(); setQuoteData(null); setPlatKendaraan(''); setTicketCode(''); setSettled(null); }} className="w-[36px] h-[36px] flex items-center justify-center border border-[#BF8F51] rounded-[9px] text-[#BF8F51] hover:bg-[#BF8F51]/10 transition" title="Reset">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path></svg>
                </button>
              </div>
              <div className="flex-1 h-[36px] border border-[#BF8F51] rounded-[9px] flex items-center justify-center text-[#BF8F51] text-[13px] font-bold">
                {waktu}
              </div>
            </div>

          </div>

          {/* KOLOM KANAN (Area Utilitas & Kamera) */}
          <div className="flex flex-col gap-[16px] w-[460px] flex-shrink-0">

            {/* TOMBOL UTILITIES */}
            <div className="flex justify-between items-center w-full gap-[8px]">
              <button onClick={() => setReprintModal(true)} className="flex-1 border border-[#BF8F51] text-[#BF8F51] font-bold text-[15px] px-3 py-[7px] rounded-[8px] hover:bg-[#BF8F51]/10 transition">
                Re-print Struk
              </button>
              <div className="flex-1 border border-[#BF8F51] text-[#BF8F51] font-bold text-[15px] px-3 py-[7px] rounded-[8px] text-center">
                {session?.shift?.name ?? '-'}
              </div>
              <div className="flex-1 border border-[#BF8F51] text-[#BF8F51] font-bold text-[15px] px-3 py-[7px] rounded-[8px] text-center">
                {me?.name ?? 'Operator'}
              </div>
              <button onClick={handleLogout} className="flex-1 border border-[#BF8F51] text-[#BF8F51] font-bold text-[15px] px-3 py-[7px] rounded-[8px] hover:bg-[#BF8F51]/10 transition flex items-center justify-center gap-1.5">
                Keluar
              </button>
            </div>

            {/* STATUS GATE */}
            <div className={`w-full h-[80px] rounded-[15px] border p-4 flex items-center justify-center gap-3 transition-colors ${gateOpen ? 'border-[#10B981] bg-[#10B981]/10' : 'border-[#BF8F51]'} ${settled ? 'border-[#10B981]' : ''}`} style={radialBgStyle}>
              {gateOpen ? (
                <p className="text-[#10B981] text-[16px] font-bold tracking-wide">GATE TERBUKA</p>
              ) : settled ? (
                <div className="text-center">
                  <p className="text-[#10B981] text-[14px] font-bold">Transaksi {settled.code} selesai</p>
                  <p className="text-[#BF8F51] text-[12px]">{formatRupiah(settled.total)}</p>
                </div>
              ) : (
                <p className="text-[#BF8F51] text-[13px] font-bold text-center leading-relaxed">
                  Siap melayani transaksi di gate {gateCode ?? '-'}
                </p>
              )}
            </div>

            <div className="w-full h-[280px] rounded-[15px] border border-[#BF8F51] flex flex-col items-center justify-center gap-3" style={radialBgStyle}>
              <p className="text-[#BF8F51] text-[13px] font-bold text-center leading-relaxed">LPR<br />preview cam<br />in</p>
            </div>
            <div className="w-full h-[280px] rounded-[15px] border border-[#3498DB] flex flex-col items-center justify-center gap-3" style={radialBgStyle}>
              <p className="text-[#BF8F51] text-[13px] font-bold text-center leading-relaxed">LPR<br />preview cam<br />out</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* POPUP NOTIFIKASI (TOAST)                                  */}
      {/* ========================================================= */}
      {toast && (
        <div className="fixed bottom-10 left-0 right-0 mx-auto w-max z-50">
          <div className={`rounded-[12px] px-8 py-4 shadow-2xl flex flex-col items-center justify-center animate-popIn border ${
            toast.type === 'error' ? 'bg-[#2E1818] border-[#A64444]' : 'bg-[#142E1B] border-[#2E8B57]'
          }`}>
            <div className={`flex items-center gap-2 font-bold text-[15px] mb-1 ${toast.type === 'error' ? 'text-[#FF5A5A]' : 'text-[#10B981]'}`}>
              {toast.type === 'error' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              )}
              {toast.title}
            </div>
            <p className={`text-[12px] text-center leading-relaxed ${toast.type === 'error' ? 'text-[#B39E9E]' : 'text-[#9ED8B5]'}`}>{toast.body}</p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* POPUP MODAL PEMBAYARAN                                    */}
      {/* ========================================================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-[2px] z-50 flex items-center justify-center">
          <div className="w-[480px] rounded-[20px] border border-[#BF8F51] p-8 flex flex-col gap-6 shadow-2xl animate-popIn" style={radialBgStyle}>

            <div>
              <p className="text-[#868D9A] text-[13px] font-medium mb-1">Tarif Parkir</p>
              <h2 className="text-[#BF8F51] text-[40px] font-bold leading-none">{formatRupiah(quoteData?.total ?? 0)}</h2>
              {quoteData?.breakdown && quoteData.breakdown !== '-' && (
                <p className="text-[#868D9A] text-[12px] mt-1">{quoteData.breakdown} · {quoteData.duration}</p>
              )}
              {quoteData?.member && <p className="text-[#10B981] text-[12px] font-bold mt-1">Member: {quoteData.name}</p>}
            </div>

            {/* Metode Pembayaran */}
            <div className="flex flex-col gap-2">
              <p className="text-[#868D9A] text-[13px] font-medium">Pilih Metode Pembayaran</p>
              <div className="flex gap-3">
                {['TUNAI', 'QRIS', 'E-MONEY'].map((metode) => (
                  <button
                    key={metode}
                    onClick={() => setMetodeBayar(metode)}
                    className={`flex-1 flex flex-col items-center justify-center gap-2 h-[80px] rounded-[12px] border transition-all ${
                      metodeBayar === metode
                        ? 'border-[#BF8F51] text-[#BF8F51] bg-[#BF8F51]/10'
                        : 'border-[#5A5A5A] text-[#868D9A] hover:border-[#BF8F51]/50'
                    }`}
                  >
                    <span className="text-[12px] font-bold">{metode}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Jumlah Pembayaran Input */}
            <div className="flex flex-col gap-2">
              <p className="text-[#868D9A] text-[13px] font-medium">Jumlah Pembayaran (Rp)</p>
              <input
                type="text"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value.replace(/\D/g, ''))}
                className="w-full h-[40px] bg-[#0A0A0A] border border-[#5A5A5A] rounded-[9px] px-4 text-sm text-[#EAE1D8] focus:outline-none focus:border-[#BF8F51]"
              />
            </div>

            {/* Kembalian */}
            <div>
              <p className="text-[#868D9A] text-[13px] font-medium mb-1">Total Kembalian</p>
              <h2 className="text-[#BF8F51] text-[32px] font-bold leading-none">{formatRupiah(change)}</h2>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-6 h-[40px] border border-[#BF8F51] rounded-[8px] text-[#BF8F51] font-bold text-[13px] hover:bg-[#BF8F51]/10 transition"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={settle.isPending || manualTx.isPending}
                className="px-6 h-[40px] bg-[#BF8F51]/20 border border-[#BF8F51] rounded-[8px] text-[#BF8F51] font-bold text-[13px] hover:bg-[#BF8F51]/30 transition disabled:opacity-50"
              >
                {settle.isPending || manualTx.isPending ? 'Memproses…' : 'Lanjutkan & Buka Gate'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL RE-PRINT STRUK                                      */}
      {/* ========================================================= */}
      {reprintModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-[2px] z-50 flex items-center justify-center">
          <div className="w-[400px] rounded-[20px] border border-[#BF8F51] p-8 flex flex-col gap-5 shadow-2xl animate-popIn" style={radialBgStyle}>
            <h3 className="text-[#BF8F51] text-[20px] font-bold">Re-print Struk</h3>
            <input
              type="text"
              value={reprintCode}
              onChange={(e) => setReprintCode(e.target.value)}
              placeholder="Kode Tiket / Transaksi"
              className="w-full h-[40px] bg-[#0A0A0A] border border-[#5A5A5A] rounded-[9px] px-4 text-sm text-[#EAE1D8] focus:outline-none focus:border-[#BF8F51]"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => { setReprintModal(false); setReprintCode(''); }} className="px-6 h-[40px] border border-[#BF8F51] rounded-[8px] text-[#BF8F51] font-bold text-[13px] hover:bg-[#BF8F51]/10 transition">Batal</button>
              <button
                onClick={async () => {
                  if (!reprintCode.trim()) { showToast('error', 'Kode Kosong', 'Masukkan kode tiket.'); return; }
                  try {
                    await reprint.mutateAsync({ transaction_code: reprintCode.trim(), gate: gateCode });
                    showToast('success', 'Cetak Ulang', 'Perintah cetak ulang dikirim ke printer.');
                    setReprintModal(false); setReprintCode('');
                  } catch (err) {
                    showToast('error', 'Gagal', getApiErrorMessage(err, 'Tidak dapat mencetak ulang.'));
                  }
                }}
                className="px-6 h-[40px] bg-[#BF8F51]/20 border border-[#BF8F51] rounded-[8px] text-[#BF8F51] font-bold text-[13px] hover:bg-[#BF8F51]/30 transition"
              >Cetak</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL VOID TRANSAKSI                                      */}
      {/* ========================================================= */}
      {voidModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-[2px] z-50 flex items-center justify-center">
          <div className="w-[400px] rounded-[20px] border border-[#A64444] p-8 flex flex-col gap-5 shadow-2xl animate-popIn" style={radialBgStyle}>
            <h3 className="text-[#FF5A5A] text-[20px] font-bold">Void Transaksi</h3>
            <input
              type="text"
              value={voidCode}
              onChange={(e) => setVoidCode(e.target.value)}
              placeholder="Kode Tiket / Transaksi"
              className="w-full h-[40px] bg-[#0A0A0A] border border-[#5A5A5A] rounded-[9px] px-4 text-sm text-[#EAE1D8] focus:outline-none focus:border-[#A64444]"
            />
            <input
              type="text"
              value={voidReason}
              onChange={(e) => setVoidReason(e.target.value)}
              placeholder="Alasan void (opsional)"
              className="w-full h-[40px] bg-[#0A0A0A] border border-[#5A5A5A] rounded-[9px] px-4 text-sm text-[#EAE1D8] focus:outline-none focus:border-[#A64444]"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => { setVoidModal(false); setVoidCode(''); setVoidReason(''); }} className="px-6 h-[40px] border border-[#BF8F51] rounded-[8px] text-[#BF8F51] font-bold text-[13px] hover:bg-[#BF8F51]/10 transition">Batal</button>
              <button
                onClick={async () => {
                  if (!voidCode.trim()) { showToast('error', 'Kode Kosong', 'Masukkan kode tiket.'); return; }
                  try {
                    await voidTx.mutateAsync({ transaction_code: voidCode.trim(), reason: voidReason });
                    showToast('success', 'Void Berhasil', `Transaksi ${voidCode.trim()} dibatalkan.`);
                    setVoidModal(false); setVoidCode(''); setVoidReason('');
                  } catch (err) {
                    showToast('error', 'Gagal', getApiErrorMessage(err, 'Tidak dapat membatalkan transaksi.'));
                  }
                }}
                className="px-6 h-[40px] bg-[#A64444]/20 border border-[#A64444] rounded-[8px] text-[#FF5A5A] font-bold text-[13px] hover:bg-[#A64444]/30 transition"
              >Void</button>
            </div>
          </div>
        </div>
      )}

      {/* Animasi halus untuk memunculkan modal & notifikasi */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes popIn {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-popIn {
          animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

    </div>
  );
}