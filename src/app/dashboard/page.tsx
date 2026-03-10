"use client";

import { useState } from "react";
import Link from "next/link";
import { formatBtc, cn, truncateAddress } from "@/lib/utils";
import PoolCard from "@/components/pool/PoolCard";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { useWallet } from "@/hooks/useWallet";
import { usePools } from "@/hooks/usePool";

export default function DashboardPage() {
  const [tab, setTab] = useState<"created" | "all">("created");
  const { isConnected, address, connect } = useWallet();
  const { pools, loading, error, refetch } = usePools();

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mb-5">
          <svg className="h-7 w-7 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold mb-2">Connect your wallet</h1>
        <p className="text-sm text-text-secondary mb-8 font-light">Connect a Stacks wallet to view your pools and contributions.</p>
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    );
  }

  const myPools = pools.filter((p) => p.creator === address);
  const allPools = pools;

  const activePools = tab === "created" ? myPools : allPools;
  const totalPooled = myPools.reduce((sum, p) => sum + p.currentAmount, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      {/* Profile header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/15 flex items-center justify-center text-primary font-bold text-xl">
            {(address || "S").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight font-mono">{truncateAddress(address || "")}</h1>
            <div className="flex items-center gap-4 mt-1.5 text-sm text-text-secondary font-light">
              <span>{myPools.length} Pools Created</span>
              <span className="text-border/60">|</span>
              <span>{allPools.length} Total On-chain</span>
              <span className="text-border/60">|</span>
              <span className="font-mono font-medium text-text-primary">{formatBtc(totalPooled)} STX</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-tertiary hover:text-text-secondary bg-surface-3/50 hover:bg-surface-3 border border-border/40 transition-colors cursor-pointer"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-8">
        <button
          onClick={() => setTab("created")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
            tab === "created"
              ? "bg-primary/10 text-primary border border-primary/20"
              : "text-text-tertiary hover:text-text-secondary"
          )}
        >
          My Pools ({myPools.length})
        </button>
        <button
          onClick={() => setTab("all")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
            tab === "all"
              ? "bg-primary/10 text-primary border border-primary/20"
              : "text-text-tertiary hover:text-text-secondary"
          )}
        >
          All Pools ({allPools.length})
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-error/20 bg-error/[0.05] px-4 py-3 mb-6">
          <p className="text-sm text-error">{error}</p>
          <button onClick={() => refetch()} className="text-xs text-error/70 underline mt-1 cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid sm:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-52 w-full" />
          ))}
        </div>
      )}

      {/* Pool grid */}
      {!loading && (
        <>
          {activePools.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-5 stagger-children">
              {activePools.map((pool) => (
                <PoolCard key={pool.id} pool={pool} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mb-4">
        <svg className="h-6 w-6 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <p className="text-sm text-text-secondary mb-1.5">No pools yet</p>
      <p className="text-xs text-text-tertiary mb-6 font-light">Create your first one to get started.</p>
      <Link href="/create">
        <Button size="sm">Create a Pool</Button>
      </Link>
    </div>
  );
}
