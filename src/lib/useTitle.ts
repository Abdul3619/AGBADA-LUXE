import { useEffect } from 'react';

export const SITE_NAME = 'Atelier Noir';

export function useTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Bespoke Tailoring, Worldwide`;
  }, [title]);
}
