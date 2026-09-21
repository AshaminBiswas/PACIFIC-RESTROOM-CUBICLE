import { motion } from "motion/react";
import { Link, useSearchParams } from "react-router";
import { DynamicIcon } from "../components/DynamicIcon";
import { useSolutions, usePageBanner } from "../../lib/hooks";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { SEO } from "../components/SEO";
import { DEFAULT_KEYWORDS } from "../../lib/seo-data";
import { PageHero } from "../components/PageHero";
import { useState, useMemo } from "react";

const DEFAULT_BG = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80";
const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || '';

export default function SolutionsPage() {
  const { data: solutions, loading } = useSolutions();
  const { data: banner } = usePageBanner("solutions");
  const [searchParams] = useSearchParams();
  const industryFilter = searchParams.get("industry");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Derive unique categories from all solution clients arrays
  const categories = useMemo(() => {
    const set = new Set<string>();
    solutions.forEach(s => (s.clients || []).forEach(c => c.trim() && set.add(c.trim())));
    return ["All", ...Array.from(set).sort()];
  }, [solutions]);

  const filtered = useMemo(() => {
    let list = industryFilter ? solutions.filter(s => s.title === industryFilter) : solutions;
    if (activeCategory !== "All") {
      list = list.filter(s => (s.clients || []).includes(activeCategory));
    }
    return list;
  }, [solutions, industryFilter, activeCategory]);

  return (
    <div className="min-h-screen pt-20 bg-transparent dark:bg-[#030213] transition-colors">
      <SEO
        title="Industry Solutions"
        description="Tailored interior solutions for corporates, malls, airports, metro stations, hospitals, schools, and commercial infrastructure projects."
        keywords={`${DEFAULT_KEYWORDS}, corporate office interiors, hospital washroom cubicles, airport restroom partitions, mall cladding solutions, commercial interior contractors`}
        canonical="/solutions"
      />
      {/* Hero Banner */}
      <PageHero
        title="Industry Solutions"
        accentWord="Solutions"
        subtitle="Tailored interior solutions for corporates, malls, airports, hospitals, schools, and commercial infrastructure projects across India."
        breadcrumb="Solutions"
        backgroundImage={banner?.image_url}
      />

      {/* ── Category Filter Chips ── */}
      {categories.length > 1 && (
        <section className="py-6 bg-[#030213] border-b border-white/5 sticky top-[80px] z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    activeCategory === cat
                      ? "bg-[#7FB706] text-white border-[#7FB706] shadow-lg shadow-[#7FB706]/20"
                      : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Solutions Grid */}
      <section className="py-16 sm:py-24 bg-[#030213] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-gray-400">Loading solutions...</div>
          ) : filtered.length > 0 ? (
            <>
              {activeCategory !== "All" && (
                <p className="text-gray-500 text-sm mb-6">
                  Showing <span className="text-[#7FB706] font-medium">{filtered.length}</span> solution{filtered.length !== 1 ? 's' : ''} for <span className="text-white font-medium">"{activeCategory}"</span>
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((solution, index) => {
                  return (
                    <motion.div
                      key={solution.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07, duration: 0.4 }}
                    >
                      <Link
                        to={`/solutions/${solution.slug}`}
                        className="group block"
                      >
                        <div className="relative h-64 rounded-2xl overflow-hidden mb-4 border border-white/5 shadow-lg group-hover:border-[#7FB706]/30 transition-colors">
                          <ImageWithFallback
                            src={solution.image_url}
                            alt={solution.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          <div className="absolute bottom-6 left-6">
                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3 group-hover:bg-[#7FB706]/20 group-hover:border-[#7FB706]/50 transition-colors">
                              <DynamicIcon name={solution.icon_name} className="w-6 h-6 text-[#B5F823]" />
                            </div>
                          </div>
                          {/* Category tags on card */}
                          {(solution.clients || []).length > 0 && (
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                              {(solution.clients || []).slice(0, 2).map(c => (
                                <span key={c} className="text-[10px] px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white/80 rounded-full font-medium">
                                  {c}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <h3 className="text-2xl font-semibold mb-2 group-hover:text-[#B5F823] transition-colors">
                          {solution.title}
                        </h3>
                        <p className="text-gray-400 line-clamp-2">
                          {stripHtml(solution.description) || solution.subtitle || solution.features?.[0] || ''}
                        </p>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-3">No solutions found for <span className="text-white">"{activeCategory}"</span></p>
              <button onClick={() => setActiveCategory("All")} className="text-[#7FB706] hover:underline text-sm">Clear filter →</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
