import { CalendarCheck, ExternalLink, FileText, LogOut, Mail, Package, UserRound } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { ApiError, errorMessage, getSession, logout, type Session } from '../lib/api';
import { useTitle } from '../lib/useTitle';
import Account from './Account';
import Bookings from './Bookings';
import Content from './Content';
import Login from './Login';
import Newsletter from './Newsletter';
import Products from './Products';
import { AdminContext, loadSession, storeSession, type AdminContextValue } from './session';

const NAV = [
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { to: '/admin/content', label: 'Site content', icon: FileText },
  { to: '/admin/account', label: 'Account', icon: UserRound },
];

function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}

export default function AdminApp() {
  useTitle('Studio');
  useNoIndex();
  const [session, setSession] = useState<Session | null>(() => loadSession());
  const [email, setEmail] = useState<string | null>(null);
  const [checkError, setCheckError] = useState('');

  const clear = useCallback(() => {
    storeSession(null);
    setSession(null);
    setEmail(null);
  }, []);

  useEffect(() => {
    if (!session || email) return;
    let active = true;
    getSession(session.token)
      .then((s) => active && setEmail(s.email))
      .catch((err) => {
        if (!active) return;
        if (err instanceof ApiError && err.code === 'unauthorized') clear();
        else setCheckError(errorMessage(err));
      });
    return () => { active = false; };
  }, [session, email, clear]);

  // Sign out automatically when the 12-hour session expires while the dashboard is open.
  useEffect(() => {
    if (!session) return;
    const ms = new Date(session.expiresAt).getTime() - Date.now();
    const timer = window.setTimeout(clear, Math.max(0, Math.min(ms, 2 ** 31 - 1)));
    return () => window.clearTimeout(timer);
  }, [session, clear]);

  const ctx = useMemo<AdminContextValue | null>(() => {
    if (!session || !email) return null;
    return {
      token: session.token,
      email,
      replaceSession: (s) => { storeSession(s); setSession(s); },
      signOut: async () => {
        try { await logout(session.token); } catch { /* signing out locally is enough */ }
        clear();
      },
      handleError: (err) => {
        if (err instanceof ApiError && err.code === 'unauthorized') clear();
        return errorMessage(err);
      },
    };
  }, [session, email, clear]);

  if (!session) {
    return <Login onLogin={(s) => { storeSession(s); setCheckError(''); setSession(s); }} />;
  }
  if (!ctx) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink px-5 text-center text-sand">
        {checkError ? (
          <>
            <p>{checkError}</p>
            <button type="button" onClick={() => { setCheckError(''); setEmail(null); setSession({ ...session }); }} className="underline hover:text-gold">Try again</button>
          </>
        ) : <p>Loading…</p>}
      </div>
    );
  }

  return (
    <AdminContext.Provider value={ctx}>
      <div className="min-h-screen bg-ink text-ivory md:grid md:grid-cols-[15rem_1fr]">
        <aside className="border-b border-line bg-charcoal md:sticky md:top-0 md:flex md:h-screen md:flex-col md:border-b-0 md:border-r">
          <div className="flex items-center justify-between px-5 py-5 md:block md:px-6 md:py-8">
            <Link to="/" className="font-serif text-xl tracking-[0.16em] text-ivory">AGBADA <span className="italic text-gold">Luxe</span></Link>
            <p className="hidden text-[0.65rem] uppercase tracking-[0.2em] text-stone md:mt-1 md:block">Studio</p>
            <button type="button" onClick={() => void ctx.signOut()} className="p-2 text-stone hover:text-gold md:hidden" aria-label="Sign out"><LogOut size={18} /></button>
          </div>
          <nav aria-label="Studio" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:px-3 md:pb-0">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 rounded-[2px] px-3 py-2.5 text-sm transition-colors ${isActive ? 'bg-ink text-gold' : 'text-sand hover:text-ivory'}`}
              >
                <Icon size={16} strokeWidth={1.5} /> {label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden space-y-1 border-t border-line p-3 md:block">
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 text-sm text-sand hover:text-ivory"><ExternalLink size={16} strokeWidth={1.5} /> View website</a>
            <button type="button" onClick={() => void ctx.signOut()} className="flex w-full items-center gap-3 px-3 py-2 text-sm text-sand hover:text-ivory"><LogOut size={16} strokeWidth={1.5} /> Sign out</button>
          </div>
        </aside>
        <main className="min-w-0 px-5 py-8 md:px-12 md:py-12">
          <Routes>
            <Route index element={<Navigate to="/admin/products" replace />} />
            <Route path="products" element={<Products />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="newsletter" element={<Newsletter />} />
            <Route path="content" element={<Content />} />
            <Route path="account" element={<Account />} />
            <Route path="*" element={<Navigate to="/admin/products" replace />} />
          </Routes>
        </main>
      </div>
    </AdminContext.Provider>
  );
}
