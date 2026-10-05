export interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: string;           // e.g. "399", "1,279", or "Custom"
  priceNote: string;
  popular: boolean;
  color: string;           // Tailwind bg-gradient classes
  border: string;          // Tailwind border classes
  glow: string;            // Tailwind shadow classes
  features: string[];
  missing: string[];
}

export interface ComparisonFeature {
  name: string;
  starter: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

export interface FeatureCategory {
  category: string;
  items: ComparisonFeature[];
}

export const getPricingPlans = (t: (key: string) => string): PricingPlan[] => [
  {
    id: "starter",
    name: t("p1.name"),
    subtitle: t("p1.sub"),
    description: t("p1.desc"),
    price: "399",
    priceNote: t("plan.month"),
    popular: false,
    color: "bg-slate-50/90 dark:bg-[#0c1626] border border-slate-200 dark:border-white/15",
    border: "border-slate-200 dark:border-white/15",
    glow: "shadow-lg hover:shadow-xl dark:shadow-2xl",
    features: [t("p1.f1"), t("p1.f2"), t("p1.f3"), t("p1.f4"), t("p1.f5")],
    missing: [t("p1.m1"), t("p1.m2")],
  },
  {
    id: "pro",
    name: t("p3.name"),
    subtitle: t("p3.sub"),
    description: t("p3.desc"),
    price: "1,279",
    priceNote: t("plan.month"),
    popular: true,
    color: "bg-white dark:bg-[#091526] border-2 border-primary dark:border-primary/70",
    border: "border-primary",
    glow: "shadow-xl shadow-primary/20 dark:shadow-[0_0_50px_rgba(22,131,199,0.3)]",
    features: [t("p3.f1"), t("p3.f2"), t("p3.f3"), t("p3.f4"), t("p3.f5"), t("p3.f6")],
    missing: [t("p3.m1")],
  },
  {
    id: "enterprise",
    name: t("p5.name"),
    subtitle: t("p5.sub"),
    description: t("p5.desc"),
    price: "Custom",
    priceNote: t("plan.custom"),
    popular: false,
    color: "bg-slate-50/90 dark:bg-[#0c1626] border border-slate-200 dark:border-white/15",
    border: "border-slate-200 dark:border-white/15",
    glow: "shadow-lg hover:shadow-xl dark:shadow-2xl",
    features: [t("p5.f1"), t("p5.f2"), t("p5.f3"), t("p5.f4"), t("p5.f5")],
    missing: [],
  },
];

export const getComparisonCategories = (isRtl: boolean): FeatureCategory[] => [
  {
    category: isRtl ? "🛒 عمليات الكاشير والـ POS" : "🛒 POS Operations",
    items: [
      {
        name: isRtl ? "شاشات نقاط البيع (POS Terminals)" : "POS Terminals",
        starter: isRtl ? "1 جهاز" : "1 Terminal",
        pro: isRtl ? "حتى 5 أجهزة" : "Up to 5 Terminals",
        enterprise: isRtl ? "غير محدود" : "Unlimited",
      },
      {
        name: isRtl ? "العمل بدون إنترنت (100% Offline-First)" : "Offline POS Resilience",
        starter: true,
        pro: true,
        enterprise: true,
      },
      {
        name: isRtl ? "فصل الطاولات وتجزئة الفاتورة (Split Bills)" : "Split Billing & Table Split",
        starter: true,
        pro: true,
        enterprise: true,
      },
      {
        name: isRtl ? "شاشة المطبخ الذكية (KDS Integration)" : "Kitchen Display System (KDS)",
        starter: false,
        pro: true,
        enterprise: true,
      },
    ],
  },
  {
    category: isRtl ? "📦 المخزون وتكاليف الوصفات" : "📦 Inventory & Recipe Costing",
    items: [
      {
        name: isRtl ? "خصم المكونات الحقيقي والتلقائي" : "Real-time Ingredient Deduction",
        starter: true,
        pro: true,
        enterprise: true,
      },
      {
        name: isRtl ? "إدارة الموردين وأوامر الشراء" : "Supplier & Purchase Orders",
        starter: false,
        pro: true,
        enterprise: true,
      },
      {
        name: isRtl ? "حساب هدر الطعام وتكلفة الوجبة" : "Food Waste & Recipe Costing",
        starter: false,
        pro: true,
        enterprise: true,
      },
      {
        name: isRtl ? "ربط فروع متعددة وتمرير المخزون" : "Multi-branch Inventory Sync",
        starter: false,
        pro: false,
        enterprise: true,
      },
    ],
  },
  {
    category: isRtl ? "📱 المنيو الذكي والطلبات" : "📱 Digital QR & Delivery",
    items: [
      {
        name: isRtl ? "المنيو الإلكتروني التفاعلي (QR Menu)" : "QR Table Menu",
        starter: true,
        pro: true,
        enterprise: true,
      },
      {
        name: isRtl ? "الطلب والدفع المباشر من الطاولة" : "Table Order & Pay",
        starter: false,
        pro: true,
        enterprise: true,
      },
      {
        name: isRtl ? "الربط مع تطبيقات التوصيل (Delivery Sync)" : "Delivery Apps Integration",
        starter: false,
        pro: true,
        enterprise: true,
      },
    ],
  },
  {
    category: isRtl ? "📊 الفوترة الإلكترونية والتقارير" : "📊 Tax Invoicing & Analytics",
    items: [
      {
        name: isRtl ? "الفوترة الإلكترونية (الجهة الزكوية - ZATCA)" : "ZATCA E-Invoicing",
        starter: true,
        pro: true,
        enterprise: true,
      },
      {
        name: isRtl ? "تقارير المبيعات الحية الذكية" : "Real-time Sales Reports",
        starter: isRtl ? "أساسية" : "Basic",
        pro: isRtl ? "متقدمة" : "Advanced",
        enterprise: isRtl ? "مخصصة + AI" : "Custom + AI",
      },
      {
        name: isRtl ? "وصول وتصدير البيانات عبر الـ API" : "REST API Access & Webhooks",
        starter: false,
        pro: false,
        enterprise: true,
      },
    ],
  },
  {
    category: isRtl ? "🛡️ الدعم الفني والأمان" : "🛡️ Support & Uptime",
    items: [
      {
        name: isRtl ? "استجابة الدعم الفني" : "Support Response Uptime",
        starter: isRtl ? "خلال 24 ساعة" : "Within 24h",
        pro: isRtl ? "خلال 1 ساعة" : "Within 1h",
        enterprise: isRtl ? "مدير حساب مخصص 24/7" : "Dedicated 24/7 Account Manager",
      },
      {
        name: isRtl ? "النسخ الاحتياطي التلقائي" : "Automated Cloud Backups",
        starter: isRtl ? "يومي" : "Daily",
        pro: isRtl ? "لحظي 24/7" : "Realtime 24/7",
        enterprise: isRtl ? "لحظي + مشفر" : "Realtime + Encrypted",
      },
      {
        name: isRtl ? "اتفاقية مستوى الخدمة (SLA Uptime)" : "SLA Uptime Guarantee",
        starter: "99.5%",
        pro: "99.9%",
        enterprise: "99.99%",
      },
    ],
  },
];
