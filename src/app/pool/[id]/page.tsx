"use client";

import { use, useState } from "react";
import Link from "next/link";
import { formatBtc, getProgressPercent, truncateAddress, getDaysLeft, cn } from "@/lib/utils";
import { CONTRACT_ADDRESS, CONTRACT_NAME, getTxUrl, stxToMicro } from "@/lib/stacks";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProgressRing from "@/components/ui/ProgressRing";
import ProgressBar from "@/components/ui/ProgressBar";
import ContributorList from "@/components/pool/ContributorList";
import Countdown from "@/components/pool/Countdown";
import ShareModal from "@/components/modals/ShareModal";
import ConnectWalletModal from "@/components/modals/ConnectWalletModal";
import { getEmoji } from "@/components/pool/PoolCard";
import { useWallet } from "@/hooks/useWallet";
import { usePool } from "@/hooks/usePool";
import { useContributeAction, useWithdraw, useCancelPool } from "@/hooks/useContribute";
import Skeleton from "@/components/ui/Skeleton";

const QUICK_AMOUNTS = [0.0001, 0.001, 0.005];

export default function PoolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { pool, loading, refetch } = usePool(id);
  const { isConnected, address } = useWallet();
  const { loading: contributing, txId: contributeTxId, contribute } = useContributeAction();
  const { loading: withdrawing, withdraw } = useWithdraw();
  const { loading: cancelling, cancel } = useCancelPool();

  const [contributeAmount, setContributeAmount] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        <Skeleton className="h-5 w-24 mb-6" />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="lg:w-80">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!pool) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24 text-center">
        <h1 className="text-2xl font-bold mb-2">Pool not found</h1>
        <p className="text-text-secondary mb-8 font-light">This pool doesn&apos;t exist or has been removed.</p>
        <Link href="/explore">
          <Button variant="secondary">Browse Pools</Button>
        </Link>
      </div>
    );
  }

  const percent = getProgressPercent(pool.currentAmount, pool.targetAmount);
  const daysLeft = getDaysLeft(pool.deadline);
  const isCreator = isConnected && address === pool.creator;
  const contractId = `${truncateAddress(CONTRACT_ADDRESS, 6)}.${CONTRACT_NAME}`;

  async function handleContribute() {
    if (!contributeAmount || parseFloat(contributeAmount) <= 0) return;
    if (!isConnected || !address) {
      setConnectModalOpen(true);
      return;
    }
    await contribute(parseInt(id), parseFloat(contributeAmount), address);
    refetch();
  }

  async function handleWithdraw() {
    if (!isConnected || !pool) return;
    await withdraw(parseInt(id), stxToMicro(pool.currentAmount));
    refetch();
  }

  async function handleCancel() {
    if (!isConnected || !pool) return;
    await cancel(parseInt(id));
    refetch();
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Back link */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-primary transition-colors duration-200 mb-8"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          All Pools
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Pool Header */}
            <div className="flex items-start gap-4 mb-8">
              <div className="h-14 w-14 rounded-2xl bg-surface-3 border border-border flex items-center justify-center text-3xl shrink-0">
                {getEmoji(pool.coverEmoji)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{pool.title}</h1>
                  <Badge status={pool.status} />
                </div>
                <p className="text-sm text-text-secondary mt-1.5 font-light">
                  Created by{" "}
                  <span className="text-text-primary font-mono font-medium text-xs">{truncateAddress(pool.creator)}</span>
                </p>
              </div>
            </div>

            {/* Progress Section */}
            <div className="card-glow p-6 sm:p-8 mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <ProgressRing percent={percent} size={180} strokeWidth={10}>
                  <span className="font-mono text-2xl font-bold text-text-primary">
                    {formatBtc(pool.currentAmount)}
                  </span>
                  <span className="text-xs text-text-secondary mt-1 font-light">
                    of {formatBtc(pool.targetAmount)} sBTC
                  </span>
                </ProgressRing>

                <div className="flex-1 w-full">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-3xl font-bold font-mono text-text-primary">{percent}%</span>
                    <span className="text-sm text-text-tertiary font-light">funded</span>
                  </div>
                  <ProgressBar percent={percent} size="md" className="mb-5" />
                  <div className="flex items-center gap-4 text-sm text-text-secondary font-light">
                    <span>{pool.contributorCount} contributors</span>
                    <span className="text-border/60">|</span>
                    {pool.status === "active" ? (
                      <span>{daysLeft} day{daysLeft !== 1 ? "s" : ""} left</span>
                    ) : pool.status === "funded" ? (
                      <span className="text-success font-medium">Target reached</span>
                    ) : (
                      <span className="text-error font-medium">Expired</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contribute */}
            {pool.status === "active" && (
              <div className="card-glow p-6 mb-6">
                <h2 className="text-base font-semibold text-text-primary mb-4">Contribute</h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  {QUICK_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setContributeAmount(amt.toString())}
                      className={cn(
                        "h-9 px-4 rounded-xl text-sm font-mono font-medium transition-all duration-200 cursor-pointer",
                        contributeAmount === amt.toString()
                          ? "bg-primary text-surface shadow-[0_0_10px_rgba(247,147,26,0.15)]"
                          : "bg-surface-3/60 border border-border text-text-secondary hover:border-border-hover hover:text-text-primary"
                      )}
                    >
                      {amt}
                    </button>
                  ))}
                  <button
                    onClick={() => setContributeAmount("")}
                    className={cn(
                      "h-9 px-4 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer",
                      !QUICK_AMOUNTS.map(String).includes(contributeAmount) && contributeAmount
                        ? "bg-primary text-surface shadow-[0_0_10px_rgba(247,147,26,0.15)]"
                        : "bg-surface-3/60 border border-border text-text-secondary hover:border-border-hover"
                    )}
                  >
                    Custom
                  </button>
                </div>
                <div className="relative mb-4">
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={contributeAmount}
                    onChange={(e) => setContributeAmount(e.target.value)}
                    className="w-full h-12 rounded-xl bg-surface-3/60 border border-border px-4 pr-16 text-base font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-tertiary font-mono">
                    sBTC
                  </span>
                </div>
                {contributeAmount && parseFloat(contributeAmount) > 0 && (
                  <p className="text-xs text-text-tertiary mb-4 font-light">
                    Approx. {(parseFloat(contributeAmount) * 7500000).toLocaleString()} KES
                  </p>
                )}

                {contributeTxId && (
                  <div className="rounded-xl border border-success/15 bg-success/[0.04] p-3.5 mb-4">
                    <p className="text-xs text-success">
                      Contribution submitted!{" "}
                      <a href={getTxUrl(contributeTxId)} target="_blank" rel="noopener noreferrer" className="underline font-medium">
                        View on Explorer
                      </a>
                    </p>
                  </div>
                )}

                {isConnected ? (
                  <Button onClick={handleContribute} fullWidth size="lg" disabled={contributing}>
                    {contributing ? "Signing..." : "Contribute Now"}
                  </Button>
                ) : (
                  <Button onClick={() => setConnectModalOpen(true)} fullWidth size="lg">
                    Connect Wallet to Contribute
                  </Button>
                )}
                <p className="text-xs text-text-tertiary mt-3 text-center font-light">
                  Exactly {contributeAmount || "0"} sBTC will be transferred from your wallet
                </p>
              </div>
            )}

            {/* Countdown */}
            {pool.status === "active" && (
              <div className="mb-6">
                <Countdown deadline={pool.deadline} />
              </div>
            )}

            {/* Contributors */}
            <div className="card-glow p-6 mb-6">
              <h2 className="text-base font-semibold text-text-primary mb-4">
                Contributors ({pool.contributorCount})
              </h2>
              <ContributorList contributors={pool.contributors} />
            </div>

            {/* Pool Details Accordion */}
            <div className="card-glow overflow-hidden mb-6">
              <button
                onClick={() => setDetailsOpen(!detailsOpen)}
                className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-surface-3/20 transition-colors duration-200"
              >
                <h2 className="text-base font-semibold text-text-primary">Pool Details</h2>
                <svg
                  className={cn("h-4 w-4 text-text-tertiary transition-transform duration-300", detailsOpen && "rotate-180")}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {detailsOpen && (
                <div className="px-5 pb-5 space-y-3 border-t border-border/40 pt-4 animate-fade-in">
                  <p className="text-sm text-text-secondary leading-relaxed font-light">{pool.description}</p>
                  <div className="space-y-3 pt-2">
                    {[
                      { label: "Recipient", value: truncateAddress(pool.recipient, 8) },
                      { label: "Deadline", value: pool.deadline },
                      { label: "Contract", value: contractId },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between">
                        <span className="text-sm text-text-tertiary font-light">{row.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-text-primary font-mono">{row.value}</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(row.value)}
                            className="text-text-tertiary hover:text-text-secondary transition-colors duration-200 cursor-pointer"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Share */}
              <div className="card-glow p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Share this pool</h3>
                <div className="mx-auto w-32 h-32 rounded-xl bg-white flex items-center justify-center mb-4">
                  <div className="w-24 h-24 bg-surface rounded-lg grid grid-cols-5 grid-rows-5 gap-px p-1.5">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-[1px] ${
                          [0, 1, 2, 4, 5, 6, 10, 12, 14, 18, 20, 22, 23, 24].includes(i)
                            ? "bg-surface"
                            : "bg-text-primary"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <Button variant="secondary" fullWidth size="sm" onClick={() => setShareOpen(true)}>
                  Share Pool
                </Button>
              </div>

              {/* Creator Controls */}
              {isCreator && (
                <div className="card-glow p-5">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">Pool Management</h3>
                  <div className="space-y-2.5">
                    <Button
                      fullWidth
                      size="sm"
                      disabled={pool.status !== "funded" || withdrawing}
                      onClick={handleWithdraw}
                    >
                      {withdrawing ? "Signing..." : "Withdraw Funds"}
                    </Button>
                    <Button
                      variant="danger"
                      fullWidth
                      size="sm"
                      disabled={pool.contributorCount > 0 || cancelling}
                      onClick={handleCancel}
                    >
                      {cancelling ? "Signing..." : "Cancel Pool"}
                    </Button>
                  </div>
                  {pool.status === "funded" && (
                    <p className="text-xs text-success mt-3 text-center font-medium">Target reached. Ready to withdraw.</p>
                  )}
                  {pool.status === "active" && pool.contributorCount > 0 && (
                    <p className="text-xs text-text-tertiary mt-3 text-center font-light">
                      Cannot cancel a pool with contributions.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        poolTitle={pool.title}
        poolId={pool.id}
      />
      <ConnectWalletModal
        open={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
      />
    </>
  );
}
