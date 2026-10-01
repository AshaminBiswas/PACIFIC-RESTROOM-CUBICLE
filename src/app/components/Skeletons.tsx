import React from "react";

/**
 * Clean, lightweight loading fallback — replaces the intrusive skeleton wireframe
 * animation with a smooth, minimal branded spinner that avoids Cumulative Layout Shift (CLS)
 * and eliminates duplicate navbar flashing.
 */
export function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-transparent">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-black/10 dark:border-white/10 border-t-[#7FB706] animate-spin" />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

// ── Aliased exports to maintain 100% compatibility without any skeleton animations ──
export const PageSkeleton = PageLoader;
export const ProductsSkeleton = PageLoader;
export const ProductDetailSkeleton = PageLoader;
export const SolutionsSkeleton = PageLoader;
export const GallerySkeleton = PageLoader;
export const AboutSkeleton = PageLoader;
export const ContactSkeleton = PageLoader;
export const BlogSkeleton = PageLoader;

// Non-rendering primitives so any legacy child references cleanly evaluate without animation
export const SkeletonBox = () => null;
export const SkeletonText = () => null;
export const CardSkeleton = () => null;
