import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Consultation, FabricSwatch } from "../types";
import { fabricSwatches, garmentsData } from "../data";
import { CalendarRange, Sparkles, User, Mail, Phone, Clock, FileText, QrCode, Trash2, Calendar, Scissors, ChevronRight, Check } from "lucide-react";

interface BookingFormProps {
  preselectedGarmentName: string;
}

export default function BookingForm({ preselectedGarmentName }: BookingFormProps) {
  // Booking Form Inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [garmentStyle, setGarmentStyle] = useState("The Gilded Agbada");
  const [selectedFabricId, setSelectedFabricId] = useState("indigo-aso-oke");
  const [fittingType, setFittingType] = useState<"canvas-basted" | "standard-bespoke" | "digital-measure">("canvas-basted");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [notes, setNotes] = useState("");
  
  // Measurements
  const [hasMeasurements, setHasMeasurements] = useState(false);
  const [height, setHeight] = useState("");
  const [chest, setChest] = useState("");
  const [shoulderWidth, setShoulderWidth] = useState("");
  const [agbadaLength, setAgbadaLength] = useState("");

  // System States
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [activeFormStep, setActiveFormStep] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Sync preselected garment if changed
  useEffect(() => {
    if (preselectedGarmentName) {
      setGarmentStyle(preselectedGarmentName);
      
      // Auto-match fabric to save click
      if (preselectedGarmentName.includes("Ivory")) {
        setSelectedFabricId("ivory-raw-silk");
      } else if (preselectedGarmentName.includes("Obsidian") || preselectedGarmentName.includes("Tuxedo")) {
        setSelectedFabricId("charcoal-merino-silk");
      } else {
        setSelectedFabricId("indigo-aso-oke");
      }

      // Scroll to booking form
      const el = document.getElementById("booking");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [preselectedGarmentName]);

  // Load from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem("agbada_luxe_consultations");
    if (stored) {
      try {
        setConsultations(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing consultations:", e);
      }
    }
  }, []);

  // Save to LocalStorage
  const saveConsultations = (updated: Consultation[]) => {
    setConsultations(updated);
    localStorage.setItem("agbada_luxe_consultations", JSON.stringify(updated));
  };

  const handleNextStep = () => {
    if (activeFormStep === 1) {
      if (!fullName.trim() || !email.trim() || !phone.trim()) {
        setErrorMessage("Please complete your physical identity details first.");
        return;
      }
      setErrorMessage("");
      setActiveFormStep(2);
    }
  };

  const handleBookingSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!appointmentDate || !appointmentTime) {
      setErrorMessage("Please select a valid Studio Date and Time for your fitting.");
      return;
    }

    const newBooking: Consultation = {
      id: "at-pass_" + Date.now(),
      fullName,
      email,
      phone,
      garmentStyle,
      selectedFabricId,
      fittingType,
      appointmentDate,
      appointmentTime,
      notes: notes.trim() || undefined,
      status: "confirmed",
      measurements: hasMeasurements ? {
        height: height || "Standard",
        chest: chest || "Standard",
        shoulderWidth: shoulderWidth || "Standard",
        agbadaLength: agbadaLength || "Standard"
      } : undefined
    };

    const updated = [newBooking, ...consultations];
    saveConsultations(updated);

    // Reset Form fields
    setFullName("");
    setEmail("");
    setPhone("");
    setAppointmentDate("");
    setAppointmentTime("");
    setNotes("");
    setHeight("");
    setChest("");
    setShoulderWidth("");
    setAgbadaLength("");
    setHasMeasurements(false);
    
    setErrorMessage("");
    setSuccessMessage("Your basted fitting appointment has been securely registered in the Agbada Luxe Ledger.");
    setActiveFormStep(1);

    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 8000);
  };

  const handleCancelBooking = (id: string) => {
    const updated = consultations.filter(c => c.id !== id);
    saveConsultations(updated);
  };

  const activeFabric = fabricSwatches.find(f => f.id === selectedFabricId) || fabricSwatches[0];

  return (
    <section id="booking" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Form Panel: Multi-Step Interactive Booking (7 columns) */}
        <div className="lg:col-span-7 bg-[#111111]/80 backdrop-blur-md border border-warm-gold/15 p-6 sm:p-8 rounded-sm">
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-cream/5">
            <div>
              <div className="flex items-center space-x-2 text-warm-gold text-xs font-syne uppercase tracking-wider mb-1">
                <CalendarRange className="w-4 h-4" />
                <span>Atelier Ledger Scheduler</span>
              </div>
              <h3 className="font-serif text-2xl font-semibold text-cream">
                Schedule Fitting Consultation
              </h3>
            </div>
            
            {/* Step Indicators */}
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className={activeFormStep === 1 ? "text-warm-gold font-bold" : "text-cream/40"}>01 Profile</span>
              <span className="text-cream/20">/</span>
              <span className={activeFormStep === 2 ? "text-warm-gold font-bold" : "text-cream/40"}>02 Dimensions</span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-950/50 border border-red-900/60 text-red-300 text-xs rounded-sm mb-6 font-mono">
              &bull; {errorMessage}
            </div>
          )}

          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-warm-gold/15 border border-warm-gold/25 text-warm-gold text-xs rounded-sm mb-6 font-mono leading-relaxed"
            >
              <strong>✓ Secure Reservation Confirmed!</strong> {successMessage} Scroll down to your <strong>Active Fitting Passes</strong> below to access your custom biometric pass.
            </motion.div>
          )}

          <form onSubmit={handleBookingSubmit} className="space-y-6">
            
            {activeFormStep === 1 ? (
              /* STEP 1: Profile & Client Identity */
              <div className="space-y-5">
                <span className="text-[10px] font-syne uppercase tracking-[0.2em] text-bronze block">
                  Identity & Contact Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullname-input" className="block text-[10px] font-syne uppercase tracking-wider text-cream/75 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-warm-gold/40" />
                      <input
                        id="fullname-input"
                        type="text"
                        required
                        placeholder="e.g. Olumide Awosika"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-obsidian border border-cream/10 text-cream text-xs rounded-sm pl-10 pr-4 py-3 focus:border-warm-gold focus:outline-none placeholder-cream/20 font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email-input" className="block text-[10px] font-syne uppercase tracking-wider text-cream/75 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-warm-gold/40" />
                      <input
                        id="email-input"
                        type="email"
                        required
                        placeholder="e.g. awosika@studio.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-obsidian border border-cream/10 text-cream text-xs rounded-sm pl-10 pr-4 py-3 focus:border-warm-gold focus:outline-none placeholder-cream/20 font-sans"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="phone-input" className="block text-[10px] font-syne uppercase tracking-wider text-cream/75 mb-1.5">
                    Contact Phone Number (with code)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-warm-gold/40" />
                    <input
                      id="phone-input"
                      type="tel"
                      required
                      placeholder="e.g. +234 803 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-obsidian border border-cream/10 text-cream text-xs rounded-sm pl-10 pr-4 py-3 focus:border-warm-gold focus:outline-none placeholder-cream/20 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label htmlFor="style-select" className="block text-[10px] font-syne uppercase tracking-wider text-cream/75 mb-1.5">
                      Selected Base Silhouette
                    </label>
                    <select
                      id="style-select"
                      value={garmentStyle}
                      onChange={(e) => setGarmentStyle(e.target.value)}
                      className="w-full bg-obsidian border border-cream/10 text-cream text-xs rounded-sm p-3 focus:border-warm-gold focus:outline-none font-serif"
                    >
                      {garmentsData.map(g => (
                        <option key={g.id} value={g.name}>{g.name} ({g.drapeWeight})</option>
                      ))}
                      <option value="Atelier Bespoke Suit (Custom)">Atelier Bespoke Suit (Custom)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="fabric-select" className="block text-[10px] font-syne uppercase tracking-wider text-cream/75 mb-1.5">
                      Fabric Specimen Base
                    </label>
                    <select
                      id="fabric-select"
                      value={selectedFabricId}
                      onChange={(e) => setSelectedFabricId(e.target.value)}
                      className="w-full bg-obsidian border border-cream/10 text-cream text-xs rounded-sm p-3 focus:border-warm-gold focus:outline-none font-serif"
                    >
                      {fabricSwatches.map(f => (
                        <option key={f.id} value={f.id}>{f.name} ({f.weight})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    id="step1-next-btn"
                    type="button"
                    onClick={handleNextStep}
                    className="py-3 px-6 bg-warm-gold text-obsidian font-syne uppercase tracking-widest text-xs font-bold transition-all duration-300 flex items-center justify-center space-x-2 rounded-sm"
                  >
                    <span>Proceed to Dimensions</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* STEP 2: Custom Parameters & Initial Measurements */
              <div className="space-y-5">
                <span className="text-[10px] font-syne uppercase tracking-[0.2em] text-bronze block">
                  Studio Schedule & Fittings Options
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date-input" className="block text-[10px] font-syne uppercase tracking-wider text-cream/75 mb-1.5">
                      Target Appointment Date
                    </label>
                    <input
                      id="date-input"
                      type="date"
                      required
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full bg-obsidian border border-cream/10 text-cream text-xs rounded-sm p-3 focus:border-warm-gold focus:outline-none font-sans"
                    />
                  </div>

                  <div>
                    <label htmlFor="time-input" className="block text-[10px] font-syne uppercase tracking-wider text-cream/75 mb-1.5">
                      Studio Time Slot
                    </label>
                    <select
                      id="time-input"
                      required
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full bg-obsidian border border-cream/10 text-cream text-xs rounded-sm p-3 focus:border-warm-gold focus:outline-none font-sans"
                    >
                      <option value="">Select slot...</option>
                      <option value="10:00 AM">10:00 AM (Morning Session)</option>
                      <option value="12:00 PM">12:00 PM (Noon Session)</option>
                      <option value="02:30 PM">02:30 PM (Midday Session)</option>
                      <option value="04:00 PM">04:00 PM (Afternoon Session)</option>
                      <option value="06:00 PM">06:00 PM (Vesper Studio Twilight)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-syne uppercase tracking-wider text-cream/75 mb-1.5">
                    Fitting Architecture Model
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "canvas-basted", label: "Canvas Basted", desc: "Classic skeletal draft" },
                      { id: "standard-bespoke", label: "Standard Atelier", desc: "2-fitting finish" },
                      { id: "digital-measure", label: "Studio Digital", desc: "Camera alignment" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        id={`fitting-model-${t.id}`}
                        onClick={() => setFittingType(t.id as any)}
                        className={`p-3 border rounded-sm text-left transition-all focus:outline-none ${
                          fittingType === t.id
                            ? "border-warm-gold bg-warm-gold/10 text-warm-gold"
                            : "border-cream/10 bg-obsidian/40 hover:border-cream/20 text-cream/60"
                        }`}
                      >
                        <span className="font-serif text-xs font-semibold block">{t.label}</span>
                        <span className="text-[9px] text-cream/40 leading-tight block">{t.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggle Physical Measurements */}
                <div className="pt-2">
                  <button
                    type="button"
                    id="toggle-dimensions"
                    onClick={() => setHasMeasurements(!hasMeasurements)}
                    className="flex items-center space-x-2 text-xs text-warm-gold hover:text-cream transition-colors focus:outline-none"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>{hasMeasurements ? "✓ Hide Initial Dimensions" : "+ Provide Initial Body Coordinates"}</span>
                  </button>

                  {hasMeasurements && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 p-4 bg-obsidian/60 border border-cream/5 rounded-sm"
                    >
                      <div>
                        <label className="block text-[9px] font-syne uppercase tracking-wider text-cream/60 mb-1">Height (cm)</label>
                        <input
                          type="number"
                          placeholder="e.g. 182"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="w-full bg-charcoal border border-cream/10 text-cream text-[11px] rounded-sm p-2 focus:border-warm-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-syne uppercase tracking-wider text-cream/60 mb-1">Chest Circ. (cm)</label>
                        <input
                          type="number"
                          placeholder="e.g. 104"
                          value={chest}
                          onChange={(e) => setChest(e.target.value)}
                          className="w-full bg-charcoal border border-cream/10 text-cream text-[11px] rounded-sm p-2 focus:border-warm-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-syne uppercase tracking-wider text-cream/60 mb-1">Shoulders (cm)</label>
                        <input
                          type="number"
                          placeholder="e.g. 48"
                          value={shoulderWidth}
                          onChange={(e) => setShoulderWidth(e.target.value)}
                          className="w-full bg-charcoal border border-cream/10 text-cream text-[11px] rounded-sm p-2 focus:border-warm-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-syne uppercase tracking-wider text-cream/60 mb-1">Agbada Length (cm)</label>
                        <input
                          type="number"
                          placeholder="e.g. 135"
                          value={agbadaLength}
                          onChange={(e) => setAgbadaLength(e.target.value)}
                          className="w-full bg-charcoal border border-cream/10 text-cream text-[11px] rounded-sm p-2 focus:border-warm-gold focus:outline-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                <div>
                  <label htmlFor="notes-textarea" className="block text-[10px] font-syne uppercase tracking-wider text-cream/75 mb-1.5">
                    Special Tailoring Demands or Posture Notes (Optional)
                  </label>
                  <textarea
                    id="notes-textarea"
                    placeholder="Describe slouch tendencies, specific ceremony dates, preferred heavy shoulder pads..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-obsidian border border-cream/10 text-cream text-xs rounded-sm p-3 focus:border-warm-gold focus:outline-none placeholder-cream/20 font-sans"
                  />
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    id="back-step1-btn"
                    type="button"
                    onClick={() => setActiveFormStep(1)}
                    className="text-xs text-cream/60 hover:text-cream transition-colors uppercase font-syne tracking-widest focus:outline-none"
                  >
                    Back to Profile
                  </button>
                  <button
                    id="submit-booking-btn"
                    type="submit"
                    className="py-3 px-6 bg-warm-gold text-obsidian font-syne uppercase tracking-widest text-xs font-bold transition-all duration-300 flex items-center justify-center space-x-2 rounded-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm Fitting Pass</span>
                  </button>
                </div>
              </div>
            )}

          </form>

        </div>

        {/* Right Info Panel: Lagos & London Atelier coordinates (5 columns) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#111111] to-[#0A0A0A] border border-warm-gold/15 p-6 sm:p-8 rounded-sm space-y-6">
          <div className="space-y-4">
            <span className="text-[10px] font-syne uppercase tracking-[0.25em] text-bronze block">
              Atelier Coordinates
            </span>

            <div className="p-4 bg-obsidian/60 border border-cream/5 rounded-sm">
              <span className="text-[10px] text-warm-gold uppercase font-syne tracking-wider block mb-1">
                Lagos Flagship Studio
              </span>
              <p className="text-xs text-cream font-serif font-medium leading-relaxed">
                42 Victoria Island Boulevard, Annex Suite C<br />
                Lagos, Nigeria
              </p>
              <span className="text-[9px] font-mono text-cream/40 block mt-2">
                Coordinates: 6.4281° N, 3.4219° E &bull; Mon-Sat 09:00 - 19:00
              </span>
            </div>

            <div className="p-4 bg-obsidian/60 border border-cream/5 rounded-sm">
              <span className="text-[10px] text-warm-gold uppercase font-syne tracking-wider block mb-1">
                London Mayfair Salon
              </span>
              <p className="text-xs text-cream font-serif font-medium leading-relaxed">
                18 Savile Row, First Floor Studio<br />
                London, W1S 3PW, United Kingdom
              </p>
              <span className="text-[9px] font-mono text-cream/40 block mt-2">
                Coordinates: 51.5113° N, 0.1401° W &bull; By Appointment Only
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-cream/5">
            <h4 className="font-syne text-[10px] tracking-widest text-bronze uppercase mb-2">
              Basted Fitting Commitment
            </h4>
            <p className="text-xs text-cream/65 leading-relaxed font-sans">
              Every basted fitting is basted manually in our Lagos and London workshop. Our bespoke canvas is structured using organic animal hairs and linen to retain its memory and posture indefinitely. Fitting sessions are overseen by our lead cutters.
            </p>
          </div>

          <div className="p-4 bg-warm-gold/5 border border-warm-gold/10 rounded-sm">
            <span className="font-serif text-xs text-warm-gold block mb-1">
              Need a Private Digital Stream?
            </span>
            <p className="text-[11px] text-cream/70 leading-normal font-sans">
              For global clients, we facilitate basted fittings via secure dual-studio high-definition live feeds. Select <strong>Studio Digital Measure</strong> during scheduling.
            </p>
          </div>

        </div>

      </div>

      {/* Local Booked Consultations: Interactive Fitting Passes section */}
      <div className="mt-16 border-t border-warm-gold/15 pt-16">
        <div className="mb-8">
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-cream mb-1 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-warm-gold" />
            <span>Active fitting passes</span>
          </h3>
          <p className="text-xs text-cream/50 uppercase font-mono tracking-wider">
            Your registered studio consults & biometric basted fittings ledger
          </p>
        </div>

        {consultations.length === 0 ? (
          <div className="text-center py-12 bg-charcoal/20 border border-cream/5 rounded-sm">
            <p className="text-xs font-mono text-cream/30 uppercase tracking-widest">
              No active fitting passes found in local storage vault.
            </p>
            <p className="text-[11px] text-cream/40 mt-1">
              Your scheduled canvas consultations will populate here in high-fidelity pass templates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {consultations.map((consult) => {
                return (
                  <motion.div
                    key={consult.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#151515] border border-warm-gold/20 p-6 rounded-sm relative overflow-hidden group flex flex-col justify-between"
                  >
                    {/* Top ticket strip styling */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-bronze via-warm-gold to-bronze" />
                    
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="font-mono text-[9px] text-warm-gold tracking-[0.2em] uppercase block">
                            Atelier Fit Certificate
                          </span>
                          <h4 className="font-serif text-lg font-bold text-cream mt-1">
                            {consult.fullName}
                          </h4>
                          <span className="text-[10px] text-cream/50 font-mono">
                            {consult.email} &bull; {consult.phone}
                          </span>
                        </div>
                        <span className="px-2 py-1 text-[8px] font-mono uppercase bg-green-500/10 text-green-400 border border-green-500/25 rounded-sm">
                          {consult.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-cream/5 my-4">
                        <div>
                          <span className="text-[9px] font-syne text-bronze uppercase tracking-wider block">
                            Silhouette
                          </span>
                          <span className="text-xs text-cream font-serif font-medium">
                            {consult.garmentStyle}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-syne text-bronze uppercase tracking-wider block">
                            Fitting Type
                          </span>
                          <span className="text-xs text-cream font-mono capitalize">
                            {consult.fittingType.replace("-", " ")}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-syne text-bronze uppercase tracking-wider block">
                            Studio Time Slot
                          </span>
                          <span className="text-xs text-cream font-mono">
                            {consult.appointmentDate} at {consult.appointmentTime}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-syne text-bronze uppercase tracking-wider block">
                            Loom Fabric
                          </span>
                          <span className="text-xs text-cream font-mono">
                            {fabricSwatches.find(f => f.id === consult.selectedFabricId)?.name || consult.selectedFabricId}
                          </span>
                        </div>
                      </div>

                      {/* Display measurements if provided */}
                      {consult.measurements && (
                        <div className="mb-4 bg-obsidian/50 p-2.5 rounded-sm border border-cream/5">
                          <span className="text-[8px] font-mono text-bronze uppercase tracking-wider block mb-1">
                            Biometric Dimensions basted:
                          </span>
                          <div className="grid grid-cols-4 gap-2 text-center">
                            <div className="text-[9px]">
                              <span className="text-cream/50 block">H</span>
                              <span className="text-cream font-mono font-bold">{consult.measurements.height}cm</span>
                            </div>
                            <div className="text-[9px]">
                              <span className="text-cream/50 block">C</span>
                              <span className="text-cream font-mono font-bold">{consult.measurements.chest}cm</span>
                            </div>
                            <div className="text-[9px]">
                              <span className="text-cream/50 block">S</span>
                              <span className="text-cream font-mono font-bold">{consult.measurements.shoulderWidth}cm</span>
                            </div>
                            <div className="text-[9px]">
                              <span className="text-cream/50 block">L</span>
                              <span className="text-cream font-mono font-bold">{consult.measurements.agbadaLength}cm</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {consult.notes && (
                        <p className="text-[10px] text-cream/70 italic leading-snug bg-obsidian/40 p-2.5 rounded-sm border border-cream/5 mb-4 font-sans">
                          &ldquo;{consult.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Bottom strip: QR Code pass & Cancel action */}
                    <div className="flex items-center justify-between pt-2 border-t border-cream/5 mt-4">
                      <div className="flex items-center space-x-2.5">
                        <QrCode className="w-10 h-10 text-cream/60 p-1 bg-white rounded-sm shrink-0" />
                        <div>
                          <span className="font-mono text-[8px] text-cream/40 block">PASS ID</span>
                          <span className="font-mono text-[9px] text-warm-gold uppercase tracking-wider font-semibold">
                            {consult.id}
                          </span>
                        </div>
                      </div>

                      <button
                        id={`cancel-pass-${consult.id}`}
                        onClick={() => handleCancelBooking(consult.id)}
                        className="p-2 border border-red-500/10 hover:border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-sm transition-all focus:outline-none flex items-center space-x-1.5 text-xs font-mono"
                        title="Cancel basted fitting consultation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Revoke Pass</span>
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

    </section>
  );
}
