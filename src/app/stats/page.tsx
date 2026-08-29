"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

interface BreakItem { duration: number; isPaid: boolean; }
interface DayRecord {
  date: string;
  startTime: string;
  endTime: string;
  breaks: BreakItem[];
  notes: string;
  jobId?: string;
}
interface Job { id: string; name: string; rate: number; color: string; }

export default function StatsPage() {
  const [currentYear, setCurrentYear] = useState(2026);
  const [history, setHistory] = useState<Record<string, DayRecord>>({});
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("monshift_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedJobs = localStorage.getItem("monshift_jobs");
    if (savedJobs) setJobs(JSON.parse(savedJobs));
  }, []);

  const calculateDayMetrics = (day: DayRecord) => {
    const [startH, startM] = day.startTime.split(":").map(Number);
    const [endH, endM] = day.endTime.split(":").map(Number);
    let startMins = startH * 60 + startM;
    let endMins = endH * 60 + endM;
    if (endMins <= startMins) endMins += 24 * 60;

    let grossMins = endMins - startMins;
    let unpaidMins = 0;
    day.breaks?.forEach(b => { if (!b.isPaid) unpaidMins += Number(b.duration || 0); });

    const netMins = Math.max(0, grossMins - unpaidMins);
    const hours = netMins / 60;

    const job = jobs.find(j => j.id === day.jobId) || jobs[0];
    const rate = job ? job.rate : 0;
    const amount = hours * rate;

    return { netMins, amount, job };
  };

  // حساب إحصائيات العام
  const getYearStats = () => {
    let totalMins = 0;
    let totalAmount = 0;
    let totalDays = 0;
    const jobBreakdown: Record<string, { name: string; color: string; mins: number; amount: number }> = {};

    Object.values(history).forEach(day => {
      const d = new Date(day.date);
      if (d.getFullYear() === currentYear) {
        const metrics = calculateDayMetrics(day);
        totalMins += metrics.netMins;
        totalAmount += metrics.amount;
        totalDays++;

        const jobId = day.jobId || metrics.job?.id || "default";
        const jobName = metrics.job?.name || "Job";
        const jobColor = metrics.job?.color || "#3b82f6";

        if (!jobBreakdown[jobId]) {
          jobBreakdown[jobId] = { name: jobName, color: jobColor, mins: 0, amount: 0 };
        }
        jobBreakdown[jobId].mins += metrics.netMins;
        jobBreakdown[jobId].amount += metrics.amount;
      }
    });

    const totalHours = totalMins / 60;
    const avgRate = totalHours > 0 ? totalAmount / totalHours : 0;

    return {
      totalMins,
      formattedTime: `${Math.floor(totalMins / 60)}h${String(totalMins % 60).padStart(2, "0")}`,
      totalAmount: totalAmount.toFixed(2),
      totalDays,
      avgRate: avgRate.toFixed(2),
      jobBreakdown: Object.values(jobBreakdown)
    };
  };

  const stats = getYearStats();

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", paddingBottom: "90px", fontFamily: "sans-serif", background: "#f3f4f6", minHeight: "100vh" }}>
      
      {/* رأس الصفحة */}
      <header style={{ background: "#1e3a8a", color: "white", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setCurrentYear(currentYear - 1)} style={{ background: "transparent", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}>❮</button>
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>Statistiques {currentYear}</div>
        <button onClick={() => setCurrentYear(currentYear + 1)} style={{ background: "transparent", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}>❯</button>
      </header>

      <div style={{ padding: "16px" }}>
        
        {/* البطاقة الرئيسية للإجماليات */}
        <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", color: "white", padding: "20px", borderRadius: "12px", marginBottom: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
          <div style={{ fontSize: "13px", opacity: 0.8, marginBottom: "4px" }}>Revenu Total Annuel</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "12px" }}>{stats.totalAmount} €</div>
          
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "12px" }}>
            <div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>Total Heures</div>
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>{stats.formattedTime}</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>Jours Travaillés</div>
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>{stats.totalDays} jours</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>Moyenne / Heure</div>
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>{stats.avgRate} €/h</div>
            </div>
          </div>
        </div>

        {/* تفاصيل حسب الوظيفة */}
        <div style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "16px" }}>
          <div style={{ fontWeight: "bold", fontSize: "15px", color: "#374151", marginBottom: "12px" }}>Répartition par Lieu de travail</div>
          
          {stats.jobBreakdown.length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: "14px", textAlign: "center", padding: "20px" }}>Aucune donnée disponible pour cette année.</div>
          ) : (
            stats.jobBreakdown.map((jb, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: index < stats.jobBreakdown.length - 1 ? "1px solid #e5e7eb" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: jb.color }}></div>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "14px", color: "#1f2937" }}>{jb.name}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>{Math.floor(jb.mins / 60)}h{String(jb.mins % 60).padStart(2, "0")}</div>
                  </div>
                </div>
                <div style={{ fontWeight: "bold", fontSize: "15px", color: "#0284c7" }}>{jb.amount.toFixed(2)} €</div>
              </div>
            ))
          )}
        </div>

      </div>

      <BottomNav active="stats" />
    </main>
  );
}
