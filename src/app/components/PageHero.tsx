import { motion } from "motion/react";
import { Home, ChevronRight } from "lucide-react";
import { Link } from "react-router";

interface PageHeroProps {
  title: string;
  subtitle: string;
  breadcrumb: string;
  accentWord?: string;        // optional word in title to highlight in brand green
  backgroundImage?: string;   // DB banner image URL — used as hero background
}

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#B5F823]/30"
          style={{
            width: `${4 + (i % 3) * 3}px`,
            height: `${4 + (i % 3) * 3}px`,
            left: `${10 + i * 11}%`,
            top: `${15 + (i % 4) * 18}%`,
          }}
          animate={{ y: [0, -24, 0], opacity: [0.15, 0.6, 0.15] }}
          transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, delay: i * 0.35 }}
        />
      ))}
      {/* Glowing orbs */}
      <motion.div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(127,183,6,0.18) 0%, transparent 70%)", filter: "blur(40px)" }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(181,248,35,0.12) 0%, transparent 70%)", filter: "blur(50px)" }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}

export function PageHero({ title, subtitle, breadcrumb, accentWord, backgroundImage }: PageHeroProps) {
  const renderTitle = () => {
    if (!accentWord) return <span>{title}</span>;
    const parts = title.split(accentWord);
    return (
      <>
        {parts[0]}
        <span className="text-[#B5F823]">{accentWord}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <section className="relative w-full min-h-[340px] sm:min-h-[420px] flex items-center justify-center overflow-hidden">

      {/* ── Background: DB image OR dark gradient fallback ── */}
      {backgroundImage ? (
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          <img
            src={backgroundImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0a1a00] via-[#030213] to-[#0d1f00]" />
      )}

      {/* Dark overlay — stronger when image present so text stays readable */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: backgroundImage
            ? "linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.52) 50%, rgba(0,0,0,0.75) 100%)"
            : "linear-gradient(to bottom, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.80) 100%)",
        }}
      />

      {/* Grid texture */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,#7FB706 0px,transparent 1px,transparent 48px),repeating-linear-gradient(90deg,#7FB706 0px,transparent 1px,transparent 48px)",
        }}
      />

      {/* Bottom fade into page */}
      <div className="absolute bottom-0 left-0 right-0 h-24 z-[2] bg-gradient-to-t from-[#030213] to-transparent pointer-events-none" />

      {/* Particles */}
      <Particles />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 text-center py-16 sm:py-20">

        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-1.5 text-sm text-white/55 mb-6"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="flex items-center gap-1 hover:text-[#B5F823] transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-white/30" />
          <span className="text-white/85 font-medium">{breadcrumb}</span>
        </motion.nav>

        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7FB706]/40 bg-[#7FB706]/10 backdrop-blur-sm mb-5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#B5F823] animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#B5F823]">
            Pacific Products &amp; Solutions
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-5 leading-tight"
          style={{ textShadow: "0 2px 28px rgba(0,0,0,0.8)" }}
        >
          {renderTitle()}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}
        >
          {subtitle}
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.55, duration: 0.7, ease: "easeOut" }}
          className="mt-8 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-[#7FB706] to-[#B5F823] origin-left"
        />
      </div>
    </section>
  );
}
