import { API_BASE_URL } from '../../src/lib/constants';

export async function proxyToBackend(
  path: string,
  request: Request
): Promise<Response> {
  const backendUrl = new URL(path, API_BASE_URL);
  backendUrl.search = new URL(request.url).search;

  const isGetOrHead = request.method === 'GET' || request.method === 'HEAD';

  try {
    const response = await fetch(backendUrl, {
      method: request.method,
      headers: request.headers,
      body: isGetOrHead ? undefined : await request.arrayBuffer(),
      cache: isGetOrHead ? undefined : 'no-store',
      next: isGetOrHead ? { revalidate: 60 } : undefined,
    });

    const headers = new Headers(response.headers);
    if (isGetOrHead && response.ok) {
      headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch {
    return Response.json(
      { error: 'Unable to reach the backend service.' },
      { status: 502 }
    );
  }
}