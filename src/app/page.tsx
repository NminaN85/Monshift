"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

interface BreakItem {
  id: string;
  startTime: string;
  endTime: string;
  isPaid: boolean;
}

const texts: Record<string, any> = {
  fr: {
    greeting: "Bonjour",
    modeManual: "Saisie Manuelle",
    modeLive: "Pointeuse Live",
    startShift: "Démarrer le shift",
    pauseBtn: "Prendre une Pause",
    resumeBtn: "Reprendre",
    endShift: "Terminer le shift",
    paidBreak: "Pause payée",
    unpaidBreak: "Pause non payée",
    manualTitle: "Enregistrement rapide",
    saveManual: "Enregistrer",
    successMsg: "Enregistré avec succès !"
  },
  en: {
    greeting: "Hello",
    modeManual: "Manual Entry",
    modeLive: "Live Timer",
    startShift: "Start Shift",
    pauseBtn: "Take a Break",
    resumeBtn: "Resume",
    endShift: "Finish Shift",
    paidBreak: "Paid break",
    unpaidBreak: "Unpaid break",
    manualTitle: "Quick Entry",
    saveManual: "Save",
    successMsg: "Saved successfully!"
  },
  ar: {
    greeting: "أهلاً بك",
    modeManual: "إدخال يدوي",
    modeLive: "عداد حي",
    startShift: "بدء الشفت",
    pauseBtn: "تسجيل استراحة",
    resumeBtn: "عودة للعمل",
    endShift: "إنهاء الشفت",
    paidBreak: "استراحة مدفوعة",
    unpaidBreak: "استراحة غير مدفوعة",
    manualTitle: "تسجيل سريع لليوم",
    saveManual: "حفظ الشفت",
    successMsg: "تم الحفظ بنجاح!"
  }
};

