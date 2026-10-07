import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Instagram, Menu, X } from 'lucide-react';
import { errorMessage, subscribe } from '../lib/api';
import { safeExternalUrl, whatsappLink } from '../lib/format';
import { useSettings } from '../lib/settings';

const NAV = [
  { to: '/collection', label: 'Collection' },
  { to: '/lookbook', label: 'Lookbook' },
  { to: '/consultation', label: 'Consultation' },
  { to: '/about', label: 'The House' },
  { to: '/contact', label: 'Contact' },
];

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-700 ${
        scrolled || open ? 'border-b border-line/70 bg-ink/90 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <div className="container-luxe flex h-20 items-center justify-between">
        <Link to="/" className="font-serif text-2xl tracking-[0.18em] text-ivory md:text-[1.7rem]" aria-label="Atelier Noir, home">
          ATELIER <span className="italic tracking-[0.08em] text-gold">Noir</span>
        </Link>
        <nav className="hidden items-center gap-10 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className="link-underline pb-1 text-[0.6875rem] uppercase tracking-[0.28em] text-sand hover:text-ivory aria-[current=page]:text-ivory">
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          className="-mr-2 p-2 text-ivory md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} strokeWidth={1.25} /> : <Menu size={22} strokeWidth={1.25} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="h-[calc(100dvh-5rem)] bg-ink md:hidden"
          >
            <ul className="container-luxe flex flex-col gap-8 pt-12">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className="font-serif text-4xl text-ivory aria-[current=page]:text-gold">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    // Optimistic: thank the visitor at once; if the request fails, restore the address and show why.
    const submitted = email.trim();
    setState('done');
    setEmail('');
    try {
      await subscribe(submitted);
    } catch (err) {
      setEmail(submitted);
      setError(errorMessage(err));
      setState('idle');
    }
  }

  if (state === 'done') {
    return <p className="font-serif text-xl italic text-gold-soft" role="status">Thank you — you are on the list.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md" aria-label="Newsletter sign-up">
      <label htmlFor="newsletter-email" className="field-label">Email address</label>
      <div className="flex items-end gap-4">
        <input
          id="newsletter-email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="field"
        />
        <button type="submit" disabled={state === 'sending'} className="btn btn-outline shrink-0 !px-5">
          {state === 'sending' ? 'Joining…' : 'Join'}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-danger" role="alert">{error}</p>}
    </form>
  );
}

function Footer() {
  const { settings } = useSettings();
  const instagram = safeExternalUrl(settings.instagram_url);
  const whatsapp = settings.whatsapp ? whatsappLink(settings.whatsapp) : null;

  return (
    <footer className="mt-32 border-t border-line bg-charcoal">
      <div className="container-luxe grid gap-16 py-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow">Correspondence</p>
          <h2 className="display mt-5 text-4xl text-ivory md:text-5xl">New pieces, first.</h2>
          <p className="mt-4 max-w-sm text-sand">Occasional letters when new work is added to the collection. No noise.</p>
          <div className="mt-8"><Newsletter /></div>
        </div>
        <div className="grid grid-cols-2 gap-10 md:col-span-6 md:col-start-7">
          <div>
            <p className="eyebrow !text-stone">Explore</p>
            <ul className="mt-5 space-y-3 text-sand">
              {[...NAV, { to: '/size-guide', label: 'Size guide' }].map((item) => (
                <li key={item.to}><Link to={item.to} className="link-underline hover:text-ivory">{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow !text-stone">Contact</p>
            <ul className="mt-5 space-y-3 break-words text-sand">
              {settings.contact_email && (
                <li><a href={`mailto:${settings.contact_email}`} className="link-underline hover:text-ivory">{settings.contact_email}</a></li>
              )}
              {settings.contact_phone && (
                <li><a href={`tel:${settings.contact_phone.replace(/[^\d+]/g, '')}`} className="link-underline hover:text-ivory">{settings.contact_phone}</a></li>
              )}
              {whatsapp && <li><a href={whatsapp} target="_blank" rel="noreferrer" className="link-underline hover:text-ivory">WhatsApp</a></li>}
              {instagram && (
                <li>
                  <a href={instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-ivory">
                    <Instagram size={15} strokeWidth={1.25} /> Instagram
                  </a>
                </li>
              )}
              <li><Link to="/contact" className="link-underline hover:text-ivory">Send a message</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container-luxe flex flex-col gap-3 border-t border-line py-8 text-xs tracking-wide text-stone sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Atelier Noir. All rights reserved.</p>
        {settings.address && <p>{settings.address}</p>}
        <p>
          Built by Abdulwahab Abdullahi ·{' '}
          <a href="mailto:abdulwahababdullahi3619@gmail.com" className="link-underline text-sand hover:text-gold">
            Contact the developer
          </a>
        </p>
      </div>
    </footer>
  );
}

export function Layout() {
  const location = useLocation();
  useEffect(() => window.scrollTo(0, 0), [location.pathname]);
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ivory focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
