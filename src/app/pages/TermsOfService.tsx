import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { FileText, ChevronRight, Mail, Phone, ArrowUp, AlertTriangle } from "lucide-react";
import { Link } from "react-router";
import { SEO } from "../components/SEO";

// ── Table of Contents ─────────────────────────────────────────────────────────
const sections = [
  { id: "acceptance",       title: "Acceptance of Terms" },
  { id: "use-of-site",      title: "Use of Website" },
  { id: "intellectual",     title: "Intellectual Property" },
  { id: "products",         title: "Products & Services" },
  { id: "quotations",       title: "Quotations & Pricing" },
  { id: "disclaimer",       title: "Disclaimer of Warranties" },
  { id: "liability",        title: "Limitation of Liability" },
  { id: "indemnification",  title: "Indemnification" },
  { id: "third-party",      title: "Third-Party Links" },
  { id: "governing-law",    title: "Governing Law" },
  { id: "changes",          title: "Changes to Terms" },
  { id: "contact",          title: "Contact Information" },
];

// ── Reusable Components ───────────────────────────────────────────────────────

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

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-amber-50 dark:bg-amber-500/8 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 mb-6">
      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
      <p className="text-amber-800 dark:text-amber-300 text-sm leading-relaxed">{children}</p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState("acceptance");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const spacerRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [tocStyle, setTocStyle] = useState<React.CSSProperties>({ visibility: "hidden" });

  // Calculate fixed position from spacer
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
        title="Terms of Service"
        description="Terms of service for Pacific Products & Solutions — terms and conditions governing the use of our website and services."
        canonical="/terms"
        noindex={true}
      />
      {/* ── Hero ── */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 right-0 w-[480px] h-[480px] rounded-full bg-[#7FB706]/8 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full bg-[#B5F823]/6 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-[#7FB706]/10 border border-[#7FB706]/25 text-[#7FB706] text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              <FileText className="w-3.5 h-3.5" />
              Legal
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-5 leading-tight">
              Terms of{" "}
              <span className="text-[#7FB706]">Service</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Please read these Terms of Service carefully before using our website or engaging our products and services.
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

      <div className="h-px bg-gradient-to-r from-transparent via-[#7FB706]/30 to-transparent" />

      {/* ── Body ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-12 lg:py-16">
        <div className="lg:flex lg:gap-10">

          {/* Spacer — reserves layout space; actual TOC is position:fixed */}
          <div ref={spacerRef} className="hidden lg:block w-[220px] flex-shrink-0" />

          {/* Fixed TOC panel */}
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
                {activeSection === id ? (
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 flex-shrink-0" />
                )}
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
            <Callout>
              By accessing or using the Pacific Products &amp; Solutions website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, please do not use our website or services.
            </Callout>

            {/* Acceptance */}
            <SectionHeading id="acceptance">Acceptance of Terms</SectionHeading>
            <Para>
              These Terms of Service ("Terms") govern your use of the Pacific Products &amp; Solutions website located at pacificproducts.com and any associated services. By accessing our website, submitting a contact form, or engaging our services, you confirm that you are at least 18 years of age and have the authority to enter into a binding agreement.
            </Para>

            {/* Use of Site */}
            <SectionHeading id="use-of-site">Use of Website</SectionHeading>
            <Para>You agree to use our website only for lawful purposes and in a manner that does not infringe the rights of others. You must not:</Para>
            <BulletList items={[
              "Use the site in any way that violates applicable local, national, or international laws or regulations",
              "Transmit any unsolicited or unauthorised advertising or promotional material",
              "Attempt to gain unauthorised access to any part of our website or its related systems",
              "Engage in any conduct that restricts or inhibits anyone else's use or enjoyment of the site",
              "Use automated tools to scrape, crawl, or harvest data from our website without written permission",
              "Upload or transmit any malicious code, viruses, or other harmful material",
            ]} />

            {/* Intellectual Property */}
            <SectionHeading id="intellectual">Intellectual Property</SectionHeading>
            <Para>
              All content on this website — including but not limited to text, graphics, logos, photographs, product images, icons, video clips, audio clips, and software — is the exclusive property of Pacific Products &amp; Solutions or its content suppliers, and is protected by applicable copyright, trademark, and other intellectual property laws.
            </Para>
            <Para>
              You may view, download, and print pages from this website solely for your personal, non-commercial use. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any material from our site without our prior written consent.
            </Para>

            {/* Products & Services */}
            <SectionHeading id="products">Products &amp; Services</SectionHeading>
            <Para>
              Pacific Products &amp; Solutions manufactures and supplies restroom cubicles, toilet partitions, exterior cladding, interior paneling, locker systems, and related hardware. Product specifications, dimensions, finishes, and availability displayed on this website are subject to change without notice.
            </Para>
            <Para>
              All product images are for illustrative purposes only. Actual products may vary slightly in colour, finish, or dimensions due to manufacturing tolerances and screen calibration differences. Final product details will be confirmed in the formal project specification document issued prior to order confirmation.
            </Para>

            {/* Quotations */}
            <SectionHeading id="quotations">Quotations &amp; Pricing</SectionHeading>
            <Para>
              Any quotation provided by Pacific Products &amp; Solutions through our website inquiry forms, email, or phone is valid for 30 days from the date of issue unless otherwise stated. Quotations are not binding contracts until a formal purchase order has been issued and accepted in writing by an authorised representative of Pacific Products &amp; Solutions.
            </Para>
            <BulletList items={[
              "Prices are exclusive of applicable GST and other taxes unless stated otherwise",
              "Transportation, installation, and site preparation costs may be quoted separately",
              "Prices for imported materials are subject to change based on prevailing exchange rates",
              "Custom orders may require a non-refundable advance payment before production commences",
            ]} />

            {/* Disclaimer */}
            <SectionHeading id="disclaimer">Disclaimer of Warranties</SectionHeading>
            <Para>
              This website is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. Pacific Products &amp; Solutions does not warrant that the website will be uninterrupted or error-free, that defects will be corrected, or that the site or servers are free of viruses or other harmful components.
            </Para>
            <Para>
              While we make reasonable efforts to ensure the accuracy of information on our website, we do not warrant that product descriptions, specifications, or other content are accurate, complete, reliable, or current.
            </Para>

            {/* Limitation of Liability */}
            <SectionHeading id="liability">Limitation of Liability</SectionHeading>
            <Para>
              To the fullest extent permitted by applicable law, Pacific Products &amp; Solutions shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of this website, even if we have been advised of the possibility of such damages.
            </Para>
            <Para>
              Our total liability to you for any claim arising from your use of this website shall not exceed the amount paid by you, if any, for accessing the site in the 12 months preceding the claim.
            </Para>

            {/* Indemnification */}
            <SectionHeading id="indemnification">Indemnification</SectionHeading>
            <Para>
              You agree to indemnify, defend, and hold harmless Pacific Products &amp; Solutions, its directors, employees, agents, and contractors from and against any claims, liabilities, damages, judgements, awards, losses, costs, expenses, or fees (including reasonable legal fees) arising out of or relating to your violation of these Terms or your use of our website.
            </Para>

            {/* Third Party */}
            <SectionHeading id="third-party">Third-Party Links</SectionHeading>
            <Para>
              Our website may contain links to third-party websites, social media platforms, or partner portals. These links are provided for your convenience only. Pacific Products &amp; Solutions has no control over the content, privacy policies, or practices of third-party sites, and accepts no responsibility for them.
            </Para>

            {/* Governing Law */}
            <SectionHeading id="governing-law">Governing Law &amp; Dispute Resolution</SectionHeading>
            <Para>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in New Delhi, Delhi, India.
            </Para>
            <Para>
              We encourage you to contact us first to resolve any dispute amicably before resorting to formal legal proceedings.
            </Para>

            {/* Changes */}
            <SectionHeading id="changes">Changes to Terms</SectionHeading>
            <Para>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the website. The "Last updated" date at the top of this page will reflect the most recent revision. Your continued use of our website following any changes constitutes your acceptance of the updated Terms.
            </Para>

            {/* Contact */}
            <SectionHeading id="contact">Contact Information</SectionHeading>
            <Para>
              If you have questions about these Terms of Service, please contact our legal team:
            </Para>

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
                <Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-[#7FB706] transition-colors">
                  Privacy Policy
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
