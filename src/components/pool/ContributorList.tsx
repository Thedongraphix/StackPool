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
      <div className="text-center py-10">
        <div className="h-10 w-10 mx-auto rounded-xl bg-surface-3 border border-border flex items-center justify-center mb-3">
          <svg className="h-4 w-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
        <p className="text-sm text-text-tertiary font-light">No contributions yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {visible.map((contributor, i) => (
        <div
          key={`${contributor.address}-${i}`}
          className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-surface-3/30 transition-colors duration-200"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-surface-3 to-border/30 border border-border/60 flex items-center justify-center text-xs font-medium text-text-tertiary shrink-0">
              {contributor.address.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-text-primary font-mono text-xs truncate">
                {truncateAddress(contributor.address)}
              </p>
              <p className="text-xs text-text-tertiary font-light">{contributor.time}</p>
            </div>
          </div>
          <span className="font-mono text-sm text-text-primary shrink-0 ml-3">
            {formatBtc(contributor.amount)}
            <span className="text-text-tertiary text-xs ml-1">sBTC</span>
          </span>
        </div>
      ))}
      {remaining > 0 && (
        <button className="w-full py-3 text-sm text-primary hover:text-primary-hover transition-colors duration-200 cursor-pointer font-medium">
          View all {contributors.length} contributors
        </button>
      )}
    </div>
  );
}
