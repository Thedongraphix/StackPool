"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getPool as fetchPool,
  getPoolCount,
  getContribution,
  type ContractPool,
  microToStx,
  estimateDateFromBlock,
  getCurrentBlockHeight,
} from "@/lib/stacks";
import { mockPools, mockStats } from "@/lib/mockData";
import type { Pool, PoolStatus } from "@/types";

// Feature flag: set to true when contract is deployed and ready
const USE_CONTRACT = process.env.NEXT_PUBLIC_USE_CONTRACT === "true";

// Convert contract pool data to frontend Pool type
function contractToPool(
  id: number,
  data: ContractPool,
  currentBlock: number
): Pool {
  const isExpired = currentBlock > data.deadline;
  let status: PoolStatus = "active";
  if (data["is-refunded"]) status = "cancelled";
  else if (data["is-complete"]) status = "funded";
  else if (isExpired) status = "expired";

  const estimatedDeadline = estimateDateFromBlock(data.deadline, currentBlock);

  return {
    id: id.toString(),
    title: data.title,
    description: data.description,
    targetAmount: microToStx(data["target-amount"]),
    currentAmount: microToStx(data["current-amount"]),
    contributorCount: data["contributor-count"],
    creator: data.creator,
    recipient: data.recipient,
    deadline: estimatedDeadline.toISOString().split("T")[0],
    status,
    coverEmoji: "rocket",
    contributors: [],
    isPublic: data["is-public"],
  };
}

// Hook: fetch a single pool by ID
export function usePool(poolId: string) {
  const [pool, setPool] = useState<Pool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!USE_CONTRACT) {
      const mock = mockPools.find((p) => p.id === poolId);
      setPool(mock || null);
      setLoading(false);
      return;
    }

    try {
      const id = parseInt(poolId);
      if (isNaN(id)) throw new Error("Invalid pool ID");

      const senderAddress = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
      const [data, blockHeight] = await Promise.all([
        fetchPool(id, senderAddress),
        getCurrentBlockHeight(),
      ]);

      if (!data) {
        setPool(null);
      } else {
        setPool(contractToPool(id, data, blockHeight));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch pool");
    } finally {
      setLoading(false);
    }
  }, [poolId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { pool, loading, error, refetch };
}

// Hook: fetch all pools
export function usePools() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);

    if (!USE_CONTRACT) {
      setPools(mockPools);
      setLoading(false);
      return;
    }

    try {
      const senderAddress = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
      const [count, blockHeight] = await Promise.all([
        getPoolCount(senderAddress),
        getCurrentBlockHeight(),
      ]);

      const poolPromises = [];
      for (let i = 0; i < count; i++) {
        poolPromises.push(fetchPool(i, senderAddress));
      }
      const results = await Promise.all(poolPromises);

      const poolList: Pool[] = [];
      results.forEach((data, i) => {
        if (data) {
          poolList.push(contractToPool(i, data, blockHeight));
        }
      });

      setPools(poolList);
    } catch {
      // Fallback to mock data on error
      setPools(mockPools);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { pools, loading, refetch };
}

// Hook: fetch user's contribution to a specific pool
export function useContribution(poolId: string, userAddress: string | null) {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!USE_CONTRACT || !userAddress) {
      setAmount(0);
      return;
    }

    setLoading(true);
    const senderAddress = userAddress;
    getContribution(parseInt(poolId), userAddress, senderAddress)
      .then((val) => setAmount(microToStx(val)))
      .catch(() => setAmount(0))
      .finally(() => setLoading(false));
  }, [poolId, userAddress]);

  return { amount, loading };
}

// Hook: fetch stats
export function useStats() {
  const [stats, setStats] = useState(mockStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!USE_CONTRACT) {
      setLoading(false);
      return;
    }

    const senderAddress = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
    getPoolCount(senderAddress)
      .then((count) => {
        setStats((prev) => ({ ...prev, totalPools: count }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