export default function MainPage() {
  const [lang, setLang] = useState("fr");
  const [currencySymbol, setCurrencySymbol] = useState("€");
  const [mode, setMode] = useState<"live" | "manual">("live");
  const [todayKey, setTodayKey] = useState("");
  const [currentDateStr, setCurrentDateStr] = useState("");

  // حالات العداد الحي (Live)
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [liveStartTime, setLiveStartTime] = useState("");
  const [breaks, setBreaks] = useState<BreakItem[]>([]);
  const [isBreakPaid, setIsBreakPaid] = useState(false);

  // حالات الإدخال اليدوي (Manual)
  const [manualStart, setManualStart] = useState("08:00");
  const [manualEnd, setManualEnd] = useState("16:00");
  const [manualBreakStart, setManualBreakStart] = useState("");
  const [manualBreakEnd, setManualBreakEnd] = useState("");
  const [manualIsPaid, setManualIsPaid] = useState(false);
  const [success, setSuccess] = useState(false);

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

    const history = JSON.parse(localStorage.getItem("monshift_history") || "{}");
    if (history[key]) {
      const dayData = history[key];
      if (dayData.startTime && !dayData.endTime) {
        setIsClockedIn(true);
        setLiveStartTime(dayData.startTime);
        setBreaks(dayData.breaks || []);
      }
    }
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isClockedIn && !isPaused) {
      interval = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
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

  const handleStartLive = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setLiveStartTime(timeStr);
    setIsClockedIn(true);

    const history = JSON.parse(localStorage.getItem("monshift_history") || "{}");
    history[todayKey] = { date: todayKey, startTime: timeStr, endTime: "", breaks: [], notes: "" };
    localStorage.setItem("monshift_history", JSON.stringify(history));
  };

  const handleToggleBreak = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (!isPaused) {
      setIsPaused(true);
      // إضافة بداية الاستراحة مع تحديد هل هي مدفوعة أم لا
      const newBreak: BreakItem = { id: Date.now().toString(), startTime: timeStr, endTime: "", isPaid: isBreakPaid };
      const updatedBreaks = [...breaks, newBreak];
      setBreaks(updatedBreaks);

      const history = JSON.parse(localStorage.getItem("monshift_history") || "{}");
      if (history[todayKey]) {
        history[todayKey].breaks = updatedBreaks;
        localStorage.setItem("monshift_history", JSON.stringify(history));
      }
    } else {
      setIsPaused(false);
      // تسجيل نهاية الاستراحة الأخيرة
      const updatedBreaks = [...breaks];
      if (updatedBreaks.length > 0) {
        updatedBreaks[updatedBreaks.length - 1].endTime = timeStr;
      }
      setBreaks(updatedBreaks);

      const history = JSON.parse(localStorage.getItem("monshift_history") || "{}");
      if (history[todayKey]) {
        history[todayKey].breaks = updatedBreaks;
        localStorage.setItem("monshift_history", JSON.stringify(history));
      }
    }
  };

  const handleFinishLive = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    setIsClockedIn(false);
    setIsPaused(false);
    setElapsedSeconds(0);

    const history = JSON.parse(localStorage.getItem("monshift_history") || "{}");
    if (history[todayKey]) {
      history[todayKey].endTime = timeStr;
      localStorage.setItem("monshift_history", JSON.stringify(history));
    }
  };

  const handleSaveManual = () => {
    const history = JSON.parse(localStorage.getItem("monshift_history") || "{}");
    const manualBreaks = manualBreakStart && manualBreakEnd ? [{ id: "1", startTime: manualBreakStart, endTime: manualBreakEnd, isPaid: manualIsPaid }] : [];

    history[todayKey] = {
      date: todayKey,
      startTime: manualStart,
      endTime: manualEnd,
      breaks: manualBreaks,
      notes: ""
    };

    localStorage.setItem("monshift_history", JSON.stringify(history));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", padding: "16px", fontFamily: "sans-serif", paddingBottom: "110px", background: "#f3f4f6", minHeight: "100vh", direction: lang === "ar" ? "rtl" : "ltr" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>{t.greeting} Mina</div>
          <div style={{ fontSize: "13px", color: "#6b7280", textTransform: "capitalize" }}>{currentDateStr}</div>
        </div>
        {/* أزرار التبديل بين العداد الحي والإدخال اليدوي */}
        <div style={{ background: "#e5e7eb", padding: "4px", borderRadius: "10px", display: "flex", gap: "4px" }}>
          <button onClick={() => setMode("live")} style={{ background: mode === "live" ? "white" : "transparent", border: "none", padding: "6px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>⚡ {t.modeLive}</button>
          <button onClick={() => setMode("manual")} style={{ background: mode === "manual" ? "white" : "transparent", border: "none", padding: "6px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>✍️ {t.modeManual}</button>
        </div>
      </div>

      {mode === "live" ? (
        <div>
          <div style={{ background: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginBottom: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "38px", fontWeight: "bold", color: "#1f2937", fontFamily: "monospace", marginBottom: "12px" }}>
              {isClockedIn ? formatSeconds(elapsedSeconds) : "00:00:00"}
            </div>

            {!isClockedIn ? (
              <button onClick={handleStartLive} style={{ width: "100%", background: "#1e3a8a", color: "white", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "bold", fontSize: "15px", cursor: "pointer" }}>
                {t.startShift}
              </button>
            ) : (
              <div>
                {/* اختيار هل الاستراحة مدفوعة أم لا قبل الضغط */}
                <div style={{ marginBottom: "12px", display: "flex", justifyContent: "center", gap: "10px" }}>
                  <label style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                    <input type="checkbox" checked={isBreakPaid} onChange={(e) => setIsBreakPaid(e.target.checked)} />
                    {t.paidBreak}
                  </label>
                </div>

                <button onClick={handleTogglePause} style={{ width: "100%", background: isPaused ? "#10b981" : "#f59e0b", color: "white", border: "none", padding: "12px", borderRadius: "12px", fontWeight: "bold", fontSize: "14px", cursor: "pointer", marginBottom: "10px" }}>
                  {isPaused ? t.resumeBtn : t.pauseBtn}
                </button>
                <button onClick={handleFinishLive} style={{ width: "100%", background: "#065f46", color: "white", border: "none", padding: "12px", borderRadius: "12px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}>
                  {t.endShift}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: "16px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginBottom: "16px" }}>
          <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "10px", color: "#374151" }}>{t.manualTitle}</div>
          
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "11px", color: "#6b7280" }}>Début</span>
              <input type="time" value={manualStart} onChange={(e) => setManualStart(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "11px", color: "#6b7280" }}>Fin</span>
              <input type="time" value={manualEnd} onChange={(e) => setManualEnd(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "11px", color: "#6b7280" }}>Pause Début</span>
              <input type="time" value={manualBreakStart} onChange={(e) => setManualBreakStart(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "11px", color: "#6b7280" }}>Pause Fin</span>
              <input type="time" value={manualBreakEnd} onChange={(e) => setManualBreakEnd(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
            </div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input type="checkbox" checked={manualIsPaid} onChange={(e) => setManualIsPaid(e.target.checked)} />
              {t.paidBreak}
            </label>
          </div>

          {success && <div style={{ background: "#d1fae5", color: "#065f46", padding: "8px", borderRadius: "6px", textAlign: "center", fontSize: "13px", fontWeight: "bold", marginBottom: "10px" }}>{t.successMsg}</div>}

          <button onClick={handleSaveManual} style={{ width: "100%", background: "#1e3a8a", color: "white", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}>
            {t.saveManual}
          </button>
        </div>
      )}

      <BottomNav active="hours" />
    </main>
  );
}
