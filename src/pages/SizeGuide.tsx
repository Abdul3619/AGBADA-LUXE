import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { useTitle } from '../lib/useTitle';

// How to measure, plus an indicative size chart for ready-to-wear. Bespoke pieces are always cut to the
// customer's own measurements, confirmed at the fitting.
const HOW_TO = [
  ['Neck', 'Around the base of the neck, where a shirt collar sits. Keep one finger between the tape and the neck.'],
  ['Chest', 'Around the fullest part of the chest, under the arms, with the tape level across the back.'],
  ['Waist', 'Around the natural waistline, just above the navel. Breathe normally and do not hold in.'],
  ['Hips', 'Around the fullest part of the hips and seat, feet together.'],
  ['Shoulder width', 'Across the back, from the edge of one shoulder bone to the other.'],
  ['Sleeve length', 'From the shoulder edge, over a slightly bent elbow, to the wrist bone.'],
  ['Inside leg', 'From the crotch seam down the inside of the leg to where you want the trouser to finish.'],
  ['Height', 'Standing straight against a wall, without shoes.'],
];

// Chest / waist / hips in cm
const SIZES: [string, string, string, string][] = [
  ['S', '88–94', '74–80', '90–96'],
  ['M', '96–102', '82–88', '98–104'],
  ['L', '104–110', '90–96', '106–112'],
  ['XL', '112–118', '98–106', '114–120'],
  ['XXL', '120–128', '108–116', '122–130'],
];

export default function SizeGuide() {
  useTitle('Size guide');
  return (
    <div className="container-luxe pt-40 md:pt-48">
      <Reveal>
        <p className="eyebrow">Fit</p>
        <h1 className="display mt-5 text-6xl text-ivory md:text-7xl">Size guide</h1>
        <p className="mt-6 max-w-2xl text-lg text-sand">
          Every bespoke garment is cut to your own measurements, taken or confirmed at your fitting. If you would like to prepare,
          or you are ordering from abroad, these notes explain how to measure.
        </p>
      </Reveal>

      <section aria-labelledby="how-heading" className="mt-20 grid gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <h2 id="how-heading" className="display text-4xl text-ivory">How to measure</h2>
          <p className="mt-4 text-sand">Use a soft tape measure, wear light clothing, and ask someone to help. Keep the tape snug but not tight.</p>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6">
          <dl className="divide-y divide-line border-y border-line">
            {HOW_TO.map(([term, desc]) => (
              <div key={term} className="grid gap-2 py-5 sm:grid-cols-3 sm:gap-8">
                <dt className="font-serif text-xl text-ivory">{term}</dt>
                <dd className="text-sand sm:col-span-2">{desc}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section aria-labelledby="chart-heading" className="mt-24">
        <Reveal>
          <h2 id="chart-heading" className="display text-4xl text-ivory">Ready-to-wear sizes</h2>
          <p className="mt-4 max-w-2xl text-sand">An indicative guide in centimetres. Agbada are cut generously; if you are between sizes, choose the smaller.</p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[520px] border border-line text-left">
              <caption className="sr-only">Body measurements in centimetres for each size</caption>
              <thead className="bg-charcoal">
                <tr>
                  {['Size', 'Chest', 'Waist', 'Hips'].map((h) => (
                    <th key={h} scope="col" className="px-5 py-4 text-[0.6875rem] font-normal uppercase tracking-[0.28em] text-sand">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZES.map(([size, ...cells]) => (
                  <tr key={size} className="border-t border-line">
                    <th scope="row" className="px-5 py-4 font-serif text-xl font-normal text-ivory">{size}</th>
                    {cells.map((c, i) => <td key={i} className="px-5 py-4 text-sand">{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      <Reveal className="mt-24 border border-line p-10 text-center md:p-14">
        <p className="display text-3xl text-ivory md:text-4xl">Rather be measured by us?</p>
        <p className="mx-auto mt-4 max-w-md text-sand">Book a consultation and we will take your measurements in person.</p>
        <Link to="/consultation" className="btn btn-solid mt-8">Book a consultation</Link>
      </Reveal>
    </div>
  );
}
