import { PoolStatus } from "@/types";
import { getStatusColor, getStatusLabel, cn } from "@/lib/utils";

interface BadgeProps {
  status: PoolStatus;
  className?: string;
}

export default function Badge({ status, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
        getStatusColor(status),
        className
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}
