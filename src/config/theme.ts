// src/config/theme.ts

import type { ApiBrandColors, ApiColorPalette } from "@/lib/types/menuApi";

export const THEME_STORAGE_KEY = "mot7km-theme";

export const DEFAULT_THEME_COLORS = [
  "#2B9FD9", // Primary
  "#0B529E", // Secondary
  "#F8F9FA", // Accent
] as const;

/**
 * Fully resolved 11-token color palette with all non-null string values.
 */
export interface ResolvedColorPalette {
  primary: string;
  onPrimary: string;
  secondary: string;
  onSecondary: string;
  background: string;
  surface: string;
  surfaceSubtle: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  accent: string;
}

/**
 * Standard 11-token default light palette.
 * Aligned with the Mot7km design system specification.
 */
export const DEFAULT_LIGHT_PALETTE: ResolvedColorPalette = {
  primary: "#2B9FD9",
  onPrimary: "#FFFFFF",
  secondary: "#0B529E",
  onSecondary: "#FFFFFF",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceSubtle: "#F1F5F9",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  accent: "#10B981",
};

/**
 * Standard 11-token default dark palette.
 * Aligned with the Mot7km design system specification.
 */
export const DEFAULT_DARK_PALETTE: ResolvedColorPalette = {
  primary: "#3DA9E0",
  onPrimary: "#FFFFFF",
  secondary: "#1E6BB8",
  onSecondary: "#F8FAFC",
  background: "#0B0F19",
  surface: "#151C2C",
  surfaceSubtle: "#1E293B",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  border: "#1E293B",
  accent: "#34D399",
};

/**
 * Functional constant colors that cannot be overridden by restaurant branding.
 * These maintain standard UX safety and feedback semantics.
 */
export const FUNCTIONAL_COLORS = {
  light: {
    danger: "#EF4444",
    error: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
    info: "#3B82F6",
    shimmer: "rgba(0, 0, 0, 0.06)",
  },
  dark: {
    danger: "#F87171",
    error: "#F87171",
    success: "#34D399",
    warning: "#FBBF24",
    info: "#60A5FA",
    shimmer: "rgba(255, 255, 255, 0.08)",
  },
} as const;

export type ThemePalettes = {
  light: ResolvedColorPalette;
  dark: ResolvedColorPalette;
};

export type ThemePaletteInput =
  | ApiBrandColors
  | ThemePalettes
  | ReadonlyArray<string>
  | string[]
  | null
  | undefined;

let currentThemePalettes: ThemePalettes = {
  light: { ...DEFAULT_LIGHT_PALETTE },
  dark: { ...DEFAULT_DARK_PALETTE },
};

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

export function normalizeHex(hex: string | null | undefined): string | null {
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
      .join("")
      .toUpperCase();
  }

  return value.toUpperCase();
}

function hexToRgb(hex: string) {
  const value = normalizeHex(hex);
  if (!value) return { r: 0, g: 0, b: 0 };

  const int = Number.parseInt(value, 16);

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

export function mixHex(baseHex: string, targetHex: string, weight: number): string {
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

export function adjustHex(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);

  const next = {
    r: clamp(r + amount, 0, 255),
    g: clamp(g + amount, 0, 255),
    b: clamp(b + amount, 0, 255),
  };

  return rgbToHex(next.r, next.g, next.b);
}

export function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
}

export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return [r, g, b]
    .map((value) => value / 255)
    .map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4))
    .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
}

export function contrast(first: string, second: string): number {
  const light = Math.max(luminance(first), luminance(second));
  const dark = Math.min(luminance(first), luminance(second));
  return (light + 0.05) / (dark + 0.05);
}

export function contrastText(background: string): string {
  return contrast(background, "#000000") >= contrast(background, "#FFFFFF")
    ? "#000000"
    : "#FFFFFF";
}

/**
 * Normalizes an array of colors to strictly 3 hex colors: [primary, secondary, accent].
 * Kept for full backward compatibility.
 */
