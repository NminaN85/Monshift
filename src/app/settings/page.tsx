"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
const texts: Record<string, any> = {
fr: {
title: "Paramètres",
weekSection: "SEMAINE",
startOfWeek: "Début de semaine",
currency: "Devise",
accountSection: "COMPTE",
myAccount: "Mon compte",
emailReports: "Rapports par email",
info: "Informations",
monday: "Lundi",
sunday: "Dimanche",
saturday: "Samedi",
activeSub: "Inactif",
proUpgrade: "Passez à la version pro !",
back: "Retour",
uid: "UID",
email: "Email",
memberSince: "Membre depuis",
subscription: "Abonnement",
logout: "Se déconnecter",
deleteData: "Supprimer mes données",
deleteConfirm: "Action irréversible - toutes vos données seront effacées",
contactUs: "Nous contacter",
shareApp: "Partager à mes amis",
rateApp: "Donner votre avis",
terms: "Conditions d'utilisation et politique de confidentialité",
proFeature: "Disponible avec l'abonnement Pro",
proDesc: "Recevez chaque semaine ou chaque mois votre récap d'heures et de gains.",
receiveReports: "Recevoir des rapports par email"
},
en: {
title: "Settings",
weekSection: "WEEK",
startOfWeek: "Start of week",
currency: "Currency",
accountSection: "ACCOUNT",
myAccount: "My account",
emailReports: "Email reports",
info: "Information",
monday: "Monday",
sunday: "Sunday",
saturday: "Saturday",
activeSub: "Inactive",
proUpgrade: "Upgrade to Pro version!",
back: "Back",
uid: "UID",
email: "Email",
memberSince: "Member since",
subscription: "Subscription",
logout: "Log out",
deleteData: "Delete my data",
deleteConfirm: "Irreversible action - all your data will be erased",
contactUs: "Contact us",
shareApp: "Share with friends",
rateApp: "Rate our app",
terms: "Terms of use and privacy policy",
proFeature: "Available with Pro subscription",
proDesc: "Receive your weekly or monthly hours and earnings recap.",
receiveReports: "Receive reports by email"
},
ar: {
title: "الإعدادات",
weekSection: "الأسبوع",
startOfWeek: "بداية الأسبوع",
currency: "العملة",
accountSection: "الحساب",
myAccount: "حسابي",
emailReports: "التقارير عبر البريد",
info: "معلومات التطبيق",
monday: "الاثنين",
sunday: "الأحد",
saturday: "السبت",
activeSub: "غير نشط",
proUpgrade: "الترقية إلى النسخة الاحترافية Pro !",
back: "رجوع",
uid: "المعرف (UID)",
email: "البريد الإلكتروني",
memberSince: "عضو منذ",
subscription: "الاشتراك",
logout: "تسجيل الخروج",
deleteData: "حذف بياناتي",
deleteConfirm: "إجراء لا يمكن التراجع عنه - سيتم مسح كافة بياناتك",
contactUs: "اتصل بنا",
shareApp: "مشاركة مع الأصدقاء",
rateApp: "قيم التطبيق",
terms: "شروط الاستخدام وسياسة الخصوصية",
proFeature: "متاحة مع اشتراك Pro",
proDesc: "استلم ملخص ساعاتك وأرباحك أسبوعياً أو شهرياً.",
receiveReports: "تلقي التقارير عبر البريد الإلكتروني"
}
};
export default function App() {
const [lang, setLang] = useState("fr");
const [currency, setCurrency] = useState("€ — EUR");
const [startDay, setStartDay] = useState("Lundi");
const [currentView, setCurrentView] = useState<"main" | "account" | "reports" | "info" | "selectDay">("main");
const [emailReportsEnabled, setEmailReportsEnabled] = useState(false);
useEffect(() => {
const savedLang = localStorage.getItem("monshift_lang");
if (savedLang) setLang(savedLang);
const savedCurr = localStorage.getItem("monshift_currency");
if (savedCurr) setCurrency(savedCurr);
const savedStartDay = localStorage.getItem("monshift_startday");
if (savedStartDay) setStartDay(savedStartDay);
}, []);
const changeLanguage = (newLang: string) => {
setLang(newLang);
localStorage.setItem("monshift_lang", newLang);
};
const handleSelectStartDay = (day: string) => {
setStartDay(day);
localStorage.setItem("monshift_startday", day);
setCurrentView("main");
};
const t = texts[lang] || texts["fr"];
return (
<main style={{ maxWidth: "480px", margin: "0 auto", paddingBottom: "100px", fontFamily: "sans-serif", background: "#f3f4f6", minHeight: "100vh", direction: lang === "ar" ? "rtl" : "ltr" }}>
{currentView === "main" && (
<div>
<header style={{ background: "#1e3a8a", color: "white", padding: "16px", textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>
{t.title}
</header>
<div style={{ padding: "16px" }}>
<div style={{ background: "white", padding: "12px", borderRadius: "12px", marginBottom: "16px", display: "flex", justifyContent: "space-around", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
<button onClick={() => changeLanguage("fr")} style={{ background: lang === "fr" ? "#1e3a8a" : "#e5e7eb", color: lang === "fr" ? "white" : "#374151", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>Français</button>
<button onClick={() => changeLanguage("en")} style={{ background: lang === "en" ? "#1e3a8a" : "#e5e7eb", color: lang === "en" ? "white" : "#374151", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>English</button>
<button onClick={() => changeLanguage("ar")} style={{ background: lang === "ar" ? "#1e3a8a" : "#e5e7eb", color: lang === "ar" ? "white" : "#374151", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>العربية</button>
</div>
<div style={{ fontSize: "12px", color: "#6b7280", fontWeight: "bold", marginBottom: "6px", paddingLeft: "4px" }}>{t.weekSection}</div>
<div style={{ background: "white", borderRadius: "12px", overflow: "hidden", marginBottom: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
<div onClick={() => setCurrentView("selectDay")} style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}>
<span>📅 {t.startOfWeek}</span>
<div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
<span style={{ color: "#6b7280", fontSize: "14px" }}>{startDay}</span>
<span style={{ color: "#9ca3af" }}>{lang === "ar" ? "❮" : "❯"}</span>
</div>
</div>
<div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<span>💰 {t.currency}</span>
<span style={{ color: "#6b7280", fontSize: "14px" }}>{currency}</span>
</div>
</div>
<div style={{ fontSize: "12px", color: "#6b7280", fontWeight: "bold", marginBottom: "6px", paddingLeft: "4px" }}>{t.accountSection}</div>
<div style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
<div onClick={() => setCurrentView("account")} style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}>
<span>👤 {t.myAccount}</span>
<span style={{ color: "#9ca3af" }}>{lang === "ar" ? "❮" : "❯"}</span>
</div>
<div onClick={() => setCurrentView("reports")} style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}>
<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
<span>✉️ {t.emailReports}</span>
<span style={{ background: "#fef3c7", color: "#d97706", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold" }}>👑 PRO</span>
</div>
<span style={{ color: "#9ca3af" }}>{lang === "ar" ? "❮" : "❯"}</span>
</div>
<div onClick={() => setCurrentView("info")} style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
<span>ℹ️ {t.info}</span>
<span style={{ color: "#9ca3af" }}>{lang === "ar" ? "❮" : "❯"}</span>
</div>
</div>
</div>
</div>
)}
{currentView === "selectDay" && (
<div>
<header style={{ background: "#1e3a8a", color: "white", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
<button onClick={() => setCurrentView("main")} style={{ background: "transparent", border: "none", color: "white", fontSize: "18px", cursor: "pointer" }}>{lang === "ar" ? "❯" : "❮"}</button>
<div style={{ fontSize: "18px", fontWeight: "bold" }}>{t.startOfWeek}</div>
</header>
<div style={{ padding: "16px" }}>
<div style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
{["Lundi", "Dimanche", "Samedi"].map((day) => (
<div
key={day}
onClick={() => handleSelectStartDay(day)}
style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f3f4f6", cursor: "pointer", background: startDay === day ? "#eff6ff" : "white" }}
>
<span style={{ fontWeight: startDay === day ? "bold" : "normal", color: startDay === day ? "#1e3a8a" : "#374151" }}>{day}</span>
{startDay === day && <span style={{ color: "#2563eb", fontWeight: "bold" }}>✓</span>}
</div>
))}
</div>
</div>
</div>
)}
{currentView === "account" && (
<div>
<header style={{ background: "#1e3a8a", color: "white", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
<button onClick={() => setCurrentView("main")} style={{ background: "transparent", border: "none", color: "white", fontSize: "18px", cursor: "pointer" }}>{lang === "ar" ? "❯" : "❮"}</button>
<div style={{ fontSize: "18px", fontWeight: "bold" }}>{t.myAccount}</div>
</header>
<div style={{ padding: "16px" }}>
<div style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "16px" }}>
<div style={{ fontSize: "12px", color: "#6b7280" }}>{t.uid}</div>
<div style={{ fontSize: "14px", fontWeight: "bold", color: "#1f2937", marginBottom: "10px", wordBreak: "break-all" }}>usr_9f8273641029384756</div>
<div style={{ fontSize: "12px", color: "#6b7280" }}>{t.email}</div>
<div style={{ fontSize: "14px", fontWeight: "bold", color: "#1f2937", marginBottom: "10px" }}>user@example.com</div>
<div style={{ fontSize: "12px", color: "#6b7280" }}>{t.subscription}</div>
<div style={{ display: "inline-block", background: "#e5e7eb", color: "#374151", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", marginTop: "4px" }}>{t.activeSub}</div>
</div>
</div>
</div>
)}
{currentView === "reports" && (
<div>
<header style={{ background: "#1e3a8a", color: "white", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
<button onClick={() => setCurrentView("main")} style={{ background: "transparent", border: "none", color: "white", fontSize: "18px", cursor: "pointer" }}>{lang === "ar" ? "❯" : "❮"}</button>
<div style={{ fontSize: "18px", fontWeight: "bold" }}>{t.emailReports}</div>
</header>
<div style={{ padding: "16px" }}>
<div style={{ background: "#fef3c7", border: "1px solid #f59e0b", padding: "14px", borderRadius: "12px", marginBottom: "16px" }}>
<div style={{ fontWeight: "bold", color: "#b45309", fontSize: "14px", marginBottom: "4px" }}>👑 {t.proFeature}</div>
<div style={{ fontSize: "13px", color: "#92400e" }}>{t.proDesc}</div>
</div>
</div>
</div>
)}
{currentView === "info" && (
<div>
<header style={{ background: "#1e3a8a", color: "white", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
<button onClick={() => setCurrentView("main")} style={{ background: "transparent", border: "none", color: "white", fontSize: "18px", cursor: "pointer" }}>{lang === "ar" ? "❯" : "❮"}</button>
<div style={{ fontSize: "18px", fontWeight: "bold" }}>{t.info}</div>
</header>
<div style={{ padding: "16px", textAlign: "center" }}>
<div style={{ width: "60px", height: "60px", background: "#e5e7eb", borderRadius: "50%", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🕒</div>
<div style={{ fontWeight: "bold", fontSize: "16px", color: "#1f2937" }}>MonShift</div>
<div style={{ fontSize: "12px", color: "#6b7280" }}>v3.09</div>
</div>
</div>
)}
<BottomNav active="settings" />
</main>
);
}
