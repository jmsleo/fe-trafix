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

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const DEFAULT_INTERVAL = 7000;
const CURSOR_IDLE_MS = 4000;
const STALE_RELOAD_MS = 90_000;

export default function SignageDisplayPage() {
  const params = useParams<{ key: string }>();
  const screenKey = String(params?.key ?? "");

  const [ads, setAds] = useState<MediaItem[]>([]);
  const [idle, setIdle] = useState<MediaItem | null>(null);
  const [slide, setSlide] = useState(0);
  const [connected, setConnected] = useState(false);

  const [options, setOptions] = useState(() => ({
    interval: DEFAULT_INTERVAL,
    fit: "contain" as "contain" | "cover",
  }));

  const lastEventRef = useRef<number>(0);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const iv = Number.parseInt(q.get("interval") ?? "", 10);
    const fit = q.get("fit");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOptions({
      interval: Number.isFinite(iv) && iv >= 2000 ? iv : DEFAULT_INTERVAL,
      fit: fit === "cover" ? "cover" : "contain",
    });
  }, []);

  const resetStaleTimer = useCallback(() => {
    lastEventRef.current = Date.now();
  }, []);

  // SSE connection (same-origin; proxied to the backend via next.config.ts)
  useEffect(() => {
    if (!screenKey) return;
    const es = new EventSource(
      `${API_URL}/api/signage/stream/${encodeURIComponent(screenKey)}`,
    );
    esRef.current = es;

    es.onopen = () => {
      resetStaleTimer();
      setConnected(true);
    };
    es.onerror = () => {
      setConnected(false);
    };
    // Keep the watchdog fed even for frames we no longer render.
    es.addEventListener("screen", resetStaleTimer);
    es.addEventListener("status", resetStaleTimer);
    es.addEventListener("media", resetStaleTimer);
    es.addEventListener("ads", (ev) => {
      try {
        const data = JSON.parse((ev as MessageEvent).data);
        setAds(Array.isArray(data.ads) ? data.ads : []);
      } catch {
        /* ignore malformed frame */
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

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [screenKey, resetStaleTimer]);

  const { fit, interval } = options;

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
    };
  }, []);

  // Media URLs arrive absolute (backend host); normalize to path-only so the
  // browser always loads them same-origin through the Next.js proxy.
  const url = (item: MediaItem | null | undefined): string | null => {
    const raw = item?.image_url || item?.url || null;
    if (!raw) return null;
    try {
      const parsed = new URL(raw);
      return parsed.pathname + parsed.search;
    } catch {
      return raw;
    }
  };

  const bgUrl =
    ads.length > 0 ? url(ads[slide % ads.length]) : url(idle);
  const bgFit = fit;
  const currentAdName =
    (ads.length > 0 ? ads[slide % ads.length] : idle)?.ads_name ?? "";

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

      {bgUrl ? (
        <div
          key={`${slide}-${String(bgUrl)}`}
          className="animate-[signage-fade_0.8s_ease-out] absolute inset-0 bg-black bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: bgFit,
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs tracking-widest text-muted">
            NO CONTENT — ASSIGN AN IMAGE TO THIS SCREEN
          </span>
        </div>
      )}

      {currentAdName && (
        <div className="absolute bottom-3 left-4 z-10 text-xs tracking-widest text-white/60 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
          {currentAdName}
        </div>
      )}
    </main>
  );
}
