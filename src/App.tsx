import React, { useState, FormEvent } from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Lookout from "./pages/Lookout";
import CollectionDetail from "./pages/CollectionDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import { Landmark, Send, MapPin, Instagram, Mail, ArrowUpRight } from "lucide-react";

// Shared Public Layout for Logo, Nav, background glows, and commercial footer
function PublicLayout() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes("@")) {
      setNewsletterSuccess(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSuccess(false), 5000);
    }
  };

  return (
    <div className="bg-obsidian min-h-screen text-cream selection:bg-warm-gold selection:text-obsidian relative">
      
      {/* Background ambient lighting effects to create depth without performance lag */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-warm-gold/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-bronze/5 blur-[120px] pointer-events-none" />

      {/* Global Minimalist Header */}
      <Header />

      {/* Main Content Layout */}
      <main className="relative z-10">
        <Outlet />
      </main>

      {/* Luxury Brand Footer */}
      <footer className="bg-charcoal border-t border-warm-gold/20 pt-20 pb-10 px-4 sm:px-6 lg:px-8 relative z-20">
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Coordinates */}
          <div className="space-y-4">
            <h4 className="font-serif text-xl font-bold text-cream">
              AGBADA <span className="font-light italic text-warm-gold">LUXE</span>
            </h4>
            <p className="text-xs text-cream/70 leading-relaxed font-sans max-w-xs">
              Curating architectural, modern silhouettes built on centuries of traditional West African fabric craftsmanship. Certified authentic loomings.
            </p>
            <div className="flex items-center space-x-2 font-mono text-[9px] text-bronze uppercase tracking-widest">
              <Landmark className="w-3.5 h-3.5 text-warm-gold" />
              <span>Lagos &bull; London</span>
            </div>
          </div>

          {/* Column 2: Navigation Map */}
          <div>
            <h5 className="font-syne text-[10px] uppercase tracking-widest text-warm-gold mb-4">Navigations</h5>
            <ul className="space-y-2 text-xs text-cream/70 font-sans">
              <li>
                <a href="/the-lookout" className="hover:text-warm-gold transition-colors focus:outline-none">
                  S/S Lookbook
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-warm-gold transition-colors focus:outline-none">
                  Atelier & philosophy
                </a>
              </li>
              <li>
                <a href="/the-lookout#swatches" className="hover:text-warm-gold transition-colors focus:outline-none">
                  Textile swatch archive
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-warm-gold transition-colors focus:outline-none">
                  Book basted fitting
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Socials */}
          <div>
            <h5 className="font-syne text-[10px] uppercase tracking-widest text-warm-gold mb-4">Inquiries</h5>
            <ul className="space-y-3 text-xs text-cream/70 font-sans">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-warm-gold/60" />
                <a href="mailto:atelier@agbadaluxe.com" className="hover:text-warm-gold transition-colors">
                  atelier@agbadaluxe.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Instagram className="w-4 h-4 text-warm-gold/60" />
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-warm-gold transition-colors flex items-center space-x-0.5">
                  <span>@agbadaluxe</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-warm-gold/60 shrink-0 mt-0.5" />
                <span>
                  18 Savile Row, Mayfair, London<br />
                  42 V.I. Boulevard, Lagos
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Sign-up */}
          <div className="space-y-4">
            <h5 className="font-syne text-[10px] uppercase tracking-widest text-warm-gold mb-4">Private Dispatch</h5>
            <p className="text-xs text-cream/70 leading-relaxed font-sans">
              Subscribe to receive early catalog access, fitting invitations, and private seasonal dispatch releases.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex">
                <input
                  id="newsletter-email-input"
                  type="email"
                  placeholder="Inquiry email..."
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-obsidian border border-cream/10 text-cream text-xs rounded-l-sm p-2.5 focus:border-warm-gold focus:outline-none placeholder-cream/30"
                />
                <button
                  id="newsletter-submit-btn"
                  type="submit"
                  className="px-4 bg-warm-gold hover:bg-cream text-obsidian text-xs font-bold font-syne uppercase transition-colors rounded-r-sm flex items-center justify-center"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {newsletterSuccess && (
                <motion.p 
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] font-mono text-warm-gold"
                >
                  ✓ Registered for private dispatch. Thank you.
                </motion.p>
              )}
            </form>
          </div>

        </div>

        {/* Footer Base bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-cream/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-cream/40 font-mono">
          <div>
            &copy; {new Date().getFullYear()} Agbada Luxe House of Couture. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-warm-gold/50">Lagos-London Collective</span>
            <span>&bull;</span>
            <span>Supporting Nigerian Vertical Looms Guild</span>
          </div>
        </div>

      </footer>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Shared Layout Header and Footer */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="the-lookout" element={<Lookout />} />
          
          {/* Robust mapping of user's requested path strings including spaces and dashes */}
          <Route path="the lookout" element={<Navigate to="/the-lookout" replace />} />
          <Route path="the_lookout" element={<Navigate to="/the-lookout" replace />} />
          
          <Route path="collections/:name" element={<CollectionDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin Route (Isolated Dashboard and Console workspace) */}
        <Route path="/admin" element={<Admin />} />

        {/* Catch-all Route redirects to Homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
