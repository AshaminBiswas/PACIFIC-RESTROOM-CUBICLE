import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useProducts } from "../../lib/hooks";
import { ProductCard } from "./ProductCard";
import { Button } from "./Button";
import type { Product } from "../../lib/database.types";

interface RelatedProductsProps {
  currentProductId: string;
  currentCategory?: string;
}

function toCategorySlug(category: string | undefined) {
  if (!category) return "";
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function RelatedProducts({ currentProductId, currentCategory }: RelatedProductsProps) {
  const navigate = useNavigate();
  const { data: allProducts, loading } = useProducts();

  if (loading) return null;

  // Exclude current product
  const others = allProducts.filter((p: Product) => p.id !== currentProductId);

  // Only suggest products from the same category to avoid distracting the customer
  const suggestions = currentCategory
    ? others.filter((p: Product) => p.category === currentCategory).slice(0, 3)
    : [];

  if (suggestions.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#030213] transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 sm:mb-16"
        >
          <div>
            <span className="text-xs font-bold tracking-widest text-[#7FB706] uppercase">
              Explore More
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">
              Related{" "}
              <span className="text-[#7FB706]">Services</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 max-w-md">
              Discover more premium solutions tailored for your commercial spaces.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button variant="outline" size="lg" onClick={() => navigate("/products")}>
              View All Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {suggestions.map((product: Product, index: number) => {
            const catSlug = toCategorySlug(product.category);
            const productPath = catSlug
              ? `/products/${catSlug}/${product.slug}`
              : `/products/${product.slug}`;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <ProductCard
                  title={product.title}
                  description={product.description || product.subtitle || ""}
                  image={product.image_url || ""}
                  path={productPath}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
