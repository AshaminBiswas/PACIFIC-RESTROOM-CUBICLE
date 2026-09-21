# Pacific Products & Solutions — Comprehensive Architecture & Project Context

> **CRITICAL PROTOCOL FOR ALL AI AGENTS & DEVELOPERS**:
> 1. **Read this file FIRST** before planning or executing any tasks in `D:\PACIFIC RESTROOM CUBICLE`.
> 2. **Update this file** whenever you add, modify, or delete any components, routes, stores, database tables, or system workflows.
> 3. **Zero-Error Validation**: Always execute `npx tsc --noEmit` and `npm run build` before finishing any task to guarantee 0 TypeScript and build errors.
> 4. **Test Suite Integrity**: Execute `npm test` to guarantee 100% test pass rate across all unit and data contract tests.

---

## 1. System Ecosystem & Business Identity

**Pacific Products & Solutions** is India's leading B2B manufacturer and contractor for premium commercial restroom cubicles, toilet partitions, exterior cladding, locker systems, interior wall paneling, and custom architectural hardware.

### Corporate Profile
- **Company**: Pacific Products & Solutions
- **Established**: 2012 (12+ years of manufacturing excellence)
- **Certification**: ISO 9001:2015 certified
- **Corporate Headquarters**: Okhla Industrial Estate, New Delhi – 110020, India
- **Regional & International Hubs**: Delhi NCR, Mumbai, Bangalore, Ahmedabad, Kolkata, and Dubai (UAE / GCC)
- **Target Audience**: B2B enterprise clients — architects, general contractors, commercial builders, interior designers, facility managers, and institutional developers.
- **Production Capabilities**: In-house CNC routing, edge chamfering, compact laminate fabrication, and hardware casting.

### Role in the PRC Workspace
In the broader Pacific Restroom Cubicle ecosystem under `D:\`:
```
D:\
├── PACIFIC RESTROOM CUBICLE/ # Corporate Website, 3D Configurator, CAD Studio & CMS (Port 5173)
├── PRC-Backend/              # Node.js + Express + Prisma REST API (Port 5000)
├── admin/                    # Enterprise ERP & Operational Console Dashboard (Port 5174)
└── frontend/                 # B2C & B2B E-Commerce Customer Storefront (Port 5175/3000)
```

---

## 2. Technology Stack & Architecture

### 2.1 Core Frameworks & Runtime
- **Runtime**: Node.js (>= 18), npm (>= 10).
- **Framework**: React 18 (`18.3.1`), Vite 6 (`6.4.2`).
- **Language**: TypeScript (Strict Mode, ES2020 target, bundler module resolution).
- **Routing**: React Router v7 (`7.13.0`) with lazy-loaded view chunks and Suspense skeleton boundaries.
- **CSS & UI Framework**: Tailwind CSS v4 (`@tailwindcss/vite` 4.1.12), Radix UI primitives, Lucide React icons (`0.487.0`).
- **Animations & Micro-interactions**: Framer Motion (`12.38.0` / `motion` 12.23.24) for smooth scroll-driven reveals, modal drawers, and responsive transitions.
- **Unit Testing**: Vitest (`4.1.5`), jsdom (`29.0.2`), `@testing-library/react` (`16.3.2`), `@testing-library/jest-dom`, `@testing-library/dom`.

### 2.2 3D Graphics & CAD Engines
- **Three.js** (`0.184.0`)
- **React Three Fiber (R3F)** (`@react-three/fiber` 8.17.10)
- **Drei** (`@react-three/drei` 9.121.4)
- **State Engines**: Zustand (`5.0.14`) for parametric cubicle configuration and multi-layer CAD design trees.
- **Client-Side PDF Generator**: jsPDF (`4.2.1`) for generating real-time quotation specs with dimension tables and bill of materials.

### 2.3 Backend-as-a-Service & Cloud Infrastructure
- **Supabase**: PostgreSQL database, Supabase Auth (JWT email/password for `/admin`), and Supabase Storage (`uploads` bucket with WebP image compression).
- **Graceful Offline Fallback**: When Supabase environment variables are missing, `isSupabaseConfigured()` automatically routes to typed mock datasets (`demo-data.ts`), allowing development and testing without network dependencies.
- **AI Infrastructure**:
  - Edge Function (`api/nvidia.ts`): Vercel Edge Runtime proxy that securely wraps upstream NVIDIA NIM API (`https://integrate.api.nvidia.com/v1/chat/completions`) keeping API keys strictly server-side.
  - Development Proxy (`vite.config.ts`): Local reverse proxy for `/api/nvidia` injecting `NVIDIA_API_KEY`.
