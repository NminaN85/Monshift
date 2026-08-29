"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

interface BreakItem { duration: number; isPaid: boolean; }
interface DayRecord {
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  breaks: BreakItem[];
  notes: string;
  jobId?: string;
}
interface Job { id: string; name: string; rate: number; color: string; }

const monthsData: Record<string, string[]> = {
  fr: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
};

const uiTexts: Record<string, any> = {
  fr: { totalYear: "Total", totalMonth: "Total", noRecord: "-", dateFormat: "fr-FR" },
  en: { totalYear: "Total", totalMonth: "Total", noRecord: "-", dateFormat: "en-US" },
  ar: { totalYear: "المجموع الكلي", totalMonth: "المجموع", noRecord: "-", dateFormat: "ar-SA" }
};

export default function CalendarPage() {
  const [lang, setLang] = useState("fr");
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [history, setHistory] = useState<Record<string, DayRecord>>({});
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const savedLang = localStorage.getItem("monshift_lang");
    if (savedLang) setLang(savedLang);

    const savedHistory = localStorage.getItem("monshift_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedJobs = localStorage.getItem("monshift_jobs");
    if (savedJobs) setJobs(JSON.parse(savedJobs));
  }, []);

  const monthsList = monthsData[lang] || monthsData["fr"];
  const t = uiTexts[lang] || uiTexts["fr"];

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

    const formattedTime = `${Math.floor(netMins / 60)}h${String(netMins % 60).padStart(2, "0")}`;
    return { netMins, formattedTime, amount, job };
  };

  const getMonthStats = (year: number, monthIndex: number) => {
    let totalMins = 0;
    let totalAmount = 0;
    const jobBreakdown: Record<string, { name: string; color: string; mins: number; amount: number }> = {};

    Object.values(history).forEach(day => {
      const d = new Date(day.date);
      if (d.getFullYear() === year && d.getMonth() === monthIndex) {
        const metrics = calculateDayMetrics(day);
        totalMins += metrics.netMins;
        totalAmount += metrics.amount;

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

    const formattedTotalTime = `${Math.floor(totalMins / 60)}h${String(totalMins % 60).padStart(2, "0")}`;
    return { totalMins, formattedTotalTime, totalAmount, jobBreakdown: Object.values(jobBreakdown) };
  };

  const getYearStats = () => {
    let totalMins = 0;
    let totalAmount = 0;
    for (let m = 0; m < 12; m++) {
      const stats = getMonthStats(currentYear, m);
      totalMins += stats.totalMins;
      totalAmount += stats.totalAmount;
    }
    return {
      formattedTime: `${Math.floor(totalMins / 60)}h${String(totalMins % 60).padStart(2, "0")}`,
      totalAmount: totalAmount.toFixed(2)
    };
  };

  const yearStats = getYearStats();

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", paddingBottom: "90px", fontFamily: "sans-serif", background: "#f3f4f6", minHeight: "100vh", direction: lang === "ar" ? "rtl" : "ltr" }}>
      
      <header style={{ background: "#1e3a8a", color: "white", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {selectedMonth !== null ? (
          <button onClick={() => setSelectedMonth(null)} style={{ background: "transparent", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}>❮</button>
        ) : (
          <button onClick={() => setCurrentYear(currentYear - 1)} style={{ background: "transparent", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}>❮</button>
        )}
        
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
          {selectedMonth !== null ? `${monthsList[selectedMonth]} ${currentYear}` : currentYear}
        </div>

        {selectedMonth !== null ? (
          <div style={{ width: "20px" }}></div>
        ) : (
          <button onClick={() => setCurrentYear(currentYear + 1)} style={{ background: "transparent", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}>❯</button>
        )}
      </header>

      {selectedMonth === null ? (
        <div>
          {monthsList.map((monthName, index) => {
            const stats = getMonthStats(currentYear, index);

            return (
              <div 
                key={monthName} 
                onClick={() => setSelectedMonth(index)}
                style={{ display: "flex", borderBottom: "1px solid #e5e7eb", background: "white", cursor: "pointer", minHeight: "55px", alignItems: "center" }}
              >
                <div style={{ width: "90px", padding: "12px", fontWeight: "bold", color: "#1e3a8a", textTransform: "capitalize", fontSize: "15px", borderRight: lang !== "ar" ? "1px solid #e5e7eb" : "none", borderLeft: lang === "ar" ? "1px solid #e5e7eb" : "none", textAlign: "center" }}>
                  {monthName}
                </div>
                <div style={{ flex: 1, padding: "10px 14px" }}>
                  {stats.totalMins === 0 ? (
                    <span style={{ color: "#9ca3af" }}>{t.noRecord}</span>
                  ) : (
                    <div>
                      {stats.jobBreakdown.map((jb, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: lang !== "ar" ? `4px solid ${jb.color}` : "none", borderRight: lang === "ar" ? `4px solid ${jb.color}` : "none", paddingLeft: lang !== "ar" ? "8px" : "0", paddingRight: lang === "ar" ? "8px" : "0", marginBottom: "4px" }}>
                          <div>
                            <div style={{ color: "#7c3aed", fontWeight: "bold", fontSize: "14px" }}>{jb.name}</div>
                            <div style={{ color: "#6b7280", fontSize: "12px" }}>{Math.floor(jb.mins / 60)}h{String(jb.mins % 60).padStart(2, "0")}</div>
                          </div>
                          <div style={{ color: "#0284c7", fontWeight: "bold", fontSize: "14px" }}>{jb.amount.toFixed(2)} €</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          {(() => {
            const daysInMonth = Object.values(history).filter(day => {
              const d = new Date(day.date);
              return d.getFullYear() === currentYear && d.getMonth() === selectedMonth;
            }).sort((a, b) => a.date.localeCompare(b.date));

            if (daysInMonth.length === 0) {
              return (
                <div style={{ textAlign: "center", padding: "40px", color: "#6b7280", background: "white", margin: "16px", borderRadius: "8px" }}>
                  لا توجد أيام مسجلة في هذا الشهر.
                </div>
              );
            }

            return daysInMonth.map(day => {
              const metrics = calculateDayMetrics(day);
              const dObj = new Date(day.date);
              const dayName = dObj.toLocaleDateString(t.dateFormat, { weekday: 'short' });
              const dayNum = dObj.getDate();

              return (
                <div key={day.date} style={{ display: "flex", borderBottom: "1px solid #e5e7eb", background: "white", alignItems: "center", minHeight: "65px" }}>
                  <div style={{ width: "90px", padding: "10px", textAlign: "center", borderRight: lang !== "ar" ? "1px solid #e5e7eb" : "none", borderLeft: lang === "ar" ? "1px solid #e5e7eb" : "none" }}>
                    <div style={{ fontSize: "12px", color: "#6b7280", textTransform: "capitalize" }}>{dayName}</div>
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: "#1e3a8a" }}>{dayNum}</div>
                    <div style={{ fontSize: "11px", color: "#9ca3af" }}>{monthsList[selectedMonth]}</div>
                  </div>
                  <div style={{ flex: 1, padding: "10px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: lang !== "ar" ? `4px solid ${metrics.job.color}` : "none", borderRight: lang === "ar" ? `4px solid ${metrics.job.color}` : "none", paddingLeft: lang !== "ar" ? "8px" : "0", paddingRight: lang === "ar" ? "8px" : "0" }}>
                      <div>
                        <div style={{ color: "#7c3aed", fontWeight: "bold", fontSize: "14px" }}>{metrics.job.name}</div>
                        <div style={{ color: "#6b7280", fontSize: "12px" }}>🕒 {day.startTime} - {day.endTime} {day.breaks?.[0] ? `☕ ${day.breaks[0].duration}min` : ""}</div>
                        <div style={{ color: "#374151", fontSize: "12px", fontWeight: "bold", marginTop: "2px" }}>{metrics.formattedTime}</div>
                      </div>
                      <div style={{ color: "#1f2937", fontWeight: "bold", fontSize: "15px" }}>{metrics.amount.toFixed(2)} €</div>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}

      <div style={{ position: "fixed", bottom: "60px", left: 0, right: 0, maxWidth: "480px", margin: "0 auto", background: "#1e3a8a", color: "white", padding: "12px", textAlign: "center", boxShadow: "0 -2px 10px rgba(0,0,0,0.1)" }}>
        <div style={{ fontSize: "12px", color: "#93c5fd" }}>{selectedMonth !== null ? `${t.totalMonth} ${monthsList[selectedMonth]} ${currentYear}` : `Total ${currentYear}`}</div>
        <div style={{ fontSize: "16px", fontWeight: "bold" }}>
          {selectedMonth !== null ? (
            (() => {
              const stats = getMonthStats(currentYear, selectedMonth);
              return `${stats.formattedTime} - ${stats.totalAmount.toFixed(2)} €`;
            })()
          ) : (
            `${yearStats.formattedTime} - ${yearStats.totalAmount} €`
          )}
        </div>
      </div>

      <BottomNav active="calendar" />
    </main>
  );
}
