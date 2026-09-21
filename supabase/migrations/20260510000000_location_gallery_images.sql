ALTER TABLE public.gallery_images
  ADD COLUMN IF NOT EXISTS location_slug TEXT;

ALTER TABLE public.gallery_images
  ADD COLUMN IF NOT EXISTS placement TEXT NOT NULL DEFAULT 'general';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'gallery_images_placement_check'
  ) THEN
    ALTER TABLE public.gallery_images
      ADD CONSTRAINT gallery_images_placement_check
      CHECK (placement IN ('general', 'hero', 'gallery'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_gallery_location_slug
  ON public.gallery_images (location_slug);

CREATE INDEX IF NOT EXISTS idx_gallery_location_placement
  ON public.gallery_images (location_slug, placement, published, sort_order);

NOTIFY pgrst, 'reload schema';
