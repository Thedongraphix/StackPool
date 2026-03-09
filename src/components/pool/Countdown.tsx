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
      <div className="text-center py-3.5 px-4 rounded-xl bg-error/[0.06] border border-error/15">
        <p className="text-sm text-error font-medium">This pool has expired</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-xl border p-5",
      isUrgent ? "border-warning/20 bg-warning/[0.04]" : "border-border bg-surface-2"
    )}>
      <p className={cn(
        "text-xs font-medium mb-4 text-center tracking-wide uppercase",
        isUrgent ? "text-warning" : "text-text-tertiary"
      )}>
        {isUrgent ? "Ending soon" : "Time remaining"}
      </p>
      <div className="flex items-center justify-center gap-2.5">
        {[
          { value: timeLeft.days, label: "Days" },
          { value: timeLeft.hours, label: "Hrs" },
          { value: timeLeft.minutes, label: "Min" },
          { value: timeLeft.seconds, label: "Sec" },
        ].map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-2.5">
            <div className="text-center">
              <div className={cn(
                "h-14 w-14 rounded-xl flex items-center justify-center font-mono text-xl font-bold tabular-nums",
                isUrgent
                  ? "bg-warning/[0.08] text-warning border border-warning/15"
                  : "bg-surface-3 text-text-primary border border-border/60"
              )}>
                {pad(unit.value)}
              </div>
              <div className="text-[10px] text-text-tertiary uppercase tracking-wider mt-1.5 font-medium">
                {unit.label}
              </div>
            </div>
            {i < 3 && (
              <span className={cn(
                "text-lg font-light -mt-5",
                isUrgent ? "text-warning/40" : "text-text-tertiary/40"
              )}>:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
