import { motion } from "motion/react";
import { Link } from "react-router";
import { useBlogs } from "../../lib/hooks";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ArrowRight, Calendar, User } from "lucide-react";
import { SEO } from "../components/SEO";

export default function BlogPage() {
  const { data: blogs, loading } = useBlogs();

  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-[#030213] transition-colors">
      <SEO
        title="Blog & Industry Insights | Restroom Cubicles & Commercial Interiors"
        description="Industry insights, product guides, and expert tips on restroom cubicles, exterior cladding, interior solutions, and commercial infrastructure across India."
        canonical="/blog"
      />
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-[#E9FDBF] to-white dark:from-[#0a0a1a] dark:to-[#030213]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-[#030213] dark:text-white mb-6">
              Our <span className="text-[#7FB706]">Blog</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              Insights, guides, and industry news from our team of experts
            </p>
          </motion.div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-24 bg-white dark:bg-[#030213]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading posts…</div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="group block bg-white dark:bg-[#0a0a1a] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden hover:shadow-xl hover:border-[#7FB706]/30 transition-all"
                  >
                    {blog.cover_image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={blog.cover_image_url}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <span className="text-xs text-[#7FB706] font-semibold uppercase tracking-wider">
                        {blog.category}
                      </span>
                      <h3 className="text-xl font-semibold text-[#030213] dark:text-white mt-2 mb-3 group-hover:text-[#7FB706] transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {blog.author}
                          </span>
                          {blog.published_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(blog.published_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#7FB706] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
