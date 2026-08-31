"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

const texts = {
  fr: {
    title: "Politique de Confidentialité",
    lastUpdated: "Dernière mise à jour : 2026",
    intro: "MonShift accorde une grande importance à la protection de vos données personnelles. Cette politique de confidentialité explique quelles informations nous collectons et comment nous les utilisons.",
    section1Title: "1. Collecte des informations",
    section1Text: "MonShift stocke principalement vos données (comme vos horaires de travail et vos paramètres) localement sur votre appareil (LocalStorage). Si vous créez un compte ou utilisez la version connectée, nous pouvons collecter votre nom et votre adresse email uniquement pour assurer le bon funcionamiento du service.",
    section2Title: "2. Utilisation des données",
    section2Text: "Les données que vous saisissez sont utilisées exclusivement pour calculer vos heures de travail, vos pauses et vos salaires. Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers.",
    section3Title: "3. Publicité (Google AdMob)",
    section3Text: "Notre application intègre des services publicitaires fournis par Google AdMob. AdMob peut utiliser des identifiants publicitaires pour diffuser des annonces pertinentes. Vous pouvez en savoir plus sur la gestion des données publicitaires de Google en visitant leurs règles de confidentialité.",
    section4Title: "4. Sécurité",
    section4Text: "Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations contre tout accès non autorisé ou modification.",
    section5Title: "5. Contact",
    section5Text: "Si vous avez des questions concernant cette politique de confidentialité, vous pouvez nous contacter via les paramètres de l'application."
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: 2026",
    intro: "MonShift values your privacy. This Privacy Policy explains what information we collect and how we use it.",
    section1Title: "1. Information Collection",
    section1Text: "MonShift primarily stores your data (such as your work hours and settings) locally on your device (LocalStorage). If you create an account, we may collect your name and email address solely to provide and improve the service.",
    section2Title: "2. Use of Information",
    section2Text: "The data you input is used exclusively to calculate your work hours, breaks, and earnings. We do not sell, trade, or rent your personal information to third parties.",
    section3Title: "3. Advertising (Google AdMob)",
    section3Text: "Our app integrates advertising services provided by Google AdMob. AdMob may use advertising identifiers to serve relevant ads. You can learn more about how Google handles ad data by visiting their privacy policy.",
    section4Title: "4. Security",
    section4Text: "We implement appropriate security measures to protect your information against unauthorized access or alteration.",
    section5Title: "5. Contact Us",
    section5Text: "If you have any questions regarding this Privacy Policy, please contact us through the app settings."
  },
  ar: {
    title: "سياسة الخصوصية",
    lastUpdated: "آخر تحديث: 2026",
    intro: "يولي تطبيق MonShift اهتماماً بالغاً لحماية خصوصية بياناتك الشخصية. توضح سياسة الخصوصية هذه المعلومات التي نجمعها وكيفية استخدامها.",
    section1Title: "1. جمع المعلومات",
    section1Text: "يقوم تطبيق MonShift بتخزين بياناتك الأساسية (مثل ساعات العمل والإعدادات) محلياً على جهازك. إذا قمت بإنشاء حساب شخصي، فقد نجمع اسمك وبريدك الإلكتروني حصرياً لتقديم وتحسين الخدمة لك.",
    section2Title: "2. استخدام البيانات",
    section2Text: "تُستخدم البيانات التي تدخلها حصرياً لحساب ساعات عملك، الاستراحات، والأجور المتوقعة. نحن لا نبيع أو نتاجر أو نشارك معلوماتك الشخصية مع أي أطراف ثالثة.",
    section3Title: "3. الإعلانات (Google AdMob)",
    section3Text: "يستخدم تطبيقنا خدمات الإعلانات المقدمة من Google AdMob. قد تستخدم شبكة أدموب معرفات الإعلانات لعرض إعلانات ذات صلة. يمكنك معرفة المزيد حول كيفية تعامل جوجل مع بيانات الإعلانات من خلال سياسة خصوصية جوجل.",
    section4Title: "4. الأمان",
    section4Text: "نحن نطبق تدابير أمنية مناسبة لحماية معلوماتك من الوصول غير autorizado أو التغيير أو الإفصاح.",
    section5Title: "5. الاتصال بنا",
    section5Text: "إذا كان لديك أي استفسارات بخصوص سياسة الخصوصية هذه، يمكنك التواصل معنا من خلال صفحة الإعدادات في التطبيق."
  }
};

export default function PrivacyPage() {
  const [lang, setLang] = useState("fr");

  useEffect(() => {
    const savedLang = localStorage.getItem("monshift_lang");
    if (savedLang) setLang(savedLang);
  }, []);

  const t = texts[lang] || texts["fr"];

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", paddingBottom: "100px", fontFamily: "sans-serif", background: "#f3f4f6", minHeight: "100vh", direction: lang === "ar" ? "rtl" : "ltr" }}>
      
      <header style={{ background: "#1e3a8a", color: "white", padding: "16px", textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>
        {t.title}
      </header>

      <div style={{ padding: "16px" }}>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", lineHeight: "1.6", color: "#374151" }}>
          
          <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "12px" }}>{t.lastUpdated}</div>
          <p style={{ fontSize: "14px", marginBottom: "16px" }}>{t.intro}</p>

          <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "6px" }}>{t.section1Title}</h3>
          <p style={{ fontSize: "13px", marginBottom: "14px" }}>{t.section1Text}</p>

          <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "6px" }}>{t.section2Title}</h3>
          <p style={{ fontSize: "13px", marginBottom: "14px" }}>{t.section2Text}</p>

          <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "6px" }}>{t.section3Title}</h3>
          <p style={{ fontSize: "13px", marginBottom: "14px" }}>{t.section3Text}</p>

          <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "6px" }}>{t.section4Title}</h3>
          <p style={{ fontSize: "13px", marginBottom: "14px" }}>{t.section4Text}</p>

          <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "6px" }}>{t.section5Title}</h3>
          <p style={{ fontSize: "13px" }}>{t.section5Text}</p>

        </div>
      </div>

      <BottomNav active="settings" />
    </main>
  );
}