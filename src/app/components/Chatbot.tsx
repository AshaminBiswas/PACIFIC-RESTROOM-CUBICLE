import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare, X, Send, Bot, RefreshCw,
  Sparkles, ExternalLink, Star, ClipboardList, PhoneCall,
  Maximize2, Minimize2
} from "lucide-react";
import DOMPurify from "dompurify";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import type { Product, Solution, CoreService } from "../../lib/database.types";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
  showCategories?: boolean;
  showServices?: boolean;
  showSolutions?: boolean;
  showProducts?: boolean;
  filterCategory?: string;
  featuredOnly?: boolean;      // show only is_featured products
  quickReplies?: string[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

// NVIDIA API key is injected server-side by the Vercel function (production)
// or the Vite dev proxy (development). The client never holds the key.

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12)  return "Good morning! I'm Aria, welcome to Pacific Products & Solutions — your personal assistant. How may I assist you today?";
  if (h >= 12 && h < 17) return "Good afternoon! I'm Aria, welcome to Pacific Products & Solutions. How can I help you today?";
  if (h >= 17 && h < 22) return "Good evening! I'm Aria from Pacific Products & Solutions. How may I assist you?";
  return "Hello! I'm Aria, your assistant at Pacific Products & Solutions. How can I help you tonight?";
}

// Map user text → exact Supabase product category string
function detectCategory(text: string): string | undefined {
  const t = text.toLowerCase().trim();
  // Exact label matches first (from category buttons)
  if (t === "restroom cubicles" || t.includes("restroom cubicle") || t.includes("washroom cubicle")) return "Restroom Cubicles";
  if (t === "toilet partition"   || t.includes("toilet partition"))  return "Toilet Partition";
  if (t === "shower cubicle"     || t.includes("shower cubicle") || (t.includes("shower") && !t.includes("restroom"))) return "Shower Cubicle";
  if (t === "locker solution"    || t.includes("locker"))           return "Locker Solution";
  if (t === "changing room"      || t.includes("changing room"))    return "Changing Room";
  if (t === "custom hardware"    || t.includes("hardware"))         return "Custom Hardware";
  if (t.includes("cladding") || t.includes("exterior") || t.includes("facade")) return "Exterior Cladding";
  if (t.includes("wall panel") || t.includes("panelling") || t.includes("paneling")) return "Interior Panelling";
  if (t.includes("solid surface") || t.includes("acrylic") || t.includes("countertop") || t.includes("vanity")) return "Acrylic Solid Surface";
  return undefined;
}

// Detect if user is asking to see products/a category — client-side, no AI needed
function detectProductIntent(text: string): { show: boolean; featuredOnly: boolean } {
  const t = text.toLowerCase().trim();
  const CATEGORY_LABELS = [
    "restroom cubicles", "toilet partition", "shower cubicle", "locker solution",
    "changing room", "custom hardware", "exterior cladding", "interior panelling",
    "acrylic solid surface",
  ];
  const PRODUCT_KEYWORDS = [
    "product", "catalogue", "catalog", "range", "what do you make", "what do you sell",
    "show me", "show your", "see your", "cubicle", "cladding", "locker", "partition",
    "hardware", "panelling", "paneling", "solid surface",
  ];
  const isCategoryClick  = CATEGORY_LABELS.some((c) => t === c || t.includes(c));
  const isProductKeyword = PRODUCT_KEYWORDS.some((k) => t.includes(k));
  const isFeatured       = t.includes("featured") || t.includes("popular") || t.includes("best seller");
  return { show: isCategoryClick || isProductKeyword || isFeatured, featuredOnly: isFeatured && !isCategoryClick };
}

