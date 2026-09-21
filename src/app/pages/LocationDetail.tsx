import { useState, useEffect, useRef } from "react";
import { motion, animate, useInView } from "motion/react";
import { Link, useNavigate, useParams } from "react-router";
import { SEO } from "../components/SEO";
import { localBusinessSchema, faqSchema, breadcrumbSchema } from "../../lib/seo-data";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  ChevronLeft,
  Clock,
  DoorOpen,
  Dumbbell,
  ExternalLink,
  Factory,
  GraduationCap,
  HeartPulse,
  Landmark,
  Layers3,
  Mail,
  MapPin,
  MenuSquare,
  Phone,
  Plane,
  ShieldCheck,
  ShoppingBag,
  ShowerHead,
  Sparkles,
  Train,
  Trophy,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "../components/Button";
import { ContactForm } from "../components/ContactForm";
import { useLocationGallery } from "../../lib/hooks";
import { locations, type LocationData } from "./locations/locationData";
import { FeaturedServices } from "../components/FeaturedServices";

type LocationSlug = keyof typeof locations;

const iconMap: Record<string, LucideIcon> = {
  Plane,
  GraduationCap,
  Heart: HeartPulse,
  Building2,
  Trophy,
  Dumbbell,
  Train,
  ShoppingBag,
  Landmark,
};

const serviceIcons: LucideIcon[] = [DoorOpen, ShowerHead, MenuSquare, Layers3, Wrench, Building2];

const adjacentLocations: Record<LocationSlug, string[]> = {
  delhi: ["mumbai", "bangalore", "ahmedabad"],
  mumbai: ["delhi", "uae", "ahmedabad"],
  bangalore: ["mumbai", "delhi", "uae"],
  ahmedabad: ["delhi", "mumbai", "bangalore"],
  kolkata: ["delhi", "mumbai", "bangalore"],
  uae: ["mumbai", "delhi", "bangalore"],
};

function cleanText(value: string) {
  return value
    .replace(/â€”/g, "-")
    .replace(/â€“/g, "-")
    .replace(/Â·/g, "|")
    .replace(/Â/g, "");
}



function scrollToInquiry() {
  document.getElementById("location-inquiry")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openWhatsapp(data: LocationData) {
  const message = encodeURIComponent(`Hi Pacific Products, I want to discuss a commercial infrastructure project in ${cleanText(data.city)}.`);
  window.open(`https://wa.me/${data.whatsapp}?text=${message}`, "_blank", "noopener,noreferrer");
}

function mergeBackendImages(data: LocationData, locationImages: ReturnType<typeof useLocationGallery>["data"]): LocationData {
  const backendHeroImages = locationImages.filter((image) => image.placement === "hero").map(i => i.image_url);
  const heroImage = backendHeroImages.length > 0 ? backendHeroImages[0] : data.heroImage;
  const heroImages = backendHeroImages.length > 0 ? backendHeroImages : [data.heroImage];

  const galleryImages = locationImages
    .filter((image) => image.placement !== "hero")
    .map((image) => image.image_url);
  const repeatedGalleryImages = galleryImages.length > 0
    ? Array.from({ length: Math.max(6, galleryImages.length) }, (_, index) => galleryImages[index % galleryImages.length])
    : data.galleryImages;

  return {
    ...data,
    heroImage,
    heroImages,
    galleryImages: repeatedGalleryImages,
  };
}

function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#7FB706] ${className}`}>
      <span className="h-px w-8 bg-[#7FB706]" />
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto mb-12 max-w-3xl text-center" : "mb-12 max-w-3xl"}>
      <Eyebrow className={align === "center" ? "justify-center" : ""}>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-3xl font-bold leading-tight text-[#030213] dark:text-white sm:text-4xl lg:text-5xl">{title}</h2>
      {copy && <p className="mt-5 text-base leading-8 text-gray-600 dark:text-gray-400 sm:text-lg">{copy}</p>}
    </div>
  );
}

