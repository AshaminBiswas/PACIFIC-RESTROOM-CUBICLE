import { motion } from "motion/react";
import { ProductCard } from "../components/ProductCard";
import { useSearchParams, useParams, Link, useNavigate } from "react-router";
import { useProducts, usePageBanner } from "../../lib/hooks";
import { SEO } from "../components/SEO";
import { DEFAULT_KEYWORDS, itemListSchema, faqSchema } from "../../lib/seo-data";
import { PageHero } from "../components/PageHero";
import { ShieldCheck, Award, ArrowRight, Layers, FileText, Phone, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "../components/Button";

interface ProductsPageProps {
  categorySlug?: string;
}

interface CategoryMeta {
  key: string;
  name: string;
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
}

const CATEGORY_DEFINITIONS: Record<string, CategoryMeta> = {
  "restroom-cubicles": {
    key: "restroom-cubicles",
    name: "Restroom Cubicles",
    slug: "restroom-cubicles",
    title: "Restroom Cubicle Systems",
    subtitle: "Precision-engineered 12mm & 18mm solid compact laminate cubicles with heavy-duty Grade 304/316 SS, Polyamide nylon, and Aluminium profile hardware.",
    badge: "Dual Warranty: 10-Yr Board & 1-Yr Hardware",
  },
  "lockers": {
    key: "lockers",
    name: "Lockers",
    slug: "lockers",
    title: "Modular HPL Locker Systems",
    subtitle: "High-density phenolic compact laminate lockers with digital cam locks, master key systems, and integrated ventilation slots for commercial spaces.",
    badge: "Heavy-Duty Phenolic Core",
  },
  "urinal-partitions": {
    key: "urinal-partitions",
    name: "Urinal Partitions",
    slug: "urinal-partitions",
    title: "Urinal Partition Screens",
    subtitle: "Hygienic, anti-bacterial compact laminate modesty partition screens in cantilever wall-hung and floor-supporting configurations.",
    badge: "100% Waterproof & Anti-Bacterial",
  },
  "kids-toilet": {
    key: "kids-toilet",
    name: "Kids Cubicle",
    slug: "kids-toilet",
    title: "Kids & Preschool Safety Cubicles",
    subtitle: "Specially designed compact cubicles featuring anti-finger pinch safety clearances, rounded corners, and emergency exterior coin release.",
    badge: "Child-Safe Engineering Standard",
  },
};

function normalizeCategorySlug(raw?: string): string | null {
  if (!raw) return null;
  const s = raw.toLowerCase().trim();
  if (s.includes("cubicle") && !s.includes("kid")) return "restroom-cubicles";
  if (s.includes("locker")) return "lockers";
  if (s.includes("urinal") || s.includes("partition")) return "urinal-partitions";
  if (s.includes("kid")) return "kids-toilet";
  if (CATEGORY_DEFINITIONS[s]) return s;
  return null;
}

function toProductCategorySlug(category: string | undefined): string {
  if (!category) return "restroom-cubicles";
  const cat = category.toLowerCase().trim();
  if (cat.includes("cubicle") && !cat.includes("kid")) return "restroom-cubicles";
  if (cat.includes("locker")) return "lockers";
  if (cat.includes("urinal") || cat.includes("partition")) return "urinal-partitions";
  if (cat.includes("kid")) return "kids-toilet";
  return cat.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ProductsPage({ categorySlug: propCategorySlug }: ProductsPageProps) {
  const { data: products, loading } = useProducts();
  const { data: banner } = usePageBanner("services");
  const [searchParams] = useSearchParams();
  const routeParams = useParams<{ categorySlug?: string; slug?: string }>();
  const navigate = useNavigate();

  // Determine active category slug from prop, route params, or query string
  const activeSlug =
    normalizeCategorySlug(propCategorySlug) ||
    normalizeCategorySlug(routeParams.categorySlug) ||
    normalizeCategorySlug(routeParams.slug) ||
    normalizeCategorySlug(searchParams.get("category") || undefined);

  const activeCategoryMeta = activeSlug ? CATEGORY_DEFINITIONS[activeSlug] : null;

  // Separate real database models from demo/fallback items
  const realProducts = (products || []).filter(
    (p) => p.published !== false && !p.id?.startsWith("prod-") && !p.id?.startsWith("demo-")
  );
  const activePool = realProducts.length > 0 ? realProducts : (products || []);

  // Filter products by selected category
  const filteredProducts = activeSlug
    ? activePool.filter((p) => {
        const productCatSlug = toProductCategorySlug(p.category);
        return productCatSlug === activeSlug;
      })
    : activePool;

  // Count models per category for tab badges
  const categoryCounts = {
    all: activePool.length,
    "restroom-cubicles": activePool.filter((p) => toProductCategorySlug(p.category) === "restroom-cubicles").length,
    "lockers": activePool.filter((p) => toProductCategorySlug(p.category) === "lockers").length,
    "urinal-partitions": activePool.filter((p) => toProductCategorySlug(p.category) === "urinal-partitions").length,
    "kids-toilet": activePool.filter((p) => toProductCategorySlug(p.category) === "kids-toilet").length,
  };

  const pageTitle = activeCategoryMeta
    ? `${activeCategoryMeta.title} | Pacific Restroom Cubicle`
    : "Commercial Restroom Cubicles, Lockers & Partitions | Pacific";

  const heroTitle = activeCategoryMeta ? activeCategoryMeta.title : "Architectural Models & Systems";
  const heroSubtitle = activeCategoryMeta
    ? activeCategoryMeta.subtitle
    : "Precision-engineered compact laminate cubicles, modular locker systems, and partition modesty screens built for Indian commercial infrastructure.";
  const heroBreadcrumb = activeCategoryMeta ? activeCategoryMeta.name : "All Models";

  return (
    <div className="min-h-screen pt-20 bg-transparent dark:bg-[#030213] transition-colors">
      <SEO
        title={pageTitle}
        description={heroSubtitle}
        keywords={`${DEFAULT_KEYWORDS}, restroom cubicles buy India, toilet partition price India, HPL cubicle system, locker system manufacturer, urinal modesty partitions`}
        canonical={activeSlug ? `/products/${activeSlug}` : "/products"}
        jsonLd={[
          itemListSchema(
            filteredProducts.map((p) => ({
              name: p.title,
              url: `/products/${toProductCategorySlug(p.category)}/${p.slug}`,
              description: p.description || p.subtitle || p.title,
            }))
          ),
          faqSchema([
            {
              question: "What material is used for Pacific commercial cubicles?",
              answer:
                "Pacific restroom cubicles are fabricated using 12mm or 18mm solid compact phenolic laminate board with Class 1 fire retardancy (BS 476 Part 7) and 100% waterproof construction.",
            },
            {
              question: "What warranty is provided with Pacific cubicle systems?",
              answer:
                "We provide a dual warranty: 10-year warranty on the compact laminate board against swelling/delamination and 1-year replacement warranty on all hardware fittings.",
            },
            {
              question: "Do you supply and install pan-India?",
              answer:
                "Yes, we manufacture and execute turnkey supply & installation across Delhi NCR, Bangalore, Kolkata, Hyderabad, Chennai, and tier-1/tier-2 commercial projects pan-India.",
            },
          ]),
        ]}
      />

      {/* Hero Banner */}
      <PageHero
        title={heroTitle}
        accentWord={activeCategoryMeta ? activeCategoryMeta.name.split(" ")[0] : "Models"}
        subtitle={heroSubtitle}
        breadcrumb={heroBreadcrumb}
        backgroundImage={banner?.image_url}
      />

      {/* Category Navigation Tabs */}
      <div className="sticky top-20 z-30 bg-white/80 dark:bg-[#030213]/85 backdrop-blur-xl border-y border-gray-200 dark:border-white/10 py-3 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {/* All Models Tab */}
            <Link
              to="/products"
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                !activeSlug
                  ? "bg-[#7FB706] text-white shadow-md shadow-[#7FB706]/20"
                  : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              <span>All Systems</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  !activeSlug
                    ? "bg-white/25 text-white"
                    : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400"
                }`}
              >
                {categoryCounts.all}
              </span>
            </Link>

            {/* Restroom Cubicles */}
            <Link
              to="/products/restroom-cubicles"
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeSlug === "restroom-cubicles"
                  ? "bg-[#7FB706] text-white shadow-md shadow-[#7FB706]/20"
                  : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              <span>Restroom Cubicles</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeSlug === "restroom-cubicles"
                    ? "bg-white/25 text-white"
                    : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400"
                }`}
              >
                {categoryCounts["restroom-cubicles"]}
              </span>
            </Link>

            {/* Modular Lockers */}
            <Link
              to="/products/lockers"
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeSlug === "lockers"
                  ? "bg-[#7FB706] text-white shadow-md shadow-[#7FB706]/20"
                  : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              <span>Modular Lockers</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeSlug === "lockers"
                    ? "bg-white/25 text-white"
                    : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400"
                }`}
              >
                {categoryCounts.lockers}
              </span>
            </Link>

            {/* Urinal Partitions */}
            <Link
              to="/products/urinal-partitions"
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeSlug === "urinal-partitions"
                  ? "bg-[#7FB706] text-white shadow-md shadow-[#7FB706]/20"
                  : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              <span>Urinal Partitions</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeSlug === "urinal-partitions"
                    ? "bg-white/25 text-white"
                    : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400"
                }`}
              >
                {categoryCounts["urinal-partitions"]}
              </span>
            </Link>

            {/* Kids Toilet */}
            <Link
              to="/products/kids-toilet"
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeSlug === "kids-toilet"
                  ? "bg-[#7FB706] text-white shadow-md shadow-[#7FB706]/20"
                  : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              <span>Kids Safety Cubicles</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeSlug === "kids-toilet"
                    ? "bg-white/25 text-white"
                    : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400"
                }`}
              >
                {categoryCounts["kids-toilet"]}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Category Highlights Strip */}
      {activeCategoryMeta && (
        <div className="bg-gradient-to-r from-[#7FB706]/10 via-transparent to-[#B5F823]/5 border-b border-gray-100 dark:border-white/5 py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[#7FB706]/20 text-[#7FB706]">
                <Layers className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#7FB706]">
                  Category Specifications
                </span>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {activeCategoryMeta.badge}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <ShieldCheck className="w-4 h-4 text-[#7FB706]" />
              <span>Certified ISO 9001:2015 & BS 476 Part 7 Fire Rated Core</span>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <section className="py-12 sm:py-20 bg-transparent dark:bg-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-3 border-[#7FB706] border-t-transparent rounded-full animate-spin mb-4" />
              <div className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                Loading architectural models...
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => {
                const catSlug = toProductCategorySlug(product.category);
                const productPath = `/products/${catSlug}/${product.slug}`;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <ProductCard
                      title={product.title}
                      description={product.description || product.subtitle}
                      image={product.image_url}
                      path={productPath}
                    />
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="max-w-xl mx-auto py-16 px-6 text-center bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-3xl">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#7FB706]/15 text-[#7FB706] flex items-center justify-center mb-4">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No Models Listed Yet
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                We are currently updating our {activeCategoryMeta?.name || "architectural"} model specifications.
                Contact our architectural desk for custom configurations, CAD BOQ, and immediate delivery schedules.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button onClick={() => navigate("/products")}>
                  View All Models
                </Button>
                <a
                  href="https://wa.me/919818592113?text=Hello%20Pacific,%20I%20need%20custom%20specifications%20and%20BOQ%20for%20commercial%20cubicles."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600/20 border border-emerald-500/20 transition flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Desk</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* B2B Consultation Card */}
      <section className="pb-16 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#121226] to-[#030213] border border-white/10 relative overflow-hidden text-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-[#7FB706] uppercase tracking-wider flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4" />
                Architect & Estimator Support
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
                Need CAD BOQ Estimation or Custom Material Finish?
              </h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Submit your floor plans (`.dwg` or `.pdf`) to our technical estimation team. We deliver complete itemized BOQ, shop drawings, and pricing schedules within 24 hours.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 flex-shrink-0">
              <Link to="/contact">
                <Button size="lg" className="bg-[#7FB706] hover:bg-[#6ea105] text-white">
                  <span>Submit Drawings</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a
                href="tel:+919818592113"
                className="px-6 py-3 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition flex items-center gap-2 min-h-[48px]"
              >
                <Phone className="w-4 h-4 text-[#7FB706]" />
                <span>+91 98185 92113</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
