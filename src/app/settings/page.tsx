"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

const texts: Record<string, any> = {
  fr: { title: "Paramètres", langTitle: "Langue de l'application", desc: "Choisissez votre langue préférée :" },
  en: { title: "Settings", langTitle: "App Language", desc: "Choose your preferred language:" },
  ar: { title: "الإعدادات", langTitle: "لغة التطبيق", desc: "اختر لغتك المفضلة:" }
};

export default function SettingsPage() {
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

  const changeLanguage = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem("monshift_lang", newLang);
    window.location.reload();
  };

  const t = texts[lang] || texts["fr"];

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", padding: "16px", fontFamily: "sans-serif", paddingBottom: "90px", background: "#f3f4f6", minHeight: "100vh", direction: lang === "ar" ? "rtl" : "ltr" }}>
      <header style={{ background: "#1e3a8a", color: "white", padding: "16px", borderRadius: "12px", textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "18px", margin: 0 }}>⚙️ {t.title}</h1>
      </header>

      <div style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <h3 style={{ fontSize: "15px", color: "#374151", marginBottom: "10px" }}>🌐 {t.langTitle}</h3>
        <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "15px" }}>{t.desc}</p>
        
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => changeLanguage("fr")} style={{ flex: 1, padding: "12px", background: lang === "fr" ? "#1e3a8a" : "#f3f4f6", color: lang === "fr" ? "white" : "#374151", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>Français</button>
          <button onClick={() => changeLanguage("en")} style={{ flex: 1, padding: "12px", background: lang === "en" ? "#1e3a8a" : "#f3f4f6", color: lang === "en" ? "white" : "#374151", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>English</button>
          <button onClick={() => changeLanguage("ar")} style={{ flex: 1, padding: "12px", background: lang === "ar" ? "#1e3a8a" : "#f3f4f6", color: lang === "ar" ? "white" : "#374151", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>العربية</button>
        </div>
      </div>

      <BottomNav active="settings" />
    </main>
  );
}