function AnimatedCounter({ numericValue, suffix }: { numericValue: number; suffix: string }) {
  const [display, setDisplay] = useState("0" + suffix);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      const controls = animate(0, numericValue, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(latest) {
          if (Number.isInteger(numericValue)) {
            setDisplay(Math.floor(latest) + suffix);
          } else {
            setDisplay(latest.toFixed(1) + suffix);
          }
        },
      });
      return controls.stop;
    }
  }, [inView, numericValue, suffix]);

  return <span ref={ref}>{display}</span>;
}

function StatStrip({ data, compact = false }: { data: LocationData; compact?: boolean }) {
  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15
          }
        }
      }}
      className={`grid ${compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"} border border-black/10 bg-white/90 shadow-xl shadow-black/5 backdrop-blur dark:border-white/10 dark:bg-white/5`}
    >
      {data.stats.map((stat) => (
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
          }}
          key={stat.label} 
          className="border-r border-black/10 p-5 last:border-r-0 dark:border-white/10 sm:p-7"
        >
          <div className="text-3xl font-bold text-[#7FB706] dark:text-[#B5F823]">
            <AnimatedCounter numericValue={stat.numericValue} suffix={stat.suffix} />
          </div>
          <div className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function LocationHeroSlider({ images, altText }: { images: string[], altText: string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-900">
      {images.map((img, i) => (
        <img
          key={img}
          src={img}
          alt={`${altText} ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "bg-white w-6" : "bg-white/40 hover:bg-white/70 w-2"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function HeroSection({ data, slug }: { data: LocationData; slug: LocationSlug }) {
  const isMumbai = slug === "mumbai";
  const isDubai = slug === "uae";
  const isDelhi = slug === "delhi";
  const isBangalore = slug === "bangalore";

  if (isMumbai) {
    return (
      <section className="relative overflow-hidden bg-[#030213] pt-20 text-white">
        <div className="absolute inset-y-0 right-0 w-full opacity-55 lg:w-[58%]">
          <img src={data.heroImage} alt={`${cleanText(data.city)} commercial infrastructure solutions`} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030213] via-[#030213]/75 to-[#030213]/20" />
        </div>
        <div className="container relative z-10 mx-auto px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-32 lg:pt-12">
          <Link to="/contact" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-[#B5F823]">
            <ChevronLeft className="h-4 w-4" />
            All Locations
          </Link>
          <div className="max-w-2xl">
            <Eyebrow>{cleanText(data.region)}</Eyebrow>
            <h1 className="mt-6 text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-7xl">{cleanText(data.tagline)}</h1>
            <p className="mt-7 text-lg leading-8 text-white/75">{cleanText(data.description)}</p>
            <HeroActions data={data} light />
          </div>
        </div>
      </section>
    );
  }

  if (isDubai) {
    return (
      <section className="relative min-h-[760px] overflow-hidden bg-[#030213] text-white">
        <img src={data.heroImage} alt={`${cleanText(data.city)} luxury commercial interiors`} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030213]/50 via-[#030213]/60 to-[#030213]" />
        <div className="container relative z-10 mx-auto flex min-h-[760px] flex-col justify-end px-4 pb-16 pt-16 sm:px-6 lg:px-8">
          <Link to="/contact" className="mb-auto inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/75 transition hover:text-[#B5F823]">
            <ChevronLeft className="h-4 w-4" />
            All Locations
          </Link>
          <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Eyebrow>{cleanText(data.region)}</Eyebrow>
              <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-7xl">{cleanText(data.tagline)}</h1>
            </div>
            <div className="border-l border-white/25 pl-6">
              <p className="text-lg leading-8 text-white/78">{cleanText(data.description)}</p>
              <HeroActions data={data} light />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative overflow-hidden pt-20 ${isDelhi ? "bg-[#f7f8f3]" : "bg-white"} dark:bg-[#030213]`}>
      <div className="container mx-auto px-4 pb-20 pt-8 sm:px-6 lg:px-8 lg:pb-28 lg:pt-12">
        <Link to="/contact" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#7FB706] dark:text-gray-400">
          <ChevronLeft className="h-4 w-4" />
          All Locations
        </Link>
        <div className={`grid items-center gap-12 ${isBangalore ? "lg:grid-cols-[0.9fr_1.1fr]" : "lg:grid-cols-[1.05fr_0.95fr]"}`}>
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className={isBangalore ? "lg:order-2" : ""}>
            <Eyebrow>{cleanText(data.region)}</Eyebrow>
            <h1 className="mt-6 text-5xl font-bold leading-[1.03] text-[#030213] dark:text-white sm:text-6xl lg:text-7xl">{cleanText(data.tagline)}</h1>
            <p className="mt-7 text-lg leading-8 text-gray-600 dark:text-gray-400">{cleanText(data.description)}</p>
            <HeroActions data={data} />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className={`relative ${isBangalore ? "lg:order-1" : ""}`}>
            <div className={`overflow-hidden ${isDelhi ? "rounded-t-[4rem]" : "rounded-none"} border border-black/10 bg-white p-3 shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-white/5`}>
              <div className="h-[520px] w-full relative">
                {data.heroImages && data.heroImages.length > 1 ? (
                  <LocationHeroSlider images={data.heroImages} altText={`${cleanText(data.city)} restroom cubicles and cladding projects`} />
                ) : (
                  <img src={data.heroImage} alt={`${cleanText(data.city)} restroom cubicles and cladding projects`} className="h-full w-full object-cover" />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroActions({ data, light = false }: { data: LocationData; light?: boolean }) {
  return (
    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
      <Button size="lg" onClick={scrollToInquiry} className="font-semibold">
        Request Project Quote
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
      <button
        onClick={() => openWhatsapp(data)}
        className={`inline-flex items-center justify-center rounded-xl border px-8 py-4 text-lg font-semibold transition ${
          light
            ? "border-white/35 text-white hover:border-[#B5F823] hover:text-[#B5F823]"
            : "border-[#7FB706]/40 text-[#030213] hover:border-[#7FB706] hover:bg-[#7FB706]/10 dark:text-white"
        }`}
      >
        WhatsApp Team
      </button>
    </div>
  );
}

function ServicesSection({ data, layout = "grid" }: { data: LocationData; layout?: "grid" | "split" | "rail" }) {
  const copy = `${cleanText(data.city)} teams support commercial restroom cubicles, shower cubicles, locker solutions, exterior cladding, custom hardware, and interior packages for demanding B2B environments.`;

  if (layout === "split") {
    return (
      <section className="bg-white py-24 dark:bg-[#030213]">
        <div className="container mx-auto grid gap-14 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <SectionHeading eyebrow={`${cleanText(data.city)} Services`} title="Specification-led manufacturing for regional projects" copy={copy} />
          <div className="grid gap-4 sm:grid-cols-2">
            {data.services.map((service, index) => <ServiceCard key={service.title} service={service} index={index} />)}
          </div>
        </div>
      </section>
    );
  }

  if (layout === "rail") {
    return (
      <section className="bg-[#030213] py-24 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={`${cleanText(data.city)} Product Scope`} title="Integrated systems for large built environments" copy={copy} />
          <div className="grid overflow-hidden border border-white/10 lg:grid-cols-6">
            {data.services.map((service, index) => {
              const Icon = serviceIcons[index % serviceIcons.length];
              return (
                <div key={service.title} className="min-h-64 border-b border-r border-white/10 p-6 last:border-r-0 lg:border-b-0">
                  <Icon className="h-8 w-8 text-[#B5F823]" />
                  <h3 className="mt-8 text-xl font-bold">{service.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/65">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-24 dark:bg-[#030213]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={`${cleanText(data.city)} Capabilities`} title="Commercial infrastructure solutions from one project partner" copy={copy} align="center" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.services.map((service, index) => <ServiceCard key={service.title} service={service} index={index} />)}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: LocationData["services"][number]; index: number }) {
  const Icon = serviceIcons[index % serviceIcons.length];
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="group border border-black/10 bg-white p-7 transition hover:-translate-y-1 hover:border-[#7FB706]/40 hover:shadow-xl hover:shadow-black/5 dark:border-white/10 dark:bg-white/[0.03]"
    >
      <div className="flex h-12 w-12 items-center justify-center bg-[#7FB706]/10 text-[#7FB706] transition group-hover:bg-[#7FB706] group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-7 text-xl font-bold text-[#030213] dark:text-white">{service.title}</h3>
      <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-400">{service.desc}</p>
    </motion.article>
  );
}

function IndustrySection({ data, dark = false }: { data: LocationData; dark?: boolean }) {
  return (
    <section className={`${dark ? "bg-[#030213] text-white" : "bg-[#f6f7f2] text-[#030213] dark:bg-[#090918] dark:text-white"} py-24`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading
            eyebrow="Industry Solutions"
            title={`Built for high-traffic ${cleanText(data.city)} environments`}
            copy="From transit hubs and education campuses to hospitals, malls, stadiums, gyms, corporate offices, and public infrastructure, each system is specified around traffic load, cleaning cycles, privacy, safety, and long-term maintenance."
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {data.industries.map((industry, index) => {
              const Icon = iconMap[industry.icon] || Building2;
              return (
                <motion.div
                  key={industry.name}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03, duration: 0.35 }}
                  className="border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <Icon className="h-6 w-6 text-[#7FB706] dark:text-[#B5F823]" />
                  <p className="mt-5 text-sm font-bold">{industry.name}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ShowcaseSection({ data, variant }: { data: LocationData; variant: "mosaic" | "editorial" | "band" | "stack" | "gallery" }) {
  const images = data.galleryImages;

  if (variant === "band") {
    return (
      <section className="bg-white py-24 dark:bg-[#030213]">
        <div className="mb-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <SectionHeading eyebrow="Visual Product Showcase" title={`${cleanText(data.city)} project finish palette`} copy="Architectural surfaces, durable cubicle systems, hardware detailing, and clean commercial interiors composed for premium B2B spaces." />
          </div>
        </div>
        <div className="grid h-auto grid-cols-1 md:h-[520px] md:grid-cols-4">
          {images.slice(0, 4).map((image, index) => (
            <img key={image} src={image} alt={`${cleanText(data.city)} commercial product showcase ${index + 1}`} className="h-80 w-full object-cover md:h-full" />
          ))}
        </div>
      </section>
    );
  }

  if (variant === "editorial") {
    return (
      <section className="bg-white py-24 dark:bg-[#030213]">
        <div className="container mx-auto grid gap-8 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div>
            <SectionHeading eyebrow="Visual Product Showcase" title="Commercial-grade details with a refined architectural presence" />
            <img src={images[0]} alt={`${cleanText(data.city)} interior architecture`} className="h-[620px] w-full object-cover" />
          </div>
          <div className="grid gap-8">
            <img src={images[1]} alt={`${cleanText(data.city)} restroom cubicle installation`} className="h-72 w-full object-cover" />
            <div className="bg-[#030213] p-8 text-white">
              <Sparkles className="h-8 w-8 text-[#B5F823]" />
              <p className="mt-8 text-2xl font-bold leading-snug">Precision finishes for corporate, transit, retail, hospitality, and institutional spaces.</p>
            </div>
            <img src={images[2]} alt={`${cleanText(data.city)} exterior cladding system`} className="h-72 w-full object-cover" />
          </div>
        </div>
      </section>
    );
  }

  if (variant === "stack") {
    return (
      <section className="bg-[#f6f7f2] py-24 dark:bg-[#090918]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Visual Product Showcase" title="Layered infrastructure packages for fast-moving commercial programs" align="center" />
          <div className="grid gap-6 lg:grid-cols-3">
            {images.slice(0, 6).map((image, index) => (
              <div key={image} className={index === 1 || index === 4 ? "lg:translate-y-12" : ""}>
                <img src={image} alt={`${cleanText(data.city)} infrastructure solution ${index + 1}`} className="h-96 w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "gallery") {
    return (
      <section className="bg-white py-24 dark:bg-[#030213]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Visual Product Showcase" title="A premium material language for Gulf commercial projects" copy="Balanced between clean corporate interiors, hospitality-grade surfaces, and robust public-use systems." />
          <div className="grid auto-rows-[240px] gap-4 md:grid-cols-4">
            {images.slice(0, 6).map((image, index) => (
              <img
                key={image}
                src={image}
                alt={`${cleanText(data.city)} premium commercial showcase ${index + 1}`}
                className={`h-full w-full object-cover ${index === 0 ? "md:col-span-2 md:row-span-2" : ""} ${index === 3 ? "md:col-span-2" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-24 dark:bg-[#030213]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Visual Product Showcase" title={`${cleanText(data.city)} installations shaped for modern infrastructure`} copy="Alternating product, interior, cladding, and public-space compositions create a complete specification view for commercial buyers." />
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <img src={images[0]} alt={`${cleanText(data.city)} commercial interiors`} className="h-[560px] w-full object-cover" />
          <div className="grid gap-5 sm:grid-cols-2">
            {images.slice(1, 5).map((image, index) => (
              <img key={image} src={image} alt={`${cleanText(data.city)} product detail ${index + 1}`} className="h-[270px] w-full object-cover" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseSection({ data, compact = false }: { data: LocationData; compact?: boolean }) {
  return (
    <section className="bg-[#030213] py-24 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Why Choose Pacific</Eyebrow>
            <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">Built for durability, speed, and B2B accountability.</h2>
            <p className="mt-6 text-lg leading-8 text-white/65">Local coordination in {cleanText(data.city)} is backed by custom manufacturing, national execution capability, project documentation, and quality-led installation teams.</p>
          </div>
          <div className={`grid gap-4 ${compact ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
            {data.whyChoose.map((item, index) => (
              <div key={item.title} className="border border-white/10 bg-white/[0.04] p-6">
                {index % 2 === 0 ? <ShieldCheck className="h-7 w-7 text-[#B5F823]" /> : <Award className="h-7 w-7 text-[#B5F823]" />}
                <h3 className="mt-6 text-lg font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/62">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsCredibility({ data }: { data: LocationData }) {
  return (
    <section className="bg-[#f6f7f2] py-24 dark:bg-[#090918]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <SectionHeading eyebrow="Trust & Credibility" title={`Commercial project experience across ${cleanText(data.city)}`} copy="A client-focused process with certification-ready documentation, quality assurance checkpoints, and durable product systems for public and private infrastructure." />
          <div className="grid gap-4 sm:grid-cols-2">
            {data.projects.map((project) => (
              <div key={project} className="border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
                <Factory className="h-6 w-6 text-[#7FB706]" />
                <p className="mt-5 font-bold text-[#030213] dark:text-white">{project}</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Commercial specification and installation reference</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {["ISO quality assurance placeholder", "Material test documentation placeholder", "B2B project handover checklist"].map((item) => (
            <div key={item} className="flex items-center gap-3 border border-[#7FB706]/25 bg-[#7FB706]/8 p-5 text-sm font-semibold text-[#030213] dark:text-white">
              <CheckCircle2 className="h-5 w-5 text-[#7FB706]" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ data }: { data: LocationData }) {
  return (
    <section className="bg-white py-24 dark:bg-[#030213]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Local SEO FAQ" title={`${cleanText(data.city)} restroom cubicles, cladding, lockers, and commercial interiors`} align="center" />
        <div className="mx-auto grid max-w-5xl gap-4">
          {data.faqs.map((faq) => (
            <details key={faq.question} className="group border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">
              <summary className="cursor-pointer list-none text-lg font-bold text-[#030213] dark:text-white">
                {cleanText(faq.question)}
                <span className="float-right text-[#7FB706] group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">{cleanText(faq.answer)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function InquirySection({ data, slug }: { data: LocationData; slug: LocationSlug }) {
  return (
    <section id="location-inquiry" className="bg-[#f6f7f2] py-24 dark:bg-[#090918]">
      <div className="container mx-auto grid gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <SectionHeading eyebrow={`${cleanText(data.city)} Inquiry`} title="Plan your next commercial infrastructure package" copy={`Share drawings, BOQ details, project size, or a site visit request. Our ${cleanText(data.city)} team will help with specification, costing, timelines, and installation planning.`} />
          <div className="space-y-4">
            {[
              { icon: MapPin, label: "Regional Office", value: data.address },
              { icon: Phone, label: "Phone", value: data.phone },
              { icon: Mail, label: "Email", value: data.email },
              { icon: Clock, label: "Business Hours", value: data.hours },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4 border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
                <Icon className="mt-1 h-5 w-5 shrink-0 text-[#7FB706]" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</p>
                  <p className="mt-1 font-semibold text-[#030213] dark:text-white">{cleanText(value)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => openWhatsapp(data)} className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-6 py-3 font-bold text-white transition hover:bg-[#1fb457]">
              WhatsApp {cleanText(data.city)}
            </button>
            <button
              onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(cleanText(data.address))}`, "_blank", "noopener,noreferrer")}
              className="inline-flex items-center justify-center rounded-xl border border-[#7FB706]/40 px-6 py-3 font-bold text-[#030213] transition hover:bg-[#7FB706]/10 dark:text-white"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Map
            </button>
          </div>
          <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
            Also serving: {adjacentLocations[slug].map((item, index) => (
              <span key={item}>
                <Link className="font-semibold text-[#7FB706] hover:underline" to={`/locations/${item}`}>{cleanText(locations[item].city)}</Link>
                {index < adjacentLocations[slug].length - 1 ? ", " : "."}
              </span>
            ))}
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

function MapSection({ data }: { data: LocationData }) {
  return (
    <section className="relative h-[460px] overflow-hidden border-t border-black/10 dark:border-white/10">
      <iframe
        src={data.mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`${cleanText(data.city)} Pacific Products location map`}
        className="grayscale transition duration-500 hover:grayscale-0"
      />
      <div className="absolute left-6 top-6 border border-black/10 bg-white/95 p-5 shadow-xl backdrop-blur dark:border-white/10 dark:bg-[#030213]/92">
        <p className="font-bold text-[#030213] dark:text-white">{cleanText(data.city)}</p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{cleanText(data.region)}</p>
      </div>
    </section>
  );
}

function StickyCta({ data }: { data: LocationData }) {
  return (
    <div className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-center justify-between gap-3 border border-black/10 bg-white/95 p-3 shadow-2xl shadow-black/15 backdrop-blur dark:border-white/10 dark:bg-[#030213]/95 sm:rounded-2xl">
      <div className="min-w-0 pl-2">
        <p className="truncate text-sm font-bold text-[#030213] dark:text-white">{cleanText(data.city)} project inquiry</p>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">Restroom cubicles, cladding, lockers and interiors</p>
      </div>
      <Button size="sm" onClick={scrollToInquiry} className="shrink-0">
        Get Quote
      </Button>
    </div>
  );
}

function renderLocationFlow(data: LocationData, slug: LocationSlug) {
  switch (slug) {
    case "delhi":
      return (
        <>
          <ServicesSection data={data} layout="split" />
          <ShowcaseSection data={data} variant="mosaic" />
          <IndustrySection data={data} />
          <WhyChooseSection data={data} />
          <ProjectsCredibility data={data} />
          <FaqSection data={data} />
          <InquirySection data={data} slug={slug} />
          <MapSection data={data} />
        </>
      );
    case "mumbai":
      return (
        <>
          <IndustrySection data={data} dark />
          <ServicesSection data={data} layout="rail" />
          <ShowcaseSection data={data} variant="editorial" />
          <ProjectsCredibility data={data} />
          <WhyChooseSection data={data} compact />
          <InquirySection data={data} slug={slug} />
          <FaqSection data={data} />
          <MapSection data={data} />
        </>
      );
    case "bangalore":
      return (
        <>
          <ShowcaseSection data={data} variant="stack" />
          <ServicesSection data={data} layout="grid" />
          <WhyChooseSection data={data} compact />
          <IndustrySection data={data} />
          <FaqSection data={data} />
          <ProjectsCredibility data={data} />
          <InquirySection data={data} slug={slug} />
          <MapSection data={data} />
        </>
      );
    case "ahmedabad":
      return (
        <>
          <ServicesSection data={data} layout="split" />
          <IndustrySection data={data} />
          <ProjectsCredibility data={data} />
          <ShowcaseSection data={data} variant="band" />
          <WhyChooseSection data={data} />
          <FaqSection data={data} />
          <InquirySection data={data} slug={slug} />
          <MapSection data={data} />
        </>
      );
    case "uae":
      return (
        <>
          <ShowcaseSection data={data} variant="gallery" />
          <WhyChooseSection data={data} />
          <ServicesSection data={data} layout="rail" />
          <IndustrySection data={data} dark />
          <ProjectsCredibility data={data} />
          <InquirySection data={data} slug={slug} />
          <FaqSection data={data} />
          <MapSection data={data} />
        </>
      );
    case "kolkata":
      return (
        <>
          <ServicesSection data={data} layout="split" />
          <ShowcaseSection data={data} variant="mosaic" />
          <IndustrySection data={data} />
          <ProjectsCredibility data={data} />
          <WhyChooseSection data={data} compact />
          <FaqSection data={data} />
          <InquirySection data={data} slug={slug} />
          <MapSection data={data} />
        </>
      );
    default:
      return null;
  }
}

export default function LocationPage() {
  const { location } = useParams<{ location: string }>();
  const navigate = useNavigate();
  const slug = location as LocationSlug | undefined;
  const data = slug ? locations[slug] : null;
  const { data: locationImages } = useLocationGallery(slug);
  const pageData = data ? mergeBackendImages(data, locationImages) : null;

  if (!pageData || !slug) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white pt-20 dark:bg-[#030213]">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-[#030213] dark:text-white">Location Not Found</h1>
          <Button onClick={() => navigate("/contact")}>View All Locations</Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#030213] dark:bg-[#030213] dark:text-white">
      <SEO
        title={cleanText(pageData.meta.title).replace(' | Pacific Products & Solutions', '')}
        description={cleanText(pageData.meta.description)}
        keywords={pageData.meta.keywords ? cleanText(pageData.meta.keywords) : undefined}
        canonical={`/locations/${slug}`}
        geoRegion={slug === 'delhi' ? 'IN-DL' : slug === 'mumbai' ? 'IN-MH' : slug === 'bangalore' ? 'IN-KA' : slug === 'ahmedabad' ? 'IN-GJ' : slug === 'kolkata' ? 'IN-WB' : slug === 'uae' ? 'AE-DU' : 'IN-DL'}
        geoPlacename={`${cleanText(pageData.city)}, ${slug === 'uae' ? 'United Arab Emirates' : 'India'}`}
        jsonLd={[
          localBusinessSchema({city: cleanText(pageData.city), address: cleanText(pageData.address), phone: pageData.phone, email: pageData.email, region: cleanText(pageData.region)}),
          breadcrumbSchema([{name: 'Home', url: '/'}, {name: 'Locations', url: '/contact'}, {name: cleanText(pageData.city), url: `/locations/${slug}`}]),
          faqSchema(pageData.faqs.map(f => ({ question: cleanText(f.question), answer: cleanText(f.answer) }))),
        ]}
      />
      <HeroSection data={pageData} slug={slug} />
      
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <StatStrip data={pageData} />
      </div>

      <FeaturedServices />
      {renderLocationFlow(pageData, slug)}
      <StickyCta data={pageData} />
    </main>
  );
}
