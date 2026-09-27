import { useState, type FormEvent } from 'react';
import { errorMessage, submitBooking, type BookingKind } from '../lib/api';

const SERVICES = ['Agbada', 'Bespoke suit', 'Ceremonial / wedding attire', 'Kaftan or senator', 'Alterations', 'Something else'];

function todayIso(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function BookingForm({ kind, initialMessage = '' }: { kind: BookingKind; initialMessage?: string }) {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', service: '', preferredDate: '', message: initialMessage });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      await submitBooking({ kind, ...form, fullName: form.fullName.trim(), email: form.email.trim() });
      setDone(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="border border-line p-10 text-center md:p-14">
        <p className="eyebrow">Received</p>
        <p className="display mt-5 text-4xl text-ivory">Thank you, {form.fullName.split(' ')[0]}.</p>
        <p className="mx-auto mt-4 max-w-md text-sand">
          {kind === 'consultation'
            ? 'Your consultation request has been received. We will be in touch by email or phone to confirm a time.'
            : 'Your message has been received. We will reply to you by email as soon as we can.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-x-10 gap-y-9 md:grid-cols-2" aria-label={kind === 'consultation' ? 'Book a consultation' : 'Send an inquiry'}>
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
            <input id={`${kind}-date`} type="date" min={todayIso()} max={todayIso(365)} value={form.preferredDate} onChange={set('preferredDate')} className="field" />
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
        <textarea
          id={`${kind}-message`}
          rows={5}
          maxLength={4000}
          required={kind === 'inquiry'}
          value={form.message}
          onChange={set('message')}
          className="field resize-y"
        />
      </div>
      <div className="flex flex-col items-start gap-4 md:col-span-2">
        {error && <p className="text-sm text-danger" role="alert">{error}</p>}
        <button type="submit" disabled={sending} className="btn btn-solid">
          {sending ? 'Sending…' : kind === 'consultation' ? 'Request consultation' : 'Send message'}
        </button>
        <p className="text-xs text-stone">Your details are used only to respond to this request.</p>
      </div>
    </form>
  );
}
