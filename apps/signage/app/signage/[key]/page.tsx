"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

type MediaItem = {
  ads_name?: string;
  title?: string;
  media_type?: string;
  image_url?: string;
  url?: string;
  sound_url?: string;
  start_date?: string;
  end_date?: string;
};

type ScreenInfo = {
  key: string;
  screen_key: string;
  gate_code: string | null;
  mode: "gate" | "ads";
};

type StatusState = {
  status: string;
  plate_number: string;
  transaction_code: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const DEFAULT_INTERVAL = 7000;
const CURSOR_IDLE_MS = 4000;
const STALE_RELOAD_MS = 90_000;

function fmtTime(d: Date): string {
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function SignageDisplayPage() {
  const params = useParams<{ key: string }>();
  const screenKey = String(params?.key ?? "");

  const [info, setInfo] = useState<ScreenInfo | null>(null);
  const [status, setStatus] = useState<StatusState>({
    status: "idle",
    plate_number: "",
    transaction_code: "",
  });
  const [ads, setAds] = useState<MediaItem[]>([]);
  const [idle, setIdle] = useState<MediaItem | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [slide, setSlide] = useState(0);
  const [connected, setConnected] = useState(false);

  const [options, setOptions] = useState(() => ({
    mode: "" as "" | "gate" | "ads",
    interval: DEFAULT_INTERVAL,
    fit: "contain" as "contain" | "cover",
  }));

  const lastEventRef = useRef<number>(0);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    lastEventRef.current = Date.now();
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const mode = q.get("mode");
    const iv = Number.parseInt(q.get("interval") ?? "", 10);
    const fit = q.get("fit");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOptions({
      mode: mode === "gate" || mode === "ads" ? mode : "",
      interval: Number.isFinite(iv) && iv >= 2000 ? iv : DEFAULT_INTERVAL,
      fit: fit === "cover" ? "cover" : "contain",
    });
  }, []);

  const resetStaleTimer = useCallback(() => {
    lastEventRef.current = Date.now();
  }, []);

  // SSE connection
  useEffect(() => {
    if (!screenKey) return;
    const es = new EventSource(`${API_URL}/api/signage/stream/${encodeURIComponent(screenKey)}`);
    esRef.current = es;

    es.onopen = () => {
      resetStaleTimer();
      setConnected(true);
    };
    es.onerror = () => {
      setConnected(false);
    };
    es.addEventListener("screen", (ev) => {
      try {
        const data = JSON.parse((ev as MessageEvent).data) as ScreenInfo;
        setInfo(data);
      } catch {
        /* ignore malformed frame */
      }
      resetStaleTimer();
    });
    es.addEventListener("status", (ev) => {
      try {
        const data = JSON.parse((ev as MessageEvent).data);
        setStatus({
          status: String(data.status ?? "idle"),
          plate_number: String(data.plate_number ?? ""),
          transaction_code: String(data.transaction_code ?? ""),
        });
      } catch {
        /* ignore */
      }
      resetStaleTimer();
    });
    es.addEventListener("ads", (ev) => {
      try {
        const data = JSON.parse((ev as MessageEvent).data);
        setAds(Array.isArray(data.ads) ? data.ads : []);
      } catch {
        /* ignore */
      }
      resetStaleTimer();
    });
    es.addEventListener("idle", (ev) => {
      try {
        const data = JSON.parse((ev as MessageEvent).data);
        setIdle(data.image ?? null);
      } catch {
        /* ignore */
      }
      resetStaleTimer();
    });
    es.addEventListener("media", (ev) => {
      try {
        const data = JSON.parse((ev as MessageEvent).data);
        setMedia(Array.isArray(data.media) ? data.media : []);
      } catch {
        /* ignore */
      }
      resetStaleTimer();
    });

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [screenKey, resetStaleTimer]);

  const { mode: forcedMode, fit, interval } = options;
  const mode = forcedMode || info?.mode || "gate";
  const isGate = mode === "gate";

  // Slideshow rotation
  useEffect(() => {
    if (ads.length < 2) return;
    const t = window.setInterval(() => {
      setSlide((s) => (s + 1) % ads.length);
    }, interval);
    return () => window.clearInterval(t);
  }, [ads.length, interval]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlide(0);
  }, [ads]);

  // Stale watchdog: reload if the stream stops entirely.
  useEffect(() => {
    const t = window.setInterval(() => {
      if (Date.now() - lastEventRef.current > STALE_RELOAD_MS) {
        window.location.reload();
      }
    }, 15_000);
    return () => window.clearInterval(t);
  }, []);

  // Kiosk: auto fullscreen on first interaction + hide cursor while idle.
  useEffect(() => {
    const enterFs = () => {
      const el = document.documentElement;
      if (el.requestFullscreen && !document.fullscreenElement) {
        el.requestFullscreen().catch(() => {});
      }
    };
    let idleTimer: number | undefined;
    const onMove = () => {
      document.body.classList.remove("cursor-idle");
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(
        () => document.body.classList.add("cursor-idle"),
        CURSOR_IDLE_MS,
      );
    };
    window.addEventListener("pointerdown", enterFs, { once: true });
    window.addEventListener("mousemove", onMove);
    onMove();
    return () => {
      window.removeEventListener("pointerdown", enterFs);
      window.removeEventListener("mousemove", onMove);
      window.clearTimeout(idleTimer);
    };
  }, []);

  const url = (item: MediaItem | null | undefined): string | null =>
    item?.image_url || item?.url || null;

  const bgUrl = isGate && media.length > 0
    ? url(media[0])
    : ads.length > 0
      ? url(ads[slide % ads.length])
      : url(idle);

  const currentAd = ads.length > 0 ? ads[slide % ads.length] : null;
  const showVideo = isGate && media.length > 0 && bgUrl;
  const bgFit = isGate ? "cover" : fit;

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black">
      {!connected && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            <span className="text-xs tracking-widest text-muted">
              CONNECTING TO FIX PARKING…
            </span>
          </div>
        </div>
      )}

      {/* Background: video (gate mode) or rotating image slideshow */}
      {showVideo ? (
        <video
          key={String(bgUrl)}
          src={bgUrl ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : bgUrl ? (
        <div
          key={`${slide}-${String(bgUrl)}`}
          className="animate-[signage-fade_0.8s_ease-out] absolute inset-0 bg-black bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: bgFit,
          }}
        />
      ) : null}

      {/* Readability overlay for gate screens */}
      {isGate && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/70" />
      )}

      {isGate ? (
        <GateOverlay
          status={status}
          clock={<Clock />}
          currentAd={currentAd}
          gateCode={info?.gate_code ?? null}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          {!bgUrl && !currentAd && (
            <span className="text-xs tracking-widest text-muted">
              NO CONTENT — ASSIGN AN IMAGE TO THIS SCREEN
            </span>
          )}
        </div>
      )}
    </main>
  );
}

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);
  return (
    <div className="font-mono text-sm font-semibold tracking-widest text-gold-light">
      {fmtTime(now)}
    </div>
  );
}

