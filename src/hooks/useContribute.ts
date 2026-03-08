"use client";

import { useState, useCallback } from "react";
import { request } from "@stacks/connect";
import {
  buildContributeParams,
  buildWithdrawParams,
  buildCancelPoolParams,
  buildCreatePoolParams,
  buildRefundContributorParams,
  stxToMicro,
  estimateBlockHeight,
  getCurrentBlockHeight,
} from "@/lib/stacks";
import { showToast } from "@/components/ui/Toast";

interface TxState {
  loading: boolean;
  txId: string | null;
  error: string | null;
}

// Hook: contribute to a pool
export function useContributeAction() {
  const [state, setState] = useState<TxState>({
    loading: false,
    txId: null,
    error: null,
  });

  const contribute = useCallback(
    async (poolId: number, amountStx: number, senderAddress: string) => {
      setState({ loading: true, txId: null, error: null });

      try {
        const amount = stxToMicro(amountStx);
        const params = buildContributeParams({ poolId, amount, senderAddress });

        const result = await request("stx_callContract", params);
        const txId = result.txid || "";
        setState({ loading: false, txId, error: null });
        showToast("Contribution submitted! Waiting for confirmation...", "success");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Transaction failed";
        setState({ loading: false, txId: null, error: message });
        if (message !== "User rejected" && !message.includes("cancel")) {
          showToast(message, "error");
        }
      }
    },
    []
  );

  return { ...state, contribute };
}

// Hook: create a new pool
export function useCreatePool() {
  const [state, setState] = useState<TxState>({
    loading: false,
    txId: null,
    error: null,
  });

  const createPool = useCallback(
    async (params: {
      title: string;
      description: string;
      targetAmountStx: number;
      recipient: string;
      deadlineDate: Date;
      minContributionStx: number;
      isPublic: boolean;
    }) => {
      setState({ loading: true, txId: null, error: null });

      try {
        const blockHeight = await getCurrentBlockHeight();
        const deadline = estimateBlockHeight(params.deadlineDate, blockHeight);

        const txParams = buildCreatePoolParams({
          title: params.title,
          description: params.description,
          targetAmount: stxToMicro(params.targetAmountStx),
          recipient: params.recipient,
          deadline,
          minContribution: stxToMicro(params.minContributionStx),
          isPublic: params.isPublic,
        });

        const result = await request("stx_callContract", txParams);
        const txId = result.txid || "";
        setState({ loading: false, txId, error: null });
        showToast("Pool created! Waiting for confirmation...", "success");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create pool";
        setState({ loading: false, txId: null, error: message });
        if (message !== "User rejected" && !message.includes("cancel")) {
          showToast(message, "error");
        }
      }
    },
    []
  );

  return { ...state, createPool };
}

// Hook: withdraw funds from a funded pool
export function useWithdraw() {
  const [state, setState] = useState<TxState>({
    loading: false,
    txId: null,
    error: null,
  });

  const withdraw = useCallback(
    async (poolId: number, amountMicro: number) => {
      setState({ loading: true, txId: null, error: null });

      try {
        const params = buildWithdrawParams({ poolId, amount: amountMicro });

        const result = await request("stx_callContract", params);
        const txId = result.txid || "";
        setState({ loading: false, txId, error: null });
        showToast("Withdrawal submitted!", "success");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Withdrawal failed";
        setState({ loading: false, txId: null, error: message });
        if (message !== "User rejected" && !message.includes("cancel")) {
          showToast(message, "error");
        }
      }
    },
    []
  );

  return { ...state, withdraw };
}

// Hook: cancel a pool
export function useCancelPool() {
  const [state, setState] = useState<TxState>({
    loading: false,
    txId: null,
    error: null,
  });

  const cancel = useCallback(async (poolId: number) => {
    setState({ loading: true, txId: null, error: null });

    try {
      const params = buildCancelPoolParams({ poolId });

      const result = await request("stx_callContract", params);
      const txId = result.txid || "";
      setState({ loading: false, txId, error: null });
      showToast("Pool cancelled", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Cancel failed";
      setState({ loading: false, txId: null, error: message });
      if (message !== "User rejected" && !message.includes("cancel")) {
        showToast(message, "error");
      }
    }
  }, []);

  return { ...state, cancel };
}

// Hook: refund a contributor
export function useRefund() {
  const [state, setState] = useState<TxState>({
    loading: false,
    txId: null,
    error: null,
  });

  const refund = useCallback(
    async (poolId: number, contributorIndex: number) => {
      setState({ loading: true, txId: null, error: null });

      try {
        const params = buildRefundContributorParams({ poolId, contributorIndex });

        const result = await request("stx_callContract", params);
        const txId = result.txid || "";
        setState({ loading: false, txId, error: null });
        showToast("Refund submitted!", "success");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Refund failed";
        setState({ loading: false, txId: null, error: message });
        if (message !== "User rejected" && !message.includes("cancel")) {
          showToast(message, "error");
        }
      }
    },
    []
  );

  return { ...state, refund };
}
