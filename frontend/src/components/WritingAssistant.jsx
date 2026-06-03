import { useState } from "react";
import { clearTokens, rewriteText } from "../api/client";

export default function WritingAssistant({ onLogout }) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("rewrite");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult("");
    setLoading(true);

    try {
      const data = await rewriteText(text, mode);
      setResult(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    clearTokens();
    onLogout();
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            AI Writing Assistant
          </h2>
          <p className="text-sm text-slate-500">
            Paste text and rewrite or summarise it with Claude.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Log out
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Your text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows={8}
            placeholder={
              mode === "summarise"
                ? "Paste the article or paragraph you want summarized (not a question to the AI)…"
                : "Paste or type the text you want to rewrite…"
            }
            className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-indigo-500 focus:ring-2"
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Mode
          </span>
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="mode"
                value="rewrite"
                checked={mode === "rewrite"}
                onChange={() => setMode("rewrite")}
              />
              Rewrite
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="mode"
                value="summarise"
                checked={mode === "summarise"}
                onChange={() => setMode("summarise")}
              />
              Summarise
            </label>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Processing…" : "Submit"}
        </button>
      </form>

      {(loading || result) && (
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {loading ? "Loading" : "Result"}
          </h3>
          {loading ? (
            <p className="mt-3 animate-pulse text-slate-600">
              Claude is working on your text…
            </p>
          ) : (
            <p className="mt-3 whitespace-pre-wrap text-slate-900">{result}</p>
          )}
        </section>
      )}
    </div>
  );
}
