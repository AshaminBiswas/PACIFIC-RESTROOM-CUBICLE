import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

interface ProductCardProps {
  title: string;
  description: string;
  image: string;
  path: string;
}

export function ProductCard({ title, description, image, path }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col"
    >
      {/* Invisible link overlay covering the entire card for better UX */}
      <Link to={path} className="absolute inset-0 z-20 rounded-3xl" aria-label={`View ${title}`} />
      
      {/* Top Image Layer */}
      <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-md border border-gray-100 dark:border-white/5 bg-gray-100 dark:bg-gray-900">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {/* Subtle dark overlay that fades out on hover to reveal the bright image */}
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
        
        {/* Dynamic green glow that appears behind the content box on hover */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#7FB706]/40 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </div>

      {/* Floating Content Layer (Overlaps the image) */}
      <div className="relative z-10 mx-4 sm:mx-6 -mt-16 sm:-mt-20 pointer-events-none">
        <div className="bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl rounded-2xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/50 dark:border-white/10 transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(127,183,6,0.15)] group-hover:border-[#7FB706]/30 dark:group-hover:border-[#7FB706]/30">
          
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300 group-hover:text-[#7FB706]">
            {title}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 line-clamp-2 leading-relaxed">
            {description}
          </p>
          
          <div className="flex items-center text-sm font-semibold text-[#7FB706]">
            <span className="relative overflow-hidden pb-1">
              Learn More
              {/* Animated underline that expands from left to right */}
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#7FB706] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            </span>
            <ArrowRight className="w-4 h-4 ml-2 transform transition-transform duration-500 ease-out group-hover:translate-x-2" />
          </div>
          
        </div>
      </div>
    </motion.div>
  );
}
