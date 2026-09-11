// app/api/menu/header/[tenantId]/route.ts
import { proxyToBackend } from '../../../_proxy';

export async function GET(
  request: Request,
  context: { params: Promise<{ tenantId: string }> }
): Promise<Response> {
  const { tenantId } = await context.params;
  return proxyToBackend(`/api/menu/header/${tenantId}`, request);
}
