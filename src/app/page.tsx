"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

interface BreakItem {
  duration: number;
  isPaid: boolean;
}

interface Job {
  id: string;
  name: string;
  rate: number;
  color: string;
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState("2026-08-17");
  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("15:00");
  const [breaks, setBreaks] = useState<BreakItem[]>([{ duration: 30, isPaid: false }]);
  const [notes, setNotes] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  useEffect(() => {
    const savedJobs = localStorage.getItem("monshift_jobs");
    if (savedJobs) {
      const parsedJobs = JSON.parse(savedJobs);
      setJobs(parsedJobs);
      if (parsedJobs.length > 0) setSelectedJobId(parsedJobs[0].id);
    }
  }, []);

  const calculateTotals = () => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    let startTotalMins = startH * 60 + startM;
    let endTotalMins = endH * 60 + endM;

    if (endTotalMins <= startTotalMins) {
      endTotalMins += 24 * 60;
    }

    const grossMins = endTotalMins - startTotalMins;
    let unpaidBreakMins = 0;
    breaks.forEach((b) => {
      if (!b.isPaid) unpaidBreakMins += Number(b.duration || 0);
    });

    const netMins = Math.max(0, grossMins - unpaidBreakMins);
    const hours = netMins / 60;

    const currentJob = jobs.find((j) => j.id === selectedJobId);
    const rate = currentJob ? currentJob.rate : 0;
    const totalBrut = hours * rate;

    const formattedHours = `${String(Math.floor(netMins / 60)).padStart(2, "0")}h${String(netMins % 60).padStart(2, "0")}`;

    return {
      formattedHours,
      totalBrut: totalBrut.toFixed(2) + " €",
    };
  };

  const totals = calculateTotals();
  const currentJob = jobs.find((j) => j.id === selectedJobId);

  const addBreak = () => {
    if (breaks.length < 2) setBreaks([...breaks, { duration: 15, isPaid: false }]);
  };

  const updateBreak = (index: number, field: keyof BreakItem, value: any) => {
    const updated = [...breaks];
    updated[index] = { ...updated[index], [field]: value };
    setBreaks(updated);
  };

  const removeBreak = (index: number) => {
    setBreaks(breaks.filter((_, i) => i !== index));
  };

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", padding: "16px", fontFamily: "sans-serif", paddingBottom: "90px", background: "#f3f4f6", minHeight: "100vh" }}>
      <header style={{ background: "#1e3a8a", color: "white", padding: "14px", borderRadius: "12px", textAlign: "center", marginBottom: "16px", borderLeft: currentJob ? `6px solid ${currentJob.color}` : "none" }}>
        <div style={{ marginBottom: "6px" }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "4px 8px", borderRadius: "6px", fontSize: "13px", fontWeight: "bold", textAlign: "center" }}
          />
        </div>
        <div style={{ fontSize: "12px", color: "#34d399" }}>Total Brut: <strong style={{ color: "white" }}>{totals.totalBrut}</strong></div>
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>{totals.formattedHours}</div>
      </header>

      <section style={{ background: "white", padding: "14px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", marginBottom: "16px" }}>
        <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "6px" }}>مكان العمل (Job):</label>
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px", background: "#f9fafb" }}
        >
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.name} ({job.rate} €/h)
            </option>
          ))}
        </select>
      </section>

      <section style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "15px", marginBottom: "12px", color: "#374151" }}>⏱️ أوقات العمل</h3>
        <div style={{ display: "flex", gap: "12px", justifyContent: "space-between" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "12px", color: "#6b7280", display: "block", marginBottom: "4px" }}>البداية</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "16px", textAlign: "center", background: "#ecfdf5", color: "#065f46", fontWeight: "bold", boxSizing: "border-box" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "12px", color: "#6b7280", display: "block", marginBottom: "4px" }}>النهاية</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "16px", textAlign: "center", background: "#fef2f2", color: "#991b1b", fontWeight: "bold", boxSizing: "border-box" }} />
          </div>
        </div>
      </section>

      <section style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ fontSize: "15px", color: "#374151", margin: 0 }}>☕ الاستراحات</h3>
          {breaks.length < 2 && (
            <button onClick={addBreak} style={{ background: "#10b981", color: "white", border: "none", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>+ بوز جديد</button>
          )}
        </div>

        {breaks.map((b, index) => (
          <div key={index} style={{ background: "#f9fafb", padding: "10px", borderRadius: "8px", marginBottom: "10px", border: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "13px", fontWeight: "bold", color: "#4b5563" }}>البوز #{index + 1}</span>
              <button onClick={() => removeBreak(index)} style={{ background: "transparent", border: "none", color: "#ef4444", fontSize: "12px", cursor: "pointer" }}>حذف</button>
            </div>
            <div style={{ marginBottom: "6px" }}>
              <input type="number" placeholder="المدة بالدقائق" value={b.duration} onChange={(e) => updateBreak(index, "duration", Number(e.target.value))} style={{ width: "100%", padding: "6px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer", color: "#1f2937" }}>
              <input type="checkbox" checked={b.isPaid} onChange={(e) => updateBreak(index, "isPaid", e.target.checked)} style={{ width: "15px", height: "15px", accentColor: "#10b981" }} />
              <span>Pause payée (مدفوعة)</span>
            </label>
          </div>
        ))}
      </section>

      <div style={{ marginBottom: "20px" }}>
        <input type="text" placeholder="إضافة ملاحظة..." value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box", background: "white" }} />
      </div>

      <BottomNav active="hours" />
    </main>
  );
}
