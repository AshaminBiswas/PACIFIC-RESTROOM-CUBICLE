import { motion } from "motion/react";
import { SEO } from "../components/SEO";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-[#E9FDBF] to-white">
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." noindex={true} />
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-[#7FB706] mb-4">404</h1>
          <h2 className="text-4xl font-bold text-[#030213] mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-8 py-4 bg-[#7FB706] text-white rounded-xl hover:bg-[#6fa005] transition-colors text-lg font-semibold"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}
