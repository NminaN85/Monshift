"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

interface BreakItem { 
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
  maxPaidMinutes?: number;
  notes: string;
}
interface Job { id: string; name: string; rate: number; color: string; }

const monthsData: Record<string, string[]> = {
  fr: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
};

const translations: Record<string, any> = {
  fr: { edit: "Modifier", delete: "Supprimer", week: "Semaine", total: "Total" },
  en: { edit: "Edit", delete: "Delete", week: "Week", total: "Total" },
  ar: { edit: "تعديل", delete: "حذف", week: "أسبوع", total: "الإجمالي" }
};

export default function CalendarPage() {
  const [lang, setLang] = useState("fr");
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [history, setHistory] = useState<Record<string, ShiftRecord[] | any>>({});
  const [jobs, setJobs] = useState<Job[]>([]);
  const [startDayOption, setStartDayOption] = useState("Lundi");
  const [currencySymbol, setCurrencySymbol] = useState("€");

  useEffect(() => {
    const savedSymbol = localStorage.getItem("monshift_symbol");
    if (savedSymbol) setCurrencySymbol(savedSymbol);

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
  const t = translations[lang] || translations["fr"];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const timeToMins = (timeStr: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const calculateShiftMetrics = (shift: ShiftRecord) => {
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

    const maxPaid = shift.maxPaidMinutes !== undefined ? shift.maxPaidMinutes : 30;
    const excessPaidMins = Math.max(0, totalPaidBreakMins - maxPaid);
    const unpaidMins = totalUnpaidBreakMins + excessPaidMins;

    const netMins = Math.max(0, grossMins - unpaidMins);
    const hours = netMins / 60;

    const job = jobs.find(j => j.id === shift.jobId) || jobs[0];
    const rate = job ? job.rate : 0;
    const amount = hours * rate;

    const hoursPart = Math.floor(netMins / 60);
    const minsPart = String(netMins % 60).padStart(2, "0");
    const formattedTime = hoursPart + "h" + minsPart;

    return { netMins, formattedTime, amount, job };
  };

  const getDayShiftsList = (record: any): ShiftRecord[] => {
    if (!record) return [];
    if (Array.isArray(record)) return record;
    if (record.startTime) {
      return [{
        id: "legacy",
        jobId: record.jobId || (jobs[0]?.id ?? ""),
        startTime: record.startTime,
        endTime: record.endTime,
        breaks: record.breaks || [],
        maxPaidMinutes: record.maxPaidMinutes ?? 30,
        notes: record.notes || ""
      }];
    }
    return [];
  };

  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    let shiftDays = 1;
    if (startDayOption === "Dimanche") shiftDays = 0;
    if (startDayOption === "Samedi") shiftDays = 6;

    const dayNum = d.getUTCDay();
    const adjustedDay = (dayNum - shiftDays + 7) % 7;
    d.setUTCDate(d.getUTCDate() + 4 - adjustedDay);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const getDaysInMonthFull = (year: number, monthIndex: number) => {
    const date = new Date(year, monthIndex, 1);
    const days = [];

    while (date.getMonth() === monthIndex) {
      const yearStr = date.getFullYear();
      const monthStr = String(date.getMonth() + 1).padStart(2, '0');
      const dayStr = String(date.getDate()).padStart(2, '0');
      const dateKey = yearStr + "-" + monthStr + "-" + dayStr;

      const weekNo = getWeekNumber(new Date(date));

      days.push({
        dateKey,
        dayNumber: date.getDate(),
        dayOfWeek: date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'fr-FR', { weekday: 'short' }),
        weekNumber: weekNo,
        shifts: getDayShiftsList(history[dateKey])
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
      d.shifts.forEach(shift => {
        const metrics = calculateShiftMetrics(shift);
        totalMins += metrics.netMins;
        totalAmount += metrics.amount;
      });
    });

    const hPart = Math.floor(totalMins / 60);
    const mPart = String(totalMins % 60).padStart(2, "0");
    const formattedTotalTime = hPart + "h" + mPart;

    return { totalMins, formattedTotalTime, totalAmount };
  };

  const handleDeleteDay = (dateKey: string) => {
    const updatedHistory = { ...history };
    delete updatedHistory[dateKey];
    setHistory(updatedHistory);
    localStorage.setItem("monshift_history", JSON.stringify(updatedHistory));
  };

  const handleEditDay = (dateKey: string) => {
    localStorage.setItem("monshift_edit_date", dateKey);
    window.location.href = "/";
  };

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", paddingBottom: "110px", fontFamily: "sans-serif", background: "#f3f4f6", minHeight: "100vh" }} dir={dir}>
      
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
                <div style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>
                  <div style={{ fontSize: "15px", fontWeight: "bold", color: "#0284c7" }}>{stats.totalAmount.toFixed(2) + " " + currencySymbol}</div>
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
                d.shifts.forEach(shift => {
                  const m = calculateShiftMetrics(shift);
                  weekMins += m.netMins;
                  weekAmount += m.amount;
                });
              });
              const whPart = Math.floor(weekMins / 60);
              const wmPart = String(weekMins % 60).padStart(2, "0");
              const weekTimeFormatted = whPart + "h" + wmPart;

              return (
                <div key={weekNo} style={{ marginBottom: "16px" }}>
                  <div style={{ background: "#1e3a8a", color: "white", padding: "8px 16px", fontSize: "13px", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.95 }}>
                    <span style={{ fontWeight: "bold" }}>{t.week} {weekNo}</span>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <span style={{ color: "#86efac" }}>{t.total} {weekAmount.toFixed(2) + " " + currencySymbol}</span>
                      <span>{weekTimeFormatted}</span>
                    </div>
                  </div>

                  {weekDays.map(d => {
                    const hasShifts = d.shifts.length > 0;

                    return (
                      <div key={d.dateKey} style={{ display: "flex", background: "white", borderBottom: "1px solid #e5e7eb", alignItems: "stretch" }}>
                        <div style={{ width: "90px", padding: "10px", textAlign: "center", borderInlineEnd: "1px solid #e5e7eb", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                          <div style={{ fontSize: "11px", color: "#6b7280", textTransform: "capitalize" }}>{d.dayOfWeek}</div>
                          <div style={{ fontSize: "18px", fontWeight: "bold", color: hasShifts ? "#1e3a8a" : "#9ca3af" }}>{d.dayNumber}</div>
                          <div style={{ fontSize: "10px", color: "#9ca3af" }}>{monthsList[selectedMonth]}</div>
                        </div>

                        <div style={{ flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                          {hasShifts ? (
                            d.shifts.map((shift, sIdx) => {
                              const metrics = calculateShiftMetrics(shift);
                              const validBreaks = shift.breaks?.filter(b => b.startTime && b.endTime) || [];

                              return (
                                <div key={shift.id || sIdx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderInlineStart: "4px solid " + metrics.job.color, paddingInlineStart: "8px", background: "#f8fafc", padding: "6px", borderRadius: "6px" }}>
                                  <div>
                                    <div style={{ color: "#7c3aed", fontWeight: "bold", fontSize: "13px" }}>{metrics.job.name}</div>
                                    <div style={{ color: "#6b7280", fontSize: "11px" }}>
                                      🕒 {shift.startTime} - {shift.endTime}
                                      {validBreaks.length > 0 && (
                                        <span style={{ marginInlineStart: "4px", color: "#d97706" }}>
                                          {validBreaks.map(b => "☕ " + b.startTime + "-" + b.endTime).join(" | ")}
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ color: "#374151", fontSize: "11px", fontWeight: "bold", marginTop: "2px" }}>{metrics.formattedTime}</div>
                                  </div>

                                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                                    <div style={{ color: "#1f2937", fontWeight: "bold", fontSize: "14px" }}>{metrics.amount.toFixed(2) + " " + currencySymbol}</div>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                      <button 
                                        onClick={() => handleEditDay(d.dateKey)} 
                                        style={{ background: "#3b82f6", color: "white", border: "none", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", cursor: "pointer", fontWeight: "bold" }}
                                      >
                                        {t.edit}
                                      </button>
                                      {sIdx === 0 && (
                                        <button 
                                          onClick={() => handleDeleteDay(d.dateKey)} 
                                          style={{ background: "#ef4444", color: "white", border: "none", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", cursor: "pointer", fontWeight: "bold" }}
                                        >
                                          {t.delete}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div style={{ color: "#d1d5db", fontSize: "13px", display: "flex", alignItems: "center", height: "100%" }}>-</div>
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
          <div style={{ fontSize: "12px", color: "#93c5fd" }}>{t.total} {monthsList[selectedMonth] + " " + currentYear}</div>
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
            {(() => {
              const stats = getMonthStats(currentYear, selectedMonth);
              return stats.formattedTotalTime + " - " + stats.totalAmount.toFixed(2) + " " + currencySymbol;
            })()}
          </div>
        </div>
      )}

      <BottomNav active="calendar" />
    </main>
  );
}
