import { STACKS_TESTNET, STACKS_MAINNET } from "@stacks/network";
import {
  uintCV,
  stringUtf8CV,
  principalCV,
  boolCV,
  cvToJSON,
  fetchCallReadOnlyFunction,
  PostConditionMode,
  Pc,
  type ClarityValue,
} from "@stacks/transactions";

// ---------------------
// Network Configuration
// ---------------------

const IS_MAINNET = process.env.NEXT_PUBLIC_STACKS_NETWORK === "mainnet";

export const network = IS_MAINNET ? STACKS_MAINNET : STACKS_TESTNET;

// Contract address — update after deployment
export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
export const CONTRACT_NAME =
  process.env.NEXT_PUBLIC_CONTRACT_NAME || "stackpool";

export const EXPLORER_URL = IS_MAINNET
  ? "https://explorer.hiro.so"
  : "https://explorer.hiro.so/?chain=testnet";

export function getTxUrl(txId: string): string {
  return `${EXPLORER_URL}/txid/${txId}`;
}

export function getAddressUrl(address: string): string {
  return `${EXPLORER_URL}/address/${address}`;
}

// ---------------------
// Read-Only Calls
// ---------------------

async function callReadOnly(
  functionName: string,
  functionArgs: ClarityValue[],
  senderAddress: string
) {
  const result = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName,
    functionArgs,
    senderAddress,
    network,
  });
  return cvToJSON(result);
}

export async function getPoolCount(senderAddress: string): Promise<number> {
  const result = await callReadOnly("get-pool-count", [], senderAddress);
  return parseInt(result.value);
}

export interface ContractPool {
  title: string;
  description: string;
  "target-amount": number;
  "current-amount": number;
  creator: string;
  recipient: string;
  deadline: number;
  "min-contribution": number;
  "is-complete": boolean;
  "is-refunded": boolean;
  "is-withdrawn": boolean;
  "is-public": boolean;
  "contributor-count": number;
}

export async function getPool(
  poolId: number,
  senderAddress: string
): Promise<ContractPool | null> {
  const result = await callReadOnly(
    "get-pool",
    [uintCV(poolId)],
    senderAddress
  );

  if (result.type === "none" || !result.value) return null;

  const v = result.value;
  return {
    title: v.title.value,
    description: v.description.value,
    "target-amount": parseInt(v["target-amount"].value),
    "current-amount": parseInt(v["current-amount"].value),
    creator: v.creator.value,
    recipient: v.recipient.value,
    deadline: parseInt(v.deadline.value),
    "min-contribution": parseInt(v["min-contribution"].value),
    "is-complete": v["is-complete"].value,
    "is-refunded": v["is-refunded"].value,
    "is-withdrawn": v["is-withdrawn"].value,
    "is-public": v["is-public"].value,
    "contributor-count": parseInt(v["contributor-count"].value),
  };
}

export async function getContribution(
  poolId: number,
  contributor: string,
  senderAddress: string
): Promise<number> {
  const result = await callReadOnly(
    "get-contribution",
    [uintCV(poolId), principalCV(contributor)],
    senderAddress
  );
  return parseInt(result.value);
}

export async function isPoolFunded(
  poolId: number,
  senderAddress: string
): Promise<boolean> {
  const result = await callReadOnly(
    "is-pool-funded",
    [uintCV(poolId)],
    senderAddress
  );
  return result.value;
}

// ---------------------
// Contract Call Builders
// ---------------------

// These return transaction options for use with openContractCall from @stacks/connect

export function buildCreatePoolTx(params: {
  title: string;
  description: string;
  targetAmount: number; // in microSTX
  recipient: string;
  deadline: number; // block height
  minContribution: number; // in microSTX
  isPublic: boolean;
  senderAddress: string;
}) {
  return {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "create-pool",
    functionArgs: [
      stringUtf8CV(params.title),
      stringUtf8CV(params.description),
      uintCV(params.targetAmount),
      principalCV(params.recipient),
      uintCV(params.deadline),
      uintCV(params.minContribution),
      boolCV(params.isPublic),
    ],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [],
    network,
  };
}

export function buildContributeTx(params: {
  poolId: number;
  amount: number; // in microSTX
  senderAddress: string;
}) {
  return {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "contribute",
    functionArgs: [uintCV(params.poolId), uintCV(params.amount)],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [
      Pc.principal(params.senderAddress).willSendLte(params.amount).ustx(),
    ],
    network,
  };
}

export function buildWithdrawTx(params: {
  poolId: number;
  amount: number; // total pool amount in microSTX
  recipient: string;
}) {
  return {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "withdraw-funds",
    functionArgs: [uintCV(params.poolId)],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [
      Pc.principal(`${CONTRACT_ADDRESS}.${CONTRACT_NAME}`)
        .willSendLte(params.amount)
        .ustx(),
    ],
    network,
  };
}

export function buildRefundContributorTx(params: {
  poolId: number;
  contributorIndex: number;
}) {
  return {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "refund-contributor",
    functionArgs: [uintCV(params.poolId), uintCV(params.contributorIndex)],
    postConditionMode: PostConditionMode.Allow,
    postConditions: [],
    network,
  };
}

export function buildCancelPoolTx(params: { poolId: number }) {
  return {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "cancel-pool",
    functionArgs: [uintCV(params.poolId)],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [],
    network,
  };
}

// ---------------------
// Helpers
// ---------------------

// Convert STX to microSTX (1 STX = 1,000,000 microSTX)
export function stxToMicro(stx: number): number {
  return Math.round(stx * 1_000_000);
}

// Convert microSTX to STX
export function microToStx(micro: number): number {
  return micro / 1_000_000;
}

// Estimate block height from a target date
// Stacks produces ~1 block per 10 minutes on average
export function estimateBlockHeight(
  targetDate: Date,
  currentBlockHeight: number
): number {
  const now = Date.now();
  const target = targetDate.getTime();
  const diffMs = target - now;
  const diffBlocks = Math.ceil(diffMs / (10 * 60 * 1000)); // ~10 min per block
  return currentBlockHeight + Math.max(diffBlocks, 1);
}

// Estimate date from block height
export function estimateDateFromBlock(
  targetBlock: number,
  currentBlockHeight: number
): Date {
  const diffBlocks = targetBlock - currentBlockHeight;
  const diffMs = diffBlocks * 10 * 60 * 1000;
  return new Date(Date.now() + diffMs);
}

// Fetch current block height from the network
export async function getCurrentBlockHeight(): Promise<number> {
  try {
    const url = IS_MAINNET
      ? "https://api.hiro.so/v2/info"
      : "https://api.testnet.hiro.so/v2/info";
    const res = await fetch(url);
    const data = await res.json();
    return data.stacks_tip_height;
  } catch {
    return 0;
  }
}
