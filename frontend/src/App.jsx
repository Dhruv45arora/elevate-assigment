import { useState } from "react";
import { isLoggedIn } from "./api/client";
import AuthPanel from "./components/AuthPanel";
import WritingAssistant from "./components/WritingAssistant";

export default function App() {
  const [authenticated, setAuthenticated] = useState(isLoggedIn());

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              elevatecareer.ai
            </p>
            <h1 className="text-lg font-semibold text-slate-900">
              AI Writing Assistant
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        {authenticated ? (
          <WritingAssistant onLogout={() => setAuthenticated(false)} />
        ) : (
          <AuthPanel onAuthenticated={() => setAuthenticated(true)} />
        )}
      </main>
    </div>
  );
}
