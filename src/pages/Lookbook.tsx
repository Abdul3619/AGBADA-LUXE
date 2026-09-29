import { Link } from 'react-router-dom';
import IllustrativeBadge from '../components/IllustrativeBadge';
import { Reveal } from '../components/Reveal';
import { IMAGES, type ResponsiveImage } from '../lib/images';
import { useTitle } from '../lib/useTitle';

// Seasonal collections. The collection names and notes are illustrative examples for this demo, shown with a
// label on the page; replace them (and the photos) with the house's real seasons.
const SEASONS: { name: string; season: string; note: string; palette: string[]; image: ResponsiveImage; alt: string }[] = [
  {
    name: 'Harmattan',
    season: 'Dry season · November to February',
    note: 'Heavier aso-oke and brocade in deep indigo and burnt gold, cut for cool mornings and evening celebrations.',
    palette: ['#1f2a44', '#8a5a2b', '#c8a45c'],
    image: IMAGES.hero,
    alt: 'A man in a flowing embroidered agbada',
  },
  {
    name: 'Owambe',
    season: 'Celebration season · March to June',
    note: 'Ceremonial sets with hand-finished embroidery, made to be worn in coordinated family colours.',
    palette: ['#5b1a22', '#c8a45c', '#f3eee4'],
    image: IMAGES.ceremonial,
    alt: 'Ceremonial attire with detailed embroidery',
  },
  {
    name: 'Rainy Season Linens',
    season: 'Wet season · July to October',
    note: 'Breathable linen kaftans and softly structured suits in stone, sage and ivory for everyday elegance.',
    palette: ['#8a8174', '#7d8b6a', '#f3eee4'],
    image: IMAGES.bespoke,
    alt: 'A tailored suit in a light fabric',
  },
];

export default function Lookbook() {
  useTitle('Lookbook');
  return (
    <div className="container-luxe pt-40 md:pt-48">
      <Reveal>
        <p className="eyebrow">Lookbook</p>
        <h1 className="display mt-5 text-6xl text-ivory md:text-8xl">The seasons</h1>
        <p className="mt-6 max-w-2xl text-lg text-sand">Three collections, each shaped by the weather and the calendar of celebrations.</p>
        <p className="mt-6 text-gold-soft"><IllustrativeBadge label="Illustrative collections" /></p>
      </Reveal>

      <div className="mt-20 space-y-28 md:space-y-40">
        {SEASONS.map((s, i) => (
          <section key={s.name} aria-labelledby={`season-${i}`} className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
            <Reveal className={`md:col-span-6 ${i % 2 ? 'md:order-2 md:col-start-7' : ''}`}>
              <div className="img-zoom aspect-[3/4] overflow-hidden bg-charcoal">
                <img {...s.image} sizes="(min-width: 768px) 50vw, 100vw" alt={s.alt} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" className="h-full w-full object-cover" />
              </div>
            </Reveal>
            <Reveal delay={0.12} className={`md:col-span-5 ${i % 2 ? 'md:order-1' : 'md:col-start-8'}`}>
              <p className="eyebrow">{s.season}</p>
              <h2 id={`season-${i}`} className="display mt-5 text-5xl text-ivory md:text-6xl">{s.name}</h2>
              <p className="mt-6 text-lg text-sand">{s.note}</p>
              <div className="mt-8 flex gap-3" aria-label="Colour palette" role="img">
                {s.palette.map((c) => <span key={c} className="h-8 w-8 rounded-full border border-line" style={{ background: c }} />)}
              </div>
              <Link to="/consultation" className="btn btn-outline mt-10">Commission from this season</Link>
            </Reveal>
          </section>
        ))}
      </div>
    </div>
  );
}
