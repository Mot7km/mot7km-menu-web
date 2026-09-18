import { proxyToBackend } from '../../../_proxy';

export async function GET(
  request: Request,
  context: { params: Promise<{ businessName: string }> }
): Promise<Response> {
  const { businessName } = await context.params;
  return proxyToBackend(`/api/menu/${encodeURIComponent(businessName)}/categories`, request);
}
