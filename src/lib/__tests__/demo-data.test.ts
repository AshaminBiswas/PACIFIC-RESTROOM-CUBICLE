/**
 * Data integrity tests for src/lib/demo-data.ts
 *
 * These tests act as a "contract" — validating that every demo item
 * has the required fields that the rest of the UI depends on.
 *
 * If a field is renamed or accidentally removed, these tests will catch
 * it before the broken data reaches production.
 */

import { describe, it, expect } from 'vitest';
import {
  demoProducts,
  demoSolutions,
  demoBlogs,
  demoGalleryImages,
} from '../demo-data';

// ── Products ──────────────────────────────────────────────────

describe('demoProducts data integrity', () => {
  it('has at least one product', () => {
    expect(demoProducts.length).toBeGreaterThan(0);
  });

  it('every product has the required fields', () => {
    demoProducts.forEach((product) => {
      expect(product.id, `Product missing id`).toBeTruthy();
      expect(product.slug, `"${product.title}" missing slug`).toBeTruthy();
      expect(product.title, `Product ${product.id} missing title`).toBeTruthy();
      expect(product.category, `"${product.title}" missing category`).toBeTruthy();
      expect(product.image_url, `"${product.title}" missing image_url`).toBeTruthy();
      expect(typeof product.is_featured, `"${product.title}" is_featured must be boolean`).toBe('boolean');
      expect(typeof product.published, `"${product.title}" published must be boolean`).toBe('boolean');
      expect(typeof product.sort_order, `"${product.title}" sort_order must be a number`).toBe('number');
    });
  });

  it('every product slug is unique', () => {
    const slugs = demoProducts.map((p) => p.slug);
    const unique = new Set(slugs);
    expect(unique.size).toBe(slugs.length);
  });

  it('every product ID is unique', () => {
    const ids = demoProducts.map((p) => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('every product has at least one feature listed', () => {
    demoProducts.forEach((product) => {
      expect(
        Array.isArray(product.features) && product.features.length > 0,
        `"${product.title}" should have at least one feature`
      ).toBe(true);
    });
  });

  it('all published products have a valid image_url starting with https', () => {
    demoProducts
      .filter((p) => p.published)
      .forEach((product) => {
        expect(
          product.image_url.startsWith('https://'),
          `"${product.title}" image_url should start with https://`
        ).toBe(true);
      });
  });
});

// ── Solutions ─────────────────────────────────────────────────

describe('demoSolutions data integrity', () => {
  it('has at least one solution', () => {
    expect(demoSolutions.length).toBeGreaterThan(0);
  });

  it('every solution has the required fields', () => {
    demoSolutions.forEach((solution) => {
      expect(solution.id, `Solution missing id`).toBeTruthy();
      expect(solution.slug, `"${solution.title}" missing slug`).toBeTruthy();
      expect(solution.title, `Solution ${solution.id} missing title`).toBeTruthy();
      expect(solution.icon_name, `"${solution.title}" missing icon_name`).toBeTruthy();
      expect(typeof solution.published, `"${solution.title}" published must be boolean`).toBe('boolean');
    });
  });

  it('every solution slug is unique', () => {
    const slugs = demoSolutions.map((s) => s.slug);
    const unique = new Set(slugs);
    expect(unique.size).toBe(slugs.length);
  });
});

// ── Blogs ─────────────────────────────────────────────────────

describe('demoBlogs data integrity', () => {
  it('has at least one blog post', () => {
    expect(demoBlogs.length).toBeGreaterThan(0);
  });

  it('every blog has the required fields', () => {
    demoBlogs.forEach((blog) => {
      expect(blog.id, `Blog missing id`).toBeTruthy();
      expect(blog.slug, `"${blog.title}" missing slug`).toBeTruthy();
      expect(blog.title, `Blog ${blog.id} missing title`).toBeTruthy();
      expect(blog.excerpt, `"${blog.title}" missing excerpt`).toBeTruthy();
      expect(blog.content, `"${blog.title}" missing content`).toBeTruthy();
      expect(blog.author, `"${blog.title}" missing author`).toBeTruthy();
      expect(typeof blog.published, `"${blog.title}" published must be boolean`).toBe('boolean');
    });
  });

  it('every blog slug is unique', () => {
    const slugs = demoBlogs.map((b) => b.slug);
    const unique = new Set(slugs);
    expect(unique.size).toBe(slugs.length);
  });

  it('every blog has a non-empty tags array', () => {
    demoBlogs.forEach((blog) => {
      expect(
        Array.isArray(blog.tags) && blog.tags.length > 0,
        `"${blog.title}" should have at least one tag`
      ).toBe(true);
    });
  });
});

// ── Gallery ───────────────────────────────────────────────────

describe('demoGalleryImages data integrity', () => {
  it('has at least one gallery image', () => {
    expect(demoGalleryImages.length).toBeGreaterThan(0);
  });

  it('every image has the required fields', () => {
    demoGalleryImages.forEach((image) => {
      expect(image.id, `Image missing id`).toBeTruthy();
      expect(image.title, `Image ${image.id} missing title`).toBeTruthy();
      expect(image.category, `"${image.title}" missing category`).toBeTruthy();
      expect(image.image_url, `"${image.title}" missing image_url`).toBeTruthy();
      expect(typeof image.published, `"${image.title}" published must be boolean`).toBe('boolean');
      expect(typeof image.sort_order, `"${image.title}" sort_order must be a number`).toBe('number');
    });
  });

  it('every image has a valid https URL', () => {
    demoGalleryImages.forEach((image) => {
      expect(
        image.image_url.startsWith('https://'),
        `"${image.title}" image_url should start with https://`
      ).toBe(true);
    });
  });
});
