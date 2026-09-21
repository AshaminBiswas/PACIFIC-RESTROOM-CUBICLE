import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "./Button";
import { ProductCard } from "./ProductCard";
import { useProducts } from "../../lib/hooks";

export function FeaturedServices() {
  const navigate = useNavigate();
  const { data: allProducts, loading } = useProducts();
  const featuredProducts = allProducts?.filter(p => p.is_featured).slice(0, 3) || [];

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
            Featured Services
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
            Explore our range of premium interior solutions
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading featured services...</div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {featuredProducts.map((product) => {
              const catSlug = product.category
                ? product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                : "";
              const productPath = catSlug
                ? `/products/${catSlug}/${product.slug}`
                : `/products/${product.slug}`;
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
          <div className="text-center text-gray-500 py-10">No featured services yet. Add some in the Admin panel!</div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-12"
        >
          <Button size="lg" variant="outline" onClick={() => navigate("/products")}>
            View All Services
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
