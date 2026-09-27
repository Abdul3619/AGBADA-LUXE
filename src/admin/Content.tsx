import { useEffect, useState, type FormEvent } from 'react';
import { getSettings, saveSettings, SETTING_KEYS, type SettingKey, type Settings } from '../lib/api';
import { useSettings } from '../lib/settings';
import { ImageField } from './ImageField';
import { useAdmin } from './session';
import { adminBtnPrimary, Label, Notice, PageHeader } from './ui';

const FIELDS: { key: Exclude<SettingKey, 'hero_image_url'>; label: string; hint?: string; rows?: number; type?: string }[] = [
  { key: 'tagline', label: 'Homepage headline', hint: 'large text over the hero image' },
  { key: 'intro', label: 'Homepage introduction', rows: 3 },
  { key: 'about_title', label: 'About page title' },
  { key: 'about_body', label: 'About page text', hint: 'leave a blank line between paragraphs', rows: 8 },
  { key: 'contact_email', label: 'Contact email', type: 'email' },
  { key: 'contact_phone', label: 'Telephone' },
  { key: 'whatsapp', label: 'WhatsApp number', hint: 'with country code, e.g. +234…' },
  { key: 'instagram_url', label: 'Instagram link', type: 'url' },
  { key: 'address', label: 'Atelier address', rows: 2 },
  { key: 'opening_hours', label: 'Opening hours', rows: 3 },
];

export default function Content() {
  const { token, handleError } = useAdmin();
  const { refresh } = useSettings();
  const [form, setForm] = useState<Settings | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings().then(setForm).catch((err) => setError(handleError(err)));
  }, [handleError]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setError('');
    setSaved(false);
    setBusy(true);
    try {
      const payload = Object.fromEntries(SETTING_KEYS.map((k) => [k, (form[k] ?? '').trim()]));
      await saveSettings(token, payload);
      await refresh();
      setSaved(true);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setBusy(false);
    }
  }

  if (!form) return <div><PageHeader title="Site content" />{error ? <Notice tone="error">{error}</Notice> : <p className="text-sm text-stone">Loading…</p>}</div>;

  const set = (key: SettingKey, value: string) => { setSaved(false); setForm((f) => ({ ...f, [key]: value })); };

  return (
    <form onSubmit={onSubmit} aria-label="Site content">
      <PageHeader
        title="Site content"
        description="Text and contact details shown on the website. Empty fields are simply hidden."
        actions={<button type="submit" disabled={busy} className={adminBtnPrimary}>{busy ? 'Saving…' : 'Save changes'}</button>}
      />
      {saved && <div className="mb-6"><Notice tone="success">Saved. The website now shows these details.</Notice></div>}
      {error && <div className="mb-6"><Notice tone="error">{error}</Notice></div>}
      <div className="grid gap-10 lg:grid-cols-[18rem_1fr]">
        <div>
          <Label htmlFor="hero-image" hint="optional">Homepage image</Label>
          <ImageField id="hero-image" aspect="aspect-[4/5]" url={form.hero_image_url || null} onChange={(v) => set('hero_image_url', v?.url ?? '')} />
          {!form.hero_image_url && <p className="mt-2 text-xs text-stone">The built-in photograph is used until you upload one.</p>}
        </div>
        <div className="grid content-start gap-6 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.key} className={f.rows && f.rows > 2 ? 'sm:col-span-2' : ''}>
              <Label htmlFor={`setting-${f.key}`} hint={f.hint}>{f.label}</Label>
              {f.rows ? (
                <textarea id={`setting-${f.key}`} rows={f.rows} maxLength={4000} value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} className="admin-input resize-y" />
              ) : (
                <input id={`setting-${f.key}`} type={f.type ?? 'text'} maxLength={f.key === 'tagline' ? 160 : 400} value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} className="admin-input" />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 border-t border-line pt-6">
        <button type="submit" disabled={busy} className={adminBtnPrimary}>{busy ? 'Saving…' : 'Save changes'}</button>
      </div>
    </form>
  );
}
