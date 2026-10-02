'use client';

import React, { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// 1. BASE ICON TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface IconProps {
  size?: number | string;
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. BRAND & SOCIAL SVG ICONS
// ─────────────────────────────────────────────────────────────────────────────

export function InstagramIcon({ size = 16, className = '', color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={style}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

export function FacebookIcon({ size = 16, className = '', color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={style}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function TikTokIcon({ size = 16, className = '', color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={style}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 16, className = '', color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={style}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function TwitterIcon({ size = 16, className = '', color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={style}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function SnapchatIcon({ size = 16, className = '', color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={style}>
      <path d="M12.065 2c-3.187 0-5.748 2.378-5.748 5.76 0 .57.108 1.157.29 1.637-.927.135-1.92.518-2.029 1.545-.078.736.438 1.253 1.054 1.547.05.023.1.045.148.067-.099.344-.316 1.076-.847 1.488-.696.538-1.574.629-1.933 1.25-.236.408-.103.882.35 1.196.792.55 1.838.455 2.853.364.555-.05 1.121-.1 1.686.082.493.158.877.498 1.272.846.59.52 1.248 1.1 2.255 1.25.214.032.43.048.648.048.219 0 .435-.016.649-.048 1.006-.15 1.664-.73 2.254-1.25.395-.348.779-.688 1.272-.846.565-.182 1.131-.132 1.686-.082 1.015.091 2.06.186 2.853-.364.453-.314.586-.788.35-1.196-.36-.621-1.237-.712-1.933-1.25-.53-.412-.748-1.144-.847-1.488.048-.022.098-.044.148-.067.616-.294 1.132-.811 1.054-1.547-.11-1.027-1.102-1.41-2.029-1.545.182-.48.29-1.067.29-1.637 0-3.382-2.561-5.76-5.748-5.76z" />
    </svg>
  );
}

export function YouTubeIcon({ size = 16, className = '', color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={style}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function LinkedInIcon({ size = 16, className = '', color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={style}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export function TelegramIcon({ size = 16, className = '', color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={style}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.943z" />
    </svg>
  );
}

export function GoogleIcon({ size = 16, className = '', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}>
      <path
        fill="#EA4335"
        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
      />
    </svg>
  );
}

export function AppleIcon({ size = 16, className = '', color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={style}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.66-.82 1.11-1.96.99-3.11-1 .04-2.16.67-2.84 1.47-.6.69-1.12 1.83-.98 2.96 1.11.09 2.18-.54 2.83-1.32z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. BRAND COLORS & CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const BRAND_COLORS = {
  instagram: {
    primary: '#E4405F',
    gradient: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
    shadow: 'rgba(228, 64, 95, 0.45)',
  },
  facebook: {
    primary: '#1877F2',
    gradient: 'linear-gradient(135deg, #1877F2 0%, #0c57bd 100%)',
    shadow: 'rgba(24, 119, 242, 0.45)',
  },
  tiktok: {
    primary: '#000000',
    accent1: '#EE1D52',
    accent2: '#69C9D0',
    gradient: 'linear-gradient(135deg, #010101 0%, #161823 100%)',
    shadow: 'rgba(238, 29, 82, 0.45)',
  },
  whatsapp: {
    primary: '#25D366',
    gradient: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
    shadow: 'rgba(37, 211, 102, 0.45)',
  },
  twitter: {
    primary: '#000000',
    blue: '#1DA1F2',
    gradient: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
    shadow: 'rgba(0, 0, 0, 0.4)',
  },
  x: {
    primary: '#000000',
    gradient: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
    shadow: 'rgba(0, 0, 0, 0.4)',
  },
  snapchat: {
    primary: '#FFFC00',
    gradient: 'linear-gradient(135deg, #FFFC00 0%, #FFE600 100%)',
    shadow: 'rgba(255, 252, 0, 0.5)',
  },
  youtube: {
    primary: '#FF0000',
    gradient: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
    shadow: 'rgba(255, 0, 0, 0.45)',
  },
  linkedin: {
    primary: '#0A66C2',
    gradient: 'linear-gradient(135deg, #0A66C2 0%, #004182 100%)',
    shadow: 'rgba(10, 102, 194, 0.45)',
  },
  telegram: {
    primary: '#229ED9',
    gradient: 'linear-gradient(135deg, #229ED9 0%, #1e87bb 100%)',
    shadow: 'rgba(34, 158, 217, 0.45)',
  },
  google: {
    primary: '#4285F4',
    shadow: 'rgba(66, 133, 244, 0.35)',
  },
  apple: {
    primary: '#000000',
    shadow: 'rgba(0, 0, 0, 0.35)',
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 4. SOCIAL PLATFORMS CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export interface SocialPlatformConfig {
  id: string;
  name: string;
  brandColor: string;
  hoverColor: string;
  hoverBg: string;
  hoverBorder?: string;
  hoverShadow?: string;
  icon: React.ComponentType<IconProps>;
  formatUrl: (handle: string) => string;
}

export const SOCIAL_CONFIG: Record<string, SocialPlatformConfig> = {
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    brandColor: BRAND_COLORS.instagram.primary,
    hoverColor: '#FFFFFF',
    hoverBg: BRAND_COLORS.instagram.gradient,
    hoverBorder: '#fd1d1d',
    hoverShadow: `0 4px 14px ${BRAND_COLORS.instagram.shadow}`,
    icon: InstagramIcon,
    formatUrl: (val) => {
      const handle = val.trim();
      if (handle.startsWith('http://') || handle.startsWith('https://')) return handle;
      return `https://instagram.com/${handle.replace(/^@/, '')}`;
    },
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    brandColor: BRAND_COLORS.facebook.primary,
    hoverColor: '#FFFFFF',
    hoverBg: BRAND_COLORS.facebook.gradient,
    hoverBorder: BRAND_COLORS.facebook.primary,
    hoverShadow: `0 4px 14px ${BRAND_COLORS.facebook.shadow}`,
    icon: FacebookIcon,
    formatUrl: (val) => {
      const handle = val.trim();
      if (handle.startsWith('http://') || handle.startsWith('https://')) return handle;
      return `https://facebook.com/${handle.replace(/^@/, '')}`;
    },
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    brandColor: BRAND_COLORS.tiktok.primary,
    hoverColor: '#FFFFFF',
    hoverBg: BRAND_COLORS.tiktok.gradient,
    hoverBorder: BRAND_COLORS.tiktok.accent1,
    hoverShadow: `0 4px 14px ${BRAND_COLORS.tiktok.shadow}`,
    icon: TikTokIcon,
    formatUrl: (val) => {
      const handle = val.trim();
      if (handle.startsWith('http://') || handle.startsWith('https://')) return handle;
      return `https://tiktok.com/@${handle.replace(/^@/, '')}`;
    },
  },
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp',
    brandColor: BRAND_COLORS.whatsapp.primary,
    hoverColor: '#FFFFFF',
    hoverBg: BRAND_COLORS.whatsapp.gradient,
    hoverBorder: BRAND_COLORS.whatsapp.primary,
    hoverShadow: `0 4px 14px ${BRAND_COLORS.whatsapp.shadow}`,
    icon: WhatsAppIcon,
    formatUrl: (val) => {
      const handle = val.trim();
      if (handle.startsWith('http://') || handle.startsWith('https://')) return handle;
      return `https://wa.me/${handle.replace(/[^0-9]/g, '')}`;
    },
  },
  twitter: {
    id: 'twitter',
    name: 'X (Twitter)',
    brandColor: BRAND_COLORS.twitter.primary,
    hoverColor: '#FFFFFF',
    hoverBg: BRAND_COLORS.twitter.gradient,
    hoverBorder: '#333333',
    hoverShadow: `0 4px 14px ${BRAND_COLORS.twitter.shadow}`,
    icon: TwitterIcon,
    formatUrl: (val) => {
      const handle = val.trim();
      if (handle.startsWith('http://') || handle.startsWith('https://')) return handle;
      return `https://x.com/${handle.replace(/^@/, '')}`;
    },
  },
  x: {
    id: 'x',
    name: 'X',
    brandColor: BRAND_COLORS.x.primary,
    hoverColor: '#FFFFFF',
    hoverBg: BRAND_COLORS.x.gradient,
    hoverBorder: '#333333',
    hoverShadow: `0 4px 14px ${BRAND_COLORS.x.shadow}`,
    icon: TwitterIcon,
    formatUrl: (val) => {
      const handle = val.trim();
      if (handle.startsWith('http://') || handle.startsWith('https://')) return handle;
      return `https://x.com/${handle.replace(/^@/, '')}`;
    },
  },
  snapchat: {
    id: 'snapchat',
    name: 'Snapchat',
    brandColor: BRAND_COLORS.snapchat.primary,
    hoverColor: '#000000',
    hoverBg: BRAND_COLORS.snapchat.gradient,
    hoverBorder: BRAND_COLORS.snapchat.primary,
    hoverShadow: `0 4px 14px ${BRAND_COLORS.snapchat.shadow}`,
    icon: SnapchatIcon,
    formatUrl: (val) => {
      const handle = val.trim();
      if (handle.startsWith('http://') || handle.startsWith('https://')) return handle;
      return `https://snapchat.com/add/${handle.replace(/^@/, '')}`;
    },
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    brandColor: BRAND_COLORS.youtube.primary,
    hoverColor: '#FFFFFF',
    hoverBg: BRAND_COLORS.youtube.gradient,
    hoverBorder: BRAND_COLORS.youtube.primary,
    hoverShadow: `0 4px 14px ${BRAND_COLORS.youtube.shadow}`,
    icon: YouTubeIcon,
    formatUrl: (val) => {
      const handle = val.trim();
      if (handle.startsWith('http://') || handle.startsWith('https://')) return handle;
      return `https://youtube.com/${handle.startsWith('@') ? handle : `@${handle}`}`;
    },
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    brandColor: BRAND_COLORS.linkedin.primary,
    hoverColor: '#FFFFFF',
    hoverBg: BRAND_COLORS.linkedin.gradient,
    hoverBorder: BRAND_COLORS.linkedin.primary,
    hoverShadow: `0 4px 14px ${BRAND_COLORS.linkedin.shadow}`,
    icon: LinkedInIcon,
    formatUrl: (val) => {
      const handle = val.trim();
      if (handle.startsWith('http://') || handle.startsWith('https://')) return handle;
      return `https://linkedin.com/in/${handle.replace(/^@/, '')}`;
    },
  },
  telegram: {
    id: 'telegram',
    name: 'Telegram',
    brandColor: BRAND_COLORS.telegram.primary,
    hoverColor: '#FFFFFF',
    hoverBg: BRAND_COLORS.telegram.gradient,
    hoverBorder: BRAND_COLORS.telegram.primary,
    hoverShadow: `0 4px 14px ${BRAND_COLORS.telegram.shadow}`,
    icon: TelegramIcon,
    formatUrl: (val) => {
      const handle = val.trim();
      if (handle.startsWith('http://') || handle.startsWith('https://')) return handle;
      return `https://t.me/${handle.replace(/^@/, '')}`;
    },
  },
};

/**
 * Resolves a social configuration by platform name, with alias normalization.
 */
export function getSocialConfig(platform: string): SocialPlatformConfig | null {
  if (!platform) return null;
  const key = platform.toLowerCase().trim();
  if (SOCIAL_CONFIG[key]) return SOCIAL_CONFIG[key];
  if (key === 'insta') return SOCIAL_CONFIG.instagram;
  if (key === 'fb') return SOCIAL_CONFIG.facebook;
  if (key === 'tt') return SOCIAL_CONFIG.tiktok;
  if (key === 'wa') return SOCIAL_CONFIG.whatsapp;
  if (key === 'yt') return SOCIAL_CONFIG.youtube;
  return null;
}

/**
 * Global helper to format raw handles / numbers / URLs into complete social URLs
 */
export function formatSocialUrl(platform: string, value?: string | null): string {
  if (!value) return '';
  const config = getSocialConfig(platform);
  return config ? config.formatUrl(value) : value;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. INTERACTIVE SOCIAL LINK BUTTON COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export interface SocialLinkButtonProps {
  platform: string;
  url?: string | null;
  size?: number | string;
  iconSize?: number;
  className?: string;
  defaultBg?: string;
  defaultColor?: string;
  defaultBorder?: string;
  title?: string;
  hoverIconOnly?: boolean;
}

/**
 * Interactive button for social channels.
 * On hover, dynamically reveals the platform's brand colors / signature gradients.
 */
export function SocialLinkButton({
  platform,
  url,
  size = 28,
  iconSize = 13,
  className = '',
  defaultBg,
  defaultColor,
  defaultBorder,
  title,
  hoverIconOnly = false,
}: SocialLinkButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const config = getSocialConfig(platform);

  if (!config || !url) return null;

  const Icon = config.icon;
  const resolvedUrl = config.formatUrl(url);
  const widthStyle = typeof size === 'number' ? `${size}px` : size;
  const heightStyle = typeof size === 'number' ? `${size}px` : size;

  return (
    <a
      href={resolvedUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={title || config.name}
      title={title || config.name}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex items-center justify-center rounded-full transition-all duration-300 shadow-sm hover:scale-110 active:scale-95 ${className}`}
      style={{
        width: widthStyle,
        height: heightStyle,
        background: hoverIconOnly
          ? defaultBg || 'transparent'
          : isHovered
          ? config.hoverBg
          : defaultBg || 'var(--color-surface)',
        color: hoverIconOnly
          ? isHovered
            ? config.brandColor
            : defaultColor || 'var(--color-text-primary)'
          : isHovered
          ? config.hoverColor
          : defaultColor || 'var(--color-text-primary)',
        border: hoverIconOnly
          ? defaultBorder || '1px solid var(--color-border)'
          : isHovered && config.hoverBorder
          ? `1px solid ${config.hoverBorder}`
          : defaultBorder || '1px solid var(--color-border)',
        boxShadow: isHovered ? config.hoverShadow : undefined,
      }}
    >
      <Icon size={iconSize} className="transition-transform duration-300 group-hover:scale-110 flex-shrink-0" />
    </a>
  );
}
