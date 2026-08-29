"use client";

import { useState, useEffect } from "react";

// تعريف النصوص مع تصحيح بعض الأخطاء الإملائية في النصوص الفرنسية والإنجليزية
const navTexts: Record<string, { hours: string; jobs: string; calendar: string; settings: string; stats: string}> = {
  fr: { hours: "Heures", jobs: "Emplois", calendar: "Calendrier", settings: "Paramètres" , stats: "Statistiques"},
  en: { hours: "Hours", jobs: "Jobs", calendar: "Calendar", settings: "Settings", stats: "Statistics" },
  ar: { hours: "الساعات", jobs: "الوظائف", calendar: "التقويم", settings: "الإعدادات" , stats: "الإحصائيات"},
};

// تعريف نوع الأيقونات لاستخدامها في المكونات
type IconProps = { active: boolean };

// أيقونة الساعة (الساعات) - SVG
const IconHours = ({ active }: IconProps) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? "#34d399" : "#93c5fd"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "6px" }}>
    <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

// أيقونة المبنى (الوظائف) - SVG
const IconJobs = ({ active }: IconProps) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? "#34d399" : "#93c5fd"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "6px" }}>
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="10" x2="15" y2="10"></line><line x1="9" y1="14" x2="15" y2="14"></line><line x1="9" y1="18" x2="15" y2="18"></line>
  </svg>
);

// أيقونة التقويم (التقويم) - SVG
const IconCalendar = ({ active }: IconProps) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? "#34d399" : "#93c5fd"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "6px" }}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

// أيقونة الإحصائيات (المبيانات) - SVG
const IconStats = ({ active }: IconProps) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? "#34d399" : "#93c5fd"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "6px" }}>
    <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

// أيقونة الإعدادات (الترس) - SVG
const IconSettings = ({ active }: IconProps) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? "#34d399" : "#93c5fd"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "6px" }}>
    <circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1 1.51H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);


export default function BottomNav({ active }: { active: "hours" | "jobs" | "calendar" | "settings" | "stats" }) {
  const [lang, setLang] = useState("fr");

  useEffect(() => {
    const saved = localStorage.getItem("monshift_lang");
    if (saved) {
      setLang(saved);
    } else {
      const deviceLang = navigator.language.startsWith("ar") ? "ar" : navigator.language.startsWith("en") ? "en" : "fr";
      setLang(deviceLang);
    }
  }, []);

  const t = navTexts[lang] || navTexts["fr"];

  // النمط الأساسي لرابط التنقل
  const linkStyle: React.CSSProperties = {
    textDecoration: "none",
    fontSize: "14px", // حجم خط واضح ومقروء
    textAlign: "center",
    display: "flex",
    flexDirection: "column", // جعل الأيقونة فوق النص
    alignItems: "center",
    justifyContent: "center",
    width: "20%", // توزيع العناصر الخمسة بالتساوي
    padding: "4px 0"
  };

  // دالة لتحديد اللون بناءً على الحالة النشطة
  const getColor = (item: string) => active === item ? "#34d399" : "#93c5fd";

  return (
    <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#1e3a8a", // اللون الأزرق الداكن
        borderTop: "1px solid #172554",
        display: "flex", justifyContent: "space-around",
        padding: "10px 0", // زيادة الـ padding لجعل الشريط أطول وأكثر راحة
        boxShadow: "0 -2px 5px rgba(0,0,0,0.1)", zIndex: 1000,
        maxWidth: "480px", margin: "0 auto" // لضبط العرض على الشاشات الكبيرة
    }}>
      <a href="/" style={{ ...linkStyle, color: getColor("hours"), fontWeight: active === "hours" ? "bold" : "normal" }}>
        <IconHours active={active === "hours"} /> {t.hours}
      </a>
      <a href="/jobs" style={{ ...linkStyle, color: getColor("jobs"), fontWeight: active === "jobs" ? "bold" : "normal" }}>
        <IconJobs active={active === "jobs"} /> {t.jobs}
      </a>
      <a href="/calendar" style={{ ...linkStyle, color: getColor("calendar"), fontWeight: active === "calendar" ? "bold" : "normal" }}>
        <IconCalendar active={active === "calendar"} /> {t.calendar}
      </a>
      <a href="/stats" style={{ ...linkStyle, color: getColor("stats"), fontWeight: active === "stats" ? "bold" : "normal" }}>
        <IconStats active={active === "stats"} /> {t.stats}
      </a>
      <a href="/settings" style={{ ...linkStyle, color: getColor("settings"), fontWeight: active === "settings" ? "bold" : "normal" }}>
        <IconSettings active={active === "settings"} /> {t.settings}
      </a>
    </nav>
  );
}
