import React, { useMemo } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { lookbookItems } from "../data";
import SwatchSelector from "../components/SwatchSelector";
import { Sparkles, ArrowRight, Layers, Compass } from "lucide-react";

export default function Lookout() {
  // Aggregate lookbook items per collection
  const collectionsSummary = useMemo(() => {
    const counts: Record<string, { count: number; image: string; tag: string }> = {
      "Agbada Luxe": {
        count: 0,
        tag: "Traditional Royalty & Bold Drape",
        image: "https://picsum.photos/seed/agbada/800/600"
      },
      "SS24": {
        count: 0,
        tag: "Modern Cross-Cultural Fusion",
        image: "https://picsum.photos/seed/suit/800/600"
      },
      "Heritage Noir": {
        count: 0,
        tag: "Monochromatic Brocade & Gele",
        image: "https://picsum.photos/seed/trad/800/600"
      }
    };

    lookbookItems.forEach((item) => {
      if (counts[item.collection]) {
        counts[item.collection].count += 1;
        // Keep the item's image if it exists to make it authentic
        if (item.image) {
          counts[item.collection].image = item.image;
        }
      }
    });

    return Object.entries(counts).map(([name, data]) => ({
      name,
      ...data
    }));
  }, []);

  return (
    <div className="pt-24 min-h-screen">
      {/* Editorial Header */}
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 border-b border-warm-gold/10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-charcoal/50 border border-warm-gold/20 text-[9px] uppercase tracking-[0.3em] text-warm-gold font-mono rounded-full">
            <Compass className="w-3 h-3 animate-spin" style={{ animationDuration: "12s" }} />
            <span>Seasonal Portfolio Index</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-cream">
            The <span className="font-light italic text-warm-gold">Lookout</span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-cream/70 leading-relaxed max-w-2xl mx-auto">
            Our central gallery catalog. Below is an overview of active collections currently mapped within our digital database. Select a portfolio to filter the high-resolution master garments.
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collectionsSummary.map((col, idx) => (
            <motion.div
              key={col.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className="bg-charcoal/30 border border-warm-gold/15 rounded-sm overflow-hidden group flex flex-col justify-between"
            >
              <div>
                {/* Image Showcase with subtle scale-up */}
                <div className="relative h-72 overflow-hidden bg-charcoal border-b border-warm-gold/10">
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent opacity-80 z-10" />
                  <img
                    src={col.image}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Floating items badge */}
                  <div className="absolute top-4 right-4 z-20 bg-warm-gold text-obsidian px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider rounded-sm uppercase">
                    {col.count} Silhouettes
                  </div>

                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-warm-gold block">
                      House Portfolio
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-cream mt-1">
                      {col.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <p className="font-syne text-[10px] uppercase tracking-wider text-bronze font-semibold">
                    {col.tag}
                  </p>
                  <p className="font-sans text-xs text-cream/70 leading-relaxed pt-2">
                    Discover handcrafting metrics, organic textile materials, and custom bespoke coordinates compiled for {col.name}.
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  id={`lookout-btn-${col.name.replace(/\s+/g, "-")}`}
                  to={`/collections/${col.name}`}
                  className="w-full py-3 bg-charcoal/80 hover:bg-warm-gold hover:text-obsidian border border-warm-gold/25 hover:border-warm-gold text-warm-gold font-syne text-xs uppercase tracking-widest font-medium transition-all duration-300 rounded-sm flex items-center justify-center space-x-2"
                >
                  <span>Enter Portfolio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Textile Swatch Archive Integration */}
      <section id="swatches" className="border-t border-warm-gold/15 bg-charcoal/10">
        <SwatchSelector />
      </section>
    </div>
  );
}
