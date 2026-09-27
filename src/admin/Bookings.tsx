import { Mail, Phone } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { adminListBookings, BOOKING_STATUSES, updateBookingStatus, type Booking, type BookingStatus } from '../lib/api';
import { formatDate } from '../lib/format';
import { useAdmin } from './session';
import { Empty, Notice, PageHeader } from './ui';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'consultation', label: 'Consultations' },
  { value: 'inquiry', label: 'Inquiries' },
  { value: 'open', label: 'Needs attention' },
] as const;

export default function Bookings() {
  const { token, handleError } = useAdmin();
  const [rows, setRows] = useState<Booking[] | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['value']>('all');

  const load = useCallback(async () => {
    try {
      setRows(await adminListBookings(token));
      setError('');
    } catch (err) {
      setError(handleError(err));
    }
  }, [token, handleError]);

  useEffect(() => { void load(); }, [load]);

  async function setStatus(b: Booking, status: BookingStatus) {
    setRows((r) => r?.map((x) => (x.id === b.id ? { ...x, status } : x)) ?? r);
    try {
      await updateBookingStatus(token, b.id, status);
    } catch (err) {
      setError(handleError(err));
      void load();
    }
  }

  const visible = (rows ?? []).filter((b) =>
    filter === 'all' ? true : filter === 'open' ? b.status === 'new' || b.status === 'contacted' : b.kind === filter);

  return (
    <div>
      <PageHeader title="Bookings & inquiries" description="Consultation requests and messages sent from the website." />
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full border px-4 py-1.5 text-xs tracking-wide transition-colors ${filter === f.value ? 'border-gold text-gold' : 'border-line text-sand hover:text-ivory'}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      {error && <div className="mb-6"><Notice tone="error">{error}</Notice></div>}
      {!rows && !error && <p className="text-sm text-stone">Loading…</p>}
      {rows && visible.length === 0 && (
        <Empty title={rows.length === 0 ? 'No bookings yet' : 'Nothing here'}>
          {rows.length === 0 ? 'Requests from the Consultation and Contact pages will appear here.' : 'No requests match this filter.'}
        </Empty>
      )}
      <ul className="space-y-4">
        {visible.map((b) => (
          <li key={b.id} className="border border-line bg-charcoal p-5 md:p-6" data-testid="booking-row">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">
                  {b.kind === 'consultation' ? 'Consultation' : 'Inquiry'} · {formatDate(b.created_at, true)}
                </p>
                <p className="mt-2 font-serif text-2xl text-ivory">{b.full_name}</p>
              </div>
              <label className="flex items-center gap-2 text-xs text-sand">
                Status
                <select
                  value={b.status}
                  onChange={(e) => void setStatus(b, e.target.value as BookingStatus)}
                  className="admin-input !w-auto !py-1.5 capitalize"
                  aria-label={`Status for ${b.full_name}`}
                >
                  {BOOKING_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-sand">
              <a href={`mailto:${b.email}`} className="inline-flex items-center gap-2 break-all hover:text-gold"><Mail size={14} /> {b.email}</a>
              {b.phone && <a href={`tel:${b.phone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-2 hover:text-gold"><Phone size={14} /> {b.phone}</a>}
              {b.service && <span>{b.kind === 'consultation' ? 'Interested in' : 'Subject'}: <span className="text-ivory">{b.service}</span></span>}
              {b.preferred_date && <span>Preferred date: <span className="text-ivory">{formatDate(b.preferred_date)}</span></span>}
            </div>
            {b.message && <p className="mt-4 whitespace-pre-line border-t border-line pt-4 text-sm text-ivory/90">{b.message}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
