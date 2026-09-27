import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { errorMessage, login, type Session } from '../lib/api';
import { adminBtnPrimary, Label, Notice } from './ui';

export default function Login({ onLogin }: { onLogin: (s: Session) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      onLogin(await login(email.trim(), password));
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center font-serif text-2xl tracking-[0.18em] text-ivory">
          AGBADA <span className="italic text-gold">Luxe</span>
        </Link>
        <form onSubmit={onSubmit} className="mt-10 space-y-6 border border-line bg-charcoal p-8" aria-label="Sign in">
          <h1 className="font-serif text-3xl text-ivory">Studio sign-in</h1>
          <div>
            <Label htmlFor="login-email">Email</Label>
            <input id="login-email" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="admin-input" />
          </div>
          <div>
            <Label htmlFor="login-password">Password</Label>
            <input id="login-password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="admin-input" />
          </div>
          {error && <Notice tone="error">{error}</Notice>}
          <button type="submit" disabled={busy} className={`${adminBtnPrimary} w-full`}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="mt-6 text-center text-xs text-stone"><Link to="/" className="hover:text-sand">← Back to the website</Link></p>
      </div>
    </div>
  );
}