- **Form Forwarding**: Web3Forms integration for instant lead notification dispatch.

---

## 3. Directory Structure & Key Components

```text
D:\PACIFIC RESTROOM CUBICLE\
├── api/
│   └── nvidia.ts                    # Vercel Edge Function proxy for NVIDIA NIM AI
├── public/
│   ├── llms.txt                     # Public LLM context file for search engines & AI agents
│   ├── robots.txt                   # Search crawler directives
│   ├── sitemap.xml                  # Dynamic XML sitemap
│   └── logo.webp                    # Corporate brand assets
├── src/
│   ├── app/
│   │   ├── components/              # Shared presentation and layout components
│   │   │   ├── cubicle/             # 3D Configurator Scene & Models
│   │   │   │   ├── CubicleModel.tsx # Parametric 3D Three.js mesh generator (HPL, divider, hardware)
│   │   │   │   └── CubicleViewer.tsx# Canvas viewport, OrbitControls, ambient & directional lighting
│   │   │   ├── designer/            # CAD 3D Design Studio suite
│   │   │   │   ├── AutoCADRibbon.tsx       # AutoCAD-style ribbon toolbar with tool selection
│   │   │   │   ├── AutoCADMenuBar.tsx      # File/Edit/View/Draw menus & export controls
│   │   │   │   ├── AutoCADCommandLine.tsx  # Interactive terminal supporting keyboard CAD commands
│   │   │   │   ├── DesignCanvas3D.tsx      # R3F Canvas for interactive scene drawing & manipulation
│   │   │   │   ├── DesignObject.tsx        # Rendered mesh objects (walls, panels, doors, cylinders)
│   │   │   │   ├── DesignSidebar.tsx       # Object properties, material palette, dimension inputs
│   │   │   │   ├── DesignToolbar.tsx       # Fast-access CAD tool dock
│   │   │   │   ├── DimensionOverlay.tsx    # Live dimension lines and measurement callouts
│   │   │   │   ├── GridFloor.tsx           # Snappable CAD grid with adaptive subdivisions
│   │   │   │   ├── SceneOutliner.tsx       # Tree view of layers and scene objects
│   │   │   │   └── ViewCube.tsx            # Interactive 3D orientation view cube (Top/Front/Side)
│   │   │   ├── ui/                  # Radix UI headless components styled with Tailwind CSS
│   │   │   ├── Chatbot.tsx          # "Aria" AI Chatbot with local intent parser & NVIDIA fallback
│   │   │   ├── Navbar.tsx           # Header navigation with mobile menu and quick quote CTA
│   │   │   ├── Footer.tsx           # Corporate footer with ISO certifications and city links
│   │   │   ├── ProtectedRoute.tsx   # Session guard for /admin routes redirecting to /admin
│   │   │   ├── SEO.tsx              # Helmet wrapper injecting canonicals, OpenGraph, JSON-LD
│   │   │   └── ThemeToggle.tsx      # Dark/Light mode switcher persisting to localStorage
│   │   ├── pages/                   # Application Views
│   │   │   ├── admin/               # Headless CMS Admin Management Hub
│   │   │   │   ├── AdminDashboard.tsx       # Admin layout shell with sidebar navigation
│   │   │   │   ├── AdminOverview.tsx        # KPIs and quick mutation shortcuts
│   │   │   │   ├── AdminProducts.tsx        # CRUD catalog products with specifications and colors
│   │   │   │   ├── AdminBlogs.tsx           # CRUD rich blog articles with tags and cover images
│   │   │   │   ├── AdminSolutions.tsx       # CRUD industry solutions (Corporate, Healthcare, etc.)
│   │   │   │   ├── AdminGallery.tsx         # CRUD masonry portfolio photos and placements
│   │   │   │   ├── AdminHero.tsx            # CRUD hero slider banners
│   │   │   │   ├── AdminCoreServices.tsx    # CRUD core services
│   │   │   │   ├── AdminPageBanners.tsx     # CRUD individual page headers
│   │   │   │   ├── AdminCatalogs.tsx        # CRUD downloadable PDF catalogs and brochures
│   │   │   │   ├── AdminContactQueries.tsx  # Incoming contact queries
│   │   │   │   ├── AdminFeedback.tsx        # Customer testimonials & star reviews
│   │   │   │   ├── AdminFAQ.tsx             # FAQ management
│   │   │   │   ├── AdminLeads.tsx           # 3D Configurator and quotation lead tracker
│   │   │   │   └── AdminLogin.tsx           # Secure Supabase Auth sign-in portal
│   │   │   ├── locations/           # Location-specific programmatic SEO pages
│   │   │   │   └── locationData.ts  # City-specific landing content (Delhi, Mumbai, Bangalore, etc.)
│   │   │   ├── Home.tsx             # Main hero, core services, featured products, testimonials
│   │   │   ├── About.tsx            # Company history, ISO certifications, infrastructure
│   │   │   ├── Products.tsx         # Filterable catalog by category (Cubicles, Partitions, Lockers)
│   │   │   ├── ProductDetail.tsx    # Dynamic product page with specifications, colors, and inquiry
│   │   │   ├── Solutions.tsx        # Industry solutions overview
│   │   │   ├── SolutionDetail.tsx   # Industry-specific solution detail
│   │   │   ├── LocationDetail.tsx   # Regional city landing page with localized contact options
│   │   │   ├── ConfigureCubicle.tsx # Interactive 3D Cubicle Configurator with PDF export
│   │   │   ├── ProductDesigner.tsx  # AutoCAD-style 3D Design Studio (Dev/Studio mode)
│   │   │   ├── Gallery.tsx          # Masonry image portfolio with category filters
│   │   │   ├── Contact.tsx          # Interactive quotation request form & map coordinates
│   │   │   ├── Blog.tsx             # Architectural and specification articles
│   │   │   ├── BlogDetail.tsx       # Full article view with reading time and author metadata
│   │   │   ├── Brochure.tsx         # Technical diagrams, installation schematics, PDF downloads
│   │   │   ├── Downloads.tsx        # Centralized catalog and technical sheet download center
│   │   │   ├── FAQ.tsx              # Comprehensive customer & architect FAQ accordion
│   │   │   ├── PrivacyPolicy.tsx    # Legal privacy policy
│   │   │   └── TermsOfService.tsx   # Legal commercial terms of service
│   │   ├── App.tsx                  # Root component mounting HelmetProvider and RouterProvider
│   │   └── routes.tsx               # Centralized React Router definition with suspense fallbacks
│   ├── lib/
│   │   ├── cubicleStore.ts          # Zustand store for 3D Configurator (models, dimensions, accessories)
│   │   ├── designStore.ts           # Zustand store for AutoCAD 3D Studio (layers, objects, snapping)
│   │   ├── database.types.ts        # TypeScript interface definitions matching Postgres schema
│   │   ├── demo-data.ts             # Fallback dataset for offline development and unit tests
│   │   ├── hooks.ts                 # React query hooks with in-memory memoization (5-min TTL)
│   │   ├── seo-data.ts              # Global SEO constants, default OpenGraph images, and meta keywords
│   │   └── supabase.ts              # Supabase client initialization and browser image compression
│   └── styles/
│       ├── fonts.css                # Typography imports (Inter, Outfit)
│       ├── theme.css                # Color variables, gradients, and custom utility classes
│       └── index.css                # Global styles and Tailwind entry point
├── supabase-schema.sql              # Production SQL schema (tables, triggers, RLS policies, buckets)
├── supabase-catalogs.sql            # Catalogs table migration and storage configuration
└── vercel.json                      # Vercel deployment rewrite rules for SPA routing
```

