import React from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { brandCopy } from "../data";
import { Sparkles, ChevronDown, Compass, Scissors, Sparkle, ArrowRight } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const featuredCollections = [
    {
      name: "Agbada Luxe",
      tagline: "The Signature Royal Silhouettes",
      desc: "Our signature collection capturing Yoruba royal volume, hand-woven on historic horizontal looms in Iseyin and basted with gold threadwork.",
      image: "https://picsum.photos/seed/agbada/800/600",
      link: "/collections/Agbada Luxe"
    },
    {
      name: "SS24",
      tagline: "Savile Row Modern Fusion",
      desc: "A breathtaking cross-cultural study. Elongated tuxedo silhouettes, relaxed unstructured mohair sleeves, and organic indigo dyed coats.",
      image: "https://picsum.photos/seed/suit/800/600",
      link: "/collections/SS24"
    },
    {
      name: "Heritage Noir",
      tagline: "Monochromatic Obsidian Craft",
      desc: "Delving into high-contrast obsidian textiles. Royal Gele ensembles, heavy damask brocades, and avant-garde structural shapes.",
      image: "https://picsum.photos/seed/trad/800/600",
      link: "/collections/Heritage Noir"
    }
  ];

  return (
    <div className="pt-20">
      {/* Immersive Editorial Hero Segment */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 text-center overflow-hidden border-b border-warm-gold/15">
        {/* Subtle grid watermark */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(212,175,55,0.08)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

        {/* Hero Copy Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 max-w-4xl mx-auto space-y-6 pt-12"
        >
          {/* Atelier Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-charcoal/80 border border-warm-gold/35 text-[10px] uppercase tracking-[0.35em] text-warm-gold font-syne rounded-full">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>Atelier Haute Couture</span>
          </div>

          {/* Majestic Title */}
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tight text-cream">
            AGBADA <span className="font-light italic text-warm-gold">LUXE</span>
          </h1>

          <div className="h-[1.5px] w-24 bg-warm-gold mx-auto my-4" />

          {/* Subtitle / Core Ethos */}
          <p className="font-syne text-xs sm:text-sm uppercase tracking-[0.4em] text-bronze max-w-xl mx-auto leading-relaxed">
            Architectural Precision Meets West African Heritage
          </p>

          {/* Editorial copy blocks */}
          <p className="font-sans text-sm sm:text-base text-cream/80 max-w-2xl mx-auto leading-relaxed tracking-wide pt-4">
            {brandCopy.editorialIntro.text}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8">
            <Link
              id="hero-lookbook-cta"
              to="/the-lookout"
              className="w-full sm:w-auto px-8 py-3 bg-warm-gold hover:bg-cream text-obsidian font-syne text-xs uppercase tracking-widest font-bold transition-all duration-300 rounded-sm text-center"
            >
              Explore Lookbook
            </Link>
            <Link
              id="hero-atelier-cta"
              to="/about"
              className="w-full sm:w-auto px-8 py-3 bg-transparent border border-cream/25 hover:border-warm-gold hover:text-warm-gold font-syne text-xs uppercase tracking-widest transition-all duration-300 rounded-sm text-center"
            >
              The Atelier Philosophy
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center space-y-2 opacity-60 hover:opacity-100 transition-opacity">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream/50">Scroll to Explore</span>
          <ChevronDown className="w-4 h-4 text-warm-gold animate-bounce" />
        </div>
      </section>

      {/* Featured Collections Teaser Section */}
      <section className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 border-b border-warm-gold/10">
        <div className="text-center mb-16 space-y-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-warm-gold">Our House Portfolios</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium text-cream">
            The Haute <span className="font-light italic text-warm-gold">Collections</span>
          </h2>
          <div className="h-[1px] w-12 bg-warm-gold/30 mx-auto pt-1" />
          <p className="font-sans text-sm text-cream/70 max-w-xl mx-auto">
            Browse our three pillars of modern West African geometry, each crafted to command space and hold architectural gravity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredCollections.map((col, idx) => (
            <motion.div
              key={col.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group bg-charcoal/30 border border-warm-gold/15 rounded-sm overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 overflow-hidden bg-charcoal border-b border-warm-gold/10">
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60 z-10" />
                  <img
                    src={col.image}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-warm-gold bg-obsidian/80 px-2 py-1 rounded-sm border border-warm-gold/20">
                      Portfolio {idx + 1}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="font-serif text-xl font-bold text-cream group-hover:text-warm-gold transition-colors">
                    {col.name}
                  </h3>
                  <p className="font-syne text-[10px] uppercase tracking-wider text-bronze font-medium">
                    {col.tagline}
                  </p>
                  <p className="font-sans text-xs text-cream/70 leading-relaxed pt-2">
                    {col.desc}
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link
                  id={`home-collection-btn-${col.name.replace(/\s+/g, "-")}`}
                  to={col.link}
                  className="inline-flex items-center space-x-2 text-xs font-mono text-warm-gold uppercase tracking-wider hover:text-cream transition-colors group-hover:translate-x-1 duration-300"
                >
                  <span>Explore Silhouette Range</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Philosophy Teaser / Interactive CTA Section */}
      <section className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-charcoal/50 border border-warm-gold/20">
              <Scissors className="w-6 h-6 text-warm-gold animate-pulse" />
            </div>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-cream leading-snug">
            Every garment begins with a <span className="font-medium italic text-warm-gold">Basted Skeleton</span>.
          </h2>
          <p className="font-sans text-sm text-cream/80 max-w-2xl mx-auto leading-relaxed">
            Experience our dynamic fitting customizer where raw linen, Yorkshire wools, and Nigerian Aso-Oke are sculpted on structural coordinates. Discover how your physical posture commands architectural balance.
          </p>
          <div className="flex justify-center pt-4">
            <Link
              id="home-philosophy-btn"
              to="/about"
              className="px-6 py-3 bg-charcoal/50 hover:bg-warm-gold hover:text-obsidian border border-warm-gold/30 hover:border-warm-gold text-warm-gold font-syne text-xs uppercase tracking-widest transition-all duration-300 rounded-sm"
            >
              Launch Virtual Customizer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
