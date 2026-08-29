
"use client";

import { useState, useEffect } from "react";

interface BreakItem {
  duration: number; // بالدقائق
  isPaid: boolean;  // هل الاستراحة مدفوعة؟
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState("2026-08-17");
  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("15:00");
  
  // دعم حتى 2 استراحة
  const [breaks, setBreaks] = useState<BreakItem[]>([
    { duration: 30, isPaid: false }
  ]);
  
  const [notes, setNotes] = useState("");

  // استرجاع البيانات المحفوظة
  useEffect(() => {
    const saved = localStorage.getItem("monshift_shift_data");
    if (saved) {
      const data = JSON.parse(saved);
      setStartTime(data.startTime || "07:00");
      setEndTime(data.endTime || "15:00");
      setBreaks(data.breaks || [{ duration: 30, isPaid: false }]);
      setNotes(data.notes || "");
    }
  }, []);

  // حفظ تلقائي
  useEffect(() => {
    localStorage.setItem(
      "monshift_shift_data",
      JSON.stringify({ startTime, endTime, breaks, notes })
    );
  }, [startTime, endTime, breaks, notes]);

  // حساب دقيق للوقت
  const calculateTotal = () => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    let startTotalMins = startH * 60 + startM;
    let endTotalMins = endH * 60 + endM;

    if (endTotalMins <= startTotalMins) {
      endTotalMins += 24 * 60; // وردية عبر منتصف الليل
    }

    const grossMins = endTotalMins - startTotalMins;

    // خصم الاستراحات غير المدفوعة فقط
    let unpaidBreakMins = 0;
    breaks.forEach((b) => {
      if (!b.isPaid) {
        unpaidBreakMins += Number(b.duration || 0);
      }
    });

    const netMins = Math.max(0, grossMins - unpaidBreakMins);
    const hours = Math.floor(netMins / 60);
    const mins = netMins % 60;

    return `${String(hours).padStart(2, "0")}h${String(mins).padStart(2, "0")}`;
  };

  const addBreak = () => {
    if (breaks.length < 2) {
      setBreaks([...breaks, { duration: 15, isPaid: false }]);
    }
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
      
      {/* شريط العرض العلوي المطابق للصورة */}
      <header style={{ background: "#1e3a8a", color: "white", padding: "14px", borderRadius: "12px", textAlign: "center", marginBottom: "16px" }}>
        <div style={{ fontSize: "13px", opacity: 0.8, marginBottom: "4px" }}>S34 • lundi 17 août 2026</div>
        <div style={{ fontSize: "12px", color: "#34d399" }}>Total: 0,00 €</div>
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>{calculateTotal()}</div>
      </header>

      {/* بطاقة إدخال وقت البداية والنهاية */}
      <section style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "15px", marginBottom: "12px", color: "#374151" }}>⏱️ أوقات العمل الأساسية</h3>
        <div style={{ display: "flex", gap: "12px", justifyContent: "space-between" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "12px", color: "#6b7280", display: "block", marginBottom: "4px" }}>البداية (Début)</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "16px", textAlign: "center", background: "#ecfdf5", color: "#065f46", fontWeight: "bold", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "12px", color: "#6b7280", display: "block", marginBottom: "4px" }}>النهاية (Fin)</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "16px", textAlign: "center", background: "#fef2f2", color: "#991b1b", fontWeight: "bold", boxSizing: "border-box" }}
            />
          </div>
        </div>
      </section>

      {/* إدارة الاستراحات (حتى 2 بوز مع خيار مدفوع) */}
      <section style={{ background: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ fontSize: "15px", color: "#374151", margin: 0 }}>☕ الاستراحات (Pauses - حد أقصى 2)</h3>
          {breaks.length < 2 && (
            <button onClick={addBreak} style={{ background: "#10b981", color: "white", border: "none", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>
              + إضافة بوز
            </button>
          )}
        </div>

        {breaks.map((b, index) => (
          <div key={index} style={{ background: "#f9fafb", padding: "10px", borderRadius: "8px", marginBottom: "10px", border: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: "bold", color: "#4b5563" }}>البوز #{index + 1}</span>
              <button onClick={() => removeBreak(index)} style={{ background: "transparent", border: "none", color: "#ef4444", fontSize: "12px", cursor: "pointer" }}>حذف</button>
            </div>
            
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: "11px", color: "#6b7280" }}>المدة بالدقائق:</span>
                <input
                  type="number"
                  value={b.duration}
                  onChange={(e) => updateBreak(index, "duration", Number(e.target.value))}
                  style={{ width: "100%", padding: "6px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* خانة تشيك Pause payée */}
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer", color: "#1f2937" }}>
              <input
                type="checkbox"
                checked={b.isPaid}
                onChange={(e) => updateBreak(index, "isPaid", e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "#10b981" }}
              />
              <span>Pause payée (استراحة مدفوعة - تحسب ضمن وقت العمل)</span>
            </label>
          </div>
        ))}
      </section>

      {/* خانة الملاحظات */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="إضافة تعليق أو ملاحظة..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box", background: "white" }}
        />
      </div>

      {/* شريط التنقل السفلي */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#1e3a8a", borderTop: "1px solid #172554", display: "flex", justifyContent: "space-around", padding: "12px 0", boxShadow: "0 -2px 5px rgba(0,0,0,0.1)" }}>
        <a href="/" style={{ textDecoration: "none", color: "#34d399", fontSize: "14px", fontWeight: "bold" }}>🕒 الساعات</a>
        <a href="/calendar" style={{ textDecoration: "none", color: "#93c5fd", fontSize: "14px" }}>📅 التقويم</a>
        <a href="#" style={{ textDecoration: "none", color: "#93c5fd", fontSize: "14px" }}>⚙️ الإعدادات</a>
      </nav>

    </main>
  );
}
