"use client";

import { useState, useMemo } from "react";
import { cn, getDaysLeft } from "@/lib/utils";
import PoolCard from "@/components/pool/PoolCard";
import Skeleton from "@/components/ui/Skeleton";
import { usePools } from "@/hooks/usePool";

type Filter = "all" | "active" | "funded" | "ending-soon";
type Sort = "newest" | "most-funded" | "ending-soon";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("newest");

  const { pools: allPools, loading } = usePools();
  const pools = allPools.filter((p) => p.isPublic !== false);

  const filtered = useMemo(() => {
    let result = pools;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // Filter
    if (filter === "active") result = result.filter((p) => p.status === "active");
    if (filter === "funded") result = result.filter((p) => p.status === "funded");
    if (filter === "ending-soon")
      result = result.filter((p) => p.status === "active" && getDaysLeft(p.deadline) <= 7);

    // Sort
    if (sort === "most-funded")
      result = [...result].sort((a, b) => b.currentAmount / b.targetAmount - a.currentAmount / a.targetAmount);
    if (sort === "ending-soon")
      result = [...result].sort((a, b) => getDaysLeft(a.deadline) - getDaysLeft(b.deadline));

    return result;
  }, [pools, search, filter, sort]);

  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "funded", label: "Funded" },
    { value: "ending-soon", label: "Ending Soon" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Explore Pools</h1>
        <p className="text-text-secondary mt-1">Discover and contribute to active pools</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search pools by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-lg bg-surface-3 border border-border pl-10 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="h-10 rounded-lg bg-surface-3 border border-border px-3 text-sm text-text-primary focus:outline-none focus:border-primary/60 cursor-pointer [color-scheme:dark]"
        >
          <option value="newest">Newest</option>
          <option value="most-funded">Most Funded</option>
          <option value="ending-soon">Ending Soon</option>
        </select>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "h-8 px-3.5 rounded-full text-sm font-medium transition-all cursor-pointer",
              filter === f.value
                ? "bg-primary text-surface"
                : "bg-surface-3 border border-border text-text-secondary hover:border-border-hover hover:text-text-primary"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {filtered.map((pool) => (
            <PoolCard key={pool.id} pool={pool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-sm text-text-secondary">No pools match your search.</p>
          <button
            onClick={() => {
              setSearch("");
              setFilter("all");
            }}
            className="text-sm text-primary hover:underline mt-2 cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
