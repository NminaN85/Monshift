"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

interface BreakItem {
  id: string;
  duration: number;
  isPaid: boolean;
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
  const [breaks, setBreaks] = useState<BreakItem[]>([
    { id: "1", duration: 30, isPaid: false }
  ]);
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
    // افتراضي لو اليوم مش مسجل
    setStartTime("07:00");
    setEndTime("15:00");
    setBreaks([{ id: "1", duration: 30, isPaid: false }]);
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

  // حساب الساعات والمبلغ
  const calculateMetrics = () => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    let startMins = startH * 60 + startM;
    let endMins = endH * 60 + endM;
    if (endMins <= startMins) endMins += 24 * 60;

    let grossMins = endMins - startMins;
    let unpaidMins = 0;
    breaks.forEach(b => {
      if (!b.isPaid) unpaidMins += Number(b.duration || 0);
    });

    const netMins = Math.max(0, grossMins - unpaidMins);
    const hours = netMins / 60;

    const currentJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
    const rate = currentJob ? currentJob.rate : 0;
    const amount = hours * rate;

    const formattedTime = `${Math.floor(netMins / 60)}h${String(netMins % 60).padStart(2, "0")}`;
    return { formattedTime, amount: amount.toFixed(2), currentJob };
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

        {/* الاستراحات (Breaks) */}
        <div style={{ background: "white", padding: "12px", borderRadius: "8px", marginBottom: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontWeight: "bold", fontSize: "14px", color: "#374151" }}>☕ Pauses (max 2)</span>
            {breaks.length < 2 && (
              <button 
                onClick={() => setBreaks([...breaks, { id: Date.now().toString(), duration: 15, isPaid: false }])}
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
                <input 
                  type="number" 
                  value={b.duration} 
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setBreaks(breaks.map(item => item.id === b.id ? { ...item, duration: val } : item));
                  }}
                  placeholder="Minutes"
                  style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                />
                <label style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <input 
                    type="checkbox" 
                    checked={b.isPaid} 
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setBreaks(breaks.map(item => item.id === b.id ? { ...item, isPaid: checked } : item));
                    }}
                  />
                  Pause payée
                </label>
              </div>
            </div>
          ))}
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

        {/* زر الحفظ البارز والواضح */}
        <button 
          onClick={handleSave}
          style={{ width: "100%", background: "#1e3a8a", color: "white", border: "none", padding: "14px", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
        >
          {saveSuccess ? "✓ Enregistré avec succès !" : "Enregistrer"}
        </button>

      </div>

      <BottomNav active="heures" />
    </main>
  );
}
