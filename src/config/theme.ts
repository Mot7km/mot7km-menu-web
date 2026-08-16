export const THEME_STORAGE_KEY = "mot7km-theme";
export const THEME_PALETTE_STORAGE_KEY = "mot7km-theme-palette";

export const DEFAULT_THEME_COLORS = [
  "#1683C7",
  "#0F766E",
  "#06B6D4",
  "#F59E0B",
] as const;

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
  if (!value) return { r: 22, g: 131, b: 199 };

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

export function normalizeThemePalette(colors: ReadonlyArray<string> = DEFAULT_THEME_COLORS) {
  const trimmed = (colors || [])
    .map((color) => normalizeHex(color ?? ""))
    .filter((color): color is string => Boolean(color));

  if (!trimmed.length) return [...DEFAULT_THEME_COLORS];

  const palette = [...trimmed.slice(0, 4)];

  while (palette.length < 4) {
    const fallbackIndex = palette.length % DEFAULT_THEME_COLORS.length;
    palette.push(DEFAULT_THEME_COLORS[fallbackIndex]);
  }

  return palette.slice(0, 4);
}

export function generateThemeVariables(colors: string[] = [...DEFAULT_THEME_COLORS]) {
  const [primary, secondary, accent, highlight] = normalizeThemePalette(colors);

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

    "--color-secondary": secondary,
    "--color-secondary-dark": adjustHex(secondary, -26),
    "--color-secondary-light": adjustHex(secondary, 24),

    "--color-accent": accent,
    "--color-accent-dark": adjustHex(accent, -24),
    "--color-accent-light": adjustHex(accent, 28),

    "--color-warning": highlight,
    "--color-warning-dark": adjustHex(highlight, -18),
    "--color-warning-light": adjustHex(highlight, 24),

    "--gradient-primary": `linear-gradient(135deg, ${primary}, ${accent})`,
    "--gradient-brand": `linear-gradient(135deg, ${primary}, ${secondary}, ${accent})`,
    "--gradient-accent": `linear-gradient(135deg, ${accent}, ${primary})`,
    "--gradient-hero": `linear-gradient(135deg, ${withAlpha(primary, 0.92)}, ${withAlpha(secondary, 0.88)}, ${withAlpha(accent, 0.8)})`,
    "--gradient-subtle": `linear-gradient(135deg, ${withAlpha(primary, 0.08)}, transparent, ${withAlpha(accent, 0.08)})`,

    "--color-success": "#10B981",
    "--color-error": "#EF4444",
    "--color-info": accent,
  } as Record<string, string>;

  const dark = {
    "--color-primary": adjustHex(primary, 8),
    "--color-primary-dark": primary,
    "--color-primary-light": adjustHex(primary, 18),
    "--color-primary-50": withAlpha(primary, 0.1),
    "--color-primary-100": withAlpha(primary, 0.18),

    "--color-secondary": adjustHex(secondary, 10),
    "--color-secondary-dark": secondary,
    "--color-secondary-light": adjustHex(secondary, 20),

    "--color-accent": adjustHex(accent, 10),
    "--color-accent-dark": accent,
    "--color-accent-light": adjustHex(accent, 26),

    "--color-warning": adjustHex(highlight, 6),
    "--color-warning-dark": highlight,
    "--color-warning-light": adjustHex(highlight, 20),

    "--gradient-primary": `linear-gradient(135deg, ${adjustHex(primary, 8)}, ${adjustHex(accent, 8)})`,
    "--gradient-brand": `linear-gradient(135deg, ${adjustHex(primary, 8)}, ${adjustHex(secondary, 8)}, ${adjustHex(accent, 8)})`,
    "--gradient-accent": `linear-gradient(135deg, ${adjustHex(accent, 8)}, ${adjustHex(primary, 8)})`,
    "--gradient-hero": `linear-gradient(135deg, ${withAlpha(primary, 0.96)}, ${withAlpha(secondary, 0.9)}, ${withAlpha(accent, 0.84)})`,
    "--gradient-subtle": `linear-gradient(135deg, ${withAlpha(primary, 0.12)}, transparent, ${withAlpha(accent, 0.1)})`,

    "--color-success": "#34D399",
    "--color-error": "#F87171",
    "--color-info": adjustHex(accent, 6),
  } as Record<string, string>;

  return { light, dark };
}

export function getStoredThemePalette() {
  if (typeof window === "undefined") return [...DEFAULT_THEME_COLORS];

  try {
    const saved = window.localStorage.getItem(THEME_PALETTE_STORAGE_KEY);
    if (!saved) return [...DEFAULT_THEME_COLORS];

    const parsed = JSON.parse(saved);
    return normalizeThemePalette(Array.isArray(parsed) ? parsed : DEFAULT_THEME_COLORS);
  } catch {
    return [...DEFAULT_THEME_COLORS];
  }
}

export function applyThemePalette(colors: string[] = [...DEFAULT_THEME_COLORS]) {
  if (typeof document === "undefined") return;

  const normalized = normalizeThemePalette(colors);
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

  try {
    window.localStorage.setItem(THEME_PALETTE_STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // no-op
  }
}

export function setThemePalette(colors: ReadonlyArray<string> = DEFAULT_THEME_COLORS) {
  const normalized = normalizeThemePalette(colors);
  applyThemePalette(normalized);
  return normalized;
}