export function normalizeThemePalette(
  colors: ReadonlyArray<string> = DEFAULT_THEME_COLORS
): [string, string, string] {
  const trimmed = (colors || [])
    .map((color) => {
      const hex = normalizeHex(color ?? "");
      return hex ? `#${hex}` : null;
    })
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
 * Resolves a partial API color palette against the default palette,
 * safely validating hex values and deriving accessible onPrimary/onSecondary if absent.
 */
export function resolvePalette(
  input: Partial<ApiColorPalette> | null | undefined,
  fallback: ResolvedColorPalette
): ResolvedColorPalette {
  if (!input) return { ...fallback };

  const getValidHex = (val?: string | null, fb?: string | null): string => {
    const norm = normalizeHex(val ?? "");
    if (norm) return `#${norm}`;
    const fbNorm = normalizeHex(fb ?? "");
    return fbNorm ? `#${fbNorm}` : "#000000";
  };

  const primary = getValidHex(input.primary, fallback.primary);
  const secondary = getValidHex(input.secondary, fallback.secondary);
  const accent = getValidHex(input.accent, fallback.accent);
  const background = getValidHex(input.background, fallback.background);
  const surface = getValidHex(input.surface, fallback.surface);
  const surfaceSubtle = getValidHex(input.surfaceSubtle, fallback.surfaceSubtle);
  const textPrimary = getValidHex(input.textPrimary, fallback.textPrimary);
  const textSecondary = getValidHex(input.textSecondary, fallback.textSecondary);
  const border = getValidHex(input.border, fallback.border);

  // If onPrimary/onSecondary provided by backend, respect them.
  // Otherwise calculate optimal contrast based on background luminance.
  const onPrimary = input.onPrimary && normalizeHex(input.onPrimary)
    ? `#${normalizeHex(input.onPrimary)}`
    : contrastText(primary);

  const onSecondary = input.onSecondary && normalizeHex(input.onSecondary)
    ? `#${normalizeHex(input.onSecondary)}`
    : contrastText(secondary);

  return {
    primary,
    onPrimary,
    secondary,
    onSecondary,
    background,
    surface,
    surfaceSubtle,
    textPrimary,
    textSecondary,
    border,
    accent,
  };
}

/**
 * Derives full 11-token light & dark palettes from legacy 3 brand colors.
 */
export function derivePalettesFrom3Colors(
  colors: ReadonlyArray<string> = DEFAULT_THEME_COLORS
): ThemePalettes {
  const [primary, secondary, accent] = normalizeThemePalette(colors);

  const lightBackground = mixHex(secondary, "#FFFFFF", 0.94);
  const lightSurface = "#FFFFFF";
  const lightSurfaceSubtle = mixHex(secondary, "#FFFFFF", 0.96);
  const lightText = contrastText(lightBackground) === "#000000" ? mixHex(primary, "#000000", 0.85) : "#FFFFFF";

  const darkBackground = mixHex(primary, "#000000", 0.9);
  const darkSurface = mixHex(primary, "#000000", 0.78);
  const darkSurfaceSubtle = mixHex(secondary, darkSurface, 0.82);
  const darkText = "#F8FAFC";

  const light: ResolvedColorPalette = {
    primary,
    onPrimary: contrastText(primary),
    secondary,
    onSecondary: contrastText(secondary),
    background: lightBackground,
    surface: lightSurface,
    surfaceSubtle: lightSurfaceSubtle,
    textPrimary: lightText,
    textSecondary: mixHex(lightText, secondary, 0.35),
    border: withAlpha(primary, 0.14),
    accent,
  };

  const dark: ResolvedColorPalette = {
    primary: adjustHex(primary, 8),
    onPrimary: contrastText(adjustHex(primary, 8)),
    secondary: adjustHex(secondary, 10),
    onSecondary: contrastText(adjustHex(secondary, 10)),
    background: darkBackground,
    surface: darkSurface,
    surfaceSubtle: darkSurfaceSubtle,
    textPrimary: darkText,
    textSecondary: mixHex(darkText, secondary, 0.3),
    border: withAlpha(secondary, 0.22),
    accent: adjustHex(accent, 10),
  };

  return { light, dark };
}

/**
 * Parses any incoming color representation (new 11-color palette or legacy 3 colors)
 * into unified light & dark ThemePalettes.
 */
export function parseThemePalettes(input?: ThemePaletteInput): ThemePalettes {
  if (!input) {
    return {
      light: { ...DEFAULT_LIGHT_PALETTE },
      dark: { ...DEFAULT_DARK_PALETTE },
    };
  }

  // Case 1: Array of hex strings (legacy [primary, secondary, accent])
  if (Array.isArray(input)) {
    return derivePalettesFrom3Colors(input);
  }

  // Case 2: Object with light and/or dark palettes
  if ("light" in input || "dark" in input) {
    const raw = input as { light?: Partial<ApiColorPalette> | null; dark?: Partial<ApiColorPalette> | null };
    const hasLight = Boolean(raw.light && Object.keys(raw.light).length > 0);
    const hasDark = Boolean(raw.dark && Object.keys(raw.dark).length > 0);

    const light = hasLight
      ? resolvePalette(raw.light, DEFAULT_LIGHT_PALETTE)
      : resolvePalette(null, DEFAULT_LIGHT_PALETTE);

    const dark = hasDark
      ? resolvePalette(raw.dark, DEFAULT_DARK_PALETTE)
      : resolvePalette(null, DEFAULT_DARK_PALETTE);

    return { light, dark };
  }

  // Case 3: Flat legacy object { primary?, secondary?, accent? }
  if ("primary" in input || "secondary" in input || "accent" in input) {
    const legacy = input as { primary?: string | null; secondary?: string | null; accent?: string | null };
    const validColors = [legacy.primary, legacy.secondary, legacy.accent].filter(
      (c): c is string => Boolean(c && typeof c === "string" && c.trim())
    );
    return derivePalettesFrom3Colors(validColors);
  }

  return {
    light: { ...DEFAULT_LIGHT_PALETTE },
    dark: { ...DEFAULT_DARK_PALETTE },
  };
}

/**
 * Generates all semantic CSS variables for both light and dark modes
 * from either ThemePalettes, ApiBrandColors, or legacy 3-color array.
 */
export function generateThemeVariables(input?: ThemePaletteInput) {
  const { light, dark } = parseThemePalettes(input || currentThemePalettes);

  const lightVars: Record<string, string> = {
    "--color-primary": light.primary,
    "--color-primary-dark": adjustHex(light.primary, -30),
    "--color-primary-light": adjustHex(light.primary, 24),
    "--color-primary-50": mixHex(light.primary, "#FFFFFF", 0.86),
    "--color-primary-100": mixHex(light.primary, "#FFFFFF", 0.7),
    "--color-secondary": light.secondary,
    "--color-secondary-dark": adjustHex(light.secondary, -26),
    "--color-secondary-light": adjustHex(light.secondary, 24),
    "--color-secondary-50": mixHex(light.secondary, "#FFFFFF", 0.86),
    "--color-secondary-100": mixHex(light.secondary, "#FFFFFF", 0.7),
    "--color-accent": light.accent,
    "--color-accent-dark": adjustHex(light.accent, -24),
    "--color-accent-light": adjustHex(light.accent, 28),
    "--color-accent-50": mixHex(light.accent, "#FFFFFF", 0.88),
    "--color-accent-100": mixHex(light.accent, "#FFFFFF", 0.72),

    // Text on actions (supports both token conventions)
    "--color-on-primary": light.onPrimary,
    "--color-text-on-primary": light.onPrimary,
    "--color-on-secondary": light.onSecondary,
    "--color-text-on-secondary": light.onSecondary,
    "--color-text-on-accent": contrastText(light.accent),

    // Surfaces & Background
    "--color-background": light.background,
    "--color-bg": light.background,
    "--color-surface": light.surface,
    "--color-surface-subtle": light.surfaceSubtle,
    "--color-surface-elevated": light.surfaceSubtle,
    "--color-card-light": light.surface,

    // Typography & Content
    "--color-text-primary": light.textPrimary,
    "--color-text-secondary": light.textSecondary,
    "--color-text-muted": mixHex(light.textSecondary, light.background, 0.3),
    "--color-text-light": mixHex(light.textSecondary, light.background, 0.55),

    // Lines & Borders
    "--color-border": light.border,
    "--color-border-strong": mixHex(light.border, light.textSecondary, 0.3),
    "--color-divider": withAlpha(light.border, 0.6),

    // Functional constants
    "--color-danger": FUNCTIONAL_COLORS.light.danger,
    "--color-error": FUNCTIONAL_COLORS.light.error,
    "--color-success": FUNCTIONAL_COLORS.light.success,
    "--color-warning": FUNCTIONAL_COLORS.light.warning,
    "--color-info": FUNCTIONAL_COLORS.light.info,
    "--color-shimmer": FUNCTIONAL_COLORS.light.shimmer,

    // Gradients
    "--gradient-primary": `linear-gradient(135deg, ${light.primary}, ${light.accent})`,
    "--gradient-brand": `linear-gradient(135deg, ${light.primary}, ${light.secondary}, ${light.accent})`,
    "--gradient-accent": `linear-gradient(135deg, ${light.accent}, ${light.primary})`,
    "--gradient-hero": `linear-gradient(135deg, ${withAlpha(light.primary, 0.92)}, ${withAlpha(light.secondary, 0.88)}, ${withAlpha(light.accent, 0.8)})`,
    "--gradient-subtle": `linear-gradient(135deg, ${withAlpha(light.primary, 0.08)}, transparent, ${withAlpha(light.accent, 0.08)})`,

    // Shadows
    "--shadow-card": `0 4px 20px ${withAlpha(light.primary, 0.08)}`,
    "--shadow-card-hover": `0 12px 32px ${withAlpha(light.primary, 0.16)}`,
    "--shadow-glow": `0 0 20px ${withAlpha(light.accent, 0.2)}`,
    "--shadow-glow-strong": `0 0 30px ${withAlpha(light.accent, 0.35)}`,
  };

  const darkVars: Record<string, string> = {
    "--color-primary": dark.primary,
    "--color-primary-dark": adjustHex(dark.primary, -20),
    "--color-primary-light": adjustHex(dark.primary, 18),
    "--color-primary-50": withAlpha(dark.primary, 0.1),
    "--color-primary-100": withAlpha(dark.primary, 0.18),
    "--color-secondary": dark.secondary,
    "--color-secondary-dark": adjustHex(dark.secondary, -20),
    "--color-secondary-light": adjustHex(dark.secondary, 20),
    "--color-secondary-50": withAlpha(dark.secondary, 0.1),
    "--color-secondary-100": withAlpha(dark.secondary, 0.18),
    "--color-accent": dark.accent,
    "--color-accent-dark": adjustHex(dark.accent, -20),
    "--color-accent-light": adjustHex(dark.accent, 20),
    "--color-accent-50": withAlpha(dark.accent, 0.1),
    "--color-accent-100": withAlpha(dark.accent, 0.18),

    // Text on actions
    "--color-on-primary": dark.onPrimary,
    "--color-text-on-primary": dark.onPrimary,
    "--color-on-secondary": dark.onSecondary,
    "--color-text-on-secondary": dark.onSecondary,
    "--color-text-on-accent": contrastText(dark.accent),

    // Surfaces & Background
    "--color-background": dark.background,
    "--color-bg": dark.background,
    "--color-surface": dark.surface,
    "--color-surface-subtle": dark.surfaceSubtle,
    "--color-surface-elevated": dark.surfaceSubtle,
    "--color-card-dark": dark.surface,
    "--color-elevated-dark": dark.surfaceSubtle,

    // Typography & Content
    "--color-text-primary": dark.textPrimary,
    "--color-text-secondary": dark.textSecondary,
    "--color-text-muted": mixHex(dark.textSecondary, dark.background, 0.35),
    "--color-text-light": mixHex(dark.textSecondary, dark.background, 0.55),

    // Lines & Borders
    "--color-border": dark.border,
    "--color-border-strong": mixHex(dark.border, dark.textSecondary, 0.35),
    "--color-divider": withAlpha(dark.border, 0.6),

    // Functional constants
    "--color-danger": FUNCTIONAL_COLORS.dark.danger,
    "--color-error": FUNCTIONAL_COLORS.dark.error,
    "--color-success": FUNCTIONAL_COLORS.dark.success,
    "--color-warning": FUNCTIONAL_COLORS.dark.warning,
    "--color-info": FUNCTIONAL_COLORS.dark.info,
    "--color-shimmer": FUNCTIONAL_COLORS.dark.shimmer,

    // Gradients
    "--gradient-primary": `linear-gradient(135deg, ${dark.primary}, ${dark.accent})`,
    "--gradient-brand": `linear-gradient(135deg, ${dark.primary}, ${dark.secondary}, ${dark.accent})`,
    "--gradient-accent": `linear-gradient(135deg, ${dark.accent}, ${dark.primary})`,
    "--gradient-hero": `linear-gradient(135deg, ${withAlpha(dark.primary, 0.96)}, ${withAlpha(dark.secondary, 0.9)}, ${withAlpha(dark.accent, 0.84)})`,
    "--gradient-subtle": `linear-gradient(135deg, ${withAlpha(dark.primary, 0.12)}, transparent, ${withAlpha(dark.accent, 0.1)})`,

    // Shadows
    "--shadow-card": `0 8px 24px ${withAlpha(dark.primary, 0.22)}`,
    "--shadow-card-hover": `0 16px 40px ${withAlpha(dark.accent, 0.26)}`,
    "--shadow-glow": `0 0 30px ${withAlpha(dark.accent, 0.24)}`,
    "--shadow-glow-strong": `0 0 45px ${withAlpha(dark.accent, 0.4)}`,
  };

  return { light: lightVars, dark: darkVars };
}

/**
 * Applies the given theme palette to document.documentElement.
 * Accepts new 11-color light/dark palettes or legacy 3 colors,
 * dynamically selecting active variables based on `.dark` class.
 */
export function applyThemePalette(input?: ThemePaletteInput) {
  if (typeof document === "undefined") return;

  if (input !== undefined) {
    currentThemePalettes = parseThemePalettes(input);
  }

  const root = document.documentElement;
  const isDark = root.classList.contains("dark");
  const { light, dark } = generateThemeVariables(currentThemePalettes);
  const activeTheme = isDark ? dark : light;

  // Apply all active variables
  Object.entries(activeTheme).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

/**
 * Returns the currently active 3 primary colors for backward compatibility.
 */
export function getActiveThemePalette(): [string, string, string] {
  if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) {
    return [
      currentThemePalettes.dark.primary,
      currentThemePalettes.dark.secondary,
      currentThemePalettes.dark.accent,
    ];
  }
  return [
    currentThemePalettes.light.primary,
    currentThemePalettes.light.secondary,
    currentThemePalettes.light.accent,
  ];
}

/**
 * Returns the active full 11-token palettes.
 */
export function getActivePalettes(): ThemePalettes {
  return { ...currentThemePalettes };
}

export function setThemePalette(colors: ThemePaletteInput = DEFAULT_THEME_COLORS) {
  applyThemePalette(colors);
  return getActiveThemePalette();
}
