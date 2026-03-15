"use client";

import { FormEvent, useState } from "react";

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

  const disabled = loading || text.trim().length === 0;
  const maxChars = 1600;

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
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">AI Insight Generator</p>
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">Paste text. Get instant insights.</h1>
          <p className="text-base text-slate-600 sm:text-lg">
            Summarize any passage, surface 3 key takeaways, and get a crisp title in one click.
          </p>
        </header>

        <section className="grid gap-6 rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Paste or type your text</span>
              <span>
                {text.length}/{maxChars}
              </span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, maxChars))}
              placeholder="Drop in a paragraph, meeting notes, or an article excerpt..."
              className="h-48 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-base leading-6 text-slate-800 shadow-inner outline-none transition focus:border-blue-400 focus:bg-white"
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">Processed server-side; we don&apos;t persist your text.</p>
              <button
                type="submit"
                disabled={disabled}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Generating...
                  </>
                ) : (
                  "Generate Insights"
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-rose-700">
              {error}
            </div>
          )}

          {result && (
            <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Suggested title</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">{result.title}</h2>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                <div className="sm:col-span-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Summary</p>
                  <p className="mt-2 text-slate-800 leading-6">{result.summary}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Key insights</p>
                  <ul className="mt-2 space-y-2 text-slate-800">
                    {result.insights.map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-blue-600/80" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
