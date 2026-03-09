import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percent: number;
  className?: string;
  size?: "sm" | "md";
}

export default function ProgressBar({ percent, className, size = "sm" }: ProgressBarProps) {
  const clamped = Math.min(percent, 100);
  const isFunded = percent >= 100;

  return (
    <div
      className={cn(
        "w-full rounded-full overflow-hidden",
        size === "sm" ? "h-1.5" : "h-2.5",
        "bg-surface-3",
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-1000 ease-out relative",
          isFunded
            ? "bg-gradient-to-r from-success/80 to-success"
            : "bg-gradient-to-r from-primary/80 to-primary"
        )}
        style={{ width: `${clamped}%` }}
      >
        {clamped > 10 && (
          <div
            className={cn(
              "absolute inset-0 rounded-full opacity-50",
              isFunded
                ? "shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                : "shadow-[0_0_8px_rgba(247,147,26,0.4)]"
            )}
          />
        )}
      </div>
    </div>
  );
}
