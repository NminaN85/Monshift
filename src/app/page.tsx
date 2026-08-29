"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

interface BreakItem {
  startTime: string;
  endTime: string;
  isPaid: boolean;
}

interface DayRecord {
  date: string;
  startTime: string;
  endTime: string;
  breaks: BreakItem[];
  maxPaidMinutes?: number;
  notes: string;
  jobId?: string;
  isClockedIn?: boolean;
  isPaused?: boolean;
}

const texts: Record<string, any> = {
  fr: {
    greeting: "Bonjour",
    enCours: "EN COURS",
    paused: "EN PAUSE",
    notStarted: "Prêt à travailler",
    startShift: "Commencer le shift",
    pauseBtn: "Pause",
    resumeBtn: "Reprise",
    endShiftSlide: "Glissez pour terminer",
    journal: "JOURNÉE",
    entree: "Entrée",
    pauseLabel: "Pause",
    reprise: "Reprise",
    sortie: "Sortie",
    noShiftToday: "Aucun shift actif aujourd'hui",
    hoursToDo: "+ Heures à effectuer"
  },
  en: {
    greeting: "Hello",
    enCours: "RUNNING",
    paused: "PAUSED",
    notStarted: "Ready to work",
    startShift: "Start shift",
    pauseBtn: "Pause",
    resumeBtn: "Resume",
    endShiftSlide: "Slide to finish",
    journal: "TODAY",
    entree: "Clock In",
    pauseLabel: "Break",
    reprise: "Resume",
    sortie: "Clock Out",
    noShiftToday: "No active shift today",
    hoursToDo: "+ Hours to do"
  },
  ar: {
    greeting: "أهلاً بك",
    enCours: "جاري العمل",
    paused: "في استراحة",
    notStarted: "جاهز للبدء",
    startShift: "بدء الشفت",
    pauseBtn: "استراحة",
    resumeBtn: "استئناف",
    endShiftSlide: "اسحب لإنهاء الشفت",
    journal: "سجل اليوم",
    entree: "دخول",
    pauseLabel: "استراحة",
    reprise: "عودة",
    sortie: "خروج",
    noShiftToday: "لا يوجد شفت نشط اليوم",
    hoursToDo: "+ إضافة ساعات"
  }
};

