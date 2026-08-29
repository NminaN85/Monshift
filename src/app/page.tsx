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

export default function HeuresPage() {
  const [selectedDate, setSelectedDate] = useState("2026-08-29");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [breaks, setBreaks] = useState<BreakItem[]>([]);
  const [maxPaidMinutes, setMaxPaidMinutes] = useState<number>(30);
  const [notes, setNotes] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState("€");

  useEffect(() => {
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
        const dayData = history[todayStr];
        setStartTime(dayData.startTime || "");
        setEndTime(dayData.endTime || "");
        setBreaks(dayData.breaks || []);
        if (dayData.maxPaidMinutes !== undefined) setMaxPaidMinutes(dayData.maxPaidMinutes);
        setNotes(dayData.notes || "");
        if (dayData.jobId) setSelectedJobId(dayData.jobId);
      }
    }
  }, []);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const savedHistory = localStorage.getItem("monshift_history");
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      if (history[newDate]) {
        const dayData = history[newDate];
        setStartTime(dayData.startTime || "");
        setEndTime(dayData.endTime || "");
        setBreaks(dayData.breaks || []);
        if (dayData.maxPaidMinutes !== undefined) setMaxPaidMinutes(dayData.maxPaidMinutes);
        setNotes(dayData.notes || "");
        if (dayData.jobId) setSelectedJobId(dayData.jobId);
        return;
      }
    }
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
    let startMins = timeToMins(startTime);
    let endMins = timeToMins(endTime);
    if (endMins <= startMins) endMins += 24 * 60;

    let grossMins = startTime && endTime ? endMins - startMins : 0;
    
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
    <main style={{ maxWidth: "480px", margin: "0 auto", paddingBottom: "110px", fontFamily: "sans-serif", background: "#f3f4f6", minHeight: "100vh" }}>
      
      {/* رأس الصفحة الفخم */}
      <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", color: "white", padding: "20px 16px", textAlign: "center", borderBottomLeftRadius: "24px", borderBottomRightRadius: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => handleDateChange(e.target.value)}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "8px 14px", borderRadius: "10px", fontSize: "15px", fontWeight: "bold", textAlign: "center", marginBottom: "10px", cursor: "pointer", outline: "none" }}
        />
        <div style={{ fontSize: "13px", color: "#bfdbfe", fontWeight: "500" }}>Total Estimé: {metrics.amount} {currencySymbol}</div>
        <div style={{ fontSize: "32px", fontWeight: "bold", marginTop: "2px", letterSpacing: "-0.5px" }}>{metrics.formattedTime}</div>
      </div>

      <div style={{ padding: "16px" }}>
        
        {/* اختيار مكان العمل */}
        <div style={{ background: "white", padding: "14px", borderRadius: "14px", marginBottom: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <label style={{ fontSize: "12px", fontWeight: "bold", color: "#6b7280", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>Lieu de travail (Job)</label>
          <select 
            value={selectedJobId} 
            onChange={(e) => setSelectedJobId(e.target.value)}
            style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "15px", background: "#f9fafb", outline: "none", fontWeight: "500" }}
          >
            {jobs.length === 0 ? (
              <option value="">Aucun lieu de travail (Ajouter un job)</option>
            ) : (
              jobs.map(job => (
                <option key={job.id} value={job.id}>{job.name} ({job.rate} {currencySymbol}/h)</option>
              ))
            )}
          </select>
        </div>

        {/* مواعيد الشفت */}
        <div style={{ background: "white", padding: "14px", borderRadius: "14px", marginBottom: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ fontWeight: "bold", marginBottom: "10px", fontSize: "14px", color: "#374151" }}>🕒 Horaires de travail</div>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "12px", color: "#6b7280", display: "block", marginBottom: "4px" }}>Début</span>
              <input 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "16px", background: "#f0fdf4", textAlign: "center", fontWeight: "bold", color: "#166534", outline: "none" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "12px", color: "#6b7280", display: "block", marginBottom: "4px" }}>Fin</span>
              <input 
                type="time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "16px", background: "#fef2f2", textAlign: "center", fontWeight: "bold", color: "#991b1b", outline: "none" }}
              />
            </div>
          </div>
        </div>

        {/* قسم الاستراحات (البوزات) */}
        <div style={{ background: "white", padding: "14px", borderRadius: "14px", marginBottom: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold", fontSize: "14px", color: "#374151" }}>☕ Pauses (max 2)</span>
            {breaks.length < 2 && (
              <button 
                onClick={() => setBreaks([...breaks, { id: Date.now().toString(), startTime: "", endTime: "", isPaid: false }])}
                style={{ background: "#10b981", color: "white", border: "none", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
              >
                + Ajouter une pause
              </button>
            )}
          </div>

          {breaks.map((b, index) => (
            <div key={b.id} style={{ borderTop: "1px solid #f3f4f6", paddingTop: "10px", marginTop: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", fontWeight: "bold", color: "#4b5563" }}>Pause #{index + 1}</span>
                <button 
                  onClick={() => setBreaks(breaks.filter(item => item.id !== b.id))}
                  style={{ background: "transparent", border: "none", color: "#ef4444", fontSize: "12px", cursor: "pointer", fontWeight: "bold" }}
                >
                  Supprimer
                </button>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "8px" }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>Début</span>
                  <input 
                    type="time" 
                    value={b.startTime} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setBreaks(breaks.map(item => item.id === b.id ? { ...item, startTime: val } : item));
                    }}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", background: "#f9fafb" }}
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
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", background: "#f9fafb" }}
                  />
                </div>
              </div>
              
              <div style={{ marginTop: "8px" }}>
                <label style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", color: "#374151", cursor: "pointer", fontWeight: "500" }}>
                  <input 
                    type="checkbox" 
                    checked={b.isPaid} 
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setBreaks(breaks.map(item => item.id === b.id ? { ...item, isPaid: checked } : item));
                    }}
                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  Pause payée
                </label>
              </div>
            </div>
          ))}

          <div style={{ marginTop: "14px", borderTop: "1px solid #f3f4f6", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "#4b5563", fontWeight: "bold" }}>Max pauses payées (Total min):</span>
            <input 
              type="number" 
              value={maxPaidMinutes} 
              onChange={(e) => setMaxPaidMinutes(Number(e.target.value))}
              style={{ width: "80px", padding: "8px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", textAlign: "center", fontWeight: "bold", background: "#f9fafb", outline: "none" }}
            />
          </div>
        </div>

        {/* ملاحظات */}
        <div style={{ background: "white", padding: "14px", borderRadius: "14px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ajouter une note..."
            style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", minHeight: "70px", resize: "none", outline: "none", background: "#f9fafb" }}
          />
        </div>

        {/* زر الحفظ */}
        <button 
          onClick={handleSave}
          style={{ width: "100%", background: "#1e3a8a", color: "white", border: "none", padding: "16px", borderRadius: "14px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 10px rgba(30,58,138,0.2)" }}
        >
          {saveSuccess ? "✓ Enregistré avec succès !" : "Enregistrer"}
        </button>

      </div>

      <BottomNav active="hours" />
    </main>
  );
}
