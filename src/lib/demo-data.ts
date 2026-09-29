/**
 * Hardcoded demo data — used when Supabase isn't configured yet.
 * Once the DB is seeded, the frontend will read from Supabase instead.
 */
import type { Product, Blog, Solution, GalleryImage } from "./database.types";

// ── Products ─────────────────────────────────────────────────
export const demoProducts: Product[] = [
  // ─── 1. RESTROOM CUBICLES ───
  {
    id: "prod-cubicle-delight-001",
    slug: "cubicle-delight",
    title: "Delight Restroom Cubicle System",
    subtitle: "Standard Overhead-Braced Commercial Cubicle System",
    description: "Our most sought-after commercial restroom cubicle system engineered with 12mm/18mm solid compact laminate. Features adjustable supporting legs and an overhead continuous headrail for maximum structural stability in high-traffic facilities.",
    bottom_description: "Meets international fire retardant Class 1 and anti-microbial standards for public washroom environments.",
    category: "Restroom Cubicles",
    image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    additional_images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "12mm / 18mm Solid Compact Phenolic Laminate",
      "Adjustable Grade 304 SS Supporting Legs (100–150mm ground clearance)",
      "Continuous Top Stabilizer Box Extrusion Headrail",
      "Self-Closing Gravity Hinges with Nylon Cam Action",
      "Occupancy Indicator Lock with Emergency Outside Coin Release"
    ],
    specifications: [
      { label: "Standard Height", value: "1980 mm / 2000 mm (including 150mm floor gap)" },
      { label: "Standard Depth", value: "1500 mm – 1800 mm" },
      { label: "Door Width", value: "600 mm (Standard) / 900 mm (Accessible/ADA)" },
      { label: "Board Thickness", value: "12mm / 18mm Solid Compact Phenolic Laminate" },
      { label: "Fire Rating", value: "Class 1 / BS 476 Part 7" },
      { label: "Hardware Grade", value: "SS 304 / Heavy Duty Polyamide Nylon" }
    ],
    applications: [
      "Corporate IT Parks & Offices",
      "Shopping Malls & Retail Hubs",
      "Airports & Transit Centers",
      "Healthcare & Educational Campuses"
    ],
    is_featured: true,
    sort_order: 1,
    published: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "prod-cubicle-skylight-002",
    slug: "cubicle-skylight",
    title: "Skylight Restroom Cubicle System",
    subtitle: "High-Headroom Minimalist Architectural Cubicle",
    description: "Minimalist high-headroom commercial cubicle engineered with 12mm/18mm solid compact laminate and concealed hardware junctions for a sleek, contemporary aesthetic.",
    category: "Restroom Cubicles",
    image_url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "High-Headroom Architectural Visual Profile",
      "Concealed Pivot Self-Closing Hinges",
      "Architectural Turn-Bolt Indicator Lock",
      "12mm/18mm Solid Phenolic Compact Grade Core"
    ],
    specifications: [
      { label: "Standard Height", value: "2000 mm (including 150mm floor gap)" },
      { label: "Standard Depth", value: "1500 mm – 1800 mm" },
      { label: "Door Width", value: "600 mm (Standard) / 900 mm (ADA)" },
      { label: "Hardware", value: "Satin Finish SS 304 / Black Anodized" }
    ],
    applications: [
      "Grade-A Commercial Offices",
      "Modern Co-working Spaces",
      "Fine Dining & Hospitality"
    ],
    is_featured: true,
    sort_order: 2,
    published: true,
    created_at: "2024-01-02T00:00:00.000Z",
    updated_at: "2024-01-02T00:00:00.000Z"
  },
  {
    id: "prod-cubicle-platina-003",
    slug: "cubicle-platina",
    title: "Platina Flagship Restroom Cubicle",
    subtitle: "Heavy-Duty Box Profile Commercial System",
    description: "Flagship heavy-duty cubicle system with robust aluminum box profiles, engineered for corporate airports, stadiums, and high-abuse commercial restrooms.",
    category: "Restroom Cubicles",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Heavy Aluminum Box Profile Reinforcement",
      "Platina Self-Closing Gravity Hinges",
      "Double-Sided Ergonomic Pull Handle",
      "Engineered for High-Abuse Stadiums & Terminals"
    ],
    specifications: [
      { label: "Standard Height", value: "1980 mm / 2000 mm" },
      { label: "Standard Depth", value: "1500 mm – 1800 mm" },
      { label: "Structure", value: "Overhead Box Rail Extrusion" }
    ],
    applications: ["International Airports", "Sports Stadiums", "Convention Centers"],
    is_featured: false,
    sort_order: 3,
    published: true,
    created_at: "2024-01-03T00:00:00.000Z",
    updated_at: "2024-01-03T00:00:00.000Z"
  },
  {
    id: "prod-cubicle-gusto-004",
    slug: "cubicle-gusto",
    title: "Gusto Vandal-Resistant Cubicle",
    subtitle: "High-Abuse Vandal-Resistant Commercial System",
    description: "High-abuse, vandal-resistant commercial restroom partition system designed for transportation terminals and industrial plants.",
    category: "Restroom Cubicles",
    image_url: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Continuous Vandal-Resistant Security Hinges",
      "Coin Emergency Release Indicator Lock",
      "Solid Cast Stainless Steel Coat Hook & Buffer",
      "Reinforced Top Headrail Channel"
    ],
    specifications: [
      { label: "Standard Height", value: "1980 mm (including 150mm gap)" },
      { label: "Board Core", value: "12mm High Density Compact Resin" }
    ],
    applications: ["Railway Stations", "Industrial Plants", "Public Facilities"],
    is_featured: false,
    sort_order: 4,
    published: true,
    created_at: "2024-01-04T00:00:00.000Z",
    updated_at: "2024-01-04T00:00:00.000Z"
  },
  {
    id: "prod-cubicle-skywings-005",
    slug: "cubicle-skywings",
    title: "SkyWings Restroom Cubicle",
    subtitle: "Signature Aerofoil Wing Top Profile Cubicle",
    description: "Signature aerofoil top profile cubicle with aerodynamic upper rail for upscale malls, hotels, and luxury clubhouses.",
    category: "Restroom Cubicles",
    image_url: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Aerodynamic Aerofoil Wing Top Header",
      "Self-Closing Cam Action Gravity Hinges",
      "Architectural Indicator Lock & Handle",
      "Luxury Satin or Matte Black Hardware Finish"
    ],
    specifications: [
      { label: "Standard Height", value: "2000 mm" },
      { label: "Door Width", value: "600 mm / 900 mm" }
    ],
    applications: ["Luxury Hotels", "Premium Shopping Malls", "Golf Clubhouses"],
    is_featured: false,
    sort_order: 5,
    published: true,
    created_at: "2024-01-05T00:00:00.000Z",
    updated_at: "2024-01-05T00:00:00.000Z"
  },
  {
    id: "prod-cubicle-wallhung-006",
    slug: "cubicle-wall-hung",
    title: "Wall Hung Suspended Cubicle",
    subtitle: "Suspended Floor-Clearance Cubicle (Zero Floor Legs)",
    description: "Suspended cantilever design providing 100% unobstructed floor clearance for automated scrubbing and maximum washroom hygiene.",
    category: "Restroom Cubicles",
    image_url: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "100% Zero Floor Legs — Unobstructed Floor Sweep",
      "Heavy-Duty Structural Steel Wall Cantilever Anchors",
      "18mm Solid Compact Phenolic Laminate Panels",
      "Easy Automated Robot Cleaning Friendly"
    ],
    specifications: [
      { label: "Suspended Height", value: "1850 mm (200mm floor clearance)" },
      { label: "Thickness", value: "18mm Compact Grade" }
    ],
    applications: ["Cleanrooms", "Luxury Healthcare Suites", "High-Tech Headquarters"],
    is_featured: false,
    sort_order: 6,
    published: true,
    created_at: "2024-01-06T00:00:00.000Z",
    updated_at: "2024-01-06T00:00:00.000Z"
  },
  {
    id: "prod-cubicle-saffron-007",
    slug: "cubicle-saffron",
    title: "Saffron Contemporary Cubicle",
    subtitle: "Streamlined Contemporary Aesthetic System",
    description: "Streamlined contemporary cubicle system with refined edge chamfers and premium satin hardware.",
    category: "Restroom Cubicles",
    image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Precision Chamfered Edge Details",
      "Saffron Gravity Action Hinges",
      "Door Knob & Coat Hook with Buffer Stop",
      "Adjustable Ground Support Legs"
    ],
    specifications: [
      { label: "Standard Height", value: "1980 mm / 2000 mm" },
      { label: "Standard Depth", value: "1500 mm – 1800 mm" }
    ],
    applications: ["Boutique Offices", "Art Galleries", "Commercial Showrooms"],
    is_featured: false,
    sort_order: 7,
    published: true,
    created_at: "2024-01-07T00:00:00.000Z",
    updated_at: "2024-01-07T00:00:00.000Z"
  },
  {
    id: "prod-cubicle-splendor-008",
    slug: "cubicle-splendor",
    title: "Splendor Luxury Restroom Cubicle",
    subtitle: "5-Star Luxury Executive Lounge Cubicle",
    description: "Executive luxury cubicle system with full-height doors and concealed gap acoustic rebates for 5-star hotels and VIP lounges.",
    category: "Restroom Cubicles",
    image_url: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Full Height Luxury 2100mm Doors",
      "Concealed Acoustic Rebates for Maximum Privacy",
      "Machined Solid Brass / SS Pull Handles",
      "Luxury Soft-Closing Latches"
    ],
    specifications: [
      { label: "Standard Height", value: "2100 mm (Full Height Luxury Profile)" },
      { label: "Thickness", value: "18mm Solid Phenolic Laminate" }
    ],
    applications: ["5-Star Hotels", "VIP Airport Lounges", "Corporate Boardrooms"],
    is_featured: true,
    sort_order: 8,
    published: true,
    created_at: "2024-01-08T00:00:00.000Z",
    updated_at: "2024-01-08T00:00:00.000Z"
  },
  {
    id: "prod-cubicle-platinawave-009",
    slug: "cubicle-platina-wave",
    title: "Platina Wave Restroom Cubicle",
    subtitle: "Designer Wave-Top Variation of Platina Flagship",
    description: "Designer wave-top variation of Platina flagship with continuous wave profile and heavy-duty box extrusions.",
    category: "Restroom Cubicles",
    image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Wave Top Profile Architectural Header",
      "Heavy Box Extrusion Rigidity",
      "Double-Sided Door Pull Knob",
      "Adjustable Floor Legs (100–150mm)"
    ],
    specifications: [
      { label: "Standard Height", value: "1980 mm / 2000 mm" },
      { label: "Thickness", value: "12mm / 18mm Compact" }
    ],
    applications: ["Waterfront Developments", "Resorts", "Modern Transit Terminals"],
    is_featured: false,
    sort_order: 9,
    published: true,
    created_at: "2024-01-09T00:00:00.000Z",
    updated_at: "2024-01-09T00:00:00.000Z"
  },
  {
    id: "prod-hpl-classic-010",
    slug: "hpl-classic-restroom-cubicle",
    title: "Classic HPL Restroom Cubicle",
    subtitle: "Durable & Moisture-Resistant Commercial Washroom System",
    description: "Engineered with 12mm High-Pressure Compact Laminate (HPL) panels and grade 304 stainless steel hardware. Ideal for high-traffic corporate offices, airports, and malls.",
    category: "Restroom Cubicles",
    image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "12mm Solid Compact Grade Laminate",
      "100% Water, Moisture & Termite Proof",
      "Grade 304 Stainless Steel Hardware"
    ],
    specifications: [
      { label: "Board Thickness", value: "12mm Compact Laminate" },
      { label: "Hardware Grade", value: "SS 304 Satin Finish" }
    ],
    applications: ["Corporate IT Parks", "Shopping Malls", "Hospitals"],
    is_featured: false,
    sort_order: 10,
    published: true,
    created_at: "2024-01-10T00:00:00.000Z",
    updated_at: "2024-01-10T00:00:00.000Z"
  },
  {
    id: "prod-nylon-aerofit-011",
    slug: "aerofit-nylon-cubicle-system",
    title: "AeroFit Nylon Restroom Cubicle",
    subtitle: "High-Traffic Economy Washroom Solution",
    description: "Combines 12mm phenolic compact laminate with high-impact engineered polyamide nylon hardware. Vibrant color combinations and scratch-proof performance.",
    category: "Restroom Cubicles",
    image_url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Polyamide Nylon Color-Matched Hardware",
      "Rust and Corrosion Proof",
      "Cost-Effective for Educational & Public Facilities"
    ],
    specifications: [
      { label: "Board Thickness", value: "12mm Phenolic Compact" },
      { label: "Hardware Material", value: "Polyamide Grade 6 Nylon" }
    ],
    applications: ["Schools & Colleges", "Sports Complexes", "Factory Restrooms"],
    is_featured: false,
    sort_order: 11,
    published: true,
    created_at: "2024-01-11T00:00:00.000Z",
    updated_at: "2024-01-11T00:00:00.000Z"
  },

  // ─── 2. LOCKER SYSTEMS ───
  {
    id: "prod-locker-zshape-012",
    slug: "locker-z-shape",
    title: "Z-Shape Interlocking Dual Locker",
    subtitle: "Space-Optimized Dual Hanging Z-Locker Compartment",
    description: "Innovative Z-shaped interlocking door geometry allowing two users to hang full-length garments in the footprint of a single column.",
    category: "Lockers",
    image_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Interlocking Z-Shape Geometry for Full Garment Hanging",
      "Two Independent Lockable Storage Compartments per Column",
      "Master-Keyed Cam Lock with Dual Keys",
      "Air Ventilation Louver Grille & Coat Hook"
    ],
    specifications: [
      { label: "Standard Height", value: "1800 mm (plus 100mm plinth base)" },
      { label: "Compartment Size", value: "380mm W × 450mm D × 1800mm H" },
      { label: "Board Thickness", value: "12mm Solid Compact Phenolic Laminate" }
    ],
    applications: ["Fitness Centers & Gyms", "Sports Stadiums", "Corporate Locker Rooms"],
    is_featured: true,
    sort_order: 12,
    published: true,
    created_at: "2024-01-12T00:00:00.000Z",
    updated_at: "2024-01-12T00:00:00.000Z"
  },
  {
    id: "prod-locker-tier1-013",
    slug: "locker-tier-1",
    title: "Tier 1 Compact Laminate Locker",
    subtitle: "Single Compartment Full-Length Wardrobe Locker",
    description: "Full-height storage column equipped with top interior shelf and garment hanging rail for executive suites, golf clubs, and sports arenas.",
    category: "Lockers",
    image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Full-Length Single Door Wardrobe Compartment",
      "Interior Top Hat Shelf & SS Garment Hanging Rail",
      "Master-Keyed Cam Lock with 2 Keys",
      "Dual Top & Bottom Ventilation Louvers"
    ],
    specifications: [
      { label: "Standard Height", value: "1800 mm (plus 100mm plinth base)" },
      { label: "Compartment Size", value: "300mm W × 450mm D × 1800mm H" },
      { label: "Door Material", value: "12mm Phenolic Compact Core" }
    ],
    applications: ["Executive Country Clubs", "Hospital Staff Rooms", "Luxury Gyms"],
    is_featured: false,
    sort_order: 13,
    published: true,
    created_at: "2024-01-13T00:00:00.000Z",
    updated_at: "2024-01-13T00:00:00.000Z"
  },
  {
    id: "prod-locker-tier2-014",
    slug: "locker-tier-2",
    title: "Tier 2 Modular Storage Locker",
    subtitle: "Dual Compartment 2-Tier Stacked Storage Locker",
    description: "Standard commercial 2-compartment locker with balanced storage volume for gyms, athletic facilities, and offices.",
    category: "Lockers",
    image_url: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "2 Vertically Stacked Independent Locker Doors",
      "Heavy-Duty Concealed Pivot Hinges (2 pcs per tier)",
      "Anodized Aluminum Door Number Plates",
      "Built-In Interior Clothes Hook"
    ],
    specifications: [
      { label: "Standard Height", value: "1800 mm (plus 100mm plinth base)" },
      { label: "Compartment Size", value: "300mm W × 450mm D × 900mm H per tier" }
    ],
    applications: ["Corporate Workspaces", "University Athletic Facilities", "Spas"],
    is_featured: false,
    sort_order: 14,
    published: true,
    created_at: "2024-01-14T00:00:00.000Z",
    updated_at: "2024-01-14T00:00:00.000Z"
  },
  {
    id: "prod-locker-tier3-015",
    slug: "locker-tier-3",
    title: "Tier 3 Phenolic Locker System",
    subtitle: "Triple Compartment 3-Tier Storage Locker",
    description: "Medium-density 3-door locker column providing bag and personal storage for 3 users in active commercial spaces.",
    category: "Lockers",
    image_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "3 Stacked Doors per Column",
      "Master-Keyed Cam Lock with 2 Keys per tier",
      "Ventilation Louver Grilles on Each Door",
      "Plinth Leveler Base Legs"
    ],
    specifications: [
      { label: "Standard Height", value: "1800 mm (plus 100mm plinth)" },
      { label: "Compartment Size", value: "300mm W × 450mm D × 600mm H per tier" }
    ],
    applications: ["Fitness Centers", "Corporate Cafeterias", "Library Storage"],
    is_featured: false,
    sort_order: 15,
    published: true,
    created_at: "2024-01-15T00:00:00.000Z",
    updated_at: "2024-01-15T00:00:00.000Z"
  },
  {
    id: "prod-locker-tier4-016",
    slug: "locker-tier-4",
    title: "Tier 4 High-Density Locker",
    subtitle: "High-Density 4-Compartment Storage Unit",
    description: "High-density 4-compartment locker for employee shift rooms, logistics hubs, and retail staff lockers.",
    category: "Lockers",
    image_url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "4 Independent Compartments in Single Footprint",
      "Concealed Heavy-Duty Pivot Hinges",
      "User Key Cam Lock Mechanism",
      "100% Water & Termite Resistant Compact Core"
    ],
    specifications: [
      { label: "Standard Height", value: "1800 mm" },
      { label: "Compartment Size", value: "300mm W × 450mm D × 450mm H per tier" }
    ],
    applications: ["Logistics Centers", "Retail Staff Rooms", "Manufacturing Plants"],
    is_featured: false,
    sort_order: 16,
    published: true,
    created_at: "2024-01-16T00:00:00.000Z",
    updated_at: "2024-01-16T00:00:00.000Z"
  },
  {
    id: "prod-locker-tier5-017",
    slug: "locker-tier-5",
    title: "Tier 5 High-Capacity Locker",
    subtitle: "Compact 5-Door Vertical Compartment Locker",
    description: "5-tier locker for smartphone, tablet, and purse drop-boxes in cleanrooms and IT campuses.",
    category: "Lockers",
    image_url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "5 Compact Secure Compartments",
      "Anti-Tamper Cam Lock with Keys",
      "Numbered Nameplate Inserts",
      "Easy Multi-Unit Gang Mounting"
    ],
    specifications: [
      { label: "Standard Height", value: "1800 mm" },
      { label: "Compartment Size", value: "300mm W × 450mm D × 360mm H per tier" }
    ],
    applications: ["Cleanrooms", "IT Campus Mobile Check-In", "Examination Centers"],
    is_featured: false,
    sort_order: 17,
    published: true,
    created_at: "2024-01-17T00:00:00.000Z",
    updated_at: "2024-01-17T00:00:00.000Z"
  },
  {
    id: "prod-locker-tier6-018",
    slug: "locker-tier-6",
    title: "Tier 6 Multi-Compartment Locker",
    subtitle: "Ultra-High Density 6-Tier Valuables Deposit Locker",
    description: "Maximum density 6-compartment tower for keys, wallets, and portable electronics deposit.",
    category: "Lockers",
    image_url: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "6 Tier Micro-Storage Deposit Lockers",
      "Individual Cam Locks per Box",
      "High-Impact Resistant Phenolic Core",
      "Ideal for Valuables & Gadget Safekeeping"
    ],
    specifications: [
      { label: "Standard Height", value: "1800 mm" },
      { label: "Compartment Size", value: "300mm W × 450mm D × 300mm H per tier" }
    ],
    applications: ["Government Offices", "Banks & Vaults", "Fitness Check-In"],
    is_featured: false,
    sort_order: 18,
    published: true,
    created_at: "2024-01-18T00:00:00.000Z",
    updated_at: "2024-01-18T00:00:00.000Z"
  },

  // ─── 3. URINAL PARTITIONS ───
  {
    id: "prod-urinal-modela-019",
    slug: "urinal-model-a",
    title: "Urinal Partition Model A",
    subtitle: "Floor & Wall Supported Screen with Extra Supporting Leg",
    description: "Engineered for high-impact commercial restrooms. Model A incorporates an extra adjustable floor-supporting leg to anchor the outer bottom edge, eliminating cantilever wall stress.",
    category: "Urinal Partitions",
    image_url: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Extra Adjustable Floor Supporting Leg (100–150mm)",
      "Grade 304 Stainless Steel Corner L-Clamps (3 pcs)",
      "Full Radius Chamfered Moisture-Sealed Edges",
      "Eliminates Wall Strain in High-Traffic Restrooms"
    ],
    specifications: [
      { label: "Standard Height", value: "900 mm – 1200 mm (floor leg supported)" },
      { label: "Standard Depth", value: "450 mm – 500 mm W" },
      { label: "Board Thickness", value: "12mm Solid Compact Phenolic Laminate" }
    ],
    applications: ["Airports", "Shopping Malls", "Highway Service Plazas"],
    is_featured: true,
    sort_order: 19,
    published: true,
    created_at: "2024-01-19T00:00:00.000Z",
    updated_at: "2024-01-19T00:00:00.000Z"
  },
  {
    id: "prod-urinal-modelb-020",
    slug: "urinal-model-b",
    title: "Urinal Partition Model B",
    subtitle: "Cantilever Wall-Hung Floating Screen (Corner Clamp Mount)",
    description: "Clean floating cantilevered urinal partition anchored to the wall using three heavy-duty stainless steel corner brackets. Unobstructed floor facilitates swift sanitization.",
    category: "Urinal Partitions",
    image_url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Floating Cantilevered Design with 300mm Floor Clearance",
      "3 Grade 304 SS Heavy Duty Corner Brackets",
      "Unobstructed Floor Allows Rapid Mopping",
      "12mm Compact Board Core"
    ],
    specifications: [
      { label: "Standard Height", value: "900 mm" },
      { label: "Standard Depth", value: "450 mm W" },
      { label: "Mounting", value: "Wall-Hung Corner Brackets" }
    ],
    applications: ["Hotels & Restaurants", "Corporate Offices", "Cafes & Lounges"],
    is_featured: false,
    sort_order: 20,
    published: true,
    created_at: "2024-01-20T00:00:00.000Z",
    updated_at: "2024-01-20T00:00:00.000Z"
  },
  {
    id: "prod-urinal-modelc-021",
    slug: "urinal-model-c",
    title: "Urinal Partition Model C",
    subtitle: "Continuous Channel Wall-Mount Partition Screen",
    description: "Features a full-height continuous anodized aluminum U-channel wall profile that conceals fasteners and provides an ultra-clean architectural junction.",
    category: "Urinal Partitions",
    image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Full-Height Architectural Anodized Aluminum U-Channel",
      "Concealed Fastener Mounting Profile",
      "Superior Structural Rigidity",
      "Easy Clean Non-Porous Surface"
    ],
    specifications: [
      { label: "Standard Height", value: "900 mm – 1000 mm" },
      { label: "Standard Depth", value: "450 mm W" }
    ],
    applications: ["Luxury Theatres", "Corporate IT Headquarters", "Conference Halls"],
    is_featured: false,
    sort_order: 21,
    published: true,
    created_at: "2024-01-21T00:00:00.000Z",
    updated_at: "2024-01-21T00:00:00.000Z"
  },
  {
    id: "prod-urinal-modeld-022",
    slug: "urinal-model-d",
    title: "Urinal Partition Model D",
    subtitle: "Extended Full-Privacy Structural Screen",
    description: "An enlarged 1200mm high privacy shield designed for luxury executive washrooms. Reinforced with four structural corner brackets.",
    category: "Urinal Partitions",
    image_url: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Extended 1200mm Full-Privacy Vertical Screen",
      "4 Heavy-Duty Grade 304 Structural Brackets",
      "Anti-Graffiti & Chemical Resistant",
      "Ideal for Executive Commercial Suites"
    ],
    specifications: [
      { label: "Standard Height", value: "1200 mm High Privacy Profile" },
      { label: "Standard Depth", value: "500 mm – 600 mm W" }
    ],
    applications: ["Executive Boardrooms", "VIP Airport Lounges", "Five-Star Hotels"],
    is_featured: false,
    sort_order: 22,
    published: true,
    created_at: "2024-01-22T00:00:00.000Z",
    updated_at: "2024-01-22T00:00:00.000Z"
  },
  {
    id: "prod-urinal-modesty-023",
    slug: "designer-urinal-modesty-screen",
    title: "Urinal Modesty Screen Partition",
    subtitle: "Wall-Hung & Floor-Supported Privacy Screens",
    description: "Sleek compact laminate divider screens providing aesthetic hygiene and privacy for commercial washrooms.",
    category: "Urinal Partitions",
    image_url: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Full Radius Polished Chamfered Edges",
      "Heavy Duty Wall Clamping Brackets",
      "Waterproof & Chemical Resistant",
      "Compact Space-Saving Profile"
    ],
    specifications: [
      { label: "Dimensions", value: "900mm (H) x 450mm (W)" },
      { label: "Thickness", value: "12mm Compact Board" },
      { label: "Fixing", value: "SS 304 Heavy Duty Brackets" }
    ],
    applications: ["Hotels, Restaurants & Bars", "Multiplexes & Theatres", "Corporate Cafeterias"],
    is_featured: false,
    sort_order: 23,
    published: true,
    created_at: "2024-01-23T00:00:00.000Z",
    updated_at: "2024-01-23T00:00:00.000Z"
  },

  // ─── 4. KIDS TOILET ───
  {
    id: "prod-kids-summerfun-024",
    slug: "kids-summer-fun",
    title: "Summer Fun Kids Toilet Cubicle",
    subtitle: "Vibrant Child-Safety Cubicle with Anti-Pinch Clearance",
    description: "Engineered solid compact phenolic laminate cubicle partition designed specially for primary schools, kindergartens, and child care centers. Features low door height for supervisory vision, anti-finger trap rounded edges, and soft self-closing spring hinges.",
    category: "Kids Toilet",
    image_url: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Low Door Height (1200–1500mm) for Teacher Supervision",
      "Anti-Finger Trap Rounded Edges with Safety Gap Clearance",
      "Nylon Soft & Self-Closing Spring Hinges",
      "Emergency Outside Coin Release Turn Lock",
      "Vibrant Multi-Color Solid Compact Board"
    ],
    specifications: [
      { label: "Standard Height", value: "1200 mm – 1500 mm (Child-Friendly Height)" },
      { label: "Standard Depth", value: "1200 mm – 1500 mm" },
      { label: "Door Width", value: "500 mm – 600 mm" },
      { label: "Safety Feature", value: "Anti-Pinch Hinge Gap & Outside Coin Release" }
    ],
    applications: ["Kindergartens & Daycares", "Primary Schools", "Amusement & Theme Parks"],
    is_featured: true,
    sort_order: 24,
    published: true,
    created_at: "2024-01-24T00:00:00.000Z",
    updated_at: "2024-01-24T00:00:00.000Z"
  },
  {
    id: "prod-kids-azalea-025",
    slug: "kids-azalea",
    title: "Azalea Kids Restroom Cubicle",
    subtitle: "Playful Bowling-Pin Contoured Child Cubicle",
    description: "Custom-shaped decorative children restroom cubicle with bowling-pin inspired playful door profile, non-pinching safety gaps, and teacher-accessible exterior emergency release lock.",
    category: "Kids Toilet",
    image_url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Ergonomic Bowling-Pin Playful Door Contour",
      "Rounded Anti-Collision Corner Safety Profile",
      "Teacher-Accessible Exterior Emergency Turn Lock",
      "100% Waterproof & Germ-Resistant Phenolic Core"
    ],
    specifications: [
      { label: "Standard Height", value: "1200 mm – 1400 mm" },
      { label: "Standard Depth", value: "1200 mm – 1500 mm" },
      { label: "Door Width", value: "500 mm – 600 mm" },
      { label: "Safety Design", value: "Anti-Pinch Gap Clearance" }
    ],
    applications: ["Children Museums", "Play Areas & Playgrounds", "Pediatric Clinics"],
    is_featured: false,
    sort_order: 25,
    published: true,
    created_at: "2024-01-25T00:00:00.000Z",
    updated_at: "2024-01-25T00:00:00.000Z"
  },
  {
    id: "prod-kids-miniarc-026",
    slug: "cubicle-miniarc-kids",
    title: "Miniarc Arched-Door Kids Cubicle",
    subtitle: "Arched-Door Architectural Cubicle for Nursery Schools",
    description: "Arched-door partition system with visual teacher supervision headroom for preschools and kindergartens.",
    category: "Kids Toilet",
    image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Arched Door Headroom for Adult Visibility",
      "Safety Pivot Hinges with 12mm Finger Gap",
      "Nylon Ergonomic Rounded Safety Knobs",
      "Bright Primary Color Finish Options"
    ],
    specifications: [
      { label: "Standard Height", value: "1400 mm / 1500 mm" },
      { label: "Standard Depth", value: "1200 mm – 1400 mm" }
    ],
    applications: ["Nursery Schools", "Daycare Facilities", "Toy Libraries"],
    is_featured: false,
    sort_order: 26,
    published: true,
    created_at: "2024-01-26T00:00:00.000Z",
    updated_at: "2024-01-26T00:00:00.000Z"
  },
  {
    id: "prod-kids-arcadia-027",
    slug: "cubicle-arcadia-kids",
    title: "Arcadia Scalloped Kids Cubicle",
    subtitle: "Playful Scalloped-Edge Cubicle for Children Spaces",
    description: "Playful scalloped-edge cubicle system engineered for amusement centers and kids play facilities.",
    category: "Kids Toilet",
    image_url: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Playful Scalloped Edge Decorative Contour",
      "Child-Safe Non-Lockout Magnetic Latches",
      "Anti-Pinch Finger Gap Protection",
      "Impact-Proof Compact Laminate Construction"
    ],
    specifications: [
      { label: "Standard Height", value: "1450 mm" },
      { label: "Standard Depth", value: "1200 mm – 1400 mm" }
    ],
    applications: ["Family Entertainment Centers", "Theme Parks", "Kids Activity Centers"],
    is_featured: false,
    sort_order: 27,
    published: true,
    created_at: "2024-01-27T00:00:00.000Z",
    updated_at: "2024-01-27T00:00:00.000Z"
  }
];

