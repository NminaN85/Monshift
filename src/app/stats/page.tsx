"use client";


import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

interface BreakItem { 
  startTime: string; 
  endTime: string; 
  isPaid: boolean; 
}
interface ShiftRecord {
  id?: string;
  jobId?: string;
  startTime: string;
  endTime: string;
  breaks: BreakItem[];
  maxPaidMinutes?: number;
  notes: string;
}
interface Job { id: string; name: string; rate: number; color: string; }

const texts: Record<string, any> = {
  fr: {
    title: "Rapports & Statistiques Avancés",
    selectPeriod: "Sélectionner la période",
    selectJobFilter: "Filtrer par lieu de travail (Job)",
    allJobs: "Tous les lieux de travail",
    from: "Du",
    to: "Au",
    includeElements: "Éléments à inclure dans le rapport",
    time: "Entrée/Sortie",
    breaks: "Pauses",
    hours: "Heures",
    money: "Montants",
    job: "Lieu de travail",
    totalPeriod: "Total Période",
    days: "jours / shifts",
    totalRevenue: "Revenu Total",
    csvBtn: "📥 Télécharger CSV",
    pdfBtn: "🖨️ Tableau PDF",
    shareBtn: "📤 Partager",
    previewTitle: "Aperçu du rapport",
    noData: "Aucune donnée trouvée pour cette période.",
    paid: "Payée",
    unpaid: "Non",
    closeWindow: "Fermer la fenêtre / Retour"
  },
  en: {
    title: "Advanced Reports & Stats",
    selectPeriod: "Select Period",
    selectJobFilter: "Filter by workplace (Job)",
    allJobs: "All workplaces",
    from: "From",
    to: "To",
    includeElements: "Elements to include in the report",
    time: "Clock In/Out",
    breaks: "Breaks",
    hours: "Hours",
    money: "Amount",
    job: "Workplace",
    totalPeriod: "Period Total",
    days: "days / shifts",
    totalRevenue: "Total Revenue",
    csvBtn: "📥 Download CSV",
    pdfBtn: "🖨️ PDF Table",
    shareBtn: "📤 Share",
    previewTitle: "Report Preview",
    noData: "No data found for this period.",
    paid: "Paid",
    unpaid: "Unpaid",
    closeWindow: "Close Window / Back"
  },
  ar: {
    title: "التقارير والإحصائيات المتقدمة",
    selectPeriod: "تحديد الفترة الزمنية",
    selectJobFilter: "فلترة حسب مكان العمل (الشركة)",
    allJobs: "جميع أماكن العمل",
    from: "من تاريخ",
    to: "إلى تاريخ",
    includeElements: "العناصر المراد تضمينها في التقرير",
    time: "وقت الحضور والانصراف",
    breaks: "الاستراحات (البوز)",
    hours: "عدد الساعات",
    money: "المبالغ",
    job: "مكان العمل",
    totalPeriod: "إجمالي الفترة",
    days: "أيام / ورديات",
    totalRevenue: "إجمالي الدخل",
    csvBtn: "📥 تحميل ملف CSV",
    pdfBtn: "🖨️ جدول PDF",
    shareBtn: "📤 مشاركة",
    previewTitle: "معاينة التقرير",
    noData: "لا توجد بيانات مسجلة في هذه الفترة.",
    paid: "مدفوع",
    unpaid: "غير مدفوع",
    closeWindow: "إغلاق النافذة / العودة للتطبيق"
  }
};

