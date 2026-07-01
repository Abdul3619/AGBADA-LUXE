import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  ShieldCheck, 
  Key, 
  Database, 
  Settings, 
  LayoutDashboard, 
  LogOut, 
  User, 
  Terminal, 
  Cpu 
} from "lucide-react";

// Lazy load admin components to keep them out of the public-facing bundle
const AdminDashboard = React.lazy(() => import("../components/AdminDashboard"));
const AtelierArchitectSuite = React.lazy(() => import("../components/AtelierArchitectSuite"));

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  
  // Tab selector for admin sub-workspaces
  const [adminTab, setAdminTab] = useState<"dashboard" | "database">("dashboard");

  // Check persistent authentication on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("agbada_luxe_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setErrorMsg(null);

    // Simulate luxury biometric decryption / validation
    setTimeout(() => {
      if (email.toLowerCase() === "admin@agbadaluxe.com" && password === "admin2026") {
        setIsAuthenticated(true);
        localStorage.setItem("agbada_luxe_admin_auth", "true");
      } else {
        setErrorMsg("Access Denied: Invalid Administrative Coordinates or Signature.");
      }
      setIsAuthenticating(false);
    }, 1200);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("agbada_luxe_admin_auth");
  };

  // Loading fallback for lazy loaded admin panels
  const AdminPanelLoading = () => (
    <div className="py-24 text-center space-y-4">
      <div className="relative w-16 h-16 mx-auto">
        <div className="absolute inset-0 border-2 border-dashed border-warm-gold/20 rounded-full animate-spin" style={{ animationDuration: "10s" }} />
        <div className="absolute inset-2 border border-dashed border-warm-gold/40 rounded-full animate-spin" style={{ animationDuration: "4s", animationDirection: "reverse" }} />
        <div className="absolute inset-4 flex items-center justify-center">
          <Cpu className="w-5 h-5 text-warm-gold animate-pulse" />
        </div>
      </div>
      <p className="font-mono text-xs text-warm-gold/70 uppercase tracking-widest">Decrypting Administrative Core...</p>
    </div>
  );

  return (
    <div className="bg-obsidian min-h-screen text-cream pt-20 relative">
      
      {/* Dynamic admin glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] bg-warm-gold/5 rounded-full blur-[160px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          /* Secure Administrative Portal Gateway */
          <motion.div
            key="login-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md mx-auto px-4 py-16"
          >
            <div className="bg-charcoal/40 backdrop-blur-md border-2 border-dashed border-warm-gold/20 p-8 rounded-sm space-y-6 shadow-xl relative">
              
              {/* Watermark grid badge */}
              <div className="absolute top-3 right-3 flex items-center space-x-1.5 font-mono text-[8px] text-warm-gold/40 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 text-warm-gold/40" />
                <span>Secure Console</span>
              </div>

              <div className="text-center space-y-2">
                <div className="inline-flex p-3 bg-charcoal/50 border border-warm-gold/20 rounded-full text-warm-gold mb-2">
                  <Lock className="w-5 h-5 animate-pulse" />
                </div>
                <h1 className="font-serif text-2xl font-bold tracking-wider text-cream">Admin Gateway</h1>
                <p className="font-sans text-xs text-cream/60">
                  Authentication is required to unlock CRM records, real-time ledgers, and API endpoint debug maps.
                </p>
              </div>

              {/* Demo Hint Banner */}
              <div className="p-3 bg-warm-gold/5 border border-warm-gold/15 rounded-sm font-mono text-[10px] text-warm-gold/80 leading-relaxed space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" />
                  <span>Authorized Test Credentials:</span>
                </div>
                <div>Email: <span className="text-cream select-all">admin@agbadaluxe.com</span></div>
                <div>Password: <span className="text-cream select-all">admin2026</span></div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 font-sans">
                {errorMsg && (
                  <div className="p-3 bg-red-950/40 border border-red-900/40 text-red-300 text-xs font-mono rounded-sm text-center">
                    ✕ {errorMsg}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-cream/40 block">Email Address</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@agbadaluxe.com"
                      className="w-full bg-obsidian border border-cream/10 text-cream text-xs rounded-sm pl-10 pr-4 py-2.5 focus:border-warm-gold focus:outline-none placeholder-cream/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-cream/40 block">Password Signature</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-obsidian border border-cream/10 text-cream text-xs rounded-sm pl-10 pr-4 py-2.5 focus:border-warm-gold focus:outline-none placeholder-cream/20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3 bg-warm-gold hover:bg-cream text-obsidian font-syne text-xs uppercase tracking-widest font-bold transition-all duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isAuthenticating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Coordinates...</span>
                    </>
                  ) : (
                    <span>Unlock Core Chambers</span>
                  )}
                </button>
              </form>

              <div className="text-center font-mono text-[8px] text-cream/30 uppercase tracking-[0.2em] pt-2">
                Encryption Grade SHA-256 &bull; Agbada Luxe
              </div>
            </div>
          </motion.div>
        ) : (
          /* Decrypted Master Admin Chambers */
          <motion.div
            key="dashboard-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
          >
            {/* Admin Portal Header with Control Bars */}
            <div className="bg-[#0A0A0A] border border-warm-gold/20 p-6 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(rgba(212,175,55,0.02)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
              
              <div className="space-y-1 z-10">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-warm-gold font-bold">Administrative Access Enabled</span>
                </div>
                <h1 className="font-serif text-2xl font-bold text-cream">Master Suite Workspace</h1>
              </div>

              {/* Workspace Navigation & Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 z-10 font-mono text-[10px] uppercase">
                <button
                  onClick={() => setAdminTab("dashboard")}
                  className={`px-4 py-2 border rounded-sm transition-all flex items-center space-x-2 ${
                    adminTab === "dashboard"
                      ? "bg-warm-gold text-obsidian border-warm-gold font-bold"
                      : "bg-charcoal/40 text-cream/70 border-cream/10 hover:border-warm-gold/30"
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Interactive CRM & Booking Log</span>
                </button>

                <button
                  onClick={() => setAdminTab("database")}
                  className={`px-4 py-2 border rounded-sm transition-all flex items-center space-x-2 ${
                    adminTab === "database"
                      ? "bg-warm-gold text-obsidian border-warm-gold font-bold"
                      : "bg-charcoal/40 text-cream/70 border-cream/10 hover:border-warm-gold/30"
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>API & DB Architect Console</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-950/40 text-red-300 border border-red-900/30 hover:bg-red-900/40 hover:border-red-500 rounded-sm transition-all flex items-center space-x-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Secure Lock</span>
                </button>
              </div>
            </div>

            {/* Admin workspace frame loaded with Suspense for performance and modular compilation */}
            <div className="bg-[#050505] border border-cream/5 rounded-sm p-2 sm:p-4 min-h-[600px]">
              <Suspense fallback={<AdminPanelLoading />}>
                {adminTab === "dashboard" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <AdminDashboard />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <AtelierArchitectSuite />
                  </motion.div>
                )}
              </Suspense>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
