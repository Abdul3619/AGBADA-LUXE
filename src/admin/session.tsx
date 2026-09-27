import { createContext, useContext } from 'react';
import type { Session } from '../lib/api';

const STORAGE_KEY = 'agbada_admin_session';

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    if (typeof s.token !== 'string' || new Date(s.expiresAt).getTime() <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function storeSession(s: Session | null) {
  try {
    if (s) localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private browsing: the session simply lasts for this tab.
  }
}

export interface AdminContextValue {
  token: string;
  email: string;
  /** Replaces the session token (after a password change). */
  replaceSession: (s: Session) => void;
  signOut: () => Promise<void>;
  /** Returns a message to show; signs out automatically when the session has ended. */
  handleError: (err: unknown) => string;
}

export const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside the admin area');
  return ctx;
}
