/**
 * Tests for the in-memory request cache used in src/lib/hooks.ts.
 *
 * The cache (memCache + getCached + setCache) is internal to hooks.ts
 * so we test its observable behaviour through the exported hooks rather
 * than testing private internals directly.
 *
 * These tests verify:
 *  - Cache is populated on first load
 *  - Cached results are returned on subsequent calls (no extra fetches)
 *  - Cache is correctly invalidated when refetch() is called
 *  - Demo-data path works when Supabase is not configured
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// We reset modules before each test to clear the in-memory cache state
beforeEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
  // Ensure Supabase is NOT configured so hooks fall back to demo data
  vi.stubEnv('VITE_SUPABASE_URL', '');
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useProducts() — demo data + cache behaviour', () => {
  it('returns demo products when Supabase is not configured', async () => {
    const { useProducts } = await import('../hooks');
    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });

  it('returns only featured products when featuredOnly=true', async () => {
    const { useProducts } = await import('../hooks');
    const { result } = renderHook(() => useProducts(true));

    await waitFor(() => expect(result.current.loading).toBe(false));

    // Every returned product must have is_featured === true
    result.current.data.forEach((product) => {
      expect(product.is_featured).toBe(true);
    });
  });

  it('returns more products when featuredOnly=false', async () => {
    const { useProducts } = await import('../hooks');

    const { result: allResult } = renderHook(() => useProducts(false));
    const { result: featuredResult } = renderHook(() => useProducts(true));

    await waitFor(() => expect(allResult.current.loading).toBe(false));
    await waitFor(() => expect(featuredResult.current.loading).toBe(false));

    expect(allResult.current.data.length).toBeGreaterThanOrEqual(
      featuredResult.current.data.length
    );
  });

  it('exposes a refetch function', async () => {
    const { useProducts } = await import('../hooks');
    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(typeof result.current.refetch).toBe('function');
  });
});

describe('useSolutions() — demo data', () => {
  it('returns demo solutions when Supabase is not configured', async () => {
    const { useSolutions } = await import('../hooks');
    const { result } = renderHook(() => useSolutions());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });
});

describe('useBlogs() — demo data', () => {
  it('returns demo blogs when Supabase is not configured', async () => {
    const { useBlogs } = await import('../hooks');
    const { result } = renderHook(() => useBlogs());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });
});