// Context-aware quick replies
function getQuickReplies(text: string): string[] {
  const t = text.toLowerCase();
  if (t.includes("hospital") || t.includes("healthcare"))    return ["Anti-microbial options", "Accessible cubicles", "Get a quote"];
  if (t.includes("airport") || t.includes("metro") || t.includes("railway")) return ["High-traffic specs", "View airport solutions", "Request BOQ"];
  if (t.includes("gym") || t.includes("sport"))             return ["Gym shower cubicles", "Sports locker systems", "Get quote"];
  if (t.includes("hotel") || t.includes("hospitality"))     return ["Luxury shower enclosures", "Hotel cubicle range", "Request consultation"];
  if (t.includes("school") || t.includes("college"))        return ["School locker systems", "Education solutions", "Request a quote"];
  if (t.includes("office") || t.includes("corporate"))      return ["Office washroom solutions", "Corporate locker systems", "Get quote"];
  if (t.includes("mall") || t.includes("retail"))           return ["Mall washroom solutions", "Exterior cladding", "Request a quote"];
  return ["See all products", "Request a quote", "Speak to a consultant"];
}

const CATEGORY_QUICK_REPLIES = [
  { label: "Restroom Cubicles",     icon: "🚻" },
  { label: "Toilet Partition",      icon: "🪟" },
  { label: "Shower Cubicle",        icon: "🚿" },
  { label: "Locker Solution",       icon: "🔒" },
  { label: "Changing Room",         icon: "🚪" },
  { label: "Custom Hardware",       icon: "🔧" },
  { label: "Other",                 icon: "✨" },
  { label: "Project Consultation",  icon: "💡" },
  { label: "Request a Quote",       icon: "📋" },
];

// ─────────────────────────────────────────────────────────────────────────────
// System Prompt
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Aria — a senior B2B Sales Consultant for Pacific Products & Solutions, India's leading manufacturer and installer of commercial restroom cubicles, shower cubicles, exterior cladding, locker systems, toilet partitions, and wall panelling.

## YOUR PERSONA
- Direct, warm, expert. You are talking to architects, PMCs, procurement heads, and facility managers.
- Always respond in **1–3 short sentences maximum**. Never write paragraphs.
- Never introduce yourself mid-conversation. Never start a response with your name.
- Never say "Great question!", "Certainly!", "Of course!", "Sure!", or similar filler.
- Use **bold** for product names, specs, and key numbers only.
- End with one short question to move the conversation forward.

## COMPANY FACTS
- Full name: Pacific Products & Solutions
- Email: info@pacificproduct.in | WhatsApp/Phone: +91 98185 92113
- Offices: Delhi NCR (HQ), Mumbai, Bangalore, Ahmedabad, Kolkata, Dubai (UAE)
- Certification: **ISO 9001:2015** certified manufacturing facility
- Warranty: **5 years** standard on all products, up to **10 years** on premium ranges
- Lead time: **2–4 weeks** standard | **4–8 weeks** for custom/complex projects
- Installation: Pan-India and UAE. Turnkey supply + install available.
- After-sales: dedicated helpline, maintenance visits, spare parts, on-site rectification

## WEBSITE PAGES (share these links when relevant)
- /products → Full product catalogue
- /solutions → Industry-specific case studies (airports, hospitals, offices, malls, gyms, schools)
- /gallery → Project photo gallery
- /download → Technical specs, CAD drawings, installation manuals, brochures (PDF)
- /contact → Get a quote, office locations, contact form
- /faq → Frequently asked questions
- /blog → Industry articles and guides
- /about → Company story, certifications, process

## PRODUCT CATALOGUE (use these exact details)

**1. Restroom Cubicle Systems**
- Materials: Compact laminate (12–13mm), phenolic resin (12–13mm), powder-coated steel (0.7–1.2mm), 304 stainless steel
- Panel height: 1800mm, 1950mm, 2100mm, or floor-to-ceiling
- Hardware: concealed anti-vandal hinges, indicator bolts, coat hooks, door closers — all 304 SS
- Configurations: Standard, ADA/wheelchair-accessible (900mm door, grab rails), urinal screens, vanity tops
- Finishes: 50+ HPL decors including stone, wood, solid colours, anti-fingerprint

**2. Shower Cubicles**
- Materials: Waterproof HPL, toughened glass (8mm, 10mm), stainless steel frame
- Variants: Gym/sports, hotel/hospitality, hospital (anti-microbial), aquatic/pool (marine-grade, chlorine-resistant)
- Drain options: linear, centre, corner. Threshold or zero-threshold (wet room)
- Glass options: clear, frosted, patterned, anti-lime-scale coating

