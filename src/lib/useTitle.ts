import { useEffect } from 'react';

export const SITE_NAME = 'Agbada Luxe';

export function useTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Agbada & Bespoke Tailoring`;
  }, [title]);
}
