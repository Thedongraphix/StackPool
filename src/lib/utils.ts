import { PoolStatus } from "@/types";

export function formatBtc(amount: number): string {
  if (amount >= 0.01) return amount.toFixed(4);
  if (amount >= 0.001) return amount.toFixed(5);
  return amount.toFixed(6);
}

export function truncateAddress(address: string, chars = 4): string {
  if (address.includes(".")) return address;
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function getProgressPercent(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}

export function getDaysLeft(deadline: string): number {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getStatusColor(status: PoolStatus): string {
  switch (status) {
    case "active":
      return "bg-primary-muted text-primary";
    case "funded":
      return "bg-success-muted text-success";
    case "expired":
      return "bg-error-muted text-error";
    case "cancelled":
      return "bg-surface-3 text-text-secondary";
  }
}

export function getStatusLabel(status: PoolStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "funded":
      return "Funded";
    case "expired":
      return "Expired";
    case "cancelled":
      return "Cancelled";
  }
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
