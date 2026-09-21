// ── SEO Constants & Structured Data Factories ─────────────────────────────

export const SITE_NAME = "Pacific Products & Solutions";
export const SITE_URL = "https://pacificproduct.in";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const DEFAULT_DESCRIPTION =
  "Pacific Products & Solutions — India's #1 manufacturer of premium restroom cubicles, toilet partitions, exterior cladding, wall paneling, locker systems, and custom hardware. ISO 9001:2015 certified. 12+ years. 600+ projects. Serving Delhi, Mumbai, Bangalore, Dubai & across India.";

export const DEFAULT_KEYWORDS =
  "restroom cubicles manufacturer India, toilet partitions Delhi NCR, exterior cladding contractors India, HPL cubicle hardware, commercial washroom panels, locker system suppliers, Pacific Products and Solutions, toilet cubicles, shower cubicles, compact laminate partitions, phenolic toilet cubicles, HPL partitions, cubicle hardware manufacturer, restroom partition system, washroom cubicle supplier, interior contracting company India, B2B interior solutions";


// ── Organization Schema ───────────────────────────────────────────────────

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: "Pacific Products & Solutions",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.webp`,
      width: 200,
      height: 60,
    },
    description: DEFAULT_DESCRIPTION,
    foundingDate: "2012",
    numberOfEmployees: { "@type": "QuantitativeValue", value: 50 },
    email: "info@pacificproduct.in",
    telephone: "+919818592113",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Okhla Industrial Estate",
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      postalCode: "110020",
      addressCountry: "IN",
    },
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "AdministrativeArea", name: "Delhi NCR" },
      { "@type": "AdministrativeArea", name: "Mumbai" },
      { "@type": "AdministrativeArea", name: "Bangalore" },
      { "@type": "AdministrativeArea", name: "Ahmedabad" },
      { "@type": "AdministrativeArea", name: "Kolkata" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Commercial Interior Products & Solutions",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Restroom Cubicles" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Toilet Partitions" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Shower Cubicles" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Exterior Cladding" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Locker Systems" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Interior Wall Paneling" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Cubicle Hardware" } },
      ],
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=100063648025932",
      "https://youtube.com/@pacificcubicles",
      "https://www.linkedin.com/company/pacific-products-and-solutions",
      "https://www.instagram.com/pacificcubicles",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+919818592113",
        contactType: "sales",
        areaServed: ["IN", "AE"],
        availableLanguage: ["English", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+919818592113",
        contactType: "customer support",
        areaServed: ["IN", "AE"],
        availableLanguage: ["English", "Hindi"],
      },
    ],
  };
}

// ── LocalBusiness Schema ──────────────────────────────────────────────────

export function localBusinessSchema(location?: {
  city: string;
  address: string;
  phone: string;
  email: string;
  region: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    image: `${SITE_URL}/logo.webp`,
    url: SITE_URL,
    telephone: location?.phone || "+919818592113",
    email: location?.email || "info@pacificproduct.in",
    address: {
      "@type": "PostalAddress",
      streetAddress: location?.address || "Okhla Industrial Estate",
      addressLocality: location?.city || "New Delhi",
      addressRegion: location?.region || "Delhi",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.5488,
      longitude: 77.2694,
    },
    priceRange: "$$",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "100",
    },
  };
}

// ── Product Schema ────────────────────────────────────────────────────────

export function productSchema(product: {
  title: string;
  description?: string;
  image_url?: string;
  slug: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || `Premium ${product.title} by ${SITE_NAME}`,
    image: product.image_url,
    url: `${SITE_URL}/products/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    category: product.category,
    manufacturer: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "INR",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      ratingCount: "85",
    },
  };
}

// ── FAQPage Schema ────────────────────────────────────────────────────────

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ── BlogPosting Schema ────────────────────────────────────────────────────

export function blogPostSchema(post: {
  title: string;
  content?: string;
  cover_image?: string;
  created_at?: string;
  slug: string;
  excerpt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.cover_image,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.created_at,
    dateModified: post.created_at,
    inLanguage: "en-IN",
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.webp`,
      },
    },
  };
}

// ── BreadcrumbList Schema ─────────────────────────────────────────────────

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

// ── WebSite Schema (for sitelinks search) ─────────────────────────────────

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

// ── Service Schema ────────────────────────────────────────────────────────

export function serviceSchema(service: {
  name: string;
  description: string;
  slug: string;
  areaServed?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: `${SITE_URL}/solutions/${service.slug}`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: service.areaServed || "India",
    serviceType: "Commercial Interior Installation",
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "INR",
    },
  };
}

// ── ItemList Schema (product/solution listing pages) ─────────────────────

export function itemListSchema(items: { name: string; url: string; image?: string; description?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} Products & Services`,
    url: SITE_URL,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
      image: item.image,
      description: item.description,
    })),
  };
}

// ── HowTo Schema (process/installation steps) ─────────────────────────────

export function howToSchema(data: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: data.name,
    description: data.description,
    step: data.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
    tool: [
      { "@type": "HowToTool", name: "Site Measurement Kit" },
      { "@type": "HowToTool", name: "Installation Hardware" },
    ],
    supply: [
      { "@type": "HowToSupply", name: "HPL Cubicle Panels" },
      { "@type": "HowToSupply", name: "Stainless Steel Hardware" },
    ],
  };
}

// ── AggregateRating Schema ────────────────────────────────────────────────

export function aggregateRatingSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    ratingValue: "4.8",
    bestRating: "5",
    worstRating: "1",
    ratingCount: "100",
    reviewCount: "100",
    itemReviewed: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

// ── Speakable Schema (for voice/AI read-aloud) ────────────────────────────

export function speakableSchema(cssSelectors: string[] = ["h1", "h2", ".speakable"]) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors,
    },
    url: SITE_URL,
  };
}
