import { Link } from 'react-router-dom';
import { useTitle } from '../lib/useTitle';

export default function NotFound() {
  useTitle('Page not found');
  return (
    <div className="container-luxe flex min-h-[70vh] flex-col items-center justify-center pt-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display mt-5 text-6xl text-ivory md:text-7xl">This page could not be found.</h1>
      <Link to="/" className="btn btn-outline mt-10">Return home</Link>
    </div>
  );
}