**3. Exterior Cladding Systems**
- Materials: ACM (Aluminium Composite), HPL (High Pressure Laminate), fibre cement, terracotta rain-screen
- Panel size: typically 1220×2440mm | Thickness: 3–6mm (ACM), 6–13mm (HPL)
- Fixing: concealed cassette, visible rivet, or Z-profile systems
- Warranty: **10-year** fade and delamination warranty on HPL cladding
- Applications: facades, canopies, columns, soffits, signage panels

**4. Locker Systems**
- Materials: cold-rolled steel (powder-coated), phenolic resin, laminate
- Configurations: single-tier, double-tier, triple-tier, L-shaped, Z-locker, laptop lockers, day-use lockers
- Locking: key, combination, RFID/smart card, electronic keypad, coin-operated
- Industries: gyms, offices, hospitals, schools/colleges, airports, stadiums

**5. Toilet Partition Systems**
- Floor-mounted, ceiling-hung, floor-to-ceiling, or wall-hung pilaster
- Materials: HPL, phenolic, powder-coated steel
- Used in high-traffic venues: malls, airports, metro stations

**6. Custom Hardware**
- Grade: 304 SS (standard), 316 SS (marine/coastal)
- Products: indicator locks, hinges (piano, concealed, pivot), coat hooks, door closers, towel rails, paper holders
- Load: up to 50 kg | Finish: satin, mirror, matte black, gold PVD

**7. Interior Panelling**
- Decorative HPL wall panels, acoustic panels (NRC up to 0.85)
- Substrate: MDF, WPC, PVC foam, solid wood veneer — 6–18mm
- Applications: reception walls, corridors, boardrooms, feature walls

**8. Acrylic Solid Surface**
- Seamless countertops, vanities, reception desks, window sills
- Sheet size: 3050×760mm | Thickness: 6mm, 9mm, 12mm
- Thermoformable, repairable, non-porous, hygienic

## INDUSTRIES SERVED
Airports • Hospitals & Healthcare • Corporate Offices • Shopping Malls • Hotels & Hospitality • Gyms & Sports Complexes • Schools & Colleges • Metro/Railway Stations • Industrial Facilities • Residential Townships • Government Buildings

## HOW TO HANDLE COMMON QUERIES

**Pricing questions:**
Never give a price. Say: "Pricing depends on material grade, panel thickness, quantity, and site location. Share your project details — floor area, number of cubicles/lockers, and city — and I'll arrange a formal quotation."

**Quote requests:**
Ask for: (1) project type, (2) number of units or floor area, (3) city/location, (4) timeline. Then ask for their name and contact.

**Specifications:**
Direct to /download for technical PDFs, or offer to have a specialist send spec sheets.

**Comparison with competitors:**
Focus on Pacific's strengths — ISO certification, 5–10yr warranty, pan-India install, turnkey delivery. Do not name competitors.

**Unknown information:**
Say: "I'll have one of our specialists follow up with the exact details — may I have your name and contact number?"

