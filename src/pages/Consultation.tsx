import { IMAGES } from '../lib/images';
import { BookingForm } from '../components/BookingForm';
import { Reveal } from '../components/Reveal';
import { useSettings } from '../lib/settings';
import { useTitle } from '../lib/useTitle';

export default function Consultation() {
  useTitle('Book a consultation');
  const { settings } = useSettings();
  return (
    <div className="container-luxe pt-40 md:pt-48">
      <div className="grid gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow">Private appointment</p>
          <h1 className="display mt-5 text-6xl text-ivory md:text-7xl">Book a consultation</h1>
          <p className="mt-6 text-lg text-sand">
            Tell us a little about what you have in mind. We will contact you to confirm a time, and to talk through the occasion,
            fabrics and measurements.
          </p>
          {settings.opening_hours && (
            <div className="mt-10 border-t border-line pt-8">
              <p className="eyebrow !text-stone">Opening hours</p>
              <p className="mt-3 whitespace-pre-line text-sand">{settings.opening_hours}</p>
            </div>
          )}
          <div className="mt-12 hidden aspect-[3/4] overflow-hidden lg:block">
            <img {...IMAGES.bespoke} sizes="33vw" alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
        </Reveal>
        <Reveal delay={0.15} className="lg:col-span-7 lg:col-start-6">
          <BookingForm kind="consultation" />
        </Reveal>
      </div>
    </div>
  );
}
