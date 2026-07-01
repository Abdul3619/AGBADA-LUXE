import { motion } from "motion/react";
import { Compass, Sparkles, Scissors, CalendarRange, Menu, X, Landmark } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "lookbook", label: "The Lookbook", icon: Compass, path: "/the-lookout" },
    { id: "atelier", label: "The Atelier", icon: Scissors, path: "/about" },
    { id: "booking", label: "Book Consultation", icon: CalendarRange, path: "/contact" },
  ];

  // Determine active section based on current path
  const currentPath = location.pathname;
  let activeSection = "";
  if (currentPath === "/the-lookout" || currentPath.startsWith("/collections/")) {
    activeSection = "lookbook";
  } else if (currentPath === "/about") {
    activeSection = "atelier";
  } else if (currentPath === "/contact") {
    activeSection = "booking";
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0A0A0A]/75 backdrop-blur-xl border-b border-warm-gold/15 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Studios Alignment Coordinates - Left */}
          <div className="hidden lg:flex items-center space-x-2 font-mono text-[10px] tracking-[0.2em] text-bronze uppercase">
            <Landmark className="w-3.5 h-3.5 text-warm-gold" />
            <span>Studio: Lagos 6.52°N</span>
            <span className="text-warm-gold/30">|</span>
            <span>London 51.50°N</span>
          </div>

          {/* Logo Center */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link 
              to="/" 
              className="inline-block group focus:outline-none"
            >
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-cream group-hover:text-warm-gold transition-colors duration-300">
                AGBADA <span className="font-light italic text-warm-gold">LUXE</span>
              </h1>
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-warm-gold/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </Link>
          </div>

          {/* Nav Items - Right */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-sm text-xs font-syne uppercase tracking-widest flex items-center space-x-2 transition-all duration-300 hover:text-warm-gold focus:outline-none ${
                    isActive ? "text-warm-gold font-semibold" : "text-cream/75"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-warm-gold"
                      transition={{ type: "spring", stiffness: 150, damping: 20 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-cream hover:text-warm-gold focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden border-b border-warm-gold/15 bg-[#0D0D0D]/95 backdrop-blur-2xl"
        >
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full text-left px-4 py-3 rounded-md text-sm font-syne uppercase tracking-wider flex items-center space-x-3 transition-colors ${
                    isActive 
                      ? "bg-warm-gold/10 text-warm-gold font-semibold border-l-2 border-warm-gold" 
                      : "text-cream/80 hover:bg-charcoal/50 hover:text-warm-gold"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <div className="pt-4 border-t border-cream/5 text-center font-mono text-[9px] tracking-[0.15em] text-bronze uppercase">
              LAGOS & LONDON &bull; EST. 2026
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
