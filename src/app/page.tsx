"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

interface BreakItem { 
  id: string; 
  startTime: string; 
  endTime: string; 
  isPaid: boolean;
  paidLimitMinutes: number; 
}

interface DayRecord {
  date: string;
  startTime: string;
  endTime: string;
  breaks: BreakItem[];
  notes: string;
  jobId?: string;
}

interface Job {
  id: string;
  name: string;
  rate: number;
  color: string;
}

export default function HeuresPage() {
  const [selectedDate, setSelectedDate] = useState("2026-08-17");
  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("15:00");
  const [breaks, setBreaks] = useState<BreakItem[]>([
    { id: "1", startTime: "", endTime: "", isPaid: false, paidLimitMinutes: 30 }
  ]);
  const [notes, setNotes] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const savedJobs = localStorage.getItem("monshift_jobs");
    if (savedJobs) {
      const parsedJobs: Job[] = JSON.parse(savedJobs);
      setJobs(parsedJobs);
      if (parsedJobs.length > 0) {
        setSelectedJobId(parsedJobs[0].id);
      }
    } else {
      const defaultJob: Job = { id: "1", name: "Mina", rate: 12.93, color: "#ec4899" };
      setJobs([defaultJob]);
      setSelectedJobId(defaultJob.id);
      localStorage.setItem("monshift_jobs", JSON.stringify([defaultJob]));
    }

    const savedHistory = localStorage.getItem("monshift_history");
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      if (history[selectedDate]) {
        const day = history[selectedDate];
        setStartTime(day.startTime || "07:00");
        setEndTime(day.endTime || "15:00");
        setBreaks(day.breaks || []);
        setNotes(day.notes || "");
        if (day.jobId) setSelectedJobId(day.jobId);
      }
    }
  }, [selectedDate]);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const savedHistory = localStorage.getItem("monshift_history");
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      if (history[newDate]) {
        const day = history[newDate];
        setStartTime(day.startTime || "07:00");
        setEndTime(day.endTime || "15:00");
        setBreaks(day.breaks || []);
        setNotes(day.notes || "");
        if (day.jobId) setSelectedJobId(day.jobId);
        return;
      }
    }
    setStartTime("07:00");
    setEndTime("15:00");
    setBreaks([{ id: "1", startTime: "", endTime: "", isPaid: false, paidLimitMinutes: 30 }]);
    setNotes("");
  };

  const handleSave = () => {
    const history = JSON.parse(localStorage.getItem("monshift_history") || "{}");

    history[selectedDate] = {
      date: selectedDate,
      startTime,
      endTime,
      breaks,
      notes,
      jobId: selectedJobId
    };

    localStorage.setItem("monshift_history", JSON.stringify(history));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const timeToMins = (timeStr: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const calculateMetrics = () => {
    let startMins = timeToMins(startTime);
    let end
