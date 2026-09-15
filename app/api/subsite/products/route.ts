// app/api/subsite/products/route.ts
import { proxyToBackend } from '../../_proxy';

export async function GET(request: Request): Promise<Response> {
  return proxyToBackend('/api/subsite/products', request);
}
