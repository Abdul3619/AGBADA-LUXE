import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { errorMessage, submitBooking, type BookingKind } from '../lib/api';
import { useLocalStorage } from '../lib/useLocalStorage';

const SERVICES = ['Agbada', 'Bespoke suit', 'Ceremonial / wedding attire', 'Kaftan or senator', 'Alterations', 'Something else'];

// Optional body measurements for consultation requests. They are sent as part of the booking message, so the
// house sees them in the admin dashboard with the request (no separate database fields needed).
const MEASUREMENTS = [
  { key: 'height', label: 'Height' },
  { key: 'neck', label: 'Neck' },
  { key: 'chest', label: 'Chest' },
  { key: 'waist', label: 'Waist' },
  { key: 'hips', label: 'Hips' },
  { key: 'shoulder', label: 'Shoulder width' },
  { key: 'sleeve', label: 'Sleeve length' },
  { key: 'inseam', label: 'Inside leg' },
] as const;
type MeasurementKey = (typeof MEASUREMENTS)[number]['key'];
const FITS = ['Slim', 'Regular', 'Relaxed'];

interface Draft {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  message: string;
  unit: 'cm' | 'in';
  fit: string;
  measurements: Partial<Record<MeasurementKey, string>>;
}

function todayIso(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function measurementSummary(d: Pick<Draft, 'unit' | 'fit' | 'measurements'>) {
  const parts = MEASUREMENTS.filter((m) => d.measurements?.[m.key]?.trim()).map((m) => `${m.label}: ${d.measurements[m.key]!.trim()} ${d.unit}`);
  if (d.fit) parts.push(`Preferred fit: ${d.fit}`);
  return parts.length ? `Measurements\n${parts.join('\n')}` : '';
}

export function BookingForm({ kind, initialMessage = '' }: { kind: BookingKind; initialMessage?: string }) {
  const empty: Draft = { fullName: '', email: '', phone: '', service: '', preferredDate: '', message: initialMessage, unit: 'cm', fit: '', measurements: {} };
  // The form is remembered on this device until it is sent, so a half-finished request is not lost.
  const [form, setForm, clearForm, hydrated] = useLocalStorage<Draft>(`agbada:${kind}-draft`, empty);
  const [sentName, setSentName] = useState('');
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState<{ min: string; max: string } | null>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const hasMeasurements = Object.values(form.measurements ?? {}).some((v) => v?.trim());

  useEffect(() => setDateRange({ min: todayIso(), max: todayIso(365) }), []);

  // A product page can pass a message ("I'm interested in ..."); use it if the saved draft has none.
  useEffect(() => {
    if (hydrated && initialMessage && !form.message) setForm((f) => ({ ...f, message: initialMessage }));
  }, [hydrated, initialMessage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (sentName) doneRef.current?.focus();
  }, [sentName]);

  const set = (key: 'fullName' | 'email' | 'phone' | 'service' | 'preferredDate' | 'message' | 'fit') => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
  const setMeasurement = (key: MeasurementKey) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, measurements: { ...f.measurements, [key]: e.target.value.replace(/[^\d.,]/g, '').slice(0, 6) } }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    const snapshot = form;
    const extra = kind === 'consultation' ? measurementSummary(snapshot) : '';
    const message = [snapshot.message.trim(), extra].filter(Boolean).join('\n\n');
    // Optimistic: confirm straight away, send in the background, and bring the form back if sending fails.
    setSentName(snapshot.fullName.trim().split(' ')[0]);
    clearForm();
    try {
      await submitBooking({
        kind,
        fullName: snapshot.fullName.trim(),
        email: snapshot.email.trim(),
        phone: snapshot.phone,
        service: snapshot.service,
        preferredDate: snapshot.preferredDate,
        message,
      });
    } catch (err) {
      setForm(snapshot);
      setSentName('');
      setError(errorMessage(err));
      requestAnimationFrame(() => errorRef.current?.focus());
    }
  }

  if (sentName) {
    return (
      <div role="status" className="border border-line p-10 text-center md:p-14">
        <p className="eyebrow">Received</p>
        <p ref={doneRef} tabIndex={-1} className="display mt-5 text-4xl text-ivory focus:outline-none">Thank you, {sentName}.</p>
        <p className="mx-auto mt-4 max-w-md text-sand">
          {kind === 'consultation'
            ? 'Your consultation request has been received. We will be in touch by email or phone to confirm a time.'
            : 'Your message has been received. We will reply to you by email as soon as we can.'}
        </p>
        <button type="button" onClick={() => setSentName('')} className="btn btn-outline mt-8">
          {kind === 'consultation' ? 'Make another request' : 'Send another message'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-x-10 gap-y-9 md:grid-cols-2" aria-label={kind === 'consultation' ? 'Book a consultation' : 'Send an inquiry'}>
      {error && (
        <p ref={errorRef} tabIndex={-1} className="border border-danger/50 px-5 py-4 text-sm text-danger focus:outline-none md:col-span-2" role="alert">
          {error}
        </p>
      )}
      <div>
        <label htmlFor={`${kind}-name`} className="field-label">Full name *</label>
        <input id={`${kind}-name`} required maxLength={120} autoComplete="name" value={form.fullName} onChange={set('fullName')} className="field" />
      </div>
      <div>
        <label htmlFor={`${kind}-email`} className="field-label">Email *</label>
        <input id={`${kind}-email`} type="email" required maxLength={254} autoComplete="email" value={form.email} onChange={set('email')} className="field" />
      </div>
      <div>
        <label htmlFor={`${kind}-phone`} className="field-label">Phone</label>
        <input id={`${kind}-phone`} type="tel" maxLength={40} autoComplete="tel" value={form.phone} onChange={set('phone')} className="field" />
      </div>
      {kind === 'consultation' ? (
        <>
          <div>
            <label htmlFor={`${kind}-service`} className="field-label">Interested in</label>
            <select id={`${kind}-service`} value={form.service} onChange={set('service')} className="field">
              <option value="">Select…</option>
              {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${kind}-date`} className="field-label">Preferred date</label>
            <input id={`${kind}-date`} type="date" min={dateRange?.min} max={dateRange?.max} value={form.preferredDate} onChange={set('preferredDate')} className="field [color-scheme:dark]" />
          </div>
        </>
      ) : (
        <div>
          <label htmlFor={`${kind}-subject`} className="field-label">Subject</label>
          <input id={`${kind}-subject`} maxLength={120} value={form.service} onChange={set('service')} className="field" />
        </div>
      )}
      <div className="md:col-span-2">
        <label htmlFor={`${kind}-message`} className="field-label">
          {kind === 'consultation' ? 'Tell us about the occasion' : 'Message *'}
        </label>
        <textarea id={`${kind}-message`} rows={5} maxLength={3500} required={kind === 'inquiry'} value={form.message} onChange={set('message')} className="field resize-y" />
      </div>

      {kind === 'consultation' && (
        <details className="group border border-line md:col-span-2" open={hasMeasurements || undefined}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5">
            <span>
              <span className="eyebrow">Optional</span>
              <span className="mt-2 block font-serif text-2xl text-ivory">Add your measurements</span>
            </span>
            <span aria-hidden="true" className="text-2xl text-gold transition-transform group-open:rotate-45">+</span>
          </summary>
          <div className="border-t border-line px-6 pb-8 pt-6">
            <p className="text-sm text-sand">
              If you already know your measurements, add them here and we can prepare before the fitting. Not sure how to measure?
              See the <Link to="/size-guide" className="underline text-ivory">size guide</Link>. We always confirm them in person.
            </p>
            <fieldset className="mt-6">
              <legend className="field-label">Units</legend>
              <div className="flex gap-6">
                {(['cm', 'in'] as const).map((u) => (
                  <label key={u} className="flex items-center gap-2 text-sand">
                    <input type="radio" name={`${kind}-unit`} value={u} checked={form.unit === u} onChange={() => setForm((f) => ({ ...f, unit: u }))} className="accent-[var(--color-gold)]" />
                    {u === 'cm' ? 'Centimetres' : 'Inches'}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-4">
              {MEASUREMENTS.map((m) => (
                <div key={m.key}>
                  <label htmlFor={`m-${m.key}`} className="field-label">{m.label} ({form.unit})</label>
                  <input id={`m-${m.key}`} inputMode="decimal" value={form.measurements?.[m.key] ?? ''} onChange={setMeasurement(m.key)} className="field" />
                </div>
              ))}
            </div>
            <div className="mt-6 max-w-xs">
              <label htmlFor="m-fit" className="field-label">Preferred fit</label>
              <select id="m-fit" value={form.fit} onChange={set('fit')} className="field">
                <option value="">No preference</option>
                {FITS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </details>
      )}

      <div className="flex flex-col items-start gap-4 md:col-span-2">
        <button type="submit" className="btn btn-solid">
          {kind === 'consultation' ? 'Request consultation' : 'Send message'}
        </button>
        <p className="text-xs text-stone">
          Your details are used only to respond to this request, and are kept on this device until you send them.
        </p>
      </div>
    </form>
  );
}