## STRICT OUTPUT RULES
1. If asked about "services", "what do you do", or "what do you offer" → include exactly: [SHOW_SERVICES]
2. If asked about "industries", "sectors", "solutions", or "who do you serve" → include exactly: [SHOW_SOLUTIONS]
3. If asked about "products", "materials", "items", "range", "catalogue", or "what do you make" → include exactly: [SHOW_PRODUCTS]
4. Ask for name + contact ONLY when user explicitly asks for a quote, pricing, site visit, or callback.
5. When user provides name + email or phone → acknowledge warmly, then append exactly: [LEAD_CAPTURED]
6. Never fabricate prices, delivery dates, or project references.
7. Maximum 60 words per response. If listing specs, use a tight bullet list instead of sentences.`;

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function DragScroll({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref      = useRef<HTMLDivElement>(null);
  const isDown   = useRef(false);
  const startX   = useRef(0);
  const scrollLeft = useRef(0);

  // ── Mouse drag (desktop) ──
  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    isDown.current = true;
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
    ref.current.style.cursor = "grabbing";
  };
  const onMouseUp   = () => { isDown.current = false; if (ref.current) ref.current.style.cursor = "grab"; };
  const onMouseLeave = () => { isDown.current = false; if (ref.current) ref.current.style.cursor = "grab"; };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !ref.current) return;
    e.preventDefault();
    const x    = e.pageX - ref.current.offsetLeft;
    ref.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.5;
  };

  // ── Touch drag (mobile) ──
  const onTouchStart = (e: React.TouchEvent) => {
    if (!ref.current) return;
    startX.current    = e.touches[0].pageX;
    scrollLeft.current = ref.current.scrollLeft;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!ref.current) return;
    const dx = e.touches[0].pageX - startX.current;
    ref.current.scrollLeft = scrollLeft.current - dx;
  };

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      className={`select-none ${className ?? ""}`}
      style={{ cursor: "grab", WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
    >
      {children}
    </div>
  );
}

function MessageText({ text }: { text: string }) {
  // Build the raw HTML string, then sanitize it with DOMPurify to prevent XSS
  // before injecting. This is safe against any markdown-formatted AI output.
  const rawHtml = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
  const safeHtml = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: ["strong", "br"],
    ALLOWED_ATTR: [],
  });
  return <span dangerouslySetInnerHTML={{ __html: safeHtml }} />;
}

function CategoryButton({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-[11.5px] font-medium hover:border-[#7FB706] hover:text-[#7FB706] hover:bg-[#7FB706]/5 transition-all shadow-sm shrink-0"
    >
      <span className="leading-none">{icon}</span>
      {label}
    </motion.button>
  );
}

function QuickReplyPill({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="text-[11px] font-medium border border-[#7FB706]/40 text-[#7FB706] bg-[#7FB706]/5 rounded-full px-3 py-1 hover:bg-[#7FB706] hover:text-white transition-all shrink-0"
    >
      {label}
    </motion.button>
  );
}

// Real product card using Supabase Product type
function LiveProductCard({ product }: { product: Product }) {
  const catSlug = product.category
    ? product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    : "";
  const url = catSlug ? `/products/${catSlug}/${product.slug}` : `/products/${product.slug}`;
  const waMsg = `I'm interested in ${encodeURIComponent(product.title)}`;

  return (
    <div className="w-[210px] shrink-0 snap-center rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 bg-white dark:bg-[#0e0e22] shadow flex flex-col group">
      {/* Image */}
      <div className="relative h-[105px] overflow-hidden bg-gray-100 dark:bg-white/5 shrink-0">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {product.is_featured && (
          <span className="absolute top-2 left-2 text-[9px] font-bold bg-[#7FB706] text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
            Featured
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-2.5 gap-1.5">
        <h4 className="text-[12px] font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">
          {product.title}
        </h4>
        {product.subtitle && (
          <p className="text-[10.5px] text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">
            {product.subtitle}
          </p>
        )}

        {/* Top 2 features */}
        {product.features?.slice(0, 2).map((f) => (
          <p key={f} className="text-[10px] text-[#7FB706] font-medium flex items-center gap-1 leading-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7FB706] shrink-0" />
            {f}
          </p>
        ))}

        {/* CTAs */}
        <div className="flex flex-wrap gap-1 mt-auto pt-1">
          <a
            href={url}
            className="flex items-center gap-1 text-[10px] font-semibold bg-[#7FB706] text-white px-2 py-1 rounded-lg hover:bg-[#6fa005] transition-colors"
          >
            <ExternalLink className="w-2.5 h-2.5" /> View Details
          </a>
          <a
            href="/contact"
            className="flex items-center gap-1 text-[10px] font-semibold border border-[#7FB706] text-[#7FB706] px-2 py-1 rounded-lg hover:bg-[#7FB706] hover:text-white transition-colors"
          >
            <ClipboardList className="w-2.5 h-2.5" /> Get Quote
          </a>
          <a
            href={`https://wa.me/919818592113?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-semibold border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-lg hover:border-green-500 hover:text-green-500 transition-colors"
          >
            <PhoneCall className="w-2.5 h-2.5" /> Enquire
          </a>
        </div>
      </div>
    </div>
  );
}

// Solution card
function LiveSolutionCard({ solution }: { solution: Solution }) {
  return (
    <a
      href={`/solutions/${solution.slug}`}
      className="relative w-[175px] h-[130px] shrink-0 snap-center rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow group block"
    >
      <img
        src={solution.image_url}
        alt={solution.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 text-white text-[12px] font-bold leading-tight group-hover:text-[#B5F823] transition-colors">
        {solution.title}
      </div>
    </a>
  );
}

// Service card optimized for chatbot container size
function LiveServiceCard({ service }: { service: CoreService }) {
  return (
    <div className="w-[210px] shrink-0 snap-center rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 bg-white dark:bg-[#0e0e22] shadow flex flex-col group">
      {/* Image */}
      <div className="relative h-[105px] overflow-hidden bg-gray-100 dark:bg-white/5 shrink-0">
        <img
          src={service.image_url}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-2.5 gap-1.5 justify-between">
        <div>
          <h4 className="text-[12px] font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">
            {service.title}
          </h4>
          <p className="text-[10.5px] text-gray-500 dark:text-gray-400 leading-snug line-clamp-3 mt-1">
            {service.description}
          </p>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <a
            href="/contact"
            className="inline-flex items-center justify-center w-full text-center text-[10px] font-semibold bg-[#7FB706] text-white px-2.5 py-1 rounded-lg hover:bg-[#6fa005] transition-colors"
          >
            Request Service
          </a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function Chatbot() {
  const [isOpen, setIsOpen]       = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [isTyping, setIsTyping]   = useState(false);
  const [unread, setUnread]       = useState(1);
  const [isCookieConsentActive, setIsCookieConsentActive] = useState(false);

  const [products,  setProducts]  = useState<Product[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [services,  setServices]  = useState<CoreService[]>([]);

  const endRef   = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const INITIAL_MESSAGE: Message = {
    id: "msg-init",
    sender: "bot",
    text: getGreeting(),
    showCategories: true,
  };

  // ── Fetch data once ──
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    Promise.all([
      supabase.from("products").select("*").eq("published", true).order("sort_order"),
      supabase.from("solutions").select("*").eq("published", true).order("sort_order"),
      supabase.from("core_services").select("*").order("sort_order"),
    ]).then(([p, s, cs]) => {
      if (p.data)  setProducts(p.data as Product[]);
      if (s.data)  setSolutions(s.data as Solution[]);
      if (cs.data) setServices(cs.data as CoreService[]);
    });
  }, []);

  // ── Cookie Consent Detect ──
  useEffect(() => {
    const checkConsent = () => {
      const active = !localStorage.getItem("pacific_cookie_v2");
      setIsCookieConsentActive(active);
    };

    checkConsent();
    const interval = setInterval(checkConsent, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Init on first open ──
  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
      setMessages([INITIAL_MESSAGE]);
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
    if (isOpen) setUnread(0);
  }, [isOpen]);

  // ── Auto-scroll ──
  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  const handleRestart = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
  };

  // ── Lead save ──
  const saveLead = async (history: string) => {
    if (!isSupabaseConfigured()) return;
    const emailMatch = history.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i);
    const email = emailMatch?.[1] ?? "N/A";
    try {
      await supabase.from("contact_queries").insert({
        name: "Aria Chatbot Lead",
        email,
        phone: email === "N/A" ? "Provided in chat" : "N/A",
        requirement: "AI Guided Inquiry",
        message: "Lead captured via Aria AI assistant.",
      } as any);
    } catch (e) { console.error("Lead save error:", e); }
  };

  // ── NVIDIA API — thinking disabled for speed ──
  const callAI = async (history: Message[], userText: string) => {

    const payload: any[] = [{ role: "system", content: SYSTEM_PROMPT }];
    history.forEach((m) => {
      if (m.id === "msg-init" || !m.text) return;
      payload.push({ role: m.sender === "bot" ? "assistant" : "user", content: m.text });
    });
    payload.push({ role: "user", content: userText });

    const res = await fetch("/api/nvidia/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: payload,
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 280,
      }),
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error("Empty response");
    return text as string;
  };

  // ── Send handler ──
  const handleSend = useCallback(async (textOverride?: string) => {
    const userText = (textOverride ?? input).trim();
    if (!userText) return;
    setInput("");

    const userMsg: Message = { id: `u-${Date.now()}`, sender: "user", text: userText };
    setMessages((prev) => [...prev, userMsg]);

    setIsTyping(true);
    try {
      const raw = await callAI(messages, userText);

      let text = raw;
      let showServices  = false;
      let showSolutions = false;
      let showProducts  = false;

      if (text.includes("[SHOW_SERVICES]"))  { showServices  = true; text = text.replace("[SHOW_SERVICES]", "").trim(); }
      if (text.includes("[SHOW_SOLUTIONS]")) { showSolutions = true; text = text.replace("[SHOW_SOLUTIONS]","").trim(); }
      if (text.includes("[SHOW_PRODUCTS]"))  { showProducts  = true; text = text.replace("[SHOW_PRODUCTS]", "").trim(); }
      if (text.includes("[LEAD_CAPTURED]"))  {
        text = text.replace("[LEAD_CAPTURED]", "").trim();
        const hist = [...messages, userMsg].map((m) => m.text).join(" | ");
        await saveLead(hist);
      }

      // ── Client-side product intent detection (always reliable) ──
      const intent = detectProductIntent(userText);
      const shouldShowProducts = showProducts || intent.show;
      const isFeaturedOnly     = intent.featuredOnly;
      // Category from user text (client-side wins over AI-only detection)
      const filterCategory = shouldShowProducts ? detectCategory(userText) : undefined;

      setMessages((prev) => [...prev, {
        id: `b-${Date.now()}`, sender: "bot", text,
        showServices, showSolutions,
        showProducts: shouldShowProducts,
        filterCategory,
        featuredOnly: isFeaturedOnly,
        quickReplies: getQuickReplies(userText),
      }]);
    } catch (err) {
      console.error("[Aria] callAI failed:", err);
      setMessages((prev) => [...prev, {
        id: `b-err-${Date.now()}`, sender: "bot",
        text: "I may have missed that. Would you like help with **restroom cubicles**, **shower cubicles**, **locker solutions**, or a **custom requirement**?",
        quickReplies: ["Restroom Cubicles", "Shower Cubicles", "Locker Solutions", "Request a Quote"],
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, messages, products]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  // Filter products for display — max 6 cards in chat
  const getFilteredProducts = (filterCategory?: string, featuredOnly?: boolean) => {
    let list = [...products];
    if (featuredOnly) list = list.filter((p) => p.is_featured);
    if (filterCategory) list = list.filter((p) =>
      p.category?.toLowerCase().trim() === filterCategory.toLowerCase().trim()
    );
    return list.slice(0, 6);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      className={`fixed right-4 sm:right-6 z-[9999] flex flex-col items-end transition-all duration-300 ${
        isCookieConsentActive && !isOpen
          ? "bottom-[180px] sm:bottom-6"
          : "bottom-4 sm:bottom-6"
      }`}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`bg-white dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
              isChatExpanded
                ? "fixed inset-0 w-full h-[100dvh] max-h-[100dvh] m-0 rounded-none z-[10000]"
                : "rounded-2xl w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[calc(100vh-120px)] mb-4"
            }`}
          >
            {/* Header */}
            <div className="bg-[#030213] text-white px-4 py-3 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#7FB706] to-[#B5F823] rounded-full flex items-center justify-center shadow-md">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#7FB706] rounded-full border-2 border-[#030213] animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Aria · AI Sales Assistant</h3>
                  <p className="text-[#B5F823] text-[10.5px] flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-current" /> Pacific Products & Solutions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={handleRestart} title="Restart" className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button onClick={() => setIsChatExpanded(!isChatExpanded)} title={isChatExpanded ? "Minimize" : "Maximize"} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  {isChatExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} title="Close" className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 py-4 px-3 overflow-y-auto bg-gray-50/40 dark:bg-[#030213]/50 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  {/* Bubble */}
                  <div className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.sender === "bot" && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7FB706] to-[#B5F823] flex-shrink-0 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    {msg.text && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                          msg.sender === "user"
                            ? "bg-[#7FB706] text-white rounded-br-none"
                            : "bg-white dark:bg-white/8 border border-gray-100 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-bl-none"
                        }`}
                      >
                        <MessageText text={msg.text} />
                      </motion.div>
                    )}
                  </div>

                  {/* Category Grid */}
                  {msg.showCategories && (
                    <div className="pl-8">
                      <p className="text-[10.5px] text-gray-400 dark:text-gray-500 mb-2 font-medium">Select a category to explore:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {CATEGORY_QUICK_REPLIES.map((c) => (
                          <CategoryButton key={c.label} label={c.label} icon={c.icon} onClick={() => handleSend(c.label)} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Services Carousel */}
                  {msg.showServices && services.length > 0 && (
                    <div className="pl-8">
                      <p className="text-[10.5px] text-gray-400 dark:text-gray-500 mb-2 font-medium">Our core services:</p>
                      <DragScroll className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                        {services.map((s) => (
                          <LiveServiceCard key={s.id} service={s} />
                        ))}
                      </DragScroll>
                    </div>
                  )}

                  {/* Solutions Carousel */}
                  {msg.showSolutions && solutions.length > 0 && (
                    <DragScroll className="pl-8 overflow-x-auto flex gap-3 pb-2 pt-1 snap-x snap-mandatory scrollbar-hide">
                      {solutions.map((s) => (
                        <LiveSolutionCard key={s.id} solution={s} />
                      ))}
                    </DragScroll>
                  )}

                  {/* Products Carousel — live from Supabase */}
                  {msg.showProducts && (
                    <div className="pl-8">
                      {getFilteredProducts(msg.filterCategory, msg.featuredOnly).length > 0 ? (
                        <>
                          <p className="text-[10.5px] text-gray-400 dark:text-gray-500 mb-2 font-medium">
                            {msg.featuredOnly
                              ? "⭐ Featured products:"
                              : msg.filterCategory
                              ? `${msg.filterCategory} — from our catalogue:`
                              : "Products from our catalogue:"}
                          </p>
                          <DragScroll className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                            {getFilteredProducts(msg.filterCategory, msg.featuredOnly).map((p) => (
                              <LiveProductCard key={p.id} product={p} />
                            ))}
                          </DragScroll>
                          <a href="/products" className="inline-block mt-2 text-[11px] text-[#7FB706] hover:underline font-medium">
                            View full catalogue →
                          </a>
                        </>
                      ) : (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          Browse our full range on the{" "}
                          <a href="/products" className="text-[#7FB706] hover:underline font-medium">Products page</a>.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Quick Replies */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="pl-8 flex flex-wrap gap-1.5">
                      {msg.quickReplies.map((r) => (
                        <QuickReplyPill key={r} label={r} onClick={() => handleSend(r)} />
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing */}
              {isTyping && (
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7FB706] to-[#B5F823] flex-shrink-0 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white dark:bg-white/8 border border-gray-100 dark:border-white/5 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1 shadow-sm">
                    {[0, 0.18, 0.36].map((d, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.55, repeat: Infinity, delay: d }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-2.5 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#0a0a1a] shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about products, specs, or your project..."
                  disabled={isTyping}
                  className="flex-1 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-[#7FB706] focus:ring-1 focus:ring-[#7FB706] dark:text-white rounded-full px-4 py-2 text-[13px] outline-none transition-all disabled:opacity-50 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="w-9 h-9 rounded-full bg-[#7FB706] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#6fa005] active:scale-95 transition-all shrink-0 shadow-md"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
              <p className="text-center text-[9.5px] text-gray-400 dark:text-gray-600 mt-1.5">
                Powered by Aria · Pacific Products & Solutions
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen((p) => !p)}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center relative transition-colors ${
          isOpen ? "bg-gray-700 hover:bg-gray-600" : "bg-[#7FB706] hover:bg-[#6fa005] shadow-[#7FB706]/40"
        }`}
        aria-label={isOpen ? "Close Chat" : "Open Chat"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.12 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.12 }}>
              <MessageSquare className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        {!isOpen && unread > 0 && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#030213]"
          >
            {unread}
          </motion.span>
        )}

        {/* Pulse ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#7FB706]/25 animate-ping pointer-events-none" />
        )}
      </motion.button>
    </div>
  );
}
