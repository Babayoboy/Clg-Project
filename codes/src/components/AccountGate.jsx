import React, { useState } from 'react';
import { Activity, Database, LockKeyhole, ShieldCheck } from 'lucide-react';
import { authenticateAccount } from '../utils/localAccount.js';

export function AccountGate({ onAuthenticated, initialError = '' }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const credentials = { username, password };
      if (mode === 'register') credentials.name = name;
      onAuthenticated(await authenticateAccount(mode, credentials));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
  };

  return (
    <main className="min-h-screen bg-[#1b1b1e] text-[#d8dbe2] flex items-center justify-center px-5 py-12 font-mono" data-account-gate>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl border border-[#58a4b0]/50 bg-[#58a4b0]/10 grid place-items-center text-[#58a4b0]">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#58a4b0]">Hnazer Clinical</p>
            <h1 className="text-2xl font-bold text-white">Your local health account</h1>
          </div>
        </div>

        <section className="clinical-panel rounded-xl border border-[#373f51] bg-[#222834]/90 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3 border-b border-[#373f51] pb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
              <p className="mt-1 text-xs text-[#a9bcd0]">Stored only on this device</p>
            </div>
            <LockKeyhole className="h-5 w-5 text-[#58a4b0]" />
          </div>

          <div className="mt-5 grid grid-cols-2 rounded-lg border border-[#373f51] p-1 text-xs" role="tablist" aria-label="Account action">
            <button type="button" role="tab" aria-selected={mode === 'login'} onClick={() => switchMode('login')} className={`rounded-md px-3 py-2 ${mode === 'login' ? 'bg-[#58a4b0] font-bold text-[#1b1b1e]' : 'text-[#a9bcd0] hover:text-white'}`}>
              Sign in
            </button>
            <button type="button" role="tab" aria-selected={mode === 'register'} onClick={() => switchMode('register')} className={`rounded-md px-3 py-2 ${mode === 'register' ? 'bg-[#58a4b0] font-bold text-[#1b1b1e]' : 'text-[#a9bcd0] hover:text-white'}`}>
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {mode === 'register' && (
              <label className="block text-xs text-[#a9bcd0]">
                Name
                <input required maxLength={80} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-lg border border-[#4b5873] bg-[#1b1b1e] px-3 py-2.5 text-sm text-white outline-none focus:border-[#58a4b0]" />
              </label>
            )}
            <label className="block text-xs text-[#a9bcd0]">
              Username
              <input required minLength={3} maxLength={32} pattern="[A-Za-z0-9_]+" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="mt-1.5 w-full rounded-lg border border-[#4b5873] bg-[#1b1b1e] px-3 py-2.5 text-sm text-white outline-none focus:border-[#58a4b0]" />
            </label>
            <label className="block text-xs text-[#a9bcd0]">
              Password
              <input required minLength={8} maxLength={128} type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-[#4b5873] bg-[#1b1b1e] px-3 py-2.5 text-sm text-white outline-none focus:border-[#58a4b0]" />
              {mode === 'register' && <span className="mt-1 block text-[11px] text-[#718096]">Use at least 8 characters.</span>}
            </label>
            {error && <p role="alert" className="rounded-lg border border-rose-700/60 bg-rose-950/40 px-3 py-2 text-xs leading-relaxed text-rose-200">{error}</p>}
            <button disabled={busy} type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#58a4b0] px-4 py-3 text-sm font-bold text-[#1b1b1e] transition-colors hover:bg-[#72b9c3] disabled:cursor-wait disabled:opacity-60">
              <span>{busy ? 'Please wait...' : mode === 'login' ? 'Sign in locally' : 'Create local account'}</span>
            </button>
          </form>

          <div className="mt-6 flex gap-3 border-t border-[#373f51] pt-4 text-[11px] leading-relaxed text-[#a9bcd0]">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <p>Your password is stored as a salted hash. Your profile and logs stay in a SQLite database on this computer.</p>
          </div>
        </section>
        <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#718096]">
          <Database className="h-3.5 w-3.5" /> Local database service required
        </p>
      </div>
    </main>
  );
}