import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fabricSwatches } from "../data";
import { Sparkles, Check, Send, Award, Layers } from "lucide-react";

export default function SwatchSelector() {
  const [selectedSwatchId, setSelectedSwatchId] = useState<string>("indigo-aso-oke");
  
  // Swatch Request States
  const [orderedSwatches, setOrderedSwatches] = useState<string[]>([]);
  const [shippingEmail, setShippingEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const activeSwatch = fabricSwatches.find(s => s.id === selectedSwatchId) || fabricSwatches[0];

  const handleToggleRequest = (id: string) => {
    if (orderedSwatches.includes(id)) {
      setOrderedSwatches(orderedSwatches.filter(item => item !== id));
    } else {
      setOrderedSwatches([...orderedSwatches, id]);
    }
    setIsSubmitted(false); // reset success on change
  };

  const handleRequestSubmission = (e: FormEvent) => {
    e.preventDefault();
    if (orderedSwatches.length === 0) {
      setErrorMsg("Please select at least one physical swatch to request.");
      return;
    }
    if (!shippingEmail || !shippingEmail.includes("@")) {
      setErrorMsg("Please enter a valid shipping inquiry email.");
      return;
    }

    setErrorMsg("");
    setIsSubmitted(true);
  };

  return (
    <section id="swatches" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-warm-gold/10">
      
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 text-warm-gold text-xs font-syne uppercase tracking-[0.3em] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Textile Archive</span>
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-cream mb-4">
          Bespoke Swatch Library
        </h2>
        <p className="text-cream/80 font-sans text-sm leading-relaxed max-w-2xl mx-auto">
          We source raw fibers from traditional Yoruba vertical weavers and blend them with Savile Row textures to form custom fabrics with high structural posture. Select a swatch to inspect lineage, loom statistics, and weight indices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left column: Swatch grid & Interactive sampler form (7 columns) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          
          <div>
            <span className="text-[10px] font-syne uppercase tracking-[0.25em] text-bronze block mb-4">
              Select Raw Specimen &bull; Click to Inspect
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fabricSwatches.map((swatch) => {
                const isSelected = swatch.id === selectedSwatchId;
                const isAddedToSamplePack = orderedSwatches.includes(swatch.id);

                return (
                  <div
                    key={swatch.id}
                    onClick={() => setSelectedSwatchId(swatch.id)}
                    className={`p-5 rounded-sm border cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                      isSelected 
                        ? "border-warm-gold bg-charcoal/80 gold-border-glow" 
                        : "border-cream/10 bg-[#111111]/40 hover:border-cream/20 hover:bg-[#111111]/70"
                    }`}
                  >
                    {/* Color Swatch Circle Indicator & Selection Details */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full border border-cream/10 shadow-inner group-hover:scale-105 transition-transform duration-300 relative flex items-center justify-center"
                          style={{ backgroundColor: swatch.colorHex }}
                        >
                          {/* Simulated swatch textile pattern overlay */}
                          <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-repeat bg-center" 
                               style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "4px 4px" }} />
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-semibold text-cream">
                            {swatch.name}
                          </h4>
                          <span className="text-[9px] font-mono text-bronze uppercase tracking-widest block">
                            {swatch.origin}
                          </span>
                        </div>
                      </div>

                      {/* Add to order package toggle */}
                      <button
                        id={`add-swatch-pack-${swatch.id}`}
                        onClick={(e) => {
                          e.stopPropagation(); // prevent inspecting select
                          handleToggleRequest(swatch.id);
                        }}
                        className={`p-1.5 rounded-full border transition-all ${
                          isAddedToSamplePack 
                            ? "bg-warm-gold border-warm-gold text-obsidian" 
                            : "border-cream/20 text-cream/40 hover:border-warm-gold/50 hover:text-warm-gold"
                        }`}
                        title={isAddedToSamplePack ? "Remove from physical request package" : "Add to physical request package"}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-cream/65 line-clamp-2">
                      {swatch.description}
                    </p>

                    {/* Bottom row metrics */}
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-cream/5 text-[10px] font-mono text-cream/40">
                      <span>{swatch.weight}</span>
                      <span>Loom: {swatch.weaveTimeDays} Days</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Complimentary Swatch inquiry client card */}
          <div className="bg-[#111111]/80 border border-warm-gold/15 p-6 rounded-sm mt-4">
            <h4 className="font-serif text-lg font-medium text-cream mb-2 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-warm-gold" />
              <span>Request Swatch Sample Folder</span>
            </h4>
            <p className="text-xs text-cream/70 mb-4 leading-relaxed">
              We provide raw material samples mounted on premium studio cardstock to assist your creative planning. Select any fabric swatches above to curate your bespoke lookbook folder.
            </p>

            <form onSubmit={handleRequestSubmission} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="swatch-email-input"
                  type="email"
                  placeholder="Enter your design office or physical residence email..."
                  value={shippingEmail}
                  onChange={(e) => setShippingEmail(e.target.value)}
                  className="flex-1 bg-obsidian border border-cream/10 text-cream text-xs rounded-sm p-3 focus:border-warm-gold focus:outline-none placeholder-cream/30"
                />
                <button
                  id="submit-swatch-request"
                  type="submit"
                  className="py-3 px-6 bg-charcoal border border-warm-gold/30 hover:border-warm-gold hover:text-warm-gold text-cream font-syne uppercase tracking-widest text-xs font-bold transition-all duration-300 flex items-center justify-center space-x-2 shrink-0 rounded-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Folder</span>
                </button>
              </div>

              {errorMsg && (
                <p className="text-xs text-red-400 font-mono">
                  &bull; {errorMsg}
                </p>
              )}

              {isSubmitted && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-warm-gold/10 border border-warm-gold/20 text-warm-gold text-xs font-mono rounded-sm"
                >
                  ✓ Swatch sample packet requested! Our studio messenger will contact <strong>{shippingEmail}</strong> shortly to confirm your physical mailing coordinates. Selected swatches: {[...orderedSwatches].map(id => fabricSwatches.find(sw => sw.id === id)?.name).join(", ")}.
                </motion.div>
              )}
            </form>
          </div>

        </div>

        {/* Right column: Active Inspect Panel (5 columns) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#111111] to-obsidian border border-warm-gold/15 p-6 sm:p-8 rounded-sm flex flex-col justify-between">
          
          <div className="space-y-6">
            <span className="text-[10px] font-syne uppercase tracking-[0.2em] text-bronze block">
              Active Specimen Detail Pane
            </span>

            {/* Simulated high-magnified fabric swatch texture render */}
            <div className="relative h-48 w-full bg-obsidian border border-cream/5 rounded-sm overflow-hidden flex items-center justify-center">
              {/* Geometric rendering patterns to emulate heavy fabric weave */}
              <div 
                className="absolute inset-0 opacity-20 mix-blend-screen transition-all duration-700"
                style={{ 
                  backgroundColor: activeSwatch.colorHex,
                  backgroundImage: activeSwatch.texturePattern === "woven" 
                    ? "repeating-linear-gradient(45deg, #000, #000 2px, #fff 2px, #fff 4px)"
                    : activeSwatch.texturePattern === "raw"
                    ? "repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 8px), repeating-linear-gradient(90deg, #000, #000 1px, transparent 1px, transparent 8px)"
                    : activeSwatch.texturePattern === "geometric"
                    ? "linear-gradient(45deg, #222 25%, transparent 25%), linear-gradient(-45deg, #222 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #222 75%), linear-gradient(-45deg, transparent 75%, #222 75%)"
                    : "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
              
              <div className="z-10 text-center px-4">
                <span className="font-mono text-[10px] text-warm-gold tracking-widest uppercase block mb-1">
                  Magnified Structure Profile
                </span>
                <span className="font-serif text-xl font-bold text-cream">
                  {activeSwatch.name}
                </span>
              </div>
            </div>

            {/* Spec breakdown */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs border-b border-cream/5 pb-2">
                <span className="text-cream/50">Origin Region</span>
                <span className="text-cream font-serif font-medium">{activeSwatch.origin}</span>
              </div>

              <div className="flex justify-between items-center text-xs border-b border-cream/5 pb-2">
                <span className="text-cream/50">Yarn Weight</span>
                <span className="text-warm-gold font-mono">{activeSwatch.weight}</span>
              </div>

              <div className="flex justify-between items-center text-xs border-b border-cream/5 pb-2">
                <span className="text-cream/50">Loom Looming Time</span>
                <span className="text-cream font-mono">{activeSwatch.weaveTimeDays} Continuous Days</span>
              </div>

              <div className="flex justify-between items-center text-xs border-b border-cream/5 pb-2">
                <span className="text-cream/50">Drape Behavior index</span>
                <span className="text-cream font-serif font-medium">
                  {activeSwatch.id === "indigo-aso-oke" && "Highly Structural & Postural"}
                  {activeSwatch.id === "ivory-raw-silk" && "Luminous & Soft-Draped"}
                  {activeSwatch.id === "charcoal-merino-silk" && "Crisp, Rigid, Wrinkle-Resistant"}
                  {activeSwatch.id === "gilded-brocade" && "Heavy Jacquard Shell"}
                </span>
              </div>
            </div>

            <p className="text-xs text-cream/75 leading-relaxed font-sans pt-2">
              {activeSwatch.description}
            </p>
          </div>

          <div className="pt-6 border-t border-cream/5 flex items-center space-x-2.5 text-[10px] text-bronze uppercase tracking-widest">
            <Award className="w-4 h-4 text-warm-gold" />
            <span>Guaranteed Premium Hand-Spun Origin</span>
          </div>

        </div>

      </div>

    </section>
  );
}
