import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
});

export default function middleware(request: NextRequest) {
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  const [businessName, locale] = segments;
  if (segments.length >= 2 && businessName && (locale === 'en' || locale === 'ar')) {
    const url = request.nextUrl.clone();
    const trailing = segments.slice(2).join('/');
    url.pathname = `/${locale}${trailing ? `/${trailing}` : ''}`;
    url.searchParams.set('businessName', businessName);
    return NextResponse.rewrite(url);
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/((?!api|_next|.*\\..*).*)'],
};