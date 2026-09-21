import { motion } from "motion/react";
import {
  Plane, GraduationCap, Building2, Hospital, Briefcase, ShoppingBag,
  Trophy, Dumbbell, Train, Building, Clapperboard, Factory, Hotel, Landmark
} from "lucide-react";

const sectors = [
  { icon: Plane, label: "Airports" },
  { icon: GraduationCap, label: "Schools & Colleges" },
  { icon: Building2, label: "Universities" },
  { icon: Hospital, label: "Hospitals & Healthcare" },
  { icon: Briefcase, label: "Corporate Offices" },
  { icon: ShoppingBag, label: "Shopping Malls" },
  { icon: Trophy, label: "Stadiums & Sports" },
  { icon: Dumbbell, label: "Gyms & Fitness Centers" },
  { icon: Train, label: "Railways & Metro" },
  { icon: Building, label: "Commercial Buildings" },
  { icon: Clapperboard, label: "Entertainment Spaces" },
  { icon: Factory, label: "Industrial Facilities" },
  { icon: Hotel, label: "Hospitality Projects" },
  { icon: Landmark, label: "Public Infrastructure" },
];

export function SectorsGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {sectors.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04, duration: 0.4 }}
          whileHover={{ y: -6, scale: 1.05 }}
          className="group relative flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 backdrop-blur-sm cursor-default"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7FB706] to-[#B5F823] flex items-center justify-center shadow-lg shadow-[#7FB706]/20 group-hover:shadow-[#7FB706]/40 transition-shadow duration-300">
            <s.icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight">
            {s.label}
          </span>
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7FB706]/10 to-[#B5F823]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            layoutId={`sector-bg-${i}`}
          />
        </motion.div>
      ))}
    </div>
  );
}