export default function StatsPage() {
  const [lang, setLang] = useState("fr");
  const [history, setHistory] = useState<Record<string, any>>({});
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState("€");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedJobFilter, setSelectedJobFilter] = useState("ALL");

  const [includeTime, setIncludeTime] = useState(true);
  const [includeBreaks, setIncludeBreaks] = useState(true);
  const [includeMoney, setIncludeMoney] = useState(true);
  const [includeHours, setIncludeHours] = useState(true);
  const [includeJob, setIncludeJob] = useState(true);

  useEffect(() => {
    const savedSymbol = localStorage.getItem("monshift_symbol");
    if (savedSymbol) setCurrencySymbol(savedSymbol);

    const savedLang = localStorage.getItem("monshift_lang");
    if (savedLang) setLang(savedLang);

    const savedHistory = localStorage.getItem("monshift_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedJobs = localStorage.getItem("monshift_jobs");
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    }

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
    setStartDate(firstDay);
    setEndDate(lastDay);
  }, []);

  const t = texts[lang] || texts["fr"];

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

        if (!b.isPaid) {
          totalUnpaidBreakMins += duration;
        } else {
          totalPaidBreakMins += duration;
        }
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
    const formattedTime = `${Math.floor(netMins / 60)}h${String(netMins % 60).padStart(2, "0")}`;

    return { netMins, formattedTime, amount, job };
  };

  const getFilteredShifts = () => {
    let allShifts: { date: string; shift: ShiftRecord }[] = [];

    Object.entries(history).forEach(([dateKey, record]) => {
      if (!startDate || !endDate || (dateKey >= startDate && dateKey <= endDate)) {
        if (Array.isArray(record)) {
          record.forEach(shift => {
            allShifts.push({ date: dateKey, shift });
          });
        } else if (record && record.startTime) {
          allShifts.push({
            date: dateKey,
            shift: {
              jobId: record.jobId,
              startTime: record.startTime,
              endTime: record.endTime,
              breaks: record.breaks || [],
              maxPaidMinutes: record.maxPaidMinutes,
              notes: record.notes || ""
            }
          });
        }
      }
    });

    if (selectedJobFilter !== "ALL") {
      allShifts = allShifts.filter(({ shift }) => shift.jobId === selectedJobFilter);
    }

    return allShifts.sort((a, b) => a.date.localeCompare(b.date));
  };

  const filteredShifts = getFilteredShifts();

  const getTotalMetrics = () => {
    let totalMins = 0;
    let totalAmount = 0;
    filteredShifts.forEach(({ shift }) => {
      const m = calculateShiftMetrics(shift);
      totalMins += m.netMins;
      totalAmount += m.amount;
    });
    return {
      totalHours: `${Math.floor(totalMins / 60)}h${String(totalMins % 60).padStart(2, "0")}`,
      totalAmount: totalAmount.toFixed(2),
      shiftsCount: filteredShifts.length
    };
  };

  const totals = getTotalMetrics();

  const handleExportCSV = async () => {
    if (filteredShifts.length === 0) {
      alert(t.noData);
      return;
    }

    let headers = ["Date"];
    if (includeJob) headers.push("Job");
    if (includeTime) headers.push("Debut", "Fin");
    if (includeBreaks) headers.push("Pauses");
    if (includeHours) headers.push("Heures");
    if (includeMoney) headers.push(`Montant (${currencySymbol})`);

    let csvRows = [headers.join(",")];

    filteredShifts.forEach(({ date, shift }) => {
      const metrics = calculateShiftMetrics(shift);
      const breaksStr = shift.breaks?.map(b => `${b.startTime}-${b.endTime}(${b.isPaid ? t.paid : t.unpaid})`).join(" | ") || "-";

      let row = [date];
      if (includeJob) row.push(`"${metrics.job.name}"`);
      if (includeTime) row.push(shift.startTime, shift.endTime);
      if (includeBreaks) row.push(`"${breaksStr}"`);
      if (includeHours) row.push(metrics.formattedTime);
      if (includeMoney) row.push(metrics.amount.toFixed(2));

      csvRows.push(row.join(","));
    });

    const csvString = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const file = new File([blob], `MonShift_Report_${startDate}_to_${endDate}.csv`, { type: "text/csv" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "MonShift Report CSV",
          text: "Voici le rapport CSV généré par MonShift",
        });
        return;
      } catch (err) {}
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MonShift_Report_${startDate}_to_${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    if (filteredShifts.length === 0) {
      alert(t.noData);
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let tableHTML = `
      <html dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
        <head>
          <title>MonShift Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; direction: ${lang === 'ar' ? 'rtl' : 'ltr'}; }
            .no-print { text-align: center; margin-bottom: 20px; }
            .close-btn { background: #dc2626; color: white; border: none; padding: 10px 20px; font-size: 14px; font-weight: bold; border-radius: 6px; cursor: pointer; }
            h2 { color: #1e3a8a; text-align: center; margin-bottom: 5px; }
            .subtitle { text-align: center; font-size: 14px; color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 12px; font-size: 13px; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
            th { background-color: #1e3a8a; color: white; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .totals { margin-top: 20px; font-size: 15px; font-weight: bold; background: #f1f5f9; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="no-print">
            <button class="close-btn" onclick="window.close()">${t.closeWindow}</button>
          </div>
          <h2>MonShift - Report</h2>
          <div class="subtitle">${t.from} : ${startDate} | ${t.to} : ${endDate}</div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                ${includeJob ? `<th>${t.job}</th>` : ''}
                ${includeTime ? `<th>${t.time}</th>` : ''}
                ${includeBreaks ? `<th>${t.breaks}</th>` : ''}
                ${includeHours ? `<th>${t.hours}</th>` : ''}
                ${includeMoney ? `<th>${t.money} (${currencySymbol})</th>` : ''}
              </tr>
            </thead>
            <tbody>
    `;

    filteredShifts.forEach(({ date, shift }) => {
      const metrics = calculateShiftMetrics(shift);
      const breaksStr = shift.breaks?.map(b => `${b.startTime}-${b.endTime} (${b.isPaid ? t.paid : t.unpaid})`).join("<br/>") || "-";

      tableHTML += `
        <tr>
          <td>${date}</td>
          ${includeJob ? `<td><b>${metrics.job.name}</b></td>` : ''}
          ${includeTime ? `<td>${shift.startTime} - ${shift.endTime}</td>` : ''}
          ${includeBreaks ? `<td>${breaksStr}</td>` : ''}
          ${includeHours ? `<td><b>${metrics.formattedTime}</b></td>` : ''}
          ${includeMoney ? `<td><b>${metrics.amount.toFixed(2)} ${currencySymbol}</b></td>` : ''}
        </tr>
      `;
    });

    tableHTML += `
            </tbody>
          </table>
          <div class="totals">
            <span>Shifts : ${totals.shiftsCount}</span>
            <span>${t.hours} : ${totals.totalHours}</span>
            <span>${t.totalRevenue} : ${totals.totalAmount} ${currencySymbol}</span>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(tableHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleShareReport = () => {
    const reportText = `📊 MonShift Report (${startDate} - ${endDate}):\n- Shifts: ${totals.shiftsCount}\n- ${t.hours}: ${totals.totalHours}\n- ${t.totalRevenue}: ${totals.totalAmount} ${currencySymbol}`;
    if (navigator.share) {
      navigator.share({
        title: 'MonShift Report',
        text: reportText,
      }).catch(() => {});
    } else {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(reportText)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", paddingBottom: "100px", fontFamily: "sans-serif", background: "#f3f4f6", minHeight: "100vh", direction: lang === "ar" ? "rtl" : "ltr" }}>
      
      <header style={{ background: "#1e3a8a", color: "white", padding: "16px", textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>
        📊 {t.title}
      </header>

      <div style={{ padding: "16px" }}>
        
        {/* صندوق تحديد المدة */}
        <div style={{ background: "white", padding: "14px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "14px" }}>
          <div style={{ fontWeight: "bold", fontSize: "14px", color: "#374151", marginBottom: "10px" }}>📅 {t.selectPeriod}</div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "11px", color: "#6b7280" }}>{t.from}</span>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "13px" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "11px", color: "#6b7280" }}>{t.to}</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "13px" }}
              />
            </div>
          </div>
        </div>

        {/* فلتر مكان العمل الواضح */}
        <div style={{ background: "white", padding: "14px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "14px", border: "2px solid #3b82f6" }}>
          <div style={{ fontWeight: "bold", fontSize: "14px", color: "#1e3a8a", marginBottom: "8px" }}>🏢 {t.selectJobFilter}</div>
          <select 
            value={selectedJobFilter} 
            onChange={(e) => setSelectedJobFilter(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", background: "white", outline: "none", fontWeight: "bold", color: "#374151" }}
          >
            <option value="ALL">🌐 {t.allJobs}</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>💼 {job.name} ({job.rate} {currencySymbol}/h)</option>
            ))}
          </select>
        </div>

        {/* عناصر التقرير */}
        <div style={{ background: "white", padding: "14px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "14px" }}>
          <div style={{ fontWeight: "bold", fontSize: "14px", color: "#374151", marginBottom: "8px" }}>⚙️ {t.includeElements}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "13px", color: "#4b5563" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input type="checkbox" checked={includeTime} onChange={(e) => setIncludeTime(e.target.checked)} /> {t.time}
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input type="checkbox" checked={includeBreaks} onChange={(e) => setIncludeBreaks(e.target.checked)} /> {t.breaks}
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input type="checkbox" checked={includeHours} onChange={(e) => setIncludeHours(e.target.checked)} /> {t.hours}
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input type="checkbox" checked={includeMoney} onChange={(e) => setIncludeMoney(e.target.checked)} /> {t.money} ({currencySymbol})
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input type="checkbox" checked={includeJob} onChange={(e) => setIncludeJob(e.target.checked)} /> {t.job}
            </label>
          </div>
        </div>

        {/* الملخص */}
        <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", color: "white", padding: "16px", borderRadius: "12px", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
          <div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>{t.totalPeriod} ({totals.shiftsCount} shifts)</div>
            <div style={{ fontSize: "22px", fontWeight: "bold" }}>{totals.totalHours}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>{t.totalRevenue}</div>
            <div style={{ fontSize: "22px", fontWeight: "bold" }}>{totals.totalAmount} {currencySymbol}</div>
          </div>
        </div>

        {/* أزرار التصدير */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <button 
            onClick={handleExportCSV}
            style={{ flex: 1, background: "#059669", color: "white", border: "none", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}
          >
            {t.csvBtn}
          </button>
          <button 
            onClick={handlePrintPDF}
            style={{ flex: 1, background: "#dc2626", color: "white", border: "none", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}
          >
            {t.pdfBtn}
          </button>
          <button 
            onClick={handleShareReport}
            style={{ flex: 1, background: "#2563eb", color: "white", border: "none", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}
          >
            {t.shareBtn}
          </button>
        </div>

        {/* المعاينة الحية */}
        <div style={{ background: "white", padding: "14px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ fontWeight: "bold", fontSize: "14px", color: "#374151", marginBottom: "10px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>
            👁️ {t.previewTitle} ({filteredShifts.length})
          </div>

          {filteredShifts.length === 0 ? (
            <div style={{ color: "#9ca3af", textAlign: "center", padding: "20px", fontSize: "13px" }}>{t.noData}</div>
          ) : (
            filteredShifts.map(({ date, shift }, index) => {
              const metrics = calculateShiftMetrics(shift);
              const validBreaks = shift.breaks?.filter(b => b.startTime && b.endTime) || [];

              return (
                <div key={index} style={{ borderBottom: "1px solid #f3f4f6", paddingBottom: "8px", marginBottom: "8px", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: "#1f2937" }}>
                    <span>📅 {date}</span>
                    {includeMoney && <span style={{ color: "#0284c7" }}>{metrics.amount.toFixed(2)} {currencySymbol}</span>}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "12px", marginTop: "2px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {includeJob && <span style={{ color: "#7c3aed", fontWeight: "bold" }}>{metrics.job.name}</span>}
                    {includeTime && <span>🕒 {shift.startTime} - {shift.endTime}</span>}
                    {includeBreaks && validBreaks.length > 0 && (
                      <span style={{ color: "#d97706" }}>
                        {validBreaks.map(b => `☕ ${b.startTime}-${b.endTime} (${b.isPaid ? t.paid : t.unpaid})`).join(" | ")}
                      </span>
                    )}
                    {includeHours && <span style={{ fontWeight: "bold", color: "#374151" }}>⏱️ {metrics.formattedTime}</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      <BottomNav active="stats" />
    </main>
  );
}