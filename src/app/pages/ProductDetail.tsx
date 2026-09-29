import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
import {
  CheckCircle2, Shield, Zap, Award, ArrowRight, Phone,
  Clock, Wrench, BadgeCheck, Truck, HeadphonesIcon, Star,
  ChevronRight, Layers, Video, Film, Play, Eye,
  Palette, Sparkles, Check,
} from "lucide-react";
import { Button } from "../components/Button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useProduct, useCatalogs } from "../../lib/hooks";
import { CatalogCard, CatalogViewerModal } from "../components/CatalogViewer";
import { useState, useEffect } from "react";
import { SEO } from "../components/SEO";
import { productSchema, breadcrumbSchema } from "../../lib/seo-data";
import { RelatedProducts } from "../components/RelatedProducts";

interface ProductSpecification {
  label: string;
  value: string;
}

const COLOR_SWATCHES: Record<string, { bg: string; border: string; text: string; label: string; dot: string }> = {
  golden: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200',
    border: 'border-amber-500/30',
    text: 'text-amber-600 dark:text-amber-400',
    label: 'Golden PVD Finish',
    dot: 'bg-gradient-to-r from-amber-400 to-yellow-500 shadow-sm shadow-amber-500/50',
  },
  Black: {
    bg: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200',
    border: 'border-neutral-300 dark:border-neutral-700',
    text: 'text-neutral-900 dark:text-neutral-100',
    label: 'Matte Black Finish',
    dot: 'bg-neutral-900 dark:bg-neutral-700 border border-neutral-500 shadow-sm',
  },
  'stainless steel': {
    bg: 'bg-slate-100 dark:bg-slate-500/15 text-slate-800 dark:text-slate-200',
    border: 'border-slate-300 dark:border-slate-400/30',
    text: 'text-slate-700 dark:text-slate-300',
    label: 'Satin Stainless Steel',
    dot: 'bg-gradient-to-r from-slate-300 to-zinc-400 shadow-sm',
  },
};

function toCategorySlug(category: string | undefined) {
  if (!category) return "";
  const cat = category.toLowerCase().trim();
  if (cat.includes("cubicle") && !cat.includes("kid")) return "restroom-cubicles";
  if (cat.includes("locker")) return "lockers";
  if (cat.includes("urinal") || cat.includes("partition")) return "urinal-partitions";
  if (cat.includes("kid")) return "kids-toilet";
  return cat.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Helper: extract and format video embed info from YouTube, Vimeo, or direct URLs
function parseVideoSource(url: string): { type: "youtube" | "vimeo" | "native"; src: string } | null {
  if (!url) return null;
  const trimmed = url.trim();

  // YouTube match (watch?v=, youtu.be/, embed/, shorts/)
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`,
    };
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+))/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo",
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`,
    };
  }

  // Native HTML5 video (direct MP4/WebM/Supabase storage URL)
  return {
    type: "native",
    src: trimmed,
  };
}

