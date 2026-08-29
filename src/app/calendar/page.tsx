"use client";

import { useState, useEffect } from "react";

interface BreakItem {
  duration: number;
  isPaid: boolean;
}

interface DayRecord {
  date: string;
  startTime: string;
  endTime: string;
  breaks: BreakItem[];
  notes: string;
}

export default function CalendarPage() {
  const [history, setHistory] = useState<Record<string, DayRecord>>({});

  useEffect(() => {
    const saved = localStorage.getItem("monshift_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // تحويل الكائن إلى مصفوفة وترتيبها حسب التاريخ
  const sortedDays = Object.values(history).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", padding: "16px", fontFamily: "sans-serif", paddingBottom: "90px", background: "#f3f4f6", minHeight: "100vh" }}>
      
      <header style={{ background: "#1e3a8a", color: "white", padding: "16px", borderRadius: "12px", textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "18px", margin: 0 }}>📅 سجل الأيام المحفوظة (History)</h1>
      </header>

      {sortedDays.length === 0 ? (
        <div style={{ background: "white", padding: "30px", borderRadius: "12px", textAlign: "center", color: "#6b7280" }}>
          <p>لا توجد أيام مسجلة حتى الآن.</p>
          <p style={{ fontSize: "13px", marginTop: "8px" }}>قم بتسجيل وحفظ بعض الأيام من صفحة الساعات الرئيسية.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {sortedDays.map((day) => (
            <div key={day.date} style={{ background: "white", padding: "14px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" }}>
                <strong style={{ color: "#1e3a8a", fontSize: "14px" }}>{day.date}</strong>
                <span style={{ fontSize: "13px", color: "#059669", fontWeight: "bold" }}>
                  {day.startTime} → {day.endTime}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "#4b5563" }}>
                {day.breaks.map((b, i) => (
                  <div key={i}>
                    ☕ بوز #{i + 1}: {b.duration} دقيقة {b.isPaid ? "(مدفوعة)" : ""}
                  </div>
                ))}
                {day.notes && <div style={{ marginTop: "4px", color: "#6b7280" }}>💬 {day.notes}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* شريط التنقل السفلي */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#1e3a8a", borderTop: "1px solid #172554", display: "flex", justifyContent: "space-around", padding: "12px 0", boxShadow: "0 -2px 5px rgba(0,0,0,0.1)" }}>
        <a href="/" style={{ textDecoration: "none", color: "#93c5fd", fontSize: "14px" }}>🕒 الساعات</a>
        <a href="/calendar" style={{ textDecoration: "none", color: "#34d399", fontSize: "14px", fontWeight: "bold" }}>📅 التقويم والهستورى</a>
        <a href="#" style={{ textDecoration: "none", color: "#93c5fd", fontSize: "14px" }}>⚙️ الإعدادات</a>
      </nav>

    </main>
  );
}
