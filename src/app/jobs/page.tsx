"use client";

import { useState, useEffect } from "react";

interface Job {
  id: string;
  name: string;
  rate: number;
  color: string;
}

const COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#10b981", "#06b6d4", 
  "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#64748b"
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [rate, setRate] = useState("12.00");
  const [color, setColor] = useState("#3b82f6");

  useEffect(() => {
    const saved = localStorage.getItem("monshift_jobs");
    if (saved) {
      setJobs(JSON.parse(saved));
    } else {
      // تبدأ القائمة فارغة تماماً بدون أي أمثلة افتراضية
      setJobs([]);
    }
  }, []);

  const saveJob = () => {
    if (!name.trim()) return;
    const newJob: Job = {
      id: Date.now().toString(),
      name: name.trim(),
      rate: parseFloat(rate) || 0,
      color,
    };
    const updated = [...jobs, newJob];
    setJobs(updated);
    localStorage.setItem("monshift_jobs", JSON.stringify(updated));
    setShowModal(false);
    setStep(1);
    setName("");
    setRate("12.00");
  };

  const deleteJob = (id: string) => {
    const updated = jobs.filter(j => j.id !== id);
    setJobs(updated);
    localStorage.setItem("monshift_jobs", JSON.stringify(updated));
  };

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", padding: "16px", fontFamily: "sans-serif", paddingBottom: "90px", background: "#f3f4f6", minHeight: "100vh" }}>
      <header style={{ background: "#1e3a8a", color: "white", padding: "16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "18px", margin: 0 }}>Emplois (أماكن العمل)</h1>
        <button onClick={() => setShowModal(true)} style={{ background: "#10b981", color: "white", border: "none", width: "32px", height: "32px", borderRadius: "50%", fontSize: "18px", fontWeight: "bold", cursor: "pointer" }}>+</button>
      </header>

      {/* قائمة الأماكن */}
      {jobs.length === 0 ? (
        <div style={{ background: "white", padding: "30px", borderRadius: "12px", textAlign: "center", color: "#6b7280" }}>
          <p>لا توجد أماكن عمل مسجلة حتى الآن.</p>
          <p style={{ fontSize: "13px", marginTop: "8px" }}>اضغط على زر (+) بالأعلى لإضافة مكان عملك الخاص.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {jobs.map((job) => (
            <div key={job.id} style={{ background: "white", padding: "14px 16px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", borderLeft: `6px solid ${job.color}` }}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#1f2937" }}>{job.name}</div>
                <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>{job.rate} € / h</div>
              </div>
              <button onClick={() => deleteJob(job.id)} style={{ background: "transparent", border: "none", color: "#ef4444", fontSize: "13px", cursor: "pointer" }}>حذف</button>
            </div>
          ))}
        </div>
      )}

      {/* نافذة إضافة مكان جديد (Modal) مطابقة لخطوات التصميم */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", width: "100%", maxWidth: "480px", borderTopLeftRadius: "20px", borderTopRightRadius: "20px", padding: "20px", boxSizing: "border-box" }}>
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
              <div style={{ width: "40px", height: "4px", background: "#d1d5db", borderRadius: "2px", margin: "0 auto 10px" }}></div>
              <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
                <span style={{ width: step === 1 ? "16px" : "8px", height: "6px", background: step === 1 ? "#1e3a8a" : "#d1d5db", borderRadius: "3px" }}></span>
                <span style={{ width: step === 2 ? "16px" : "8px", height: "6px", background: step === 2 ? "#1e3a8a" : "#d1d5db", borderRadius: "3px" }}></span>
                <span style={{ width: step === 3 ? "16px" : "8px", height: "6px", background: step === 3 ? "#1e3a8a" : "#d1d5db", borderRadius: "3px" }}></span>
              </div>
            </div>

            {step === 1 && (
              <div>
                <h3 style={{ fontSize: "16px", marginBottom: "4px" }}>Quel est le nom ?</h3>
                <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "15px" }}>Donnez un nom à cet emploi.</p>
                <input
                  type="text"
                  placeholder="اسم مكان العمل..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #d1d5db", fontSize: "16px", boxSizing: "border-box", marginBottom: "20px" }}
                />
                <button onClick={() => { if(name.trim()) setStep(2); }} style={{ width: "100%", padding: "14px", background: "#1e3a8a", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "15px", opacity: name.trim() ? 1 : 0.5 }}>Suivant</button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 style={{ fontSize: "16px", marginBottom: "4px" }}>Quel est votre taux ?</h3>
                <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "15px" }}>Taux horaire brut.</p>
                <input
                  type="number"
                  step="0.01"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #d1d5db", fontSize: "16px", boxSizing: "border-box", marginBottom: "20px", textAlign: "center" }}
                />
                <button onClick={() => setStep(3)} style={{ width: "100%", padding: "14px", background: "#1e3a8a", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "15px" }}>Suivant</button>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 style={{ fontSize: "16px", marginBottom: "4px" }}>Choisir une couleur</h3>
                <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "15px" }}>Elle identifie votre emploi dans l'app.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", marginBottom: "20px" }}>
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setColor(c)} style={{ width: "100%", height: "35px", background: c, border: color === c ? "3px solid #000" : "none", borderRadius: "8px", cursor: "pointer" }} />
                  ))}
                </div>
                <button onClick={saveJob} style={{ width: "100%", padding: "14px", background: "#1e3a8a", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "15px" }}>Créer l'emploi</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* شريط التنقل السفلي */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#1e3a8a", borderTop: "1px solid #172554", display: "flex", justifyContent: "space-around", padding: "12px 0", boxShadow: "0 -2px 5px rgba(0,0,0,0.1)" }}>
        <a href="/" style={{ textDecoration: "none", color: "#93c5fd", fontSize: "14px" }}>🕒 الساعات</a>
        <a href="/jobs" style={{ textDecoration: "none", color: "#34d399", fontSize: "14px", fontWeight: "bold" }}>🏢 الأماكن</a>
        <a href="/calendar" style={{ textDecoration: "none", color: "#93c5fd", fontSize: "14px" }}>📅 التقويم</a>
      </nav>
    </main>
  );
}
