// ── Location Data for all 5 location landing pages ──

export interface LocationFAQ {
  question: string;
  answer: string;
}

export interface LocationData {
  slug: string;
  city: string;
  region: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  whatsapp: string;
  mapSrc: string;
  meta: { title: string; description: string; keywords?: string };
  stats: { label: string; value: string; numericValue: number; suffix: string }[];
  services: { title: string; desc: string }[];
  industries: { name: string; icon: string }[];
  projects: string[];
  whyChoose: { title: string; desc: string }[];
  faqs: LocationFAQ[];
  heroImage: string;
  heroImages?: string[];
  galleryImages: string[];
}

// ── High-quality Unsplash images for each location ──
const IMAGES = {
  delhi: {
    hero: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1582407947092-205e6e38e9da?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    ],
  },
  mumbai: {
    hero: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    ],
  },
  bangalore: {
    hero: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
    ],
  },
  ahmedabad: {
    hero: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&q=80",
      "https://images.unsplash.com/photo-1600573472556-e636c2acda9e?w=800&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    ],
  },
  uae: {
    hero: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80",
    ],
  },
  kolkata: {
    hero: "https://images.unsplash.com/photo-1558431382-27e303142255?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&q=80",
      "https://images.unsplash.com/photo-1600573472556-e636c2acda9e?w=800&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    ],
  },
};

const COMMON_SERVICES = [
  { title: "Restroom Cubicles", desc: "Premium HPL, compact laminate, and stainless steel cubicle systems" },
  { title: "Shower Cubicles", desc: "Waterproof, durable shower partitions for commercial and hospitality use" },
  { title: "Locker Solutions", desc: "Customizable locker systems for gyms, offices, and public facilities" },
  { title: "Exterior Cladding", desc: "Weather-resistant HPL and metal cladding for building facades" },
  { title: "Custom Hardware", desc: "Precision-engineered hardware accessories for partitioning systems" },
  { title: "Commercial Interiors", desc: "End-to-end interior contracting for large-scale commercial projects" },
];

const COMMON_INDUSTRIES = [
  { name: "Airports", icon: "Plane" },
  { name: "Schools & Colleges", icon: "GraduationCap" },
  { name: "Hospitals", icon: "Heart" },
  { name: "Corporate Offices", icon: "Building2" },
  { name: "Stadiums", icon: "Trophy" },
  { name: "Gyms & Sports", icon: "Dumbbell" },
  { name: "Railways & Metro", icon: "Train" },
  { name: "Shopping Malls", icon: "ShoppingBag" },
  { name: "Public Infrastructure", icon: "Landmark" },
];

const COMMON_WHY_CHOOSE = [
  { title: "Premium Materials", desc: "ISO-certified manufacturing with HPL, compact laminate & stainless steel" },
  { title: "Proven Durability", desc: "Products tested for 10+ years of heavy commercial use" },
  { title: "Custom Manufacturing", desc: "Bespoke designs tailored to your architectural vision" },
  { title: "Fast Installation", desc: "Professional teams ensuring minimal disruption to operations" },
  { title: "B2B Project Expertise", desc: "Dedicated project managers for large-scale commercial rollouts" },
  { title: "Nationwide Execution", desc: "Pan-India delivery and installation with local support" },
];

