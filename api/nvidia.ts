/**
 * Vercel Edge Function — NVIDIA NIM API proxy.
 *
 * Uses the Edge Runtime (standard Web APIs). `process.env` is available in
 * Vercel's Edge Runtime but TypeScript's DOM lib doesn't declare it.
 * We access it via `globalThis` to avoid requiring @types/node.
 *
 * Why this exists:
 *   Keeps NVIDIA_API_KEY server-side only — never bundled into the client JS.
 *
 * Route: /api/nvidia  (catches all sub-paths via vercel.json rewrite)
 */
export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  // Only POST is needed for NVIDIA chat completions
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // `process.env` exists on Vercel Edge Runtime but is not in TypeScript's
  // DOM lib — access via globalThis to avoid requiring @types/node.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiKey = (globalThis as any).process?.env?.NVIDIA_API_KEY as string | undefined;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "NVIDIA_API_KEY is not configured on the server." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Forward the request body as-is to NVIDIA's API, injecting the key
  const body = await req.text();

  try {
    const upstream = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body,
      }
    );

    const data = await upstream.text();
    return new Response(data, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Upstream request failed", detail: err?.message }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
