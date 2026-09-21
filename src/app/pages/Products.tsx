import { motion } from "motion/react";
import { ProductCard } from "../components/ProductCard";
import { useSearchParams } from "react-router";
import { useProducts, usePageBanner } from "../../lib/hooks";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { SEO } from "../components/SEO";
import { DEFAULT_KEYWORDS, itemListSchema, faqSchema } from "../../lib/seo-data";
import { PageHero } from "../components/PageHero";

const DEFAULT_BG = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80";

function toCategorySlug(category: string | undefined) {
  if (!category) return "";
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ProductsPage() {
  const { data: products, loading } = useProducts();
  const { data: banner } = usePageBanner("services");
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");

  const filteredProducts = categoryFilter
    ? products.filter(p => p.category === categoryFilter)
    : products;

  return (
    <div className="min-h-screen pt-20 bg-transparent dark:bg-[#030213] transition-colors">
      <SEO
        title="Restroom Cubicles, Toilet Partitions & Commercial Interior Products | India"
        description="Explore Pacific Products' full range — restroom cubicles, toilet partitions, shower cubicles, exterior cladding, HPL locker systems, wall paneling & custom hardware. ISO certified. Pan-India supply & installation. Free quote."
        keywords={`${DEFAULT_KEYWORDS}, restroom cubicles buy India, toilet partition price India, HPL cubicle system, exterior cladding supply install India, locker system manufacturer, wall paneling commercial, shower cubicle supplier`}
        canonical="/products"
        jsonLd={[
          itemListSchema([
            { name: 'Restroom Cubicles', url: '/products/restroom-cubicles/restroom-cubicles', description: 'Premium HPL and compact laminate restroom cubicles for commercial washrooms' },
            { name: 'Toilet Partitions', url: '/products/restroom-cubicles/toilet-partitions', description: 'Floor-mounted, ceiling-hung and overhead-braced toilet partition systems' },
            { name: 'Shower Cubicles', url: '/products/restroom-cubicles/shower-cubicles', description: 'Waterproof shower enclosure systems for hotels, gyms, and institutions' },
            { name: 'Exterior Cladding', url: '/products/exterior-cladding/exterior-cladding', description: 'HPL, aluminium composite and metal cladding for building facades' },
            { name: 'Locker Systems', url: '/products/locker-systems/locker-systems', description: 'Phenolic, HPL, metal and digital locker systems for offices, gyms, schools' },
            { name: 'Interior Wall Paneling', url: '/products/interior-paneling/interior-paneling', description: 'Decorative and functional wall panel systems for commercial interiors' },
            { name: 'Custom Hardware', url: '/products/hardware/cubicle-hardware', description: 'Stainless steel 304/316 hinges, latches, coat hooks and partition hardware' },
          ]),
          faqSchema([
            { question: 'What type of restroom cubicles does Pacific Products manufacture?', answer: 'Pacific Products manufactures HPL (High-Pressure Laminate), compact laminate, phenolic, and stainless steel restroom cubicles in floor-mounted, ceiling-hung, and overhead-braced configurations.' },
            { question: 'Do you supply and install products across India?', answer: 'Yes, we supply and install all products pan-India including Delhi NCR, Mumbai, Bangalore, Ahmedabad, Kolkata, and international markets including UAE.' },
            { question: 'What is the minimum order quantity for restroom cubicles?', answer: 'We accept orders of all sizes — from single-unit installations to large commercial projects. Contact us at +91 98185 92113 for a customised quote.' },
          ])
        ]}
      />
      {/* Hero Banner */}
      <PageHero
        title="Our Services"
        accentWord="Services"
        subtitle="Explore our premium range of restroom cubicles, exterior cladding, locker systems, wall paneling, and custom hardware solutions for commercial spaces."
        breadcrumb="Services"
        backgroundImage={banner?.image_url}
      />

      {/* Products Grid */}
      <section className="py-16 sm:py-24 bg-transparent dark:bg-[#030213] transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Loading services...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => {
                const catSlug = toCategorySlug(product.category);
                const productPath = catSlug
                  ? `/products/${catSlug}/${product.slug}`
                  : `/products/${product.slug}`;
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
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
          )}
        </div>
      </section>
    </div>
  );
}
