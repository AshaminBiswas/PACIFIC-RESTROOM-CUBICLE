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
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "../components/Button";
import { SEO } from "../components/SEO";
import { organizationSchema, webSiteSchema, DEFAULT_KEYWORDS, aggregateRatingSchema, speakableSchema, faqSchema } from "../../lib/seo-data";
import { ServiceCard } from "../components/ServiceCard";
import { ProductCard } from "../components/ProductCard";
import { TestimonialCarousel } from "../components/TestimonialCarousel";
import { AnimatedCounter } from "../components/AnimatedCounter";

import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import type { Product, Solution } from "../../lib/database.types";

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


// ── Page ──────────────────────────────────────────────────────


import { useSolutions, useHeroImages, useCoreServices } from "../../lib/hooks";
import { DynamicIcon } from "../components/DynamicIcon";
import { ImageWithFallback as SolutionImage } from "../components/figma/ImageWithFallback";
import { CoreServiceCard } from "../components/CoreServiceCard";
import { FeaturedServices } from "../components/FeaturedServices";
import { ChevronLeft, ChevronRight } from "lucide-react";

const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || '';

function SolutionsCarousel({ solutions, navigate }: { solutions: any[]; navigate: (path: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('[data-sol-card]') as HTMLElement;
    const w = card ? card.offsetWidth + 24 : 380;
    el.scrollBy({ left: dir === 'left' ? -w : w, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Left button — desktop only */}
      <button
        onClick={() => scroll('left')}
        disabled={!canLeft}
        className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 shadow-lg items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#7FB706] hover:text-white hover:border-[#7FB706] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        onScroll={updateButtons}
        className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory lg:snap-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {solutions.map((solution, index) => (
          <motion.div
            data-sol-card
            key={solution.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(index * 0.08, 0.4), duration: 0.5 }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col bg-white dark:bg-[#0a0a1a] rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer shrink-0 snap-start"
            style={{ width: 'clamp(280px, 80vw, 380px)' }}
            onClick={() => navigate(`/solutions/${solution.slug}`)}
          >
            {/* Glow border on hover */}
            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" style={{ boxShadow: 'inset 0 0 0 1.5px #7FB706' }} />

            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-900 z-10">
              <SolutionImage src={solution.image_url} alt={solution.title} className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-[#7FB706] opacity-0 group-hover:opacity-20 transition-opacity duration-500 mix-blend-overlay" />
              <div className="absolute bottom-4 left-6">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-[#7FB706]/20 group-hover:border-[#7FB706]/50 transition-colors duration-500">
                  <DynamicIcon name={solution.icon_name} className="w-6 h-6 text-[#B5F823]" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-6 z-10 relative bg-white dark:bg-[#0a0a1a]">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-[#7FB706]">{solution.title}</h3>
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:bg-[#7FB706] group-hover:text-white transition-colors duration-500 shrink-0 mt-0.5">
                  <ArrowRight className="w-4 h-4 transform transition-transform duration-500 group-hover:translate-x-1" />
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1 mb-5 line-clamp-2">
                {solution.subtitle || stripHtml(solution.description)}
              </p>
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/10 flex items-center text-sm font-semibold text-gray-400 group-hover:text-[#7FB706] transition-colors duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#7FB706] to-[#B5F823] group-hover:w-full transition-all duration-700 ease-out" />
                Explore Solution <ArrowRight className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </motion.div>
        ))}

        {/* View All card at end */}
        <div className="shrink-0 snap-start flex items-center justify-center" style={{ width: 'clamp(200px, 50vw, 260px)' }}>
          <button
            onClick={() => navigate('/solutions')}
            className="flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 hover:border-[#7FB706] hover:text-[#7FB706] transition-all duration-300 w-full h-full justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-[#7FB706]/10">
              <ArrowRight className="w-6 h-6" />
            </div>
            <span className="font-semibold text-sm text-center">View All Solutions</span>
          </button>
        </div>
      </div>

      {/* Right button — desktop only */}
      <button
        onClick={() => scroll('right')}
        disabled={!canRight}
        className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/10 shadow-lg items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#7FB706] hover:text-white hover:border-[#7FB706] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function StatsSection() {
  const stats = [
    { label: "Experience", value: 12, suffix: "+ Years", icon: Award },
    { label: "Projects completed", value: 600, suffix: "+", icon: CheckCircle2 },
    { label: "Happy Clients", value: 100, suffix: "+", icon: Users },
    { label: "Offices", value: 4, suffix: " Across India", icon: Building2 },
    { label: "Warranty", value: 5, suffix: "-Year Warranty", icon: Shield },
  ];

  return (
    <section className="bg-[#030213] text-white py-12 border-y border-[#7FB706]/20 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#7FB706]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#B5F823]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center text-center">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex flex-col items-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:border-[#7FB706] group-hover:bg-[#7FB706]/10 transition-all duration-300">
                  <Icon className="w-6 h-6 text-[#B5F823] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7FB706] to-[#B5F823]">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-xs sm:text-sm text-gray-400 font-medium uppercase tracking-wider mt-2 group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  const { data: solutions, loading: loadingSolutions } = useSolutions();
  const { data: coreServices, loading: loadingCoreServices } = useCoreServices();

  return (
    <div className="min-h-screen">
      <SEO
        title="Restroom Cubicles Manufacturer India | Toilet Partitions, Cladding & Lockers"
        description="Pacific Products & Solutions — India's #1 manufacturer of restroom cubicles, toilet partitions, exterior cladding, locker systems & custom hardware. ISO 9001:2015 certified. 600+ projects across Delhi, Mumbai, Bangalore & Dubai. Get a free quote today."
        keywords={`${DEFAULT_KEYWORDS}, restroom cubicles manufacturer Delhi, toilet partitions manufacturer India, exterior cladding supplier India, HPL cubicle system, locker system supplier India, compact laminate partitions`}
        canonical="/"
        jsonLd={[
          organizationSchema(),
          webSiteSchema(),
          aggregateRatingSchema(),
          speakableSchema(["h1", "h2", ".speakable"]),
          faqSchema([
            { question: "What products does Pacific Products & Solutions manufacture?", answer: "Pacific Products & Solutions manufactures premium restroom cubicles, toilet partitions, shower cubicles, exterior cladding, locker systems, wall paneling, and custom hardware for commercial spaces across India and the UAE." },
            { question: "Where is Pacific Products & Solutions located?", answer: "Pacific Products & Solutions has offices in Delhi (head office), Mumbai, Bangalore, Ahmedabad, Kolkata, and Dubai UAE. They serve pan-India and international clients." },
            { question: "What is the warranty on Pacific Products installations?", answer: "All Pacific Products installations come with a 5-year comprehensive warranty covering manufacturing defects, with extended warranty options available." },
          ])
        ]}
      />
      <h1 className="sr-only">Pacific Products & Solutions — Premium Restroom Cubicles, Cladding & Interior Solutions</h1>

      {/* ══════════════════════════════════════════════════════
          HERO — untouched
      ══════════════════════════════════════════════════════ */}
      <HeroSection />

      {/* ══════════════════════════════════════════════════════
          NEW: STATS BANNER
      ══════════════════════════════════════════════════════ */}
      <StatsSection />

      {/* ══════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════════════════════ */}
      <FeaturedServices />

      {/* ══════════════════════════════════════════════════════
          OUR SOLUTIONS
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#f7fef0] dark:bg-[#0a0a1a] transition-colors overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4"
          >
            <div>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
                Industry-specific solutions tailored to meet your unique requirements
              </p>
            </div>
            {/* Desktop scroll buttons */}
            {solutions && solutions.length > 0 && (() => {
              const scrollRef = { current: null as HTMLDivElement | null };
              const scroll = (dir: 'left' | 'right') => {
                if (scrollRef.current) {
                  const card = scrollRef.current.querySelector('[data-sol-card]') as HTMLElement;
                  const w = card ? card.offsetWidth + 24 : 360;
                  scrollRef.current.scrollBy({ left: dir === 'left' ? -w : w, behavior: 'smooth' });
                }
              };
              return null;
            })()}
          </motion.div>

          {loadingSolutions ? (
            <div className="text-center text-gray-500 py-10">Loading solutions...</div>
          ) : solutions && solutions.length > 0 ? (
            <SolutionsCarousel solutions={solutions} navigate={navigate} />
          ) : (
            <div className="text-center text-gray-500 py-10">
              No solutions yet. Add some from the Admin Dashboard!
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#E9FDBF]/30 to-white dark:from-[#0a0a1a] dark:to-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#030213] dark:text-white mb-3 sm:mb-4">
              Our Process
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
              A streamlined approach from consultation to installation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { step: "01", title: "Consultation", description: "We discuss your requirements, space constraints, and design preferences." },
              { step: "02", title: "Design & Quote", description: "Our team creates custom designs and provides a detailed, transparent quote." },
              { step: "03", title: "Manufacturing", description: "Products are precision-manufactured in our ISO-certified facility." },
              { step: "04", title: "Installation", description: "Professional installation by our trained team with minimal disruption." },
            ].map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pb-8 lg:pb-0"
              >
                <div className="bg-gradient-to-br from-[#E9FDBF] to-white dark:from-[#030213] dark:to-[#0a0a1a] rounded-2xl p-6 sm:p-8 border border-[#7FB706]/20 dark:border-white/10 h-full">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#7FB706]/20 mb-3 sm:mb-4">
                    {process.step}
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#030213] dark:text-white mb-2 sm:mb-3">
                    {process.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{process.description}</p>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#7FB706] rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#7FB706]/30 z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Core Services */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-transparent dark:bg-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#030213] dark:text-white mb-3 sm:mb-4">
              Our Core Services
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
              Comprehensive interior contracting solutions engineered for excellence
            </p>
          </motion.div>

          {loadingCoreServices ? (
            <div className="text-center text-gray-500 py-10">Loading core services...</div>
          ) : coreServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {coreServices.map((service, index) => (
                <CoreServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              No core services yet. Add some from the Admin Dashboard!
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-transparent dark:bg-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#030213] dark:text-white mb-4 sm:mb-6">
                Why Choose Pacific Products?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
                With over 12 years of experience, we deliver unmatched quality and
                innovation in every project we undertake.
              </p>
              <div className="space-y-3 sm:space-y-4">
                {[
                  "ISO certified manufacturing processes",
                  "Custom design and engineering capabilities",
                  "Pan-India installation network",
                  "5-year product warranty",
                  "Dedicated after-sales support",
                ].map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#7FB706] flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{point}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 sm:mt-8">
                <Button size="lg" onClick={() => navigate("/about")}>
                  Learn More About Us
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative mt-6 lg:mt-0"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/10]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Modern office interior"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#7FB706]/20 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#7FB706] text-white rounded-2xl p-4 sm:p-6 shadow-xl">
                <div className="text-2xl sm:text-3xl font-bold">12+</div>
                <div className="text-xs sm:text-sm opacity-90">Years of Excellence</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialCarousel />

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-[#7FB706] to-[#6fa005] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-[#B5F823] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Transform Your Space?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 px-2">
              Get in touch with our team for a free consultation and detailed quote for your project
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => navigate("/contact")}
              >
                Get Free Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <button
                onClick={() => window.open("https://wa.me/919818592113", "_blank")}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-white text-[#7FB706] rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 font-medium"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}