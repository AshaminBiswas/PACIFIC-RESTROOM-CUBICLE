import { motion } from "motion/react";
import type { CoreService } from "../../lib/database.types";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface CoreServiceCardProps {
  service: CoreService;
  index: number;
}

export function CoreServiceCard({ service, index }: CoreServiceCardProps) {
  const paddedNumber = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -10 }}
      className="group relative rounded-3xl overflow-hidden h-full"
    >

      {/* ── Card body ────────────────────────────────────────── */}
      <div className="relative z-10 rounded-3xl overflow-hidden bg-white dark:bg-[#0c0c1c] h-full flex flex-col">
        {/* Image area — full-bleed with overlays */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={service.image_url}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.12]"
          />

          {/* Dark cinematic gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-opacity duration-500" />



          {/* Top-left: Stylized number badge */}
          <div className="absolute top-5 left-5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center transition-all duration-500">
              <span className="text-lg font-black text-white/80 transition-colors duration-500 select-none">
                {paddedNumber}
              </span>
            </div>
          </div>

          {/* Bottom overlay: Title on image */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {service.title}
            </h3>
          </div>
        </div>

        {/* Content area */}
        <div className="flex flex-col flex-1 p-6 sm:p-7">
          {/* Description */}
          <p className="text-sm sm:text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed flex-1 line-clamp-3">
            {service.description}
          </p>

          {/* Footer */}
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/8 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-400 dark:text-gray-500">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Premium Quality
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-400 dark:text-gray-500">
                <Sparkles className="w-3.5 h-3.5" />
                Expert Setup
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
