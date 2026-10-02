import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { consumeMagicLink, errorMessage } from '../lib/api';
import { storeSession } from './session';
import { Notice } from './ui';

// Landing page for a one-time admin login link -- the only way into this dashboard other than the real
// password. The link is minted by Abdulwahab's portfolio AI assistant (never by this site itself) and is
// single-use and short-lived, so a visitor who's been handed one lands here, is signed in automatically, and
// is sent straight to the dashboard. Deliberately its own route, outside AdminApp's normal session gate, so it
// works whether or not a session already exists in this browser.
export default function MagicLink() {
  const { token } = useParams<{ token: string }>();
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    if (!token) {
      setError('This link is missing its token.');
      return;
    }
    consumeMagicLink(token)
      .then((session) => {
        if (!active) return;
        storeSession(session);
        window.location.replace('/admin/products');
      })
      .catch((err) => {
        if (active) setError(errorMessage(err));
      });
    return () => { active = false; };
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-sm text-center">
        <Link to="/" className="block font-serif text-2xl tracking-[0.18em] text-ivory">
          AGBADA <span className="italic text-gold">Luxe</span>
        </Link>
        <div className="mt-10 space-y-6 border border-line bg-charcoal p-8">
          {error ? (
            <>
              <Notice tone="error">{error}</Notice>
              <p className="text-sm text-stone">
                This link may have already been used or expired. <Link to="/admin" className="underline hover:text-sand">Sign in with your password</Link> instead.
              </p>
            </>
          ) : (
            <p className="text-sm text-sand">Signing you in…</p>
          )}
        </div>
      </div>
    </div>
  );
}
