export type PoolStatus = "active" | "funded" | "expired" | "cancelled";

export interface Contributor {
  address: string;
  amount: number;
  time: string;
}

export interface Pool {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  contributorCount: number;
  creator: string;
  recipient: string;
  deadline: string;
  status: PoolStatus;
  coverEmoji: string;
  contributors: Contributor[];
  isPublic?: boolean;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  bnsName: string | null;
}
