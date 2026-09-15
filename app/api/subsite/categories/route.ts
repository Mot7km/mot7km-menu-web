// app/api/subsite/categories/route.ts
import { proxyToBackend } from '../../_proxy';

export async function GET(request: Request): Promise<Response> {
  return proxyToBackend('/api/subsite/categories', request);
}
