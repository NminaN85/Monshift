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
  fr: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
};

export default function CalendarPage() {
  const [lang, setLang] = useState("fr");
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [history, setHistory] = useState<Record<string, DayRecord>>({});
  const [jobs, setJobs] = useState<Job[]>([]);
  const [startDayOption, setStartDayOption] = useState("Lundi");

  useEffect(() => {
    const savedLang = localStorage.getItem("monshift_lang");
    if (savedLang) setLang(savedLang);

    const savedHistory = localStorage.getItem("monshift_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedJobs = localStorage.getItem("monshift_jobs");
    if (savedJobs) setJobs(JSON.parse(savedJobs));

    const savedStartDay = localStorage.getItem("monshift_startday");
    if (savedStartDay) setStartDayOption(savedStartDay);
  }, []);

  const monthsList = monthsData[lang] || monthsData["fr"];

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

    const hoursPart = Math.floor(netMins / 60);
    const minsPart = String(netMins % 60).padStart(2, "0");
    const formattedTime = hoursPart + "h" + minsPart;

    return { netMins, formattedTime, amount, job };
  };

  const getDaysInMonthFull = (year: number, monthIndex: number) => {
    const date = new Date(year, monthIndex, 1);
    const days = [];

    let shiftDays = 1; 
    if (startDayOption === "Dimanche") shiftDays = 0;
    if (startDayOption === "Samedi") shiftDays = 6;

    while (date.getMonth() === monthIndex) {
      const yearStr = date.getFullYear();
      const monthStr = String(date.getMonth() + 1).padStart(2, '0');
      const dayStr = String(date.getDate()).padStart(2, '0');
      const dateKey = yearStr + "-" + monthStr + "-" + dayStr;

      const firstDayOfMonth = new Date(year, monthIndex, 1);
      const firstDayAdjusted = (firstDayOfMonth.getDay() - shiftDays + 7) % 7;
      const weekNo = Math.floor((date.getDate() + firstDayAdjusted - 1) / 7) + 1;

      days.push({
        dateKey,
        dayNumber: date.getDate(),
        dayOfWeek: date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'fr-FR', { weekday: 'short' }),
        weekNumber: weekNo,
        record: history[dateKey] || null
      });
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const getMonthStats = (year: number, monthIndex: number) => {
    let totalMins = 0;
    let totalAmount = 0;
    const days = getDaysInMonthFull(year, monthIndex);
    
    days.forEach(d => {
      if (d.record) {
        const metrics = calculateDayMetrics(d.record);
        totalMins += metrics.netMins;
        totalAmount += metrics.amount;
      }
    });

    const hPart = Math.floor(totalMins / 60);
    const mPart = String(totalMins % 60).padStart(2, "0");
    const formattedTotalTime = hPart + "h" + mPart;

    return { totalMins, formattedTotalTime, totalAmount };
  };

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", paddingBottom: "110px", fontFamily: "sans-serif", background: "#f3f4f6", minHeight: "100vh" }}>
      
      <header style={{ background: "#1e3a8a", color: "white", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {selectedMonth !== null ? (
          <button onClick={() => setSelectedMonth(null)} style={{ background: "transparent", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}>❮</button>
        ) : (
          <button onClick={() => setCurrentYear(currentYear - 1)} style={{ background: "transparent", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}>❮</button>
        )}
        
        <div style={{ fontSize: "18px", fontWeight: "bold", textTransform: "capitalize" }}>
          {selectedMonth !== null ? monthsList[selectedMonth] + " " + currentYear : currentYear}
        </div>

        {selectedMonth !== null ? (
          <button onClick={() => window.location.href = "/stats"} style={{ background: "transparent", border: "none", color: "white", fontSize: "18px", cursor: "pointer" }}>📤</button>
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
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "white", borderBottom: "1px solid #e5e7eb", cursor: "pointer" }}
              >
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#1e3a8a", textTransform: "capitalize" }}>{monthName + " " + currentYear}</div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "15px", fontWeight: "bold", color: "#0284c7" }}>{stats.totalAmount.toFixed(2) + " €"}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>{stats.formattedTotalTime}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          {(() => {
            const daysList = getDaysInMonthFull(currentYear, selectedMonth);

            const weeksMap: Record<number, typeof daysList> = {};
            daysList.forEach(d => {
              if (!weeksMap[d.weekNumber]) weeksMap[d.weekNumber] = [];
              weeksMap[d.weekNumber].push(d);
            });

            return Object.entries(weeksMap).map(([weekNo, weekDays]) => {
              let weekMins = 0;
              let weekAmount = 0;
              weekDays.forEach(d => {
                if (d.record) {
                  const m = calculateDayMetrics(d.record);
                  weekMins += m.netMins;
                  weekAmount += m.amount;
                }
              });
              const whPart = Math.floor(weekMins / 60);
              const wmPart = String(weekMins % 60).padStart(2, "0");
              const weekTimeFormatted = whPart + "h" + wmPart;

              return (
                <div key={weekNo} style={{ marginBottom: "16px" }}>
                  <div style={{ background: "#1e3a8a", color: "white", padding: "8px 16px", fontSize: "13px", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.95 }}>
                    <span style={{ fontWeight: "bold" }}>Semaine {weekNo}</span>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <span style={{ color: "#86efac" }}>Total {weekAmount.toFixed(2) + " €"}</span>
                      <span>{weekTimeFormatted}</span>
                    </div>
                  </div>

                  {weekDays.map(d => {
                    const hasRecord = d.record !== null;
                    const metrics = hasRecord ? calculateDayMetrics(d.record!) : null;
                    const validBreaks = d.record?.breaks?.filter(b => b.startTime && b.endTime) || [];

                    return (
                      <div key={d.dateKey} style={{ display: "flex", background: "white", borderBottom: "1px solid #e5e7eb", minHeight: "65px", alignItems: "center" }}>
                        <div style={{ width: "90px", padding: "10px", textAlign: "center", borderRight: "1px solid #e5e7eb" }}>
                          <div style={{ fontSize: "11px", color: "#6b7280", textTransform: "capitalize" }}>{d.dayOfWeek}</div>
                          <div style={{ fontSize: "18px", fontWeight: "bold", color: hasRecord ? "#1e3a8a" : "#9ca3af" }}>{d.dayNumber}</div>
                          <div style={{ fontSize: "10px", color: "#9ca3af" }}>{monthsList[selectedMonth]}</div>
                        </div>

                        <div style={{ flex: 1, padding: "10px 14px" }}>
                          {hasRecord && metrics ? (
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: "4px solid " + metrics.job.color, paddingLeft: "8px" }}>
                              <div>
                                <div style={{ color: "#7c3aed", fontWeight: "bold", fontSize: "14px" }}>{metrics.job.name}</div>
                                <div style={{ color: "#6b7280", fontSize: "12px" }}>
                                  🕒 {d.record!.startTime + " - " + d.record!.endTime}
                                  {validBreaks.length > 0 && (
                                    <span style={{ marginLeft: "6px", color: "#d97706" }}>
                                      {validBreaks.map(b => "☕ " + b.startTime + "-" + b.endTime).join(" | ")}
                                    </span>
                                  )}
                                </div>
                                <div style={{ color: "#374151", fontSize: "12px", fontWeight: "bold", marginTop: "2px" }}>{metrics.formattedTime}</div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ color: "#1f2937", fontWeight: "bold", fontSize: "15px" }}>{metrics.amount.toFixed(2) + " €"}</div>
                              </div>
                            </div>
                          ) : (
                            <div style={{ color: "#d1d5db", fontSize: "13px" }}>-</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            });
          })()}
        </div>
      )}

      {selectedMonth !== null && (
        <div style={{ position: "fixed", bottom: "60px", left: 0, right: 0, maxWidth: "480px", margin: "0 auto", background: "#1e3a8a", color: "white", padding: "12px", textAlign: "center", boxShadow: "0 -2px 10px rgba(0,0,0,0.1)" }}>
          <div style={{ fontSize: "12px", color: "#93c5fd" }}>Total {monthsList[selectedMonth] + " " + currentYear}</div>
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
            {(() => {
              const stats = getMonthStats(currentYear, selectedMonth);
              return stats.formattedTotalTime + " - " + stats.totalAmount.toFixed(2) + " €";
            })()}
          </div>
        </div>
      )}

      <BottomNav active="calendar" />
    </main>
  );
}
