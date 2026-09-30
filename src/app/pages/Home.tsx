import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Shield,
  Users,
  Award,
  Lightbulb,
  Factory,
  Target,
  CheckCircle2,
  Building2,
  ShoppingBag,
  Plane,
  Home,
  Search,
  Sparkles,
  X,
  Loader2,
  Package,
  Layers,
  ChevronDown,
  ShieldCheck,
  Droplets,
  Flame,
  Truck,
  Building,
  Hotel,
  HeartPulse,
  GraduationCap,
  Compass,
  Ruler,
  FileSpreadsheet,
  Box,
  Wrench,
  Check,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "../components/Button";
import { SEO } from "../components/SEO";
import { organizationSchema, webSiteSchema, DEFAULT_KEYWORDS, aggregateRatingSchema, speakableSchema, faqSchema } from "../../lib/seo-data";
import { FeaturedServices } from "../components/FeaturedServices";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import type { Product, Solution } from "../../lib/database.types";
import { useHeroImages } from "../../lib/hooks";

// ─────────────────────────────────────────────────────────────

// ── Hero Background Slideshow ─────────────────────────────────

interface HeroSlideshowProps {
  images: { url: string; description: string }[];
  onSlideChange: (index: number) => void;
}

function HeroSlideshow({ images, onSlideChange }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);

  function goTo(i: number) {
    setCurrent(i);
    onSlideChange(i);
  }

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % images.length;
        onSlideChange(next);
        return next;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [images.length, onSlideChange]);

  return (
    <div className="absolute inset-0 z-0">
      {images.map((img, i) => (
        <img
          key={img.url}
          src={img.url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        />
      ))}
      {/* Base dark overlay */}
      <div className="absolute inset-0 z-10 bg-black/50 pointer-events-none" />
      {/* Vignette — darker edges from all sides */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 10%, rgba(0,0,0,0.97) 100%)",
        }}
      />

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-white w-6" : "bg-white/40 hover:bg-white/70 w-2"
                }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}


// ── AI Search types ───────────────────────────────────────────
type SearchResultItem = {
  id: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  type: "product" | "solution";
  url: string;
};

type AIRecommendation = {
  title: string;
  reason: string;
  url: string;
};

// NVIDIA API key is injected server-side by the Vercel function (production)
// or the Vite dev proxy (development). The client never holds the key.

// ── Hero Section (extracted as its own component) ─────────────

