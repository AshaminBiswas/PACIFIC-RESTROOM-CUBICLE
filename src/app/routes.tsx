import { createBrowserRouter } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";
import { Chatbot } from "./components/Chatbot";
import ProtectedRoute from "./components/ProtectedRoute";
import { Outlet } from "react-router";
import { Suspense, lazy } from "react";
import {
  PageSkeleton,
  ProductsSkeleton,
  ProductDetailSkeleton,
  SolutionsSkeleton,
  GallerySkeleton,
  AboutSkeleton,
  ContactSkeleton,
  BlogSkeleton,
} from "./components/Skeletons";

// ── Lazy-loaded Pages ─────────────────────────────────────────────────────
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Solutions = lazy(() => import("./pages/Solutions"));
const SolutionDetail = lazy(() => import("./pages/SolutionDetail"));
const LocationDetail = lazy(() => import("./pages/LocationDetail"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Brochure = lazy(() => import("./pages/Brochure"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FAQ = lazy(() => import("./pages/FAQ"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Downloads = lazy(() => import("./pages/Downloads"));
const ConfigureCubicle = lazy(() => import("./pages/ConfigureCubicle"));
const ProductDesigner = lazy(() => import("./pages/ProductDesigner"));

// ── Lazy-loaded Admin Pages ───────────────────────────────────────────────
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminBlogs = lazy(() => import("./pages/admin/AdminBlogs"));
const AdminSolutions = lazy(() => import("./pages/admin/AdminSolutions"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));
const AdminHero = lazy(() => import("./pages/admin/AdminHero"));
const AdminCoreServices = lazy(() => import("./pages/admin/AdminCoreServices"));
const AdminPageBanners = lazy(() => import("./pages/admin/AdminPageBanners"));
const AdminCatalogs = lazy(() => import("./pages/admin/AdminCatalogs"));
const AdminContactQueries = lazy(() => import("./pages/admin/AdminContactQueries"));
const AdminFeedback = lazy(() => import("./pages/admin/AdminFeedback"));
const AdminFAQ = lazy(() => import("./pages/admin/AdminFAQ"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));

// ── Layout ────────────────────────────────────────────────────────────────
function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <ScrollToTop />
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Cookie Consent Popup */}
      <CookieConsent />

      {/* Custom Chatbot */}
      <Chatbot />
    </div>
  );
}


// ── Router ────────────────────────────────────────────────────────────────
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={<AboutSkeleton />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: "products",
        element: (
          <Suspense fallback={<ProductsSkeleton />}>
            <Products />
          </Suspense>
        ),
      },
      {
        path: "products/:slug",
        element: (
          <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductDetail />
          </Suspense>
        ),
      },
      {
        path: "products/:categorySlug/:productSlug",
        element: (
          <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductDetail />
          </Suspense>
        ),
      },
      {
        path: "solutions",
        element: (
          <Suspense fallback={<SolutionsSkeleton />}>
            <Solutions />
          </Suspense>
        ),
      },
      {
        path: "solutions/:industry",
        element: (
          <Suspense fallback={<SolutionsSkeleton />}>
            <SolutionDetail />
          </Suspense>
        ),
      },
      {
        path: "locations/:location",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <LocationDetail />
          </Suspense>
        ),
      },
      {
        path: "gallery",
        element: (
          <Suspense fallback={<GallerySkeleton />}>
            <Gallery />
          </Suspense>
        ),
      },
      {
        path: "contact",
        element: (
          <Suspense fallback={<ContactSkeleton />}>
            <Contact />
          </Suspense>
        ),
      },
      {
        path: "blog",
        element: (
          <Suspense fallback={<BlogSkeleton />}>
            <Blog />
          </Suspense>
        ),
      },
      {
        path: "blog/:slug",
        element: (
          <Suspense fallback={<BlogSkeleton />}>
            <BlogDetail />
          </Suspense>
        ),
      },
      {
        path: "brochure",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Brochure />
          </Suspense>
        ),
      },
      {
        path: "download",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Downloads />
          </Suspense>
        ),
      },
      {
        path: "faq",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <FAQ />
          </Suspense>
        ),
      },

      // Additional aliased paths
      {
        path: "process",
        element: (
          <Suspense fallback={<AboutSkeleton />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: "testimonials",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "clients",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "careers",
        element: (
          <Suspense fallback={<ContactSkeleton />}>
            <Contact />
          </Suspense>
        ),
      },
      { path: "privacy", element: (<Suspense fallback={<PageSkeleton />}><PrivacyPolicy /></Suspense>) },
      { path: "terms", element: (<Suspense fallback={<PageSkeleton />}><TermsOfService /></Suspense>) },
      {
        path: "*",
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/configure-cubicle",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <ConfigureCubicle />
      </Suspense>
    ),
  },
  ...(import.meta.env.DEV ? [{
    path: "/design-studio",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <ProductDesigner />
      </Suspense>
    ),
  }] : []),
  {
    path: "/admin",
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <AdminLogin />
      </Suspense>
    ),
  },
  {
    path: "/admin/dashboard",
    // ProtectedRoute checks the Supabase session before rendering any child.
    // Unauthenticated users are immediately redirected to /admin (login page)
    // without any admin UI flashing on screen.
    element: <ProtectedRoute />,
    children: [
      {
        // AdminDashboard is the sidebar/header layout shell; its <Outlet />
        // renders the active sub-page.  All paths below are relative to
        // /admin/dashboard (they must NOT start with a slash).
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <AdminDashboard />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <AdminOverview />
              </Suspense>
            ),
          },
          {
            path: "products",
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <AdminProducts />
              </Suspense>
            ),
          },
          {
            path: "blogs",
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <AdminBlogs />
              </Suspense>
            ),
          },
          {
            path: "solutions",
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <AdminSolutions />
              </Suspense>
            ),
          },
          {
            path: "gallery",
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <AdminGallery />
              </Suspense>
            ),
          },
          {
            path: "hero",
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <AdminHero />
              </Suspense>
            ),
          },
          {
            path: "core-services",
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <AdminCoreServices />
              </Suspense>
            ),
          },
          {
            path: "page-banners",
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <AdminPageBanners />
              </Suspense>
            ),
          },
          {
            path: "catalogs",
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <AdminCatalogs />
              </Suspense>
            ),
          },
          {
            path: "contact-queries",
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <AdminContactQueries />
              </Suspense>
            ),
          },
          {
            path: "feedback",
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <AdminFeedback />
              </Suspense>
            ),
          },
          {
            path: "faq",
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <AdminFAQ />
              </Suspense>
            ),
          },
          {
            path: "leads",
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <AdminLeads />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);