// ── Solutions ────────────────────────────────────────────────
export const demoSolutions: Solution[] = [
  {
    id: "sol-corporate-001",
    slug: "corporate-offices",
    title: "Corporate Offices & IT Campuses",
    subtitle: "Executive Aesthetics & Sound Dampening Restroom Systems",
    description: "Custom turnkey commercial restroom and locker installations engineered for grade-A office buildings, tech parks, and corporate headquarters.",
    icon_name: "Building2",
    image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Floor-to-Ceiling Privacy Partitions",
      "Acoustic Edge Buffering",
      "Concealed Fasteners & Sleek Minimalist Lines",
      "Custom Corporate Color Palette Integration"
    ],
    clients: [
      "Multinational Tech Giants",
      "Financial Institutions",
      "Co-Working Spaces"
    ],
    sort_order: 1,
    published: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "sol-healthcare-002",
    slug: "healthcare-hospitals",
    title: "Healthcare & Hospitals",
    subtitle: "Anti-Microbial & Barrier-Free Accessible Facilities",
    description: "Sterile, non-porous HPL surfaces with anti-microbial coatings compliant with hospital hygiene and universal accessibility guidelines.",
    icon_name: "HeartPulse",
    image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    features: [
      "Anti-Bacterial Active Surface Protection",
      "Emergency Release Safety Latches",
      "ADA / Barrier-Free Wheelchair Access Dimensions",
      "Steam & Disinfectant Resistant"
    ],
    clients: [
      "Super-Speciality Hospitals",
      "Diagnostic Clinics",
      "Pharmaceutical Laboratories"
    ],
    sort_order: 2,
    published: true,
    created_at: "2024-01-02T00:00:00.000Z",
    updated_at: "2024-01-02T00:00:00.000Z"
  }
];

