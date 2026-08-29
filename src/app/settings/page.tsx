"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

const allCurrencies = [
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "AED", symbol: "د.إ", name: "United Arab Emirates Dirham" },
  { code: "AFN", symbol: "؋", name: "Afghan Afghani" },
  { code: "ALL", symbol: "Lek", name: "Albanian Lek" },
  { code: "AMD", symbol: "֏", name: "Armenian Dram" },
  { code: "ANG", symbol: "ƒ", name: "Netherlands Antillean Guilder" },
  { code: "AOA", symbol: "Kz", name: "Angolan Kwanza" },
  { code: "ARS", symbol: "$", name: "Argentine Peso" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "AWG", symbol: "ƒ", name: "Aruban Florin" },
  { code: "AZN", symbol: "₼", name: "Azerbaijani Manat" },
  { code: "BAM", symbol: "KM", name: "Bosnia-Herzegovina Convertible Mark" },
  { code: "BBD", symbol: "Bds$", name: "Barbadian Dollar" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { code: "BGN", symbol: "лв", name: "Bulgarian Lev" },
  { code: "BHD", symbol: ".د.ب", name: "Bahraini Dinar" },
  { code: "BIF", symbol: "FBu", name: "Burundian Franc" },
  { code: "BMD", symbol: "BD$", name: "Bermudan Dollar" },
  { code: "BND", symbol: "B$", name: "Brunei Dollar" },
  { code: "BOB", symbol: "Bs.", name: "Bolivian Boliviano" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "BSD", symbol: "B$", name: "Bahamian Dollar" },
  { code: "BTN", symbol: "Nu.", name: "Bhutanese Ngultrum" },
  { code: "BWP", symbol: "P", name: "Botswanan Pula" },
  { code: "BYN", symbol: "Br", name: "Belarusian Ruble" },
  { code: "BZD", symbol: "BZ$", name: "Belize Dollar" },
  { code: "CDF", symbol: "FC", name: "Congolese Franc" },
  { code: "CLP", symbol: "$", name: "Chilean Peso" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "COP", symbol: "$", name: "Colombian Peso" },
  { code: "CRC", symbol: "₡", name: "Costa Rican Colón" },
  { code: "CUP", symbol: "$", name: "Cuban Peso" },
  { code: "CVE", symbol: "$", name: "Cape Verdean Escudo" },
  { code: "CZK", symbol: "Kč", name: "Czech Republic Koruna" },
  { code: "DJF", symbol: "Fdj", name: "Djiboutian Franc" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "DOP", symbol: "RD$", name: "Dominican Peso" },
  { code: "DZD", symbol: "دج", name: "Algerian Dinar" },
  { code: "EGP", symbol: "£", name: "Egyptian Pound" },
  { code: "ERN", symbol: "Nfk", name: "Eritrean Nakfa" },
  { code: "ETB", symbol: "Br", name: "Ethiopian Birr" },
  { code: "FJD", symbol: "FJ$", name: "Fijian Dollar" },
  { code: "FKP", symbol: "£", name: "Falkland Islands Pound" },
  { code: "GEL", symbol: "₾", name: "Georgian Lari" },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi" },
  { code: "GIP", symbol: "£", name: "Gibraltar Pound" },
  { code: "GMD", symbol: "D", name: "Gambian Dalasi" },
  { code: "GNF", symbol: "FG", name: "Guinean Franc" },
  { code: "GTQ", symbol: "Q", name: "Guatemalan Quetzal" },
  { code: "GYD", symbol: "G$", name: "Guyanaese Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "HNL", symbol: "L", name: "Honduran Lempira" },
  { code: "HRK", symbol: "kn", name: "Croatian Kuna" },
  { code: "HTG", symbol: "G", name: "Haitian Gourde" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "ILS", symbol: "₪", name: "Israeli New Sheqel" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "IQD", symbol: "ع.د", name: "Iraqi Dinar" },
  { code: "IRR", symbol: "﷼", name: "Iranian Rial" },
  { code: "ISK", symbol: "kr", name: "Icelandic Króna" },
  { code: "JMD", symbol: "J$", name: "Jamaican Dollar" },
  { code: "JOD", symbol: "JD", name: "Jordanian Dinar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "KGS", symbol: "лв", name: "Kyrgystani Som" },
  { code: "KHR", symbol: "៛", name: "Cambodian Riel" },
  { code: "KMF", symbol: "CF", name: "Comorian Franc" },
  { code: "KPW", symbol: "₩", name: "North Korean Won" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "KWD", symbol: "KD", name: "Kuwaiti Dinar" },
  { code: "KYD", symbol: "CI$", name: "Cayman Islands Dollar" },
  { code: "KZT", symbol: "₸", name: "Kazakhstani Tenge" },
  { code: "LAK", symbol: "₭", name: "Laotian Kip" },
  { code: "LBP", symbol: "ل.ل", name: "Lebanese Pound" },
  { code: "LKR", symbol: "₨", name: "Sri Lankan Rupee" },
  { code: "LRD", symbol: "L$", name: "Liberian Dollar" },
  { code: "LSL", symbol: "L", name: "Lesotho Loti" },
  { code: "LYD", symbol: "LD", name: "Libyan Dinar" },
  { code: "MAD", symbol: "MAD", name: "Moroccan Dirham" },
  { code: "MDL", symbol: "lei", name: "Moldovan Leu" },
  { code: "MGA", symbol: "Ar", name: "Malagasy Ariary" },
  { code: "MKD", symbol: "ден", name: "Macedonian Denar" },
  { code: "MMK", symbol: "K", name: "Myanma Kyat" },
  { code: "MNT", symbol: "₮", name: "Mongolian Tugrik" },
  { code: "MOP", symbol: "MOP$", name: "Macanese Pataca" },
  { code: "MRU", symbol: "UM", name: "Mauritanian Ouguiya" },
  { code: "MUR", symbol: "₨", name: "Mauritian Rupee" },
  { code: "MVR", symbol: "Rf", name: "Maldivian Rufiyaa" },
  { code: "MWK", symbol: "MK", name: "Malawian Kwacha" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "MZN", symbol: "MT", name: "Mozambican Metical" },
  { code: "NAD", symbol: "N$", name: "Namibian Dollar" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "NIO", symbol: "C$", name: "Nicaraguan Córdoba" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "NPR", symbol: "₨", name: "Nepalese Rupee" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  { code: "OMR", symbol: "rial", name: "Omani Rial" },
  { code: "PAB", symbol: "B/.", name: "Panamanian Balboa" },
  { code: "PEN", symbol: "S/.", name: "Peruvian Sol" },
  { code: "PGK", symbol: "K", name: "Papua New Guinean Kina" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  { code: "PYG", symbol: "Gs", name: "Paraguayan Guarani" },
  { code: "QAR", symbol: "QR", name: "Qatari Riyal" },
  { code: "RON", symbol: "lei", name: "Romanian Leu" },
  { code: "RSD", symbol: "din", name: "Serbian Dinar" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "RWF", symbol: "RWF", name: "Rwandan Franc" },
  { code: "SAR", symbol: "SR", name: "Saudi Riyal" },
  { code: "SBD", symbol: "SI$", name: "Solomon Islands Dollar" },
  { code: "SCR", symbol: "₨", name: "Seychellois Rupee" },
  { code: "SDG", symbol: "LS", name: "Sudanese Pound" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "SHP", symbol: "£", name: "Saint Helena Pound" },
  { code: "SLL", symbol: "Le", name: "Sierra Leonean Leone" },
  { code: "SOS", symbol: "S", name: "Somali Shilling" },
  { code: "SRD", symbol: "$", name: "Surinamese Dollar" },
  { code: "SSP", symbol: "£", name: "South Sudanese Pound" },
  { code: "STN", symbol: "Db", name: "São Tomé and Príncipe Dobra" },
  { code: "SYP", symbol: "£", name: "Syrian Pound" },
  { code: "SZL", symbol: "E", name: "Swazi Lilangeni" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "TJS", symbol: "SM", name: "Tajikistani Somoni" },
  { code: "TMT", symbol: "T", name: "Turkmenistani Manat" },
  { code: "TND", symbol: "DT", name: "Tunisian Dinar" },
  { code: "TOP", symbol: "T$", name: "Tongan Paʻanga" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "TTD", symbol: "TT$", name: "Trinidad and Tobago Dollar" },
  { code: "TWD", symbol: "NT$", name: "New Taiwan Dollar" },
  { code: "TZS", symbol: "TSh", name: "Tanzanian Shilling" },
  { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia" },
  { code: "UGX", symbol: "USh", name: "Ugandan Shilling" },
  { code: "UYU", symbol: "$U", name: "Uruguayan Peso" },
  { code: "UZS", symbol: "so'm", name: "Uzbekistani Som" },
  { code: "VES", symbol: "Bs.S", name: "Venezuelan Bolívar" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  { code: "VUV", symbol: "VT", name: "Vanuatu Vatu" },
  { code: "WST", symbol: "WS$", name: "Samoan Tala" },
  { code: "XAF", symbol: "FCFA", name: "CFA Franc BEAC" },
  { code: "XCD", symbol: "EC$", name: "East Caribbean Dollar" },
  { code: "XOF", symbol: "CFA", name: "CFA Franc BCEAO" },
  { code: "XPF", symbol: "₣", name: "CFP Franc" },
  { code: "YER", symbol: "﷼", name: "Yemeni Rial" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "ZMW", symbol: "ZK", name: "Zambian Kwacha" },
  { code: "ZWL", symbol: "Z$", name: "Zimbabwean Dollar" }
];

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
    searchPlaceholder: "Recherche",
    activeSub: "Inactif",
    proUpgrade: "Passez à la version pro !",
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
    searchPlaceholder: "Search",
    activeSub: "Inactive",
    proUpgrade: "Upgrade to Pro version!",
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
    searchPlaceholder: "بحث",
    activeSub: "غير نشط",
    proUpgrade: "الترقية إلى النسخة الاحترافية Pro !",
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

export default function SettingsPage() {
  const [lang, setLang] = useState("fr");
  const [currency, setCurrency] = useState("EUR — €");
  const [startDay, setStartDay] = useState("Lundi");
  const [currentView, setCurrentView] = useState<"main" | "account" | "reports" | "info" | "selectDay" | "selectCurrency">("main");
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSelectCurrency = (curr: typeof allCurrencies[0]) => {
    const currStr = `${curr.code} — ${curr.symbol}`;
    setCurrency(currStr);
    localStorage.setItem("monshift_currency", currStr);
    localStorage.setItem("monshift_symbol", curr.symbol);
    setCurrentView("main");
  };

  const handleSelectStartDay = (day: string) => {
    setStartDay(day);
    localStorage.setItem("monshift_startday", day);
    setCurrentView("main");
  };

  const t = texts[lang] || texts["fr"];
  const filteredCurrencies = allCurrencies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", paddingBottom: "100px", fontFamily: "sans-serif", background: "#f3f4f6", minHeight: "100vh", direction: lang === "ar" ? "rtl" : "ltr" }}>
      
      {/* الشاشة الرئيسية للإعدادات */}
      {currentView === "main" && (
        <div>
          <header style={{ background: "#1e3a8a", color: "white", padding: "16px", textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>
            {t.title}
          </header>

          <div style={{ padding: "16px" }}>
            
            {/* أزرار تغيير اللغة سريعة */}
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
              <div onClick={() => setCurrentView("selectCurrency")} style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                <span>💰 {t.currency}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "#6b7280", fontSize: "14px" }}>{currency}</span>
                  <span style={{ color: "#9ca3af" }}>{lang === "ar" ? "❮" : "❯"}</span>
                </div>
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

      {/* شاشة اختيار العملة مع البحث المطابقة للصورة */}
      {currentView === "selectCurrency" && (
        <div>
          <header style={{ background: "#1e3a8a", color: "white", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={() => setCurrentView("main")} style={{ background: "transparent", border: "none", color: "white", fontSize: "18px", cursor: "pointer" }}>{lang === "ar" ? "❯" : "❮"}</button>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>{t.currency}</div>
          </header>

          <div style={{ padding: "16px" }}>
            {/* شريط البحث */}
            <div style={{ background: "white", padding: "10px", borderRadius: "12px", marginBottom: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🔍</span>
              <input 
                type="text" 
                placeholder={t.searchPlaceholder} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", border: "none", outline: "none", fontSize: "15px", background: "transparent" }}
              />
            </div>

            {/* قائمة العملات */}
            <div style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              {filteredCurrencies.map((c) => (
                <div 
                  key={c.code}
                  onClick={() => handleSelectCurrency(c)}
                  style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                >
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: "bold", color: "#1f2937" }}>{c.name}</div>
                    <div style={{ fontSize: "13px", color: "#9ca3af", fontWeight: "bold" }}>{c.code}</div>
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: "bold", color: "#1e3a8a" }}>{c.symbol}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* شاشة اختيار بداية الأسبوع */}
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

      {/* صفحة الحساب */}
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

      {/* صفحة التقارير بالإيميل */}
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

      {/* صفحة معلومات التطبيق */}
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
