export interface Garment {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  longDescription: string;
  image: string;
  heritage: string;
  handcraftHours: number;
  drapeWeight: string; // e.g. "Heavy 640gsm"
  materials: string[];
  tailoringMethod: string;
}

export interface FabricSwatch {
  id: string;
  name: string;
  origin: string;
  weight: string;
  weaveTimeDays: number;
  description: string;
  colorHex: string;
  texturePattern: "herringbone" | "raw" | "geometric" | "woven";
}

export interface Consultation {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  garmentStyle: string;
  selectedFabricId: string;
  fittingType: "canvas-basted" | "standard-bespoke" | "digital-measure";
  notes?: string;
  status: "pending" | "confirmed";
  appointmentDate: string;
  appointmentTime: string;
  measurements?: {
    height: string;
    chest: string;
    shoulderWidth: string;
    agbadaLength?: string;
  };
}

export interface FittingStep {
  number: string;
  title: string;
  description: string;
  duration: string;
  metric: string;
  metricLabel: string;
}

export interface LookbookItem {
  id: string;
  title: string;
  collection: "Agbada Luxe" | "SS24" | "Heritage Noir";
  garmentType: "Suits" | "Bridal" | "Traditional" | "Outerwear";
  editorialTheme: "Avant-Garde" | "Minimalist" | "Traditional" | "Sovereign";
  image: string;
  description: string;
  materials: string[];
  credits?: string;
  year: string;
}

