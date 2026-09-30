import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "./Button";
import { ProductCard } from "./ProductCard";
import { useProducts } from "../../lib/hooks";

export function FeaturedServices() {
  const navigate = useNavigate();
  const { data: allProducts, loading } = useProducts();
  const realProducts = (allProducts || []).filter(
    (p) => p.published !== false && !p.id?.startsWith("prod-") && !p.id?.startsWith("demo-")
  );
  const activePool = realProducts.length > 0 ? realProducts : (allProducts || []);
  const explicitlyFeatured = activePool.filter((p) => p.is_featured);
  const featuredProducts = (explicitlyFeatured.length > 0 ? explicitlyFeatured : activePool).slice(0, 3);

  const toCategorySlug = (category: string | undefined) => {
    if (!category) return "restroom-cubicles";
    const cat = category.toLowerCase().trim();
    if (cat.includes("cubicle") && !cat.includes("kid")) return "restroom-cubicles";
    if (cat.includes("locker")) return "lockers";
    if (cat.includes("urinal") || cat.includes("partition")) return "urinal-partitions";
    if (cat.includes("kid")) return "kids-toilet";
    return cat.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  return (
    <section className="pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-12 sm:pb-16 md:pb-20 lg:pb-24 bg-transparent dark:bg-[#030213] text-gray-900 dark:text-white transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-[#7FB706]">
            Featured Architectural Models
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
            Explore our precision-engineered cubicle, locker, and partition systems
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading featured models...</div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {featuredProducts.map((product) => {
              const catSlug = toCategorySlug(product.category);
              const productPath = `/products/${catSlug}/${product.slug}`;
              return (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  description={product.description || product.subtitle}
                  image={product.image_url}
                  path={productPath}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">No featured models yet. Mark models as featured in the Admin panel!</div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-12"
        >
          <Button size="lg" variant="outline" onClick={() => navigate("/products")}>
            View All Models
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
