import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../lib/images';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { ErrorNote, GridSkeleton } from '../components/States';
import { safeExternalUrl } from '../lib/format';
import { useProducts } from '../lib/useProducts';
import { useSettings } from '../lib/settings';
import { useTitle } from '../lib/useTitle';

export default function Home() {
  useTitle();
  const { settings } = useSettings();
  const { products, error, loading } = useProducts();
  // A hero image set in the admin dashboard replaces the built-in photo.
  const customHero = safeExternalUrl(settings.hero_image_url);
  const hero = customHero ? { src: customHero, srcSet: undefined } : IMAGES.hero;
  const featured = products?.slice(0, 6) ?? [];

  return (
    <>
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <motion.img
          src={hero.src}
          srcSet={hero.srcSet}
          sizes="100vw"
          fetchPriority="high"
          alt=""
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/20" />
        <div className="container-luxe relative pb-20 pt-40 md:pb-28">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <p className="eyebrow">Agbada · Ceremonial · Bespoke</p>
            <h1 className="display mt-6 max-w-4xl text-[3.25rem] text-ivory sm:text-7xl lg:text-[6.5rem]">
              {settings.tagline || <>Dressed for the <em className="text-gold-soft">occasion</em> that matters.</>}
            </h1>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/collection" className="btn btn-solid">View the collection</Link>
              <Link to="/consultation" className="btn btn-outline">Book a consultation</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {settings.intro && (
        <section className="container-luxe py-28 md:py-40">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="font-serif text-3xl leading-snug text-ivory md:text-[2.6rem] md:leading-[1.25]">{settings.intro}</p>
          </Reveal>
        </section>
      )}

      <section className={`container-luxe ${settings.intro ? '' : 'pt-28 md:pt-40'}`}>
        <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">The collection</p>
            <h2 className="display mt-4 text-5xl text-ivory md:text-6xl">Current pieces</h2>
          </div>
          {featured.length > 0 && (
            <Link to="/collection" className="group inline-flex items-center gap-3 text-[0.6875rem] uppercase tracking-[0.28em] text-sand hover:text-gold">
              View all <ArrowRight size={14} strokeWidth={1.25} className="transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          )}
        </Reveal>
        {loading && <GridSkeleton />}
        {error && <ErrorNote message={error} />}
        {products && featured.length === 0 && (
          <div className="border border-line px-8 py-16 text-center">
            <p className="font-serif text-3xl text-ivory">The collection is being prepared.</p>
            <p className="mx-auto mt-4 max-w-md text-sand">New pieces will appear here soon. In the meantime, every garment can be made to order.</p>
            <Link to="/consultation" className="btn btn-outline mt-8">Commission a piece</Link>
          </div>
        )}
        {featured.length > 0 && (
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.12}><ProductCard product={p} eager={i < 3} /></Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="container-luxe mt-32 grid items-center gap-12 md:mt-44 md:grid-cols-12 md:gap-16">
        <Reveal className="md:col-span-6">
          <div className="img-zoom aspect-[3/4] overflow-hidden">
            <img {...IMAGES.bespoke} sizes="(min-width: 768px) 50vw, 100vw" alt="A tailored suit" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
        </Reveal>
        <Reveal delay={0.15} className="md:col-span-5 md:col-start-8">
          <p className="eyebrow">Made to measure</p>
          <h2 className="display mt-5 text-5xl text-ivory md:text-6xl">Cut for you, <em className="text-gold-soft">and only you.</em></h2>
          <p className="mt-6 text-lg text-sand">
            Every piece can be commissioned to your measurements. Begin with a private consultation to discuss the occasion,
            the cloth and the details.
          </p>
          <Link to="/consultation" className="btn btn-outline mt-10">Arrange a consultation</Link>
        </Reveal>
      </section>

      <section className="relative mt-32 overflow-hidden md:mt-44">
        <img {...IMAGES.ceremonial} sizes="100vw" alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[center_30%]" />
        <div className="absolute inset-0 bg-ink/70" />
        <Reveal className="container-luxe relative py-32 text-center md:py-48">
          <p className="eyebrow">Ceremonial wear</p>
          <h2 className="display mx-auto mt-6 max-w-3xl text-5xl text-ivory md:text-7xl">For weddings, naming days and every celebration in between.</h2>
          <Link to="/contact" className="btn btn-solid mt-12">Get in touch</Link>
        </Reveal>
      </section>
    </>
  );
}
