import { proxyToBackend } from '../../../../_proxy';

export async function GET(
  request: Request,
  context: { params: Promise<{ businessName: string; productId: string }> }
): Promise<Response> {
  const { businessName, productId } = await context.params;
  return proxyToBackend(
    `/api/menu/${encodeURIComponent(businessName)}/products/${encodeURIComponent(productId)}`,
    request
  );
}
