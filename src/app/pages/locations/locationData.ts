// ── Location Data for Delhi, Bangalore, and Kolkata ──

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

// ── High-quality Unsplash images for active locations ──
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
  mumbai: {
    hero: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80",
    ],
  },
  ahmedabad: {
    hero: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600573472556-e636c2acda9e?w=800&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    ],
  },
  uae: {
    hero: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&q=80",
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80",
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
      { label: "Offices Across India", value: "3", numericValue: 3, suffix: "" },
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
      { label: "Offices Across India", value: "3", numericValue: 3, suffix: "" },
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
      { label: "Offices Across India", value: "3", numericValue: 3, suffix: "" },
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
  mumbai: {
    slug: "mumbai",
    city: "Mumbai",
    region: "West India · Financial Capital",
    tagline: "Commercial Restroom & Partition Engineering for Mumbai & MMR",
    description: "Serving Mumbai, Navi Mumbai, Thane, and Pune with heavy-duty restroom cubicles, locker systems, and architectural cladding. Built to endure intense commercial footfalls and coastal monsoon conditions.",
    address: "Andheri East, Mumbai - 400069, Maharashtra, India",
    phone: "+91 98185 92113",
    email: "info@pacificproduct.in",
    hours: "Mon–Sat: 9:00 AM – 6:00 PM",
    whatsapp: "919818592113",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1713550212891!5m2!1sen!2sin",
    meta: {
      title: "Restroom Cubicles & Commercial Partitions in Mumbai | Pacific Products",
      description: "Leading manufacturer and supplier of restroom cubicles, toilet partitions, and compact laminate lockers in Mumbai, Thane, and Pune. Free site inspection.",
      keywords: "restroom cubicles mumbai, toilet partitions thane, shower cubicles pune, commercial washroom navi mumbai, HPL partitions mumbai, locker systems mumbai",
    },
    stats: [
      { label: "Years of Expertise", value: "12+", numericValue: 12, suffix: "+" },
      { label: "Projects Completed", value: "600+", numericValue: 600, suffix: "+" },
      { label: "Prestigious Clients", value: "100+", numericValue: 100, suffix: "+" },
      { label: "Offices Across India", value: "4", numericValue: 4, suffix: "" },
    ],
    services: COMMON_SERVICES,
    industries: COMMON_INDUSTRIES,
    projects: ["BKC Corporate HQs", "Chhatrapati Shivaji Maharaj International Airport Hubs", "Metro One Stations", "Luxury Shopping Malls", "Grade-A IT Campuses"],
    whyChoose: COMMON_WHY_CHOOSE,
    faqs: [
      { question: "Do you supply restroom cubicles in Mumbai and Pune?", answer: "Yes, we handle complete manufacturing, delivery, and installation across Mumbai, Navi Mumbai, Thane, and Pune." },
      { question: "Are your cubicles resistant to Mumbai's coastal humidity?", answer: "Our 12mm/18mm solid compact phenolic laminates and Grade 304/316 SS hardware are 100% moisture, rust, and water resistant." },
      { question: "Can you execute overnight installations in commercial buildings?", answer: "Yes, our installation teams operate in night shifts and weekends across Mumbai commercial hubs like BKC, Lower Parel, and Andheri." },
      { question: "What is the turnaround time for Mumbai projects?", answer: "Standard catalog models ship within 7–10 days with turnkey installation completed by our certified Mumbai crew." },
    ],
    heroImage: IMAGES.mumbai.hero,
    galleryImages: IMAGES.mumbai.gallery,
  },
  ahmedabad: {
    slug: "ahmedabad",
    city: "Ahmedabad",
    region: "West India · Gujarat Hub",
    tagline: "Industrial-Grade Restroom Cubicles & Partitions in Gujarat",
    description: "Delivering world-class restroom cubicles, industrial locker systems, and exterior facade cladding across Ahmedabad, GIFT City, Surat, and Vadodara.",
    address: "SG Highway, Ahmedabad - 380054, Gujarat, India",
    phone: "+91 98185 92113",
    email: "info@pacificproduct.in",
    hours: "Mon–Sat: 9:00 AM – 6:00 PM",
    whatsapp: "919818592113",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117502.94692790956!2d72.4883495449219!3d23.0204741!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1713550212891!5m2!1sen!2sin",
    meta: {
      title: "Restroom Cubicles & Toilet Partitions in Ahmedabad | Pacific Products",
      description: "ISO-certified restroom cubicles, urinal partitions, and locker systems for corporate offices, GIFT City towers, and industrial plants across Gujarat.",
      keywords: "restroom cubicles ahmedabad, toilet partitions gujarat, gift city washroom cubicles, surat commercial lockers, vadodara restroom partitions",
    },
    stats: [
      { label: "Years of Expertise", value: "12+", numericValue: 12, suffix: "+" },
      { label: "Projects Completed", value: "600+", numericValue: 600, suffix: "+" },
      { label: "Prestigious Clients", value: "100+", numericValue: 100, suffix: "+" },
      { label: "Offices Across India", value: "4", numericValue: 4, suffix: "" },
    ],
    services: COMMON_SERVICES,
    industries: COMMON_INDUSTRIES,
    projects: ["GIFT City Smart Towers", "Pharma SEZ Units", "Ahmedabad Metro Stations", "Textile & Manufacturing Parks", "Institutional Campuses"],
    whyChoose: COMMON_WHY_CHOOSE,
    faqs: [
      { question: "Do you serve GIFT City and industrial zones in Gujarat?", answer: "Yes, we regularly supply and install modular cubicle systems and heavy-duty phenolic lockers in GIFT City, Sanand, Surat, and Vadodara." },
      { question: "What materials do you recommend for pharmaceutical cleanrooms?", answer: "We supply anti-microbial, steam-washable compact laminate partitions with seamless joints and hospital-grade hardware." },
      { question: "Do you offer GST billing and local site consultation in Ahmedabad?", answer: "Yes, we provide full local support, on-site measurements, and compliance billing across Gujarat." },
    ],
    heroImage: IMAGES.ahmedabad.hero,
    galleryImages: IMAGES.ahmedabad.gallery,
  },
  uae: {
    slug: "uae",
    city: "Dubai, UAE",
    region: "Middle East & GCC Operations Hub",
    tagline: "International Restroom Cubicles & Lockers for GCC Projects",
    description: "Pacific Products & Solutions delivers luxury architectural restroom cubicles, stainless steel partitions, and electronic locker systems across UAE, Saudi Arabia, Qatar, and Oman.",
    address: "Business Bay, Dubai, United Arab Emirates",
    phone: "+91 98185 92113",
    email: "info@pacificproduct.in",
    hours: "Sun–Thu: 8:30 AM – 5:30 PM",
    whatsapp: "919818592113",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115582.49386348633!2d55.19503463765103!3d25.197196999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sin!4v1713550212891!5m2!1sen!2sin",
    meta: {
      title: "Restroom Cubicles & Toilet Partitions Supplier Dubai UAE | Pacific Products",
      description: "Premium restroom cubicles, phenolic lockers, and HPL washroom partitions for commercial towers, hotels, and malls in Dubai, Abu Dhabi, and GCC countries.",
      keywords: "restroom cubicles dubai, toilet partitions uae, phenolic lockers abu dhabi, commercial washroom cubicles gcc, hpl partitions middle east",
    },
    stats: [
      { label: "Years of Expertise", value: "12+", numericValue: 12, suffix: "+" },
      { label: "Projects Completed", value: "600+", numericValue: 600, suffix: "+" },
      { label: "Prestigious Clients", value: "100+", numericValue: 100, suffix: "+" },
      { label: "Global Reach", value: "GCC", numericValue: 6, suffix: " Countries" },
    ],
    services: COMMON_SERVICES,
    industries: COMMON_INDUSTRIES,
    projects: ["Dubai Commercial Towers", "Hospitality Resorts & Spas", "International Airport Terminals", "Shopping Malls", "High-End Fitness Centers"],
    whyChoose: COMMON_WHY_CHOOSE,
    faqs: [
      { question: "Do you supply and export restroom cubicles to UAE and GCC?", answer: "Yes, we manufacture and export complete knockdown cubicle and locker packages with international export packaging to Dubai, Abu Dhabi, Riyadh, and Doha." },
      { question: "What international standards do your cubicles comply with?", answer: "Our compact laminate systems meet BS 476 Part 7 Class 1 fire safety, anti-bacterial hygiene certifications, and high-temperature durability." },
      { question: "How are logistics and delivery handled for UAE orders?", answer: "We coordinate sea freight and air express dispatch with full customs clearance and localized installation guidance." },
    ],
    heroImage: IMAGES.uae.hero,
    galleryImages: IMAGES.uae.gallery,
  },
};
