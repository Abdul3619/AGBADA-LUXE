import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fittingSteps, fabricSwatches } from "../data";
import { Scissors, Ruler, Eye, HelpCircle, ChevronRight, RefreshCw, Layers } from "lucide-react";

export default function AtelierCustomizer() {
  const [activeStep, setActiveStep] = useState<number>(0);
  
  // Customizer States
  const [silhouette, setSilhouette] = useState<string>("agbada"); // 'agbada' | 'tuxedo' | 'hybrid'
  const [selectedFabricId, setSelectedFabricId] = useState<string>("indigo-aso-oke");
  const [embroideryLevel, setEmbroideryLevel] = useState<string>("sovereign"); // 'minimal' | 'subdued' | 'sovereign' | 'majestic'
  const [collarStyle, setCollarStyle] = useState<string>("mandarin"); // 'mandarin' | 'shawl' | 'traditional'
  const [fitType, setFitType] = useState<string>("sculpted"); // 'loose' | 'sculpted' | 'architectural'

  // Computed Metrics States
  const [handcraftHours, setHandcraftHours] = useState<number>(180);
  const [weaversInvolved, setWeaversInvolved] = useState<number>(3);
  const [drapeRigidity, setDrapeRigidity] = useState<number>(80); // percentage
  const [fittingStages, setFittingStages] = useState<number>(3);
  const [estWeightKg, setEstWeightKg] = useState<number>(2.4);

  // recalculate specs live based on parameters
  useEffect(() => {
    let baseHours = 0;
    let fabricMultiplier = 1;
    let weight = 1.2;
    let weavers = 2;
    let rigidity = 50;
    let stages = 2;

    // Silhouette Base Specs
    if (silhouette === "agbada") {
      baseHours = 80;
      weight = 1.8;
      rigidity = 70;
      stages = 3;
    } else if (silhouette === "tuxedo") {
      baseHours = 60;
      weight = 1.1;
      rigidity = 40;
      stages = 2;
    } else { // hybrid
      baseHours = 100;
      weight = 2.0;
      rigidity = 60;
      stages = 3;
    }

    // Fabric Modifier
    const selectedFabric = fabricSwatches.find(f => f.id === selectedFabricId);
    if (selectedFabric) {
      if (selectedFabric.id === "indigo-aso-oke") {
        fabricMultiplier = 1.4;
        weight += 0.6;
        rigidity += 20;
        weavers += 1;
      } else if (selectedFabric.id === "ivory-raw-silk") {
        fabricMultiplier = 1.1;
        weight += 0.2;
        rigidity -= 10;
      } else if (selectedFabric.id === "charcoal-merino-silk") {
        fabricMultiplier = 1.2;
        weight += 0.3;
        rigidity += 5;
      } else if (selectedFabric.id === "gilded-brocade") {
        fabricMultiplier = 1.3;
        weight += 0.5;
        rigidity += 10;
        weavers += 1;
      }
    }

    // Embroidery Level Modifier
    let embHours = 0;
    if (embroideryLevel === "minimal") {
      embHours = 15;
      weight += 0.1;
    } else if (embroideryLevel === "subdued") {
      embHours = 35;
      weight += 0.3;
      stages += 0;
    } else if (embroideryLevel === "sovereign") {
      embHours = 75;
      weight += 0.7;
      stages = Math.max(stages, 3);
      weavers += 1;
    } else if (embroideryLevel === "majestic") {
      embHours = 130;
      weight += 1.2;
      stages = 3;
      weavers += 2;
    }

    // Fit Type modifier
    if (fitType === "architectural") {
      rigidity += 10;
      stages = Math.max(stages, 3);
    } else if (fitType === "sculpted") {
      baseHours += 15;
    }

    setHandcraftHours(Math.round((baseHours + embHours) * fabricMultiplier));
    setWeaversInvolved(weavers);
    setDrapeRigidity(Math.max(15, Math.min(98, rigidity)));
    setFittingStages(stages);
    setEstWeightKg(parseFloat(weight.toFixed(1)));

  }, [silhouette, selectedFabricId, embroideryLevel, collarStyle, fitType]);

  const resetInteractiveSimulator = () => {
    setSilhouette("agbada");
    setSelectedFabricId("indigo-aso-oke");
    setEmbroideryLevel("sovereign");
    setCollarStyle("mandarin");
    setFitType("sculpted");
  };

  const selectedFabricDetails = fabricSwatches.find(f => f.id === selectedFabricId);

  return (
    <section id="atelier" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-warm-gold/10">
      
      {/* Brand Philosophy Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
        
        {/* Left text column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center space-x-2 text-warm-gold text-xs font-syne uppercase tracking-[0.3em]">
            <Scissors className="w-3.5 h-3.5" />
            <span>Tailoring Philosophy</span>
          </div>
          
          <h2 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-cream">
            Biometric Architecture
          </h2>
          <p className="text-xs text-bronze uppercase font-syne tracking-widest">
            The Canvas Basted Fitting Sequence
          </p>

          <p className="text-sm text-cream/75 leading-relaxed font-sans">
            At Agbada Luxe, we reject the shortcuts of standard sizing. Every bespoke commission begins as a canvas basted skeleton—a fragile raw-canvas shell stitched with temporary thick white cotton. This structural draft allows our master tailors to analyze physical stance and shoulder coordinates in high fidelity.
          </p>
          
          <div className="pt-4 border-t border-cream/10 space-y-4">
            <h4 className="font-syne text-[10px] tracking-widest text-warm-gold uppercase">
              Select Stage to Demystify Process
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {fittingSteps.map((step, idx) => (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(idx)}
                  className={`py-2 px-3 border transition-all rounded-sm text-center focus:outline-none ${
                    activeStep === idx 
                      ? "border-warm-gold bg-warm-gold/10 text-warm-gold font-bold" 
                      : "border-cream/10 bg-charcoal/30 hover:border-cream/30 text-cream/60"
                  }`}
                >
                  <span className="font-serif text-xs block">{step.number}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Active Step visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-[#111111]/70 backdrop-blur-md border border-warm-gold/15 p-6 sm:p-8 rounded-sm min-h-[340px] flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle graphic background representing a master draft grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#d4af37_0.75px,transparent_0.75px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 z-10"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-serif text-4xl text-warm-gold/30 font-bold block mb-1">
                    STAGE {fittingSteps[activeStep].number}
                  </span>
                  <h3 className="font-serif text-2xl font-medium text-cream">
                    {fittingSteps[activeStep].title}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[10px] text-bronze uppercase tracking-widest block">Duration</span>
                  <span className="text-xs text-cream font-mono font-semibold">{fittingSteps[activeStep].duration}</span>
                </div>
              </div>

              <p className="text-sm text-cream/70 leading-relaxed font-sans min-h-[80px]">
                {fittingSteps[activeStep].description}
              </p>

              {/* Stat callouts */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-cream/5">
                <div className="p-4 bg-obsidian/80 border border-cream/5 rounded-sm">
                  <span className="text-[10px] font-syne text-bronze uppercase tracking-wider block mb-1">
                    Process Metric
                  </span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-3xl font-serif font-bold text-warm-gold">
                      {fittingSteps[activeStep].metric}
                    </span>
                    <span className="text-xs text-cream/60">
                      {fittingSteps[activeStep].metricLabel}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-obsidian/80 border border-cream/5 rounded-sm flex flex-col justify-center">
                  <span className="text-[10px] font-syne text-bronze uppercase tracking-wider block mb-1">
                    Tailor Focus
                  </span>
                  <span className="text-xs text-cream font-mono font-medium">
                    {activeStep === 0 && "Anatomical bone structure Mapping"}
                    {activeStep === 1 && "Temporary cotton thread baste scaffolding"}
                    {activeStep === 2 && "Active pinning, real-time posture sculpting"}
                    {activeStep === 3 && "Full transfer to premium hand-woven looms"}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation helpers */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t border-cream/5 z-10">
            <span className="text-[10px] text-cream/40 font-mono">
              Basted Blueprint Version 1.04
            </span>
            <button
              id="next-step-btn"
              onClick={() => setActiveStep((prev) => (prev + 1) % fittingSteps.length)}
              className="text-xs text-warm-gold hover:text-cream flex items-center space-x-1 transition-colors uppercase font-syne tracking-widest focus:outline-none"
            >
              <span>Next Stage</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Silhouette Simulator Playground */}
      <div className="border border-warm-gold/15 bg-charcoal/30 backdrop-blur-md rounded-sm p-6 sm:p-8 lg:p-10">
        
        {/* Header of Sandbox */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-cream/5">
          <div>
            <div className="flex items-center space-x-2 text-warm-gold text-xs font-syne uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Interactive Drape Simulator</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-cream">
              The Digital Atelier Sandbox
            </h3>
          </div>
          <button
            onClick={resetInteractiveSimulator}
            className="text-xs text-cream/60 hover:text-warm-gold flex items-center space-x-1.5 transition-colors uppercase tracking-widest font-mono focus:outline-none"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Canvas</span>
          </button>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Base Silhouette Selection */}
            <div>
              <span className="text-[10px] font-syne uppercase tracking-widest text-bronze block mb-2">
                Step 1: Select Master Silhouette
              </span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "agbada", label: "Grand Agbada", desc: "Classic regal drape" },
                  { id: "tuxedo", label: "Savile Tuxedo", desc: "Double-breasted cut" },
                  { id: "hybrid", label: "Atelier Hybrid", desc: "Avant-garde architecture" },
                ].map((sil) => (
                  <button
                    key={sil.id}
                    id={`sil-btn-${sil.id}`}
                    onClick={() => setSilhouette(sil.id)}
                    className={`p-4 border rounded-sm text-left transition-all duration-300 focus:outline-none ${
                      silhouette === sil.id
                        ? "border-warm-gold bg-warm-gold/10 text-warm-gold"
                        : "border-cream/10 bg-obsidian/40 hover:border-cream/20 text-cream/70"
                    }`}
                  >
                    <span className="font-serif text-sm font-semibold block mb-0.5">{sil.label}</span>
                    <span className="text-[10px] text-cream/50 leading-tight block">{sil.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Fabric Swatch Selection */}
            <div>
              <span className="text-[10px] font-syne uppercase tracking-widest text-bronze block mb-2">
                Step 2: Choose Raw Fabric Swatch
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {fabricSwatches.map((f) => (
                  <button
                    key={f.id}
                    id={`swatch-sel-${f.id}`}
                    onClick={() => setSelectedFabricId(f.id)}
                    className={`p-3 border rounded-sm text-left transition-all duration-300 focus:outline-none relative overflow-hidden ${
                      selectedFabricId === f.id
                        ? "border-warm-gold bg-warm-gold/10"
                        : "border-cream/10 bg-obsidian/40 hover:border-cream/20"
                    }`}
                  >
                    {/* Visual color block */}
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-cream/20 shrink-0" 
                        style={{ backgroundColor: f.colorHex }}
                      />
                      <span className="font-serif text-xs font-medium text-cream truncate block">{f.name}</span>
                    </div>
                    <span className="text-[9px] text-cream/50 mt-1 block uppercase font-mono">{f.weight}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Custom Gold Embroidery Density */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-syne uppercase tracking-widest text-bronze">
                  Step 3: Gold Metallic Embroidery Level
                </span>
                <span className="font-mono text-[10px] text-warm-gold font-bold uppercase">
                  {embroideryLevel === "minimal" && "Minimal Accent (15 Hrs)"}
                  {embroideryLevel === "subdued" && "Subdued Border (35 Hrs)"}
                  {embroideryLevel === "sovereign" && "Sovereign Geometric (75 Hrs)"}
                  {embroideryLevel === "majestic" && "Majestic Royal (130 Hrs)"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "minimal", label: "Minimalist" },
                  { id: "subdued", label: "Bespoke" },
                  { id: "sovereign", label: "Sovereign" },
                  { id: "majestic", label: "Majestic" },
                ].map((emb) => (
                  <button
                    key={emb.id}
                    id={`emb-btn-${emb.id}`}
                    onClick={() => setEmbroideryLevel(emb.id)}
                    className={`py-2 px-1 text-[10px] sm:text-xs font-syne uppercase tracking-wider text-center border rounded-sm transition-all focus:outline-none ${
                      embroideryLevel === emb.id
                        ? "border-warm-gold bg-warm-gold/15 text-warm-gold font-semibold"
                        : "border-cream/10 bg-obsidian/40 hover:border-cream/20 text-cream/60"
                    }`}
                  >
                    {emb.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Collar Customization & Target Fit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-syne uppercase tracking-widest text-bronze block mb-2">
                  Collar/Gorge Styling
                </span>
                <select
                  id="collar-style-select"
                  value={collarStyle}
                  onChange={(e) => setCollarStyle(e.target.value)}
                  className="w-full bg-obsidian border border-cream/10 text-cream text-xs rounded-sm p-2.5 focus:border-warm-gold focus:outline-none"
                >
                  <option value="mandarin">Sleek Mandarin Neckline</option>
                  <option value="shawl">Architectural Shawl Lapel</option>
                  <option value="traditional">Traditional Grand Open Gorge</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] font-syne uppercase tracking-widest text-bronze block mb-2">
                  Anatomical Fit Target
                </span>
                <select
                  id="fit-type-select"
                  value={fitType}
                  onChange={(e) => setFitType(e.target.value)}
                  className="w-full bg-obsidian border border-cream/10 text-cream text-xs rounded-sm p-2.5 focus:border-warm-gold focus:outline-none"
                >
                  <option value="loose">Traditional Heritage (Flowing & Voluminous)</option>
                  <option value="sculpted">Modern Sculpted (Tapered & Fitted)</option>
                  <option value="architectural">Architectural Structural (Bold, Boxy & Rigid)</option>
                </select>
              </div>
            </div>

          </div>

          {/* Computed Metrics Canvas Output (5 columns) */}
          <div className="lg:col-span-5 bg-obsidian/90 border border-warm-gold/20 p-6 rounded-sm space-y-6 relative overflow-hidden">
            
            {/* Corner watermarks */}
            <div className="absolute top-4 right-4 text-[9px] font-mono text-cream/20">ATELIER CORE V1.0</div>

            <h4 className="font-serif text-lg font-medium text-cream border-b border-cream/5 pb-3">
              Simulated Master Specs
            </h4>

            {/* Simulated Specs list */}
            <div className="space-y-4">
              
              {/* Handcraft Hours Counter */}
              <div className="flex justify-between items-baseline">
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-cream/60">Estimated Artisan Time</span>
                  <div className="group relative">
                    <HelpCircle className="w-3 h-3 text-cream/40 cursor-help" />
                    <span className="absolute hidden group-hover:block bg-[#111111] border border-warm-gold/25 text-[9px] text-cream/90 p-2 rounded-sm w-44 -top-12 left-0 z-50">
                      Calculates spinning loom weave days, design transfer, basted stages, and metal sewing.
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-serif font-bold text-warm-gold">
                    {handcraftHours}
                  </span>
                  <span className="text-xs text-cream/50 ml-1 font-mono">Hours</span>
                </div>
              </div>

              {/* Fabric Weight */}
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-cream/60">Drape Weight</span>
                <div className="text-right">
                  <span className="text-lg font-serif text-cream font-medium">
                    {estWeightKg}
                  </span>
                  <span className="text-xs text-cream/50 ml-1 font-mono">KG</span>
                </div>
              </div>

              {/* Master Craftsmen Involved */}
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-cream/60">Specialist Guild Members</span>
                <div className="text-right">
                  <span className="text-lg font-serif text-cream font-medium">
                    {weaversInvolved}
                  </span>
                  <span className="text-xs text-cream/50 ml-1 font-mono">Artisans</span>
                </div>
              </div>

              {/* Canvas Basted Fitting Stages */}
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-cream/60">Basted fitting sessions</span>
                <div className="text-right font-serif text-cream font-medium text-sm">
                  <span className="text-warm-gold text-lg font-bold">{fittingStages}</span> separate stages
                </div>
              </div>

              {/* Drape Rigidity Index Slider */}
              <div className="pt-2 border-t border-cream/5">
                <div className="flex justify-between items-center text-[10px] uppercase font-syne tracking-wider text-bronze mb-1.5">
                  <span>Drape Behavior</span>
                  <span>
                    {drapeRigidity > 75 ? "Highly Rigid / Structural" : 
                     drapeRigidity > 50 ? "Crisp Weight / Architectural" : "Fluid / Sculpted"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-charcoal rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-bronze to-warm-gold transition-all duration-500 ease-out"
                    style={{ width: `${drapeRigidity}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-cream/40 font-mono mt-1">
                  <span>Fluid & Light</span>
                  <span>Structural Rigidity ({drapeRigidity}%)</span>
                </div>
              </div>

              {/* Chosen Fabric description snippet */}
              {selectedFabricDetails && (
                <div className="p-3 bg-charcoal/50 border border-warm-gold/10 rounded-sm mt-4 text-[11px]">
                  <span className="font-syne text-[9px] uppercase tracking-wider text-warm-gold block mb-1">
                    Textile Profile: {selectedFabricDetails.name}
                  </span>
                  <p className="text-cream/70 leading-relaxed font-sans">
                    {selectedFabricDetails.description} Loom weave time is approx. <strong>{selectedFabricDetails.weaveTimeDays} days</strong> in {selectedFabricDetails.origin}.
                  </p>
                </div>
              )}

            </div>

            <div className="pt-4 border-t border-cream/5 text-center text-[10px] text-cream/50">
              *The above parameters are dynamically drafted onto your unique biometric map during the basted skeletal fitting.
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
