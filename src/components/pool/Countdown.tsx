"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CountdownProps {
  deadline: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(deadline: string): TimeLeft {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export default function Countdown({ deadline }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(deadline));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const isExpired = timeLeft.days + timeLeft.hours + timeLeft.minutes + timeLeft.seconds === 0;
  const isUrgent = timeLeft.days === 0 && !isExpired;

  if (isExpired) {
    return (
      <div className="text-center py-3 px-4 rounded-lg bg-error-muted border border-error/20">
        <p className="text-sm text-error font-medium">This pool has expired</p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border p-4", isUrgent ? "border-warning/30 bg-warning-muted" : "border-border bg-surface-3")}>
      <p className={cn("text-xs font-medium mb-3 text-center", isUrgent ? "text-warning" : "text-text-secondary")}>
        {isUrgent ? "Ending soon" : "Time remaining"}
      </p>
      <div className="flex items-center justify-center gap-3">
        {[
          { value: timeLeft.days, label: "Days" },
          { value: timeLeft.hours, label: "Hrs" },
          { value: timeLeft.minutes, label: "Min" },
          { value: timeLeft.seconds, label: "Sec" },
        ].map((unit) => (
          <div key={unit.label} className="text-center">
            <div className={cn(
              "font-mono text-xl font-bold tabular-nums",
              isUrgent ? "text-warning" : "text-text-primary"
            )}>
              {pad(unit.value)}
            </div>
            <div className="text-[10px] text-text-tertiary uppercase tracking-wider mt-0.5">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
