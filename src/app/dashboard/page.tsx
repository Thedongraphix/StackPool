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
  const [tab, setTab] = useState<"created" | "contributed">("created");
  const { isConnected, address, connect } = useWallet();
  const { pools, loading } = usePools();

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mb-4">
          <svg className="h-7 w-7 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold mb-2">Connect your wallet</h1>
        <p className="text-sm text-text-secondary mb-6">Connect your Stacks wallet to view your pools and contributions.</p>
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    );
  }

  // Filter pools by user address
  const myPools = pools.filter((p) => p.creator === address);
  const contributed = pools.filter(
    (p) => p.creator !== address && p.contributors.some((c) => c.address === address)
  );

  // Fallback: if using mock data, show some pools
  const displayMyPools = myPools.length > 0 ? myPools : pools.slice(0, 2);
  const displayContributed = contributed.length > 0 ? contributed : pools.slice(2, 4);

  const totalPooled = displayMyPools.reduce((sum, p) => sum + p.currentAmount, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl">
          {(address || "S").charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight font-mono">{truncateAddress(address || "")}</h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary">
            <span>{displayMyPools.length} Pools Created</span>
            <span className="text-border">|</span>
            <span>{displayContributed.length} Contributed To</span>
            <span className="text-border">|</span>
            <span className="font-mono">{formatBtc(totalPooled)} sBTC pooled</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-border">
        <button
          onClick={() => setTab("created")}
          className={cn(
            "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px cursor-pointer",
            tab === "created"
              ? "border-primary text-text-primary"
              : "border-transparent text-text-tertiary hover:text-text-secondary"
          )}
        >
          My Pools
        </button>
        <button
          onClick={() => setTab("contributed")}
          className={cn(
            "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px cursor-pointer",
            tab === "contributed"
              ? "border-primary text-text-primary"
              : "border-transparent text-text-tertiary hover:text-text-secondary"
          )}
        >
          Contributions
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Pool grid */}
      {!loading && tab === "created" && (
        <>
          {displayMyPools.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4 stagger-children">
              {displayMyPools.map((pool) => (
                <PoolCard key={pool.id} pool={pool} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </>
      )}

      {!loading && tab === "contributed" && (
        <>
          {displayContributed.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4 stagger-children">
              {displayContributed.map((pool) => (
                <div key={pool.id} className="relative">
                  <PoolCard pool={pool} />
                </div>
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
    <div className="text-center py-16">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mb-4">
        <svg className="h-7 w-7 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <p className="text-sm text-text-secondary mb-1">No pools yet</p>
      <p className="text-xs text-text-tertiary mb-6">Create your first one to get started.</p>
      <Link href="/create">
        <Button size="sm">Create a Pool</Button>
      </Link>
    </div>
  );
}
