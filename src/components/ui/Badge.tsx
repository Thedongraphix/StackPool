import { PoolStatus } from "@/types";
import { getStatusLabel, cn } from "@/lib/utils";

interface BadgeProps {
  status: PoolStatus;
  className?: string;
}

const dotColor: Record<PoolStatus, string> = {
  active: "bg-primary",
  funded: "bg-success",
  expired: "bg-error",
  cancelled: "bg-text-tertiary",
};

const badgeStyle: Record<PoolStatus, string> = {
  active: "border-primary/20 bg-primary/[0.06] text-primary",
  funded: "border-success/20 bg-success/[0.06] text-success",
  expired: "border-error/20 bg-error/[0.06] text-error",
  cancelled: "border-border bg-surface-3/60 text-text-secondary",
};

export default function Badge({ status, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium tracking-wide border",
        badgeStyle[status],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotColor[status])} />
      {getStatusLabel(status)}
    </span>
  );
}
