export const THEME_STORAGE_KEY = "mot7km-theme";

export const DEFAULT_THEME_COLORS = [
  "#2B9FD9", // Primary
  "#0B529E", // Secondary
  "#F8F9FA", // Accent
] as const;

let activeThemePalette: [string, string, string] = [...DEFAULT_THEME_COLORS];

export const themes = {
  light: {
    name: "light",
    label: "Light",
  },
  dark: {
    name: "dark",
    label: "Dark",
  },
  system: {
    name: "system",
    label: "System",
  },
} as const;

export type ThemeName = keyof typeof themes;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeHex(hex: string) {
  if (!hex || typeof hex !== "string") return null;

  const cleaned = hex.trim();
  const value = cleaned.startsWith("#") ? cleaned.slice(1) : cleaned;

  if (!/^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(value)) {
    return null;
  }

  if (value.length === 3) {
    return value
      .split("")
      .map((char) => char + char)
      .join("");
  }

  return value.toUpperCase();
}

function hexToRgb(hex: string) {
  const value = normalizeHex(hex);
  if (!value) return { r: 0, g: 0, b: 0 };

  const fullHex = value.length === 3 ? value : value;
  const int = Number.parseInt(fullHex, 16);

  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

function mixHex(baseHex: string, targetHex: string, weight: number) {
  const base = hexToRgb(baseHex);
  const target = hexToRgb(targetHex);
  const ratio = clamp(weight, 0, 1);

  const mix = {
    r: base.r + (target.r - base.r) * ratio,
    g: base.g + (target.g - base.g) * ratio,
    b: base.b + (target.b - base.b) * ratio,
  };

  return rgbToHex(mix.r, mix.g, mix.b);
}

function adjustHex(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);

  const next = {
    r: clamp(r + amount, 0, 255),
    g: clamp(g + amount, 0, 255),
    b: clamp(b + amount, 0, 255),
  };

  return rgbToHex(next.r, next.g, next.b);
}

function withAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return [r, g, b].map((value) => value / 255).map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
}

function contrast(first: string, second: string) {
  const light = Math.max(luminance(first), luminance(second));
  const dark = Math.min(luminance(first), luminance(second));
  return (light + 0.05) / (dark + 0.05);
}

function contrastText(background: string) {
  return contrast(background, '#000000') >= contrast(background, '#FFFFFF') ? '#000000' : '#FFFFFF';
}

/**
 * Normalizes the theme palette to strictly 3 colors: [primary, secondary, accent].
 */
export function normalizeThemePalette(colors: ReadonlyArray<string> = DEFAULT_THEME_COLORS): [string, string, string] {
  const trimmed = (colors || [])
    .map((color) => normalizeHex(color ?? ""))
    .filter((color): color is string => Boolean(color));

  if (!trimmed.length) return [...DEFAULT_THEME_COLORS];

  const palette: string[] = [...trimmed.slice(0, 3)];

  while (palette.length < 3) {
    const fallbackIndex = palette.length % DEFAULT_THEME_COLORS.length;
    palette.push(DEFAULT_THEME_COLORS[fallbackIndex]);
  }

  return [palette[0], palette[1], palette[2]];
}

/**
 * Generates all semantic CSS variables entirely derived from exactly 3 brand colors.
 */
