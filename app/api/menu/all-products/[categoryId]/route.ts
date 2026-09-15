// app/api/menu/all-products/[categoryId]/route.ts
import { proxyToBackend } from '../../../_proxy';

export async function GET(
  request: Request,
  context: { params: Promise<{ categoryId: string }> }
): Promise<Response> {
  const { categoryId } = await context.params;
  return proxyToBackend(`/api/menu/all-products/${categoryId}`, request);
}
