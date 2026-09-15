import { API_BASE_URL } from '../../src/lib/constants';

export async function proxyToBackend(
  path: string,
  request: Request
): Promise<Response> {
  const backendUrl = new URL(path, API_BASE_URL);
  backendUrl.search = new URL(request.url).search;

  try {
    const response = await fetch(backendUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method === 'GET' || request.method === 'HEAD'
        ? undefined
        : await request.arrayBuffer(),
      cache: 'no-store',
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch {
    return Response.json(
      { error: 'Unable to reach the backend service.' },
      { status: 502 }
    );
  }
}