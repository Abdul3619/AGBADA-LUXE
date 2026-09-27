import { useState, type FormEvent } from 'react';
import { changePassword } from '../lib/api';
import { useAdmin } from './session';
import { adminBtnGhost, adminBtnPrimary, Label, Notice, PageHeader } from './ui';

export default function Account() {
  const { token, email, replaceSession, signOut, handleError } = useAdmin();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setDone(false);
    if (next !== confirm) {
      setError('The new passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      replaceSession(await changePassword(token, current, next));
      setCurrent(''); setNext(''); setConfirm('');
      setDone(true);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-xl">
      <PageHeader title="Account" description={`Signed in as ${email}.`} />
      <form onSubmit={onSubmit} className="space-y-6" aria-label="Change password">
        <h2 className="font-serif text-2xl text-ivory">Change password</h2>
        <input type="text" autoComplete="username" value={email} readOnly hidden />
        <div>
          <Label htmlFor="pw-current">Current password</Label>
          <input id="pw-current" type="password" required autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className="admin-input" />
        </div>
        <div>
          <Label htmlFor="pw-new" hint="at least 10 characters">New password</Label>
          <input id="pw-new" type="password" required minLength={10} maxLength={200} autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className="admin-input" />
        </div>
        <div>
          <Label htmlFor="pw-confirm">Confirm new password</Label>
          <input id="pw-confirm" type="password" required minLength={10} maxLength={200} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="admin-input" />
        </div>
        {error && <Notice tone="error">{error}</Notice>}
        {done && <Notice tone="success">Password changed. Any other devices have been signed out.</Notice>}
        <button type="submit" disabled={busy} className={adminBtnPrimary}>{busy ? 'Saving…' : 'Change password'}</button>
      </form>
      <div className="mt-14 border-t border-line pt-8">
        <button type="button" onClick={() => void signOut()} className={adminBtnGhost}>Sign out</button>
      </div>
    </div>
  );
}