export function generateThemeVariables(colors: string[] = [...DEFAULT_THEME_COLORS]) {
  const [primary, secondary, accent] = normalizeThemePalette(colors);
  const textOnPrimary = contrastText(primary);
  const textOnSecondary = contrastText(secondary);
  const textOnAccent = contrastText(accent);
  const lightBackground = mixHex(secondary, "#FFFFFF", 0.92);
  const lightSurface = mixHex(secondary, "#FFFFFF", 0.98);
  const lightCard = mixHex(primary, lightSurface, 0.94);
  const darkBackground = mixHex(primary, "#000000", 0.88);
  const darkSurface = mixHex(primary, "#000000", 0.72);
  const darkCard = mixHex(secondary, darkSurface, 0.82);
  const lightText = contrastText(lightBackground) === "#000000" ? mixHex(primary, "#000000", 0.82) : "#FFFFFF";
  const darkText = contrastText(darkBackground) === "#FFFFFF" ? "#FFFFFF" : "#000000";

  const primary50 = mixHex(primary, "#FFFFFF", 0.86);
  const primary100 = mixHex(primary, "#FFFFFF", 0.7);
  const secondary50 = mixHex(secondary, "#FFFFFF", 0.86);
  const secondary100 = mixHex(secondary, "#FFFFFF", 0.7);
  const accent50 = mixHex(accent, "#FFFFFF", 0.88);
  const accent100 = mixHex(accent, "#FFFFFF", 0.72);

  const light = {
    "--color-primary": primary,
    "--color-primary-dark": adjustHex(primary, -30),
    "--color-primary-light": adjustHex(primary, 24),
    "--color-primary-50": primary50,
    "--color-primary-100": primary100,
    "--color-secondary-50": secondary50,
    "--color-secondary-100": secondary100,
    "--color-accent-50": accent50,
    "--color-accent-100": accent100,
    "--color-text-on-primary": textOnPrimary,
    "--color-text-on-secondary": textOnSecondary,
    "--color-text-on-accent": textOnAccent,

    "--color-secondary": secondary,
    "--color-secondary-dark": adjustHex(secondary, -26),
    "--color-secondary-light": adjustHex(secondary, 24),

    "--color-accent": accent,
    "--color-accent-dark": adjustHex(accent, -24),
    "--color-accent-light": adjustHex(accent, 28),

    "--color-warning": accent,
    "--color-warning-dark": adjustHex(accent, -18),
    "--color-warning-light": adjustHex(accent, 24),

    "--gradient-primary": `linear-gradient(135deg, ${primary}, ${accent})`,
    "--gradient-brand": `linear-gradient(135deg, ${primary}, ${secondary}, ${accent})`,
    "--gradient-accent": `linear-gradient(135deg, ${accent}, ${primary})`,
    "--gradient-hero": `linear-gradient(135deg, ${withAlpha(primary, 0.92)}, ${withAlpha(secondary, 0.88)}, ${withAlpha(accent, 0.8)})`,
    "--gradient-subtle": `linear-gradient(135deg, ${withAlpha(primary, 0.08)}, transparent, ${withAlpha(accent, 0.08)})`,

    "--color-success": accent,
    "--color-error": primary,
    "--color-danger": primary,
    "--color-info": accent,
    "--color-background": lightBackground,
    "--color-surface": lightSurface,
    "--color-card-light": lightCard,
    "--color-surface-elevated": mixHex(lightSurface, "#FFFFFF", 0.4),
    "--color-text-primary": lightText,
    "--color-text-secondary": mixHex(lightText, secondary, 0.35),
    "--color-text-muted": mixHex(lightText, secondary, 0.55),
    "--color-text-light": mixHex(lightText, secondary, 0.72),
    "--color-border": withAlpha(primary, 0.14),
    "--color-border-strong": withAlpha(primary, 0.28),
    "--color-divider": withAlpha(primary, 0.08),
    "--shadow-card": `0 4px 20px ${withAlpha(primary, 0.1)}`,
    "--shadow-card-hover": `0 12px 32px ${withAlpha(primary, 0.2)}`,
    "--shadow-glow": `0 0 20px ${withAlpha(accent, 0.2)}`,
  } as Record<string, string>;

  const dark = {
    "--color-primary": adjustHex(primary, 8),
    "--color-primary-dark": primary,
    "--color-primary-light": adjustHex(primary, 18),
    "--color-primary-50": withAlpha(primary, 0.1),
    "--color-primary-100": withAlpha(primary, 0.18),
    "--color-secondary-50": withAlpha(secondary, 0.1),
    "--color-secondary-100": withAlpha(secondary, 0.18),
    "--color-accent-50": withAlpha(accent, 0.1),
    "--color-accent-100": withAlpha(accent, 0.18),
    "--color-text-on-primary": contrastText(adjustHex(primary, 8)),
    "--color-text-on-secondary": contrastText(adjustHex(secondary, 10)),
    "--color-text-on-accent": contrastText(adjustHex(accent, 10)),

    "--color-secondary": adjustHex(secondary, 10),
    "--color-secondary-dark": secondary,
    "--color-secondary-light": adjustHex(secondary, 20),

    "--color-accent": adjustHex(accent, 10),
    "--color-accent-dark": accent,
    "--color-accent-light": adjustHex(accent, 26),

    "--color-warning": adjustHex(accent, 6),
    "--color-warning-dark": accent,
    "--color-warning-light": adjustHex(accent, 20),

    "--gradient-primary": `linear-gradient(135deg, ${adjustHex(primary, 8)}, ${adjustHex(accent, 8)})`,
    "--gradient-brand": `linear-gradient(135deg, ${adjustHex(primary, 8)}, ${adjustHex(secondary, 8)}, ${adjustHex(accent, 8)})`,
    "--gradient-accent": `linear-gradient(135deg, ${adjustHex(accent, 8)}, ${adjustHex(primary, 8)})`,
    "--gradient-hero": `linear-gradient(135deg, ${withAlpha(primary, 0.96)}, ${withAlpha(secondary, 0.9)}, ${withAlpha(accent, 0.84)})`,
    "--gradient-subtle": `linear-gradient(135deg, ${withAlpha(primary, 0.12)}, transparent, ${withAlpha(accent, 0.1)})`,

    "--color-success": adjustHex(accent, 18),
    "--color-error": adjustHex(primary, -18),
    "--color-danger": adjustHex(primary, -18),
    "--color-info": adjustHex(accent, 6),
    "--color-background": darkBackground,
    "--color-surface": darkSurface,
    "--color-card-dark": darkCard,
    "--color-elevated-dark": darkCard,
    "--color-surface-elevated": darkCard,
    "--color-text-primary": darkText,
    "--color-text-secondary": mixHex(darkText, secondary, 0.25),
    "--color-text-muted": mixHex(darkText, secondary, 0.5),
    "--color-text-light": mixHex(darkText, secondary, 0.7),
    "--color-border": withAlpha(secondary, 0.18),
    "--color-border-strong": withAlpha(secondary, 0.3),
    "--color-divider": withAlpha(secondary, 0.1),
    "--shadow-card": `0 8px 24px ${withAlpha(primary, 0.22)}`,
    "--shadow-card-hover": `0 16px 40px ${withAlpha(accent, 0.26)}`,
    "--shadow-glow": `0 0 30px ${withAlpha(accent, 0.24)}`,
  } as Record<string, string>;

  return { light, dark };
}

export function applyThemePalette(colors: string[] = [...DEFAULT_THEME_COLORS]) {
  if (typeof document === "undefined") return;

  const normalized = normalizeThemePalette(colors);
  activeThemePalette = normalized;
  const root = document.documentElement;
  const { light, dark } = generateThemeVariables(normalized);
  const isDark = root.classList.contains("dark");
  const activeTheme = isDark ? dark : light;

  Object.entries({ ...light, ...dark }).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  Object.entries(activeTheme).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

}

export function getActiveThemePalette() {
  return [...activeThemePalette] as [string, string, string];
}

export function setThemePalette(colors: ReadonlyArray<string> = DEFAULT_THEME_COLORS) {
  const normalized = normalizeThemePalette(colors);
  applyThemePalette(normalized);
  return normalized;
}
