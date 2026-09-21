import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Shield, ChevronRight, Mail, Phone, ArrowUp } from "lucide-react";
import { Link } from "react-router";
import { SEO } from "../components/SEO";

// ── Table of Contents data ────────────────────────────────────────────────────
const sections = [
  { id: "introduction",        title: "Introduction" },
  { id: "information-collect", title: "Information We Collect" },
  { id: "how-we-use",          title: "How We Use Your Information" },
  { id: "sharing",             title: "Information Sharing" },
  { id: "cookies",             title: "Cookies & Tracking" },
  { id: "data-security",       title: "Data Security" },
  { id: "retention",           title: "Data Retention" },
  { id: "your-rights",         title: "Your Rights" },
  { id: "third-party",         title: "Third-Party Links" },
  { id: "changes",             title: "Changes to This Policy" },
  { id: "contact",             title: "Contact Us" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-14 mb-5 scroll-mt-28 flex items-center gap-3 group"
    >
      <span className="w-1 h-7 rounded-full bg-gradient-to-b from-[#7FB706] to-[#B5F823] flex-shrink-0" />
      {children}
      <a
        href={`#${id}`}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-[#7FB706] text-lg ml-1"
        aria-hidden
      >
        #
      </a>
    </h2>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 text-base sm:text-[1.05rem]">
      {children}
    </p>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mb-4 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-400 text-base sm:text-[1.05rem]">
          <span className="w-5 h-5 rounded-full bg-[#7FB706]/15 border border-[#7FB706]/30 text-[#7FB706] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            ✓
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const spacerRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [tocStyle, setTocStyle] = useState<React.CSSProperties>({ visibility: "hidden" });

  // Calculate fixed position from spacer element
  useEffect(() => {
    const FIXED_TOP = 112;
    const update = () => {
      if (!spacerRef.current) return;
      const { left, top } = spacerRef.current.getBoundingClientRect();
      const articleBottom = articleRef.current
        ? articleRef.current.getBoundingClientRect().bottom
        : Infinity;
      const tocHeight = navRef.current ? navRef.current.offsetHeight : 420;
      const visible = top <= FIXED_TOP && articleBottom > FIXED_TOP + tocHeight + 32;
      setTocStyle({
        position: "fixed",
        top: FIXED_TOP,
        left: Math.max(left, 16),
        width: 220,
        zIndex: 20,
        visibility: visible ? "visible" : "hidden",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease",
        pointerEvents: visible ? "auto" : "none",
      });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, []);

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#030213] transition-colors">
      <SEO
        title="Privacy Policy"
        description="Privacy policy for Pacific Products & Solutions — how we collect, use, and protect your personal information."
        canonical="/privacy"
        noindex={true}
      />
      {/* ── Hero ── */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Gradient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-[#7FB706]/10 blur-3xl" />
          <div className="absolute top-1/2 right-0 w-[360px] h-[360px] rounded-full bg-[#B5F823]/8 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-[#7FB706]/10 border border-[#7FB706]/25 text-[#7FB706] text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              <Shield className="w-3.5 h-3.5" />
              Legal
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-5 leading-tight">
              Privacy{" "}
              <span className="text-[#7FB706]">Policy</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              At Pacific Products &amp; Solutions, we are committed to protecting your personal information and your right to privacy.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7FB706]" />
                Last updated: April 26, 2026
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7FB706]" />
                Effective: April 26, 2026
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#7FB706]/30 to-transparent" />

      {/* ── Body: TOC + Content ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-12 lg:py-16">
        <div className="lg:flex lg:gap-10">

          {/* Spacer — reserves layout space; actual TOC is fixed */}
          <div ref={spacerRef} className="hidden lg:block w-[220px] flex-shrink-0" />

          {/* Fixed TOC panel (desktop only) */}
          <nav ref={navRef as React.RefObject<HTMLElement>} style={tocStyle} className="hidden lg:block">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 px-3">
              Contents
            </p>
            {sections.map(({ id, title }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                  activeSection === id
                    ? "bg-[#7FB706]/10 text-[#7FB706] font-semibold"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                {activeSection === id && (
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                {activeSection !== id && <span className="w-3.5 h-3.5 flex-shrink-0" />}
                {title}
              </a>
            ))}
          </nav>

          {/* Article */}
          <motion.article
            ref={articleRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex-1 min-w-0"
          >
            {/* Introduction */}
            <SectionHeading id="introduction">Introduction</SectionHeading>
            <Para>
              Pacific Products &amp; Solutions ("we", "our", or "us") operates the website at pacificproducts.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or contact us to inquire about our products and services.
            </Para>
            <Para>
              Please read this policy carefully. If you disagree with its terms, please discontinue use of our site. We reserve the right to make changes to this Privacy Policy at any time and for any reason.
            </Para>

            {/* Information We Collect */}
            <SectionHeading id="information-collect">Information We Collect</SectionHeading>
            <Para>We may collect information about you in a variety of ways, including:</Para>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 mt-6">Personal Data You Provide</h3>
            <BulletList items={[
              "Full name and professional title",
              "Email address and phone number",
              "Company name and project location",
              "Project requirements and specifications you share in contact forms",
              "Any other information you voluntarily submit to us",
            ]} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 mt-6">Data Collected Automatically</h3>
            <BulletList items={[
              "IP address and browser type",
              "Pages visited and time spent on each page",
              "Referring URLs",
              "Device type and operating system",
              "General geographic location (country/city level)",
            ]} />

            {/* How We Use */}
            <SectionHeading id="how-we-use">How We Use Your Information</SectionHeading>
            <Para>Having accurate information about you permits us to provide you with a smooth, efficient, and customised experience. Specifically, we may use your data to:</Para>
            <BulletList items={[
              "Respond to your inquiries and provide product quotations",
              "Send project updates and follow-up communications",
              "Process and fulfil your orders and installation requests",
              "Send you promotional communications (only with your consent)",
              "Improve our website and service offerings",
              "Comply with applicable legal and regulatory obligations",
              "Investigate and prevent fraudulent transactions or abuse",
            ]} />

            {/* Sharing */}
            <SectionHeading id="sharing">Information Sharing</SectionHeading>
            <Para>
              We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except as described below:
            </Para>
            <BulletList items={[
              "Trusted service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements",
              "Our authorised installation partners when required to fulfil your order",
              "Law enforcement or government agencies when required by applicable law",
              "A successor entity in the event of a merger, acquisition, or asset sale",
            ]} />
            <Para>
              In all such cases, we take reasonable steps to ensure that third parties handle your data in accordance with this Privacy Policy.
            </Para>

            {/* Cookies */}
            <SectionHeading id="cookies">Cookies &amp; Tracking Technologies</SectionHeading>
            <Para>
              We may use cookies, web beacons, and similar tracking technologies to collect and store information about your interactions with our website. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent; however, some features of our site may not function properly as a result.
            </Para>
            <BulletList items={[
              "Essential cookies: required for the website to function correctly",
              "Analytics cookies: help us understand how visitors use our site",
              "Preference cookies: remember your settings and choices",
            ]} />

            {/* Data Security */}
            <SectionHeading id="data-security">Data Security</SectionHeading>
            <Para>
              We implement administrative, technical, and physical security measures to protect your personal information. Data submitted via our contact forms is transmitted over HTTPS and stored in secure, access-controlled systems. While we use commercially reasonable means to protect your information, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
            </Para>

            {/* Retention */}
            <SectionHeading id="retention">Data Retention</SectionHeading>
            <Para>
              We retain personal information only for as long as necessary to fulfil the purposes described in this policy, unless a longer retention period is required or permitted by law. Contact inquiry data is generally retained for 3 years following the last interaction.
            </Para>

            {/* Your Rights */}
            <SectionHeading id="your-rights">Your Rights</SectionHeading>
            <Para>Depending on your jurisdiction, you may have the following rights regarding your personal data:</Para>
            <BulletList items={[
              "Right to access: request a copy of the personal data we hold about you",
              "Right to rectification: request correction of inaccurate or incomplete data",
              "Right to erasure: request deletion of your personal data in certain circumstances",
              "Right to restriction: request that we limit how we use your data",
              "Right to portability: receive your data in a machine-readable format",
              "Right to object: object to processing based on legitimate interests or for direct marketing",
            ]} />
            <Para>
              To exercise any of these rights, please contact us using the details in the "Contact Us" section below.
            </Para>

            {/* Third Party */}
            <SectionHeading id="third-party">Third-Party Links</SectionHeading>
            <Para>
              Our website may contain links to third-party websites, including our social media profiles (Facebook, YouTube, LinkedIn, Instagram). This Privacy Policy does not apply to those sites, and we are not responsible for the privacy practices of external websites. We encourage you to review the privacy policies of any third-party sites you visit.
            </Para>

            {/* Changes */}
            <SectionHeading id="changes">Changes to This Policy</SectionHeading>
            <Para>
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by updating the "Last updated" date at the top of this page. Your continued use of our website after any changes constitutes acceptance of the updated policy.
            </Para>

            {/* Contact */}
            <SectionHeading id="contact">Contact Us</SectionHeading>
            <Para>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</Para>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <a
                href="mailto:info@pacificproduct.in"
                className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-[#7FB706]/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7FB706]/15 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#7FB706]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Email</p>
                  <p className="text-gray-900 dark:text-white font-medium group-hover:text-[#7FB706] transition-colors text-sm">
                    info@pacificproduct.in
                  </p>
                </div>
              </a>
              <a
                href="tel:+919818592113"
                className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-[#7FB706]/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7FB706]/15 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#7FB706]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Phone</p>
                  <p className="text-gray-900 dark:text-white font-medium group-hover:text-[#7FB706] transition-colors text-sm">
                    +91 98185 92113
                  </p>
                </div>
              </a>
            </div>

            {/* Footer nav */}
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                © 2026 Pacific Products &amp; Solutions. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-[#7FB706] transition-colors">
                  Terms of Service
                </Link>
                <Link to="/faq" className="text-gray-500 dark:text-gray-400 hover:text-[#7FB706] transition-colors">
                  FAQ
                </Link>
                <Link to="/contact" className="text-gray-500 dark:text-gray-400 hover:text-[#7FB706] transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </motion.article>
        </div>
      </div>

      {/* Back to top */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-6 z-40 w-11 h-11 rounded-full bg-[#7FB706] text-white flex items-center justify-center shadow-lg shadow-[#7FB706]/30 hover:bg-[#6fa005] transition-colors"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}
