"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

interface Job {
  id: string;
  name: string;
  rate: number;
  color: string;
}

const COLORS = ["#ef4444", "#f97316", "#f59e0b", "#10b981", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#64748b"];

const texts: Record<string, any> = {
  fr: { title: "Emplois", noJobs: "Aucun emploi enregistré.", addHint: "Cliquez sur (+) pour ajouter votre emploi.", delete: "Supprimer", step1Title: "Quel est le nom ?", step1Placeholder: "Nom du poste...", next: "Suivant", step2Title: "Quel est votre taux ? (Brut)", step3Title: "Choisir une couleur", create: "Créer l'emploi" },
  en: { title: "Jobs", noJobs: "No jobs registered.", addHint: "Click (+) to add your job.", delete: "Delete", step1Title: "What is the name?", step1Placeholder: "Job name...", next: "Next", step2Title: "What is your rate? (Gross)", step3Title: "Choose a color", create: "Create job" },
  ar: { title: "أماكن العمل", noJobs: "لا توجد أماكن عمل مسجلة.", addHint: "اضغط على (+) لإضافة مكان عملك.", delete: "حذف", step1Title: "ما هو اسم مكان العمل؟", step1Placeholder: "اسم الوظيفة...", next: "التالي", step2Title: "ما هو سعر الساعة؟ (Brut)", step3Title: "اختر لوناً مميزاً", create: "إنشاء مكان العمل" }
};

export default function JobsPage() {
  const [lang, setLang] = useState("fr");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState("€");
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [rate, setRate] = useState("12.00");
  const [color, setColor] = useState("#3b82f6");

  useEffect(() => {
    const savedSymbol = localStorage.getItem("monshift_symbol");
    if (savedSymbol) {
      setCurrencySymbol(savedSymbol);
    }

    const savedLang = localStorage.getItem("monshift_lang");
    if (savedLang) setLang(savedLang);

    const saved = localStorage.getItem("monshift_jobs");
    if (saved) setJobs(JSON.parse(saved));
  }, []);

  const t = texts[lang] || texts["fr"];

  const saveJob = () => {
    if (!name.trim()) return;
    const newJob: Job = { id: Date.now().toString(), name: name.trim(), rate: parseFloat(rate) || 0, color };
    const updated = [...jobs, newJob];
    setJobs(updated);
    localStorage.setItem("monshift_jobs", JSON.stringify(updated));
    setShowModal(false);
    setStep(1);
    setName("");
  };

  const deleteJob = (id: string) => {
    const updated = jobs.filter(j => j.id !== id);
    setJobs(updated);
    localStorage.setItem("monshift_jobs", JSON.stringify(updated));
  };

  // النمط المشترك للخطوات لجعلها مرنة
  const stepContentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1
  };

  // النمط المشترك للأزرار لتثبيتها في الأسفل
  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    background: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "15px",
    marginTop: "auto" // هذا هو السحر لثبات الزر أسفل المحتوى
  };

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", padding: "16px", fontFamily: "sans-serif", paddingBottom: "90px", background: "#f3f4f6", minHeight: "100vh", direction: lang === "ar" ? "rtl" : "ltr" }}>
      <header style={{ background: "#1e3a8a", color: "white", padding: "16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "18px", margin: 0 }}>🏢 {t.title}</h1>
        <button onClick={() => setShowModal(true)} style={{ background: "#10b981", color: "white", border: "none", width: "32px", height: "32px", borderRadius: "50%", fontSize: "18px", fontWeight: "bold", cursor: "pointer" }}>+</button>
      </header>

      {jobs.length === 0 ? (
        <div style={{ background: "white", padding: "30px", borderRadius: "12px", textAlign: "center", color: "#6b7280" }}>
          <p>{t.noJobs}</p>
          <p style={{ fontSize: "13px", marginTop: "8px" }}>{t.addHint}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {jobs.map((job) => (
            <div key={job.id} style={{ background: "white", padding: "14px 16px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", borderLeft: lang !== "ar" ? `6px solid ${job.color}` : "none", borderRight: lang === "ar" ? `6px solid ${job.color}` : "none" }}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#1f2937" }}>{job.name}</div>
                <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>{job.rate} {currencySymbol} / h</div>
              </div>
              <button onClick={() => deleteJob(job.id)} style={{ background: "transparent", border: "none", color: "#ef4444", fontSize: "13px", cursor: "pointer" }}>{t.delete}</button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        // خلفية المودال: Flex مع alignItems: "center" للظهور في النص
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center", // هذا هو التغيير الأساسي: في المنتصف عمودياً
          justifyContent: "center", // في المنتصف أفقياً
          zIndex: 100,
          overflow: "hidden"
        }}>
          {/* المودال الأبيض: حجم طبيعي و margin: auto */}
          <div style={{
            background: "white",
            width: "90%",
            maxWidth: "480px",
            borderRadius: "20px", // BorderRadius كامل
            padding: "20px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            // نحجم المودال لـ 70٪ من الشاشة عشان المحتوى والزرار يظهروا
            maxHeight: "70vh",
            // نضيف margin: auto عشان نضمن إنه في النص تماماً
            margin: "auto"
          }}>
            {step === 1 && (
              <div style={stepContentStyle}>
                <h3 style={{ fontSize: "16px", marginBottom: "4px" }}>{t.step1Title}</h3>
                <input type="text" placeholder={t.step1Placeholder} value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #d1d5db", fontSize: "16px", boxSizing: "border-box", marginBottom: "20px" }} />
                <button onClick={() => { if(name.trim()) setStep(2); }} style={buttonStyle}>{t.next}</button>
              </div>
            )}
            {step === 2 && (
              <div style={stepContentStyle}>
                <h3 style={{ fontSize: "16px", marginBottom: "4px" }}>{t.step2Title} ({currencySymbol})</h3>
                <input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #d1d5db", fontSize: "16px", boxSizing: "border-box", marginBottom: "20px", textAlign: "center" }} />
                <button onClick={() => setStep(3)} style={buttonStyle}>{t.next}</button>
              </div>
            )}
            {step === 3 && (
              <div style={stepContentStyle}>
                <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>{t.step3Title}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", marginBottom: "20px" }}>
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setColor(c)} style={{ width: "100%", height: "35px", background: c, border: color === c ? "3px solid #000" : "none", borderRadius: "8px", cursor: "pointer" }} />
                  ))}
                </div>
                <button onClick={saveJob} style={buttonStyle}>{t.create}</button>
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNav active="jobs" />
    </main>
  );
}
