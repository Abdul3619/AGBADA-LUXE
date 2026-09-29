import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../lib/api';
import { formatPrice } from '../lib/format';

export function ProductImage({ product, eager = false }: { product: Pick<Product, 'image_url' | 'name'>; eager?: boolean }) {
  if (!product.image_url) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-graphite">
        <span className="font-serif text-2xl italic text-stone">Agbada Luxe</span>
      </div>
    );
  }
  return <LoadingImage src={product.image_url} alt={product.name} eager={eager} />;
}

// Shows the shimmer skeleton until the photo has loaded.
function LoadingImage({ src, alt, eager }: { src: string; alt: string; eager: boolean }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`h-full w-full ${loaded ? '' : 'skeleton'}`}>
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        ref={(el) => { if (el?.complete && el.naturalWidth > 0 && !loaded) setLoaded(true); }}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}

export function ProductCard({ product, eager }: { product: Product; eager?: boolean }) {
  return (
    <Link to={`/collection/${product.id}`} className="group block" data-testid="product-card">
      <div className="img-zoom aspect-[4/5] overflow-hidden bg-charcoal">
        <ProductImage product={product} eager={eager} />
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="eyebrow !text-stone">{product.category}</p>
          <h3 className="mt-2 font-serif text-2xl leading-tight text-ivory transition-colors duration-500 group-hover:text-gold-soft">
            {product.name}
          </h3>
        </div>
        <p className="shrink-0 pt-6 text-sm tracking-wide text-sand">{formatPrice(product.price, product.currency)}</p>
      </div>
    </Link>
  );
}
