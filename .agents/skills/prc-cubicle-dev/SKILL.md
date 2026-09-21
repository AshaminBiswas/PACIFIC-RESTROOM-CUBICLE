---
name: prc-cubicle-dev
description: >-
  Use this skill when developing, refactoring, or extending pages, 3D configurators, CAD studio,
  Supabase integrations, or CMS features in the Pacific Products & Solutions platform (D:\PACIFIC RESTROOM CUBICLE).
---

# Pacific Products & Solutions — Development Guide

Use this guide when developing features, fixing bugs, or adding components to the Pacific Products & Solutions web application at `D:\PACIFIC RESTROOM CUBICLE`.

## Architecture Overview (`src/`)

- `app/components/cubicle/`: 3D Restroom Cubicle Configurator engine using Three.js and `@react-three/fiber` (`CubicleModel.tsx`, `CubicleViewer.tsx`).
- `app/components/designer/`: AutoCAD-style 3D CAD Design Studio (`DesignCanvas3D.tsx`, `AutoCADRibbon.tsx`, `AutoCADCommandLine.tsx`, `DimensionOverlay.tsx`).
- `app/pages/`: Main application routes (Home, Products, ProductDetail, Solutions, LocationDetail, ConfigureCubicle, ProductDesigner, Downloads, Brochure, Contact, Blog, FAQ).
- `app/pages/admin/`: Headless CMS for authenticated administrators (`AdminDashboard.tsx`, `AdminProducts.tsx`, `AdminBlogs.tsx`, `AdminSolutions.tsx`, `AdminGallery.tsx`, `AdminLeads.tsx`).
- `lib/`: State management and data services:
  - `cubicleStore.ts`: Zustand store for 3D cubicle sizing, finishes, accessories, and price calculations.
  - `designStore.ts`: Zustand store for AutoCAD CAD objects, layers, tools, snapping, and undo/redo history.
  - `database.types.ts`: TypeScript definitions matching Postgres schema.
  - `demo-data.ts`: Mock offline fallback datasets.
  - `hooks.ts`: SWR-style data fetching hooks with 5-minute in-memory caching.
  - `supabase.ts`: Supabase client and browser WebP image optimizer.

## Key Development Guidelines

1. **3D Scene Rules**:
   - Always place transform props (`position`, `rotation`, `scale`) on parent `<mesh>` or `<group>` elements, NOT on child geometries (`<boxGeometry>`, `<cylinderGeometry>`).
   - Keep 3D unit dimensions standard in millimeters ($mm$) for user input, scaled to meters ($m = mm / 1000$) in Three.js coordinates.

2. **Offline Fallback Resilience**:
   - Every Supabase query hook must gracefully fall back to `demo-data.ts` if `!isSupabaseConfigured()`.
   - Never let an unconfigured Supabase environment crash page rendering.

3. **Validation & Verification Protocol**:
   Before completing any task, execute:
   ```bash
   cd "D:\PACIFIC RESTROOM CUBICLE"
   npx tsc --noEmit
   npm run build
   npm test
   ```
   All commands must exit with code 0 (zero errors).
