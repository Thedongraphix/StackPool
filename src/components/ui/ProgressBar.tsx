import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percent: number;
  className?: string;
  size?: "sm" | "md";
}

export default function ProgressBar({ percent, className, size = "sm" }: ProgressBarProps) {
  return (
    <div
      className={cn(
        "w-full rounded-full bg-surface-3 overflow-hidden",
        size === "sm" ? "h-1.5" : "h-2.5",
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-700 ease-out",
          percent >= 100 ? "bg-success" : "bg-primary"
        )}
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
}
