import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import LookbookSection from "../components/LookbookSection";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function CollectionDetail() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  // Validate collection name to avoid render errors
  const validCollections = ["Agbada Luxe", "SS24", "Heritage Noir"];
  const currentCollection = name || "";

  if (!validCollections.includes(currentCollection)) {
    return (
      <div className="pt-32 min-h-screen max-w-7xl mx-auto px-4 text-center space-y-6">
        <h1 className="font-serif text-3xl font-bold text-cream">Portfolio Not Found</h1>
        <p className="text-sm text-cream/60">The requested collection "{currentCollection}" does not exist in our studio logs.</p>
        <Link to="/the-lookout" className="inline-block px-6 py-2.5 bg-warm-gold text-obsidian uppercase font-mono text-xs font-bold rounded-sm hover:bg-cream transition-colors">
          Return to The Lookout
        </Link>
      </div>
    );
  }

  const handleSelectForConsultation = (garmentName: string) => {
    // Navigate to contact route, passing the preselected garment as a query param
    navigate(`/contact?garment=${encodeURIComponent(garmentName)}`);
  };

  return (
    <div className="pt-24 min-h-screen">
      {/* Editorial Header / Navigation Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          id="back-to-lookout-btn"
          to="/the-lookout"
          className="inline-flex items-center space-x-2 text-xs font-mono text-warm-gold hover:text-cream uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collections</span>
        </Link>

        <div className="mt-8 border-b border-warm-gold/15 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-bronze">Active Portfolio Range</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-cream">
              The <span className="font-light italic text-warm-gold">{currentCollection}</span> Collection
            </h1>
          </div>
          <div className="text-right max-w-md">
            <p className="font-sans text-xs text-cream/70 leading-relaxed">
              Viewing individual silhouettes basted and hand-finished for the {currentCollection} catalog. Each garment carries Certified Authentic loom-marks.
            </p>
          </div>
        </div>
      </div>

      {/* Render the full LookbookSection pre-filtered and with hidden collection filters */}
      <div className="py-8">
        <LookbookSection 
          onSelectForConsultation={handleSelectForConsultation}
          preSelectedCollection={currentCollection}
          hideCollectionFilter={true}
          isAdminView={false}
        />
      </div>
    </div>
  );
}
