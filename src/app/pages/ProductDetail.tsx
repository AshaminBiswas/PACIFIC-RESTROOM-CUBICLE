import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
import {
  CheckCircle2, Shield, Zap, Award, ArrowRight, Phone,
  Clock, Wrench, BadgeCheck, Truck, HeadphonesIcon, Star,
  ChevronRight, Layers,
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

// Helper: convert a category name to URL slug
function toCategorySlug(category: string | undefined) {
  if (!category) return "";
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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
  const [currentThumbs, setCurrentThumbs] = useState<string[] | null>(null);
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

  const mainImage = currentMain || product?.image_url || "";
  const thumbnailImages = currentThumbs || product?.additional_images?.filter(Boolean).slice(0, 4) || [];

  // Build the canonical URL path with category
  const productUrl = product
    ? product.category
      ? `/products/${toCategorySlug(product.category)}/${product.slug}`
      : `/products/${product.slug}`
    : "";

  const handleSwap = (idx: number) => {
    const clickedImg = thumbnailImages[idx];
    if (clickedImg === mainImage) return;
    const newThumbs = [...thumbnailImages];
    newThumbs[idx] = mainImage;
    setCurrentMain(clickedImg);
    setCurrentThumbs(newThumbs);
  };

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
                  { val: "5 Yr", lbl: "Warranty" },
                  { val: "ISO", lbl: "Certified" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-black text-[#B5F823]">{s.val}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.lbl}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate("/contact")}>
                  <Phone className="w-4 h-4 mr-2" />
                  Request Quote
                </Button>
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
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] mb-4 ring-1 ring-white/10">
                <ImageWithFallback src={mainImage} alt={product.title} className="w-full h-full object-cover transition-all duration-500" />
              </div>
              {thumbnailImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2.5">
                  {thumbnailImages.map((img, idx) => {
                    const isActive = img === mainImage;
                    return (
                      <button key={img + idx} onClick={() => handleSwap(idx)}
                        className={`relative rounded-xl overflow-hidden aspect-[4/3] transition-all duration-300 ${isActive ? "ring-2 ring-[#B5F823] shadow-lg shadow-[#7FB706]/20" : "opacity-40 hover:opacity-80 ring-1 ring-white/10"}`}
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
                  <span className="text-xs font-bold tracking-widest text-[#7FB706] uppercase">Advantages</span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">Why This Service</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400 max-w-md text-sm lg:text-right">
                  Every feature is designed to deliver maximum value for your projects.
                </p>
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
            {product.specifications && product.specifications.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <span className="text-xs font-bold tracking-widest text-[#7FB706] uppercase">Technical Details</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-8">Specifications</h2>
                <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10">
                  {product.specifications.map((spec: ProductSpecification, index: number) => (
                    <div key={index} className={`flex justify-between items-center px-5 sm:px-6 py-4 ${index % 2 === 0 ? "bg-white dark:bg-white/[0.03]" : "bg-gray-50/70 dark:bg-white/[0.01]"} ${index < product.specifications.length - 1 ? "border-b border-gray-100 dark:border-white/5" : ""}`}>
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
                  { icon: HeadphonesIcon, title: "After-Sales Care", desc: "5-year warranty with responsive support" },
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
          {product.bottom_description && (
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