export default function ProductDetailPage() {
  const { slug, productSlug, categorySlug } = useParams<{ slug: string; productSlug: string; categorySlug: string }>();
  const navigate = useNavigate();
  // Support both route patterns: /products/:slug and /products/:categorySlug/:productSlug
  const lookupSlug = productSlug || slug;
  const { data: product, loading } = useProduct(lookupSlug);
  const { data: catalogs } = useCatalogs(product?.id || undefined);
  const [showCatalogViewer, setShowCatalogViewer] = useState(false);
  const [currentMain, setCurrentMain] = useState<string | null>(null);
  const [activeColorIdx, setActiveColorIdx] = useState(0);

  // Redirect old /products/:slug URLs to /products/:categorySlug/:productSlug
  useEffect(() => {
    if (product && slug && !productSlug) {
      const catSlug = toCategorySlug(product.category);
      if (catSlug) {
        navigate(`/products/${catSlug}/${product.slug}`, { replace: true });
      }
    }
  }, [product, slug, productSlug, navigate]);

  // Collect all photos (image_url + additional_images), without duplicates
  const allImages = Array.from(new Set([
    product?.image_url,
    ...(product?.additional_images || [])
  ])).filter(Boolean) as string[];

  const mainImage = currentMain || (allImages.length > 0 ? allImages[0] : (product?.image_url || ""));

  // Collect all product videos (videos or video_urls or meta videos or legacy video_url)
  const metaVideos = (product?.specifications?.find((s: any) => s.label === '__hardware_meta')?.value as any)?.videos;
  const productVideos: string[] = [
    ...(Array.isArray(product?.videos) ? product.videos : []),
    ...(Array.isArray(product?.video_urls) ? product.video_urls : []),
    ...(Array.isArray(metaVideos) ? metaVideos : []),
    ...(typeof (product as any)?.video_url === 'string' ? [(product as any).video_url] : [])
  ].map(v => typeof v === 'string' ? v.trim() : '').filter(Boolean);
  const uniqueVideos = Array.from(new Set(productVideos));

  // Specifications for public rendering (filtering out internal metadata keys)
  const displaySpecs = (product?.specifications || []).filter((s) => !s.label.startsWith('__'));

  // Extract hardware metadata packed inside specifications JSON
  const hardwareMeta = (product?.specifications?.find((s: any) => s.label === '__hardware_meta')?.value as any);
  
  // Hardware options (SS Hardware, Nylon Hardware, colors)
  const rawHardwareOptions: Array<{ material: string; enabled: boolean; colors?: string[] }> = 
    Array.isArray(hardwareMeta?.hardwareOptions) ? hardwareMeta.hardwareOptions : [];
  
  // Hardware list (Itemized BOM)
  const rawHardwareList: Array<{ id?: string; name: string; notes?: string; material?: string; isExtraLeg?: boolean }> =
    Array.isArray(hardwareMeta?.hardwareList) ? hardwareMeta.hardwareList : [];

  const isCubicle = (product?.category || '').toLowerCase().includes('cubicle') && !(product?.category || '').toLowerCase().includes('kid');
  const isLocker = (product?.category || '').toLowerCase().includes('locker');
  const isUrinal = (product?.category || '').toLowerCase().includes('urinal') || (product?.category || '').toLowerCase().includes('partition');
  const isKids = (product?.category || '').toLowerCase().includes('kid');

  const defaultHardwareList = isCubicle || isKids
    ? [
        { id: "1", name: "Gravity Hinges (Self-Closing Pair)", notes: "Grade 304 SS / Concealed Heavy-Duty", material: "Both" },
        { id: "2", name: "Occupancy Indicator Lock with Emergency Release", notes: "Red/Green Vacant/Engaged Indicator Turn", material: "Both" },
        { id: "3", name: "Ergonomic Door Pull Handle / Knob", notes: "Dual-sided ergonomic architectural grip", material: "Both" },
        { id: "4", name: "Coat Hook with Integrated Rubber Buffer Stop", notes: "Internal door stop & apparel holder", material: "Both" },
        { id: "5", name: "Adjustable Supporting Legs (100–150mm)", notes: "Precision height leveler for wet floor clearance", material: "Both" },
      ]
    : isLocker
    ? [
        { id: "1", name: "Concealed Heavy-Duty Pivot Hinges", notes: "Rust-proof tamper-resistant internal hinge", material: "SS Hardware" },
        { id: "2", name: "Die-Cast Cam Lock with Master Key Override", notes: "Zinc alloy cylinder with dual numbered keys", material: "SS Hardware" },
        { id: "3", name: "Ventilation Louver Grilles", notes: "Engineered airflow slot inserts for fresh circulation", material: "Nylon Hardware" },
        { id: "4", name: "Acrylic Number Plates with Laser Infill", notes: "Sequential locker identification plates", material: "Standard OEM" },
        { id: "5", name: "Base Plinth Leveler Studs", notes: "Heavy-duty floor load distribution levelers", material: "Standard OEM" },
      ]
    : [
        { id: "1", name: "Heavy-Duty Stainless Steel Corner Brackets", notes: "Grade 304 U-channel & wall anchoring clamps", material: "SS Hardware" },
        { id: "2", name: "Expansion Anchors & Hex Fasteners", notes: "Concealed masonry fixing hardware", material: "SS Hardware" },
        ...(Boolean(hardwareMeta?.hasExtraLeg) ? [{ id: "3", name: "Adjustable Floor Supporting Leg (100–150mm)", notes: "Floor shoe bracket preventing cantilever wall strain", material: "SS Hardware", isExtraLeg: true }] : []),
      ];

  const hardwareList = rawHardwareList.length > 0 ? rawHardwareList : defaultHardwareList;

  const hasHardwareMeta = Boolean(hardwareMeta && Array.isArray(hardwareMeta.hardwareOptions));
  const ssOption = rawHardwareOptions.find(o => o.material === 'SS Hardware' && o.enabled !== false) ||
    (!hasHardwareMeta && (isCubicle || isKids) ? { material: 'SS Hardware', enabled: true, colors: ['golden', 'Black', 'stainless steel'] } : null);
  const nylonOption = rawHardwareOptions.find(o => o.material === 'Nylon Hardware' && o.enabled !== false) || null;
  const aluminiumOption = rawHardwareOptions.find(o => o.material === 'Aluminium Profile' && o.enabled !== false) || null;
  const hasExtraLeg = Boolean(hardwareMeta?.hasExtraLeg);

  // Build the canonical URL path with category
  const productUrl = product
    ? product.category
      ? `/products/${toCategorySlug(product.category)}/${product.slug}`
      : `/products/${product.slug}`
    : "";

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-[#030213]">
        <div className="text-center text-gray-500 dark:text-gray-400">Loading service...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-[#030213]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Service Not Found</h1>
          <Button onClick={() => navigate("/products")}>View All Services</Button>
        </div>
      </div>
    );
  }

  const isPremiumShowerCubicles = lookupSlug === "premium-shower-cubicles-supplier-in-india";
  const seoDescription = isPremiumShowerCubicles
    ? "Premium shower cubicles manufacturer in India offering luxury modular shower cubicle solutions for hotels, gyms, offices, hospitals, and commercial spaces. Waterproof, durable, hygienic, and modern shower partition systems by Pacific Product and Solution."
    : (product.description?.replace(/<[^>]+>/g, '').slice(0, 155) || `Premium ${product.title} solutions by Pacific Products & Solutions`);

  return (
    <div className="min-h-screen bg-white dark:bg-[#030213] transition-colors">
      <SEO
        title={product.title}
        description={seoDescription}
        canonical={productUrl}
        ogType="product"
        ogImage={product.image_url}
        jsonLd={[productSchema({ ...product, slug: productUrl.replace('/products/', '') }), breadcrumbSchema([
          {name: 'Home', url: '/'},
          {name: 'Products', url: '/products'},
          ...(product.category ? [{name: product.category, url: `/products?category=${encodeURIComponent(product.category)}`}] : []),
          {name: product.title, url: productUrl}
        ])]}
      />

      {/* ═══════════════════ HERO — DARK IMMERSIVE ═══════════════════ */}
      <section className="relative bg-[#030213] text-white overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #7FB706 0px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #7FB706 0px, transparent 1px, transparent 60px)" }} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 sm:pb-20 relative z-10">
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden sm:flex items-center gap-2 text-sm text-gray-500 mb-8">
            <button onClick={() => navigate("/")} className="hover:text-[#B5F823] transition-colors">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button onClick={() => navigate("/products")} className="hover:text-[#B5F823] transition-colors">Services</button>
            {product.category && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <button
                  onClick={() => navigate(`/products?category=${encodeURIComponent(product.category)}`)}
                  className="hover:text-[#B5F823] transition-colors"
                >
                  {product.category}
                </button>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">{product.title}</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            {/* Left: Text content */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              {product.category && (
                <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#B5F823] uppercase mb-4 bg-[#7FB706]/10 border border-[#7FB706]/20 px-4 py-1.5 rounded-full">
                  <Layers className="w-3.5 h-3.5" />
                  {product.category}
                </span>
              )}

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-[1.1]">
                {product.title}
              </h1>
              <p className="text-xl text-[#B5F823] font-medium mb-4">{product.subtitle}</p>
              <div 
                className="prose prose-sm sm:prose-base dark:prose-invert prose-p:text-gray-400 prose-headings:text-[#B5F823] prose-strong:text-white max-w-xl mb-8 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description || '' }}
              />

              {/* Inline stats */}
              <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-white/10">
                {[
                  { val: "12+", lbl: "Years Experience" },
                  { val: "10 Yr", lbl: "Board Warranty" },
                  { val: "1 Yr", lbl: "Hardware Warranty" },
                  { val: isCubicle || isKids ? "SS 304" : isLocker ? "Heavy-Duty" : "SS Clamps", lbl: "Hardware Grade" },
                  { val: "100%", lbl: "Waterproof" },
                ].map((s, i) => (
                  <div key={i} className="text-center sm:text-left">
                    <div className="text-2xl font-black text-[#B5F823]">{s.val}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.lbl}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg" onClick={() => navigate("/contact")}>
                  <Phone className="w-4 h-4 mr-2" />
                  Request Quote
                </Button>
                <a
                  href="#hardware-specs"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold border border-white/20 text-white hover:bg-white/10 hover:border-[#7FB706] transition-all"
                >
                  <Wrench className="w-4 h-4 mr-2 text-[#B5F823]" />
                  Hardware Specs
                </a>
                {catalogs.length > 0 && (
                  <Button size="lg" variant="outline" onClick={() => {
                    const link = document.createElement('a');
                    link.href = catalogs[0].file_url;
                    link.target = '_blank';
                    link.download = catalogs[0].title || 'catalog';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}>
                    Download Catalog
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Right: Image gallery */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] mb-4 ring-1 ring-white/10 shadow-2xl group">
                <ImageWithFallback src={mainImage} alt={product.title} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
                {allImages.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-white/90 border border-white/10 flex items-center gap-1.5 shadow-lg">
                    <Eye className="w-3.5 h-3.5 text-[#B5F823]" />
                    <span>{allImages.indexOf(mainImage) >= 0 ? allImages.indexOf(mainImage) + 1 : 1} / {allImages.length}</span>
                  </div>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5 max-h-52 overflow-y-auto p-1">
                  {allImages.map((img, idx) => {
                    const isActive = img === mainImage;
                    return (
                      <button
                        key={img + idx}
                        type="button"
                        onClick={() => setCurrentMain(img)}
                        className={`relative rounded-xl overflow-hidden aspect-[4/3] transition-all duration-300 ${
                          isActive
                            ? "ring-2 ring-[#B5F823] shadow-lg shadow-[#7FB706]/30 scale-[1.03]"
                            : "opacity-60 hover:opacity-100 ring-1 ring-white/10 hover:ring-[#7FB706]/50"
                        }`}
                        title={`View photo ${idx + 1}`}
                      >
                        <ImageWithFallback src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white dark:bg-[#030213]" style={{ borderRadius: "50% 50% 0 0", transform: "translateY(50%)" }} />
      </section>

      {/* ═══════════════════ KEY FEATURES ═══════════════════ */}
      {product.features && product.features.length > 0 && (
        <section className="pt-20 pb-16 sm:pb-20 lg:pb-24 bg-white dark:bg-[#030213] transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 sm:mb-16">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div>
                  <span className="text-xs font-bold tracking-widest text-[#7FB706] uppercase">Key Features</span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">Why This Model</h2>
                </div>
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.features.map((feature: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                  className="group relative bg-gradient-to-br from-gray-50 to-white dark:from-white/[0.03] dark:to-white/[0.01] rounded-2xl p-5 sm:p-6 border border-gray-100 dark:border-white/5 hover:border-[#7FB706]/40 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[#7FB706]/5 rounded-bl-[40px] group-hover:bg-[#7FB706]/10 transition-colors" />
                  <div className="relative flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#7FB706] shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base leading-relaxed">{feature}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════ SPECS + WHY CHOOSE US ═══════════════════ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#fafbf7] dark:bg-[#0a0a1a] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

            {/* Specifications */}
            {displaySpecs.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <span className="text-xs font-bold tracking-widest text-[#7FB706] uppercase">Technical Details</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-8">Specifications</h2>
                <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10">
                  {displaySpecs.map((spec: ProductSpecification, index: number) => (
                    <div key={index} className={`flex justify-between items-center px-5 sm:px-6 py-4 ${index % 2 === 0 ? "bg-white dark:bg-white/[0.03]" : "bg-gray-50/70 dark:bg-white/[0.01]"} ${index < displaySpecs.length - 1 ? "border-b border-gray-100 dark:border-white/5" : ""}`}>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">{spec.label}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm text-right ml-4">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Why Choose Us */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
              <span className="text-xs font-bold tracking-widest text-[#7FB706] uppercase">Our Commitment</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-8">Why Pacific</h2>
              <div className="space-y-3">
                {[
                  { icon: Shield, title: "Quality Assured", desc: "Rigorous testing with ISO-certified processes" },
                  { icon: Zap, title: "Fast Delivery", desc: "Industry-leading turnaround times" },
                  { icon: Award, title: "Expert Support", desc: "Dedicated project managers end-to-end" },
                  { icon: HeadphonesIcon, title: "After-Sales Care", desc: "1-yr hardware & 10-yr board warranty with responsive support" },
                  { icon: Star, title: "Custom Solutions", desc: "Tailored to your exact requirements" },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="group flex items-center gap-4 bg-white dark:bg-white/[0.03] rounded-xl px-5 py-4 border border-gray-100 dark:border-white/5 hover:border-[#7FB706]/30 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#7FB706]/10 flex items-center justify-center shrink-0 group-hover:bg-[#7FB706]/20 transition-colors">
                      <item.icon className="w-5 h-5 text-[#7FB706]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Additional Description - Full Width */}
          {product.bottom_description && !product.bottom_description.toLowerCase().includes("product line:") && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="mt-16 pt-16 border-t border-gray-200 dark:border-white/10"
            >
              <div 
                className="prose prose-sm sm:prose-base dark:prose-invert prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-headings:text-gray-900 dark:prose-headings:text-[#B5F823] prose-strong:text-gray-900 dark:prose-strong:text-white max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.bottom_description }}
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════ HARDWARE DETAILS & BILL OF MATERIALS (BOM) ═══════════════════ */}
      <section id="hardware-specs" className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#030213] text-gray-900 dark:text-white transition-colors border-t border-gray-100 dark:border-white/5 scroll-mt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#7FB706] uppercase bg-[#7FB706]/10 border border-[#7FB706]/20 px-4 py-1.5 rounded-full mb-3">
              <Wrench className="w-3.5 h-3.5" />
              Engineered Hardware &amp; Accessories
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2">
              Hardware Details &amp; Specifications
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-3">
              Precision-crafted architectural grade fittings engineered for high-traffic public washrooms, heavy usage, and 100% moisture resistance.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 max-w-6xl mx-auto">
            {/* Left Column: Material Options & Available Finishes (5 Cols) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 space-y-6"
            >
              {/* Category Rules & Finishes */}
              {isCubicle || isKids ? (
                <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-3xl p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Palette className="w-5 h-5 text-[#7FB706]" />
                      Hardware Finishes &amp; Options
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Choose between Grade 304 Stainless Steel, Polyamide Nylon, and Anodized Aluminium Profiles.
                    </p>
                  </div>

                  {/* SS Hardware */}
                  {ssOption?.enabled && (
                    <div className="bg-white dark:bg-black/40 border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#7FB706]" />
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Stainless Steel Hardware</h4>
                        </div>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#7FB706]/10 text-[#7FB706] font-semibold border border-[#7FB706]/20">
                          Grade 304 / 316
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        Anti-vandalism, rust-proof commercial grade stainless steel with high tensile strength.
                      </p>

                      {/* Color Swatches */}
                      {ssOption.colors && ssOption.colors.length > 0 && (
                        <div className="pt-2 border-t border-gray-100 dark:border-white/5 space-y-2">
                          <span className="text-[11px] font-bold tracking-wider uppercase text-gray-400 dark:text-gray-500">
                            Available Color Finishes
                          </span>
                          <div className="flex flex-col gap-2">
                            {ssOption.colors.map((color) => {
                              const swatch = COLOR_SWATCHES[color] || {
                                bg: 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300',
                                border: 'border-gray-200 dark:border-white/10',
                                text: 'text-gray-700 dark:text-gray-300',
                                label: color,
                                dot: 'bg-gray-400',
                              };
                              return (
                                <div
                                  key={color}
                                  className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold ${swatch.bg} ${swatch.border}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full shrink-0 ${swatch.dot}`} />
                                    <span>{swatch.label}</span>
                                  </div>
                                  <Check className="w-3.5 h-3.5 opacity-80" />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Nylon Hardware */}
                  {nylonOption?.enabled && (
                    <div className="bg-white dark:bg-black/40 border border-gray-200 dark:border-white/5 rounded-2xl p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">Polyamide Nylon Hardware</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Non-corrosive, chemical &amp; rust-proof fittings</div>
                        </div>
                      </div>
                      <span className="text-[11px] px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20 font-semibold">
                        Included
                      </span>
                    </div>
                  )}

                  {/* Aluminium Profile Hardware */}
                  {aluminiumOption?.enabled && (
                    <div className="bg-white dark:bg-black/40 border border-gray-200 dark:border-white/5 rounded-2xl p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-400 shrink-0">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">Aluminium Profile</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Heavy-duty anodized, rust-proof extruded structural profiles</div>
                        </div>
                      </div>
                      <span className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-300 border border-slate-500/20 font-semibold">
                        Included
                      </span>
                    </div>
                  )}
                </div>
              ) : isLocker ? (
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                    <Shield className="w-5 h-5" />
                    Uniform Standard Heavy-Duty Locker Hardware
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    All Pacific locker models use standardized uniform hardware including heavy-duty concealed hinges, cam locks with master key overrides, ventilation louver grilles, number plates, and base plinth levelers.
                  </p>
                </div>
              ) : (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-amber-500 dark:text-amber-300 font-bold text-sm">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    {hasExtraLeg ? "Model A Exclusive: Floor Supporting Leg Included" : "Standard Cantilever Mount"}
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    {hasExtraLeg
                      ? "This model incorporates an extra adjustable floor supporting leg (100–150mm) to anchor the outer bottom edge to the floor slab, effectively preventing wall cantilever strain."
                      : "Standard floating wall-hung cantilever mounting configuration with heavy stainless steel corner brackets."}
                  </p>
                </div>
              )}

              {/* Hardware & Board Quality Guarantee Badge */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-3xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">1-Year Hardware & 10-Year Cubicle Board Warranty</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    1-Year direct replacement warranty on all Grade 304/316 SS, Aluminium Profile, and Polyamide nylon hardware fittings, alongside a 10-Year comprehensive warranty on solid compact phenolic laminate board against delamination, moisture damage, and swelling.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Itemized Hardware Bill of Materials (BOM) Table (7 Cols) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-3xl p-6 space-y-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#7FB706]" />
                      Itemized Hardware Bill of Materials (BOM)
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Standard components supplied with each cubicle / unit
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#7FB706] bg-[#7FB706]/10 px-3 py-1 rounded-xl border border-[#7FB706]/20">
                    {hardwareList.length} Items
                  </span>
                </div>

                <div className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-black/30">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-100/70 dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 font-semibold">
                        <th className="px-4 py-3 w-12 text-center">#</th>
                        <th className="px-4 py-3">Component Name</th>
                        <th className="px-4 py-3">Specifications / Material</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                      {hardwareList.map((hw, idx) => (
                        <tr key={hw.id || idx} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-3.5 font-mono text-center text-gray-400 dark:text-gray-500">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              <span>{hw.name}</span>
                              {hw.isExtraLeg && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-300 font-bold border border-amber-400/30">
                                  Extra Leg
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed">
                            {hw.notes || (hw.material ? `${hw.material} Grade Fitting` : 'Standard OEM Specification')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hardware footnote */}
              <div className="p-3.5 bg-white dark:bg-black/40 border border-gray-100 dark:border-white/5 rounded-2xl flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                <span>Fasteners, masonry wall plugs &amp; rubber door stops included.</span>
                <span className="font-semibold text-[#7FB706]">Pan-India Supply</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ VIDEO SHOWCASE (MINIMUM 2 VIDEOS) ═══════════════════ */}
      {uniqueVideos.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-[#05041a] text-white relative overflow-hidden border-t border-b border-white/5">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#7FB706]/5 rounded-full blur-[100px] -translate-y-1/2" />
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#B5F823]/5 rounded-full blur-[100px] -translate-y-1/2" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#B5F823] uppercase bg-[#7FB706]/10 border border-[#7FB706]/20 px-4 py-1.5 rounded-full mb-3">
                <Video className="w-3.5 h-3.5" />
                Live Video Demonstrations
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2">
                Experience in Action
              </h2>
              <p className="text-gray-400 text-sm sm:text-base mt-3">
                Explore architectural walkthroughs, durability benchmarks, and step-by-step modular installation guides.
              </p>
            </motion.div>

            <div className={`grid gap-8 max-w-6xl mx-auto ${uniqueVideos.length === 1 ? 'max-w-3xl' : 'lg:grid-cols-2'}`}>
              {uniqueVideos.map((videoUrl, idx) => {
                const parsed = parseVideoSource(videoUrl);
                if (!parsed) return null;

                const defaultTitles = [
                  "Architectural Walkthrough & 360° Tour",
                  "Hardware & Step-by-Step Installation",
                  "Durability & Stress Testing",
                  "Feature Showcase & Design Details",
                ];
                const videoTitle = defaultTitles[idx] || `Demonstration Video #${idx + 1}`;
                const videoBadge = idx === 0 ? "Video #1: Walkthrough" : idx === 1 ? "Video #2: Installation" : `Video #${idx + 1}`;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/10 shadow-2xl flex flex-col justify-between hover:border-[#7FB706]/40 transition-all duration-300"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B5F823] bg-[#7FB706]/20 px-3 py-1 rounded-full border border-[#7FB706]/30">
                          <Film className="w-3.5 h-3.5" />
                          {videoBadge}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          {parsed.type === "youtube" ? "YouTube HD" : parsed.type === "vimeo" ? "Vimeo HD" : "Direct Video (MP4)"}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                        {videoTitle}
                      </h3>
                      <p className="text-xs text-gray-400 mb-4 line-clamp-2">
                        {idx === 0
                          ? "Comprehensive 360-degree overview covering material finishes, clearances, and headrail integration."
                          : "Factory technician installation workflow highlighting anchor brackets, hinges, and tamper-proof indicator locks."}
                      </p>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/80 ring-1 ring-white/10 shadow-inner">
                      {parsed.type === "native" ? (
                        <video
                          src={parsed.src}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-contain bg-black"
                        >
                          Your browser does not support HTML5 video.
                        </video>
                      ) : (
                        <iframe
                          src={parsed.src}
                          title={`${product.title} - ${videoTitle}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════ COLORS & FINISHES ═══════════════════ */}
      {product.colors && product.colors.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#030213] transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <span className="text-xs font-bold tracking-widest text-[#7FB706] uppercase">Options</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">Colors & Finishes</h2>
            </motion.div>
            
            {/* Main Image Showcase for the active color */}
            <div className="max-w-4xl mx-auto mb-10">
              <motion.div 
                key={activeColorIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-2xl overflow-hidden aspect-[16/9] ring-1 ring-black/5 dark:ring-white/10 bg-gray-50 dark:bg-white/[0.02]"
              >
                <ImageWithFallback 
                  src={product.colors[activeColorIdx]?.image_url} 
                  alt={product.colors[activeColorIdx]?.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-4 left-4 right-4 text-center sm:text-left sm:bottom-6 sm:left-6">
                  <div className="inline-block px-4 py-2 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-xl shadow-lg border border-black/5 dark:border-white/10">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {product.colors[activeColorIdx]?.name}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Color Thumbnails */}
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
              {product.colors.map((color: any, index: number) => {
                const isActive = index === activeColorIdx;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveColorIdx(index)}
                    className={`group relative flex flex-col items-center gap-2 transition-all duration-300 ${isActive ? 'scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'}`}
                  >
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-2 transition-all shadow-md ${isActive ? 'ring-[#7FB706] ring-offset-2 ring-offset-white dark:ring-offset-[#030213] shadow-[#7FB706]/20' : 'ring-gray-200 dark:ring-white/10 hover:ring-[#7FB706]/50'}`}>
                      <ImageWithFallback src={color.image_url} alt={color.name} className="w-full h-full object-cover" />
                    </div>
                    <span className={`text-xs sm:text-sm font-semibold transition-colors ${isActive ? 'text-[#7FB706]' : 'text-gray-500 dark:text-gray-400'}`}>
                      {color.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════ APPLICATIONS ═══════════════════ */}
      {product.applications && product.applications.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#030213] transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <span className="text-xs font-bold tracking-widest text-[#7FB706] uppercase">Where It's Used</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">Ideal Applications</h2>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {product.applications.map((app: string, index: number) => (
                <motion.div key={index} initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-semibold bg-[#030213] dark:bg-white/5 text-white border border-white/10 hover:border-[#7FB706]/40 hover:bg-[#7FB706] transition-all duration-300 cursor-default"
                >
                  {app}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════ CATALOGS ═══════════════════ */}
      {catalogs.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-[#fafbf7] dark:bg-[#0a0a1a] transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <span className="text-xs font-bold tracking-widest text-[#7FB706] uppercase">Resources</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">Download Catalogs</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {catalogs.map((catalog) => (<CatalogCard key={catalog.id} catalog={catalog} />))}
            </div>
          </div>
        </section>
      )}

      {showCatalogViewer && catalogs.length > 0 && (
        <CatalogViewerModal catalog={catalogs[0]} onClose={() => setShowCatalogViewer(false)} />
      )}

      {/* ═══════════════════ RELATED PRODUCTS ═══════════════════ */}
      <RelatedProducts
        currentProductId={product.id}
        currentCategory={product.category}
      />

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-[#030213] text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7FB706]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#B5F823]/8 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Let's Build Something Great</h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Get detailed specs, competitive pricing, and expert consultation — all tailored to your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/contact")}>
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <button onClick={() => window.open("https://wa.me/919818592113", "_blank")}
                className="inline-flex items-center justify-center px-7 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all font-medium"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                WhatsApp Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}