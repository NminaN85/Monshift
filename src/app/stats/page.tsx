"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

interface BreakItem { 
  startTime: string; 
  endTime: string; 
  isPaid: boolean; 
}
interface DayRecord {
  date: string;
  startTime: string;
  endTime: string;
  breaks: BreakItem[];
  maxPaidMinutes?: number;
  notes: string;
  jobId?: string;
}
interface Job { id: string; name: string; rate: number; color: string; }

const monthsData: Record<string, string[]> = {
  fr: ["Jan", "Fév", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
};

const texts: Record<string, any> = {
  fr: {
    statsTitle: "Statistiques",
    totalYear: "Revenu Total Annuel",
    totalHours: "Total Heures",
    workedDays: "Jours Travaillés",
    avgRate: "Moyenne / Heure",
    monthlyEvolution: "Évolution Mensuelle",
    jobBreakdown: "Répartition par Lieu de travail",
    noData: "Aucune donnée disponible pour cette année.",
    hoursLabel: "Heures",
    daysUnit: "jours",
    exportBtn: "📄 Exporter les données (CSV)"
  },
  en: {
    statsTitle: "Statistics",
    totalYear: "Total Annual Revenue",
    totalHours: "Total Hours",
    workedDays: "Worked Days",
    avgRate: "Average / Hour",
    monthlyEvolution: "Monthly Evolution",
    jobBreakdown: "Job Breakdown",
    noData: "No data available for this year.",
    hoursLabel: "Hours",
    daysUnit: "days",
    exportBtn: "📄 Export Data (CSV)"
  },
  ar: {
    statsTitle: "الإحصائيات",
    totalYear: "إجمالي الدخل السنوي",
    totalHours: "إجمالي الساعات",
    workedDays: "الأيام المكتملة",
    avgRate: "المتوسط / الساعة",
    monthlyEvolution: "التطور الشهري",
    jobBreakdown: "التوزيع حسب أماكن العمل",
    noData: "لا توجد بيانات متاحة لهذا العام.",
    hoursLabel: "ساعات",
    daysUnit: "أيام",
    exportBtn: "📄 تصدير البيانات (CSV)"
  }
};

export default function StatsPage() {
  const [lang, setLang] = useState("fr");
  const [currentYear, setCurrentYear] = useState(2026);
  const [history, setHistory] = useState<Record<string, DayRecord>>({});
  const [jobs, setJobs] = useState<Job[]>([]);
  const [chartType, setChartType] = useState<"amount" | "hours">("amount");
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("monshift_lang");
    if (savedLang) setLang(savedLang);

    const savedHistory = localStorage.getItem("monshift_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedJobs = localStorage.getItem("monshift_jobs");
    if (savedJobs) setJobs(JSON.parse(savedJobs));
  }, []);

  const t = texts[lang] || texts["fr"];
  const monthsShort = monthsData[lang] || monthsData["fr"];

  const timeToMins = (timeStr: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const calculateDayMetrics = (day: DayRecord) => {
    let startMins = timeToMins(day.startTime);
    let endMins = timeToMins(day.endTime);
    if (endMins <= startMins) endMins += 24 * 60;

    let grossMins = endMins - startMins;
    let totalPaidBreakMins = 0;
    let totalUnpaidBreakMins = 0;

    day.breaks?.forEach(b => {
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

    const maxPaid = day.maxPaidMinutes !== undefined ? day.maxPaidMinutes : 30;
    const excessPaidMins = Math.max(0, totalPaidBreakMins - maxPaid);
    const unpaidMins = totalUnpaidBreakMins + excessPaidMins;

    const netMins = Math.max(0, grossMins - unpaidMins);
    const hours = netMins / 60;

    const job = jobs.find(j => j.id === day.jobId) || jobs[0];
    const rate = job ? job.rate : 0;
    const amount = hours * rate;

    return { netMins, amount, job };
  };

  const getMonthlyData = () => {
    const months = Array(12).fill(0).map(() => ({ mins: 0, amount: 0 }));

    Object.values(history).forEach(day => {
      const d = new Date(day.date);
      if (d.getFullYear() === currentYear) {
        const mIndex = d.getMonth();
        const metrics = calculateDayMetrics(day);
        months[mIndex].mins += metrics.netMins;
        months[mIndex].amount += metrics.amount;
      }
    });

    return months;
  };

  const monthlyData = getMonthlyData();
  const maxVal = Math.max(...monthlyData.map(m => chartType === "amount" ? m.amount : m.mins / 60), 10);

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
  const totalJobAmount = stats.jobBreakdown.reduce((acc, j) => acc + j.amount, 0) || 1;

  // وظيفة تصدير البيانات إلى ملف CSV
  const handleExportCSV = () => {
    const records = Object.values(history).filter(day => new Date(day.date).getFullYear() === currentYear);
    if (records.length === 0) {
      alert("Aucune donnée à exporter pour cette année.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,Date,Job,Debut,Fin,Heures,Montant (EUR)\n";

    records.forEach(day => {
      const metrics = calculateDayMetrics(day);
      const hoursStr = `${Math.floor(metrics.netMins / 60)}h${String(metrics.netMins % 60).padStart(2, "0")}`;
      const row = [
        day.date,
        `"${metrics.job.name}"`,
        day.startTime,
        day.endTime,
        hoursStr,
        metrics.amount.toFixed(2)
      ].join(",");

      csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `monshift_report_${currentYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", paddingBottom: "90px", fontFamily: "sans-serif", background: "#f3f4f6", minHeight: "100vh", direction: lang === "ar" ? "rtl" : "ltr" }}>
      
      <header style={{ background: "#1e3a8a", color: "white", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setCurrentYear(currentYear - 1)} style={{ background: "transparent", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}>❮</button>
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>{t.statsTitle} {currentYear}</div>
        <button onClick={() => setCurrentYear(currentYear + 1)} style={{ background: "transparent", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}>❯</button>
      </header>

      <div style={{ padding: "16px" }}>
        
        {/* زر التصدير (Export) */}
        <button 
          onClick={handleExportCSV}
          style={{ width: "100%", background: "#059669", color: "white", border: "none", padding: "12px", borderRadius: "10px", fontSize: "15px", fontWeight: "bold", cursor: "pointer", marginBottom: "16px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
        >
          {t.exportBtn}
        </button>

        <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", color: "white", padding: "20px", borderRadius: "12px", marginBottom: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
          <div style={{ fontSize: "13px", opacity: 0.8, marginBottom: "4px" }}>{t.totalYear}</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "12px" }}>{stats.totalAmount} €</div>
          
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "12px" }}>
            <div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>{t.totalHours}</div>
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>{stats.formattedTime}</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>{t.workedDays}</div>
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>{stats.totalDays} {t.daysUnit}</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>{t.avgRate}</div>
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>{stats.avgRate} €/h</div>
            </div>
          </div>
        </div>

        <div style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ fontWeight: "bold", fontSize: "15px", color: "#374151" }}>{t.monthlyEvolution}</div>
            <div style={{ display: "flex", background: "#f3f4f6", padding: "3px", borderRadius: "8px" }}>
              <button 
                onClick={() => setChartType("amount")} 
                style={{ padding: "4px 10px", fontSize: "12px", fontWeight: "bold", border: "none", background: chartType === "amount" ? "#1e3a8a" : "transparent", color: chartType === "amount" ? "white" : "#4b5563", borderRadius: "6px", cursor: "pointer" }}
              >
                €
              </button>
              <button 
                onClick={() => setChartType("hours")} 
                style={{ padding: "4px 10px", fontSize: "12px", fontWeight: "bold", border: "none", background: chartType === "hours" ? "#1e3a8a" : "transparent", color: chartType === "hours" ? "white" : "#4b5563", borderRadius: "6px", cursor: "pointer" }}
              >
                {t.hoursLabel}
              </button>
            </div>
          </div>

          <div style={{ height: "180px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "4px", paddingTop: "25px", borderBottom: "1px solid #e5e7eb", position: "relative" }}>
            {monthlyData.map((data, index) => {
              const val = chartType === "amount" ? data.amount : data.mins / 60;
              const heightPercent = maxVal > 0 ? (val / maxVal) * 100 : 0;
              const isSelected = activeTooltip === index;

              return (
                <div 
                  key={index} 
                  onClick={() => setActiveTooltip(isSelected ? null : index)}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", cursor: "pointer", position: "relative" }}
                >
                  {isSelected && (
                    <div style={{ position: "absolute", bottom: `${Math.max(heightPercent, 15)}%`, background: "#1e3a8a", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "10px", whiteSpace: "nowrap", zIndex: 10, boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
                      {monthsShort[index]}: {chartType === "amount" ? `${val.toFixed(2)} €` : `${Math.floor(data.mins / 60)}h${String(data.mins % 60).padStart(2, "0")}`}
                    </div>
                  )}

                  <div style={{ 
                    width: "100%", 
                    maxWidth: "18px", 
                    height: `${Math.max(heightPercent, 4)}%`, 
                    background: isSelected ? "#2563eb" : val > 0 ? "#3b82f6" : "#e5e7eb", 
                    borderTopLeftRadius: "4px", 
                    borderTopRightRadius: "4px", 
                    transition: "all 0.2s ease" 
                  }}></div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px" }}>
            {monthsShort.map((m, index) => (
              <div key={index} style={{ flex: 1, textAlign: "center", fontSize: "9px", color: activeTooltip === index ? "#1e3a8a" : "#6b7280", fontWeight: activeTooltip === index ? "bold" : "normal" }}>
                {m}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "16px" }}>
          <div style={{ fontWeight: "bold", fontSize: "15px", color: "#374151", marginBottom: "12px" }}>{t.jobBreakdown}</div>
          
          {stats.jobBreakdown.length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: "14px", textAlign: "center", padding: "20px" }}>{t.noData}</div>
          ) : (
            stats.jobBreakdown.map((jb, index) => {
              const percent = (jb.amount / totalJobAmount) * 100;
              return (
                <div key={index} style={{ marginBottom: "14px", borderBottom: index < stats.jobBreakdown.length - 1 ? "1px solid #e5e7eb" : "none", paddingBottom: index < stats.jobBreakdown.length - 1 ? "10px" : "0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: jb.color }}></div>
                      <span style={{ fontWeight: "bold", fontSize: "14px", color: "#1f2937" }}>{jb.name}</span>
                    </div>
                    <div style={{ fontWeight: "bold", fontSize: "14px", color: "#0284c7" }}>{jb.amount.toFixed(2)} € ({percent.toFixed(0)}%)</div>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "#f3f4f6", borderRadius: "4px", overflow: "hidden", marginBottom: "4px" }}>
                    <div style={{ width: `${percent}%`, height: "100%", background: jb.color, borderRadius: "4px", transition: "width 0.3s ease" }}></div>
                  </div>
                  <div style={{ fontSize: "11px", color: "#6b7280" }}>{Math.floor(jb.mins / 60)}h{String(jb.mins % 60).padStart(2, "0")} travaillées</div>
                </div>
              );
            })
          )}
        </div>

      </div>

      <BottomNav active="stats" />
    </main>
  );
}
