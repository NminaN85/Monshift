"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

const texts = {
  fr: {
    title: "Politique de Confidentialité",
    lastUpdated: "Dernière mise à jour : 2 septembre 2026",
    intro:
      "MonShift respecte votre vie privée. Cette politique explique quelles données sont utilisées par l'application, où elles sont stockées et comment elles sont protégées.",

    section1Title: "1. Données utilisées",
    section1Text:
      "MonShift vous permet d'enregistrer des informations telles que vos horaires de travail, vos pauses, vos emplois, vos paramètres et, si vous le souhaitez, votre prénom, votre nom et votre adresse e-mail. Ces informations sont utilisées uniquement pour fournir les fonctionnalités de l'application.",

    section2Title: "2. Stockage des données",
    section2Text:
      "Les données saisies dans MonShift sont actuellement stockées localement sur votre appareil, notamment dans le stockage local du navigateur (LocalStorage). Dans cette version, MonShift ne dispose pas d'un système de compte en ligne et ne transmet pas ces données à nos serveurs.",

    section3Title: "3. Utilisation des données",
    section3Text:
      "Les données enregistrées dans l'application sont utilisées pour calculer vos heures travaillées, vos pauses, vos heures supplémentaires et vos revenus estimés, ainsi que pour afficher votre historique et vos statistiques. Nous ne vendons, ne louons et ne partageons pas vos données personnelles à des fins commerciales.",

    section4Title: "4. Publicité et services tiers",
    section4Text:
      "La version actuelle de MonShift ne contient pas de publicité et n'utilise pas Google AdMob. Si des services publicitaires ou d'autres services tiers sont ajoutés dans une future version, cette politique de confidentialité sera mise à jour afin de décrire leur utilisation.",

    section5Title: "5. Suppression des données",
    section5Text:
      "Comme les données sont stockées localement sur votre appareil, vous pouvez les supprimer en effaçant les données de l'application ou les données de stockage du navigateur utilisées par MonShift. La suppression de l'application peut également supprimer les données locales qui y sont associées.",

    section6Title: "6. Sécurité",
    section6Text:
      "Nous prenons des mesures raisonnables pour protéger l'application et limiter les risques liés à l'utilisation de vos données. Cependant, aucun système de stockage électronique ne peut être garanti comme étant totalement sécurisé.",

    section7Title: "7. Modifications de cette politique",
    section7Text:
      "Cette politique de confidentialité peut être mise à jour lorsque les fonctionnalités de MonShift évoluent. Toute modification importante sera indiquée par une nouvelle date de mise à jour.",

    section8Title: "8. Contact",
    section8Text:
      "Pour toute question concernant cette politique de confidentialité ou le traitement de vos données, vous pouvez nous contacter à l'adresse suivante :",
    email: "twinapps.support@gmail.com",
  },

  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: September 2, 2026",
    intro:
      "MonShift respects your privacy. This policy explains what data is used by the app, where it is stored, and how it is handled.",

    section1Title: "1. Data Used",
    section1Text:
      "MonShift allows you to enter information such as your work hours, breaks, jobs, settings and, if you choose, your first name, last name and email address. This information is used only to provide the app's features.",

    section2Title: "2. Data Storage",
    section2Text:
      "Data entered into MonShift is currently stored locally on your device, including through the browser's local storage (LocalStorage). In this version, MonShift does not provide an online account system and does not transmit this data to our servers.",

    section3Title: "3. Use of Data",
    section3Text:
      "Information stored in the app is used to calculate your worked hours, breaks, overtime and estimated earnings, and to display your history and statistics. We do not sell, rent or share your personal data for commercial purposes.",

    section4Title: "4. Advertising and Third-Party Services",
    section4Text:
      "The current version of MonShift does not contain advertising and does not use Google AdMob. If advertising or other third-party services are added in a future version, this Privacy Policy will be updated to explain how they are used.",

    section5Title: "5. Data Deletion",
    section5Text:
      "Because your data is stored locally on your device, you can delete it by clearing the app's data or the browser storage used by MonShift. Uninstalling the app may also remove locally stored data associated with it.",

    section6Title: "6. Security",
    section6Text:
      "We take reasonable measures to protect the application and reduce risks related to the use of your data. However, no electronic storage system can be guaranteed to be completely secure.",

    section7Title: "7. Changes to This Policy",
    section7Text:
      "This Privacy Policy may be updated as MonShift's features evolve. Important changes will be reflected by a new update date.",

    section8Title: "8. Contact Us",
    section8Text:
      "If you have any questions about this Privacy Policy or how your data is handled, you can contact us at:",
    email: "twinapps.support@gmail.com",
  },

  ar: {
    title: "سياسة الخصوصية",
    lastUpdated: "آخر تحديث: 2 سبتمبر 2026",
    intro:
      "يحترم تطبيق MonShift خصوصيتك. توضح سياسة الخصوصية هذه البيانات التي يستخدمها التطبيق، ومكان تخزينها، وكيفية التعامل معها.",

    section1Title: "1. البيانات المستخدمة",
    section1Text:
      "يتيح لك MonShift إدخال معلومات مثل ساعات العمل، والاستراحات، وأماكن العمل، والإعدادات، وكذلك اسمك الأول واسم العائلة وعنوان بريدك الإلكتروني إذا اخترت إدخالها. تُستخدم هذه المعلومات فقط لتوفير وظائف التطبيق.",

    section2Title: "2. تخزين البيانات",
    section2Text:
      "يتم حاليًا تخزين البيانات التي تدخلها في MonShift محليًا على جهازك، بما في ذلك باستخدام التخزين المحلي للمتصفح (LocalStorage). في هذه النسخة، لا يحتوي MonShift على نظام حسابات Online ولا يتم إرسال هذه البيانات إلى خوادمنا.",

    section3Title: "3. استخدام البيانات",
    section3Text:
      "تُستخدم البيانات المحفوظة في التطبيق لحساب ساعات العمل، والاستراحات، والساعات الإضافية، والأجور التقديرية، وكذلك لعرض السجل والإحصائيات. نحن لا نبيع أو نؤجر أو نشارك بياناتك الشخصية لأغراض تجارية.",

    section4Title: "4. الإعلانات وخدمات الجهات الخارجية",
    section4Text:
      "النسخة الحالية من MonShift لا تحتوي على إعلانات ولا تستخدم Google AdMob. إذا تمت إضافة خدمات إعلانية أو خدمات أخرى تابعة لجهات خارجية في إصدار مستقبلي، فسيتم تحديث سياسة الخصوصية لتوضيح كيفية استخدامها.",

    section5Title: "5. حذف البيانات",
    section5Text:
      "نظرًا لأن بياناتك يتم تخزينها محليًا على جهازك، يمكنك حذفها من خلال مسح بيانات التطبيق أو بيانات التخزين الخاصة بالمتصفح التي يستخدمها MonShift. وقد يؤدي حذف التطبيق أيضًا إلى حذف البيانات المحلية المرتبطة به.",

    section6Title: "6. الأمان",
    section6Text:
      "نتخذ إجراءات معقولة لحماية التطبيق وتقليل المخاطر المتعلقة باستخدام بياناتك. ومع ذلك، لا يمكن ضمان أن يكون أي نظام تخزين إلكتروني آمنًا بشكل كامل.",

    section7Title: "7. تعديلات سياسة الخصوصية",
    section7Text:
      "قد يتم تحديث سياسة الخصوصية هذه عندما تتطور وظائف MonShift. وسيتم توضيح التغييرات المهمة من خلال تحديث تاريخ السياسة.",

    section8Title: "8. الاتصال بنا",
    section8Text:
      "إذا كان لديك أي سؤال بخصوص سياسة الخصوصية أو كيفية التعامل مع بياناتك، يمكنك التواصل معنا عبر البريد الإلكتروني التالي:",
    email: "twinapps.support@gmail.com",
  },
};

