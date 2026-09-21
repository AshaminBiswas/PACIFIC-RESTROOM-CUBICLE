# Pacific Products & Solutions 🏢
**Comprehensive Technical Documentation**

A premium, full-stack corporate web application and custom content management system built for Pacific Products & Solutions. This platform drives the company's digital presence by showcasing their interior contracting solutions while providing internal stakeholders with a powerful, secure backend to manage catalogs and marketing content.

---

## 🏗️ 1. Architecture & Overview

This project follows a monolithic **Single Page Application (SPA)** architecture, separated into two distinct domains running from the same codebase:

1. **Public Marketing Portal**: A dynamic, SEO-friendly (via dynamic routing) frontend featuring product catalogs, galleries, blogs, and interactive UI components.
2. **Admin Dashboard (Headless CMS)**: An authenticated, protected section of the app (`/admin`) that bypasses the need for third-party CMS platforms (like WordPress or Contentful) by giving authorized users direct GUI access to mutate the underlying Postgres database.

---

## 💻 2. Detailed Tech Stack

### Frontend Ecosystem
- **Framework**: **React 18** built on **Vite**. Vite was chosen over Create React App (CRA) or Webpack for its near-instant Hot Module Replacement (HMR) and optimized Rollup-based production builds.
- **Language**: **TypeScript**. Enforces strict typing for API responses (via Supabase generated types), drastically reducing runtime errors when mapping complex product data.
- **Routing**: **React Router v7**. Handles client-side URL management, dynamically loading components for routes like `/products/:slug` and securing the `/admin/*` namespace via wrapper components.

### Styling & Animation
- **Tailwind CSS v4**: Utilized extensively for layout, typography, and responsive design. The utility-first approach eliminates traditional CSS bloat and ensures consistent design tokens.
- **Framer Motion (`motion/react`)**: The backbone of the application's UX. Drives scroll-triggered reveals (`whileInView`), complex page transitions, and subtle hover micro-interactions to create a "premium" feel.
- **Lucide React**: Supplies lightweight, highly customizable SVG icons used in navigation, feature lists, and the admin sidebar.

### Backend Infrastructure (Backend-as-a-Service)
- **Supabase**: An open-source Firebase alternative that provides the entire backend infrastructure without writing a dedicated Node.js/Express server.
  - **PostgreSQL**: The core relational database engine.
  - **Supabase Auth**: JWT-based authentication specifically used to gate the `/admin` routes.
  - **Supabase Storage**: AWS S3-compatible object storage used to host all product images, gallery photos, and blog thumbnails via a global CDN.

---

## 📁 3. Application Structure

The codebase is organized by feature and technical concern to maintain scalability:

```text
d:\PACIFIC PRODUCT AND SOLUTIONS\
├── src/
│   ├── app/
│   │   ├── components/       # Reusable, stateless UI blocks
│   │   │   ├── figma/        # Specialized fallback & image wrapper components
│   │   │   ├── Navbar.tsx, Footer.tsx, ThemeToggle.tsx
│   │   │   └── ProductCard.tsx, AnimatedCounter.tsx
│   │   ├── pages/            # View-level components mapped to Router paths
│   │   │   ├── admin/        # Protected CRUD dashboards (AdminLogin, AdminDashboard)
│   │   │   └── Home.tsx, Products.tsx, Brochure.tsx, Gallery.tsx, etc.
│   │   ├── App.tsx           # React root provider shell
│   │   └── routes.tsx        # Centralized routing map
│   ├── lib/                  
│   │   ├── database.types.ts # TS definitions mirroring Postgres schema
│   │   ├── hooks.ts          # Encapsulated data layer (useProducts, useGallery, etc.)
│   │   └── supabase.ts       # Supabase client initialization & upload utilities
│   ├── image/                # Static local assets (e.g., fallback logos)
│   ├── styles/               # Global CSS, Font imports, Tailwind config
│   └── main.tsx              # DOM mount point
├── supabase/                 # Supabase configuration & local dev env
├── supabase-schema.sql       # Raw SQL defining the initial DB state and RLS policies
└── vercel.json               # SPA routing configuration for deployment
```

---

## 🔄 4. State Management & Data Flow

To avoid the boilerplate of Redux, the application uses **custom React hooks** to manage the data layer. 

1. **The Hook Layer (`src/lib/hooks.ts`)**: Components do not communicate directly with Supabase. Instead, they call hooks like `const { data: products, loading } = useProducts();`. 
2. **Fetching Strategy**: Hooks utilize `useEffect` to trigger async Supabase queries on component mount. State is held in standard `useState` hooks, managing the `data`, `loading`, and `error` lifecycles.
3. **Data Hydration**: The UI renders a loading skeleton or spinner while `loading` is true, and populates the DOM via `.map()` once the array of data resolves.

