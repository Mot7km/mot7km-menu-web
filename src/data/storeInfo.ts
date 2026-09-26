/**
 * Store Information — Single source of truth
 * 
 * This file holds all store-related info (phone, address, hours, socials)
 * and exports a helper to determine if the store is currently open.
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
  businessDescription: any;
  name: string;
  nameAr: string;
  phone: string;
  email?: string;
  address: string;
  addressAr: string;
  mapUrl?: string;
  workingHours: WorkingHours[];
  socials: SocialLink[];
}

// ─────────────────────────────────────────────────────────────────────
// STORE DATA  (replace placeholder values with real data)
// ─────────────────────────────────────────────────────────────────────
export const storeInfo: StoreInfo = {
  name: 'The Gourmet Kitchen',
  nameAr: 'مطبخ الذواقة',
  phone: '+201234567890',
  email: 'info@gourmetkitchen.com',
  address: '123 El-Tahrir St, Downtown, Cairo',
  addressAr: '١٢٣ شارع التحرير، وسط البلد، القاهرة',
  mapUrl: 'https://maps.google.com/?q=30.0444,31.2357',
  workingHours: [
    // Sunday – Thursday: 10:00 AM to 12:00 AM (midnight)
    { day: 0, open: '10:00', close: '00:00' },
    { day: 1, open: '10:00', close: '00:00' },
    { day: 2, open: '10:00', close: '00:00' },
    { day: 3, open: '10:00', close: '00:00' },
    { day: 4, open: '10:00', close: '00:00' },
    // Friday – Saturday: 12:00 PM to 02:00 AM
    { day: 5, open: '12:00', close: '02:00' },
    { day: 6, open: '12:00', close: '02:00' },
  ],
  socials: [
    { platform: 'whatsapp', url: 'https://wa.me/201234567890' },
    { platform: 'instagram', url: 'https://instagram.com/gourmetkitchen' },
    { platform: 'facebook', url: 'https://facebook.com/gourmetkitchen' },
    { platform: 'tiktok', url: 'https://tiktok.com/@gourmetkitchen' },
  ],
  businessDescription: undefined
};

// ─────────────────────────────────────────────────────────────────────
// OPEN / CLOSED LOGIC
// ─────────────────────────────────────────────────────────────────────

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Checks whether the store is currently open.
 * Handles overnight hours (e.g. open 12:00, close 02:00).
 */
export function isStoreOpen(info: StoreInfo = storeInfo): boolean {
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
      // After opening today?
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
 * Returns the formatted working hours for today.
 */
export function getTodayHours(info: StoreInfo = storeInfo): { open: string; close: string } | null {
  const today = new Date().getDay();
  const schedule = info.workingHours.find((wh) => wh.day === today);
  if (!schedule) return null;
  return { open: schedule.open, close: schedule.close };
}
