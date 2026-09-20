import createMiddleware from 'next-intl/middleware';
import { i18n } from './src/config/i18n';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
});

export default intlMiddleware;

export const config = {
  matcher: ['/', '/((?!api|_next|.*\\..*).*)'],
};