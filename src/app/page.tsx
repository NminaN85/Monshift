"use client";

import { useState } from "react";
import { calculateWorkDay } from "@/lib/calculations";

export default function Home() {
  const [status, setStatus] = useState<"NOT_STARTED" | "WORKING" | "ON_BREAK" | "FINISHED">("NOT_STARTED");
  const [startTime, setStartTime] = useState<string | null>(null);
  const [breakStart, setBreakStart] = useState<string | null>(null);
  const [breakEnd, setBreakEnd] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const currentTimeStr = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  const result = calculateWorkDay({
    startTime,
    endTime,
    breaks: breakStart ? [{ startTime: breakStart, endTime: breakEnd }] : [],
    targetDailyHours: 7,
  });

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", padding: "16px", fontFamily: "sans-serif", paddingBottom: "80px" }}>
      {/* الترويسة */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#111827" }}>MonShift ⏱️</h1>
        <span style={{ fontSize: "13px", background: "#d1fae5", color: "#065f46", padding: "4px 10px", borderRadius: "12px", fontWeight: "600" }}>
          {status === "NOT_STARTED" && "جاهز"}
          {status === "WORKING" && "🟢 يعمل الآن"}
          {status === "ON_BREAK" && "🟡 في استراحة"}
          {status === "FINISHED" && "🔴 انتهى اليوم"}
        </span>
      </header>

      {/* لوحة الإحصائيات اليومية */}
      <section style={{ background: "#ffffff", padding: "16px", borderRadius: "14px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", marginBottom: "16px", border: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
          <span style={{ color: "#6b7280" }}>ساعات العمل المحسوبة:</span>
          <strong style={{ color: "#059669", fontSize: "16px" }}>{result.formattedNet}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
          <span style={{ color: "#6b7280" }}>الهدف اليومي:</span>
          <span style={{ fontWeight: "600" }}>07h00</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
          <span style={{ color: "#6b7280" }}>الوقت الإضافي (Overtime):</span>
          <strong style={{ color: "#2563eb", fontSize: "16px" }}>{result.formattedOvertime}</strong>
        </div>
      </section>

      {/* الأوقات المسجلة تفصيلياً */}
      <section style={{ background: "#f9fafb", padding: "12px", borderRadius: "10px", marginBottom: "16px", fontSize: "13px", color: "#374151" }}>
        <div>🚀 بداية العمل: <strong>{startTime || "--:--"}</strong></div>
        <div>☕ الاستراحة: <strong>{breakStart || "--:--"} {breakEnd ? `→ ${breakEnd}` : ""}</strong></div>
        <div>🏁 نهاية العمل: <strong>{endTime || "--:--"}</strong></div>
      </section>

      {/* أزرار التحكم السريعة */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        <button
          onClick={() => { setStartTime(currentTimeStr()); setStatus("WORKING"); }}
          disabled={status !== "NOT_STARTED"}
          style={{ padding: "14px", fontSize: "15px", fontWeight: "bold", background: status === "NOT_STARTED" ? "#10b981" : "#e5e7eb", color: status === "NOT_STARTED" ? "white" : "#9ca3af", border: "none", borderRadius: "10px" }}
        >
          START WORK
        </button>

        <button
          onClick={() => { setBreakStart(currentTimeStr()); setStatus("ON_BREAK"); }}
          disabled={status !== "WORKING"}
          style={{ padding: "14px", fontSize: "15px", fontWeight: "bold", background: status === "WORKING" ? "#f59e0b" : "#e5e7eb", color: status === "WORKING" ? "white" : "#9ca3af", border: "none", borderRadius: "10px" }}
        >
          START BREAK
        </button>

        <button
          onClick={() => { setBreakEnd(currentTimeStr()); setStatus("WORKING"); }}
          disabled={status !== "ON_BREAK"}
          style={{ padding: "14px", fontSize: "15px", fontWeight: "bold", background: status === "ON_BREAK" ? "#3b82f6" : "#e5e7eb", color: status === "ON_BREAK" ? "white" : "#9ca3af", border: "none", borderRadius: "10px" }}
        >
          END BREAK
        </button>

        <button
          onClick={() => { setEndTime(currentTimeStr()); setStatus("FINISHED"); }}
          disabled={status !== "WORKING"}
          style={{ padding: "14px", fontSize: "15px", fontWeight: "bold", background: status === "WORKING" ? "#ef4444" : "#e5e7eb", color: status === "WORKING" ? "white" : "#9ca3af", border: "none", borderRadius: "10px" }}
        >
          END WORK
        </button>
      </div>

      {/* ملاحظات اليوم */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="إضافة ملاحظة لليوم..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }}
        />
      </div>

      {/* شريط التنقل السفلي الثابت */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-around", padding: "10px 0", boxShadow: "0 -2px 5px rgba(0,0,0,0.05)" }}>
        <a href="/" style={{ textDecoration: "none", color: "#10b981", fontSize: "13px", fontWeight: "bold" }}>🏠 الرئيسية</a>
        <a href="#" style={{ textDecoration: "none", color: "#9ca3af", fontSize: "13px" }}>📅 التقويم</a>
        <a href="#" style={{ textDecoration: "none", color: "#9ca3af", fontSize: "13px" }}>📊 الإحصائيات</a>
        <a href="#" style={{ textDecoration: "none", color: "#9ca3af", fontSize: "13px" }}>⚙️ الإعدادات</a>
      </nav>
    </main>
  );
}
