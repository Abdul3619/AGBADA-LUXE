import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductImage } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { ErrorNote } from '../components/States';
import { errorMessage, getProduct, type Product } from '../lib/api';
import { formatPrice, whatsappLink } from '../lib/format';
import { useSettings } from '../lib/settings';
import { useTitle } from '../lib/useTitle';
import NotFound from './NotFound';

export default function ProductPage() {
  const { id = '' } = useParams();
  const { settings } = useSettings();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [error, setError] = useState('');
  useTitle(product?.name);

  useEffect(() => {
    let active = true;
    setProduct(undefined);
    setError('');
    getProduct(id)
      .then((p) => active && setProduct(p))
      .catch((err) => active && setError(errorMessage(err)));
    return () => { active = false; };
  }, [id]);

  if (product === null) return <NotFound />;

  const whatsapp = product && settings.whatsapp
    ? whatsappLink(settings.whatsapp, `Hello, I am interested in "${product.name}" from the Atelier Noir collection.`)
    : null;

  return (
    <div className="container-luxe pt-32 md:pt-40">
      <Link to="/collection" className="inline-flex items-center gap-3 text-[0.6875rem] uppercase tracking-[0.28em] text-stone hover:text-gold">
        <ArrowLeft size={14} strokeWidth={1.25} /> The collection
      </Link>
      {error && <div className="mt-10"><ErrorNote message={error} /></div>}
      {product === undefined && !error && (
        <div className="mt-10 grid gap-12 md:grid-cols-12" aria-busy="true">
          <div className="aspect-[4/5] animate-pulse bg-charcoal md:col-span-7" />
          <div className="space-y-4 md:col-span-4 md:col-start-9"><div className="h-10 w-3/4 animate-pulse bg-charcoal" /></div>
        </div>
      )}
      {product && (
        <div className="mt-10 grid gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-7">
            <div className="aspect-[4/5] overflow-hidden bg-charcoal"><ProductImage product={product} eager /></div>
          </Reveal>
          <Reveal delay={0.15} className="md:col-span-5 md:sticky md:top-32 md:self-start">
            <p className="eyebrow">{product.category}</p>
            <h1 className="display mt-5 text-5xl text-ivory md:text-6xl">{product.name}</h1>
            <p className="mt-6 text-xl tracking-wide text-gold-soft">{formatPrice(product.price, product.currency)}</p>
            {product.description && (
              <div className="mt-10 space-y-4 border-t border-line pt-10 text-lg text-sand">
                {product.description.split(/\n{2,}/).map((para, i) => <p key={i} className="whitespace-pre-line">{para}</p>)}
              </div>
            )}
            <div className="mt-12 flex flex-col gap-4 sm:flex-row md:flex-col lg:flex-row">
              <Link to={`/contact?piece=${encodeURIComponent(product.name)}`} className="btn btn-solid">Enquire about this piece</Link>
              {whatsapp && <a href={whatsapp} target="_blank" rel="noreferrer" className="btn btn-outline">WhatsApp</a>}
            </div>
            <p className="mt-6 text-sm text-stone">
              Prefer it made to your measurements? <Link to="/consultation" className="link-underline text-sand hover:text-gold">Book a consultation</Link>.
            </p>
          </Reveal>
        </div>
      )}
    </div>
  );
}
