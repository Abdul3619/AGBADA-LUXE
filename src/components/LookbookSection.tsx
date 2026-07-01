import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { lookbookItems } from "../data";
import { LookbookItem } from "../types";
import { 
  Eye, 
  Layers, 
  Tag, 
  X, 
  Sparkles, 
  Database, 
  SlidersHorizontal, 
  RefreshCw, 
  Scissors, 
  Clock, 
  Compass, 
  ChevronRight,
  Code,
  Info,
  Calendar,
  Layers2,
  FileCode,
  CheckCircle2,
  BookOpen
} from "lucide-react";

interface LookbookSectionProps {
  onSelectForConsultation: (garmentName: string) => void;
  isAdminView?: boolean;
  preSelectedCollection?: string;
  hideCollectionFilter?: boolean;
}

export default function LookbookSection({ 
  onSelectForConsultation, 
  isAdminView = false,
  preSelectedCollection,
  hideCollectionFilter = false
}: LookbookSectionProps) {
  // State for active filters
  const [selectedCollection, setSelectedCollection] = useState<string>(preSelectedCollection || "All");

  useEffect(() => {
    if (preSelectedCollection) {
      setSelectedCollection(preSelectedCollection);
    }
  }, [preSelectedCollection]);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedTheme, setSelectedTheme] = useState<string>("All");
  
  // Search query (simulated CMS search)
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Selected item for the modal detail view
  const [activeModalItem, setActiveModalItem] = useState<LookbookItem | null>(null);

  // CMS Simulation states
  const [showCmsConsole, setShowCmsConsole] = useState<boolean>(false);
  const [localLookbookItems, setLocalLookbookItems] = useState<LookbookItem[]>(lookbookItems);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [editingDescription, setEditingDescription] = useState<string>("");
  const [cmsFeedback, setCmsFeedback] = useState<string | null>(null);

  // Extract unique filter choices from data dynamically (supporting seamless CMS schema changes)
  const collections = useMemo(() => {
    const set = new Set(localLookbookItems.map((item) => item.collection));
    return ["All", ...Array.from(set)];
  }, [localLookbookItems]);

  const garmentTypes = useMemo(() => {
    const set = new Set(localLookbookItems.map((item) => item.garmentType));
    return ["All", ...Array.from(set)];
  }, [localLookbookItems]);

  const editorialThemes = useMemo(() => {
    const set = new Set(localLookbookItems.map((item) => item.editorialTheme));
    return ["All", ...Array.from(set)];
  }, [localLookbookItems]);

  // Handle active lookbook items filter query
  const filteredItems = useMemo(() => {
    return localLookbookItems.filter((item) => {
      const matchesCollection = selectedCollection === "All" || item.collection === selectedCollection;
      const matchesType = selectedType === "All" || item.garmentType === selectedType;
      const matchesTheme = selectedTheme === "All" || item.editorialTheme === selectedTheme;
      const matchesSearch = searchQuery === "" || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.materials.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCollection && matchesType && matchesTheme && matchesSearch;
    });
  }, [localLookbookItems, selectedCollection, selectedType, selectedTheme, searchQuery]);

  // Reset all active filters
  const handleResetFilters = () => {
    setSelectedCollection("All");
    setSelectedType("All");
    setSelectedTheme("All");
    setSearchQuery("");
  };

  // Simulate updating lookbook item metadata live (CMS Live Sync demonstration)
  const handleSaveCmsChanges = (id: string) => {
    setLocalLookbookItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, title: editingTitle, description: editingDescription }
          : item
      )
    );
    
    // Also update current active modal if it's the edited item
    if (activeModalItem && activeModalItem.id === id) {
      setActiveModalItem((prev) =>
        prev ? { ...prev, title: editingTitle, description: editingDescription } : null
      );
    }

    setEditingItemId(null);
    setCmsFeedback("Metadata successfully synchronized with layout engine.");
    setTimeout(() => setCmsFeedback(null), 4000);
  };

  // Start editing in CMS simulation
  const handleStartCmsEdit = (item: LookbookItem) => {
    setEditingItemId(item.id);
    setEditingTitle(item.title);
    setEditingDescription(item.description);
  };

  // Restore baseline CMS data
  const handleResetCmsData = () => {
    setLocalLookbookItems(lookbookItems);
    setCmsFeedback("Atelier live dataset restored to master branch baseline.");
    setTimeout(() => setCmsFeedback(null), 4000);
  };

  return (
    <section id="lookbook" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-warm-gold/10 relative">
      
      {/* Decorative top grid lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-warm-gold/20 to-transparent" />

      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 text-warm-gold text-xs font-syne uppercase tracking-[0.3em] mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Seasonal Archive</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight text-cream mb-6">
            The Lookbook <span className="font-light italic text-warm-gold">Gallery</span>
          </h2>
          <p className="text-cream/85 font-sans text-sm sm:text-base leading-relaxed tracking-wide">
            Filter our high-resolution campaigns dynamically by collection name, garment silhouette, or editorial theme. 
            This responsive grid represents the visual and structural data format designed to hook directly into your headless CMS.
          </p>
        </div>

        {isAdminView && (
          /* CMS Integrator Control Button */
          <div className="flex flex-wrap gap-3">
            <button
              id="cms-console-toggle-btn"
              onClick={() => setShowCmsConsole(!showCmsConsole)}
              className={`px-5 py-2.5 rounded-sm font-mono text-[11px] tracking-wider uppercase transition-all duration-300 flex items-center space-x-2 border ${
                showCmsConsole 
                  ? "bg-warm-gold text-obsidian border-warm-gold font-bold shadow-md shadow-warm-gold/10" 
                  : "bg-charcoal/40 text-warm-gold border-warm-gold/30 hover:border-warm-gold hover:bg-charcoal/60"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{showCmsConsole ? "Close CMS Console" : "Open CMS Schema Console"}</span>
            </button>
          </div>
        )}
      </div>

      {/* CMS Live Demonstration Panel */}
      <AnimatePresence>
        {isAdminView && showCmsConsole && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden mb-12"
          >
            <div className="p-6 bg-[#0E0E0E] border-2 border-dashed border-warm-gold/20 rounded-sm space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-serif text-lg font-medium text-warm-gold flex items-center gap-2">
                    <Code className="w-5 h-5 text-warm-gold" />
                    Simulated Headless CMS Console (JSON Real-time API Bridge)
                  </h3>
                  <p className="text-xs text-cream/70 mt-1 max-w-2xl">
                    This interactive developer sandbox demonstrates how our lookbook metadata models map seamlessly to a headless CMS payload (e.g. Strapi, Contentful, or Sanity). Edit item titles or descriptions here to see them update live on the cards!
                  </p>
                </div>
                <button
                  id="cms-reset-data-btn"
                  onClick={handleResetCmsData}
                  className="px-3 py-1.5 bg-transparent hover:bg-white/5 border border-cream/20 hover:border-cream/40 rounded-sm text-[10px] font-mono text-cream/70 transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Restore Defaults</span>
                </button>
              </div>

              {cmsFeedback && (
                <div className="p-3 bg-green-950/40 border border-green-800/40 text-green-300 text-xs font-mono rounded-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>{cmsFeedback}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Simulated CMS Data Table */}
                <div className="lg:col-span-7 space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-charcoal">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-cream/40 block">Atelier Database Records (Live Rows)</span>
                  
                  {localLookbookItems.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-3 rounded-sm border transition-all ${
                        editingItemId === item.id 
                          ? "bg-warm-gold/10 border-warm-gold" 
                          : "bg-obsidian/80 border-cream/5 hover:border-warm-gold/20"
                      }`}
                    >
                      {editingItemId === item.id ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] text-warm-gold">{item.id} &bull; {item.collection}</span>
                            <div className="flex gap-2">
                              <button
                                id={`cms-save-btn-${item.id}`}
                                onClick={() => handleSaveCmsChanges(item.id)}
                                className="px-2.5 py-1 bg-warm-gold text-obsidian font-mono text-[9px] uppercase font-bold rounded-sm hover:bg-cream transition-colors"
                              >
                                Save Sync
                              </button>
                              <button
                                id={`cms-cancel-btn-${item.id}`}
                                onClick={() => setEditingItemId(null)}
                                className="px-2.5 py-1 bg-charcoal text-cream font-mono text-[9px] uppercase rounded-sm hover:bg-white/10 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              className="w-full bg-obsidian text-cream text-xs px-2.5 py-1.5 border border-warm-gold/25 focus:border-warm-gold rounded-sm focus:outline-none font-sans"
                              placeholder="Garment Title"
                            />
                            <textarea
                              value={editingDescription}
                              onChange={(e) => setEditingDescription(e.target.value)}
                              rows={2}
                              className="w-full bg-obsidian text-cream text-xs px-2.5 py-1.5 border border-warm-gold/25 focus:border-warm-gold rounded-sm focus:outline-none font-sans"
                              placeholder="Garment Editorial Description..."
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="text-xs font-serif font-medium text-cream flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-warm-gold" />
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-cream/50 line-clamp-1">{item.description}</p>
                            <div className="flex flex-wrap gap-2 pt-1 font-mono text-[9px]">
                              <span className="text-warm-gold">collection: "{item.collection}"</span>
                              <span className="text-cream/40">type: "{item.garmentType}"</span>
                              <span className="text-cream/40">theme: "{item.editorialTheme}"</span>
                            </div>
                          </div>
                          <button
                            id={`cms-edit-btn-${item.id}`}
                            onClick={() => handleStartCmsEdit(item)}
                            className="px-2 py-1 bg-charcoal hover:bg-charcoal/80 border border-cream/10 hover:border-warm-gold/20 text-cream/70 font-mono text-[9px] rounded-sm transition-all whitespace-nowrap"
                          >
                            Edit Fields
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Simulated API Endpoint JSON Schema Payload */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-cream/40 flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-warm-gold" />
                        GraphQL / REST API Endpoint Output
                      </span>
                      <span className="px-2 py-0.5 bg-green-950 border border-green-800 text-green-400 font-mono text-[8px] rounded-sm uppercase tracking-widest">
                        GET 200 OK
                      </span>
                    </div>
                    <div className="bg-[#050505] border border-cream/5 p-4 rounded-sm font-mono text-[10px] text-cream/60 overflow-x-auto max-h-[220px] scrollbar-thin scrollbar-thumb-charcoal leading-relaxed">
                      <p className="text-warm-gold font-bold">// Response Schema (lookbooks_collection)</p>
                      <pre className="mt-2 text-cream/80">
{JSON.stringify({
  status: "success",
  data: localLookbookItems.slice(0, 2).map((item) => ({
    id: item.id,
    title: item.title,
    collection_name: item.collection,
    garment_category: item.garmentType,
    editorial_style: item.editorialTheme,
    raw_materials: item.materials,
    imageUrl: item.image,
  })),
  meta: {
    total_records: localLookbookItems.length,
    active_filters: { collection: selectedCollection, type: selectedType, theme: selectedTheme },
    page_size: 2,
    sync_status: "Synced to production CDN"
  }
}, null, 2)}
                      </pre>
                    </div>
                  </div>
                  <div className="p-3 bg-obsidian border border-warm-gold/15 rounded-sm text-[10px] font-mono text-cream/70 leading-snug flex items-start gap-2">
                    <Info className="w-4 h-4 text-warm-gold shrink-0 mt-0.5" />
                    <span>
                      <strong>Atelier API Sync:</strong> Changes saved inside this demo instantly update the virtual database, trigger a CDN cache invalidation, and feed straight into our responsive CSS Grid.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Toolbar Drawer */}
      <div className="p-6 sm:p-8 bg-charcoal/30 backdrop-blur-md border border-warm-gold/15 rounded-sm mb-12 relative overflow-hidden">
        
        {/* Subtle decorative grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px)] [background-size:100%_40px] pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6">
          
          {/* Top Title Bar of Filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="font-mono text-xs tracking-[0.25em] text-warm-gold uppercase flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-warm-gold animate-pulse" />
              <span>Tailoring Filter Matrix</span>
            </h3>

            {/* Quick search bar */}
            <div className="w-full md:w-64 relative">
              <input
                type="text"
                id="lookbook-search-input"
                placeholder="Search materials or styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-obsidian border border-cream/15 text-cream placeholder-cream/40 text-xs px-3.5 py-1.5 focus:border-warm-gold focus:outline-none rounded-sm transition-colors"
              />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Core Selectors Grid */}
          <div className={`grid grid-cols-1 gap-6 ${hideCollectionFilter ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
            
            {/* 1. Collection Filter */}
            {!hideCollectionFilter && (
              <div className="space-y-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-cream/40 block">Collection Range</span>
                <div className="flex flex-wrap gap-1.5">
                  {collections.map((col) => (
                    <button
                      key={col}
                      id={`filter-collection-${col.replace(/\s+/g, "-")}`}
                      onClick={() => setSelectedCollection(col)}
                      className={`px-3 py-1.5 rounded-sm text-[10px] font-mono tracking-wider uppercase transition-all duration-300 ${
                        selectedCollection === col
                          ? "bg-warm-gold text-obsidian font-bold"
                          : "bg-obsidian/80 text-cream/70 border border-cream/5 hover:border-warm-gold/25"
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Silhouette / Garment Type Filter */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-cream/40 block">Garment Silhouette</span>
              <div className="flex flex-wrap gap-1.5">
                {garmentTypes.map((type) => (
                  <button
                    key={type}
                    id={`filter-type-${type.replace(/\s+/g, "-")}`}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-sm text-[10px] font-mono tracking-wider uppercase transition-all duration-300 ${
                      selectedType === type
                        ? "bg-warm-gold text-obsidian font-bold"
                        : "bg-obsidian/80 text-cream/70 border border-cream/5 hover:border-warm-gold/25"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Editorial Theme Filter */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-cream/40 block">Editorial Vibe / Theme</span>
              <div className="flex flex-wrap gap-1.5">
                {editorialThemes.map((theme) => (
                  <button
                    key={theme}
                    id={`filter-theme-${theme.replace(/\s+/g, "-")}`}
                    onClick={() => setSelectedTheme(theme)}
                    className={`px-3 py-1.5 rounded-sm text-[10px] font-mono tracking-wider uppercase transition-all duration-300 ${
                      selectedTheme === theme
                        ? "bg-warm-gold text-obsidian font-bold"
                        : "bg-obsidian/80 text-cream/70 border border-cream/5 hover:border-warm-gold/25"
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Active Filter Indicators & Reset CTA */}
          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-cream/5 gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono text-cream/40">Active Filters:</span>
              {(selectedCollection !== "All" || selectedType !== "All" || selectedTheme !== "All" || searchQuery !== "") ? (
                <>
                  {selectedCollection !== "All" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-warm-gold/10 border border-warm-gold/20 text-warm-gold rounded-sm text-[9px] font-mono uppercase">
                      Col: {selectedCollection}
                      <X className="w-2.5 h-2.5 cursor-pointer text-warm-gold/60 hover:text-warm-gold" onClick={() => setSelectedCollection("All")} />
                    </span>
                  )}
                  {selectedType !== "All" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-warm-gold/10 border border-warm-gold/20 text-warm-gold rounded-sm text-[9px] font-mono uppercase">
                      Type: {selectedType}
                      <X className="w-2.5 h-2.5 cursor-pointer text-warm-gold/60 hover:text-warm-gold" onClick={() => setSelectedType("All")} />
                    </span>
                  )}
                  {selectedTheme !== "All" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-warm-gold/10 border border-warm-gold/20 text-warm-gold rounded-sm text-[9px] font-mono uppercase">
                      Theme: {selectedTheme}
                      <X className="w-2.5 h-2.5 cursor-pointer text-warm-gold/60 hover:text-warm-gold" onClick={() => setSelectedTheme("All")} />
                    </span>
                  )}
                  {searchQuery !== "" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-warm-gold/10 border border-warm-gold/20 text-warm-gold rounded-sm text-[9px] font-mono uppercase">
                      Query: "{searchQuery}"
                      <X className="w-2.5 h-2.5 cursor-pointer text-warm-gold/60 hover:text-warm-gold" onClick={() => setSearchQuery("")} />
                    </span>
                  )}
                  <button
                    id="lookbook-reset-all-btn"
                    onClick={handleResetFilters}
                    className="text-[10px] font-mono text-warm-gold hover:text-cream underline uppercase tracking-wider pl-1 font-bold"
                  >
                    Clear All
                  </button>
                </>
              ) : (
                <span className="text-[10px] font-mono text-cream/70 italic">Showing all collection archives.</span>
              )}
            </div>

            <div className="text-[10px] font-mono text-cream/40">
              Filtered Result: <strong className="text-cream font-bold">{filteredItems.length}</strong> / {localLookbookItems.length} styles
            </div>
          </div>

        </div>
      </div>

      {/* Dynamic Staggered Filter Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer relative"
              onClick={() => setActiveModalItem(item)}
            >
              {/* Image Container Card */}
              <div className="relative overflow-hidden bg-obsidian border border-warm-gold/15 group-hover:border-warm-gold/40 rounded-sm aspect-[3/4] transition-all duration-500 shadow-md">
                
                {/* Micro-loading / Shimmer placeholder simulation */}
                <div className="absolute inset-0 bg-neutral-900 animate-pulse pointer-events-none -z-10" />

                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale-[25%] group-hover:grayscale-[5%] group-hover:scale-[1.04] transition-all duration-[1000ms] ease-out"
                />

                {/* Gradient vignette mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent opacity-80 group-hover:opacity-70 transition-all duration-500" />

                {/* Floating Meta Pills */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  <span className="px-2 py-1 bg-obsidian/95 backdrop-blur-md border border-warm-gold/30 text-warm-gold text-[8px] font-mono tracking-widest uppercase rounded-sm">
                    {item.collection}
                  </span>
                  <span className="px-2 py-0.5 bg-[#0D0D0D]/90 backdrop-blur-md border border-white/5 text-cream/70 text-[7px] font-mono tracking-widest uppercase rounded-sm self-start">
                    {item.editorialTheme}
                  </span>
                </div>

                {/* Floating Content Details (Bottom overlay) */}
                <div className="absolute bottom-4 left-4 right-4 z-10 transition-transform duration-500 group-hover:-translate-y-1">
                  <div className="flex items-center space-x-1.5 text-[8px] font-mono text-warm-gold uppercase tracking-wider mb-1">
                    <span>{item.garmentType}</span>
                    <span>&bull;</span>
                    <span>{item.year}</span>
                  </div>
                  <h4 className="font-serif text-lg font-semibold tracking-tight text-cream group-hover:text-warm-gold transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-cream/60 mt-1 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {item.description}
                  </p>
                </div>

                {/* Beautiful Dark Interactive Overlay on Hover */}
                <div className="absolute inset-0 bg-obsidian/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <div className="p-3 bg-obsidian/90 border border-warm-gold/30 text-warm-gold rounded-full scale-75 group-hover:scale-100 transition-transform duration-500 shadow-xl flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>

              </div>

              {/* Outside metadata tag for premium scannability */}
              <div className="mt-3 flex items-center justify-between px-1">
                <span className="text-[9px] font-mono text-cream/40 uppercase tracking-widest">{item.id}</span>
                <span className="text-[10px] font-serif italic text-warm-gold/80 flex items-center gap-1 group-hover:text-warm-gold transition-colors">
                  View Specs
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="col-span-full py-16 text-center border border-dashed border-cream/10 rounded-sm bg-charcoal/20">
            <SlidersHorizontal className="w-8 h-8 text-cream/20 mx-auto mb-4" />
            <h4 className="font-serif text-lg font-semibold text-cream">No Silhouettes Match Filters</h4>
            <p className="text-xs text-cream/50 max-w-sm mx-auto mt-2 leading-relaxed">
              We could not find lookbook entries fitting your specific curation. Adjust the collection, garment type, or theme range.
            </p>
            <button
              id="lookbook-empty-reset-btn"
              onClick={handleResetFilters}
              className="mt-5 px-4 py-2 bg-warm-gold/10 border border-warm-gold/35 hover:bg-warm-gold hover:text-obsidian text-warm-gold text-xs font-mono tracking-wider uppercase rounded-sm transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </motion.div>

      {/* Detail Showcase & CMS Integrator Modal */}
      <AnimatePresence>
        {activeModalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-obsidian/95 backdrop-blur-md overflow-y-auto"
            onClick={() => setActiveModalItem(null)}
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 150 }}
              className="relative w-full max-w-5xl bg-[#0E0E0E] border border-warm-gold/30 rounded-sm overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                id="modal-close-btn"
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 z-30 p-2 bg-obsidian/80 hover:bg-charcoal border border-cream/10 hover:border-warm-gold/30 rounded-full text-cream hover:text-warm-gold transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Campaign Image Frame */}
              <div className="md:col-span-5 relative bg-black aspect-[4/5] md:aspect-auto md:min-h-[500px]">
                <img
                  src={activeModalItem.image}
                  alt={activeModalItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale-[10%]"
                />
                
                {/* Floating Heritage Badge */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-warm-gold uppercase tracking-wider mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Lagos &bull; London Atelier</span>
                  </div>
                  <p className="text-[10px] text-cream/70 leading-relaxed font-sans italic">
                    All patterns are digitally archived for subsequent sizing and remote reproduction across both territories.
                  </p>
                </div>
              </div>

              {/* Right Side: Editorial Metadata & CMS Blueprint Panel */}
              <div className="md:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[85vh] scrollbar-thin">
                
                {/* Editorial Details */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-warm-gold uppercase tracking-widest mb-2">
                      <span>{activeModalItem.collection}</span>
                      <span>&bull;</span>
                      <span>{activeModalItem.editorialTheme}</span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-4xl font-semibold text-cream leading-tight">
                      {activeModalItem.title}
                    </h3>
                    <p className="text-[10px] font-mono text-cream/40 uppercase mt-1">{activeModalItem.id} &bull; Campaign Vintage {activeModalItem.year}</p>
                  </div>

                  <div className="h-[1px] w-full bg-gradient-to-r from-warm-gold/25 via-transparent to-transparent" />

                  <div>
                    <span className="text-[9px] font-mono text-warm-gold uppercase tracking-[0.2em] block mb-2">Editorial Narrative</span>
                    <p className="text-xs sm:text-sm text-cream/80 leading-relaxed font-sans">
                      {activeModalItem.description}
                    </p>
                  </div>

                  {/* Material Tags */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-cream/40 uppercase tracking-[0.2em] block">Atelier Fiber Selection</span>
                    <div className="flex flex-wrap gap-2">
                      {activeModalItem.materials.map((mat, i) => (
                        <span 
                          key={i} 
                          className="px-2.5 py-1 text-[10px] font-mono bg-charcoal text-cream border border-warm-gold/15 rounded-sm"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Credits & Origin */}
                  {activeModalItem.credits && (
                    <div className="p-3 bg-obsidian border border-cream/5 rounded-sm">
                      <span className="text-[8px] font-mono text-warm-gold uppercase tracking-widest block mb-1">Tailoring Catalog Credits</span>
                      <p className="text-[10px] text-cream/70 font-mono leading-relaxed">{activeModalItem.credits}</p>
                    </div>
                  )}

                  {/* Dynamic CMS Field Mapping visualizer */}
                  <div className="p-4 bg-charcoal/40 border border-warm-gold/10 rounded-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-mono text-warm-gold/80 uppercase tracking-wider flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5" />
                        CMS Field Mapping Schema
                      </span>
                      <span className="text-[8px] font-mono text-cream/30 uppercase">API Model: LookbookItem</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                      <div className="p-2 bg-obsidian/80 rounded-sm">
                        <span className="text-cream/40 block">JSON field</span>
                        <span className="text-cream font-bold">"id"</span>
                        <span className="text-warm-gold/90 block mt-0.5">&rarr; {activeModalItem.id}</span>
                      </div>
                      <div className="p-2 bg-obsidian/80 rounded-sm">
                        <span className="text-cream/40 block">JSON field</span>
                        <span className="text-cream font-bold">"collection"</span>
                        <span className="text-warm-gold/90 block mt-0.5">&rarr; "{activeModalItem.collection}"</span>
                      </div>
                      <div className="p-2 bg-obsidian/80 rounded-sm">
                        <span className="text-cream/40 block">JSON field</span>
                        <span className="text-cream font-bold">"garmentType"</span>
                        <span className="text-warm-gold/90 block mt-0.5">&rarr; "{activeModalItem.garmentType}"</span>
                      </div>
                      <div className="p-2 bg-obsidian/80 rounded-sm">
                        <span className="text-cream/40 block">JSON field</span>
                        <span className="text-cream font-bold">"editorialTheme"</span>
                        <span className="text-warm-gold/90 block mt-0.5">&rarr; "{activeModalItem.editorialTheme}"</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Call to Action */}
                <div className="pt-6 border-t border-cream/5 mt-6">
                  <button
                    id={`modal-book-cta-${activeModalItem.id}`}
                    onClick={() => {
                      onSelectForConsultation(activeModalItem.title);
                      setActiveModalItem(null);
                    }}
                    className="w-full py-3.5 px-4 bg-warm-gold hover:bg-cream text-obsidian font-syne uppercase tracking-widest text-xs font-bold transition-all duration-300 flex items-center justify-center space-x-2 rounded-sm"
                  >
                    <Scissors className="w-4 h-4" />
                    <span>Inquire / Request Fitted Adaptation</span>
                  </button>
                  <p className="text-center text-[9px] text-cream/40 font-mono mt-2 uppercase tracking-wider">
                    Selecting this pre-populates your tailoring consultation.
                  </p>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
