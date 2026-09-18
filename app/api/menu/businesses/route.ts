import { proxyToBackend } from '../../_proxy';

export async function GET(request: Request): Promise<Response> {
  return proxyToBackend('/api/menu/businesses', request);
}
