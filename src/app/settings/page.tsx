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
    firstName: "Prénom",
    lastName: "Nom",
    email: "Email",
    saveChanges: "Enregistrer",
    savedSuccess: "✓ Modifié avec succès !",
    appDescTitle: "À propos de MonShift",
    appDescText: "MonShift est l'application idéale pour gérer vos heures de travail, plannings et calculs de salaires en toute simplicité.",
    version: "Version",
    termsText: "Conditions d'utilisation et politique de confidentialité",
    days: {
      Lundi: "Lundi",
      Mardi: "Mardi",
      Mercredi: "Mercredi",
      Jeudi: "Jeudi",
      Vendredi: "Vendredi",
      Samedi: "Samedi",
      Dimanche: "Dimanche"
    }
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
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    saveChanges: "Save",
    savedSuccess: "✓ Saved successfully!",
    appDescTitle: "About MonShift",
    appDescText: "MonShift is the ideal app to manage your working hours, schedules, and salary calculations with ease.",
    version: "Version",
    termsText: "Terms of use and privacy policy",
    days: {
      Lundi: "Monday",
      Mardi: "Tuesday",
      Mercredi: "Wednesday",
      Jeudi: "Thursday",
      Vendredi: "Friday",
      Samedi: "Saturday",
      Dimanche: "Sunday"
    }
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
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    email: "البريد الإلكتروني",
    saveChanges: "حفظ",
    savedSuccess: "✓ تم الحفظ بنجاح!",
    appDescTitle: "عن تطبيق MonShift",
    appDescText: "MonShift هو التطبيق المثالي لإدارة ساعات العمل، الجداول الزمنية، وحساب الأجور بكل سهولة واحترافية.",
    version: "الإصدار",
    termsText: "شروط الاستخدام وسياسة الخصوصية",
    days: {
      Lundi: "الإثنين",
      Mardi: "الثلاثاء",
      Mercredi: "الأربعاء",
      Jeudi: "الخميس",
      Vendredi: "الجمعة",
      Samedi: "السبت",
      Dimanche: "الأحد"
    }
  }
};

const weekDaysList = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function SettingsPage() {
  const [lang, setLang] = useState("fr");
  const [currency, setCurrency] = useState("EUR — €");
  const [startDay, setStartDay] = useState("Lundi");
  const [currentView, setCurrentView] = useState<"main" | "account" | "reports" | "info" | "selectDay" | "selectCurrency">("main");
  const [searchQuery, setSearchQuery] = useState("");

  // بيانات الحساب الشخصي
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [accountSaved, setAccountSaved] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("monshift_lang");
    if (savedLang) setLang(savedLang);

    const savedCurr = localStorage.getItem("monshift_currency");
    if (savedCurr) setCurrency(savedCurr);

    const savedStartDay = localStorage.getItem("monshift_startday");
    if (savedStartDay) setStartDay(savedStartDay);

    const savedFirstName = localStorage.getItem("monshift_firstname");
    if (savedFirstName) setFirstName(savedFirstName);

    const savedLastName = localStorage.getItem("monshift_lastname");
    if (savedLastName) setLastName(savedLastName);

    const savedEmail = localStorage.getItem("monshift_email");
    if (savedEmail) setUserEmail(savedEmail);
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

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("monshift_firstname", firstName);
    localStorage.setItem("monshift_lastname", lastName);
    localStorage.setItem("monshift_email", userEmail);
    setAccountSaved(true);
    setTimeout(() => setAccountSaved(false), 2500);
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
                  <span style={{ color: "#6b7280", fontSize: "14px" }}>{t.days[startDay] || startDay}</span>
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
              <div onClick={() => setCurrentView("info")} style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                <span>ℹ️ {t.info}</span>
                <span style={{ color: "#9ca3af" }}>{lang === "ar" ? "❮" : "❯"}</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* شاشة اختيار العملة مع البحث */}
      {currentView === "selectCurrency" && (
        <div>
          <header style={{ background: "#1e3a8a", color: "white", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={() => setCurrentView("main")} style={{ background: "transparent", border: "none", color: "white", fontSize: "18px", cursor: "pointer" }}>{lang === "ar" ? "❯" : "❮"}</button>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>{t.currency}</div>
          </header>

          <div style={{ padding: "16px" }}>
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

      {/* شاشة اختيار بداية الأسبوع (7 أيام كاملة) */}
      {currentView === "selectDay" && (
        <div>
          <header style={{ background: "#1e3a8a", color: "white", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={() => setCurrentView("main")} style={{ background: "transparent", border: "none", color: "white", fontSize: "18px", cursor: "pointer" }}>{lang === "ar" ? "❯" : "❮"}</button>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>{t.startOfWeek}</div>
          </header>

          <div style={{ padding: "16px" }}>
            <div style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              {weekDaysList.map((day) => (
                <div 
                  key={day} 
                  onClick={() => handleSelectStartDay(day)}
                  style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f3f4f6", cursor: "pointer", background: startDay === day ? "#eff6ff" : "white" }}
                >
                  <span style={{ fontWeight: startDay === day ? "bold" : "normal", color: startDay === day ? "#1e3a8a" : "#374151" }}>{t.days[day]}</span>
                  {startDay === day && <span style={{ color: "#2563eb", fontWeight: "bold" }}>✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* صفحة الحساب الشخصي (First Name, Last Name, Email) */}
      {currentView === "account" && (
        <div>
          <header style={{ background: "#1e3a8a", color: "white", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={() => setCurrentView("main")} style={{ background: "transparent", border: "none", color: "white", fontSize: "18px", cursor: "pointer" }}>{lang === "ar" ? "❯" : "❮"}</button>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>{t.myAccount}</div>
          </header>
          <div style={{ padding: "16px" }}>
            <form onSubmit={handleSaveAccount} style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              
              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "6px", fontWeight: "bold" }}>{t.firstName}</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ex: John"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px", outline: "none" }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "6px", fontWeight: "bold" }}>{t.lastName}</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Ex: Doe"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px", outline: "none" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "6px", fontWeight: "bold" }}>{t.email}</label>
                <input 
                  type="email" 
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px", outline: "none" }}
                />
              </div>

              <button 
                type="submit"
                style={{ width: "100%", background: "#1e3a8a", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}
              >
                {accountSaved ? t.savedSuccess : t.saveChanges}
              </button>

            </form>
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
            <div style={{ width: "70px", height: "70px", background: "#e5e7eb", borderRadius: "50%", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>🕒</div>
            <div style={{ fontWeight: "bold", fontSize: "18px", color: "#1f2937", marginBottom: "4px" }}>MonShift</div>
            <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px" }}>{t.version} 3.10</div>
            
            <div style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", textAlign: lang === "ar" ? "right" : "left", marginBottom: "16px" }}>
              <div style={{ fontWeight: "bold", fontSize: "14px", color: "#1e3a8a", marginBottom: "6px" }}>{t.appDescTitle}</div>
              <div style={{ fontSize: "13px", color: "#4b5563", lineHeight: "1.5" }}>{t.appDescText}</div>
            </div>

            <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "20px" }}>
              {t.termsText}
            </div>
          </div>
        </div>
      )}

      <BottomNav active="settings" />
    </main>
  );
}