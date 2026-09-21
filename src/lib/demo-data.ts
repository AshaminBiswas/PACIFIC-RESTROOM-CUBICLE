/**
 * Hardcoded demo data — used when Supabase isn't configured yet.
 * Once the DB is seeded, the frontend will read from Supabase instead.
 */
import type { Product, Blog, Solution, GalleryImage } from "./database.types";

// ── Products ─────────────────────────────────────────────────
export const demoProducts: Product[] = [];

// ── Solutions ────────────────────────────────────────────────
export const demoSolutions: Solution[] = [];

// ── Blogs ────────────────────────────────────────────────────
export const demoBlogs: Blog[] = [];

// ── Gallery ──────────────────────────────────────────────────
export const demoGalleryImages: GalleryImage[] = [];
