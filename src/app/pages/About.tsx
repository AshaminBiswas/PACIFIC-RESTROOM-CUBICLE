import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import {
  Target, Award, Users, TrendingUp, Factory, Globe,
  Shield, Droplets, Flame, CheckCircle2, ArrowRight,
  Sparkles, Zap, Eye, Wrench, DoorOpen, ShowerHead,
  Lock, Cog, Layers, Rocket
} from "lucide-react";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { SectorsGrid } from "../components/AboutSectors";
import { PageHero } from "../components/PageHero";
import { usePageBanner } from "../../lib/hooks";
import { Button } from "../components/Button";
import { useNavigate } from "react-router";
import { SEO } from "../components/SEO";
import { DEFAULT_KEYWORDS, organizationSchema, faqSchema } from "../../lib/seo-data";
import aboutImg from "../../image/about.webp";

const DEFAULT_BG = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80";

/* ── Floating particles for hero ── */
function HeroParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#B5F823]/40"
          style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
    </div>
  );
}

/* ── Stat card with hover tilt ── */
function StatCard({ value, suffix, label, icon: Icon, index }: {
  value: number; suffix: string; label: string; icon: any; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, rotateZ: 1 }}
      className="relative group"
    >
      <div className="relative bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 dark:border-white/10 text-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#7FB706]/10 to-[#B5F823]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="relative z-10">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#7FB706] to-[#B5F823] flex items-center justify-center shadow-lg shadow-[#7FB706]/20 group-hover:shadow-[#7FB706]/40 transition-shadow">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-4xl font-bold text-[#7FB706] mb-1">
            <AnimatedCounter end={value} suffix={suffix} />
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Value card with animated icon ── */
function ValueCard({ icon: Icon, title, desc, index }: {
  icon: any; title: string; desc: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="group relative bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl p-7 border border-gray-200/50 dark:border-white/10 overflow-hidden"
    >
      <motion.div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7FB706] to-[#B5F823] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      <motion.div
        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
        transition={{ duration: 0.5 }}
        className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7FB706] to-[#B5F823] flex items-center justify-center mb-5 shadow-lg shadow-[#7FB706]/20"
      >
        <Icon className="w-7 h-7 text-white" />
      </motion.div>
      <h3 className="text-lg font-bold text-[#030213] dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

/* ── Material feature pill ── */
function MaterialPill({ icon: Icon, label, index }: { icon: any; label: string; index: number; }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ scale: 1.08, y: -2 }}
      className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white/60 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 backdrop-blur-sm"
    >
      <Icon className="w-5 h-5 text-[#7FB706] flex-shrink-0" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </motion.div>
  );
}

/* ═══════════════ MAIN PAGE ═══════════════ */