export default function PrivacyPage() {
  const [lang, setLang] = useState("fr");

  useEffect(() => {
    const savedLang = localStorage.getItem("monshift_lang");
    if (savedLang) setLang(savedLang);
  }, []);

  const t = texts[lang] || texts.fr;

  return (
    <main
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        paddingBottom: "100px",
        fontFamily: "sans-serif",
        background: "#f3f4f6",
        minHeight: "100vh",
        direction: lang === "ar" ? "rtl" : "ltr",
      }}
    >
      <header
        style={{
          background: "#1e3a8a",
          color: "white",
          padding: "16px",
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        {t.title}
      </header>

      <div style={{ padding: "16px" }}>
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            lineHeight: "1.6",
            color: "#374151",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#9ca3af",
              marginBottom: "12px",
            }}
          >
            {t.lastUpdated}
          </div>

          <p style={{ fontSize: "14px", marginBottom: "16px" }}>
            {t.intro}
          </p>

          <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "6px" }}>
            {t.section1Title}
          </h3>
          <p style={{ fontSize: "13px", marginBottom: "14px" }}>
            {t.section1Text}
          </p>

          <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "6px" }}>
            {t.section2Title}
          </h3>
          <p style={{ fontSize: "13px", marginBottom: "14px" }}>
            {t.section2Text}
          </p>

          <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "6px" }}>
            {t.section3Title}
          </h3>
          <p style={{ fontSize: "13px", marginBottom: "14px" }}>
            {t.section3Text}
          </p>

          <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "6px" }}>
            {t.section4Title}
          </h3>
          <p style={{ fontSize: "13px", marginBottom: "14px" }}>
            {t.section4Text}
          </p>

          <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "6px" }}>
            {t.section5Title}
          </h3>
          <p style={{ fontSize: "13px", marginBottom: "14px" }}>
            {t.section5Text}
          </p>

          <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "6px" }}>
            {t.section6Title}
          </h3>
          <p style={{ fontSize: "13px", marginBottom: "14px" }}>
            {t.section6Text}
          </p>

          <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "6px" }}>
            {t.section7Title}
          </h3>
          <p style={{ fontSize: "13px", marginBottom: "14px" }}>
            {t.section7Text}
          </p>

          <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "6px" }}>
            {t.section8Title}
          </h3>
          <p style={{ fontSize: "13px", marginBottom: "6px" }}>
            {t.section8Text}
          </p>

          <p
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              direction: "ltr",
              textAlign: lang === "ar" ? "right" : "left",
            }}
          >
            {t.email}
          </p>
        </div>
      </div>

      <BottomNav active="settings" />
    </main>
  );
}