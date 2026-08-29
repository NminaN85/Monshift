"use client";

import { useState, useEffect } from "react";

const navTexts: Record<string, { hours: string; jobs: string; calendar: string; settings: string }> = {
  fr: { hours: "Heures", jobs: "Emplois", calendar: "Calendrier", settings: "Paramètres" },
  en: { hours: "Hours", jobs: "Jobs", calendar: "Calendar", settings: "Settings" },
  ar: { hours: "الساعات", jobs: "الأماكن", calendar: "التقويم", settings: "الإعدادات" },
};

export default function BottomNav({ active }: { active: "hours" | "jobs" | "calendar" | "settings" }) {
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

  return (
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#1e3a8a", borderTop: "1px solid #172554", display: "flex", justifyContent: "space-around", padding: "12px 0", boxShadow: "0 -2px 5px rgba(0,0,0,0.1)", zIndex: 1000, maxWidth: "480px", margin: "0 auto" }}>
      <a href="/" style={{ textDecoration: "none", color: active === "hours" ? "#34d399" : "#93c5fd", fontSize: "12px", textAlign: "center", fontWeight: active === "hours" ? "bold" : "normal" }}>🕒 {t.hours}</a>
      <a href="/jobs" style={{ textDecoration: "none", color: active === "jobs" ? "#34d399" : "#93c5fd", fontSize: "12px", textAlign: "center", fontWeight: active === "jobs" ? "bold" : "normal" }}>🏢 {t.jobs}</a>
      <a href="/calendar" style={{ textDecoration: "none", color: active === "calendar" ? "#34d399" : "#93c5fd", fontSize: "12px", textAlign: "center", fontWeight: active === "calendar" ? "bold" : "normal" }}>📅 {t.calendar}</a>
      <a href="/stats" style={{ textDecoration: "none", color: active === "stats" ? "#34d399" : "#93c5fd", fontSize: "12px", textAlign: "center", fontWeight: active === "stats" ? "bold" : "normal" }}>📊 {t.stats}</a>
      <a href="/settings" style={{ textDecoration: "none", color: active === "settings" ? "#34d399" : "#93c5fd", fontSize: "12px", textAlign: "center", fontWeight: active === "settings" ? "bold" : "normal" }}>⚙️ {t.settings}</a>
    </nav>
  );
}
