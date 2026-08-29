"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

interface BreakItem { 
  id: string; 
  startTime: string; 
  endTime: string; 
}

interface DayRecord {
  date: string;
  startTime: string;
  endTime: string;
  breaks: BreakItem[];
  notes: string;
  jobId?: string;
}

interface Job {
  id: string;
  name: string;
  rate: number;
  color: string;
}

export default function HeuresPage() {
  const [selectedDate, setSelectedDate] = useState("2026-08-17");
  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("15:00");
  
  // تحديث البوزات لتعتمد على وقت البداية والنهاية
  const [breaks, setBreaks] = useState<BreakItem[]>([
    { id: "1", startTime: "", endTime: "" }
  ]);
  
  const [maxPaidMinutes, setMaxPaidMinutes] = useState<number>(30); // الحد الأقصى المدفوع الإجمالي (مثلا 30 دقيقة)
  const [notes, setNotes] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const savedJobs = localStorage.getItem("monshift_jobs");
    if (savedJobs) {
      const parsedJobs: Job[] = JSON.parse(savedJobs);
      setJobs(parsedJobs);
      if (parsedJobs.length > 0) {
        setSelectedJobId(parsedJobs[0].id);
      }
    } else {
      const defaultJob: Job = { id: "1", name: "Mina", rate: 12.93, color: "#ec4899" };
      setJobs([defaultJob]);
      setSelectedJobId(defaultJob.id);
      localStorage.setItem("monshift_jobs", JSON.stringify([defaultJob]));
    }

    const savedHistory = localStorage.getItem("monshift_history");
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      if (history[selectedDate]) {
        const day = history[selectedDate];
        setStartTime(day.startTime || "07:00");
        setEndTime(day.endTime || "15:00");
        setBreaks(day.breaks || []);
        setNotes(day.notes || "");
        if (day.jobId) setSelectedJobId(day.jobId);
      }
    }
  }, [selectedDate]);

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
        setNotes(day.notes || "");
        if (day.jobId) setSelectedJobId(day.jobId);
        return;
      }
    }
    setStartTime("07:00");
    setEndTime("15:00");
    setBreaks([{ id: "1", startTime: "", endTime: "" }]);
    setNotes("");
  };

  const handleSave = () => {
    const savedHistory = localStorage.getItem("monshift_history") || "{}";
    const history = JSON.parse(savedHistory);

    history[selectedDate] = {
      date: selectedDate,
      startTime,
      endTime,
      breaks,
      notes,
      jobId: selectedJobId
    };

    localStorage.setItem("monshift_history", JSON.stringify(history));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // تحويل الوقت بالدقائق لحساب الفرق
  const timeToMins = (timeStr: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  // حساب الساعات والمبلغ مع تطبيق فكرة البوزات والخصم التلقائي للزيادة
  const calculateMetrics = () => {
    let startMins = timeToMins(startTime);
    let endMins = timeToMins(endTime);
    if (endMins <= startMins) endMins += 24 * 60;

    let grossMins = endMins - startMins;

    // حساب إجمالي دقائق الاستراحات المدخلة
    let totalBreakMins = 0;
    breaks.forEach(b => {
      if (b.startTime && b.endTime) {
        let bStart = timeToMins(b.startTime);
        let bEnd = timeToMins(b.endTime);
        if (bEnd <= bStart) bEnd += 24 * 60;
        const duration = Math.max(0, bEnd - bStart);
        totalBreakMins += duration;
      }
    });

    // الاستراحة غير المدفوعة التي يجب خصمها (لو إجمالي البوزات عدى الحد الأقصى المسموح به)
    const unpaidBreakMins = Math.max(0, totalBreakMins - maxPaidMinutes);

    // صافي الدقائق = إجمالي وقت الشفت - البوزات الزيادة غير المدفوعة
    const netMins = Math.max(0, grossMins - unpaidBreakMins);
    const hours = netMins / 60;

    const currentJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
    const rate = currentJob ? currentJob.rate : 0;
    const amount = hours * rate;

    const formattedTime = `${Math.floor(netMins / 60)}h${String(netMins % 60).padStart(2, "0")}`;
    return { formattedTime, amount: amount.toFixed(2), totalBreakMins, unpaidBreakMins };
  };

  const metrics = calculateMetrics();

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", paddingBottom: "110px", fontFamily: "sans-serif", background: "#f3f4f6", minHeight: "100vh" }}>
      
      {/* رأس الصفحة مع التاريخ والراتب */}
      <div style={{ background: "#1e3a8a", color: "white", padding: "16px", textAlign: "center", borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px" }}>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => handleDateChange(e.target.value)}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", textAlign: "center", marginBottom: "8px" }}
        />
        <div style={{ fontSize: "13px", color: "#93c5fd" }}>Total Brut: {metrics.amount} €</div>
        <div style={{ fontSize: "28px", fontWeight: "bold", marginTop: "4px" }}>{metrics.formattedTime}</div>
        {metrics.unpaidBreakMins > 0 && (
          <div style={{ fontSize: "11px", color: "#fca5a5", marginTop: "2px" }}>
            (Dont {metrics.unpaidBreakMins} min de pause non payée déduites)
          </div>
        )}
      </div>

      <div style={{ padding: "16px" }}>
        
        {/* اختيار الوظيفة */}
        <div style={{ background: "white", padding: "12px", borderRadius: "8px", marginBottom: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "6px" }}>Lieu de travail (Job):</label>
          <select 
            value={selectedJobId} 
            onChange={(e) => setSelectedJobId(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "15px", background: "white" }}
          >
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.name} ({job.rate} €/h)</option>
            ))}
          </select>
        </div>

        {/* أوقات العمل */}
        <div style={{ background: "white", padding: "12px", borderRadius: "8px", marginBottom: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "14px", color: "#374151" }}>🕒 Horaires de travail</div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Début</span>
              <input 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "16px", background: "#f0fdf4", textAlign: "center", fontWeight: "bold", color: "#166534" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Fin</span>
              <input 
                type="time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "16px", background: "#fef2f2", textAlign: "center", fontWeight: "bold", color: "#991b1b" }}
              />
            </div>
          </div>
        </div>

        {/* الاستراحات (Breaks) بوقت البداية والنهاية */}
        <div style={{ background: "white", padding: "12px", borderRadius: "8px", marginBottom: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontWeight: "bold", fontSize: "14px", color: "#374151" }}>☕ Pauses (Max 2)</span>
            {breaks.length < 2 && (
              <button 
                onClick={() => setBreaks([...breaks, { id: Date.now().toString(), startTime: "", endTime: "" }])}
                style={{ background: "#10b981", color: "white", border: "none", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
              >
                + Ajouter une pause
              </button>
            )}
          </div>

          {breaks.map((b, index) => (
            <div key={b.id} style={{ borderTop: "1px solid #e5e7eb", paddingTop: "8px", marginTop: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", fontWeight: "bold", color: "#4b5563" }}>Pause #{index + 1}</span>
                <button 
                  onClick={() => setBreaks(breaks.filter(item => item.id !== b.id))}
                  style={{ background: "transparent", border: "none", color: "#ef4444", fontSize: "12px", cursor: "pointer" }}
                >
                  Supprimer
                </button>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "6px" }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>Début</span>
                  <input 
                    type="time" 
                    value={b.startTime} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setBreaks(breaks.map(item => item.id === b.id ? { ...item, startTime: val } : item));
                    }}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>Fin</span>
                  <input 
                    type="time" 
                    value={b.endTime} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setBreaks(breaks.map(item => item.id === b.id ? { ...item, endTime: val } : item));
                    }}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px" }}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* تحديد الحد الأقصى للاستراحة المدفوعة */}
          <div style={{ marginTop: "12px", borderTop: "1px solid #e5e7eb", paddingTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#4b5563" }}>Pause payée max (min):</span>
            <input 
              type="number" 
              value={maxPaidMinutes} 
              onChange={(e) => setMaxPaidMinutes(Number(e.target.value))}
              style={{ width: "70px", padding: "6px", borderRadius: "6px", border: "1px solid #d1d5db", textAlign: "center", fontSize: "14px" }}
            />
          </div>
        </div>

        {/* ملاحظات */}
        <div style={{ background: "white", padding: "12px", borderRadius: "8px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ajouter une note..."
            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", minHeight: "60px", resize: "none" }}
          />
        </div>

        {/* زر الحفظ */}
        <button 
          onClick={handleSave}
          style={{ width: "100%", background: "#1e3a8a", color: "white", border: "none", padding: "14px", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
        >
          {saveSuccess ? "✓ Enregistré avec succès !" : "Enregistrer"}
        </button>

      </div>

      <BottomNav active="hours" />
    </main>
  );
}
