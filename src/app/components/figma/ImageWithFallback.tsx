import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

/**
 * Appends Supabase image transform parameters to a Supabase storage URL.
 * Falls back to the original URL for non-Supabase URLs.
 */
function optimizeSupabaseUrl(src: string | undefined, width = 800, quality = 80): string | undefined {
  if (!src) return src;
  try {
    // Only transform Supabase Storage URLs
    if (!src.includes('/storage/v1/object/public/')) return src;
    const url = new URL(src);
    url.searchParams.set('width', String(width));
    url.searchParams.set('quality', String(quality));
    url.searchParams.set('format', 'webp');
    return url.toString();
  } catch {
    return src;
  }
}

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Target render width in pixels — used to request a correctly-sized image from Supabase */
  renderWidth?: number;
  /** 1-100 quality for the transformed image (default 80) */
  quality?: number;
  /** Set to true for above-the-fold / hero images to skip lazy loading */
  priority?: boolean;
}

export function ImageWithFallback({
  src,
  alt,
  style,
  className,
  renderWidth = 800,
  quality = 80,
  priority = false,
  ...rest
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const optimizedSrc = optimizeSupabaseUrl(src, renderWidth, quality)

  const handleError = () => setDidError(true)
  const handleLoad  = () => setIsLoaded(true)

  if (didError) {
    return (
      <div
        className={`inline-block bg-gray-100 dark:bg-gray-800 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Error loading image" data-original-url={src} />
        </div>
      </div>
    )
  }

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className ?? ''}`}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      // @ts-ignore - fetchpriority is valid HTML but missing from React types
      fetchpriority={priority ? 'high' : 'low'}
      onError={handleError}
      onLoad={handleLoad}
      {...rest}
    />
  )
}
