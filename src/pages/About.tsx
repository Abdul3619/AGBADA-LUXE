import React from "react";
import { motion } from "motion/react";
import AtelierCustomizer from "../components/AtelierCustomizer";
import { brandCopy } from "../data";
import { Landmark, Scissors, ShieldCheck, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="pt-24 min-h-screen">
      {/* Immersive Brand Story Header */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 border-b border-warm-gold/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-charcoal/50 border border-warm-gold/20 text-[9px] uppercase tracking-[0.3em] text-warm-gold font-mono rounded-full">
              <Landmark className="w-3 h-3" />
              <span>Savile Row &bull; Lagos Coordinates</span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-6xl font-medium text-cream leading-tight">
              Biometric <span className="font-light italic text-warm-gold">Architecture</span>
            </h1>

            <div className="h-[1px] w-20 bg-warm-gold" />

            <p className="font-sans text-sm sm:text-base text-cream/90 leading-relaxed tracking-wide pt-2">
              {brandCopy.philosophy.text}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 font-mono text-[10px] tracking-wider uppercase text-bronze">
              <div className="p-4 bg-charcoal/20 border border-warm-gold/10 rounded-sm">
                <span className="text-warm-gold block text-xs font-semibold mb-1">100% Authentic Looms</span>
                We partner directly with the Nigerian Vertical Looms Guild in Oyo, maintaining absolute traceabilities.
              </div>
              <div className="p-4 bg-charcoal/20 border border-warm-gold/10 rounded-sm">
                <span className="text-warm-gold block text-xs font-semibold mb-1">Savile Row Heritage</span>
                Our basted canvas fittings are mapped to Savile Row tolerances, refining sleeve slopes within half-millimeters.
              </div>
            </div>
          </div>

          {/* Decorative Collage Card */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-warm-gold/10 via-transparent to-transparent blur-3xl rounded-full" />
            <div className="relative border border-warm-gold/20 p-8 bg-charcoal/30 backdrop-blur-md rounded-sm space-y-6">
              <h3 className="font-serif text-lg font-bold text-warm-gold">Our Tailoring Code</h3>
              
              <ul className="space-y-4 text-xs font-sans text-cream/70">
                <li className="flex items-start gap-3">
                  <Scissors className="w-4 h-4 text-warm-gold shrink-0 mt-0.5" />
                  <span><strong>Zero Ready-Made:</strong> Every panel is drafted from fresh white paper patterns, calculated individually for your gait.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-warm-gold shrink-0 mt-0.5" />
                  <span><strong>Certified Looming:</strong> Genuine indigo dye baths and organic Nigerian mulberry silk threads.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-4 h-4 text-warm-gold shrink-0 mt-0.5" />
                  <span><strong>Ethical Guilds:</strong> Subsidizing raw material caches directly to Yorubaland horizontal weaving artisans.</span>
                </li>
              </ul>

              <div className="border-t border-cream/5 pt-4 text-[9px] font-mono text-cream/40 flex justify-between">
                <span>Coordinates: 6.5244° N, 3.3792° E</span>
                <span>House of Agbada Luxe</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Customizer Module */}
      <section className="bg-charcoal/5 border-t border-warm-gold/5">
        <AtelierCustomizer />
      </section>
    </div>
  );
}
