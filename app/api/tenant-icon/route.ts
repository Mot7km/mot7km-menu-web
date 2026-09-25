import { proxyToBackend } from '../_proxy';

export const dynamic = 'force-dynamic';

const DEFAULT_ICON_PATH = '/default-icon.png';

function redirectToDefault(request: Request): Response {
  // NOTE: Response.redirect() produces immutable Headers in Next's edge
  // sandbox, which crashes the dev server handler. Build the redirect
  // manually with a fresh mutable Headers instance instead.
  return new Response(null, {
    status: 307,
    headers: { Location: new URL(DEFAULT_ICON_PATH, request.url).href },
  });
}

/**
 * GET /api/tenant-icon?businessName=X
 *
 * Resolves the business logo from the info endpoint (GET /api/menu/{businessName}/info,
 * field header.logo) and streams it back as an image, so it can be used as a
 * favicon for that menu and all of its nested pages. Falls back to
 * /default-icon.png whenever the business or its logo is missing/unreachable.
 */
export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const businessName = searchParams.get('businessName');

  if (!businessName) {
    return redirectToDefault(request);
  }

  let logoUrl: string | null = null;
  try {
    const infoResponse = await proxyToBackend(
      `/api/menu/${encodeURIComponent(businessName)}/info`,
      request
    );
    if (infoResponse.ok) {
      const body = await infoResponse.json();
      const data = body?.data ?? body;
      logoUrl = data?.header?.logo ?? null;
    }
  } catch {
    logoUrl = null;
  }

  if (!logoUrl || typeof logoUrl !== 'string') {
    return redirectToDefault(request);
  }

  // Absolute logo URL (Supabase storage etc.) — stream it through so the
  // favicon works without mixed-content or CORS problems.
  try {
    const upstream = await fetch(logoUrl, { cache: 'no-store' });
    if (upstream.ok && (upstream.headers.get('content-type') || '').startsWith('image/')) {
      return new Response(upstream.body, {
        status: 200,
        headers: {
          'Content-Type': upstream.headers.get('content-type') || 'image/png',
          'Cache-Control': 'public, max-age=300',
        },
      });
    }
  } catch {
    // fall through to default icon
  }

  return redirectToDefault(request);
}
