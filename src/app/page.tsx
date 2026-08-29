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
    modeLive: "Chronomètre",
    startShift: "Démarrer le shift",
    pauseBtn: "Prendre une Pause",
    resumeBtn: "Reprendre le travail",
    endShift: "Terminer et Enregistrer",
    paidBreak: "Pause payée",
    manualTitle: "Enregistrement Rapide",
    saveManual: "Enregistrer la journée",
    successMsg: "Enregistré avec succès !",
    activeTimer: "Shift en cours depuis..."
  },
  en: {
    greeting: "Hello",
    modeManual: "Manual Entry",
    modeLive: "Live Timer",
    startShift: "Start Shift",
    pauseBtn: "Take a Break",
    resumeBtn: "Resume Work",
    endShift: "Finish & Save",
    paidBreak: "Paid break",
    manualTitle: "Quick Entry",
    saveManual: "Save Day",
    successMsg: "Saved successfully!",
    activeTimer: "Active shift running..."
  },
  ar: {
    greeting: "أهلاً بك",
    modeManual: "إدخال يدوي",
    modeLive: "مؤقت مباشر",
    startShift: "بدء الشفت الآن",
    pauseBtn: "بدء استراحة",
    resumeBtn: "استئناف العمل",
    endShift: "إنهاء وحفظ الشفت",
    paidBreak: "استراحة مدفوعة",
    manualTitle: "تسجيل يدوي سريع",
    saveManual: "حفظ بيانات اليوم",
    successMsg: "تم الحفظ بنجاح!",
    activeTimer: "الشفت جاري منذ..."
  }
};