function HeroSection() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [quoteHovered, setQuoteHovered] = useState(false);
  const [productHovered, setProductHovered] = useState(false);
  const { data: heroImages } = useHeroImages();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allSolutions, setAllSolutions] = useState<Solution[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResultItem[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [isAISearching, setIsAISearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const searchRef = useRef<HTMLDivElement>(null);
  const aiDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update dropdown position relative to form (for portal rendering)
  const updateDropdownPos = useCallback(() => {
    if (formRef.current) {
      const rect = formRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    }
  }, []);

  // Keep dropdown position in sync with scroll and resize
  useEffect(() => {
    if (!showDropdown) return;
    updateDropdownPos();
    window.addEventListener("scroll", updateDropdownPos, true);
    window.addEventListener("resize", updateDropdownPos);
    return () => {
      window.removeEventListener("scroll", updateDropdownPos, true);
      window.removeEventListener("resize", updateDropdownPos);
    };
  }, [showDropdown, updateDropdownPos]);

  const activeDescription =
    heroImages.length > 0 && heroImages[currentSlide]?.description
      ? heroImages[currentSlide].description
      : "";

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // ── Fetch products & solutions once ──
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    Promise.all([
      supabase.from("products").select("id,title,subtitle,image_url,slug,category").eq("published", true).order("sort_order"),
      supabase.from("solutions").select("id,title,subtitle,image_url,slug").eq("published", true).order("sort_order"),
    ]).then(([p, s]) => {
      if (p.data) setAllProducts(p.data as Product[]);
      if (s.data) setAllSolutions(s.data as Solution[]);
    });
  }, []);

  // ── Click-outside to close dropdown ──
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── AI recommendations ──
  const fetchAIRecommendations = useCallback(async (query: string) => {
    setIsAISearching(true);
    try {
      const productList = allProducts.map((p) => {
        const catSlug = p.category
          ? p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
          : "";
        return `- ${p.title} (${p.category ?? "General"}) | URL: ${catSlug ? `/products/${catSlug}/${p.slug}` : `/products/${p.slug}`}`;
      }).join("\n");
      const solutionList = allSolutions.map((s) => `- ${s.title} | URL: /solutions/${s.slug}`).join("\n");

      const prompt = `You are a product search assistant for Pacific Products & Solutions, a B2B company selling restroom cubicles, cladding, locker systems, and interior solutions.\n\nUser searched for: "${query}"\n\nAvailable Products:\n${productList || "(none)"}\n\nAvailable Solutions:\n${solutionList || "(none)"}\n\nReturn 1-3 most relevant recommendations as a JSON array (raw JSON only, no markdown):\n[{"title": "Name", "reason": "Brief reason max 8 words", "url": "/exact/url"}]\n\nReturn [] if nothing matches. Only use URLs from the lists above.`;

      const res = await fetch("/api/nvidia/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 256,
          chat_template_kwargs: { enable_thinking: false },
        }),
      });

      if (!res.ok) return;
      const data = await res.json();
      const text: string = data.choices?.[0]?.message?.content ?? "[]";
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        const recs: AIRecommendation[] = JSON.parse(jsonMatch[0]);
        setAiRecommendations(recs.slice(0, 3));
      }
    } catch {
      // silent fail
    } finally {
      setIsAISearching(false);
    }
  }, [allProducts, allSolutions]);

  // ── Local filter on every keystroke ──
  useEffect(() => {
    setIsExpanded(false); // Reset expansion on new query
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredResults([]);
      setAiRecommendations([]);
      setShowDropdown(false);
      return;
    }

    const productResults: SearchResultItem[] = allProducts
      .filter((p) =>
        p.title.toLowerCase().includes(q) ||
        (p.subtitle ?? "").toLowerCase().includes(q) ||
        (p.category ?? "").toLowerCase().includes(q)
      )
      .slice(0, 15)
      .map((p) => {
        const catSlug = p.category
          ? p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
          : "";
        return {
          id: p.id,
          title: p.title,
          subtitle: p.subtitle ?? p.category,
          image_url: p.image_url,
          type: "product" as const,
          url: catSlug ? `/products/${catSlug}/${p.slug}` : `/products/${p.slug}`,
        };
      });

    const solutionResults: SearchResultItem[] = allSolutions
      .filter((s) =>
        s.title.toLowerCase().includes(q) ||
        (s.subtitle ?? "").toLowerCase().includes(q)
      )
      .slice(0, 10)
      .map((s) => ({
        id: s.id,
        title: s.title,
        subtitle: s.subtitle,
        image_url: s.image_url,
        type: "solution" as const,
        url: `/solutions/${s.slug}`,
      }));

    setFilteredResults([...productResults, ...solutionResults]);
    setShowDropdown(true);

    // Debounce AI request
    if (aiDebounceRef.current) clearTimeout(aiDebounceRef.current);
    if (q.length >= 3) {
      aiDebounceRef.current = setTimeout(() => fetchAIRecommendations(q), 700);
    }
  }, [searchQuery, allProducts, allSolutions, fetchAIRecommendations]);

  const handleResultClick = (url: string) => {
    setShowDropdown(false);
    setSearchQuery("");
    navigate(url);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-end justify-center overflow-hidden pt-0 sm:pt-16 lg:pt-20"
    >
      {/* Hero Background */}
      {heroImages.length > 0 ? (
        <HeroSlideshow
          images={heroImages.map((img) => ({ url: img.url, description: img.description }))}
          onSlideChange={setCurrentSlide}
        />
      ) : (
        <motion.div style={{ y }} className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f0ffc8]/80 via-white/60 to-[#e6fdb0]/80 dark:from-[#030213] dark:via-[#030213] dark:to-[#0a0a1a]" />
          <motion.div
            className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(127,183,6,0.35) 0%, rgba(127,183,6,0) 70%)", filter: "blur(48px)" }}
            animate={{ scale: [1, 1.15, 1], x: [0, 24, 0], y: [0, 16, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 -right-32 w-[520px] h-[520px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(181,248,35,0.28) 0%, rgba(181,248,35,0) 70%)", filter: "blur(56px)" }}
            animate={{ scale: [1, 1.1, 1], x: [0, -20, 0], y: [0, 28, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
          <motion.div
            className="absolute -bottom-32 left-1/3 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(127,183,6,0.22) 0%, rgba(127,183,6,0) 70%)", filter: "blur(40px)" }}
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(233,253,191,0.5) 0%, rgba(233,253,191,0) 70%)", filter: "blur(32px)" }}
            animate={{ scaleX: [1, 1.08, 1], scaleY: [1, 1.12, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, #7FB706 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #7FB706 0px, transparent 1px, transparent 40px)" }}
          />
        </motion.div>
      )}

      {/* Main content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 text-center pb-[18vh]"
      >
        {/* Description */}
        <motion.p
          key={currentSlide}
          className="text-lg sm:text-xl md:text-2xl text-white/95 mb-8 sm:mb-10 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-medium"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9), 0 2px 20px rgba(0,0,0,0.7)" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeDescription}
        </motion.p>

        {/* ── AI Search Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8 sm:mb-10 max-w-2xl mx-auto"
          style={{ marginTop: "-400px" }}
          ref={searchRef}
        >
          <form ref={formRef} onSubmit={handleSearchSubmit} className="relative">
            {/* Input wrapper */}
            <div
              className="relative flex items-center rounded-2xl transition-all duration-300"
              style={{
                boxShadow: searchFocused
                  ? "0 0 0 2px #7FB706, 0 8px 40px rgba(127,183,6,0.28)"
                  : "0 4px 32px rgba(0,0,0,0.45)",
              }}
            >
              {/* Glass backdrop */}
              <div className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 pointer-events-none" />

              {/* Search icon */}
              <div className="relative z-10 pl-4 sm:pl-5 text-white/60 flex-shrink-0">
                <Search className="w-5 h-5" />
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { setSearchFocused(true); if (searchQuery.trim()) setShowDropdown(true); }}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search products, solutions, materials..."
                className="relative z-10 flex-1 bg-transparent text-white placeholder-white/45 text-sm sm:text-base px-3 sm:px-4 py-4 outline-none"
              />

              {/* Clear */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(""); setShowDropdown(false); inputRef.current?.focus(); }}
                  className="relative z-10 p-1.5 mr-1 text-white/40 hover:text-white/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* AI badge */}
              <div className="relative z-10 flex items-center gap-1.5 mr-2 px-2.5 py-1.5 rounded-lg bg-[#7FB706]/20 border border-[#7FB706]/30 flex-shrink-0">
                {isAISearching
                  ? <Loader2 className="w-3.5 h-3.5 text-[#B5F823] animate-spin" />
                  : <Sparkles className="w-3.5 h-3.5 text-[#B5F823]" />}
                <span className="text-[11px] font-semibold text-[#B5F823] hidden sm:block">
                  {isAISearching ? "Thinking…" : "AI"}
                </span>
              </div>

              {/* Search button */}
              <button
                type="submit"
                className="relative z-10 mr-2 px-4 py-2 rounded-xl bg-[#7FB706] hover:bg-[#6fa005] text-white text-sm font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap hidden sm:block"
              >
                Search
              </button>
            </div>

          </form>

          {/* ── Results Dropdown — rendered via portal into document.body ──
               This escapes the section's overflow:hidden and the parent
               motion.div's animated opacity stacking context. */}
          {createPortal(
            <AnimatePresence>
              {showDropdown && (filteredResults.length > 0 || aiRecommendations.length > 0 || isAISearching) && (
                <motion.div
                  key="search-results-dropdown"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  style={{
                    position: "fixed",
                    top: dropdownPos.top,
                    left: dropdownPos.left,
                    width: dropdownPos.width,
                    zIndex: 99999,
                    borderRadius: "1rem",
                    overflow: "hidden",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.07)",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, background: "rgba(13,13,31,0.96)", backdropFilter: "blur(24px)", borderRadius: "1rem" }} />

                  <div style={{ position: "relative", zIndex: 10, maxHeight: "420px", overflowY: "auto" }}>

                    {/* Instant results */}
                    {filteredResults.length > 0 && (
                      <div className="px-3 pt-3 pb-1">
                        <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest px-2 mb-2">Results</p>
                        {(isExpanded ? filteredResults : filteredResults.slice(0, 5)).map((item) => (
                          <motion.button
                            key={`${item.type}-${item.id}`}
                            onClick={() => handleResultClick(item.url)}
                            whileHover={{ x: 3 }}
                            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group"
                          >
                            {/* Thumbnail */}
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 border border-white/8">
                              {item.image_url ? (
                                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  {item.type === "product"
                                    ? <Package className="w-4 h-4 text-white/20" />
                                    : <Layers className="w-4 h-4 text-white/20" />}
                                </div>
                              )}
                            </div>
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white/90 truncate group-hover:text-[#B5F823] transition-colors">{item.title}</p>
                              {item.subtitle && (
                                <p className="text-[11px] text-white/38 truncate mt-0.5">{item.subtitle}</p>
                              )}
                            </div>
                            {/* Badge */}
                            <span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${
                              item.type === "product"
                                ? "bg-[#7FB706]/15 text-[#B5F823]"
                                : "bg-blue-500/15 text-blue-400"
                            }`}>
                              {item.type}
                            </span>
                          </motion.button>
                        ))}

                        {/* Expand Button */}
                        {filteredResults.length > 5 && !isExpanded && (
                          <button
                            type="button"
                            onClick={() => setIsExpanded(true)}
                            className="w-[calc(100%-8px)] mx-1 flex items-center justify-center gap-1.5 py-2.5 mt-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#7FB706] hover:text-[#B5F823] transition-all duration-200 border border-white/5 hover:border-white/10 active:scale-[0.98]"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                            Show More Results ({filteredResults.length - 5} hidden)
                          </button>
                        )}
                      </div>
                    )}

                    {/* Divider */}
                    {filteredResults.length > 0 && (aiRecommendations.length > 0 || isAISearching) && (
                      <div className="mx-4 border-t border-white/8 my-1" />
                    )}

                    {/* AI Recommendations */}
                    {(aiRecommendations.length > 0 || isAISearching) && (
                      <div className="px-3 pt-2 pb-3">
                        <div className="flex items-center gap-1.5 px-2 mb-2">
                          <Sparkles className="w-3 h-3 text-[#B5F823]" />
                          <p className="text-[10px] font-bold text-[#B5F823] uppercase tracking-widest">AI Picks</p>
                          {isAISearching && <Loader2 className="w-3 h-3 text-[#B5F823] animate-spin ml-1" />}
                        </div>

                        {isAISearching && aiRecommendations.length === 0 ? (
                          <div className="flex items-center gap-2 px-2 py-3">
                            <div className="flex gap-1">
                              {[0, 0.15, 0.3].map((d, i) => (
                                <motion.div
                                  key={i}
                                  className="w-1.5 h-1.5 rounded-full bg-[#7FB706]/60"
                                  animate={{ opacity: [0.4, 1, 0.4] }}
                                  transition={{ duration: 0.9, repeat: Infinity, delay: d }}
                                />
                              ))}
                            </div>
                            <span className="text-[11px] text-white/35">Generating AI suggestions…</span>
                          </div>
                        ) : (
                          aiRecommendations.map((rec, i) => (
                            <motion.button
                              key={i}
                              onClick={() => handleResultClick(rec.url)}
                              whileHover={{ x: 3 }}
                              className="w-full flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group"
                            >
                              <div className="w-7 h-7 rounded-lg bg-[#7FB706]/15 border border-[#7FB706]/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Sparkles className="w-3.5 h-3.5 text-[#B5F823]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white/90 group-hover:text-[#B5F823] transition-colors truncate">{rec.title}</p>
                                <p className="text-[11px] text-white/38 mt-0.5">{rec.reason}</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#7FB706] transition-colors flex-shrink-0 mt-1" />
                            </motion.button>
                          ))
                        )}
                      </div>
                    )}

                    {/* Empty state */}
                    {filteredResults.length === 0 && !isAISearching && aiRecommendations.length === 0 && (
                      <div className="px-5 py-6 text-center">
                        <Search className="w-8 h-8 text-white/12 mx-auto mb-2" />
                        <p className="text-sm text-white/38">No results for <span className="text-white/55 font-medium">"{searchQuery}"</span></p>
                        <button
                          onClick={() => navigate("/products")}
                          className="mt-3 text-[12px] text-[#7FB706] hover:text-[#B5F823] transition-colors font-medium"
                        >
                          Browse all products →
                        </button>
                      </div>
                    )}

                    {/* View all */}
                    {filteredResults.length > 0 && (
                      <button
                        onClick={() => { navigate(`/products?q=${encodeURIComponent(searchQuery)}`); setShowDropdown(false); }}
                        className="w-full text-center py-3 text-[11px] font-semibold text-[#7FB706] hover:text-[#B5F823] border-t border-white/8 transition-colors"
                      >
                        See all results for "{searchQuery}" →
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}

          {/* Quick suggestion pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-2 mt-3"
          >
            {["Restroom Cubicles", "Exterior Cladding", "Locker Systems", "Shower Cubicles"].map((tag) => (
              <button
                key={tag}
                onClick={() => { setSearchQuery(tag); inputRef.current?.focus(); }}
                className="text-[11px] text-white/50 hover:text-white/85 border border-white/15 hover:border-white/35 px-3 py-1 rounded-full transition-all duration-200 backdrop-blur-sm hover:bg-white/5"
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-row gap-1.5 sm:gap-4 justify-center items-center mb-6 sm:mb-16 lg:mb-2 w-full px-2 sm:px-0"
          style={{ marginTop: "100px" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <motion.div
            className="flex-1 sm:flex-none w-full sm:w-auto"
            onHoverStart={() => setQuoteHovered(true)}
            onHoverEnd={() => setQuoteHovered(false)}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              size="lg"
              className="w-full relative overflow-hidden px-2 sm:px-8 py-3.5 sm:py-4 text-[13px] sm:text-base font-semibold shadow-lg shadow-[#7FB706]/25 transition-shadow hover:shadow-xl hover:shadow-[#7FB706]/35"
              onClick={() => navigate("/contact")}
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap">
                Get Quote
                <motion.span
                  animate={{ x: quoteHovered ? 4 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </span>
            </Button>
          </motion.div>

          <motion.div
            className="flex-1 sm:flex-none w-full sm:w-auto"
            onHoverStart={() => setProductHovered(true)}
            onHoverEnd={() => setProductHovered(false)}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="w-full px-2 sm:px-8 py-3.5 sm:py-4 text-[13px] sm:text-base font-semibold backdrop-blur-sm border-[#7FB706]/40 hover:bg-[#7FB706]/5 hover:border-[#7FB706]/30 hover:text-gray-900 dark:hover:text-white dark:text-gray-300 transition-all"
              onClick={() => navigate("/products")}
            >
              <span className="flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap">
                View Services
                <motion.span
                  animate={{ x: productHovered ? 4 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </motion.span>
              </span>
            </Button>
          </motion.div>
        </motion.div>

      </motion.div>

    </section>
  );
}


// ── Architectural Sections ──────────────────────────────────────

function ArchitecturalTrustStrip() {
  const specs = [
    {
      icon: Award,
      title: "ISO 9001:2015",
      subtitle: "Certified Precision Fabrication",
    },
    {
      icon: Flame,
      title: "Class 1 Fire Retardant",
      subtitle: "BS 476 Part 7 Compliant Core",
    },
    {
      icon: Droplets,
      title: "100% Waterproof",
      subtitle: "Zero Swell & Moisture Proof",
    },
    {
      icon: ShieldCheck,
      title: "Dual Warranty Standard",
      subtitle: "10-Yr Board & 1-Yr Hardware",
    },
    {
      icon: Sparkles,
      title: "Triple Hardware Suite",
      subtitle: "SS 304 / Nylon / Aluminium",
    },
    {
      icon: Truck,
      title: "Pan-India Logistics",
      subtitle: "Certified Turnkey Teams",
    },
  ];

  return (
    <section className="bg-[#030213] text-white py-6 sm:py-8 border-y border-[#7FB706]/20 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#7FB706]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#B5F823]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {specs.map((spec, idx) => {
            const Icon = spec.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#7FB706]/30 hover:bg-white/[0.06] transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7FB706]/10 border border-[#7FB706]/20 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#7FB706]/20 transition-all">
                  <Icon className="w-5 h-5 text-[#B5F823]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-white group-hover:text-[#B5F823] transition-colors truncate">
                    {spec.title}
                  </div>
                  <div className="text-[11px] text-gray-400 truncate">
                    {spec.subtitle}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CategoryBentoGrid({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-[#030213] text-gray-900 dark:text-white transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4">
          <div>
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#7FB706] mb-2 block">
              Architectural Product Systems
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Engineered for Modern Commercial Spaces
            </h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md">
            Heavy-duty, high-privacy compact laminate washroom systems and storage solutions built to withstand extreme commercial footfall.
          </p>
        </div>

        {/* Bento Grid — 1 Card per row */}
        <div className="grid grid-cols-1 gap-6">
          {/* Card 1: Restroom Cubicles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            onClick={() => navigate("/products/restroom-cubicles")}
            className="w-full group relative rounded-3xl overflow-hidden bg-[#0a0a1a] border border-gray-200 dark:border-white/10 hover:border-[#7FB706]/50 shadow-xl cursor-pointer min-h-[360px] flex flex-col justify-end p-6 sm:p-8"
          >
            <div className="absolute inset-0 z-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
                alt="Commercial Restroom Cubicle Systems"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            <div className="relative z-10 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#7FB706] text-black uppercase tracking-wider">
                  Flagship Product
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white backdrop-blur-md">
                  12mm &amp; 18mm Board
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white backdrop-blur-md">
                  SS 304 / Nylon / Aluminium
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-[#B5F823] transition-colors">
                Restroom Cubicle Systems
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
                Floor-anchored, overhead-braced, and ceiling-hung privacy systems engineered with high-density solid compact laminate and anti-vandalism fittings.
              </p>
              <div className="pt-2 flex items-center text-sm font-bold text-[#7FB706] group-hover:text-[#B5F823] gap-2">
                <span>Explore Cubicle Models</span>
                <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Modular Lockers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -4 }}
            onClick={() => navigate("/products/lockers")}
            className="w-full group relative rounded-3xl overflow-hidden bg-[#0a0a1a] border border-gray-200 dark:border-white/10 hover:border-[#7FB706]/50 shadow-xl cursor-pointer min-h-[360px] flex flex-col justify-end p-6 sm:p-8"
          >
            <div className="absolute inset-0 z-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80"
                alt="Modular HPL Lockers"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            <div className="relative z-10 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500 text-white uppercase tracking-wider">
                  Storage Systems
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white backdrop-blur-md">
                  1 to 6 Tiers
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white backdrop-blur-md">
                  Digital &amp; Cam Locks
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-[#B5F823] transition-colors">
                Modular HPL Locker Systems
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
                Vandal-resistant, moisture-proof compact laminate lockers with concealed heavy-duty hinges and ventilation louvers for gyms, IT parks &amp; sports hubs.
              </p>
              <div className="pt-2 flex items-center text-sm font-bold text-[#7FB706] group-hover:text-[#B5F823] gap-2">
                <span>Explore Locker Models</span>
                <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </motion.div>

          {/* Card 3: Urinal Partitions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4 }}
            onClick={() => navigate("/products/urinal-partitions")}
            className="w-full group relative rounded-3xl overflow-hidden bg-[#0a0a1a] border border-gray-200 dark:border-white/10 hover:border-[#7FB706]/50 shadow-xl cursor-pointer min-h-[360px] flex flex-col justify-end p-6 sm:p-8"
          >
            <div className="absolute inset-0 z-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80"
                alt="Urinal Partitions"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            <div className="relative z-10 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-black uppercase tracking-wider">
                  Privacy Screens
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white backdrop-blur-md">
                  Wall-Hung &amp; Floor Leg
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#B5F823] transition-colors">
                Urinal Partition Screens
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Floating wall-hung cantilever and floor-anchored modesty panels with beveled safety edges and Grade 304 SS brackets.
              </p>
              <div className="pt-2 flex items-center text-sm font-bold text-[#7FB706] group-hover:text-[#B5F823] gap-2">
                <span>View Partitions</span>
                <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </motion.div>

          {/* Card 4: Kids Cubicles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -4 }}
            onClick={() => navigate("/products/kids-toilet")}
            className="w-full group relative rounded-3xl overflow-hidden bg-[#0a0a1a] border border-gray-200 dark:border-white/10 hover:border-[#7FB706]/50 shadow-xl cursor-pointer min-h-[360px] flex flex-col justify-end p-6 sm:p-8"
          >
            <div className="absolute inset-0 z-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80"
                alt="Kids & Preschool Toilet Cubicles"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            <div className="relative z-10 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500 text-white uppercase tracking-wider">
                  Child Safety First
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white backdrop-blur-md">
                  Anti-Finger Pinch Gaps
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white backdrop-blur-md">
                  Emergency Coin Turn
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#B5F823] transition-colors">
                Kids &amp; Preschool Safety Cubicles
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Ergonomic child-safe washroom cubicles designed with low-height doors, soft spring hinges, rounded corner profiles, and exterior emergency overrides.
              </p>
              <div className="pt-2 flex items-center text-sm font-bold text-[#7FB706] group-hover:text-[#B5F823] gap-2">
                <span>View Kids Systems</span>
                <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MaterialEngineeringDeepDive({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="py-16 sm:py-24 bg-gray-50 dark:bg-[#060515] text-gray-900 dark:text-white transition-colors border-y border-gray-200 dark:border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#7FB706] mb-2 block">
            Material Science &amp; Engineering
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            Built from Solid Compact Laminate &amp; Commercial Hardware
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
            Every Pacific system is fabricated using high-density solid phenolic core boards manufactured under 1400 PSI pressure and 150°C heat, paired with structural architectural hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: 3-Layer Board Anatomy */}
          <div className="bg-white dark:bg-[#0a0a1a] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 shadow-lg space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#7FB706]/10 border border-[#7FB706]/20 flex items-center justify-center text-[#7FB706]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Solid Phenolic Core Board (12mm / 18mm)
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Homogeneous, thermosetting resins infused with multiple layers of kraft paper for absolute structural integrity:
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                  <div className="text-xs font-bold text-[#7FB706]">Top Layer</div>
                  <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">Melamine Protective Overlay</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">UV-resistant, scratch-proof &amp; anti-graffiti finish</div>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                  <div className="text-xs font-bold text-[#7FB706]">Intermediate Layer</div>
                  <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">Decorative Architectural Paper</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">Solid brand shades, woodgrain textures, and stone patterns</div>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                  <div className="text-xs font-bold text-[#7FB706]">Core Foundation</div>
                  <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">Solid Phenolic Kraft Paper Core</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">100% waterproof, zero delamination, Class 1 fire-rated</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
              <span>Backed by 10-Year Warranty</span>
              <ShieldCheck className="w-4 h-4 text-[#7FB706]" />
            </div>
          </div>

          {/* Card 2: Triple Hardware Suite */}
          <div className="bg-white dark:bg-[#0a0a1a] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 shadow-lg space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Triple Hardware Engineering Suite
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Choose the exact fitting material that matches your project’s aesthetic and durability standards:
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-500">Grade 304 / 316 Stainless Steel</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">Heavy Duty</span>
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    Available in Golden PVD, Matte Black, and Satin Brushed finishes. Anti-vandalism tensile strength.
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">Polyamide Nylon Hardware</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">Non-Corrosive</span>
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    High-density engineered nylon resistant to cleaning chemicals, harsh acids, moisture, and rust.
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Aluminium Profiles</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-300 border border-slate-500/20 font-semibold">Structural</span>
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    Precision-extruded anodized headrails, U-channels, and door frame profiles for rigid alignment.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
              <span>Backed by 1-Year Direct Replacement</span>
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </div>
          </div>

          {/* Card 3: 3D Visualizer & Customization */}
          <div className="bg-gradient-to-br from-[#121226] to-[#0a0a1a] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-lg space-y-6 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7FB706]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#B5F823]/10 border border-[#B5F823]/20 flex items-center justify-center text-[#B5F823]">
                <Box className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Interactive 3D Configurator
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Design your commercial restroom layout directly in your browser. Select compact board thicknesses, test finish swatches, choose hardware grades, and export your setup.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  "Live 3D cubicle model rendering",
                  "Finish swatches: Woodgrains, solids & textures",
                  "Hardware finish toggles (Golden, Black, SS)",
                  "Instant specification summary & BOQ ready",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-gray-300">
                    <Check className="w-4 h-4 text-[#7FB706] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <Button
                size="lg"
                className="w-full bg-[#7FB706] hover:bg-[#6fa005] text-black font-bold flex items-center justify-center gap-2"
                onClick={() => navigate("/configure-cubicle")}
              >
                <span>Launch 3D Configurator</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CommercialTypologyExplorer({ navigate }: { navigate: (path: string) => void }) {
  const typologies = [
    {
      icon: Plane,
      title: "Airports & Transit Hubs",
      desc: "Heavy-duty anti-vandalism cubicles engineered for 24/7 non-stop throughput with continuous top headrail extrusions.",
      badge: "High Vandal Resistance",
    },
    {
      icon: Building,
      title: "Corporate IT Parks & Offices",
      desc: "Executive full-height privacy cubicles featuring Golden PVD / Matte Black fittings and premium acoustic dampening.",
      badge: "Grade-A Workspaces",
    },
    {
      icon: ShoppingBag,
      title: "Shopping Malls & Retail Hubs",
      desc: "Chemical-resistant, graffiti-proof partitions built for rapid sanitization cycles and high footfall durability.",
      badge: "Rapid Sanitization",
    },
    {
      icon: HeartPulse,
      title: "Hospitals & Healthcare Facilities",
      desc: "Non-porous, antibacterial solid phenolic laminate surfaces impervious to hospital-grade disinfectants and steam.",
      badge: "Anti-Microbial / Non-Porous",
    },
    {
      icon: Hotel,
      title: "Luxury Hotels & Resorts",
      desc: "Sleek designer textures with woodgrain laminates, minimalist gap clearances, and architectural hardware.",
      badge: "Architectural Luxury",
    },
    {
      icon: GraduationCap,
      title: "Educational Institutes & Gyms",
      desc: "100% moisture-proof, water-resistant cubicles and lockers with safety hinges and rounded impact-resistant corners.",
      badge: "Impact & Moisture Proof",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-[#030213] text-gray-900 dark:text-white transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#7FB706] mb-2 block">
            Targeted Building Typologies
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            Tailored Engineering for Every Architecture
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
            From transit terminals with tens of thousands of daily commuters to luxury hospitality suites, our systems are calibrated to the rigorous demands of your facility.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {typologies.map((t, idx) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="p-6 sm:p-7 rounded-3xl bg-gray-50 dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 hover:border-[#7FB706]/40 transition-all shadow-md group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-[#7FB706] group-hover:scale-110 group-hover:bg-[#7FB706]/10 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#7FB706]/10 text-[#7FB706] border border-[#7FB706]/20 uppercase tracking-wide">
                      {t.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#7FB706] transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t.desc}
                  </p>
                </div>

                <div 
                  onClick={() => navigate("/products/restroom-cubicles")}
                  className="pt-5 mt-4 border-t border-gray-200/60 dark:border-white/5 flex items-center text-xs font-bold text-[#7FB706] gap-1.5 group-hover:gap-2.5 transition-all cursor-pointer"
                >
                  <span>Explore Solutions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ModernTurnkeyProcess() {
  const steps = [
    {
      num: "01",
      title: "Space Planning & CAD BOQ",
      desc: "Share your floor plan or architectural drawings (.dwg/.pdf). We generate 2D layouts, elevation renders, and an itemized component BOQ within 24 hours.",
      icon: Compass,
      tag: "24-Hr Turnaround",
    },
    {
      num: "02",
      title: "CNC Precision Milling",
      desc: "Panels are cut, routed, and edge-beveled on computerized multi-axis CNC machines with millimeter tolerance for flawless alignment.",
      icon: Ruler,
      tag: "Millimeter Precision",
    },
    {
      num: "03",
      title: "Dry-Fit QC Inspection",
      desc: "Prior to packaging, cubicle assemblies undergo test dry-fitting, hinge stress verification, and hardware quality signoff at our ISO facility.",
      icon: ShieldCheck,
      tag: "Zero-Defect QA",
    },
    {
      num: "04",
      title: "Pan-India Turnkey Installation",
      desc: "Flat-pack delivered in moisture-barrier film with factory-certified installation technicians dispatched for clean, zero-disruption site execution.",
      icon: Truck,
      tag: "Pan-India Certified",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gray-50 dark:bg-[#060515] text-gray-900 dark:text-white transition-colors border-y border-gray-200 dark:border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#7FB706] mb-2 block">
            Turnkey Delivery Framework
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            From Architectural Drawing to Live Installation
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
            Our streamlined engineering pipeline ensures timely project delivery, zero site rework, and complete alignment with your architectural specifications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="relative p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 shadow-lg flex flex-col justify-between group hover:border-[#7FB706]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-extrabold font-mono text-[#7FB706]/30 group-hover:text-[#7FB706] transition-colors">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10">
                      {step.tag}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#7FB706]/10 flex items-center justify-center text-[#7FB706] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhyChooseUsSection({ navigate }: { navigate: (path: string) => void }) {
  const points = [
    "ISO 9001:2015 certified precision manufacturing",
    "Solid compact laminate boards with Class 1 fire retardancy",
    "Dual Warranty: 10-year board & 1-year direct hardware replacement",
    "Pan-India certified installation network across 20+ states",
    "Dedicated after-sales support & stock replacement guarantee",
  ];

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-[#030213] transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#7FB706] mb-2 block">
              Architectural Reliability
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Why Commercial Projects Choose Pacific
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
              With over 12 years of specialized engineering, Pacific Restroom Cubicles delivers uncompromising structural durability, aesthetic refinement, and guaranteed compliance for India's leading architectural projects.
            </p>
            <div className="space-y-3 sm:space-y-4">
              {points.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#7FB706] flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">{point}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" onClick={() => navigate("/about")}>
                Learn More About Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/contact")}>
                Contact Engineering Desk
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative mt-6 lg:mt-0"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] border border-gray-200 dark:border-white/10 shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Pacific Restroom Cubicle Architectural Installation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-4 sm:-bottom-6 sm:-left-6 bg-[#030213] border border-[#7FB706]/40 text-white rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#B5F823]">12+</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium mt-1">Years of Manufacturing Excellence</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ArchitectBOMToolkit({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-[#030213] text-gray-900 dark:text-white transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#121226] via-[#0a0a1a] to-[#030213] border border-[#7FB706]/30 shadow-2xl relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#7FB706]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#7FB706]/20 text-[#B5F823] border border-[#7FB706]/30 uppercase tracking-wider inline-flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Architect &amp; Contractor Toolkit
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Need an Itemized BOQ &amp; Architectural Layout for Your Project?
              </h2>
              <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
                Submit your floor plans, CAD drawings (<code className="text-[#B5F823]">.dwg</code>, <code className="text-[#B5F823]">.pdf</code>), or rough cubicle dimensions. Our technical estimation desk will prepare a comprehensive quotation with complete hardware specifications in 24 hours.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#7FB706]" />
                  <span>Free CAD Layout &amp; Estimation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#7FB706]" />
                  <span>Pan-India Supply &amp; Install Support</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#7FB706]" />
                  <span>Samples &amp; Finishes Sent on Request</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Button
                size="lg"
                className="bg-[#7FB706] hover:bg-[#6fa005] text-black font-bold flex items-center justify-center gap-2"
                onClick={() => navigate("/contact")}
              >
                <span>Request Project BOQ</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
              <button
                type="button"
                onClick={() => window.open("https://wa.me/919818592113", "_blank")}
                className="px-6 py-3.5 rounded-xl border border-white/20 hover:border-[#7FB706] bg-white/5 hover:bg-white/10 text-white font-semibold text-sm flex items-center justify-center gap-2 transition min-h-[44px]"
              >
                <span>WhatsApp Architectural Desk</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Master HomePage Component ──────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <SEO
        title="Restroom Cubicles Manufacturer India | Toilet Partitions, Cladding &amp; Lockers"
        description="Pacific Products &amp; Solutions — India's #1 manufacturer of restroom cubicles, toilet partitions, exterior cladding, locker systems &amp; custom hardware. ISO 9001:2015 certified. Pan-India turnkey installation. Get a free quote today."
        keywords={`${DEFAULT_KEYWORDS}, restroom cubicles manufacturer Delhi, toilet partitions manufacturer India, exterior cladding supplier India, HPL cubicle system, locker system supplier India, compact laminate partitions`}
        canonical="/"
        jsonLd={[
          organizationSchema(),
          webSiteSchema(),
          aggregateRatingSchema(),
          speakableSchema(["h1", "h2", ".speakable"]),
          faqSchema([
            { question: "What products does Pacific Products & Solutions manufacture?", answer: "Pacific Products & Solutions manufactures premium restroom cubicles, toilet partitions, shower cubicles, exterior cladding, locker systems, wall paneling, and custom hardware for commercial spaces across India." },
            { question: "Where is Pacific Products & Solutions located?", answer: "Pacific Products & Solutions has regional hubs in Delhi NCR (Head Office), Bangalore, and Kolkata, serving pan-India commercial and institutional clients." },
            { question: "What is the warranty on Pacific Products installations?", answer: "All Pacific Products installations come with a 10-year compact board warranty and a 1-year direct hardware replacement warranty." },
          ])
        ]}
      />
      <h1 className="sr-only">Pacific Products &amp; Solutions — Premium Restroom Cubicles, Cladding &amp; Interior Solutions</h1>

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Architectural Standards & Specification Strip (Replaced Stats Banner) */}
      <ArchitecturalTrustStrip />

      {/* 3. 4-Category Architectural Bento Grid (Replaced generic services/solutions) */}
      <CategoryBentoGrid navigate={navigate} />

      {/* 4. Featured Architectural Models (Live from Supabase) */}
      <FeaturedServices />

      {/* 5. Material & Engineering Deep-Dive (Solid Phenolic Core & Hardware Matrix) */}
      <MaterialEngineeringDeepDive navigate={navigate} />

      {/* 6. Commercial Typology Explorer (Airports, IT Parks, Malls, Healthcare, etc.) */}
      <CommercialTypologyExplorer navigate={navigate} />

      {/* 7. Modern Turnkey Engineering Process Stepper (CAD to Installation) */}
      <ModernTurnkeyProcess />

      {/* 8. Why Choose Pacific Products & Solutions */}
      <WhyChooseUsSection navigate={navigate} />

      {/* 9. Architect & Contractor BOQ Toolkit (High-Intent Conversion Card) */}
      <ArchitectBOMToolkit navigate={navigate} />
    </div>
  );
}