import { ExternalLink, Pencil, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  adminListProducts, CURRENCIES, deleteProduct, saveProduct, type AdminProduct, type Currency, type ProductInput,
} from '../lib/api';
import { formatPrice } from '../lib/format';
import { ImageField } from './ImageField';
import { useAdmin } from './session';
import { adminBtnDanger, adminBtnGhost, adminBtnPrimary, Empty, Label, Notice, PageHeader } from './ui';

interface Draft {
  id: string | null;
  name: string;
  description: string;
  price: string;
  currency: Currency;
  category: string;
  imageUrl: string | null;
  imagePath: string | null;
  isPublished: boolean;
  sortOrder: string;
}

const emptyDraft = (): Draft => ({
  id: null, name: '', description: '', price: '', currency: 'NGN', category: '', imageUrl: null, imagePath: null,
  isPublished: true, sortOrder: '0',
});

const toDraft = (p: AdminProduct): Draft => ({
  id: p.id, name: p.name, description: p.description, price: p.price === null ? '' : String(p.price), currency: p.currency,
  category: p.category, imageUrl: p.image_url, imagePath: p.image_path, isPublished: p.is_published, sortOrder: String(p.sort_order),
});

function Editor({ draft, categories, onClose, onSaved }: {
  draft: Draft; categories: string[]; onClose: () => void; onSaved: (message: string) => void;
}) {
  const { token, handleError } = useAdmin();
  const [form, setForm] = useState<Draft>(draft);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setForm((f) => ({ ...f, [key]: value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    const priceText = form.price.replace(/,/g, '').trim();
    const price = priceText === '' ? null : Number(priceText);
    if (price !== null && (!Number.isFinite(price) || price < 0)) {
      setError('Please enter a valid price, or leave it blank for “Price on request”.');
      return;
    }
    const input: ProductInput = {
      id: form.id, name: form.name.trim(), description: form.description.trim(), price, currency: form.currency,
      category: form.category.trim(), imageUrl: form.imageUrl, imagePath: form.imagePath, isPublished: form.isPublished,
      sortOrder: Number.parseInt(form.sortOrder, 10) || 0,
    };
    setBusy(true);
    try {
      await saveProduct(token, input);
      onSaved(form.id ? `“${input.name}” was updated.` : `“${input.name}” was added.`);
    } catch (err) {
      setError(handleError(err));
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!form.id || !window.confirm(`Delete “${form.name}”? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await deleteProduct(token, form.id);
      onSaved(`“${form.name}” was deleted.`);
    } catch (err) {
      setError(handleError(err));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="border border-line bg-charcoal p-6 md:p-8" aria-label={form.id ? 'Edit product' : 'New product'}>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="font-serif text-3xl text-ivory">{form.id ? 'Edit product' : 'New product'}</h2>
        <button type="button" onClick={onClose} className={adminBtnGhost}>Cancel</button>
      </div>
      <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
        <div>
          <Label htmlFor="product-image">Image</Label>
          <ImageField
            id="product-image"
            url={form.imageUrl}
            onChange={(v) => setForm((f) => ({ ...f, imageUrl: v?.url ?? null, imagePath: v?.path ?? null }))}
          />
        </div>
        <div className="grid content-start gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="product-name">Name *</Label>
            <input id="product-name" required maxLength={120} value={form.name} onChange={(e) => set('name', e.target.value)} className="admin-input" />
          </div>
          <div>
            <Label htmlFor="product-category" hint="e.g. Agbada, Suits">Category *</Label>
            <input id="product-category" required maxLength={60} list="product-categories" value={form.category} onChange={(e) => set('category', e.target.value)} className="admin-input" />
            <datalist id="product-categories">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          </div>
          <div className="grid grid-cols-[1fr_6rem] gap-3">
            <div>
              <Label htmlFor="product-price" hint="blank = on request">Price</Label>
              <input id="product-price" inputMode="decimal" value={form.price} onChange={(e) => set('price', e.target.value)} className="admin-input" placeholder="Price on request" />
            </div>
            <div>
              <Label htmlFor="product-currency">Currency</Label>
              <select id="product-currency" value={form.currency} onChange={(e) => set('currency', e.target.value as Currency)} className="admin-input">
                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="product-description">Description</Label>
            <textarea id="product-description" rows={7} maxLength={4000} value={form.description} onChange={(e) => set('description', e.target.value)} className="admin-input resize-y" />
          </div>
          <div>
            <Label htmlFor="product-order" hint="lower shows first">Display order</Label>
            <input id="product-order" type="number" step={1} value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} className="admin-input" />
          </div>
          <label className="flex items-center gap-3 self-end pb-2 text-sm text-ivory">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => set('isPublished', e.target.checked)} className="h-4 w-4 accent-[#c8a45c]" />
            Visible on the website
          </label>
        </div>
      </div>
      {error && <div className="mt-6"><Notice tone="error">{error}</Notice></div>}
      <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-line pt-6">
        <button type="submit" disabled={busy} className={adminBtnPrimary}>{busy ? 'Saving…' : form.id ? 'Save changes' : 'Add product'}</button>
        {form.id && <button type="button" disabled={busy} onClick={onDelete} className={adminBtnDanger}>Delete product</button>}
      </div>
    </form>
  );
}

export default function Products() {
  const { token, handleError } = useAdmin();
  const [products, setProducts] = useState<AdminProduct[] | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState<Draft | null>(null);

  const load = useCallback(async () => {
    try {
      setProducts(await adminListProducts(token));
      setError('');
    } catch (err) {
      setError(handleError(err));
    }
  }, [token, handleError]);

  useEffect(() => { void load(); }, [load]);

  const categories = useMemo(() => Array.from(new Set((products ?? []).map((p) => p.category))).sort(), [products]);

  function open(draft: Draft) {
    setMessage('');
    setEditing(draft);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description="Everything marked visible appears in the collection on the website as soon as it is saved."
        actions={!editing && <button type="button" onClick={() => open(emptyDraft())} className={adminBtnPrimary}><Plus size={14} /> New product</button>}
      />
      {message && <div className="mb-6"><Notice tone="success">{message}</Notice></div>}
      {editing && (
        <div className="mb-10">
          <Editor
            key={editing.id ?? 'new'}
            draft={editing}
            categories={categories}
            onClose={() => setEditing(null)}
            onSaved={(msg) => { setEditing(null); setMessage(msg); void load(); }}
          />
        </div>
      )}
      {error && <Notice tone="error">{error}</Notice>}
      {!products && !error && <p className="text-sm text-stone">Loading…</p>}
      {products && products.length === 0 && !editing && (
        <Empty title="No products yet">Add your first piece and it will appear in the collection straight away.</Empty>
      )}
      {products && products.length > 0 && (
        <ul className="divide-y divide-line border-y border-line" aria-label="Products">
          {products.map((p) => (
            <li key={p.id} className="flex items-center gap-4 py-4" data-testid="admin-product-row">
              <div className="h-20 w-16 shrink-0 overflow-hidden bg-charcoal">
                {p.image_url && <img src={p.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-ivory">{p.name}</p>
                <p className="mt-1 text-xs text-stone">
                  {p.category} · {formatPrice(p.price, p.currency)}
                </p>
              </div>
              <span className={`hidden rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] sm:inline ${p.is_published ? 'bg-gold/15 text-gold-soft' : 'bg-line text-stone'}`}>
                {p.is_published ? 'Visible' : 'Hidden'}
              </span>
              {p.is_published && (
                <Link to={`/collection/${p.id}`} target="_blank" className="hidden p-2 text-stone hover:text-gold md:block" aria-label={`View ${p.name} on the website`}>
                  <ExternalLink size={16} />
                </Link>
              )}
              <button type="button" onClick={() => open(toDraft(p))} className={adminBtnGhost} aria-label={`Edit ${p.name}`}>
                <Pencil size={14} /> <span className="hidden sm:inline">Edit</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
