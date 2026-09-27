import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { ErrorNote, GridSkeleton } from '../components/States';
import { useProducts } from '../lib/useProducts';
import { useTitle } from '../lib/useTitle';

export default function Collection() {
  useTitle('Collection');
  const { products, error, loading } = useProducts();
  const [params, setParams] = useSearchParams();
  const active = params.get('category') ?? '';

  const categories = useMemo(
    () => Array.from(new Set((products ?? []).map((p) => p.category))).sort((a, b) => a.localeCompare(b)),
    [products],
  );
  const visible = (products ?? []).filter((p) => !active || p.category === active);

  return (
    <div className="container-luxe pt-40 md:pt-48">
      <Reveal>
        <p className="eyebrow">Agbada Luxe</p>
        <h1 className="display mt-5 text-6xl text-ivory md:text-8xl">The Collection</h1>
      </Reveal>

      {categories.length > 1 && (
        <nav aria-label="Filter by category" className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-b border-line pb-5">
          {['', ...categories].map((c) => (
            <button
              key={c || 'all'}
              type="button"
              onClick={() => setParams(c ? { category: c } : {}, { replace: true })}
              aria-pressed={active === c}
              className={`link-underline pb-1 text-[0.6875rem] uppercase tracking-[0.28em] transition-colors ${
                active === c ? 'text-ivory [background-size:100%_1px]' : 'text-stone hover:text-ivory'
              }`}
            >
              {c || 'All'}
            </button>
          ))}
        </nav>
      )}

      <div className="mt-16">
        {loading && <GridSkeleton count={6} />}
        {error && <ErrorNote message={error} />}
        {products && products.length === 0 && (
          <div className="border border-line px-8 py-20 text-center">
            <p className="font-serif text-3xl text-ivory">No pieces are on display yet.</p>
            <p className="mx-auto mt-4 max-w-md text-sand">The collection is being prepared. You are welcome to commission a garment in the meantime.</p>
            <Link to="/consultation" className="btn btn-outline mt-8">Book a consultation</Link>
          </div>
        )}
        {products && products.length > 0 && visible.length === 0 && (
          <p className="text-sand">Nothing in this category at the moment.</p>
        )}
        {visible.length > 0 && (
          <div className="grid gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.1}><ProductCard product={p} eager={i < 3} /></Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
