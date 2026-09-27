import { useEffect, useState } from 'react';
import { errorMessage, listProducts, type Product } from './api';

export function useProducts() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    listProducts()
      .then((rows) => active && setProducts(rows))
      .catch((err) => active && setError(errorMessage(err)));
    return () => { active = false; };
  }, []);

  return { products, error, loading: products === null && !error };
}
