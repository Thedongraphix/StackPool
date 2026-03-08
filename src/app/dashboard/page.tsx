"use client";

import { useState } from "react";
import Link from "next/link";
import { mockPools } from "@/lib/mockData";
import { formatBtc, cn } from "@/lib/utils";
import PoolCard from "@/components/pool/PoolCard";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
  const [tab, setTab] = useState<"created" | "contributed">("created");

  // Mock: pools created by user
  const myPools = mockPools.filter((p) => p.creator === "chris.btc" || p.creator === "founder.btc");
  // Mock: pools user contributed to
  const contributed = mockPools.filter((p) => p.id === "2" || p.id === "4");

  const totalPooled = myPools.reduce((sum, p) => sum + p.currentAmount, 0) +
    contributed.reduce((sum, p) => sum + 0.001, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl">
          C
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">chris.btc</h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary">
            <span>{myPools.length} Pools Created</span>
            <span className="text-border">|</span>
            <span>{contributed.length} Contributed To</span>
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

      {/* Pool grid */}
      {tab === "created" && (
        <>
          {myPools.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4 stagger-children">
              {myPools.map((pool) => (
                <PoolCard key={pool.id} pool={pool} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </>
      )}

      {tab === "contributed" && (
        <>
          {contributed.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4 stagger-children">
              {contributed.map((pool) => (
                <div key={pool.id} className="relative">
                  <PoolCard pool={pool} />
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-mono bg-surface-3 border border-border rounded-full px-2 py-0.5 text-text-tertiary">
                      You: 0.001 sBTC
                    </span>
                  </div>
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
