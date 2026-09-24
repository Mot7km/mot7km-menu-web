const GOOGLE_FONT_LINK_PREFIX = 'tenant-font-';

function normalizeFontName(fontName: string | null | undefined) {
  if (typeof fontName !== 'string') return null;

  const name = fontName.trim();
  if (!name || name.toLowerCase() === 'string') return null;
  return name;
}

export function loadGoogleFont(fontName: string | null | undefined) {
  if (typeof document === 'undefined') return null;

  const normalizedName = normalizeFontName(fontName);
  if (!normalizedName) return null;

  const linkId = `${GOOGLE_FONT_LINK_PREFIX}${normalizedName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(normalizedName).replace(/%20/g, '+')}&display=swap`;
    document.head.appendChild(link);
  }

  return normalizedName;
}
