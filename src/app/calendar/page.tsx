export default function CalendarPage() {
  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", padding: "16px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>📅 التقويم الشهري</h1>
      <p style={{ color: "#6b7280" }}>عرض أيام العمل وسجل الورديات الشهرية.</p>
      <div style={{ marginTop: "20px", background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
        <p>لا توجد بيانات مسجلة لهذا الشهر بعد.</p>
      </div>
      <div style={{ marginTop: "30px" }}>
        <a href="/" style={{ color: "#10b981", textDecoration: "none", fontWeight: "bold" }}>← العودة للرئيسية</a>
      </div>
    </main>
  );
}
