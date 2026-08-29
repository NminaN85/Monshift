"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

interface BreakItem { duration: number; isPaid: boolean; }
interface DayRecord { date: string; startTime: string; endTime: string; breaks: BreakItem[]; notes: string; }

export default function CalendarPage() {
  const [history, setHistory] = useState<Record<string, DayRecord>>({});

  useEffect(() => {
    const saved = localStorage.getItem("monshift_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const sortedDays = Object.values(history).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", padding: "16px", fontFamily: "sans-serif", paddingBottom: "90px", background: "#f3f4f6", minHeight: "100vh" }}>
      <header style={{ background: "#1e3a8a", color: "white", padding: "16px", borderRadius: "12px", textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "18px", margin: 0 }}>📅 سجل الأيام المحفوظة</h1>
      </header>

      {sortedDays.length === 0 ? (
        <div style={{ background: "white", padding: "30px", borderRadius: "12px", textAlign: "center", color: "#6b7280" }}>
          <p>لا توجد أيام مسجلة حتى الآن.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {sortedDays.map((day) => (
            <div key={day.date} style={{ background: "white", padding: "14px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" }}>
                <strong style={{ color: "#1e3a8a", fontSize: "14px" }}>{day.date}</strong>
                <span style={{ fontSize: "13px", color: "#059669", fontWeight: "bold" }}>{day.startTime} → {day.endTime}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav active="calendar" />
    </main>
  );
}