export default function AboutPage() {
  const navigate = useNavigate();
  const { data: banner } = usePageBanner("about");
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const stats = [
    { value: 600, suffix: "+", label: "Projects Delivered", icon: CheckCircle2 },
    { value: 250, suffix: "+", label: "Happy Clients", icon: Users },
    { value: 12, suffix: "+", label: "Years Experience", icon: Award },
    { value: 5, suffix: "", label: "Countries", icon: Globe },
  ];

  const values = [
    { icon: Award, title: "Quality Comes First", desc: "We never compromise on material quality, product performance, or finishing standards." },
    { icon: Target, title: "Client Satisfaction Matters", desc: "Understanding client expectations and delivering as promised is crucial to our work process." },
    { icon: TrendingUp, title: "Continuous Improvement", desc: "Market demands are always changing, and we continuously improve our products and solutions accordingly." },
    { icon: Users, title: "Professional Commitment", desc: "Timely delivery, clear communication, and responsible execution are key parts of how we operate." },
    { icon: Globe, title: "Sustainable Responsibility", desc: "Whenever possible, we focus on better material choices and efficient solutions that support responsible infrastructure development." },
  ];

  const materialFeatures = [
    { icon: Droplets, label: "Water-resistant performance" },
    { icon: Shield, label: "Corrosion-resistant materials" },
    { icon: Zap, label: "Scratch-resistant surfaces" },
    { icon: Wrench, label: "Easy maintenance" },
    { icon: Factory, label: "Strong structural durability" },
    { icon: Eye, label: "Premium finish quality" },
    { icon: Target, label: "Reliable long-term performance" },
    { icon: Users, label: "Professional installation support" },
  ];

  return (
    <div className="min-h-screen pt-20 bg-transparent dark:bg-[#030213] transition-colors">
      <SEO
        title="About Pacific Products & Solutions | ISO Certified Restroom Cubicle Manufacturer"
        description="Pacific Products & Solutions — ISO 9001:2015 certified manufacturer of restroom cubicles, toilet partitions, exterior cladding & locker systems. 12+ years, 600+ projects, 4 offices across India & UAE. Learn about our story, team, and quality commitment."
        keywords={`${DEFAULT_KEYWORDS}, about Pacific Products and Solutions, ISO certified cubicle manufacturer India, B2B interior contracting company Delhi, restroom cubicle company 12 years, commercial interior solutions India, turnkey interior contractor`}
        canonical="/about"
        jsonLd={[
          organizationSchema(),
          faqSchema([
            { question: "When was Pacific Products & Solutions founded?", answer: "Pacific Products & Solutions was founded in 2012 and has been delivering premium restroom cubicles and commercial interior solutions for over 12 years." },
            { question: "Is Pacific Products & Solutions ISO certified?", answer: "Yes, Pacific Products & Solutions is ISO 9001:2015 certified, ensuring consistent manufacturing quality and process excellence." },
            { question: "How many projects has Pacific Products & Solutions completed?", answer: "Pacific Products & Solutions has completed 600+ projects for 100+ prestigious clients across India and the UAE." },
          ])
        ]}
      />

      {/* ═══ HERO ═══ */}
      <PageHero
        title="About Us"
        accentWord="Us"
        subtitle="12+ years of excellence in B2B interior contracting — delivering premium restroom cubicles, cladding, locker systems, and interior solutions across India."
        breadcrumb="About Us"
        backgroundImage={banner?.image_url}
      />

      {/* ═══ STATS ═══ */}
      <section className="py-16 bg-transparent dark:bg-[#030213]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((s, i) => <StatCard key={i} {...s} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══ INTRO / WHO WE ARE ═══ */}
      <section className="py-20 bg-gray-50/80 dark:bg-[#0a0a1a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-block text-xs font-bold tracking-widest uppercase text-[#7FB706] mb-3"
              >
                Who We Are
              </motion.span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-6">
                A Trusted Name in <span className="text-[#7FB706]">Commercial Infrastructure Solutions</span>
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-[15px]">
                <p>At Pacific Products & Solutions, we partner with businesses, architects, and contractors to deliver reliable solutions for modern commercial and institutional spaces.</p>
                <p>Over the years, we have assisted clients from various industries who need quality products and proper execution. We know that every commercial project has unique challenges, such as high foot traffic, moisture exposure, maintenance issues, or design needs.</p>
                <p>That's why our team concentrates on providing not just products but also complete practical solutions that meet the project requirements.</p>
                <p>We work with architects, builders, contractors, consultants, facility teams, and business owners to deliver solutions that combine performance with modern design.</p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <Button size="lg" onClick={() => navigate("/contact")}>
                  Get in Touch <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1554200876-56c2f25224fa?q=80&w=1080&auto=format&fit=crop"
                  alt="Modern Locker Solutions"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring" }}
                className="absolute -bottom-5 -left-5 bg-[#7FB706] text-white rounded-2xl p-5 shadow-xl shadow-[#7FB706]/30"
              >
                <div className="text-3xl font-bold">12+</div>
                <div className="text-sm opacity-90">Years of Excellence</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ APPROACH ═══ */}
      <section className="py-20 bg-transparent dark:bg-[#030213]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#7FB706] mb-3">Our Working Approach</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-4">Practical Thinking with Strong Execution</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-4">
              For us, a good product is not just about how it looks. It should function well in daily use, require minimal maintenance, and last long.
            </p>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-4">
              Our approach is straightforward: understand the client’s requirements, suggest the appropriate solution, use quality materials, and ensure professional execution.
            </p>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Every project receives careful attention to detail so that the final outcome is functional, durable, and visually matches the overall space.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ═══ SECTORS ═══ */}
      <section className="py-20 bg-gray-50/80 dark:bg-[#0a0a1a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#7FB706] mb-3">Industries We Serve</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-4">Industries We Proudly Serve</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Our products are used across various industries where durability, hygiene, and long-term performance are essential.</p>
          </motion.div>
          <SectorsGrid />
        </div>
      </section>

      {/* ═══ PRODUCT DURABILITY ═══ */}
      <section className="py-20 bg-transparent dark:bg-[#030213]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={aboutImg}
                  alt="Premium interior solutions"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#7FB706] mb-3">Built for Daily Commercial Use</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-6">Designed for Tough Environments</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Commercial spaces require products that can endure constant use without losing performance or appearance.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Our systems are developed with this in mind. We use materials and hardware suitable for demanding environments like offices, malls, hospitals, schools, airports, metro stations, gyms, and public facilities.
              </p>
              <div className="space-y-3">
                {materialFeatures.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#7FB706] flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{f.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CORE VALUES ═══ */}
      <section className="py-20 bg-gray-50/80 dark:bg-[#0a0a1a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#7FB706] mb-3">What We Believe In</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-4">Values That Shape Our Work</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Every decision, every product, every project is driven by these core values</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => <ValueCard key={v.title} {...v} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══ TEAM ═══ */}
      <section className="py-20 bg-transparent dark:bg-[#030213]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#7FB706] mb-3">Our People</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-4">Meet Our Team</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">The professionals who make it all possible</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-2xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1769740333462-9a63bfa914bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWFtJTIwY29ycG9yYXRlJTIwb2ZmaWNlfGVufDF8fHx8MTc3NDc3Mjg3MXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Our Team"
              className="w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <p className="text-lg max-w-3xl leading-relaxed">
                Our team comprises experienced engineers, skilled craftsmen, project managers, and design consultants who bring decades of combined expertise to every project.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ TRUSTED CLIENTS ═══ */}
      <section className="py-20 bg-gray-50/80 dark:bg-[#0a0a1a] overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#7FB706] mb-3">Our Clients</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-4">Trusted by Leading Organizations Across India</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Over the years, Pacific Products & Solutions has successfully completed projects for some of the most respected organizations, institutions, and commercial brands across India. Our commitment to quality, professionalism, timely delivery, and customer satisfaction has helped us build long-term relationships with architects, contractors, developers, and corporate clients.
            </p>
          </motion.div>

          {/* Animated Marquee of client logos/names */}
          <div className="relative mt-10">
            <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-gray-50 dark:from-[#0a0a1a] to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-gray-50 dark:from-[#0a0a1a] to-transparent pointer-events-none" />
            <motion.div
              className="flex gap-4"
              animate={{ x: ["-0%", "-50%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(2)].map((_, setIdx) => (
                <div key={setIdx} className="flex gap-4 shrink-0">
                  {[
                    "ATS Bouquet", "VIBGYOR Group of Schools", "Rajasthan Patrika",
                    "Capital Radio Multiplatforma", "PDM University", "MVN University",
                    "INOX", "Indian Oil", "Delhi Metro", "OMAXE", "Cult.Fit", "Eden Gardens Stadium",
                  ].map((name, i) => (
                    <motion.div
                      key={`${setIdx}-${i}`}
                      whileHover={{ scale: 1.08, y: -4 }}
                      className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 backdrop-blur-sm shrink-0 cursor-default group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7FB706]/20 to-[#B5F823]/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-[#7FB706]">{name.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap group-hover:text-[#7FB706] transition-colors">{name}</span>
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-gray-500 dark:text-gray-500 mt-8 max-w-2xl mx-auto"
          >
            These successful collaborations reflect our capability to execute projects of varying scales across educational institutions, transportation infrastructure, corporate environments, entertainment venues, fitness centers, and large public spaces.
          </motion.p>
        </div>
      </section>

      {/* ═══ CORE SERVICE PORTFOLIO ═══ */}
      <section className="py-20 bg-transparent dark:bg-[#030213]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#7FB706] mb-3">What We Do</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-4">Our Core Service Portfolio</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: DoorOpen, title: "Restroom Cubicles & Toilet Partitions", desc: "Durable and modern restroom cubicle systems designed for hygiene, privacy, and easy maintenance in commercial environments." },
              { icon: ShowerHead, title: "Shower Cubicles", desc: "Practical shower partition systems suitable for gyms, hostels, wellness centres, institutional spaces, and other moisture-prone environments." },
              { icon: Layers, title: "Exterior Cladding", desc: "Cladding solutions that enhance building appearance while providing protection against weather exposure and external wear." },
              { icon: Lock, title: "Locker Solutions", desc: "Custom locker systems for offices, schools, gyms, hospitals, and commercial facilities, focusing on security, usability, and clean design." },
              { icon: Cog, title: "Custom Hardware & Accessories", desc: "Strong, precision-made hardware solutions designed for commercial use and long service life." },
              { icon: Factory, title: "Interior Panel Solutions", desc: "Architectural panel systems that add functionality and visual appeal to commercial interiors." },
            ].map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group relative bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl p-7 border border-gray-200/50 dark:border-white/10 overflow-hidden"
              >
                <motion.div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#7FB706] to-[#B5F823] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.4 }}
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7FB706] to-[#B5F823] flex items-center justify-center mb-5 shadow-lg shadow-[#7FB706]/20 group-hover:shadow-[#7FB706]/40 transition-shadow"
                >
                  <svc.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-[#030213] dark:text-white mb-2 group-hover:text-[#7FB706] transition-colors">{svc.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{svc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MISSION ═══ */}
      <section className="py-20 bg-gray-50/80 dark:bg-[#0a0a1a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative max-w-4xl mx-auto text-center"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 opacity-10"
            >
              <Rocket className="w-16 h-16 text-[#7FB706]" />
            </motion.div>
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#7FB706] mb-3">Our Mission</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#030213] dark:text-white mb-6">Creating Better Functional Spaces</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Our goal is to provide reliable infrastructure solutions that help businesses create safer, cleaner, smarter, and more efficient spaces.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              We believe good infrastructure should not only look modern but also perform consistently over time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 bg-gradient-to-br from-[#7FB706] to-[#5a8204] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#B5F823] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">We Don't Just Supply Products</h2>
            <p className="text-lg mb-8 opacity-90">
              We deliver complete infrastructure solutions that enhance user experience, improve operational efficiency, and elevate the architectural identity of a space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => navigate("/contact")}>
                Start Your Project <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#7FB706]" onClick={() => navigate("/products")}>
                Explore Solutions
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
