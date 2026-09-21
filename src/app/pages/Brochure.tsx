import { motion } from "motion/react";
import { Link } from "react-router";
import { 
  ShieldCheck, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Settings, 
  Award,
  Layers,
  Phone,
  Mail,
  DoorOpen,
  Briefcase
} from "lucide-react";
import { SEO } from "../components/SEO";

export default function Brochure() {
  return (
    <div className="min-h-screen bg-transparent dark:bg-[#0a0a1a] text-gray-900 dark:text-white font-sans selection:bg-[#E9FDBF] selection:text-[#7FB706] pt-20 transition-colors">
      <SEO
        title="Product Brochure"
        description="Download the Pacific Products & Solutions product brochure — detailed specifications for restroom cubicles, cladding systems, lockers, and hardware."
        canonical="/brochure"
      />
      <div className="w-full max-w-5xl mx-auto shadow-2xl overflow-hidden bg-white dark:bg-[#030213] transition-colors">
        
        {/* ═══ COVER ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[520px] bg-[#030213] relative overflow-hidden">
          <div className="p-10 md:p-14 flex flex-col justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#7FB706] flex items-center justify-center [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm tracking-[0.2em] uppercase text-white leading-tight">Pacific's Products</div>
                <div className="text-[10px] tracking-[0.15em] uppercase text-white/50 mt-0.5">&amp; Solutions</div>
              </div>
            </div>

            <div className="my-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[1.1] tracking-tight font-serif">
                Convert<br /><em className="text-[#B5F823] italic">Imagination</em><br />Into Reality.
              </h1>
              <div className="text-xs tracking-[0.25em] uppercase text-white/50 mt-6 pt-6 border-t border-white/10">
                Turnkey Interiors &nbsp;·&nbsp; Interior &amp; Exterior &nbsp;·&nbsp; Pan-India
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-[10px] tracking-[0.15em] uppercase bg-[#7FB706] text-white border border-[#7FB706] font-semibold px-3 py-1.5 rounded-sm">ISO Compliant</span>
                <span className="text-[10px] tracking-[0.15em] uppercase text-white/70 border border-white/20 px-3 py-1.5 rounded-sm">10-Year Warranty</span>
                <span className="text-[10px] tracking-[0.15em] uppercase text-white/70 border border-white/20 px-3 py-1.5 rounded-sm">Pan-India</span>
                <span className="text-[10px] tracking-[0.15em] uppercase text-white/70 border border-white/20 px-3 py-1.5 rounded-sm">Fire-Rated</span>
              </div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-white/35">
                Est. Production Unit · Delhi, India &nbsp;|&nbsp; www.pacificproduct.in
              </div>
            </div>
          </div>

          <div className="hidden md:block bg-[#0a0a1a] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 18px, #7FB706 18px, #7FB706 19px)" }}></div>
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[3px] p-[3px]">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className={`border ${[1, 4, 7].includes(i) ? 'bg-[#7FB706]/10 border-[#7FB706]/30' : 'bg-white/[0.03] border-[#7FB706]/10'}`}></div>
              ))}
            </div>
            <div className="absolute bottom-10 right-8 text-right z-10">
              <div className="font-serif text-6xl font-light text-[#7FB706]/20 leading-none">PRC</div>
              <div className="text-[11px] tracking-[0.2em] uppercase text-white/25 mt-2">Pacific Restroom Cubicle</div>
            </div>
          </div>
        </div>

        {/* ═══ GREEN BAR ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-4 bg-[#7FB706] divide-x divide-white/20">
          {[
            { num: "12+", lbl: "Years of Expertise" },
            { num: "600+", lbl: "Projects Completed" },
            { num: "100+", lbl: "Prestigious Clients" },
            { num: "4", lbl: "Offices Across India" }
          ].map((stat, i) => (
            <div key={i} className="py-6 px-4 text-center">
              <div className="font-serif text-3xl md:text-4xl font-bold text-white leading-none">{stat.num}</div>
              <div className="text-[10px] tracking-[0.15em] uppercase text-white/80 mt-2">{stat.lbl}</div>
            </div>
          ))}
        </div>

        {/* ═══ ABOUT ═══ */}
        <div className="p-8 md:p-14">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#7FB706] font-semibold mb-2">Who We Are</div>
          <h2 className="font-serif text-3xl md:text-4xl text-[#030213] dark:text-white leading-[1.15] mb-4">Built on Trust.<br />Delivered with Excellence.</h2>
          <div className="w-12 h-0.5 bg-[#7FB706] mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-10 items-start">
            <div className="space-y-4 text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>Pacific's Products & Solutions is a Delhi-based turnkey interiors contracting company that has grown into one of India's most trusted names in interior and exterior solutions. With a dedicated team under expert guidance, we have mastered the art of combining skill, speed, workmanship, and punctuality.</p>
              <p>Our product range — built on high-pressure compact grade laminates compliant with IS 2026 and fire retardant BS-476/97 standards — serves corporate offices, shopping malls, airports, hospitals, schools, and residential buildings across the length and breadth of India.</p>
              <p>From restroom cubicles for Delhi Metro to wall panelling for Parliament House and interior fit-outs for M3M, Infosys, and Zomato — Pacific's name stands behind every project we deliver.</p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { num: "10 Yrs", lbl: "Compact Laminate Warranty" },
                { num: "1 Yr", lbl: "Hardware Warranty" },
                { num: "ISO", lbl: "HPL Provided per ISO-2046" },
                { num: "5/Day", lbl: "Cubicles Installation Speed" }
              ].map((c, i) => (
                <div key={i} className="bg-white dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/5 border-l-[3px] border-l-[#7FB706] dark:border-l-[#7FB706] py-4 px-5 rounded-r-md">
                  <div className="font-serif text-3xl font-bold text-[#030213] dark:text-white leading-none">{c.num}</div>
                  <div className="text-[11px] tracking-[0.15em] uppercase text-gray-500 dark:text-gray-400 mt-1.5">{c.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ PRODUCTS ═══ */}
        <div className="bg-[#F9FAFB] dark:bg-[#0a0a1a] p-8 md:p-14 pb-0 transition-colors">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#7FB706] font-semibold mb-2">Our Products &amp; Services</div>
          <h2 className="font-serif text-3xl md:text-4xl text-[#030213] dark:text-white leading-[1.15] mb-4">Complete Interior &amp; Exterior Solutions</h2>
          <div className="w-12 h-0.5 bg-[#7FB706] mb-8"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0.5 bg-gray-200 dark:bg-white/5">
          {[
            { n: "01", t: "Interior Wall Panelling", d: "Premium compact grade laminate panels for offices, hotels, hospitals & residences. Available in 30+ wood grain textures and solid colours.", tg: ["Fire-Rated", "Scratch Resistant"] },
            { n: "02", t: "Exterior Wall Cladding", d: "Ventilated facade systems with double-hardened acrylic PUR resins. Weather-resistant, UV-protected, compatible with Revit & 3M systems.", tg: ["UV Protected", "Weather Resistant"] },
            { n: "03", t: "Restroom Cubicles", d: "High-pressure 12mm compact laminate cubicles for malls, airports, offices, schools. Anti-bacterial coating, handicap-ready, dry-system.", tg: ["Anti-Bacterial", "Water Resistant"] },
            { n: "04", t: "Cubicle Hardware", d: "Complete hardware in Stainless Steel (304/306), Aluminium (6063 alloy) and Nylon Polyamide-6. Includes hinges, locks, coat hooks.", tg: ["SS 304/306", "Aluminium"] },
            { n: "05", t: "Locker Systems", d: "High-pressure laminate lockers in 1–6 tier and Z-shape configurations. Ideal for gyms, schools, swimming pools & sports centres.", tg: ["1–6 Tier", "Anti-Bacterial"] },
            { n: "06", t: "Turnkey Contracting", d: "End-to-end interior project management — design, supply, and installation. Corporate, commercial and residential. Pan-India capability.", tg: ["Design to Delivery", "Pan-India"] }
          ].map((p, i) => (
            <div key={i} className="bg-white dark:bg-[#030213] p-6 md:p-8 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#7FB706] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              <div className="font-serif text-5xl font-bold text-gray-100 dark:text-white/5 leading-none mb-[-10px] select-none">{p.n}</div>
              <div className="w-9 h-9 bg-[#030213] dark:bg-white/10 rounded flex items-center justify-center mb-4 relative z-10">
                <Layers className="w-4 h-4 text-[#B5F823]" />
              </div>
              <div className="text-sm font-semibold text-[#030213] dark:text-white mb-2">{p.t}</div>
              <div className="text-[12.5px] text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">{p.d}</div>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {p.tg.map((tag, j) => (
                  <span key={j} className="text-[10px] tracking-wider uppercase bg-[#E9FDBF] text-[#7FB706] font-semibold px-2 py-1 rounded-sm">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ═══ MODELS ═══ */}
        <div className="bg-[#030213] p-8 md:p-14">
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-semibold mb-2">Restroom Cubicle Range</div>
          <h2 className="font-serif text-3xl md:text-4xl text-white leading-[1.15] mb-4">Our Signature Models</h2>
          <div className="w-12 h-0.5 bg-[#7FB706] mb-8"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { n: "DELIGHT", d: "Contemporary SS hardware. 12mm compact laminate. Adjustable foot with SS top rail.", s: "H: 2025mm · W: 900mm" },
              { n: "SKYLIGHT", d: "Versatile design with aluminium anodized top rail. Budget-effective quality.", s: "H: 2000mm · W: 900mm" },
              { n: "PLATINA", d: "SS top rail & shoe box plate. One-piece intermediate panel — no joints.", s: "H: 1875mm · W: 900mm" },
              { n: "GUSTO", d: "18mm shoebox system. Extra sturdiness for high-end commercial spaces.", s: "H: 1840mm · W: 900mm" },
              { n: "SKY WINGS", d: "Ceiling-hung innovation. Unique shape for easy floor cleaning.", s: "H: 2400mm · W: 900mm" },
              { n: "WALL HUNG", d: "Clear floor concept. Easy maintenance. Aluminium H-shape toprail.", s: "H: 2050mm · W: 900mm" },
              { n: "SAFFRON", d: "Powder-coated aluminium top rail, Nylon Polyamide hardware. Minimalist.", s: "H: 2000mm · W: 900mm" },
              { n: "SPLENDOR", d: "PD-Door replacement system using existing brick walls. Renovation-first.", s: "H: 1980mm · W: 600-900mm" }
            ].map((m, i) => (
              <div key={i} className="border border-white/10 bg-white/[0.04] p-5 text-center hover:border-[#7FB706] hover:bg-[#7FB706]/10 transition-colors">
                <div className="font-serif text-xl font-semibold text-[#B5F823] mb-2 tracking-wide">{m.n}</div>
                <div className="text-[11px] text-white/50 leading-relaxed min-h-[48px]">{m.d}</div>
                <div className="text-[10px] tracking-wider uppercase text-white/30 mt-3 pt-3 border-t border-white/10">{m.s}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4">
            {["SUMMER FUN - Kids toilet cubicle with colourful SS hardware", "AZALEA - Kids restroom cubicle, bowling pin inspired", "URINAL MODESTY PANEL - 12mm compact laminate, 4 sizes"].map((t, i) => {
              const [name, desc] = t.split(" - ");
              return (
                <div key={i} className="bg-white/[0.06] border border-[#7FB706]/30 px-5 py-3 text-xs text-white/60">
                  <span className="text-[#B5F823] font-semibold">{name}</span> — {desc}
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ FEATURES ═══ */}
        <div className="bg-[#F9FAFB] dark:bg-[#0a0a1a] p-8 md:p-14 transition-colors">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#7FB706] font-semibold mb-2">Product Advantages</div>
          <h2 className="font-serif text-3xl md:text-4xl text-[#030213] dark:text-white leading-[1.15] mb-4">Built for Performance.</h2>
          <div className="w-12 h-0.5 bg-[#7FB706] mb-8"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              "Fire-Rated", "Anti-Bacterial", "Eco-Friendly", "Emergency Opening", 
              "Noise Absorption", "Rapid Installation", "Burn Resistant", "IS 2026 Compliant"
            ].map((f, i) => (
              <div key={i} className="bg-white dark:bg-[#030213] border border-gray-200 dark:border-white/5 p-5 text-center">
                <div className="w-10 h-10 bg-[#030213] mx-auto mb-3 flex items-center justify-center [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]">
                  <ShieldCheck className="w-4 h-4 text-[#B5F823]" />
                </div>
                <div className="text-xs font-semibold text-[#030213] dark:text-gray-200 tracking-wide">{f}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ TECHNICAL DRAWINGS ═══ */}
        <div className="p-8 md:p-14 bg-white dark:bg-[#030213] transition-colors">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#7FB706] font-semibold mb-2">Technical Drawings</div>
          <h2 className="font-serif text-3xl md:text-4xl text-[#030213] dark:text-white leading-[1.15] mb-4">Engineering Specifications</h2>
          <div className="w-12 h-0.5 bg-[#7FB706] mb-8"></div>
          <p className="text-[13.5px] text-gray-600 dark:text-gray-400 mb-10 max-w-2xl leading-relaxed">
            All Pacific restroom cubicle systems are precision-engineered to Indian Standard IS 2026 and fire retardant BS-476/97. Below are standard dimensions and configurations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* DELIGHT DRAWING */}
            <div className="border border-gray-200 dark:border-white/10 p-6">
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#7FB706] font-semibold mb-1">Model</div>
              <div className="font-serif text-2xl text-[#030213] dark:text-white font-bold mb-6">DELIGHT</div>
              <svg width="100%" viewBox="0 0 380 260" className="block mb-6">
                <text x="70" y="14" fontSize="10" fill="#888" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">FRONT VIEW</text>
                <line x1="10" y1="220" x2="140" y2="220" stroke="#333" strokeWidth="1.5"/>
                <rect x="10" y="68" width="14" height="141" fill="#f3f4f6" stroke="#030213" strokeWidth="0.8"/>
                <rect x="68" y="68" width="14" height="141" fill="#f3f4f6" stroke="#030213" strokeWidth="0.8"/>
                <rect x="126" y="68" width="14" height="141" fill="#f3f4f6" stroke="#030213" strokeWidth="0.8"/>
                <rect x="24" y="85" width="44" height="124" fill="#f9fafb" stroke="#030213" strokeWidth="0.8"/>
                <rect x="82" y="85" width="44" height="124" fill="#f9fafb" stroke="#030213" strokeWidth="0.8"/>
                <rect x="24" y="68" width="44" height="17" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <rect x="82" y="68" width="44" height="17" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <rect x="10" y="65" width="130" height="6" fill="#030213" stroke="#030213" strokeWidth="0.5"/>
                <rect x="13" y="209" width="8" height="11" fill="#555" stroke="#333" strokeWidth="0.5"/>
                <rect x="71" y="209" width="8" height="11" fill="#555" stroke="#333" strokeWidth="0.5"/>
                <rect x="129" y="209" width="8" height="11" fill="#555" stroke="#333" strokeWidth="0.5"/>
                <circle cx="66" cy="147" r="3" fill="#7FB706" stroke="#4a7002" strokeWidth="0.5"/>
                <circle cx="124" cy="147" r="3" fill="#7FB706" stroke="#4a7002" strokeWidth="0.5"/>
                <line x1="4" y1="65" x2="4" y2="220" stroke="#7FB706" strokeWidth="0.8"/>
                <text x="2" y="142" fontSize="8" fill="#7FB706" fontFamily="sans-serif" textAnchor="middle" transform="rotate(-90,2,142)">2025mm</text>
                
                <text x="265" y="14" fontSize="10" fill="#888" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">TOP VIEW</text>
                <rect x="185" y="30" width="160" height="120" fill="#f9fafb" stroke="#030213" strokeWidth="1"/>
                <rect x="185" y="30" width="160" height="10" fill="#030213"/>
                <rect x="185" y="40" width="12" height="110" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <rect x="239" y="40" width="12" height="110" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <rect x="333" y="40" width="12" height="110" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <rect x="197" y="40" width="42" height="110" fill="none" stroke="#d1d5db" strokeWidth="0.5" strokeDasharray="3,2"/>
                <rect x="251" y="40" width="82" height="110" fill="none" stroke="#d1d5db" strokeWidth="0.5" strokeDasharray="3,2"/>
                <path d="M197,150 A42,42 0 0,1 239,150" fill="none" stroke="#7FB706" strokeWidth="0.8" strokeDasharray="3,2"/>
                <path d="M251,150 A42,42 0 0,1 293,150" fill="none" stroke="#7FB706" strokeWidth="0.8" strokeDasharray="3,2"/>
                <line x1="185" y1="168" x2="345" y2="168" stroke="#7FB706" strokeWidth="0.8"/>
                <text x="265" y="178" fontSize="8" fill="#7FB706" fontFamily="sans-serif" textAnchor="middle">2700mm</text>
              </svg>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11.5px] border-collapse">
                  <thead>
                    <tr className="bg-[#030213] dark:bg-white/10 text-white">
                      <th className="py-1.5 px-2.5 font-medium">Dimension</th>
                      <th className="py-1.5 px-2.5 font-medium text-center">General (mm)</th>
                      <th className="py-1.5 px-2.5 font-medium text-center">PH (mm)</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300 divide-y divide-gray-100 dark:divide-white/5">
                    <tr className="bg-gray-50 dark:bg-white/5"><td className="py-1.5 px-2.5">Frontal Width</td><td className="text-center">900</td><td className="text-center">1500</td></tr>
                    <tr><td className="py-1.5 px-2.5">Depth</td><td className="text-center">1500</td><td className="text-center">1800</td></tr>
                    <tr className="bg-gray-50 dark:bg-white/5"><td className="py-1.5 px-2.5">Height</td><td className="text-center">2025</td><td className="text-center">2025</td></tr>
                    <tr><td className="py-1.5 px-2.5">Door Width</td><td className="text-center">600</td><td className="text-center">900</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SKYLIGHT DRAWING */}
            <div className="border border-gray-200 dark:border-white/10 p-6">
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#7FB706] font-semibold mb-1">Model</div>
              <div className="font-serif text-2xl text-[#030213] dark:text-white font-bold mb-6">SKYLIGHT</div>
              <svg width="100%" viewBox="0 0 380 260" className="block mb-6">
                <text x="70" y="14" fontSize="10" fill="#888" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">FRONT VIEW</text>
                <line x1="10" y1="220" x2="140" y2="220" stroke="#333" strokeWidth="1.5"/>
                <rect x="10" y="70" width="13" height="139" fill="#E9FDBF" stroke="#7FB706" strokeWidth="0.8"/>
                <rect x="68" y="70" width="13" height="139" fill="#E9FDBF" stroke="#7FB706" strokeWidth="0.8"/>
                <rect x="127" y="70" width="13" height="139" fill="#E9FDBF" stroke="#7FB706" strokeWidth="0.8"/>
                <rect x="23" y="85" width="45" height="124" fill="#f4fce3" stroke="#7FB706" strokeWidth="0.8"/>
                <rect x="81" y="85" width="46" height="124" fill="#f4fce3" stroke="#7FB706" strokeWidth="0.8"/>
                <rect x="10" y="65" width="130" height="6" fill="#7FB706" stroke="#4a7002" strokeWidth="0.5"/>
                <rect x="13" y="209" width="7" height="11" fill="#777" stroke="#555" strokeWidth="0.5"/>
                <rect x="71" y="209" width="7" height="11" fill="#777" stroke="#555" strokeWidth="0.5"/>
                <rect x="129" y="209" width="7" height="11" fill="#777" stroke="#555" strokeWidth="0.5"/>
                <circle cx="67" cy="147" r="3" fill="#030213" stroke="#000" strokeWidth="0.5"/>
                <line x1="4" y1="65" x2="4" y2="220" stroke="#030213" strokeWidth="0.8"/>
                <text x="2" y="142" fontSize="8" fill="#030213" fontFamily="sans-serif" textAnchor="middle" transform="rotate(-90,2,142)">1995mm</text>
                
                <text x="265" y="14" fontSize="10" fill="#888" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">TOP VIEW</text>
                <rect x="185" y="30" width="160" height="120" fill="#f4fce3" stroke="#7FB706" strokeWidth="1"/>
                <rect x="185" y="30" width="160" height="10" fill="#7FB706"/>
                <rect x="185" y="40" width="12" height="110" fill="#E9FDBF" stroke="#7FB706" strokeWidth="0.5"/>
                <rect x="239" y="40" width="12" height="110" fill="#E9FDBF" stroke="#7FB706" strokeWidth="0.5"/>
                <rect x="333" y="40" width="12" height="110" fill="#E9FDBF" stroke="#7FB706" strokeWidth="0.5"/>
                <path d="M197,150 A42,42 0 0,1 239,150" fill="none" stroke="#030213" strokeWidth="0.8" strokeDasharray="3,2"/>
                <line x1="185" y1="168" x2="345" y2="168" stroke="#030213" strokeWidth="0.8"/>
                <text x="265" y="178" fontSize="8" fill="#030213" fontFamily="sans-serif" textAnchor="middle">2700mm</text>
              </svg>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11.5px] border-collapse">
                  <thead>
                    <tr className="bg-[#7FB706] text-white">
                      <th className="py-1.5 px-2.5 font-medium">Dimension</th>
                      <th className="py-1.5 px-2.5 font-medium text-center">General (mm)</th>
                      <th className="py-1.5 px-2.5 font-medium text-center">PH (mm)</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300 divide-y divide-gray-100 dark:divide-white/5">
                    <tr className="bg-gray-50 dark:bg-white/5"><td className="py-1.5 px-2.5">Frontal Width</td><td className="text-center">900</td><td className="text-center">1500</td></tr>
                    <tr><td className="py-1.5 px-2.5">Depth</td><td className="text-center">1500</td><td className="text-center">1800</td></tr>
                    <tr className="bg-gray-50 dark:bg-white/5"><td className="py-1.5 px-2.5">Height</td><td className="text-center">1995</td><td className="text-center">1995</td></tr>
                    <tr><td className="py-1.5 px-2.5">Door Width</td><td className="text-center">600</td><td className="text-center">900</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* PLATINA DRAWING */}
            <div className="border border-gray-200 dark:border-white/10 p-6">
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#7FB706] font-semibold mb-1">Model</div>
              <div className="font-serif text-2xl text-[#030213] dark:text-white font-bold mb-6">PLATINA</div>
              <svg width="100%" viewBox="0 0 380 260" className="block mb-6">
                <text x="70" y="14" fontSize="10" fill="#888" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">FRONT VIEW</text>
                <line x1="10" y1="220" x2="140" y2="220" stroke="#333" strokeWidth="1.5"/>
                <rect x="10" y="80" width="13" height="129" fill="#f3f4f6" stroke="#030213" strokeWidth="0.8"/>
                <rect x="68" y="80" width="13" height="129" fill="#f3f4f6" stroke="#030213" strokeWidth="0.8"/>
                <rect x="127" y="80" width="13" height="129" fill="#f3f4f6" stroke="#030213" strokeWidth="0.8"/>
                <rect x="23" y="95" width="45" height="114" fill="#f9fafb" stroke="#030213" strokeWidth="0.8"/>
                <rect x="81" y="95" width="46" height="114" fill="#f9fafb" stroke="#030213" strokeWidth="0.8"/>
                <rect x="23" y="80" width="45" height="15" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <rect x="81" y="80" width="46" height="15" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <rect x="10" y="75" width="130" height="6" fill="#030213" stroke="#030213" strokeWidth="0.5"/>
                <rect x="10" y="209" width="130" height="8" fill="#030213" stroke="#030213" strokeWidth="0.5"/>
                <circle cx="67" cy="152" r="3" fill="#7FB706" stroke="#030213" strokeWidth="0.5"/>
                <circle cx="126" cy="152" r="3" fill="#7FB706" stroke="#030213" strokeWidth="0.5"/>
                <line x1="4" y1="75" x2="4" y2="220" stroke="#7FB706" strokeWidth="0.8"/>
                <text x="2" y="147" fontSize="8" fill="#7FB706" fontFamily="sans-serif" textAnchor="middle" transform="rotate(-90,2,147)">1875mm</text>
                
                <text x="265" y="14" fontSize="10" fill="#888" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">TOP VIEW</text>
                <rect x="185" y="30" width="160" height="120" fill="#f9fafb" stroke="#030213" strokeWidth="1"/>
                <rect x="185" y="30" width="160" height="10" fill="#030213"/>
                <rect x="185" y="40" width="12" height="110" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <rect x="239" y="40" width="12" height="110" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <rect x="333" y="40" width="12" height="110" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <rect x="197" y="40" width="42" height="110" fill="none" stroke="#d1d5db" strokeWidth="0.5" strokeDasharray="3,2"/>
                <rect x="251" y="40" width="82" height="110" fill="none" stroke="#d1d5db" strokeWidth="0.5" strokeDasharray="3,2"/>
                <path d="M197,150 A42,42 0 0,1 239,150" fill="none" stroke="#7FB706" strokeWidth="0.8" strokeDasharray="3,2"/>
                <path d="M251,150 A42,42 0 0,1 293,150" fill="none" stroke="#7FB706" strokeWidth="0.8" strokeDasharray="3,2"/>
                <line x1="185" y1="168" x2="345" y2="168" stroke="#7FB706" strokeWidth="0.8"/>
                <text x="265" y="178" fontSize="8" fill="#7FB706" fontFamily="sans-serif" textAnchor="middle">2700mm</text>
              </svg>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11.5px] border-collapse">
                  <thead>
                    <tr className="bg-[#030213] dark:bg-white/10 text-white">
                      <th className="py-1.5 px-2.5 font-medium">Dimension</th>
                      <th className="py-1.5 px-2.5 font-medium text-center">General (mm)</th>
                      <th className="py-1.5 px-2.5 font-medium text-center">PH (mm)</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300 divide-y divide-gray-100 dark:divide-white/5">
                    <tr className="bg-gray-50 dark:bg-white/5"><td className="py-1.5 px-2.5">Frontal Width</td><td className="text-center">900</td><td className="text-center">1500</td></tr>
                    <tr><td className="py-1.5 px-2.5">Depth</td><td className="text-center">1500</td><td className="text-center">1800</td></tr>
                    <tr className="bg-gray-50 dark:bg-white/5"><td className="py-1.5 px-2.5">Height</td><td className="text-center">1875</td><td className="text-center">1875</td></tr>
                    <tr><td className="py-1.5 px-2.5">Door Width</td><td className="text-center">600</td><td className="text-center">900</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SAFFRON DRAWING */}
            <div className="border border-gray-200 dark:border-white/10 p-6">
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#7FB706] font-semibold mb-1">Model</div>
              <div className="font-serif text-2xl text-[#030213] dark:text-white font-bold mb-6">SAFFRON</div>
              <svg width="100%" viewBox="0 0 380 260" className="block mb-6">
                <text x="70" y="14" fontSize="10" fill="#888" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">FRONT VIEW</text>
                <line x1="10" y1="220" x2="140" y2="220" stroke="#333" strokeWidth="1.5"/>
                <rect x="10" y="70" width="13" height="139" fill="#E9FDBF" stroke="#7FB706" strokeWidth="0.8"/>
                <rect x="68" y="70" width="13" height="139" fill="#E9FDBF" stroke="#7FB706" strokeWidth="0.8"/>
                <rect x="127" y="70" width="13" height="139" fill="#E9FDBF" stroke="#7FB706" strokeWidth="0.8"/>
                <rect x="23" y="85" width="45" height="124" fill="#f4fce3" stroke="#7FB706" strokeWidth="0.8"/>
                <rect x="81" y="85" width="46" height="124" fill="#f4fce3" stroke="#7FB706" strokeWidth="0.8"/>
                <rect x="23" y="70" width="45" height="15" fill="#E9FDBF" stroke="#7FB706" strokeWidth="0.5"/>
                <rect x="81" y="70" width="46" height="15" fill="#E9FDBF" stroke="#7FB706" strokeWidth="0.5"/>
                <rect x="10" y="65" width="130" height="7" fill="#7FB706" stroke="#4a7002" strokeWidth="0.5"/>
                <rect x="11" y="209" width="9" height="11" fill="#777" stroke="#555" strokeWidth="0.5" rx="1"/>
                <rect x="69" y="209" width="9" height="11" fill="#777" stroke="#555" strokeWidth="0.5" rx="1"/>
                <rect x="128" y="209" width="9" height="11" fill="#777" stroke="#555" strokeWidth="0.5" rx="1"/>
                <circle cx="67" cy="147" r="3" fill="#030213" stroke="#000" strokeWidth="0.5"/>
                <circle cx="126" cy="147" r="3" fill="#030213" stroke="#000" strokeWidth="0.5"/>
                <line x1="4" y1="65" x2="4" y2="220" stroke="#030213" strokeWidth="0.8"/>
                <text x="2" y="142" fontSize="8" fill="#030213" fontFamily="sans-serif" textAnchor="middle" transform="rotate(-90,2,142)">2000mm</text>
                
                <text x="265" y="14" fontSize="10" fill="#888" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">TOP VIEW</text>
                <rect x="185" y="30" width="160" height="120" fill="#f4fce3" stroke="#7FB706" strokeWidth="1"/>
                <rect x="185" y="30" width="160" height="10" fill="#7FB706"/>
                <rect x="185" y="40" width="12" height="110" fill="#E9FDBF" stroke="#7FB706" strokeWidth="0.5"/>
                <rect x="239" y="40" width="12" height="110" fill="#E9FDBF" stroke="#7FB706" strokeWidth="0.5"/>
                <rect x="333" y="40" width="12" height="110" fill="#E9FDBF" stroke="#7FB706" strokeWidth="0.5"/>
                <path d="M197,150 A42,42 0 0,1 239,150" fill="none" stroke="#030213" strokeWidth="0.8" strokeDasharray="3,2"/>
                <line x1="185" y1="168" x2="345" y2="168" stroke="#030213" strokeWidth="0.8"/>
                <text x="265" y="178" fontSize="8" fill="#030213" fontFamily="sans-serif" textAnchor="middle">2700mm</text>
              </svg>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11.5px] border-collapse">
                  <thead>
                    <tr className="bg-[#7FB706] text-white">
                      <th className="py-1.5 px-2.5 font-medium">Dimension</th>
                      <th className="py-1.5 px-2.5 font-medium text-center">General (mm)</th>
                      <th className="py-1.5 px-2.5 font-medium text-center">PH (mm)</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300 divide-y divide-gray-100 dark:divide-white/5">
                    <tr className="bg-gray-50 dark:bg-white/5"><td className="py-1.5 px-2.5">Frontal Width</td><td className="text-center">900</td><td className="text-center">1500</td></tr>
                    <tr><td className="py-1.5 px-2.5">Depth</td><td className="text-center">1500</td><td className="text-center">1800</td></tr>
                    <tr className="bg-gray-50 dark:bg-white/5"><td className="py-1.5 px-2.5">Height</td><td className="text-center">1995</td><td className="text-center">1995</td></tr>
                    <tr><td className="py-1.5 px-2.5">Door Width</td><td className="text-center">600</td><td className="text-center">900</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* GUSTO DRAWING */}
            <div className="border border-gray-200 dark:border-white/10 p-6">
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#7FB706] font-semibold mb-1">Model</div>
              <div className="font-serif text-2xl text-[#030213] dark:text-white font-bold mb-6">GUSTO</div>
              <svg width="100%" viewBox="0 0 380 260" className="block mb-6">
                <text x="70" y="14" fontSize="10" fill="#888" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">FRONT VIEW</text>
                <line x1="10" y1="220" x2="140" y2="220" stroke="#333" strokeWidth="1.5"/>
                <rect x="10" y="82" width="13" height="128" fill="#f3f4f6" stroke="#030213" strokeWidth="1.2"/>
                <rect x="68" y="82" width="13" height="128" fill="#f3f4f6" stroke="#030213" strokeWidth="1.2"/>
                <rect x="127" y="82" width="13" height="128" fill="#f3f4f6" stroke="#030213" strokeWidth="1.2"/>
                <rect x="23" y="97" width="45" height="113" fill="#f9fafb" stroke="#030213" strokeWidth="0.8"/>
                <rect x="81" y="97" width="46" height="113" fill="#f9fafb" stroke="#030213" strokeWidth="0.8"/>
                <rect x="23" y="82" width="45" height="15" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <rect x="81" y="82" width="46" height="15" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <rect x="10" y="77" width="130" height="6" fill="#030213" stroke="#030213" strokeWidth="0.5"/>
                <rect x="8" y="210" width="17" height="10" fill="#030213" stroke="#030213" strokeWidth="0.5"/>
                <rect x="66" y="210" width="17" height="10" fill="#030213" stroke="#030213" strokeWidth="0.5"/>
                <rect x="125" y="210" width="17" height="10" fill="#030213" stroke="#030213" strokeWidth="0.5"/>
                <circle cx="67" cy="154" r="3" fill="#7FB706" stroke="#030213" strokeWidth="0.5"/>
                <circle cx="126" cy="154" r="3" fill="#7FB706" stroke="#030213" strokeWidth="0.5"/>
                <line x1="4" y1="77" x2="4" y2="220" stroke="#7FB706" strokeWidth="0.8"/>
                <text x="2" y="148" fontSize="8" fill="#7FB706" fontFamily="sans-serif" textAnchor="middle" transform="rotate(-90,2,148)">1840mm</text>
                
                <text x="265" y="14" fontSize="10" fill="#888" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">TOP VIEW</text>
                <rect x="185" y="30" width="160" height="120" fill="#f9fafb" stroke="#030213" strokeWidth="1"/>
                <rect x="185" y="30" width="160" height="10" fill="#030213"/>
                <rect x="185" y="40" width="12" height="110" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <rect x="239" y="40" width="12" height="110" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <rect x="333" y="40" width="12" height="110" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <rect x="197" y="40" width="42" height="110" fill="none" stroke="#d1d5db" strokeWidth="0.5" strokeDasharray="3,2"/>
                <rect x="251" y="40" width="82" height="110" fill="none" stroke="#d1d5db" strokeWidth="0.5" strokeDasharray="3,2"/>
                <path d="M197,150 A42,42 0 0,1 239,150" fill="none" stroke="#7FB706" strokeWidth="0.8" strokeDasharray="3,2"/>
                <path d="M251,150 A42,42 0 0,1 293,150" fill="none" stroke="#7FB706" strokeWidth="0.8" strokeDasharray="3,2"/>
                <line x1="185" y1="168" x2="345" y2="168" stroke="#7FB706" strokeWidth="0.8"/>
                <text x="265" y="178" fontSize="8" fill="#7FB706" fontFamily="sans-serif" textAnchor="middle">2700mm</text>
              </svg>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11.5px] border-collapse">
                  <thead>
                    <tr className="bg-[#030213] dark:bg-white/10 text-white">
                      <th className="py-1.5 px-2.5 font-medium">Dimension</th>
                      <th className="py-1.5 px-2.5 font-medium text-center">General (mm)</th>
                      <th className="py-1.5 px-2.5 font-medium text-center">PH (mm)</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300 divide-y divide-gray-100 dark:divide-white/5">
                    <tr className="bg-gray-50 dark:bg-white/5"><td className="py-1.5 px-2.5">Frontal Width</td><td className="text-center">900</td><td className="text-center">1500</td></tr>
                    <tr><td className="py-1.5 px-2.5">Depth</td><td className="text-center">1500</td><td className="text-center">1800</td></tr>
                    <tr className="bg-gray-50 dark:bg-white/5"><td className="py-1.5 px-2.5">Height</td><td className="text-center">1840</td><td className="text-center">1840</td></tr>
                    <tr><td className="py-1.5 px-2.5">Door Width</td><td className="text-center">600</td><td className="text-center">900</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SKY WINGS DRAWING */}
            <div className="border border-gray-200 dark:border-white/10 p-6">
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#7FB706] font-semibold mb-1">Model</div>
              <div className="font-serif text-2xl text-[#030213] dark:text-white font-bold mb-6">SKY WINGS</div>
              <svg width="100%" viewBox="0 0 380 260" className="block mb-6">
                <text x="70" y="14" fontSize="10" fill="#888" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">FRONT VIEW</text>
                <line x1="10" y1="20" x2="140" y2="20" stroke="#333" strokeWidth="2"/>
                <text x="145" y="22" fontSize="8" fill="#555" fontFamily="sans-serif">CEILING</text>
                <line x1="10" y1="230" x2="140" y2="230" stroke="#333" strokeWidth="1.5"/>
                <text x="145" y="232" fontSize="8" fill="#555" fontFamily="sans-serif">FLOOR</text>
                
                <rect x="10" y="20" width="14" height="180" fill="#f3f4f6" stroke="#030213" strokeWidth="0.8"/>
                <rect x="68" y="20" width="14" height="180" fill="#f3f4f6" stroke="#030213" strokeWidth="0.8"/>
                <rect x="126" y="20" width="14" height="180" fill="#f3f4f6" stroke="#030213" strokeWidth="0.8"/>
                
                <rect x="24" y="50" width="44" height="150" fill="#f9fafb" stroke="#030213" strokeWidth="0.8"/>
                <rect x="82" y="50" width="44" height="150" fill="#f9fafb" stroke="#030213" strokeWidth="0.8"/>
                
                <circle cx="66" cy="130" r="3" fill="#7FB706" stroke="#030213" strokeWidth="0.5"/>
                <circle cx="124" cy="130" r="3" fill="#7FB706" stroke="#030213" strokeWidth="0.5"/>
                <line x1="4" y1="20" x2="4" y2="200" stroke="#7FB706" strokeWidth="0.8"/>
                <text x="2" y="110" fontSize="8" fill="#7FB706" fontFamily="sans-serif" textAnchor="middle" transform="rotate(-90,2,110)">2400mm</text>
                
                <text x="265" y="14" fontSize="10" fill="#888" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">TOP VIEW</text>
                <rect x="185" y="30" width="160" height="120" fill="#f9fafb" stroke="#030213" strokeWidth="1"/>
                <rect x="185" y="30" width="160" height="10" fill="#030213"/>
                <rect x="185" y="40" width="12" height="110" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <rect x="239" y="40" width="12" height="110" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <rect x="333" y="40" width="12" height="110" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <path d="M197,150 A42,42 0 0,1 239,150" fill="none" stroke="#7FB706" strokeWidth="0.8" strokeDasharray="3,2"/>
                <path d="M251,150 A42,42 0 0,1 293,150" fill="none" stroke="#7FB706" strokeWidth="0.8" strokeDasharray="3,2"/>
                <line x1="185" y1="168" x2="345" y2="168" stroke="#7FB706" strokeWidth="0.8"/>
                <text x="265" y="178" fontSize="8" fill="#7FB706" fontFamily="sans-serif" textAnchor="middle">2700mm</text>
              </svg>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11.5px] border-collapse">
                  <thead>
                    <tr className="bg-[#030213] dark:bg-white/10 text-white">
                      <th className="py-1.5 px-2.5 font-medium">Dimension</th>
                      <th className="py-1.5 px-2.5 font-medium text-center">General (mm)</th>
                      <th className="py-1.5 px-2.5 font-medium text-center">PH (mm)</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300 divide-y divide-gray-100 dark:divide-white/5">
                    <tr className="bg-gray-50 dark:bg-white/5"><td className="py-1.5 px-2.5">Frontal Width</td><td className="text-center">900</td><td className="text-center">1500</td></tr>
                    <tr><td className="py-1.5 px-2.5">Depth</td><td className="text-center">1500</td><td className="text-center">1800</td></tr>
                    <tr className="bg-gray-50 dark:bg-white/5"><td className="py-1.5 px-2.5">Height</td><td className="text-center">2400</td><td className="text-center">2400</td></tr>
                    <tr><td className="py-1.5 px-2.5">Door Width</td><td className="text-center">600</td><td className="text-center">900</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* WALL HUNG DRAWING */}
            <div className="border border-gray-200 dark:border-white/10 p-6">
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#7FB706] font-semibold mb-1">Model</div>
              <div className="font-serif text-2xl text-[#030213] dark:text-white font-bold mb-6">WALL HUNG</div>
              <svg width="100%" viewBox="0 0 380 260" className="block mb-6">
                <text x="70" y="14" fontSize="10" fill="#888" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">FRONT VIEW</text>
                <line x1="10" y1="220" x2="140" y2="220" stroke="#333" strokeWidth="1.5"/>
                <rect x="10" y="58" width="130" height="8" fill="#030213" stroke="#030213" strokeWidth="0.5"/>
                <rect x="10" y="66" width="14" height="134" fill="#f3f4f6" stroke="#030213" strokeWidth="0.8"/>
                <rect x="68" y="66" width="14" height="134" fill="#f3f4f6" stroke="#030213" strokeWidth="0.8"/>
                <rect x="126" y="66" width="14" height="134" fill="#f3f4f6" stroke="#030213" strokeWidth="0.8"/>
                <rect x="24" y="66" width="44" height="134" fill="#f9fafb" stroke="#030213" strokeWidth="0.8"/>
                <rect x="82" y="66" width="44" height="134" fill="#f9fafb" stroke="#030213" strokeWidth="0.8"/>
                
                <circle cx="66" cy="133" r="3" fill="#7FB706" stroke="#030213" strokeWidth="0.5"/>
                <circle cx="124" cy="133" r="3" fill="#7FB706" stroke="#030213" strokeWidth="0.5"/>
                <line x1="4" y1="58" x2="4" y2="220" stroke="#7FB706" strokeWidth="0.8"/>
                <text x="2" y="139" fontSize="8" fill="#7FB706" fontFamily="sans-serif" textAnchor="middle" transform="rotate(-90,2,139)">2050mm</text>
                
                <text x="265" y="14" fontSize="10" fill="#888" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">TOP VIEW</text>
                <rect x="185" y="30" width="160" height="120" fill="#f9fafb" stroke="#030213" strokeWidth="1"/>
                <rect x="185" y="30" width="160" height="10" fill="#030213"/>
                <rect x="185" y="40" width="12" height="110" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <rect x="239" y="40" width="12" height="110" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <rect x="333" y="40" width="12" height="110" fill="#e5e7eb" stroke="#030213" strokeWidth="0.5"/>
                <path d="M197,150 A42,42 0 0,1 239,150" fill="none" stroke="#7FB706" strokeWidth="0.8" strokeDasharray="3,2"/>
                <path d="M251,150 A42,42 0 0,1 293,150" fill="none" stroke="#7FB706" strokeWidth="0.8" strokeDasharray="3,2"/>
                <line x1="185" y1="168" x2="345" y2="168" stroke="#7FB706" strokeWidth="0.8"/>
                <text x="265" y="178" fontSize="8" fill="#7FB706" fontFamily="sans-serif" textAnchor="middle">2700mm</text>
              </svg>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11.5px] border-collapse">
                  <thead>
                    <tr className="bg-[#030213] dark:bg-white/10 text-white">
                      <th className="py-1.5 px-2.5 font-medium">Dimension</th>
                      <th className="py-1.5 px-2.5 font-medium text-center">General (mm)</th>
                      <th className="py-1.5 px-2.5 font-medium text-center">PH (mm)</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300 divide-y divide-gray-100 dark:divide-white/5">
                    <tr className="bg-gray-50 dark:bg-white/5"><td className="py-1.5 px-2.5">Frontal Width</td><td className="text-center">900</td><td className="text-center">1500</td></tr>
                    <tr><td className="py-1.5 px-2.5">Depth</td><td className="text-center">1500</td><td className="text-center">1800</td></tr>
                    <tr className="bg-gray-50 dark:bg-white/5"><td className="py-1.5 px-2.5">Height</td><td className="text-center">2050</td><td className="text-center">2050</td></tr>
                    <tr><td className="py-1.5 px-2.5">Door Width</td><td className="text-center">600</td><td className="text-center">900</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SPLENDOR DRAWING */}
            <div className="border border-gray-200 dark:border-white/10 p-6">
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#7FB706] font-semibold mb-1">Model</div>
              <div className="font-serif text-2xl text-[#030213] dark:text-white font-bold mb-6">SPLENDOR</div>
              <svg width="100%" viewBox="0 0 380 260" className="block mb-6">
                <text x="70" y="14" fontSize="10" fill="#888" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">FRONT VIEW</text>
                <line x1="10" y1="220" x2="140" y2="220" stroke="#333" strokeWidth="1.5"/>
                <rect x="10" y="72" width="18" height="148" fill="#9ca3af" stroke="#4b5563" strokeWidth="1"/>
                <rect x="68" y="72" width="18" height="148" fill="#9ca3af" stroke="#4b5563" strokeWidth="1"/>
                <rect x="126" y="72" width="18" height="148" fill="#9ca3af" stroke="#4b5563" strokeWidth="1"/>
                <line x1="10" y1="90" x2="28" y2="90" stroke="#4b5563" strokeWidth="0.5"/>
                <line x1="10" y1="110" x2="28" y2="110" stroke="#4b5563" strokeWidth="0.5"/>
                <line x1="10" y1="130" x2="28" y2="130" stroke="#4b5563" strokeWidth="0.5"/>
                <line x1="10" y1="150" x2="28" y2="150" stroke="#4b5563" strokeWidth="0.5"/>
                <line x1="10" y1="170" x2="28" y2="170" stroke="#4b5563" strokeWidth="0.5"/>
                <line x1="10" y1="190" x2="28" y2="190" stroke="#4b5563" strokeWidth="0.5"/>
                <line x1="10" y1="210" x2="28" y2="210" stroke="#4b5563" strokeWidth="0.5"/>
                
                <rect x="28" y="85" width="40" height="135" fill="#f9fafb" stroke="#030213" strokeWidth="0.8"/>
                <rect x="86" y="85" width="40" height="135" fill="#f9fafb" stroke="#030213" strokeWidth="0.8"/>
                
                <circle cx="63" cy="152" r="3" fill="#7FB706" stroke="#030213" strokeWidth="0.5"/>
                <circle cx="121" cy="152" r="3" fill="#7FB706" stroke="#030213" strokeWidth="0.5"/>
                <line x1="4" y1="72" x2="4" y2="220" stroke="#7FB706" strokeWidth="0.8"/>
                <text x="2" y="146" fontSize="8" fill="#7FB706" fontFamily="sans-serif" textAnchor="middle" transform="rotate(-90,2,146)">1980mm</text>
                
                <text x="265" y="14" fontSize="10" fill="#888" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">TOP VIEW</text>
                <rect x="185" y="30" width="160" height="120" fill="#f9fafb" stroke="#030213" strokeWidth="1"/>
                <rect x="185" y="30" width="160" height="10" fill="#030213"/>
                <rect x="185" y="40" width="18" height="110" fill="#9ca3af" stroke="#4b5563" strokeWidth="1"/>
                <rect x="239" y="40" width="18" height="110" fill="#9ca3af" stroke="#4b5563" strokeWidth="1"/>
                <rect x="333" y="40" width="18" height="110" fill="#9ca3af" stroke="#4b5563" strokeWidth="1"/>
                <path d="M203,150 A36,36 0 0,1 239,150" fill="none" stroke="#7FB706" strokeWidth="0.8" strokeDasharray="3,2"/>
                <path d="M257,150 A36,36 0 0,1 293,150" fill="none" stroke="#7FB706" strokeWidth="0.8" strokeDasharray="3,2"/>
                <line x1="185" y1="168" x2="345" y2="168" stroke="#7FB706" strokeWidth="0.8"/>
                <text x="265" y="178" fontSize="8" fill="#7FB706" fontFamily="sans-serif" textAnchor="middle">2700mm</text>
              </svg>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11.5px] border-collapse">
                  <thead>
                    <tr className="bg-[#030213] dark:bg-white/10 text-white">
                      <th className="py-1.5 px-2.5 font-medium">Dimension</th>
                      <th className="py-1.5 px-2.5 font-medium text-center">General (mm)</th>
                      <th className="py-1.5 px-2.5 font-medium text-center">PH (mm)</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300 divide-y divide-gray-100 dark:divide-white/5">
                    <tr className="bg-gray-50 dark:bg-white/5"><td className="py-1.5 px-2.5">Frontal Width</td><td className="text-center">600-900</td><td className="text-center">1500</td></tr>
                    <tr><td className="py-1.5 px-2.5">Depth</td><td className="text-center">1500</td><td className="text-center">1800</td></tr>
                    <tr className="bg-gray-50 dark:bg-white/5"><td className="py-1.5 px-2.5">Height</td><td className="text-center">1980</td><td className="text-center">1980</td></tr>
                    <tr><td className="py-1.5 px-2.5">Door Width</td><td className="text-center">600</td><td className="text-center">900</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