export const locations: Record<string, LocationData> = {
  delhi: {
    slug: "delhi",
    city: "Delhi NCR",
    region: "North India · Head Office",
    tagline: "Premium Infrastructure Solutions for India's Capital Region",
    description: "Our head office and primary manufacturing facility in Delhi drives all pan-India operations. Serving the National Capital Region with world-class restroom cubicles, exterior cladding, and commercial interior solutions.",
    address: "Okhla Industrial Estate, New Delhi - 110020, Delhi, India",
    phone: "+91 98185 92113",
    email: "info@pacificproduct.in",
    hours: "Mon–Sat: 9:00 AM – 6:00 PM",
    whatsapp: "919818592113",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112130.34005085694!2d76.99403816684724!3d28.514782017772656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19d582e38859%3A0x2cf5fe8e5c64b1e!2sGurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1713550212891!5m2!1sen!2sin",
    meta: {
      title: "Restroom Cubicles & Interior Solutions in Delhi NCR | Pacific Products",
      description: "Leading manufacturer & installer of restroom cubicles, shower partitions, exterior cladding & commercial interiors in Delhi NCR. Get a free quote today.",
      keywords: "restroom cubicles delhi, shower partitions ncr, exterior cladding delhi ncr, commercial interiors gurgaon, toilet cubicles noida, HPL panels delhi, locker solutions ncr, restroom cubicles, toilet cubicles, custom hardware",
    },
    stats: [
      { label: "Years of Expertise", value: "12+", numericValue: 12, suffix: "+" },
      { label: "Projects Completed", value: "600+", numericValue: 600, suffix: "+" },
      { label: "Prestigious Clients", value: "100+", numericValue: 100, suffix: "+" },
      { label: "Offices Across India", value: "4", numericValue: 4, suffix: "" },
    ],
    services: COMMON_SERVICES,
    industries: COMMON_INDUSTRIES,
    projects: ["Corporate Office Towers", "Metro Stations", "Shopping Malls", "5-Star Hotels", "Government Infrastructure", "Educational Institutions"],
    whyChoose: COMMON_WHY_CHOOSE,
    faqs: [
      { question: "Do you provide restroom cubicle installation in Delhi NCR?", answer: "Yes, we offer end-to-end design, manufacturing, and installation of restroom cubicles across Delhi, Gurugram, Noida, and the entire NCR region." },
      { question: "What materials do you use for cubicle partitions in Delhi?", answer: "We use premium HPL (High-Pressure Laminate), compact laminate, stainless steel 304/316, and nylon hardware — all suitable for Delhi's climate." },
      { question: "Can you handle large commercial projects in Delhi NCR?", answer: "Absolutely. We have completed projects including corporate towers, metro stations, 5-star hotels, and large-scale institutional buildings across NCR." },
      { question: "What is the typical project timeline in Delhi NCR?", answer: "Standard projects take 2-4 weeks from measurement to installation. Large-scale projects are handled on custom timelines with dedicated project managers." },
      { question: "Do you offer after-sales service in Delhi?", answer: "Yes, we provide comprehensive after-sales support including maintenance, repairs, and replacement parts with quick response times across NCR." },
    ],
    heroImage: IMAGES.delhi.hero,
    galleryImages: IMAGES.delhi.gallery,
  },
  mumbai: {
    slug: "mumbai",
    city: "Mumbai",
    region: "West India",
    tagline: "India's Commercial Capital Trusts Pacific Products",
    description: "Our regional team in Mumbai serves western India with world-class restroom cubicles, cladding, and interior solutions for commercial landmarks, corporate campuses, and hospitality projects.",
    address: "Andheri East, Mumbai, Maharashtra, India",
    phone: "+91 98185 92113",
    email: "info@pacificproduct.in",
    hours: "Mon–Sat: 9:00 AM – 6:00 PM",
    whatsapp: "919818592113",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60340.42!2d72.847!3d19.113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c84c4ad0a22d%3A0x5c3a0a4c1a7a1b7e!2sAndheri%20East%2C%20Mumbai!5e0!3m2!1sen!2sin!4v1713550212891!5m2!1sen!2sin",
    meta: {
      title: "Restroom Cubicles & Commercial Interiors in Mumbai | Pacific Products",
      description: "Mumbai's trusted partner for restroom cubicles, shower partitions, exterior cladding & locker systems for corporate offices, malls, and hospitality projects.",
      keywords: "restroom cubicles mumbai, toilet partitions maharashtra, commercial interiors mumbai, shower cubicles pune, exterior cladding mumbai, HPL toilet partitions, locker systems mumbai, restroom cubicles, toilet cubicles, custom hardware",
    },
    stats: [
      { label: "Years of Expertise", value: "12+", numericValue: 12, suffix: "+" },
      { label: "Projects Completed", value: "600+", numericValue: 600, suffix: "+" },
      { label: "Prestigious Clients", value: "100+", numericValue: 100, suffix: "+" },
      { label: "Offices Across India", value: "4", numericValue: 4, suffix: "" },
    ],
    services: COMMON_SERVICES,
    industries: COMMON_INDUSTRIES,
    projects: ["Corporate Office Campuses", "Retail & Mall Fit-Outs", "Hospitality Projects", "Airport Lounges", "IT Parks", "Healthcare Facilities"],
    whyChoose: COMMON_WHY_CHOOSE,
    faqs: [
      { question: "Do you serve the Mumbai region?", answer: "Yes, our team covers Mumbai, Navi Mumbai, Thane, Pune, and the wider Maharashtra region with full design, supply, and installation services." },
      { question: "Do you manufacture restroom cubicles in-house?", answer: "Yes, all our products are manufactured at our ISO-certified facility, ensuring quality control at every stage." },
      { question: "Can you supply cubicles for high-rise buildings in Mumbai?", answer: "Absolutely. We have experience installing cubicle systems in corporate towers, luxury hotels, and high-rise complexes across Mumbai." },
      { question: "Do you handle exports to international markets?", answer: "Yes, we serve clients across the Middle East, Southeast Asia, and Africa. Contact us to discuss your international project." },
      { question: "What warranty do you offer on products?", answer: "All products come with a 5-year comprehensive warranty covering manufacturing defects, with extended warranty options available." },
    ],
    heroImage: IMAGES.mumbai.hero,
    galleryImages: IMAGES.mumbai.gallery,
  },
  bangalore: {
    slug: "bangalore",
    city: "Bangalore",
    region: "South India",
    tagline: "Engineered Solutions for India's Silicon Valley",
    description: "Catering to India's tech capital, our Bangalore team specializes in corporate office solutions, IT park fit-outs, and tech campus facilities. We deliver precision-engineered restroom cubicles, interior solutions, and exterior cladding to Bangalore's commercial and institutional spaces.",
    address: "Bangalore, Karnataka, India",
    phone: "+91 98185 92113",
    email: "info@pacificproduct.in",
    hours: "Mon–Sat: 9:00 AM – 6:00 PM",
    whatsapp: "919818592113",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62208.08!2d77.606!3d12.839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6b2e6b2e6b2e%3A0x1a7a7a7a7a7a7a7a!2sElectronic%20City%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1713550212891!5m2!1sen!2sin",
    meta: {
      title: "Restroom Cubicles & IT Park Interiors in Bangalore | Pacific Products",
      description: "Bangalore's trusted partner for restroom cubicles, corporate interiors, locker systems & exterior cladding for IT parks, corporate campuses, and commercial projects.",
      keywords: "restroom cubicles bangalore, IT park interiors bengaluru, shower cubicles karnataka, exterior cladding bangalore, toilet partitions bengaluru, commercial locker systems, restroom cubicles, toilet cubicles, custom hardware",
    },
    stats: [
      { label: "Years of Expertise", value: "12+", numericValue: 12, suffix: "+" },
      { label: "Projects Completed", value: "600+", numericValue: 600, suffix: "+" },
      { label: "Prestigious Clients", value: "100+", numericValue: 100, suffix: "+" },
      { label: "Offices Across India", value: "4", numericValue: 4, suffix: "" },
    ],
    services: COMMON_SERVICES,
    industries: COMMON_INDUSTRIES,
    projects: ["IT Parks & Tech Campuses", "Corporate Office Fit-Outs", "Shopping Malls", "Healthcare Facilities", "Educational Institutions", "Hospitality Projects"],
    whyChoose: COMMON_WHY_CHOOSE,
    faqs: [
      { question: "Do you install restroom cubicles in IT parks in Bangalore?", answer: "Yes, we specialize in IT park and tech campus installations. Our team has completed projects across various corporate and tech facilities in Bangalore." },
      { question: "Can you handle weekend installations to avoid office disruption?", answer: "Absolutely. We routinely schedule installations during weekends and off-hours to minimize disruption to ongoing business operations." },
      { question: "What cubicle materials are best for Bangalore's climate?", answer: "We recommend compact laminate and HPL cubicles which resist Bangalore's humidity. All our products are moisture-resistant and termite-proof." },
      { question: "Do you provide design consultation in Bangalore?", answer: "Yes, our team includes design consultants who can visit your site, take measurements, and provide detailed plans before manufacturing." },
      { question: "What is your service area in South India?", answer: "We serve all of Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, and Telangana from our Bangalore operations center." },
    ],
    heroImage: IMAGES.bangalore.hero,
    galleryImages: IMAGES.bangalore.gallery,
  },
  ahmedabad: {
    slug: "ahmedabad",
    city: "Ahmedabad",
    region: "West India",
    tagline: "Building Gujarat's Commercial Infrastructure",
    description: "Serving Gujarat and surrounding states with high-quality interior solutions for commercial, industrial, and institutional projects. Our Ahmedabad operations are a key gateway for western India, delivering restroom cubicles, cladding, and locker systems to Gujarat's fastest-growing commercial ecosystem.",
    address: "Ahmedabad, Gujarat, India",
    phone: "+91 98185 92113",
    email: "info@pacificproduct.in",
    hours: "Mon–Sat: 9:00 AM – 6:00 PM",
    whatsapp: "919818592113",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117875.16!2d72.439!3d23.020!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1713550212891!5m2!1sen!2sin",
    meta: {
      title: "Restroom Cubicles & Interior Solutions in Ahmedabad | Pacific Products",
      description: "Ahmedabad's preferred partner for restroom cubicles, shower partitions, exterior cladding & locker solutions. Serving commercial projects across Gujarat. Free site visit.",
      keywords: "restroom cubicles ahmedabad, toilet partitions gujarat, shower cubicles surat, exterior cladding ahmedabad, commercial interiors vadodara, HPL cubicles gujarat, restroom cubicles, toilet cubicles, custom hardware",
    },
    stats: [
      { label: "Years of Expertise", value: "12+", numericValue: 12, suffix: "+" },
      { label: "Projects Completed", value: "600+", numericValue: 600, suffix: "+" },
      { label: "Prestigious Clients", value: "100+", numericValue: 100, suffix: "+" },
      { label: "Offices Across India", value: "4", numericValue: 4, suffix: "" },
    ],
    services: COMMON_SERVICES,
    industries: COMMON_INDUSTRIES,
    projects: ["Metro Stations", "Corporate Campuses", "Industrial Facility Fit-Outs", "Government Infrastructure", "Retail & Commercial Spaces", "Educational Institutions"],
    whyChoose: COMMON_WHY_CHOOSE,
    faqs: [
      { question: "Do you provide cubicle solutions across Gujarat?", answer: "Yes, we serve all major cities in Gujarat including Ahmedabad, Surat, Vadodara, Rajkot, and Gandhinagar." },
      { question: "Can you handle industrial facility projects in GIDC areas?", answer: "Absolutely. We have extensive experience with industrial facility fit-outs across Gujarat, including factories, warehouses, and processing plants." },
      { question: "What makes your products suitable for Gujarat's climate?", answer: "Our products use UV-resistant, heat-tolerant materials like compact laminate and HPL that withstand Gujarat's hot, arid climate without warping or fading." },
      { question: "Do you offer site visits in Ahmedabad?", answer: "Yes, our team provides free site visits, measurements, and consultations across Ahmedabad and surrounding areas." },
      { question: "Can you work on government infrastructure projects?", answer: "Yes, we are registered and experienced in executing government infrastructure projects including metro stations, public amenities, and institutional buildings." },
    ],
    heroImage: IMAGES.ahmedabad.hero,
    galleryImages: IMAGES.ahmedabad.gallery,
  },
  uae: {
    slug: "uae",
    city: "Dubai, UAE",
    region: "Middle East",
    tagline: "World-Class Solutions for the Gulf Region",
    description: "Expanding our global footprint across the Middle East, our Dubai operations serve clients in UAE, Saudi Arabia, and other GCC countries. We deliver luxury-grade restroom cubicles, cladding systems, and commercial interior solutions that meet international standards.",
    address: "Al Quoz Industrial Area 3, Dubai, United Arab Emirates",
    phone: "+91 98185 92113",
    email: "ejaj@pacificproduct.in",
    hours: "Sun–Thu: 9:00 AM – 6:00 PM",
    whatsapp: "919818592113",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57840.02!2d55.230!3d25.197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f696ef9df4b4d%3A0x2e3e16da3b3b3b3b!2sAl%20Quoz%2C%20Dubai!5e0!3m2!1sen!2sae!4v1713550212891!5m2!1sen!2sae",
    meta: {
      title: "Luxury Restroom Cubicles & Commercial Interiors in Dubai UAE | Pacific Products",
      description: "Trusted supplier of luxury restroom cubicles, shower partitions, exterior cladding & commercial interiors for UAE & GCC projects. Contact us for a free quote.",
      keywords: "restroom cubicles dubai, toilet partitions uae, luxury shower cubicles abu dhabi, exterior cladding uae, commercial interiors dubai, HPL panels middle east, locker systems uae, restroom cubicles, toilet cubicles, custom hardware",
    },
    stats: [
      { label: "Years of Expertise", value: "12+", numericValue: 12, suffix: "+" },
      { label: "Projects Completed", value: "600+", numericValue: 600, suffix: "+" },
      { label: "Prestigious Clients", value: "100+", numericValue: 100, suffix: "+" },
      { label: "GCC Countries Served", value: "5+", numericValue: 5, suffix: "+" },
    ],
    services: COMMON_SERVICES,
    industries: COMMON_INDUSTRIES,
    projects: ["Corporate Office Towers", "Luxury Hotels & Resorts", "Shopping Malls", "Airport Commercial Areas", "Healthcare Facilities", "Government Buildings"],
    whyChoose: COMMON_WHY_CHOOSE,
    faqs: [
      { question: "Do you supply restroom cubicles in Dubai and UAE?", answer: "Yes, we supply, deliver, and install premium restroom cubicles across Dubai, Abu Dhabi, Sharjah, and all UAE emirates." },
      { question: "Are your products compliant with UAE building codes?", answer: "Absolutely. All our products meet UAE Civil Defence requirements, Dubai Municipality standards, and international fire safety certifications." },
      { question: "Can you handle projects across the GCC region?", answer: "Yes, we serve clients across UAE, Saudi Arabia, Oman, Bahrain, Qatar, and Kuwait from our Dubai operations hub." },
      { question: "Do you offer luxury-grade cubicle solutions?", answer: "Yes, we specialize in high-end cubicle systems with premium finishes including glass, stainless steel, and designer laminates for luxury hospitality and commercial spaces." },
      { question: "What is the import process for your products to UAE?", answer: "We handle all logistics including export documentation, customs clearance, and delivery to site. Contact us to discuss your project timeline." },
    ],
    heroImage: IMAGES.uae.hero,
    galleryImages: IMAGES.uae.gallery,
  },
  kolkata: {
    slug: "kolkata",
    city: "Kolkata",
    region: "East India",
    tagline: "Infrastructure Solutions for the City of Joy",
    description: "Serving East India from our Kolkata operations, we provide world-class restroom cubicles, cladding, and commercial interior solutions. Blending modern infrastructure with Kolkata's rich architectural heritage.",
    address: "Salt Lake Sector V, Kolkata - 700091, West Bengal",
    phone: "+91 98185 92113",
    email: "info@pacificproduct.in",
    hours: "Mon–Sat: 9:00 AM – 6:00 PM",
    whatsapp: "919818592113",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.33!2d88.264!3d22.535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f882db4908f667%3A0x43e330e68f6c2cbc!2sKolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1713550212891!5m2!1sen!2sin",
    meta: {
      title: "Restroom Cubicles & Commercial Interiors in Kolkata | Pacific Products",
      description: "Kolkata's preferred partner for restroom cubicles, shower partitions, exterior cladding & locker solutions for commercial projects across West Bengal. Free site visit.",
      keywords: "restroom cubicles kolkata, toilet partitions west bengal, shower cubicles east india, exterior cladding kolkata, commercial interiors bengal, HPL panels kolkata, restroom cubicles, toilet cubicles, custom hardware",
    },
    stats: [
      { label: "Years of Expertise", value: "12+", numericValue: 12, suffix: "+" },
      { label: "Projects Completed", value: "600+", numericValue: 600, suffix: "+" },
      { label: "Prestigious Clients", value: "100+", numericValue: 100, suffix: "+" },
      { label: "Offices Across India", value: "4", numericValue: 4, suffix: "" },
    ],
    services: COMMON_SERVICES,
    industries: COMMON_INDUSTRIES,
    projects: ["Metro Stations", "IT Parks & Tech Campuses", "Shopping Malls", "Corporate Office Towers", "Healthcare Facilities", "Government & Public Infrastructure"],
    whyChoose: COMMON_WHY_CHOOSE,
    faqs: [
      { question: "Do you provide cubicle solutions across West Bengal?", answer: "Yes, we serve all major areas in West Bengal including Kolkata, Howrah, Siliguri, Asansol, and Durgapur." },
      { question: "Can you handle installations in old heritage buildings?", answer: "Absolutely. We have experience installing modern cubicle systems while respecting the structural integrity of heritage properties." },
      { question: "What materials are best suited for Kolkata's humid climate?", answer: "Our compact laminate and HPL cubicles are highly moisture-resistant, making them ideal for Kolkata's high humidity levels." },
      { question: "Do you offer site visits in Kolkata?", answer: "Yes, our team provides free site visits, measurements, and consultations across Kolkata and neighboring areas." },
      { question: "Are your installations suitable for large IT parks?", answer: "Yes, we specialize in high-traffic installations for IT parks and corporate spaces, including those in Salt Lake Sector V and Rajarhat." },
    ],
    heroImage: IMAGES.kolkata.hero,
    galleryImages: IMAGES.kolkata.gallery,
  },
};
