import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { i18n } from './src/config/i18n';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
});

export default function middleware(request: NextRequest) {
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  const isMenuRoute = i18n.locales.includes(segments[0] as 'en' | 'ar') && segments[1] === 'menu';
  const businessName = isMenuRoute ? segments[2] : undefined;
  const locale = isMenuRoute ? segments[0] : undefined;
  const minimumSegments = 3;

  if (segments.length >= minimumSegments && businessName && (locale === 'en' || locale === 'ar')) {
    const url = request.nextUrl.clone();
    const trailing = segments.slice(3).join('/');
    url.pathname = `/${locale}${trailing ? `/${trailing}` : ''}`;
    url.searchParams.set('businessName', businessName);
    return NextResponse.rewrite(url);
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/((?!api|_next|.*\\..*).*)'],
};