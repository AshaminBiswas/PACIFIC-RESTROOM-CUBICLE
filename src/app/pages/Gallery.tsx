import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useGallery, usePageBanner } from "../../lib/hooks";
import { X, ZoomIn, ChevronLeft, ChevronRight, Image as ImageIcon, LayoutGrid } from "lucide-react";
import type { GalleryImage } from "../../lib/database.types";
import { SEO } from "../components/SEO";
import { PageHero } from "../components/PageHero";

const DEFAULT_BG = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80";

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: galleryImages, loading } = useGallery();
  const { data: banner } = usePageBanner("gallery");

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  // Categories & Counts
  const uniqueCategories = Array.from(new Set(galleryImages.map(img => img.category))).filter(Boolean);
  const categories = ["all", ...uniqueCategories];

  const getCategoryCount = (cat: string) => {
    if (cat === "all") return galleryImages.length;
    return galleryImages.filter(img => img.category === cat).length;
  };

  const filteredImages =
    selectedCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  // Lightbox Navigation
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(-1);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
  };

  // Keyboard Navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === -1) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") setLightboxIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
      if (e.key === "ArrowRight") setLightboxIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredImages.length]);

  return (
    <div className="min-h-screen pt-20 bg-[#f8f9fa] dark:bg-[#030213] transition-colors selection:bg-[#7FB706]/30">
      <SEO
        title="Project Gallery"
        description="Browse our portfolio of completed commercial projects — restroom cubicles, exterior cladding, locker installations, and interior solutions across India."
        canonical="/gallery"
      />
      {/* Hero Banner */}
      <PageHero
        title="Project Gallery"
        accentWord="Gallery"
        subtitle="Browse our portfolio of completed commercial projects — restroom cubicles, exterior cladding, locker installations, and interior solutions across India."
        breadcrumb="Gallery"
        backgroundImage={banner?.image_url}
      />

      {/* Filter Section */}
      <section className="sticky top-20 z-30 py-6 bg-white/80 dark:bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 transition-colors shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-semibold">
              <LayoutGrid className="w-5 h-5 text-[#7FB706]" />
              <span>Filter by Industry</span>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-3">
              {categories.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`relative overflow-hidden group flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm ${
                      isSelected
                        ? "bg-[#7FB706] text-white shadow-lg shadow-[#7FB706]/30 border border-[#7FB706]"
                        : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/5 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <span className="capitalize relative z-10">{category}</span>
                    <span className={`relative z-10 px-2 py-0.5 rounded-full text-xs ${
                      isSelected ? "bg-white/20 text-white" : "bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400 group-hover:bg-gray-300 dark:group-hover:bg-white/20"
                    }`}>
                      {getCategoryCount(category)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-[#7FB706]">
                <div className="w-12 h-12 border-4 border-[#7FB706]/20 border-t-[#7FB706] rounded-full animate-spin mb-4" />
                <p className="font-medium">Loading portfolio...</p>
             </div>
          ) : filteredImages.length > 0 ? (
            <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              <AnimatePresence>
                {filteredImages.map((item, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    key={item.id}
                    onClick={() => openLightbox(index)}
                    className="group relative overflow-hidden rounded-2xl bg-gray-200 dark:bg-white/5 cursor-pointer break-inside-avoid transform-gpu"
                  >
                    <ImageWithFallback
                      src={item.image_url}
                      alt={item.alt_text || item.title}
                      className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030213]/90 via-[#030213]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      
                      {/* Zoom Icon */}
                      <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="inline-block px-3 py-1 bg-[#7FB706] text-white text-xs font-bold uppercase tracking-wider rounded-lg mb-3">
                          {item.category}
                        </div>
                        <h3 className="text-white text-xl md:text-2xl font-bold leading-tight mb-2">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-gray-200 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Projects Found</h3>
              <p className="text-gray-500 dark:text-gray-400">There are currently no images in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {lightboxIndex !== -1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030213]/95 backdrop-blur-xl"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-16 sm:h-16 bg-white/5 hover:bg-white/20 border border-white/10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-16 sm:h-16 bg-white/5 hover:bg-white/20 border border-white/10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              </>
            )}

            {/* Image Container */}
            <div 
              className="relative w-full max-w-6xl max-h-[90vh] px-4 sm:px-20 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={filteredImages[lightboxIndex].image_url}
                alt={filteredImages[lightboxIndex].alt_text || filteredImages[lightboxIndex].title}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl shadow-black/50"
              />
              
              {/* Image Details in Lightbox */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-center max-w-2xl"
              >
                <span className="inline-block px-3 py-1 bg-[#7FB706]/20 text-[#B5F823] text-xs font-bold uppercase tracking-wider rounded-lg mb-3">
                  {filteredImages[lightboxIndex].category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {filteredImages[lightboxIndex].title}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  Image {lightboxIndex + 1} of {filteredImages.length}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
