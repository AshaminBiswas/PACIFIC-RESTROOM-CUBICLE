// Reusable skeleton primitives
export function SkeletonBox({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      style={style}
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 bg-[length:200%_100%] animate-shimmer rounded-lg ${className}`}
    />
  );
}

export function SkeletonText({ className = "" }: { className?: string }) {
  return <SkeletonBox className={`h-4 rounded-md ${className}`} />;
}

// ── Full-Page Skeletons ─────────────────────────────────────────────────────

/** Generic fullscreen skeleton – used as global Suspense fallback */
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#030213]">
      {/* Fake Navbar */}
      <div className="h-20 bg-white/80 dark:bg-[#030213]/80 border-b border-gray-100 dark:border-white/10 flex items-center px-8 gap-6">
        <SkeletonBox className="h-12 w-32 rounded-full" />
        <div className="flex-1" />
        <SkeletonBox className="h-8 w-20" />
        <SkeletonBox className="h-8 w-20" />
        <SkeletonBox className="h-8 w-24" />
        <SkeletonBox className="h-10 w-28 rounded-full" />
      </div>

      {/* Fake Hero */}
      <SkeletonBox className="w-full h-[65vh] rounded-none" />

      {/* Fake Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-12">
        <div className="text-center space-y-4">
          <SkeletonBox className="h-8 w-64 mx-auto" />
          <SkeletonText className="w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Card-shaped skeleton block */
export function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm">
      <SkeletonBox className="h-48 rounded-none" />
      <div className="p-6 space-y-3 bg-white dark:bg-[#0a0a1a]">
        <SkeletonBox className="h-6 w-3/4" />
        <SkeletonText className="w-full" />
        <SkeletonText className="w-5/6" />
        <SkeletonText className="w-4/6" />
        <div className="pt-2">
          <SkeletonBox className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

/** Products page skeleton */
export function ProductsSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#030213] pt-20">
      {/* Hero banner */}
      <SkeletonBox className="w-full h-52 rounded-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-14">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {[...Array(6)].map((_, i) => (
            <SkeletonBox key={i} className="h-10 w-28 rounded-full" />
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Product Detail skeleton */
export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#030213] pt-20">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <SkeletonBox className="h-[420px] rounded-2xl" />
        {/* Content */}
        <div className="space-y-5">
          <SkeletonBox className="h-10 w-3/4" />
          <SkeletonBox className="h-6 w-1/2" />
          <div className="space-y-2">
            <SkeletonText className="w-full" />
            <SkeletonText className="w-5/6" />
            <SkeletonText className="w-4/6" />
          </div>
          <div className="pt-4 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonBox className="h-5 w-5 rounded-full" />
                <SkeletonText className="w-40" />
              </div>
            ))}
          </div>
          <div className="flex gap-4 pt-4">
            <SkeletonBox className="h-12 w-36 rounded-xl" />
            <SkeletonBox className="h-12 w-36 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Solutions page skeleton */
export function SolutionsSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#030213] pt-20">
      <SkeletonBox className="w-full h-52 rounded-none" />
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center space-y-3">
          <SkeletonBox className="h-10 w-64 mx-auto" />
          <SkeletonText className="w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5">
              <SkeletonBox className="h-52 rounded-none" />
              <div className="p-5 space-y-2 bg-white dark:bg-[#0a0a1a]">
                <SkeletonBox className="h-5 w-2/3" />
                <SkeletonText className="w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Gallery page skeleton */
export function GallerySkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#030213] pt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-8">
        <div className="text-center space-y-3">
          <SkeletonBox className="h-10 w-48 mx-auto" />
          <SkeletonText className="w-80 mx-auto" />
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {["h-[200px]", "h-[300px]", "h-[180px]", "h-[250px]", "h-[320px]", "h-[210px]", "h-[280px]", "h-[190px]", "h-[240px]", "h-[310px]", "h-[170px]", "h-[290px]"].map((h, i) => (
            <SkeletonBox key={i} className={`w-full ${h} rounded-xl break-inside-avoid`} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** About page skeleton */
export function AboutSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#030213] pt-20">
      <SkeletonBox className="w-full h-72 rounded-none" />
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
        {/* Text block */}
        <div className="space-y-4">
          <SkeletonBox className="h-10 w-64" />
          <SkeletonText className="w-full" />
          <SkeletonText className="w-5/6" />
          <SkeletonText className="w-4/6" />
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <SkeletonBox className="h-12 w-24 mx-auto" />
              <SkeletonText className="w-20 mx-auto" />
            </div>
          ))}
        </div>
        {/* Team grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <SkeletonBox className="h-56 rounded-2xl" />
              <SkeletonBox className="h-5 w-40 mx-auto" />
              <SkeletonText className="w-24 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Contact page skeleton */
export function ContactSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#030213] pt-20">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div className="space-y-5">
            <SkeletonBox className="h-10 w-48" />
            <SkeletonText className="w-full" />
            {[...Array(5)].map((_, i) => (
              <SkeletonBox key={i} className={`w-full ${i === 4 ? "h-36" : "h-12"} rounded-xl`} />
            ))}
            <SkeletonBox className="h-12 w-full rounded-xl" />
          </div>
          {/* Info */}
          <div className="space-y-8">
            <SkeletonBox className="h-52 rounded-2xl" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <SkeletonBox className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <SkeletonBox className="h-5 w-32" />
                  <SkeletonText className="w-48" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Blog page skeleton */
export function BlogSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#030213] pt-20">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center space-y-3">
          <SkeletonBox className="h-10 w-40 mx-auto" />
          <SkeletonText className="w-72 mx-auto" />
        </div>
        {/* Featured */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SkeletonBox className="h-72 rounded-2xl" />
          <div className="space-y-4 flex flex-col justify-center">
            <SkeletonBox className="h-8 w-3/4" />
            <SkeletonText className="w-full" />
            <SkeletonText className="w-5/6" />
            <SkeletonBox className="h-5 w-24 mt-4" />
          </div>
        </div>
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
