// app/api/menu/business-identity/[tenantId]/route.ts
import { proxyToBackend } from '../../../_proxy';

export async function GET(
  request: Request,
  context: { params: Promise<{ tenantId: string }> }
): Promise<Response> {
  const { tenantId } = await context.params;
  return proxyToBackend(`/api/menu/business-identity/${tenantId}`, request);
}
