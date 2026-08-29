"use client";


import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

interface BreakItem { 
  id: string; 
  startTime: string; 
  endTime: string; 
  isPaid: boolean;
}

interface ShiftRecord {
  id: string;
  jobId: string;
  startTime: string;
  endTime: string;
  breaks: BreakItem[];
  maxPaidMinutes: number;
  notes: string;
}

interface Job {
  id: string;
  name: string;
  rate: number;
  color: string;
}

export default function HeuresPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [shifts, setShifts] = useState<ShiftRecord[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState("€");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const savedSymbol = localStorage.getItem("monshift_symbol");
    if (savedSymbol) {
      setCurrencySymbol(savedSymbol);
    }

    const savedJobs = localStorage.getItem("monshift_jobs");
    if (savedJobs) {
      const parsedJobs: Job[] = JSON.parse(savedJobs);
      setJobs(parsedJobs);
    }

    const editDate = localStorage.getItem("monshift_edit_date");
    const now = new Date();
    const todayStr = editDate || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    if (editDate) localStorage.removeItem("monshift_edit_date");
    
    setSelectedDate(todayStr);
    loadDayShifts(todayStr);
  }, []);

  const loadDayShifts = (dateStr: string) => {
    const savedHistory = localStorage.getItem("monshift_history");
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      if (history[dateStr]) {
        const record = history[dateStr];
        if (Array.isArray(record)) {
          setShifts(record);
        } else if (record.startTime) {
          setShifts([{
            id: Date.now().toString(),
            jobId: record.jobId || (jobs[0]?.id ?? ""),
            startTime: record.startTime,
            endTime: record.endTime,
            breaks: record.breaks || [],
            maxPaidMinutes: record.maxPaidMinutes ?? 30,
            notes: record.notes || ""
          }]);
        } else {
          setShifts([]);
        }
        return;
      }
    }
    setShifts([]);
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    loadDayShifts(newDate);
  };

  const addShift = () => {
    const defaultJobId = jobs[0]?.id || "";
    setShifts([
      ...shifts,
      {
        id: Date.now().toString(),
        jobId: defaultJobId,
        startTime: "",
        endTime: "",
        breaks: [],
        maxPaidMinutes: 30,
        notes: ""
      }
    ]);
  };

  const updateShift = (id: string, field: keyof ShiftRecord, value: any) => {
    setShifts(shifts.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = () => {
    const history = JSON.parse(localStorage.getItem("monshift_history") || "{}");
    history[selectedDate] = shifts;
    localStorage.setItem("monshift_history", JSON.stringify(history));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const timeToMins = (timeStr: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const calculateTotalDayMetrics = () => {
    let totalNetMins = 0;
    let totalAmount = 0;

    shifts.forEach(shift => {
      if (!shift.startTime || !shift.endTime) return;
      let startMins = timeToMins(shift.startTime);
      let endMins = timeToMins(shift.endTime);
      if (endMins <= startMins) endMins += 24 * 60;

      let grossMins = endMins - startMins;
      let totalPaidBreakMins = 0;
      let totalUnpaidBreakMins = 0;

      shift.breaks?.forEach(b => {
        if (b.startTime && b.endTime) {
          let bStart = timeToMins(b.startTime);
          let bEnd = timeToMins(b.endTime);
          if (bEnd <= bStart) bEnd += 24 * 60;
          const duration = Math.max(0, bEnd - bStart);
          if (!b.isPaid) totalUnpaidBreakMins += duration;
          else totalPaidBreakMins += duration;
        }
      });

      const excessPaidMins = Math.max(0, totalPaidBreakMins - Number(shift.maxPaidMinutes ?? 30));
      const unpaidMins = totalUnpaidBreakMins + excessPaidMins;
      const netMins = Math.max(0, grossMins - unpaidMins);
      const hours = netMins / 60;

      const currentJob = jobs.find(j => j.id === shift.jobId) || jobs[0];
      const rate = currentJob ? currentJob.rate : 0;
      
      totalNetMins += netMins;
      totalAmount += hours * rate;
    });

    const formattedTime = `${Math.floor(totalNetMins / 60)}h${String(totalNetMins % 60).padStart(2, "0")}`;
    return { formattedTime, amount: totalAmount.toFixed(2) };
  };

  const metrics = calculateTotalDayMetrics();

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", paddingBottom: "110px", fontFamily: "sans-serif", background: "#f3f4f6", minHeight: "100vh" }}>
      
      <div style={{ background: "#1e3a8a", color: "white", padding: "16px", textAlign: "center", borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px" }}>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => handleDateChange(e.target.value)}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", textAlign: "center", marginBottom: "8px", outline: "none", cursor: "pointer" }}
        />
        <div style={{ fontSize: "13px", color: "#93c5fd" }}>Total Brut: {metrics.amount} {currencySymbol}</div>
        <div style={{ fontSize: "28px", fontWeight: "bold", marginTop: "4px" }}>{metrics.formattedTime}</div>
      </div>

      <div style={{ padding: "16px" }}>
        
        <button 
          onClick={addShift}
          style={{ width: "100%", background: "#10b981", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontSize: "15px", fontWeight: "bold", cursor: "pointer", marginBottom: "16px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
        >
          + Ajouter un Shift / وردية
        </button>

        {shifts.length === 0 ? (
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", textAlign: "center", color: "#6b7280", marginBottom: "16px" }}>
            Aucun shift enregistré pour ce jour. Cliquez sur le bouton pour ajouter.
          </div>
        ) : (
          shifts.map((shift, sIndex) => {
            const currentJob = jobs.find(j => j.id === shift.jobId);
            return (
              <div key={shift.id} style={{ background: "white", padding: "14px", borderRadius: "10px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderLeft: `6px solid ${currentJob?.color || "#3b82f6"}` }}>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontWeight: "bold", color: "#1e3a8a", fontSize: "15px" }}>Shift #{sIndex + 1}</span>
                  <button 
                    onClick={() => setShifts(shifts.filter(s => s.id !== shift.id))}
                    style={{ background: "transparent", border: "none", color: "#ef4444", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
                  >
                    Supprimer
                  </button>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <label style={{ fontSize: "12px", color: "#6b7280", display: "block", marginBottom: "4px" }}>Lieu de travail (Job):</label>
                  <select 
                    value={shift.jobId} 
                    onChange={(e) => updateShift(shift.id, "jobId", e.target.value)}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", background: "white", outline: "none" }}
                  >
                    {jobs.length === 0 ? (
                      <option value="">Aucun job (Ajouter un job)</option>
                    ) : (
                      jobs.map(job => (
                        <option key={job.id} value={job.id}>{job.name} ({job.rate} {currencySymbol}/h)</option>
                      ))
                    )}
                  </select>
                </div>

                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: "11px", color: "#6b7280" }}>Début</span>
                    <input 
                      type="time" 
                      value={shift.startTime} 
                      onChange={(e) => updateShift(shift.id, "startTime", e.target.value)}
                      style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "15px", background: "#f0fdf4", textAlign: "center", fontWeight: "bold", color: "#166534", outline: "none" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: "11px", color: "#6b7280" }}>Fin</span>
                    <input 
                      type="time" 
                      value={shift.endTime} 
                      onChange={(e) => updateShift(shift.id, "endTime", e.target.value)}
                      style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "15px", background: "#fef2f2", textAlign: "center", fontWeight: "bold", color: "#991b1b", outline: "none" }}
                    />
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "8px", marginTop: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "bold", color: "#374151" }}>☕ Pauses</span>
                    {shift.breaks.length < 2 && (
                      <button 
                        onClick={() => {
                          const newBreaks = [...shift.breaks, { id: Date.now().toString(), startTime: "", endTime: "", isPaid: false }];
                          updateShift(shift.id, "breaks", newBreaks);
                        }}
                        style={{ background: "#059669", color: "white", border: "none", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontWeight: "bold" }}
                      >
                        + Pause
                      </button>
                    )}
                  </div>

                  {shift.breaks.map((b) => (
                    <div key={b.id} style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "6px" }}>
                      <input 
                        type="time" 
                        value={b.startTime} 
                        onChange={(e) => {
                          const val = e.target.value;
                          const updated = shift.breaks.map(item => item.id === b.id ? { ...item, startTime: val } : item);
                          updateShift(shift.id, "breaks", updated);
                        }}
                        style={{ flex: 1, padding: "6px", borderRadius: "4px", border: "1px solid #d1d5db", fontSize: "13px" }}
                      />
                      <input 
                        type="time" 
                        value={b.endTime} 
                        onChange={(e) => {
                          const val = e.target.value;
                          const updated = shift.breaks.map(item => item.id === b.id ? { ...item, endTime: val } : item);
                          updateShift(shift.id, "breaks", updated);
                        }}
                        style={{ flex: 1, padding: "6px", borderRadius: "4px", border: "1px solid #d1d5db", fontSize: "13px" }}
                      />
                      <label style={{ fontSize: "11px", display: "flex", alignItems: "center", gap: "2px" }}>
                        <input 
                          type="checkbox" 
                          checked={b.isPaid} 
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const updated = shift.breaks.map(item => item.id === b.id ? { ...item, isPaid: checked } : item);
                            updateShift(shift.id, "breaks", updated);
                          }}
                        /> Payé
                      </label>
                      <button 
                        onClick={() => {
                          const updated = shift.breaks.filter(item => item.id !== b.id);
                          updateShift(shift.id, "breaks", updated);
                        }}
                        style={{ background: "transparent", border: "none", color: "#ef4444", fontSize: "12px", cursor: "pointer" }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* حد الاستراحات المدفوعة للوردية */}
                  <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#4b5563" }}>Max pauses payées (min):</span>
                    <input 
                      type="number" 
                      value={shift.maxPaidMinutes} 
                      onChange={(e) => updateShift(shift.id, "maxPaidMinutes", Number(e.target.value))}
                      style={{ width: "60px", padding: "4px", borderRadius: "4px", border: "1px solid #d1d5db", fontSize: "13px", textAlign: "center" }}
                    />
                  </div>
                </div>

              </div>
            );
          })
        )}

        <button 
          onClick={handleSave}
          style={{ width: "100%", background: "#1e3a8a", color: "white", border: "none", padding: "14px", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", marginTop: "10px" }}
        >
          {saveSuccess ? "✓ Enregistré avec succès !" : "Enregistrer"}
        </button>

      </div>

      <BottomNav active="hours" />
    </main>
  );
}
