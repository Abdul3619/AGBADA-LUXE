import { Link } from 'react-router-dom';
import { IMAGES } from '../lib/images';
import { Reveal } from '../components/Reveal';
import { useSettings } from '../lib/settings';
import { useTitle } from '../lib/useTitle';

export default function About() {
  useTitle('The House');
  const { settings, loaded } = useSettings();
  const body = settings.about_body;

  return (
    <div className="container-luxe pt-40 md:pt-48">
      <div className="grid gap-16 md:grid-cols-12">
        <Reveal className="md:col-span-6">
          <p className="eyebrow">The house</p>
          <h1 className="display mt-5 text-6xl text-ivory md:text-8xl">{settings.about_title || 'Atelier Noir'}</h1>
          <div className="mt-10 space-y-6 text-lg text-sand">
            {body
              ? body.split(/\n{2,}/).map((para, i) => <p key={i} className="whitespace-pre-line">{para}</p>)
              : loaded && (
                  <p>
                    Atelier Noir makes ceremonial wear and bespoke tailoring drawn from traditions worldwide. Explore the
                    collection, or book a consultation to have a piece made for you.
                  </p>
                )}
          </div>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link to="/collection" className="btn btn-solid">The collection</Link>
            <Link to="/consultation" className="btn btn-outline">Book a consultation</Link>
          </div>
        </Reveal>
        <Reveal delay={0.15} className="md:col-span-5 md:col-start-8">
          <div className="aspect-[3/4] overflow-hidden">
            <img {...IMAGES.ceremonial} sizes="(min-width: 768px) 50vw, 100vw" decoding="async" alt="" loading="lazy" className="h-full w-full object-cover" />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
