"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

interface BreakItem { 
  id: string; 
  startTime: string; 
  endTime: string; 
  isPaid: boolean;
}

interface Job {
  id: string;
  name: string;
  rate: number;
  color: string;
}

// 1. تعريف قاموس النصوص للغات المختلفة
const translations: Record<string, any> = {
  fr: {
    totalGross: "Total Brut",
    jobLabel: "Lieu de travail (Job):",
    noJob: "Aucun lieu de travail (Ajouter un job)",
    workHours: "🕒 Horaires de travail",
    start: "Début",
    end: "Fin",
    breaks: "☕ Pauses (max 2)",
    addBreak: "+ Ajouter une pause",
    delete: "Supprimer",
    pauseN: (n: number) => `Pause #${n}`,
    paidBreak: "Pause payée",
    maxPaidBreaks: "Max pauses payées (Total min):",
    notePlaceholder: "Ajouter une note...",
    save: "Enregistrer",
    saved: "✓ Enregistré avec succès !"
  },
  en: {
    totalGross: "Total Gross",
    jobLabel: "Workplace (Job):",
    noJob: "No workplace (Add a job)",
    workHours: "🕒 Work Hours",
    start: "Start",
    end: "End",
    breaks: "☕ Breaks (max 2)",
    addBreak: "+ Add break",
    delete: "Delete",
    pauseN: (n: number) => `Break #${n}`,
    paidBreak: "Paid break",
    maxPaidBreaks: "Max paid breaks (Total min):",
    notePlaceholder: "Add a note...",
    save: "Save",
    saved: "✓ Saved successfully !"
  },
  ar: {
    totalGross: "إجمالي الراتب (Brut)",
    jobLabel: "مكان العمل (الوظيفة):",
    noJob: "لا يوجد مكان عمل (أضف وظيفة)",
    workHours: "🕒 ساعات العمل",
    start: "البداية",
    end: "النهاية",
    breaks: "☕ الاستراحات (القصوى 2)",
    addBreak: "+ إضافة استراحة",
    delete: "حذف",
    pauseN: (n: number) => `استراحة #${n}`,
    paidBreak: "استراحة مدفوعة",
    maxPaidBreaks: "الحد الأقصى للاستراحات المدفوعة (بالدقائق):",
    notePlaceholder: "أضف ملاحظة...",
    save: "حفظ",
    saved: "✓ تم الحفظ بنجاح !"
  }
};

