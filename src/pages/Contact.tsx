import React from "react";
import { useSearchParams } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import { Landmark, Mail, Phone, MapPin, Instagram, Sparkles, Clock } from "lucide-react";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const preselectedGarment = searchParams.get("garment") || "";

  return (
    <div className="pt-24 min-h-screen">
      {/* Editorial Contact Header */}
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 border-b border-warm-gold/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Coordinates & Studios */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-warm-gold block">Inquiry Chambers</span>
              <h1 className="font-serif text-4xl sm:text-5xl font-medium text-cream">
                The House <span className="font-light italic text-warm-gold">Studios</span>
              </h1>
              <p className="font-sans text-xs sm:text-sm text-cream/70 leading-relaxed">
                Connect directly with our master tailors for canvas-basted fittings, private material commissions, or wedding couture consultations.
              </p>
            </div>

            <div className="space-y-6">
              {/* Studio London */}
              <div className="p-5 bg-charcoal/30 border border-warm-gold/15 rounded-sm space-y-3">
                <div className="flex items-center space-x-2 text-xs font-mono uppercase text-warm-gold tracking-wider">
                  <Landmark className="w-4 h-4" />
                  <span>London Studio (Savile Row)</span>
                </div>
                <p className="text-xs text-cream/80 font-sans leading-relaxed">
                  18 Savile Row, Mayfair, London, W1S 3PW<br />
                  <span className="text-cream/50">By Appointment Only &bull; +44 20 7946 0192</span>
                </p>
              </div>

              {/* Studio Lagos */}
              <div className="p-5 bg-charcoal/30 border border-warm-gold/15 rounded-sm space-y-3">
                <div className="flex items-center space-x-2 text-xs font-mono uppercase text-warm-gold tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>Lagos Studio (V.I.)</span>
                </div>
                <p className="text-xs text-cream/80 font-sans leading-relaxed">
                  42 Victoria Island Boulevard, Lagos, Nigeria<br />
                  <span className="text-cream/50">By Appointment Only &bull; +234 809 555 1234</span>
                </p>
              </div>
            </div>

            {/* General Enquiries Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono uppercase tracking-wider text-bronze">
              <a href="mailto:atelier@agbadaluxe.com" className="p-4 bg-charcoal/10 border border-cream/5 rounded-sm hover:border-warm-gold/20 transition-all block space-y-1">
                <span className="text-cream/40 block text-[9px]">Private Email</span>
                <span className="text-warm-gold text-[11px] font-semibold break-all">atelier@agbadaluxe.com</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-4 bg-charcoal/10 border border-cream/5 rounded-sm hover:border-warm-gold/20 transition-all block space-y-1">
                <span className="text-cream/40 block text-[9px]">Instagram Dispatch</span>
                <span className="text-warm-gold text-[11px] font-semibold">@agbadaluxe</span>
              </a>
            </div>
          </div>

          {/* Booking Form Interface */}
          <div className="lg:col-span-7">
            {preselectedGarment && (
              <div className="mb-6 p-4 bg-warm-gold/10 border border-warm-gold/30 rounded-sm text-xs font-mono text-warm-gold flex items-center justify-between">
                <span>
                  ✓ Preselected: <strong>{preselectedGarment}</strong>
                </span>
                <span className="text-[10px] bg-warm-gold text-obsidian px-2 py-0.5 uppercase font-bold rounded-sm animate-pulse">
                  Basted Fitting Match
                </span>
              </div>
            )}
            
            <BookingForm preselectedGarmentName={preselectedGarment} />
          </div>

        </div>
      </section>
    </div>
  );
}
