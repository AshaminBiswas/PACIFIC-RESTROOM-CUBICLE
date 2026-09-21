import { motion } from "motion/react";
import { useParams, useNavigate, Link } from "react-router";
import { useMemo } from "react";
import DOMPurify from "dompurify";
import { useBlog } from "../../lib/hooks";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/Button";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { SEO } from "../components/SEO";
import { blogPostSchema } from "../../lib/seo-data";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: blog, loading } = useBlog(slug);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-[#030213]">
        <div className="animate-pulse text-gray-400 text-lg">Loading…</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-[#030213]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#030213] dark:text-white mb-4">Post Not Found</h1>
          <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
        </div>
      </div>
    );
  }

  const sanitizedContent = useMemo(
    () =>
      DOMPurify.sanitize(blog.content, {
        USE_PROFILES: { html: true },
      }),
    [blog.content]
  );


  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-[#030213] transition-colors">
      <SEO
        title={blog.title}
        description={blog.excerpt?.slice(0, 155) || blog.title}
        canonical={`/blog/${blog.slug}`}
        ogType="article"
        ogImage={blog.cover_image_url}
        jsonLd={blogPostSchema(blog)}
      />
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-[#E9FDBF] to-white dark:from-[#0a0a1a] dark:to-[#030213]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#7FB706] dark:hover:text-[#B5F823] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sm text-[#7FB706] font-semibold uppercase tracking-wider">
              {blog.category}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#030213] dark:text-white mt-2 mb-4">
              {blog.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {blog.author}
              </span>
              {blog.published_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(blog.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cover Image */}
      {blog.cover_image_url && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl -mt-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ImageWithFallback
              src={blog.cover_image_url}
              alt={blog.title}
              className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-2xl shadow-xl"
            />
          </motion.div>
        </div>
      )}

      {/* Content */}
      <section className="py-16 bg-white dark:bg-[#030213]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div 
              className="prose prose-lg max-w-none prose-headings:text-[#030213] dark:prose-headings:text-white dark:prose-p:text-gray-300 dark:prose-strong:text-white dark:prose-li:text-gray-300 prose-a:text-[#7FB706] prose-img:rounded-2xl" 
              dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
            />

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-gray-400" />
                  {blog.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-[#E9FDBF] text-[#4a7002] dark:bg-[#7FB706]/20 dark:text-[#B5F823] rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