export default function MainPage() {
  const [lang, setLang] = useState("fr");
  const [mode, setMode] = useState<"live" | "manual">("live");
  const [todayKey, setTodayKey] = useState("");
  const [currentDateStr, setCurrentDateStr] = useState("");

  // حالات المؤقت الحي (Live Timer) مع الحفظ ضد الـ Refresh
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [breaks, setBreaks] = useState<BreakItem[]>([]);
  const [isBreakPaid, setIsBreakPaid] = useState(false);

  // حالات الإدخال اليدوي (Manual Entry)
  const [manualStart, setManualStart] = useState("08:00");
  const [manualEnd, setManualEnd] = useState("16:00");
  const [manualBreakStart, setManualBreakStart] = useState("");
  const [manualBreakEnd, setManualBreakEnd] = useState("");
  const [manualIsPaid, setManualIsPaid] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("monshift_lang");
    if (savedLang) setLang(savedLang);

    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    setCurrentDateStr(now.toLocaleDateString(savedLang === 'ar' ? 'ar-SA' : 'fr-FR', options));

    const yearStr = now.getFullYear();
    const monthStr = String(now.getMonth() + 1).padStart(2, '0');
    const dayStr = String(now.getDate()).padStart(2, '0');
    const key = `${yearStr}-${monthStr}-${dayStr}`;
    setTodayKey(key);

    // استرجاع حالة الموقت المحفوظة محلياً لضمان عدم ضياع الوقت عند عمل Refresh
    const savedTimerState = localStorage.getItem("monshift_live_timer");
    if (savedTimerState) {
      const timerData = JSON.parse(savedTimerState);
      if (timerData.date === key && timerData.isClockedIn) {
        setIsClockedIn(true);
        setIsPaused(timerData.isPaused);
        setBreaks(timerData.breaks || []);
        setIsBreakPaid(timerData.isBreakPaid || false);
        
        // حساب الثواني المنقضية بدقة بناءً على الوقت الحقيقي
        if (!timerData.isPaused && timerData.startTimestamp) {
          const diffSec = Math.floor((Date.now() - timerData.startTimestamp) / 1000);
          setElapsedSeconds(diffSec + (timerData.pausedAccumulated || 0));
        } else {
          setElapsedSeconds(timerData.pausedAccumulated || 0);
        }
      }
    }
  }, []);

  // تحديث العداد باستمرار
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

  // حفظ حالة الموقت تلقائياً في التخزين المحلي
  useEffect(() => {
    if (isClockedIn) {
      const timerData = {
        date: todayKey,
        isClockedIn,
        isPaused,
        startTimestamp: Date.now() - (elapsedSeconds * 1000),
        pausedAccumulated: elapsedSeconds,
        breaks,
        isBreakPaid
      };
      localStorage.setItem("monshift_live_timer", JSON.stringify(timerData));
    }
  }, [isClockedIn, isPaused, elapsedSeconds, breaks, isBreakPaid, todayKey]);

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
    
    setIsClockedIn(true);
    setIsPaused(false);
    setElapsedSeconds(0);

    const history = JSON.parse(localStorage.getItem("monshift_history") || "{}");
    history[todayKey] = { date: todayKey, startTime: timeStr, endTime: "", breaks: [], notes: "" };
    localStorage.setItem("monshift_history", JSON.stringify(history));
  };

  const handleToggleBreak = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (!isPaused) {
      setIsPaused(true);
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
    
    // تسجيل وقت النهاية في السجل التاريخي
    const history = JSON.parse(localStorage.getItem("monshift_history") || "{}");
    if (history[todayKey]) {
      history[todayKey].endTime = timeStr;
      localStorage.setItem("monshift_history", JSON.stringify(history));
    }

    setIsClockedIn(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    localStorage.removeItem("monshift_live_timer");
    alert(t.successMsg);
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
      
      {/* رأس الصفحة وزر التبديل */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>{t.greeting} Mina</div>
          <div style={{ fontSize: "13px", color: "#6b7280", textTransform: "capitalize" }}>{currentDateStr}</div>
        </div>
        <div style={{ background: "#e5e7eb", padding: "4px", borderRadius: "10px", display: "flex", gap: "4px" }}>
          <button onClick={() => setMode("live")} style={{ background: mode === "live" ? "white" : "transparent", border: "none", padding: "6px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", boxShadow: mode === "live" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>⚡ {t.modeLive}</button>
          <button onClick={() => setMode("manual")} style={{ background: mode === "manual" ? "white" : "transparent", border: "none", padding: "6px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", boxShadow: mode === "manual" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>✍️ {t.modeManual}</button>
        </div>
      </div>

      {mode === "live" ? (
        <div style={{ background: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>{t.activeTimer}</div>
          <div style={{ fontSize: "44px", fontWeight: "bold", color: "#1f2937", fontFamily: "monospace", marginBottom: "20px" }}>
            {formatSeconds(elapsedSeconds)}
          </div>

          {!isClockedIn ? (
            <button onClick={handleStartLive} style={{ width: "100%", background: "#1e3a8a", color: "white", border: "none", padding: "16px", borderRadius: "14px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", boxShadow: "0 4px 6px rgba(30,58,138,0.2)" }}>
              {t.startShift}
            </button>
          ) : (
            <div>
              <div style={{ marginBottom: "16px", background: "#f8fafc", padding: "10px", borderRadius: "10px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                <input type="checkbox" id="breakPaidCheck" checked={isBreakPaid} onChange={(e) => setIsBreakPaid(e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                <label htmlFor="breakPaidCheck" style={{ fontSize: "13px", fontWeight: "bold", color: "#374151", cursor: "pointer" }}>{t.paidBreak}</label>
              </div>

              <button onClick={handleToggleBreak} style={{ width: "100%", background: isPaused ? "#10b981" : "#f59e0b", color: "white", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", marginBottom: "12px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
                {isPaused ? t.resumeBtn : t.pauseBtn}
              </button>
              
              <button onClick={handleFinishLive} style={{ width: "100%", background: "#065f46", color: "white", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
                {t.endShift}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ fontWeight: "bold", fontSize: "15px", marginBottom: "14px", color: "#374151" }}>{t.manualTitle}</div>
          
          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Début (Entry)</span>
              <input type="time" value={manualStart} onChange={(e) => setManualStart(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px" }} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Fin (Exit)</span>
              <input type="time" value={manualEnd} onChange={(e) => setManualEnd(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px" }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Pause Début</span>
              <input type="time" value={manualBreakStart} onChange={(e) => setManualBreakStart(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px" }} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Pause Fin</span>
              <input type="time" value={manualBreakEnd} onChange={(e) => setManualBreakEnd(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px" }} />
            </div>
          </div>

          <div style={{ marginBottom: "16px", background: "#f8fafc", padding: "10px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="checkbox" id="manualPaidCheck" checked={manualIsPaid} onChange={(e) => setManualIsPaid(e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
            <label htmlFor="manualPaidCheck" style={{ fontSize: "13px", fontWeight: "bold", color: "#374151", cursor: "pointer" }}>{t.paidBreak}</label>
          </div>

          {success && <div style={{ background: "#d1fae5", color: "#065f46", padding: "10px", borderRadius: "8px", textAlign: "center", fontSize: "13px", fontWeight: "bold", marginBottom: "12px" }}>{t.successMsg}</div>}

          <button onClick={handleSaveManual} style={{ width: "100%", background: "#1e3a8a", color: "white", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "bold", fontSize: "15px", cursor: "pointer" }}>
            {t.saveManual}
          </button>
        </div>
      )}

      <BottomNav active="hours" />
    </main>
  );
}
