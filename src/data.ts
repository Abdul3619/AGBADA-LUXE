import { Garment, FabricSwatch, FittingStep, LookbookItem } from "./types";

// High-end copy package text for the Brand Philosophy
export const brandCopy = {
  editorialIntro: {
    title: "AGBADA LUXE",
    subtitle: "Spring / Summer Lookbook",
    text: "A study in architectural posture and gravity. Our Spring/Summer collection represents a definitive fusion: the uncompromising heritage of traditional West African attire meets the rigorous drape of Savile Row. Crafted in the heart of Lagos and London, each garment honors the historic weight of hand-woven Aso-Oke, modernizing its structured geometry with contemporary minimalist lines. This is not attire merely worn; it is heritage basted directly onto the silhouette of tomorrow."
  },
  philosophy: {
    title: "Biometric Architecture",
    subtitle: "The Canvas Basted Fitting",
    text: "At Agbada Luxe, we reject the superficial shortcuts of ready-made patterns. Bespoke tailoring is a form of biometric architecture, a dialogue between textile rigidity and organic anatomy. Every commission begins with a canvas-basted fitting—a skeletal prototype hand-basted with thick white cotton threads. This intermediate phase allows our master tailors to study how the Aso-Oke falls against your natural stance, refining the balance of shoulders and sleeves. By sculpting raw linen, wool, and heavy silk directly onto your physical coordinate, we construct a garment that possesses its own architectural gravity."
  }
};

export const garmentsData: Garment[] = [
  {
    id: "gilded-agbada",
    name: "The Gilded Agbada",
    subtitle: "Avant-Garde Architectural Drape",
    description: "An avant-garde masterpiece made from hand-woven indigo Aso-Oke, featuring structural modern geometric gold embroidery and a heavy, elegant drape.",
    longDescription: "The absolute centerpiece of the collection, The Gilded Agbada commands attention through deliberate, structural scale. Woven from genuine indigo Aso-Oke—a textile carrying generations of West African lineage—and basted with gold metallic threads that capture light with every stride. The tailoring channels the precision of Balmain and Savile Row, maintaining the grand silhouette of Yoruba heritage while narrowing the shoulder seam to draft a cleaner, modern line. Perfect for momentous occasions where heritage and high fashion converge.",
    image: "/src/assets/images/agbada_hero_1782809707062.jpg",
    heritage: "Woven by Yoruba master craftsmen over 120 continuous hours on horizontal looms.",
    handcraftHours: 180,
    drapeWeight: "Heavyweight 720gsm",
    materials: ["Hand-woven Indigo Aso-Oke", "Lurex Gold Metallic Threads", "Pure Silk Linings"],
    tailoringMethod: "Bespoke Three-Stage Canvas Basted"
  },
  {
    id: "obsidian-suit",
    name: "The Obsidian Tuxedo",
    subtitle: "Bespoke Structural Modernism",
    description: "A premium double-breasted charcoal-black tuxedo jacket with meticulous hand-sewn gold lapel stitching and exceptional wool-silk drape.",
    longDescription: "A modern classic embodying quiet power. The Obsidian Tuxedo jacket utilizes an ultra-luxurious blend of raw West African silk and fine British merino wool, resulting in a fabric with a deep, subtle micro-texture. Fitted on a sleek matte-black mannequin before being custom basted to the individual, the double-breasted cut features a high-gorge shawl collar with custom hand-sewn gold lapel stitching. A masterclass in cross-continental tailoring that offers impeccable posture and a flawless, razor-sharp drape.",
    image: "/src/assets/images/bespoke_suit_1782809718913.jpg",
    heritage: "Hand-finished in London with wool sourced from Yorkshire and silk from Nigeria.",
    handcraftHours: 110,
    drapeWeight: "Medium-Heavy 420gsm",
    materials: ["Merino Wool", "Organic Nigerian Raw Silk", "Gold-spun Stitching Cord"],
    tailoringMethod: "Savile Row Basted Fitting"
  },
  {
    id: "ivory-silhouette",
    name: "The Ivory Silhouette",
    subtitle: "Traditional Yoruba Haute Couture",
    description: "A breathtaking couple's ensemble in raw ivory silk and textured cream brocade, heavily hand-beaded with micro-pearls and bronze-gold threads.",
    longDescription: "A celebration of romance and ceremonial weight. The Ivory Silhouette utilizes a breathtaking blend of raw ivory silk and custom textured cream brocade. Our artisans manually bead the surface with geometric patterns using glass micro-pearls and delicate bronze-gold metallic threads. Every component is hand-mounted onto canvas to distribute the weight evenly, creating an immaculate fit that behaves like sculpture in motion. A stunning testament to traditional West African wedding couture refined for the global stage.",
    image: "/src/assets/images/traditional_couture_1782809732703.jpg",
    heritage: "Embellished entirely by hand over three weeks at our Lagos workshop.",
    handcraftHours: 240,
    drapeWeight: "Heavyweight 850gsm (inclusive of beadwork)",
    materials: ["Raw Ivory Silk", "Premium Cream Brocade", "Glass Micro-Pearls", "Bronze Metallic Yarn"],
    tailoringMethod: "Double-Canvas Atelier Couture"
  }
];

