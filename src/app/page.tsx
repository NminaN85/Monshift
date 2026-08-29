"use client";

import { useState } from "react";
import { calculateWorkDay } from "@/lib/calculations";

export default function Home() {
  const [status, setStatus] = useState<"NOT_STARTED" | "WORKING" | "ON_BREAK" | "FINISHED">("NOT_STARTED");
  const [startTime, setStartTime] = useState<string | null>(null);
  const [breakStart, setBreakStart] = useState<string | null>(null);
  const [breakEnd, setBreakEnd] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  const currentTimeStr = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  const handleStartWork = () => {
    setStartTime(currentTimeStr());
    setStatus("WORKING");
  };

  const handleStartBreak = () => {
    setBreakStart(currentTimeStr());
    setStatus("ON_BREAK");
  };

  const handleEndBreak = () => {
    setBreakEnd(currentTimeStr());
    setStatus("WORKING");
  };

  const handleEndWork = () => {
    setEndTime(currentTimeStr());
    setStatus("FINISHED");
  };

  const result = calculateWorkDay({
    startTime,
    endTime,
    breaks: breakStart ? [{ startTime: breakStart, endTime: breakEnd }] : [],
    targetDailyHours: 7,
  });

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", padding: "16px", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#1f2937" }}>MonShift</h1>
        <span style={{ fontSize: "14px", background: "#e5e7eb", padding: "4px 8px", borderRadius: "12px" }}>
          {status === "NOT_STARTED" && "لم يبدأ"}
          {status === "WORKING" && "قيد العمل"}
          {status === "ON_BREAK" && "في الاستراحة"}
          {status === "FINISHED" && "انتهى اليوم"}
        </span>
      </header>

      {/* لوحة الإحصائيات السريعة */}
      <section style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <span>الوقت المحسوب:</span>
          <strong style={{ color: "#059669" }}>{result.formattedNet}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <span>الهدف اليومي:</span>
          <span>07h00</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>الساعات الإضافية:</span>
          <strong style={{ color: "#2563eb" }}>{result.formattedOvertime}</strong>
        </div>
      </section>

      {/* الأزرار الذكية التفاعلية */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <button
          onClick={handleStartWork}
          disabled={status !== "NOT_STARTED"}
          style={{ padding: "16px", fontSize: "18px", fontWeight: "bold", background: status === "NOT_STARTED" ? "#10b981" : "#9ca3af", color: "white", border: "none", borderRadius: "10px", cursor: status === "NOT_STARTED" ? "pointer" : "not-allowed" }}
        >
          🟢 START WORK
        </button>

        <button
          onClick={handleStartBreak}
          disabled={status !== "WORKING"}
          style={{ padding: "16px", fontSize: "18px", fontWeight: "bold", background: status === "WORKING" ? "#f59e0b" : "#9ca3af", color: "white", border: "none", borderRadius: "10px", cursor: status === "WORKING" ? "pointer" : "not-allowed" }}
        >
          🟡 START BREAK
        </button>

        <button
          onClick={handleEndBreak}
          disabled={status !== "ON_BREAK"}
          style={{ padding: "16px", fontSize: "18px", fontWeight: "bold", background: status === "ON_BREAK" ? "#3b82f6" : "#9ca3af", color: "white", border: "none", borderRadius: "10px", cursor: status === "ON_BREAK" ? "pointer" : "not-allowed" }}
        >
          🔵 END BREAK
        </button>

        <button
          onClick={handleEndWork}
          disabled={status !== "WORKING"}
          style={{ padding: "16px", fontSize: "18px", fontWeight: "bold", background: status === "WORKING" ? "#ef4444" : "#9ca3af", color: "white", border: "none", borderRadius: "10px", cursor: status === "WORKING" ? "pointer" : "not-allowed" }}
        >
          🔴 END WORK
        </button>
      </div>
    </main>
  );
}
