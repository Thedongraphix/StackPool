import {
  uintCV,
  stringUtf8CV,
  principalCV,
  boolCV,
  cvToJSON,
  fetchCallReadOnlyFunction,
  Pc,
  type ClarityValue,
} from "@stacks/transactions";

// ---------------------
// Network Configuration
// ---------------------

const IS_MAINNET = process.env.NEXT_PUBLIC_STACKS_NETWORK === "mainnet";

export const NETWORK_STRING: "mainnet" | "testnet" = IS_MAINNET ? "mainnet" : "testnet";

// For read-only calls we still need the network constant
const HIRO_API = IS_MAINNET
  ? "https://api.hiro.so"
  : "https://api.testnet.hiro.so";

// Contract address — update after deployment
export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
export const CONTRACT_NAME =
  process.env.NEXT_PUBLIC_CONTRACT_NAME || "stackpool";
export const CONTRACT_ID = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}` as `${string}.${string}`;

export const EXPLORER_BASE = "https://explorer.hiro.so";
const CHAIN_SUFFIX = IS_MAINNET ? "" : "?chain=testnet";

export function getTxUrl(txId: string): string {
  return `${EXPLORER_BASE}/txid/${txId}${CHAIN_SUFFIX}`;
}

export function getAddressUrl(address: string): string {
  return `${EXPLORER_BASE}/address/${address}${CHAIN_SUFFIX}`;
}

export function getContractUrl(): string {
  return `${EXPLORER_BASE}/address/${CONTRACT_ID}${CHAIN_SUFFIX}`;
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
    network: IS_MAINNET ? "mainnet" : "testnet",
  });
  return cvToJSON(result);
}

export async function getPoolCount(senderAddress: string): Promise<number> {
  const result = await callReadOnly("get-pool-count", [], senderAddress);
  return extractNum(result);
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

// Extract a value from cvToJSON output, handling nested .value wrappers
function extractVal(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "object" && obj !== null && "value" in (obj as Record<string, unknown>)) {
    return (obj as Record<string, unknown>).value;
  }
  return obj;
}

function extractStr(obj: unknown): string {
  const v = extractVal(obj);
  if (typeof v === "string") return v;
  if (typeof v === "object" && v !== null && "value" in (v as Record<string, unknown>)) {
    return String((v as Record<string, unknown>).value);
  }
  return String(v ?? "");
}

function extractNum(obj: unknown): number {
  const v = extractVal(obj);
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseInt(v) || 0;
  if (typeof v === "object" && v !== null && "value" in (v as Record<string, unknown>)) {
    return parseInt(String((v as Record<string, unknown>).value)) || 0;
  }
  return 0;
}

function extractBool(obj: unknown): boolean {
  const v = extractVal(obj);
  if (typeof v === "boolean") return v;
  if (typeof v === "object" && v !== null && "value" in (v as Record<string, unknown>)) {
    return Boolean((v as Record<string, unknown>).value);
  }
  return Boolean(v);
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

  // Debug: log the raw shape once
  if (typeof window !== "undefined") {
    console.log(`[StackPool] Raw pool ${poolId} response:`, JSON.stringify(result, null, 2));
  }

  if (!result || result.type === "none" || result.value === undefined || result.value === null) return null;

  // The value might be directly the tuple or wrapped in another .value
  let v = result.value;
  // If v itself has a .value that is an object with pool fields, unwrap one more level
  if (v && typeof v === "object" && "value" in v && typeof v.value === "object" && v.value !== null && "title" in v.value) {
    v = v.value;
  }

  try {
    return {
      title: extractStr(v.title),
      description: extractStr(v.description),
      "target-amount": extractNum(v["target-amount"]),
      "current-amount": extractNum(v["current-amount"]),
      creator: extractStr(v.creator),
      recipient: extractStr(v.recipient),
      deadline: extractNum(v.deadline),
      "min-contribution": extractNum(v["min-contribution"]),
      "is-complete": extractBool(v["is-complete"]),
      "is-refunded": extractBool(v["is-refunded"]),
      "is-withdrawn": extractBool(v["is-withdrawn"]),
      "is-public": extractBool(v["is-public"]),
      "contributor-count": extractNum(v["contributor-count"]),
    };
  } catch (err) {
    console.error(`[StackPool] Failed to parse pool ${poolId}:`, err, "Raw value:", v);
    return null;
  }
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
  return extractNum(result);
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
  return extractBool(result);
}

// ---------------------
// Contract Call Param Builders
// ---------------------

// These return params for use with request('stx_callContract', ...)

export function buildCreatePoolParams(params: {
  title: string;
  description: string;
  targetAmount: number; // in microSTX
  recipient: string;
  deadline: number; // block height
  minContribution: number; // in microSTX
  isPublic: boolean;
}) {
  return {
    contract: CONTRACT_ID,
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
    postConditionMode: "deny" as const,
    postConditions: [],
    network: NETWORK_STRING,
  };
}

export function buildContributeParams(params: {
  poolId: number;
  amount: number; // in microSTX
  senderAddress: string;
}) {
  return {
    contract: CONTRACT_ID,
    functionName: "contribute",
    functionArgs: [uintCV(params.poolId), uintCV(params.amount)],
    postConditionMode: "deny" as const,
    postConditions: [
      Pc.principal(params.senderAddress).willSendLte(params.amount).ustx(),
    ],
    network: NETWORK_STRING,
  };
}

export function buildWithdrawParams(params: {
  poolId: number;
  amount: number; // total pool amount in microSTX
}) {
  return {
    contract: CONTRACT_ID,
    functionName: "withdraw-funds",
    functionArgs: [uintCV(params.poolId)],
    postConditionMode: "deny" as const,
    postConditions: [
      Pc.principal(CONTRACT_ID).willSendLte(params.amount).ustx(),
    ],
    network: NETWORK_STRING,
  };
}

export function buildRefundContributorParams(params: {
  poolId: number;
  contributorIndex: number;
}) {
  return {
    contract: CONTRACT_ID,
    functionName: "refund-contributor",
    functionArgs: [uintCV(params.poolId), uintCV(params.contributorIndex)],
    postConditionMode: "allow" as const,
    postConditions: [],
    network: NETWORK_STRING,
  };
}

export function buildCancelPoolParams(params: { poolId: number }) {
  return {
    contract: CONTRACT_ID,
    functionName: "cancel-pool",
    functionArgs: [uintCV(params.poolId)],
    postConditionMode: "deny" as const,
    postConditions: [],
    network: NETWORK_STRING,
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
    const res = await fetch(`${HIRO_API}/v2/info`);
    const data = await res.json();
    return data.stacks_tip_height;
  } catch {
    return 0;
  }
}
