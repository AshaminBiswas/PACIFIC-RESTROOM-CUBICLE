import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Search, HelpCircle, MessageSquarePlus, X } from "lucide-react";
import { loadFAQs, getCategories, type FAQ } from "../../lib/faq-data";
import { usePageBanner } from "../../lib/hooks";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/Button";
import { Link } from "react-router";
import { SEO } from "../components/SEO";
import { faqSchema } from "../../lib/seo-data";

const DEFAULT_BG =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&q=80";

// ── FAQ Accordion Item ───────────────────────────────────────────────────────

function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: FAQ;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [faq.answer]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? "border-[#7FB706]/50 dark:border-[#7FB706]/40 shadow-lg shadow-[#7FB706]/10"
          : "border-gray-200 dark:border-white/10 hover:border-[#7FB706]/30 dark:hover:border-[#7FB706]/25"
      } bg-white dark:bg-[#0a0a1a]`}
    >
      {/* Question Row */}
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-4 p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FB706]/50"
        aria-expanded={isOpen}
      >
        {/* Number badge */}
        <motion.span
          animate={{
            backgroundColor: isOpen ? "#7FB706" : "transparent",
            color: isOpen ? "#ffffff" : "#7FB706",
            borderColor: isOpen ? "#7FB706" : "#7FB706",
          }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold mt-0.5"
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>

        {/* Question text */}
        <span
          className={`flex-1 text-base sm:text-lg font-semibold transition-colors duration-200 leading-snug ${
            isOpen
              ? "text-[#7FB706]"
              : "text-gray-900 dark:text-white group-hover:text-[#7FB706]"
          }`}
        >
          {faq.question}
        </span>

        {/* Chevron icon */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className={`flex-shrink-0 mt-1 transition-colors duration-200 ${
            isOpen
              ? "text-[#7FB706]"
              : "text-gray-400 dark:text-gray-500 group-hover:text-[#7FB706]"
          }`}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      {/* Answer – smooth height animation */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? height : 0, opacity: isOpen ? 1 : 0 }}
        transition={{
          height: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2, delay: isOpen ? 0.05 : 0 },
        }}
        style={{ overflow: "hidden" }}
      >
        <div ref={contentRef}>
          {/* Green bar */}
          <motion.div
            initial={false}
            animate={{ scaleX: isOpen ? 1 : 0 }}
            transition={{ duration: 0.35, delay: isOpen ? 0.1 : 0 }}
            style={{ transformOrigin: "left" }}
            className="mx-6 h-px bg-gradient-to-r from-[#7FB706] to-[#B5F823] mb-5 rounded-full"
          />
          <p className="px-6 pb-6 pl-[4.5rem] text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
            {faq.answer}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Category Pill ────────────────────────────────────────────────────────────

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 380, damping: 20 }}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 whitespace-nowrap ${
        active
          ? "bg-[#7FB706] border-[#7FB706] text-white shadow-md shadow-[#7FB706]/25"
          : "bg-white dark:bg-[#0a0a1a] border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#7FB706]/50 hover:text-[#7FB706] dark:hover:text-[#7FB706]"
      }`}
    >
      {label}
    </motion.button>
  );
}

// ── Main FAQ Page ────────────────────────────────────────────────────────────

export default function FAQPage() {
  const { data: banner } = usePageBanner("faq");
  const [faqs] = useState<FAQ[]>(() => loadFAQs());
  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...getCategories(faqs)],
    [faqs]
  );

  const filtered = useMemo(() => {
    let list = faqs;
    if (activeCategory !== "All") {
      list = list.filter((f) => f.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => a.sort_order - b.sort_order);
  }, [faqs, activeCategory, search]);

  const toggle = (id: string) =>
    setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-[#030213] transition-colors">
      <SEO
        title="Frequently Asked Questions"
        description="Find answers to common questions about Pacific Products restroom cubicles, cladding, locker systems, installation, warranty, and pricing."
        canonical="/faq"
        jsonLd={faqSchema(faqs)}
      />
      {/* ── Hero Banner ── */}
      {banner?.image_url && (
        <section className="relative w-full h-[36vh] min-h-[240px] overflow-hidden">
          <ImageWithFallback
            src={banner.image_url}
            alt="FAQ banner"
            className="absolute inset-0 w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/70" />
        </section>
      )}

      {/* ── Search & Filter ── */}
      <section className="py-10 sm:py-14 bg-white dark:bg-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative mb-8"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpenId(null);
              }}
              placeholder="Search questions…"
              className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#7FB706] focus:ring-2 focus:ring-[#7FB706]/20 transition-all text-base shadow-sm"
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-[#7FB706] hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Category pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {categories.map((cat) => (
              <CategoryPill
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenId(null);
                }}
              />
            ))}
          </motion.div>

          {/* Results count */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`${activeCategory}-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-500 dark:text-gray-400 mb-6"
            >
              {filtered.length === 0
                ? "No questions found."
                : `Showing ${filtered.length} question${filtered.length !== 1 ? "s" : ""}${
                    activeCategory !== "All" ? ` in "${activeCategory}"` : ""
                  }${search ? ` for "${search}"` : ""}`}
            </motion.p>
          </AnimatePresence>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            <AnimatePresence>
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16"
                >
                  <HelpCircle className="w-14 h-14 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                    No results found
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">
                    Try a different search term or browse by category.
                  </p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setActiveCategory("All");
                    }}
                    className="mt-4 text-[#7FB706] text-sm font-semibold hover:underline"
                  >
                    Clear filters
                  </button>
                </motion.div>
              ) : (
                filtered.map((faq, i) => (
                  <FAQItem
                    key={faq.id}
                    faq={faq}
                    index={i}
                    isOpen={openId === faq.id}
                    onToggle={() => toggle(faq.id)}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Stats Band ── */}
      <section className="py-12 bg-[#030213] dark:bg-[#0a0a1a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { number: "12+", label: "Years Experience" },
              { number: "600+", label: "Projects Completed" },
              { number: "50+", label: "Cities Covered" },
              { number: "5yr", label: "Product Warranty" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-[#B5F823] mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Still have questions CTA ── */}
      <section className="py-16 sm:py-20 bg-white dark:bg-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#7FB706] to-[#B5F823] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#7FB706]/25">
              <MessageSquarePlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Our team is happy to help. Reach out and we'll get back to you
              within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => (window.location.href = "/contact")}>
                Contact Us
              </Button>
              <a
                href="https://wa.me/919818592113"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-semibold transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
