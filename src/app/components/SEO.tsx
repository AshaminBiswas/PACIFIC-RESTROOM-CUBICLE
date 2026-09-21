import { Helmet } from "react-helmet-async";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE, DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS } from "../../lib/seo-data";

interface SEOProps {
  /** Page title — will be appended with " | Pacific Products & Solutions" */
  title: string;
  /** Meta description (recommended max ~155 characters) */
  description?: string;
  /** Meta keywords (comma separated) */
  keywords?: string;
  /** Canonical URL path, e.g. "/products" (will be prefixed with SITE_URL) */
  canonical?: string;
  /** Open Graph image URL (defaults to site OG image) */
  ogImage?: string;
  /** Open Graph image width in px (default: 1200) */
  ogImageWidth?: number;
  /** Open Graph image height in px (default: 630) */
  ogImageHeight?: number;
  /** Open Graph type — "website" | "article" | "product" */
  ogType?: string;
  /** JSON-LD structured data object(s) */
  jsonLd?: object | object[];
  /** Set true for pages that should not be indexed (admin, 404, etc.) */
  noindex?: boolean;
  /** Twitter site handle e.g. "@pacificcubicles" */
  twitterSite?: string;
  /** Geographic region e.g. "IN-DL" */
  geoRegion?: string;
  /** Geographic place name e.g. "New Delhi, India" */
  geoPlacename?: string;
}

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogImageWidth = 1200,
  ogImageHeight = 630,
  ogType = "website",
  jsonLd,
  noindex = false,
  twitterSite = "@pacificcubicles",
  geoRegion = "IN-DL",
  geoPlacename = "New Delhi, India",
}: SEOProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : undefined;

  // Normalize jsonLd to always be an array
  const jsonLdArray = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      {canonical && <link rel="canonical" href={canonicalUrl} />}

      {/* Geographic / Local SEO */}
      <meta name="geo.region" content={geoRegion} />
      <meta name="geo.placename" content={geoPlacename} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content={String(ogImageWidth)} />
      <meta property="og:image:height" content={String(ogImageHeight)} />
      <meta property="og:image:alt" content={`${title} — ${SITE_NAME}`} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${title} — ${SITE_NAME}`} />

      {/* JSON-LD Structured Data */}
      {jsonLdArray.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}