---

## 4. Interactive 3D Suites

### 4.1 3D Restroom Cubicle Configurator (`/configure-cubicle`)
- **Route**: `/configure-cubicle`
- **Store**: `useCubicleStore` ([`src/lib/cubicleStore.ts`](file:///D:/PACIFIC%20RESTROOM%20CUBICLE/src/lib/cubicleStore.ts))
- **Key Capabilities**:
  1. **Category Selection**:
     - `toilet_cubicle`: Complete commercial restroom cubicle system.
     - `toilet_partition`: Single modesty divider screen or urinal partition.
     - `locker_system`: Grid or tier locker storage compartments.
  2. **Parametric Sizing**: Real-time sliders adjusting Width ($600\text{mm} - 5000\text{mm}$), Depth ($450\text{mm} - 2500\text{mm}$), and Height ($1200\text{mm} - 2400\text{mm}$).
  3. **Material & Surface Customization**:
     - Material: High-Pressure Compact Laminate (HPL) vs. Phenolic Plywood.
     - Finish: Cream, Sage Green, Royal Purple, Natural Oak, Charcoal.
     - Hardware: Grade 304 Stainless Steel (SS), High-Gloss Chrome, Matte Black, Brass.
  4. **Accessory Toggles**: Indicator thumbturn locks, coat hooks, LED border glow, support legs, heavy-duty wall bracket clamps, gold knobs, key locks, digital electronic locks, number plates.
  5. **Dynamic Price Estimation**: `getEstimatedPriceRange()` dynamically computes real-time fabrication and installation price brackets based on cubic surface area, stall divider counts, hardware finish premiums, and active accessories.
  6. **Client-Side PDF Specification Export**: Uses `jspdf` to generate a branded, vector PDF specification sheet complete with dimensions, selected finishes, bill of accessories, and instant lead submission.
  7. **Deep URL Parameter Linking**: Allows sharing configurations via query parameters (`?cat=toilet_cubicle&mod=classic&w=2200&d=1500&h=2000&type=hpl&finish=cream&hw=brass&acc=indicatorLock,coatHook`).

### 4.2 AutoCAD-Style 3D Design Studio (`/design-studio`)
- **Route**: `/design-studio` (Enabled in development mode or via direct route)
- **Store**: `useDesignStore` ([`src/lib/designStore.ts`](file:///D:/PACIFIC%20RESTROOM%20CUBICLE/src/lib/designStore.ts))
- **Key Capabilities**:
  1. **CAD Tool Palette**: Select, Move, Rotate, Scale, Draw Wall, Draw Panel, Draw Box, Draw Cylinder, Draw Door, Draw Shelf, Paint Material, Eraser, Measure Distance, Dimension Annotation, Line tool.
  2. **Keyboard Accelerators**: `V` (Select), `G` (Move), `R` (Rotate), `S` (Scale), `W` (Wall), `P` (Panel), `B` (Box), `C` (Cylinder), `D` (Door), `I` (Paint), `X` (Eraser), `Ctrl+Z` (Undo), `Ctrl+Y` / `Ctrl+Shift+Z` (Redo), `Delete` / `Backspace` (Remove object).
  3. **Interactive Command Line**: AutoCAD-style bottom command console accepting command abbreviations (`wall`, `box`, `move`, `rotate`, `measure`, `clear`, `undo`, `redo`, `grid`).
  4. **Orthographic & Perspective Viewports**: Instant camera perspective presets (`Top`, `Front`, `Side`, `Perspective`) with interactive 3D `ViewCube.tsx`.
  5. **Layer & Scene Outliner**: Visibility toggles, lock/unlock states, color-coding, and hierarchy grouping.
  6. **Configuration Export & Import**: Serializes full CAD design trees into portable base64 / JSON layouts for instant reloading or customer sharing.

---

## 5. AI Chatbot ("Aria") & NVIDIA NIM Architecture

- **Component**: [`src/app/components/Chatbot.tsx`](file:///D:/PACIFIC%20RESTROOM%20CUBICLE/src/app/components/Chatbot.tsx)
- **Dual-Layer Architecture**:
  1. **Instant Client-Side Intent Parser**:
     - Fast keyword & regular expression matcher (`detectCategory`, `detectProductIntent`, `getQuickReplies`).
     - Directly injects product cards, solution links, or category pills into the chat stream with 0ms latency and 0 API cost.
  2. **Upstream LLM Integration (NVIDIA NIM)**:
     - When complex or open-ended inquiries are received, the bot delegates to `/api/nvidia`.
     - In production: Handled by Vercel Edge Function ([`api/nvidia.ts`](file:///D:/PACIFIC%20RESTROOM%20CUBICLE/api/nvidia.ts)), ensuring the `NVIDIA_API_KEY` is never exposed to client browsers.
     - In development: Handled by Vite server proxy ([`vite.config.ts`](file:///D:/PACIFIC%20RESTROOM%20CUBICLE/vite.config.ts)) forwarding requests with server-side authorization.

---

## 6. Database Schema & Supabase Architecture

PostgreSQL tables managed via Supabase (defined in `supabase-schema.sql` and `supabase-catalogs.sql`):

| Table Name | Description | Key Columns |
|------------|-------------|-------------|
| `products` | Master catalog of cubicles, partitions, lockers, hardware | `id`, `slug`, `title`, `category`, `image_url`, `features` (JSONB), `specifications` (JSONB), `colors` (JSONB), `is_featured`, `published`, `sort_order` |
| `solutions` | Industry applications (Corporate, Healthcare, Airports) | `id`, `slug`, `title`, `icon_name`, `features` (JSONB), `clients` (JSONB), `colors` (JSONB), `published`, `sort_order` |
| `blogs` | SEO architectural and specification articles | `id`, `slug`, `title`, `excerpt`, `content`, `author`, `tags` (JSONB), `published`, `published_at` |
| `gallery_images` | High-res project portfolio photos | `id`, `title`, `category`, `location_slug`, `placement` (`general`/`hero`/`gallery`), `image_url`, `published`, `sort_order` |
| `hero_images` | Rotating homepage hero slider images | `id`, `url`, `description`, `sort_order` |
| `core_services` | Highlighted contracting capabilities | `id`, `title`, `description`, `image_url`, `sort_order` |
| `page_banners` | Hero banner image per page route | `id`, `page_slug`, `image_url`, `title`, `subtitle` |
| `catalogs` | Downloadable PDF specification brochures | `id`, `title`, `file_url`, `file_type`, `file_size`, `thumbnail_url`, `document_type`, `category`, `published` |
| `contact_queries` | Customer inquiries from `/contact` form | `id`, `name`, `email`, `phone`, `company`, `requirement`, `message`, `status` |
| `feedback` | Testimonials & reviews from clients | `id`, `name`, `company`, `stars`, `message` |
| `faqs` | Frequently asked questions | `id`, `question`, `answer`, `category`, `sort_order` |
| `leads` | Inquiries captured by 3D Cubicle Configurator | `id`, `name`, `email`, `phone`, `company`, `city`, `requirement`, `configuration` (JSONB), `status` |

### Security & Row Level Security (RLS)
- **Public Users**: Granted `SELECT` permissions on published items (`published = true`).
- **Authenticated Users (Admins)**: Granted `ALL` permissions (`INSERT`, `UPDATE`, `DELETE`) verified via `auth.role() = 'authenticated'`.
- **Storage**: `uploads` bucket configured with public read access and authenticated upload/delete policies. Images are automatically compressed to `.webp` via `browser-image-compression` in [`src/lib/supabase.ts`](file:///D:/PACIFIC%20RESTROOM%20CUBICLE/src/lib/supabase.ts).

---

## 7. Development & Verification Protocol

### 7.1 Setup & Installation
```bash
cd "D:\PACIFIC RESTROOM CUBICLE"
npm install --legacy-peer-deps
```

### 7.2 Running Development Server
```bash
npm run dev
# App launches at http://localhost:5173
```

### 7.3 Zero-Error TypeScript Validation
Always verify before concluding any changes:
```bash
npx tsc --noEmit
# Must exit with code 0 (0 errors)
```

### 7.4 Production Build Verification
```bash
npm run build
# Must compile successfully in dist/ with code 0
```

### 7.5 Unit & Data Contract Tests
```bash
npm test
# Executes Vitest suite in jsdom environment, verifying cache behaviors and data integrity contracts
```