export const fabricSwatches: FabricSwatch[] = [
  {
    id: "indigo-aso-oke",
    name: "Indigo Aso-Oke Weave",
    origin: "Iseyin, Nigeria",
    weight: "720 gsm",
    weaveTimeDays: 14,
    description: "Hand-dyed indigo yarn tightly woven on traditional narrow looms. Highly structured with a rigid, architectural drape that softens beautifully with age.",
    colorHex: "#1a2238",
    texturePattern: "woven"
  },
  {
    id: "ivory-raw-silk",
    name: "Raw West African Ivory Silk",
    origin: "Oshogbo, Nigeria",
    weight: "380 gsm",
    weaveTimeDays: 8,
    description: "Organic silk processed with natural luster. Possesses a rich slub texture that catches ambient studio lighting with warm, subtle bronze undertones.",
    colorHex: "#f5f2eb",
    texturePattern: "raw"
  },
  {
    id: "charcoal-merino-silk",
    name: "Merino-Silk Tuxedo Blend",
    origin: "Yorkshire & Lagos",
    weight: "420 gsm",
    weaveTimeDays: 5,
    description: "A custom blend of premium British merino wool and Nigerian raw silk. Highly wrinkle-resistant with a crisp hand and elegant, matte obsidian texture.",
    colorHex: "#111111",
    texturePattern: "herringbone"
  },
  {
    id: "gilded-brocade",
    name: "Textured Cream Brocade",
    origin: "Lyon & Lagos Partnership",
    weight: "510 gsm",
    weaveTimeDays: 10,
    description: "A heavy, geometric-patterned jacquard brocade interwoven with fine gold-bronze metallic filaments for a classic royal Nigerian aesthetic.",
    colorHex: "#dcd1bc",
    texturePattern: "geometric"
  }
];

export const fittingSteps: FittingStep[] = [
  {
    number: "01",
    title: "Anatomical Consult",
    description: "We record thirty-five precise body metrics, analyzing your resting shoulder slope, stance, and gait to lay down the garment's geometric blueprint.",
    duration: "45 Minutes",
    metric: "35",
    metricLabel: "Body Coordinates"
  },
  {
    number: "02",
    title: "The Basted Skeleton",
    description: "A preliminary prototype is constructed from heavy raw canvas, basted together with temporary white cotton thread. There are no pockets, linings, or lapels yet.",
    duration: "3 Weeks",
    metric: "1st",
    metricLabel: "Canvas Stage"
  },
  {
    number: "03",
    title: "Chalk & Shear Sculpting",
    description: "During the active fitting, we drape the basted skeleton on you. We slash, pin, and chalk the canvas, adjusting the fabric's behavioral tension in real-time.",
    duration: "1 Hour",
    metric: "0.5mm",
    metricLabel: "Precision Tolerance"
  },
  {
    number: "04",
    title: "Hand-Weave Inception",
    description: "Your adjustments are transferred to paper patterns, and your final selected fabric (such as master-woven Aso-Oke) is hand-cut and assembled by a single tailor.",
    duration: "6 Weeks",
    metric: "180+",
    metricLabel: "Artisan Hours"
  }
];

