"use client";

import { FormEvent, useRef, useState } from "react";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

interface InsightResponse {
  summary: string;
  insights: string[];
  title: string;
}

export default function HomePage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const disabled = loading || text.trim().length === 0;
  const maxChars = 1600;

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error || "Failed to generate insights");
      }

      const data = (await response.json()) as InsightResponse;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <WebGLShader />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12">
        <header className="relative flex flex-col items-center justify-center gap-6 text-center">
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
            AI Insight Generator
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl md:text-7xl">
            Design is Everything
          </h1>
          <p className="max-w-2xl text-base text-white/70 sm:text-lg">
            Unleashing clarity from your text with vivid summaries, sharp takeaways, and titles that stick.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <LiquidButton className="text-white px-6 py-3" onClick={scrollToForm}>
              Let&apos;s Go
            </LiquidButton>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-emerald-300">
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Available for new prompts
            </div>
          </div>
        </header>

        <section ref={formRef} className="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
            <div className="flex-1 space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Paste your text</p>
              <p className="text-white/70">We process securely; nothing is stored.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Paste or type your text</span>
                  <span>
                    {text.length}/{maxChars}
                  </span>
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, maxChars))}
                  placeholder="Drop in a paragraph, meeting notes, or an article excerpt..."
                  className="h-48 w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-4 text-base leading-6 text-white shadow-inner outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-white/60">Processed server-side; we don&apos;t persist your text.</p>
                  <button
                    type="submit"
                    disabled={disabled}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Generating...
                      </>
                    ) : (
                      "Generate Insights"
                    )}
                  </button>
                </div>
              </form>
              {error && <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-rose-100">{error}</div>}
            </div>

            <div className="flex-1 rounded-2xl border border-white/10 bg-black/40 p-6 shadow-inner backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Live Output</p>
              {!result && <p className="mt-3 text-white/60">Insights will appear here once generated.</p>}
              {result && (
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Suggested title</p>
                    <h2 className="mt-2 text-2xl font-bold text-white">{result.title}</h2>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Summary</p>
                    <p className="mt-2 leading-6 text-white/80">{result.summary}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Key insights</p>
                    <ul className="mt-3 space-y-2 text-white/80">
                      {result.insights.map((item, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
