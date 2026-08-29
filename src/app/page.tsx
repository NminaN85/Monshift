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

// قاموس الترجمات للصفحة
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
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [breaks, setBreaks] = useState<BreakItem[]>([]);
  const [maxPaidMinutes, setMaxPaidMinutes] = useState<number>(30);
  const [notes, setNotes] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState("€");
  const [lang, setLang] = useState("fr");

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

    // جلب تاريخ اليوم الفعلي بشكل ديناميكي
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    setSelectedDate(todayStr);

    const savedHistory = localStorage.getItem("monshift_history");
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      if (history[todayStr]) {
        const dayRecord = history[todayStr];
        setStartTime(dayRecord.startTime || "");
        setEndTime(dayRecord.endTime || "");
        setBreaks(dayRecord.breaks || []);
        if (dayRecord.maxPaidMinutes !== undefined) setMaxPaidMinutes(dayRecord.maxPaidMinutes);
        setNotes(dayRecord.notes || "");
        if (dayRecord.jobId) setSelectedJobId(dayRecord.jobId);
      }
    }
  }, []);

  const t = translations[lang] || translations.fr;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const savedHistory = localStorage.getItem("monshift_history");
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      if (history[newDate]) {
        const day = history[newDate];
        setStartTime(day.startTime || "");
        setEndTime(day.endTime || "");
        setBreaks(day.breaks || []);
        if (day.maxPaidMinutes !== undefined) setMaxPaidMinutes(day.maxPaidMinutes);
        setNotes(day.notes || "");
        if (day.jobId) setSelectedJobId(day.jobId);
        return;
      }
    }
    // تصفير الحقول ليقوم المستخدم بملئها لليوم الجديد
    setStartTime("");
    setEndTime("");
    setBreaks([]);
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
    if (!startTime || !endTime) {
      return { formattedTime: "0h00", amount: "0.00" };
    }

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
    <main style={{ maxWidth: "480px", margin: "0 auto", paddingBottom: "110px", fontFamily: "sans-serif", background: "#f3f4f6", minHeight: "100vh" }} dir={dir}>
      
      <div style={{ background: "#1e3a8a", color: "white", padding: "16px", textAlign: "center", borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px" }}>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => handleDateChange(e.target.value)}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", textAlign: "center", marginBottom: "8px", outline: "none", cursor: "pointer" }}
        />
        <div style={{ fontSize: "13px", color: "#93c5fd" }}>{t.totalGross}: {metrics.amount} {currencySymbol}</div>
        <div style={{ fontSize: "28px", fontWeight: "bold", marginTop: "4px" }}>{metrics.formattedTime}</div>
      </div>

      <div style={{ padding: "16px" }}>
        
        <div style={{ background: "white", padding: "12px", borderRadius: "8px", marginBottom: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "6px" }}>{t.jobLabel}</label>
          <select 
            value={selectedJobId} 
            onChange={(e) => setSelectedJobId(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "15px", background: "white", outline: "none" }}
          >
            {jobs.length === 0 ? (
              <option value="">{t.noJob}</option>
            ) : (
              jobs.map(job => (
                <option key={job.id} value={job.id}>{job.name} ({job.rate} {currencySymbol}/h)</option>
              ))
            )}
          </select>
        </div>

        <div style={{ background: "white", padding: "12px", borderRadius: "8px", marginBottom: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "14px", color: "#374151" }}>{t.workHours}</div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>{t.start}</span>
              <input 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "16px", background: "#f0fdf4", textAlign: "center", fontWeight: "bold", color: "#166534", outline: "none" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>{t.end}</span>
              <input 
                type="time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "16px", background: "#fef2f2", textAlign: "center", fontWeight: "bold", color: "#991b1b", outline: "none" }}
              />
            </div>
          </div>
        </div>

        <div style={{ background: "white", padding: "12px", borderRadius: "8px", marginBottom: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontWeight: "bold", fontSize: "14px", color: "#374151" }}>{t.breaks}</span>
            {breaks.length < 2 && (
              <button 
                onClick={() => setBreaks([...breaks, { id: Date.now().toString(), startTime: "", endTime: "", isPaid: false }])}
                style={{ background: "#10b981", color: "white", border: "none", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: "bold" }}
              >
                {t.addBreak}
              </button>
            )}
          </div>

          {breaks.map((b, index) => (
            <div key={b.id} style={{ borderTop: "1px solid #e5e7eb", paddingTop: "8px", marginTop: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", fontWeight: "bold", color: "#4b5563" }}>{t.pauseN(index + 1)}</span>
                <button 
                  onClick={() => setBreaks(breaks.filter(item => item.id !== b.id))}
                  style={{ background: "transparent", border: "none", color: "#ef4444", fontSize: "12px", cursor: "pointer", fontWeight: "bold" }}
                >
                  {t.delete}
                </button>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "6px" }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>{t.start}</span>
                  <input 
                    type="time" 
                    value={b.startTime} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setBreaks(breaks.map(item => item.id === b.id ? { ...item, startTime: val } : item));
                    }}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", outline: "none" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>{t.end}</span>
                  <input 
                    type="time" 
                    value={b.endTime} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setBreaks(breaks.map(item => item.id === b.id ? { ...item, endTime: val } : item));
                    }}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", outline: "none" }}
                  />
                </div>
              </div>
              
              <div style={{ marginTop: "6px" }}>
                <label style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "4px", color: "#374151", cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    checked={b.isPaid} 
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setBreaks(breaks.map(item => item.id === b.id ? { ...item, isPaid: checked } : item));
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  {t.paidBreak}
                </label>
              </div>
            </div>
          ))}

          <div style={{ marginTop: "12px", borderTop: "1px solid #e5e7eb", paddingTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "#4b5563", fontWeight: "bold" }}>{t.maxPaidBreaks}</span>
            <input 
              type="number" 
              value={maxPaidMinutes} 
              onChange={(e) => setMaxPaidMinutes(Number(e.target.value))}
              style={{ width: "70px", padding: "6px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", textAlign: "center", outline: "none" }}
            />
          </div>
        </div>

        <div style={{ background: "white", padding: "12px", borderRadius: "8px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t.notePlaceholder}
            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", minHeight: "60px", resize: "none", outline: "none" }}
          />
        </div>

        <button 
          onClick={handleSave}
          style={{ width: "100%", background: "#1e3a8a", color: "white", border: "none", padding: "14px", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
        >
          {saveSuccess ? t.saved : t.save}
        </button>

      </div>

      <BottomNav active="hours" />
    </main>
  );
}
