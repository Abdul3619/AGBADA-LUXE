import { useSearchParams } from 'react-router-dom';
import { BookingForm } from '../components/BookingForm';
import { Reveal } from '../components/Reveal';
import { safeExternalUrl, whatsappLink } from '../lib/format';
import { useSettings } from '../lib/settings';
import { useTitle } from '../lib/useTitle';

export default function Contact() {
  useTitle('Contact');
  const { settings } = useSettings();
  const [params] = useSearchParams();
  const piece = params.get('piece')?.slice(0, 120);
  const whatsapp = settings.whatsapp ? whatsappLink(settings.whatsapp) : null;
  const instagram = safeExternalUrl(settings.instagram_url);

  const details = [
    settings.contact_email && { label: 'Email', value: settings.contact_email, href: `mailto:${settings.contact_email}` },
    settings.contact_phone && { label: 'Telephone', value: settings.contact_phone, href: `tel:${settings.contact_phone.replace(/[^\d+]/g, '')}` },
    whatsapp && { label: 'WhatsApp', value: settings.whatsapp!, href: whatsapp },
    instagram && { label: 'Instagram', value: instagram.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''), href: instagram },
    settings.address && { label: 'Atelier', value: settings.address },
    settings.opening_hours && { label: 'Hours', value: settings.opening_hours },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <div className="container-luxe pt-40 md:pt-48">
      <div className="grid gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow">Contact</p>
          <h1 className="display mt-5 text-6xl text-ivory md:text-7xl">Write to us</h1>
          <p className="mt-6 text-lg text-sand">Questions about a piece, an order or an upcoming occasion — we read every message.</p>
          {details.length > 0 && (
            <dl className="mt-12 space-y-7 border-t border-line pt-10">
              {details.map((d) => (
                <div key={d.label}>
                  <dt className="eyebrow !text-stone">{d.label}</dt>
                  <dd className="mt-2 whitespace-pre-line break-words text-ivory">
                    {d.href ? <a href={d.href} target={d.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="link-underline hover:text-gold">{d.value}</a> : d.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </Reveal>
        <Reveal delay={0.15} className="lg:col-span-7 lg:col-start-6">
          <BookingForm kind="inquiry" initialMessage={piece ? `I would like to know more about "${piece}".` : ''} />
        </Reveal>
      </div>
    </div>
  );
}