---

## 🗄️ 5. Database Architecture

The Postgres database (defined in `supabase-schema.sql`) is designed with high normalization:

- **`products`**: Primary inventory table. Contains JSONB arrays for `features`, `specifications`, and `applications`, allowing flexible, schema-less data structures for complex product details.
- **`solutions`**: Industry-specific service offerings (e.g., Corporate Offices, Airports).
- **`blogs`**: Content management for SEO articles.
- **`gallery_images`**: A dedicated global table for portfolio masonry grids.

**Security**: 
Supabase **Row Level Security (RLS)** is strictly enforced.
- *Public Users*: Granted `SELECT` (read) permissions on all tables.
- *Authenticated Users (Admins)*: Granted `INSERT`, `UPDATE`, and `DELETE` permissions.

---

## 🎨 6. UI/UX & Theming System

- **Dark Mode Architecture**: The app features a robust, user-toggled Dark Mode. The `ThemeToggle.tsx` component adds or removes the `.dark` class to the HTML root element and persists the user's choice in `localStorage`. 
- **Tailwind Variants**: UI components utilize the `dark:` prefix (e.g., `bg-white dark:bg-[#030213]`) to seamlessly invert color palettes.
- **Reactive SVGs**: Complex technical diagrams (like those on the `Brochure.tsx` page) dynamically shift stroke and fill colors based on the active theme, maintaining legibility and visual hierarchy regardless of the user's preference.

---

## 🚀 7. Deployment & Infrastructure

The application is optimized for deployment on Vercel or similar static hosting providers.

**The Routing Caveat (`vercel.json`)**:
Because Vite outputs a Single Page Application, navigating to `/products` directly via the URL bar on a production server would normally result in a **404 Not Found**. 
We resolve this via `vercel.json` rewrite rules:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
This intercepts all server requests and serves `index.html`, allowing React Router to successfully parse the URL and mount the correct component.

---

## 🚏 8. Endpoints & Route Functionality

Because this application relies on a **Backend-as-a-Service (Supabase)**, there are no traditional REST API endpoints (e.g., Node.js/Express routes). Instead, the "endpoints" are handled directly via the Supabase Client interacting with PostgreSQL via PostgREST.

### Data Access Layer (API Equivalents)
All database interactions are encapsulated in `src/lib/hooks.ts`, functioning as the API layer for the frontend:

- **`useProducts()` / `useProduct(slug)`**: Queries the `products` table. Used to populate the global product catalog and individual detail pages.
- **`useSolutions()` / `useSolution(slug)`**: Queries the `solutions` table for industry-specific service pages.
- **`useBlogs()`**: Fetches published articles from the `blogs` table.
- **`useGallery()`**: Retrieves the image URLs and metadata from the `gallery_images` table for the masonry portfolio.
- **`uploadImage(file, bucket)`**: A utility function in `supabase.ts` that handles POSTing binary image files directly to Supabase Storage and returns the public CDN URL.

### Frontend Application Routes
The application uses React Router to map URLs to specific View components:

**Public Routes:**
- `/` - **Home**: Aggregates top products, testimonials, and company overview.
- `/about` - **About Us**: Company history, mission, and team.
- `/products` & `/products/:slug` - **Products**: Dynamic catalog and detailed specification pages.
- `/solutions` & `/solutions/:slug` - **Solutions**: Industry-specific offerings.
- `/brochure` - **Brochure**: Technical diagrams and PDF downloads.
- `/gallery` - **Gallery**: Filterable image portfolio.
- `/contact` - **Contact**: Form and location information.

**Protected Admin Routes (requires Auth):**
- `/admin` - **Admin Login Gate**: Validates JWT session.
- `/admin/dashboard` - **CMS Dashboard**: Aggregated statistics.
- `/admin/dashboard/products` - **Products CRUD**: Interface to create, update, and delete catalog items.
- `/admin/dashboard/solutions` - **Solutions CRUD**: Interface to manage industry services.
- `/admin/dashboard/gallery` - **Gallery Management**: Interface to upload and delete portfolio images.

---

## 🛠️ 9. Setup & Local Development

### Prerequisites
1. Node.js (v18 or higher)
2. A Supabase account and project.

### Initial Setup

1. **Clone & Install Dependencies**
   ```bash
   git clone <repo-url>
   cd pacific-product-and-solutions
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_public_key
   VITE_SUPABASE_ANON_KEY=your_anon_public_key
   ```

3. **Initialize the Database**
   Copy the contents of `supabase-schema.sql` and execute it in your Supabase project's SQL Editor. This will create all necessary tables, configure RLS policies, and set up the storage buckets.

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

### Admin Access
To access the admin panel at `/admin`, you must create a user in your Supabase Auth dashboard (Email/Password) and log in using those credentials on the frontend.
