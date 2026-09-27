import type { ReactNode } from 'react';

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
      <div>
        <h1 className="font-serif text-4xl text-ivory md:text-5xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-sand">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

export function Notice({ tone = 'info', children }: { tone?: 'info' | 'error' | 'success'; children: ReactNode }) {
  const styles = {
    info: 'border-line text-sand',
    error: 'border-danger/50 text-danger',
    success: 'border-gold/50 text-gold-soft',
  }[tone];
  return (
    <p role={tone === 'error' ? 'alert' : 'status'} className={`border px-4 py-3 text-sm ${styles}`}>
      {children}
    </p>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="border border-dashed border-line px-6 py-16 text-center">
      <p className="font-serif text-2xl text-ivory">{title}</p>
      {children && <div className="mx-auto mt-3 max-w-md text-sm text-sand">{children}</div>}
    </div>
  );
}

export function Label({ htmlFor, children, hint }: { htmlFor: string; children: ReactNode; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-xs uppercase tracking-[0.18em] text-sand">
      {children}
      {hint && <span className="ml-2 normal-case tracking-normal text-stone">{hint}</span>}
    </label>
  );
}

export const adminBtn = 'inline-flex items-center justify-center gap-2 rounded-[2px] px-4 py-2.5 text-xs uppercase tracking-[0.18em] transition-colors disabled:cursor-not-allowed disabled:opacity-50';
export const adminBtnPrimary = `${adminBtn} bg-ivory text-ink hover:bg-gold`;
export const adminBtnGhost = `${adminBtn} border border-line text-sand hover:border-gold hover:text-gold`;
export const adminBtnDanger = `${adminBtn} border border-danger/40 text-danger hover:bg-danger/10`;
