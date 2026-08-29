"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [lang, setLang] = useState("fr");

  useEffect(() => {
    const savedLang = localStorage.getItem("monshift_lang");
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  const changeLanguage = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem("monshift_lang", newLang);
    window.location.reload(); // إعادة تحميل الصفحة لتطبيق اللغات فوراً
  };

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", padding: "16px", fontFamily: "sans-serif", paddingBottom: "90px", background: "#f3f4f6", minHeight: "100vh" }}>
      <header style={{ background: "#1e3a8a", color: "white", padding: "16px", borderRadius: "12px", textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "18px", margin: 0 }}>⚙️ الإعدادات (Paramètres)</h1>
      </header>

      <div style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <h3 style={{ fontSize: "15px", color: "#374151", marginBottom: "10px" }}>🌐 لغة التطبيق / Langue</h3>
        <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "15px" }}>اختر اللغة المفضلة لديك:</p>
        
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={() => changeLanguage("fr")} 
            style={{ flex: 1, padding: "12px", background: lang === "fr" ? "#1e3a8a" : "#f3f4f6", color: lang === "fr" ? "white" : "#374151", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
            Français
          </button>
          <button 
            onClick={() => changeLanguage("en")} 
            style={{ flex: 1, padding: "12px", background: lang === "en" ? "#1e3a8a" : "#f3f4f6", color: lang === "en" ? "white" : "#374151", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
            English
          </button><button 
            onClick={() => changeLanguage("ar")} 
            style={{ flex: 1, padding: "12px", background: lang === "ar" ? "#1e3a8a" : "#f3f4f6", color: lang === "ar" ? "white" : "#374151", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
            العربية
          </button>
        </div>
      </div>

      {/* شريط التنقل السفلي المحدث ليشمل صفحة الإعدادات */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#1e3a8a", borderTop: "1px solid #172554", display: "flex", justifyContent: "space-around", padding: "12px 0", boxShadow: "0 -2px 5px rgba(0,0,0,0.1)" }}>
        <a href="/" style={{ textDecoration: "none", color: "#93c5fd", fontSize: "13px" }}>🕒 الساعات</a>
        <a href="/jobs" style={{ textDecoration: "none", color: "#93c5fd", fontSize: "13px" }}>🏢 الأماكن</a>
        <a href="/calendar" style={{ textDecoration: "none", color: "#93c5fd", fontSize: "13px" }}>📅 التقويم</a>
        <a href="/settings" style={{ textDecoration: "none", color: "#34d399", fontSize: "13px", fontWeight: "bold" }}>⚙️ الإعدادات</a>
      </nav>
    </main>
  );
}
