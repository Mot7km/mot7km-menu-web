import createMiddleware from 'next-intl/middleware';
import { i18n } from './src/config/i18n';

const intlMiddleware = createMiddleware({
  locales: i18n.locales,
  defaultLocale: i18n.defaultLocale,
});

export default intlMiddleware;

export const config = {
  matcher: ['/', '/((?!api|_next|_vercel|robots\\.txt|sitemap\\.xml|llms\\.txt|ai-catalog\\.json|.*\\..*).*)'],
};