export const lookbookItems: LookbookItem[] = [
  {
    id: "lb-01",
    title: "The Sovereign Crown Agbada",
    collection: "Agbada Luxe",
    garmentType: "Traditional",
    editorialTheme: "Sovereign",
    image: "/src/assets/images/agbada_hero_1782809707062.jpg",
    description: "An architectural Agbada crafted from heavy hand-spun silk-blend Aso-Oke. Features intricate tone-on-tone crown embroidery, hand-beaded geometric necklines, and structured, wide-sweeping sleeves designed for a commanding physical presence.",
    materials: ["Hand-spun Silk Aso-Oke", "Metallic Gold Thread", "Cotton Brocade Lining"],
    credits: "Artistic Direction: Abdulwahab Abdullah / Tailor: Master F. Adebayo",
    year: "2026"
  },
  {
    id: "lb-02",
    title: "The Obsidian Double-Breasted Tuxedo",
    collection: "SS24",
    garmentType: "Suits",
    editorialTheme: "Minimalist",
    image: "/src/assets/images/bespoke_suit_1782809718913.jpg",
    description: "A masterclass in modern European-African tailoring. Made of ultra-fine worsted wool and high-drape silk satin lapels, displaying an elongated silhouette with clean shoulders, soft unstructured sleeves, and hidden inner geometric pockets.",
    materials: ["Worsted Kid Mohair Wool", "Raw Silk Satin", "Bespoke Horn Buttons"],
    credits: "Lead Tailor: H. Savile / Creative Lead: Abdulwahab Abdullah",
    year: "2026"
  },
  {
    id: "lb-03",
    title: "The Imperial Ivory Bridal Set",
    collection: "Agbada Luxe",
    garmentType: "Bridal",
    editorialTheme: "Traditional",
    image: "/src/assets/images/traditional_couture_1782809732703.jpg",
    description: "A breathtaking bridal set capturing high-fashion West African majesty. Elaborate hand-woven silk lace patterns layered with thousands of hand-embroidered pearls, paired with a matching structured wrapper and an elegant crown-like Gele drapery.",
    materials: ["Hand-woven Silk Lace", "Natural Seed Pearls", "Raw Dupioni Silk"],
    credits: "Embroidery: House of Lagos / Creative Lead: Abdulwahab Abdullah",
    year: "2026"
  },
  {
    id: "lb-04",
    title: "The Grand Indigo Draped Coat",
    collection: "SS24",
    garmentType: "Outerwear",
    editorialTheme: "Avant-Garde",
    image: "/src/assets/images/agbada_hero_1782809707062.jpg",
    description: "A revolutionary cross-cultural outer garment inspired by the fluid volume of the classic Agbada and the utility of the trench coat. Features custom deep-indigo organic dye, asymmetric storm flaps, and adjustable side cinch cords.",
    materials: ["Organic Indigo-Dyed Cotton", "Heavy Satin Lining", "Matte Nickel Hardware"],
    credits: "Dye Artisan: K. Alaro / Tailor: Master F. Adebayo",
    year: "2026"
  },
  {
    id: "lb-05",
    title: "The Charcoal Silk Atelier Suit",
    collection: "Heritage Noir",
    garmentType: "Suits",
    editorialTheme: "Minimalist",
    image: "/src/assets/images/bespoke_suit_1782809718913.jpg",
    description: "A flawless charcoal-gray lounge suit featuring a relaxed luxury drape. The jacket has seamless hand-padded shoulders and a single button closure, highlighting the raw slub texture of premium silk-wool blend fibers.",
    materials: ["Charcoal Silk-Wool Blend", "Premium Cupro Lining", "Mother of Pearl Buttons"],
    credits: "Tailor: H. Savile / Lead Designer: Abdulwahab Abdullah",
    year: "2026"
  },
  {
    id: "lb-06",
    title: "The Royal Gele & Brocade Ensemble",
    collection: "Heritage Noir",
    garmentType: "Bridal",
    editorialTheme: "Traditional",
    image: "/src/assets/images/traditional_couture_1782809732703.jpg",
    description: "A heritage ensemble crafted in deep royal obsidian and gold thread work. Designed for prestigious traditional affairs, comprising a custom corseted top, structured heavy-fold wrapper, and custom geometric hand-beading along the neckline.",
    materials: ["Obsidian Damask Brocade", "Pure Gold Thread", "Genuine Coral Bead Inlays"],
    credits: "Artistic Direction: House of Lagos / Tailor: Master F. Adebayo",
    year: "2026"
  },
  {
    id: "lb-07",
    title: "The Vanguard Avant-Garde Agbada",
    collection: "Heritage Noir",
    garmentType: "Traditional",
    editorialTheme: "Avant-Garde",
    image: "/src/assets/images/agbada_hero_1782809707062.jpg",
    description: "Pushing the boundaries of West African menswear. This avant-garde creation integrates heavy structural panels into the classic Agbada silhouette, using contrasting matte and high-shine black fibers to create an optical geometric illusion.",
    materials: ["Matte Hand-spun Cotton", "Lustrous Tech-Silk Yarn", "Laser-Cut Leather Accents"],
    credits: "Lead Tailor: Master F. Adebayo / Technical Design: Abdulwahab Abdullah",
    year: "2026"
  },
  {
    id: "lb-08",
    title: "The Midnight Wool-Silk Wrap",
    collection: "SS24",
    garmentType: "Outerwear",
    editorialTheme: "Minimalist",
    image: "/src/assets/images/bespoke_suit_1782809718913.jpg",
    description: "A lightweight, high-drape outerwear wrap that bridges the gap between a modern cape and a traditional shawl. Features an elegant draped collar, clean raw edge finishes, and a heavy-gauge knitted silk sash.",
    materials: ["Midnight Blue Wool-Silk Crepe", "Ribbed Hand-knit Silk Sash"],
    credits: "Creative Direction: Abdulwahab Abdullah / Tailor: H. Savile",
    year: "2026"
  }
];