export default function MainPage() {
  const [lang, setLang] = useState("fr");
  const [currencySymbol, setCurrencySymbol] = useState("€");
  const [currentDateStr, setCurrentDateStr] = useState("");
  const [todayKey, setTodayKey] = useState("");
  
  // حالة الشفت اللحظي
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [pauseTime, setPauseTime] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  // تتبع الأحداث اليومية للـ Timeline
  const [timelineEvents, setTimelineEvents] = useState<{ type: string; time: string; label: string }[]>([]);

  useEffect(() => {
    const savedLang = localStorage.getItem("monshift_lang");
    if (savedLang) setLang(savedLang);

    const savedSymbol = localStorage.getItem("monshift_symbol");
    if (savedSymbol) setCurrencySymbol(savedSymbol);

    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    setCurrentDateStr(now.toLocaleDateString(savedLang === 'ar' ? 'ar-SA' : 'fr-FR', options));

    const yearStr = now.getFullYear();
    const monthStr = String(now.getMonth() + 1).padStart(2, '0');
    const dayStr = String(now.getDate()).padStart(2, '0');
    const key = `${yearStr}-${monthStr}-${dayStr}`;
    setTodayKey(key);

    // استرجاع السجل الحالي إن وجد
    const history = JSON.parse(localStorage.getItem("monshift_history") || "{}");
    if (history[key]) {
      const dayData = history[key];
      if (dayData.startTime && !dayData.endTime) {
        setIsClockedIn(true);
        setStartTime(dayData.startTime);
      }
    }
  }, []);

  // مؤقت حساب الساعات لحظة بلحظة
  useEffect(() => {
    let interval: any = null;
    if (isClockedIn && !isPaused) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isClockedIn, isPaused]);

  const t = texts[lang] || texts["fr"];

  const formatSeconds = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleStartShift = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setStartTime(timeStr);
    setIsClockedIn(true);
    setIsPaused(false);
    setTimelineEvents([{ type: 'entree', time: timeStr, label: t.entree }]);

    // حفظ في التخزين
    const history = JSON.parse(localStorage.getItem("monshift_history") || "{}");
    history[todayKey] = {
      date: todayKey,
      startTime: timeStr,
      endTime: "",
      breaks: [],
      notes: ""
    };
    localStorage.setItem("monshift_history", JSON.stringify(history));
  };

  const handleTogglePause = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    if (!isPaused) {
      setIsPaused(true);
      setTimelineEvents(prev => [...prev, { type: 'pause', time: timeStr, label: t.pauseLabel }]);
    } else {
      setIsPaused(false);
      setTimelineEvents(prev => [...prev, { type: 'reprise', time: timeStr, label: t.reprise }]);
    }
  };

  const handleFinishShift = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    setIsClockedIn(false);
    setIsPaused(false);
    setElapsedSeconds(0);

    // تحديث السجل بـ EndTime
    const history = JSON.parse(localStorage.getItem("monshift_history") || "{}");
    if (history[todayKey]) {
      history[todayKey].endTime = timeStr;
      localStorage.setItem("monshift_history", JSON.stringify(history));
    }
  };

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", padding: "16px", fontFamily: "sans-serif", paddingBottom: "110px", background: "#f3f4f6", minHeight: "100vh", direction: lang === "ar" ? "rtl" : "ltr" }}>
      
      {/* الترحيب والتاريخ */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#1f2937" }}>{t.greeting} Mina.</div>
          <div style={{ fontSize: "14px", color: "#6b7280", textTransform: "capitalize", marginTop: "2px" }}>{currentDateStr}</div>
        </div>
        <button onClick={() => window.location.href = "/calendar"} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "8px 12px", cursor: "pointer", fontSize: "16px" }}>📅</button>
      </div>

      {/* بطاقة العداد الحي الرئيسية (EN COURS) */}
      <div style={{ background: "#ffffff", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginBottom: "20px", position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: isClockedIn ? (isPaused ? "#f59e0b" : "#10b981") : "#9ca3af" }}></span>
          <span style={{ fontSize: "12px", fontWeight: "bold", letterSpacing: "1px", color: isClockedIn ? (isPaused ? "#d97706" : "#059669") : "#6b7280" }}>
            {isClockedIn ? (isPaused ? t.paused : t.enCours) : t.notStarted}
          </span>
        </div>

        <div style={{ fontSize: "44px", fontWeight: "bold", color: "#1f2937", letterSpacing: "-1px", marginBottom: "16px", fontFamily: "monospace" }}>
          {isClockedIn ? formatSeconds(elapsedSeconds) : "00:00:00"}
        </div>

        {!isClockedIn ? (
          <button 
            onClick={handleStartShift}
            style={{ width: "100%", background: "#1e3a8a", color: "white", border: "none", padding: "14px", borderRadius: "14px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", boxShadow: "0 4px 6px rgba(30,58,138,0.2)" }}
          >
            {t.startShift}
          </button>
        ) : (
          <button 
            onClick={() => window.location.href = "/hours"}
            style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", padding: "6px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}
          >
            {t.hoursToDo}
          </button>
        )}
      </div>

      {/* الخط الزمني لأحداث اليوم (Timeline) */}
      {isClockedIn && (
        <div style={{ background: "white", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <span style={{ fontSize: "12px", fontWeight: "bold", color: "#6b7280", letterSpacing: "0.5px" }}>{t.journal}</span>
            <span style={{ fontSize: "11px", background: "#eff6ff", color: "#1d4ed8", padding: "2px 8px", borderRadius: "6px", fontWeight: "bold" }}>Forfait</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", position: "relative", paddingLeft: lang === 'ar' ? '0' : '12px', paddingRight: lang === 'ar' ? '12px' : '0' }}>
            {timelineEvents.map((ev, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: idx < timelineEvents.length - 1 ? "1px solid #f3f4f6" : "none", paddingBottom: "8px" }}>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "14px", color: "#1f2937" }}>{ev.label}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280" }}>{ev.type === 'entree' ? 'Début de shift' : 'En cours'}</div>
                </div>
                <div style={{ fontSize: "15px", fontWeight: "bold", color: "#374151" }}>{ev.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* أزرار التحكم السفلي أثناء العمل (Pause & Glissez pour terminer) */}
      {isClockedIn && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button 
            onClick={handleTogglePause}
            style={{ width: "100%", background: isPaused ? "#059669" : "#3b82f6", color: "white", border: "none", padding: "16px", borderRadius: "16px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
          >
            {isPaused ? t.resumeBtn : t.pauseBtn}
          </button>

          <button 
            onClick={handleFinishShift}
            style={{ width: "100%", background: "#065f46", color: "white", border: "none", padding: "16px", borderRadius: "16px", fontSize: "15px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 4px 10px rgba(6,95,70,0.2)" }}
          >
            <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>❯❯</span>
            {t.endShiftSlide}
          </button>
        </div>
      )}

      <BottomNav active="home" />
    </main>
  );
}
