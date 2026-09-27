import { Download, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { adminListSubscribers, deleteSubscriber, type Subscriber } from '../lib/api';
import { formatDate } from '../lib/format';
import { useAdmin } from './session';
import { adminBtnGhost, Empty, Notice, PageHeader } from './ui';

export default function Newsletter() {
  const { token, handleError } = useAdmin();
  const [rows, setRows] = useState<Subscriber[] | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setRows(await adminListSubscribers(token));
      setError('');
    } catch (err) {
      setError(handleError(err));
    }
  }, [token, handleError]);

  useEffect(() => { void load(); }, [load]);

  function exportCsv() {
    if (!rows) return;
    const csv = ['email,signed_up', ...rows.map((r) => `${r.email},${r.created_at}`)].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `agbada-luxe-newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function remove(s: Subscriber) {
    if (!window.confirm(`Remove ${s.email} from the list?`)) return;
    try {
      await deleteSubscriber(token, s.id);
      setRows((r) => r?.filter((x) => x.id !== s.id) ?? r);
    } catch (err) {
      setError(handleError(err));
    }
  }

  return (
    <div>
      <PageHeader
        title="Newsletter"
        description={rows ? `${rows.length} ${rows.length === 1 ? 'person has' : 'people have'} signed up from the website footer.` : undefined}
        actions={rows && rows.length > 0 && <button type="button" onClick={exportCsv} className={adminBtnGhost}><Download size={14} /> Export CSV</button>}
      />
      {error && <div className="mb-6"><Notice tone="error">{error}</Notice></div>}
      {!rows && !error && <p className="text-sm text-stone">Loading…</p>}
      {rows && rows.length === 0 && <Empty title="No sign-ups yet">Addresses entered in the website footer will appear here.</Empty>}
      {rows && rows.length > 0 && (
        <ul className="divide-y divide-line border-y border-line">
          {rows.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-4 py-3" data-testid="subscriber-row">
              <div className="min-w-0">
                <p className="truncate text-ivory">{s.email}</p>
                <p className="text-xs text-stone">{formatDate(s.created_at, true)}</p>
              </div>
              <button type="button" onClick={() => void remove(s)} className="p-2 text-stone hover:text-danger" aria-label={`Remove ${s.email}`}>
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
