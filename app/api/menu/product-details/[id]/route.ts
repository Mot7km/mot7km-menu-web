// app/api/menu/product-details/[id]/route.ts
import { proxyToBackend } from '../../../_proxy';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await context.params;
  return proxyToBackend(`/api/menu/product-details/${id}`, request);
}