function GateOverlay({
  status,
  clock,
  currentAd,
  gateCode,
}: {
  status: StatusState;
  clock: React.ReactNode;
  currentAd: MediaItem | null;
  gateCode: string | null;
}) {
  const s = status.status;
  const welcome = s === "welcome";
  const thanks = s === "thanks";

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 sm:px-10 sm:py-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/image/logo-fp.svg" alt="Fix Parking" className="h-10 w-10 sm:h-14 sm:w-14" />
        <div className="text-right">
          <div className="text-base font-bold uppercase tracking-widest text-gold sm:text-xl">
            Fix Parking
          </div>
          {clock}
        </div>
      </div>

      {/* Center status */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        {welcome || thanks ? (
          <>
            <h1
              className={`text-5xl font-black uppercase tracking-wider sm:text-8xl ${
                welcome ? "text-gate-ok" : "text-gate-danger"
              } drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]`}
            >
              {welcome ? "Selamat Datang" : "Terima Kasih"}
            </h1>
            {status.plate_number && (
              <p className="mt-4 font-mono text-2xl font-bold tracking-[0.3em] text-parchment sm:text-4xl">
                {status.plate_number}
              </p>
            )}
            {status.transaction_code && (
              <p className="mt-2 text-sm tracking-widest text-muted sm:text-base">
                Transaksi #{status.transaction_code}
              </p>
            )}
          </>
        ) : (
          <>
            <h1 className="text-4xl font-black uppercase tracking-widest text-gold sm:text-6xl">
              Fix Parking
            </h1>
            <p className="mt-3 text-sm tracking-widest text-muted sm:text-base">
              Silakan pindai tiket Anda
            </p>
          </>
        )}
      </div>

      {/* Footer: current ad name */}
      <div className="flex items-center justify-between px-6 py-3 sm:px-10 sm:py-4">
        <div className="text-xs tracking-widest text-muted sm:text-sm">
          {currentAd?.ads_name || currentAd?.title || "\u00A0"}
        </div>
        <div className="text-xs tracking-widest text-muted sm:text-sm">
          {gateCode ? `GATE ${gateCode}` : "\u00A0"}
        </div>
      </div>
    </div>
  );
}