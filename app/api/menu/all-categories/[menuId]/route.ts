// app/api/menu/all-categories/[menuId]/route.ts
import { proxyToBackend } from '../../../_proxy';

export async function GET(
  request: Request,
  context: { params: Promise<{ menuId: string }> }
): Promise<Response> {
  const { menuId } = await context.params;
  return proxyToBackend(`/api/menu/all-categories/${menuId}`, request);
}
