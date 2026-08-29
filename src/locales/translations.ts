export const translations: Record<string, any> = {
  fr: {
    hours: "Heures",
    jobs: "Emplois",
    calendar: "Calendrier",
    totalBrut: "Total brut",
    start: "Début",
    end: "Fin",
    breaks: "Pauses",
    paidBreak: "Pause payée",
    addBreak: "+ Ajouter une pause",
    notes: "Ajouter une note...",
    saveDay: "Enregistrer ce jour",
    noJobs: "Aucun emploi enregistré.",
    addJobBtn: "Créer un emploi",
  },
  en: {
    hours: "Hours",
    jobs: "Jobs",
    calendar: "Calendar",
    totalBrut: "Gross Total",
    start: "Start",
    end: "End",
    breaks: "Breaks",
    paidBreak: "Paid break",
    addBreak: "+ Add break",
    notes: "Add a note...",
    saveDay: "Save this day",
    noJobs: "No jobs registered.",
    addJobBtn: "Create job",
  },
  ar: {
    hours: "الساعات",
    jobs: "أماكن العمل",
    calendar: "التقويم",
    totalBrut: "إجمالي الراتب (Brut)",
    start: "البداية",
    end: "النهاية",
    breaks: "الاستراحات",
    paidBreak: "استراحة مدفوعة",
    addBreak: "+ إضافة استراحة",
    notes: "إضافة ملاحظة...",
    saveDay: "حفظ هذا اليوم",
    noJobs: "لا توجد أماكن عمل مسجلة.",
    addJobBtn: "إنشاء مكان عمل",
  }
};

export function getDeviceLanguage(): string {
  if (typeof window === "undefined") return "fr";
  const lang = navigator.language || (navigator as any).userLanguage;
  if (lang.startsWith("ar")) return "ar";
  if (lang.startsWith("en")) return "en";
  return "fr"; // الافتراضي للفرنساوية بناءً على طبيعة التطبيق
}
