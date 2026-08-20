"use client";

import { useCallback, useEffect, useState } from "react";

type SignageBrief = {
  id: string;
  name: string;
  code: string;
  status: "active" | "inactive";
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export default function SignageLandingPage() {
  const [signages, setSignages] = useState<SignageBrief[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/signages/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSignages(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSignages([]);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-dvh bg-ink text-parchment">
      <div className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-6 py-10">
        <div className="mb-10 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/image/logo-fp.svg"
            alt="Fix Parking"
            className="h-16 w-16"
          />
          <div>
            <h1 className="text-3xl font-bold text-gold">Fix Parking</h1>
            <p className="text-sm text-muted">Signage Display Screens</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-gate-danger/40 bg-gate-danger/10 px-4 py-3 text-sm text-gate-danger">
            Cannot reach API ({error}) — open a screen URL directly.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {(signages ?? []).length === 0 && (
            <div className="sm:col-span-2 rounded-lg border border-gold/30 bg-ink-2 px-4 py-3 text-sm text-muted">
              {signages === null
                ? "Loading screens…"
                : "No signage screens configured yet."}
            </div>
          )}
          {(signages ?? []).map((s) => (
            <a
              key={s.id}
              href={`/signage/${encodeURIComponent(s.code)}`}
              className="group flex items-center justify-between rounded-xl border border-gold/30 bg-ink-2 p-5 transition hover:border-gold hover:bg-ink-3"
            >
              <div>
                <div className="text-lg font-semibold text-gold-light group-hover:text-gold">
                  {s.name}
                </div>
                <div className="font-mono text-xs text-muted">{s.code}</div>
              </div>
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  s.status === "active" ? "bg-gate-ok" : "bg-gate-danger"
                }`}
              />
            </a>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted">
          Open a screen in fullscreen (F11) to use it as an on-site display.
        </p>
      </div>
    </main>
  );
}