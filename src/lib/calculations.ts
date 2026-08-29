export interface BreakInterval {
  startTime: string;
  endTime: string | null;
}

export interface WorkDayInput {
  startTime: string | null;
  endTime: string | null;
  breaks: BreakInterval[];
  targetDailyHours?: number;
}

function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToFormatted(totalMinutes: number): string {
  const sign = totalMinutes < 0 ? "-" : "";
  const absMinutes = Math.abs(totalMinutes);
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;
  return `${sign}${String(hours).padStart(2, "0")}h${String(minutes).padStart(2, "0")}`;
}

export function calculateWorkDay(input: WorkDayInput) {
  if (!input.startTime || !input.endTime) {
    return { formattedNet: "00h00", formattedOvertime: "00h00" };
  }
  let startMin = timeToMinutes(input.startTime);
  let endMin = timeToMinutes(input.endTime);
  if (endMin <= startMin) endMin += 24 * 60;
  
  let grossDuration = endMin - startMin;
  let totalBreakMinutes = 0;

  for (const b of input.breaks) {
    if (b.startTime && b.endTime) {
      let bStart = timeToMinutes(b.startTime);
      let bEnd = timeToMinutes(b.endTime);
      if (bStart < startMin) bStart += 24 * 60;
      if (bEnd < bStart) bEnd += 24 * 60;
      totalBreakMinutes += Math.max(0, bEnd - bStart);
    }
  }

  const netWorkedMinutes = Math.max(0, grossDuration - totalBreakMinutes);
  const targetMinutes = (input.targetDailyHours ?? 7) * 60;
  const overtimeMinutes = netWorkedMinutes - targetMinutes;

  return {
    formattedNet: minutesToFormatted(netWorkedMinutes),
    formattedOvertime: minutesToFormatted(overtimeMinutes),
  };
}