// ── Blogs ────────────────────────────────────────────────────
export const demoBlogs: Blog[] = [
  {
    id: "blog-hpl-guide-001",
    slug: "complete-guide-hpl-restroom-cubicles",
    title: "The Architect's Guide to Specifying HPL Restroom Cubicles",
    excerpt: "Everything architects and interior contractors need to know about high-pressure laminate thickness, fire retardancy, and hardware durability.",
    content: "When specifying commercial washrooms for high-density environments, durability and moisture resistance are paramount. High Pressure Laminate (HPL) is created by compressing multiple layers of kraft paper impregnated with phenolic resin under high pressure and heat. The result is an exceptionally tough, non-porous, homogenous board that will not rot, rust, or delaminate even in constant humid environments.",
    cover_image_url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
    author: "Pacific Technical Editorial",
    category: "Architecture & Specifications",
    tags: ["Restroom Cubicles", "HPL", "Commercial Interiors", "Architecture"],
    published: true,
    published_at: "2024-01-15T00:00:00.000Z",
    created_at: "2024-01-15T00:00:00.000Z",
    updated_at: "2024-01-15T00:00:00.000Z"
  }
];

// ── Gallery ──────────────────────────────────────────────────
export const demoGalleryImages: GalleryImage[] = [
  {
    id: "gal-delhi-airport-001",
    title: "IGI Terminal Executive Washrooms",
    category: "Restroom Cubicles",
    location_slug: "delhi",
    placement: "general",
    image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    sort_order: 1,
    published: true,
    created_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "gal-mumbai-corporate-002",
    title: "Bandra Kurla Complex Corporate Restrooms",
    category: "Restroom Cubicles",
    location_slug: "mumbai",
    placement: "general",
    image_url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
    sort_order: 2,
    published: true,
    created_at: "2024-01-02T00:00:00.000Z"
  }
];
