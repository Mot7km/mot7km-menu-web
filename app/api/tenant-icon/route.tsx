import { ImageResponse } from 'next/og';
import { API_BASE_URL } from '@/lib/constants';

export const runtime = 'edge';

export async function GET(request: Request) {
  const businessName = new URL(request.url).searchParams.get('businessName');

  if (!businessName) {
    return Response.redirect(new URL('/default-icon.png', request.url));
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/menu/by-business-name/${encodeURIComponent(businessName)}`,
      { cache: 'no-store' }
    );
    const store = await response.json();
    const logo = store?.header?.logo || store?.header?.logoUrl || store?.businessIdentity?.logo;

    if (!logo) {
      return Response.redirect(new URL('/default-icon.png', request.url));
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '9999px',
            overflow: 'hidden',
          }}
        >
          <img
            src={logo}
            alt={businessName}
            width="256"
            height="256"
            style={{ objectFit: 'cover', borderRadius: '9999px' }}
          />
        </div>
      ),
      { width: 256, height: 256 }
    );
  } catch {
    return Response.redirect(new URL('/default-icon.png', request.url));
  }
}
