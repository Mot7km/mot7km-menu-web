/**
 * Store Information Types and Utilities
 * 
 * Defines the contract for store hours, socials, and contact information,
 * and provides open/closed calculations based on real API-supplied data.
 */

export interface WorkingHours {
  /** 0 = Sunday, 1 = Monday, ... 6 = Saturday */
  day: number;
  open: string;   // "HH:mm" (24h)
  close: string;  // "HH:mm" (24h)
}

export interface SocialLink {
  platform: 'whatsapp' | 'instagram' | 'facebook' | 'tiktok' | 'twitter' | 'snapchat';
  url: string;
}

export interface StoreInfo {
  name: string;
  nameAr: string;
  phone: string;
  email?: string;
  address: string;
  addressAr: string;
  mapUrl?: string;
  workingHours: WorkingHours[];
  socials: SocialLink[];
  businessDescription?: string | null;
}

// ─────────────────────────────────────────────────────────────────────
// OPEN / CLOSED LOGIC (Operates dynamically on API store data)
// ─────────────────────────────────────────────────────────────────────

function timeToMinutes(time: string): number {
  if (!time || typeof time !== 'string' || !time.includes(':')) return 0;
  const [h, m] = time.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return 0;
  return h * 60 + m;
}

/**
 * Checks whether the store is currently open based on API-supplied working hours.
 * Handles overnight hours (e.g. open 12:00, close 02:00).
 */
export function isStoreOpen(info?: StoreInfo | null): boolean {
  if (!info || !info.workingHours || info.workingHours.length === 0) {
    return true; // Default to open if no hours specified
  }

  const now = new Date();
  const currentDay = now.getDay();          // 0-6
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Check today's schedule
  const todaySchedule = info.workingHours.find((wh) => wh.day === currentDay);

  if (todaySchedule) {
    const openMin = timeToMinutes(todaySchedule.open);
    const closeMin = timeToMinutes(todaySchedule.close);

    // Normal hours (open < close):  e.g. 10:00 – 23:00
    if (openMin < closeMin) {
      if (currentMinutes >= openMin && currentMinutes < closeMin) return true;
    }
    // Overnight hours (open > close): e.g. 12:00 – 02:00
    else if (openMin > closeMin) {
      if (currentMinutes >= openMin) return true;
    }
    // open === close → 24-hour operation
    else {
      return true;
    }
  }

  // Check if yesterday's overnight shift spills into today
  const yesterday = (currentDay + 6) % 7;
  const yesterdaySchedule = info.workingHours.find((wh) => wh.day === yesterday);
  if (yesterdaySchedule) {
    const openMin = timeToMinutes(yesterdaySchedule.open);
    const closeMin = timeToMinutes(yesterdaySchedule.close);
    // Overnight: open > close AND current time < close
    if (openMin > closeMin && currentMinutes < closeMin) {
      return true;
    }
  }

  return false;
}

/**
 * Returns the formatted working hours for today from API store data.
 */
export function getTodayHours(info?: StoreInfo | null): { open: string; close: string } | null {
  if (!info || !info.workingHours || info.workingHours.length === 0) return null;
  const today = new Date().getDay();
  const schedule = info.workingHours.find((wh) => wh.day === today);
  if (!schedule) return null;
  return { open: schedule.open, close: schedule.close };
}
