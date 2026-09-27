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
  return (
    <img
      src={product.image_url}
      alt={product.name}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className="h-full w-full object-cover"
    />
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
