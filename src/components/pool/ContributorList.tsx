import { Contributor } from "@/types";
import { formatBtc, truncateAddress } from "@/lib/utils";

interface ContributorListProps {
  contributors: Contributor[];
  maxVisible?: number;
}

export default function ContributorList({ contributors, maxVisible = 5 }: ContributorListProps) {
  const visible = contributors.slice(0, maxVisible);
  const remaining = contributors.length - maxVisible;

  if (contributors.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-text-tertiary">No contributions yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {visible.map((contributor, i) => (
        <div
          key={`${contributor.address}-${i}`}
          className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-surface-3/50 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-7 w-7 rounded-full bg-surface-3 border border-border flex items-center justify-center text-xs font-medium text-text-tertiary shrink-0">
              {contributor.address.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-text-primary truncate">
                {truncateAddress(contributor.address)}
              </p>
              <p className="text-xs text-text-tertiary">{contributor.time}</p>
            </div>
          </div>
          <span className="font-mono text-sm text-text-primary shrink-0 ml-3">
            {formatBtc(contributor.amount)}
            <span className="text-text-tertiary text-xs ml-1">sBTC</span>
          </span>
        </div>
      ))}
      {remaining > 0 && (
        <button className="w-full py-2.5 text-sm text-primary hover:text-primary-hover transition-colors cursor-pointer">
          View all {contributors.length} contributors
        </button>
      )}
    </div>
  );
}