export default function HeuresPage() {
  const [selectedDate, setSelectedDate] = useState("2026-08-17");
  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("15:00");
  const [breaks, setBreaks] = useState<BreakItem[]>([
    { id: "1", startTime: "", endTime: "", isPaid: false }
  ]);
  const [maxPaidMinutes, setMaxPaidMinutes] = useState<number>(30);
  const [notes, setNotes] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState("€");
  
  // 2. حالة اللغة (الافتراضي فرنسي لحين تحميل الإعدادات)
  const [lang, setLang] = useState("fr");

  // 3. جلب اللغة المفضلة من localStorage عند تحميل الصفحة
  useEffect(() => {
    const savedLang = localStorage.getItem("monshift_lang");
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }

    const savedSymbol = localStorage.getItem("monshift_symbol");
    if (savedSymbol) {
      setCurrencySymbol(savedSymbol);
    }

    const savedJobs = localStorage.getItem("monshift_jobs");
    if (savedJobs) {
      const parsedJobs: Job[] = JSON.parse(savedJobs);
      setJobs(parsedJobs);
      if (parsedJobs.length > 0 && !selectedJobId) {
        setSelectedJobId(parsedJobs[0].id);
      }
    }

    const savedHistory = localStorage.getItem("monshift_history");
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      if (history[selectedDate]) {
        const day = history[selectedDate];
        setStartTime(day.startTime || "07:00");
        setEndTime(day.endTime || "15:00");
        setBreaks(day.breaks || []);
        if (day.maxPaidMinutes !== undefined) setMaxPaidMinutes(day.maxPaidMinutes);
        setNotes(day.notes || "");
        if (day.jobId) setSelectedJobId(day.jobId);
      }
    }
  }, [selectedDate]);

  // 4. تحديد قاموس النصوص بناءً على اللغة الحالية
  const t = translations[lang] || translations.fr;
  // تحديد اتجاه الصفحة (RTL للعربية)
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const savedHistory = localStorage.getItem("monshift_history");
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      if (history[newDate]) {
        const day = history[newDate];
        setStartTime(day.startTime || "07:00");
        setEndTime(day.endTime || "15:00");
        setBreaks(day.breaks || []);
        if (day.maxPaidMinutes !== undefined) setMaxPaidMinutes(day.maxPaidMinutes);
        setNotes(day.notes || "");
        if (day.jobId) setSelectedJobId(day.jobId);
        return;
      }
    }
    setStartTime("07:00");
    setEndTime("15:00");
    setBreaks([{ id: "1", startTime: "", endTime: "", isPaid: false }]);
    setMaxPaidMinutes(30);
    setNotes("");
  };

  const handleSave = () => {
    const history = JSON.parse(localStorage.getItem("monshift_history") || "{}");

    history[selectedDate] = {
      date: selectedDate,
      startTime,
      endTime,
      breaks,
      maxPaidMinutes,
      notes,
      jobId: selectedJobId
    };

    localStorage.setItem("monshift_history", JSON.stringify(history));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const timeToMins = (timeStr: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const calculateMetrics = () => {
    let startMins = timeToMins(startTime);
    let endMins = timeToMins(endTime);
    if (endMins <= startMins) endMins += 24 * 60;

    let grossMins = endMins - startMins;
    
    let totalPaidBreakMins = 0;
    let totalUnpaidBreakMins = 0;

    breaks.forEach(b => {
      if (b.startTime && b.endTime) {
        let bStart = timeToMins(b.startTime);
        let bEnd = timeToMins(b.endTime);
        if (bEnd <= bStart) bEnd += 24 * 60;
        const duration = Math.max(0, bEnd - bStart);

        if (!b.isPaid) {
          totalUnpaidBreakMins += duration;
        } else {
          totalPaidBreakMins += duration;
        }
      }
    });

    const excessPaidMins = Math.max(0, totalPaidBreakMins - Number(maxPaidMinutes || 0));
    const unpaidMins = totalUnpaidBreakMins + excessPaidMins;

    const netMins = Math.max(0, grossMins - unpaidMins);
    const hours = netMins / 60;

    const currentJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
    const rate = currentJob ? currentJob.rate : 0;
    const amount = hours * rate;

    const formattedTime = `${Math.floor(netMins / 60)}h${String(netMins % 60).padStart(2, "0")}`;
    return { formattedTime, amount: amount.toFixed(2) };
  };

  const metrics = calculateMetrics();

  return (
    // 5. إضافة خاصية dir لدعم اتجاه اللغة
    <main style={{ maxWidth: "480px", margin: "0 auto", paddingBottom: "110px", fontFamily: "sans-serif", background: "#f3f4f6", minHeight: "100vh" }} dir={dir}>
      
      <div style={{ background: "#1e3a8a", color: "white", padding: "16px", textAlign: "center", borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px" }}>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => handleDateChange(e.target.value)}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", textAlign: "center", marginBottom: "8px" }}
        />
        {/* استخدام t.totalGross بدلاً من النص الثابت */}
        <div style={{ fontSize: "13px", color: "#93c5fd" }}>{t.totalGross}: {metrics.amount} {currencySymbol}</div>
        <div style={{ fontSize: "28px", fontWeight: "bold", marginTop: "4px" }}>{metrics.formattedTime}</div>
      </div>

      <div style={{ padding: "16px" }}>
        
        <div style={{ background: "white", padding: "12px", borderRadius: "8px", marginBottom: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          {/* استخدام t.jobLabel */}
          <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "6px" }}>{t.jobLabel}</label>
          <select 
            value={selectedJobId} 
            onChange={(e) => setSelectedJobId(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "15px", background: "white" }}
          >
            {jobs.length === 0 ? (
              // استخدام t.noJob
              <option value="">{t.noJob}</option>
            ) : (
              jobs.map(job => (
                <option key={job.id} value={job.id}>{job.name} ({job.rate} {currencySymbol}/h)</option>
              ))
            )}
          </select>
        </div>

        <div style={{ background: "white", padding: "12px", borderRadius: "8px", marginBottom: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          {/* استخدام t.workHours */}
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "14px", color: "#374151" }}>{t.workHours}</div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              {/* استخدام t.start */}
              <span style={{ fontSize: "12px", color: "#6b7280" }}>{t.start}</span>
              <input 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "16px", background: "#f0fdf4", textAlign: "center", fontWeight: "bold", color: "#166534" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              {/* استخدام t.end */}
              <span style={{ fontSize: "12px", color: "#6b7280" }}>{t.end}</span>
              <input 
                type="time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "16px", background: "#fef2f2", textAlign: "center", fontWeight: "bold", color: "#991b1b" }}
              />
            </div>
          </div>
        </div>

        <div style={{ background: "white", padding: "12px", borderRadius: "8px", marginBottom: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            {/* استخدام t.breaks */}
            <span style={{ fontWeight: "bold", fontSize: "14px", color: "#374151" }}>{t.breaks}</span>
            {breaks.length < 2 && (
              <button 
                onClick={() => setBreaks([...breaks, { id: Date.now().toString(), startTime: "", endTime: "", isPaid: false }])}
                style={{ background: "#10b981", color: "white", border: "none", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
              >
                {/* استخدام t.addBreak */}
                {t.addBreak}
              </button>
            )}
          </div>

          {breaks.map((b, index) => (
            <div key={b.id} style={{ borderTop: "1px solid #e5e7eb", paddingTop: "8px", marginTop: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {/* استخدام الدالة t.pauseN(index + 1) */}
                <span style={{ fontSize: "13px", fontWeight: "bold", color: "#4b5563" }}>{t.pauseN(index + 1)}</span>
                <button 
                  onClick={() => setBreaks(breaks.filter(item => item.id !== b.id))}
                  style={{ background: "transparent", border: "none", color: "#ef4444", fontSize: "12px", cursor: "pointer" }}
                >
                  {/* استخدام t.delete */}
                  {t.delete}
                </button>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "6px" }}>
                <div style={{ flex: 1 }}>
                  {/* استخدام t.start */}
                  <span style={{ fontSize: "11px
