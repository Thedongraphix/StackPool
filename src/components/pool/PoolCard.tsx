import Link from "next/link";
import { Pool } from "@/types";
import { formatBtc, getProgressPercent, getDaysLeft } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";

interface PoolCardProps {
  pool: Pool;
}

const emojiMap: Record<string, string> = {
  palm_tree: "\uD83C\uDF34",
  chart_increasing: "\uD83D\uDCC8",
  globe_with_meridians: "\uD83C\uDF10",
  books: "\uD83D\uDCDA",
  birthday_cake: "\uD83C\uDF82",
  rocket: "\uD83D\uDE80",
  party: "\uD83C\uDF89",
  house: "\uD83C\uDFE0",
  briefcase: "\uD83D\uDCBC",
  money: "\uD83D\uDCB0",
};

export function getEmoji(key: string): string {
  return emojiMap[key] || "\uD83C\uDFAF";
}

export default function PoolCard({ pool }: PoolCardProps) {
  const percent = getProgressPercent(pool.currentAmount, pool.targetAmount);
  const daysLeft = getDaysLeft(pool.deadline);

  return (
    <Link href={`/pool/${pool.id}`} className="group block">
      <div className="card-glow p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-surface-3 border border-border flex items-center justify-center text-lg shrink-0 group-hover:border-primary/20 transition-colors">
              {getEmoji(pool.coverEmoji)}
            </div>
            <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-primary transition-colors duration-200">
              {pool.title}
            </h3>
          </div>
          <Badge status={pool.status} />
        </div>

        <p className="text-xs text-text-tertiary line-clamp-2 mb-4 leading-relaxed font-light">
          {pool.description}
        </p>

        <ProgressBar percent={percent} className="mb-3" />

        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-sm font-semibold text-text-primary">
              {formatBtc(pool.currentAmount)}
            </span>
            <span className="text-xs text-text-tertiary ml-1.5">
              / {formatBtc(pool.targetAmount)} sBTC
            </span>
          </div>
          <div className="text-xs text-text-tertiary font-light">
            {pool.status === "active" ? (
              daysLeft > 0 ? (
                <span>{daysLeft}d left</span>
              ) : (
                <span className="text-warning font-medium">Ending today</span>
              )
            ) : pool.status === "funded" ? (
              <span className="text-success font-medium">Complete</span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-border/50">
          <span className="text-xs text-text-tertiary font-light">
            {pool.contributorCount} contributor{pool.contributorCount !== 1 ? "s" : ""}
          </span>
          <span className="text-xs font-medium text-primary opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            View pool &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
