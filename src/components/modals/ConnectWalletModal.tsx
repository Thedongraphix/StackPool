"use client";

import Modal from "./Modal";
import { useWallet } from "@/hooks/useWallet";

interface ConnectWalletModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ConnectWalletModal({ open, onClose }: ConnectWalletModalProps) {
  const { connect } = useWallet();

  async function handleConnect() {
    await connect();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Connect your wallet">
      <p className="text-sm text-text-secondary mb-4">
        Connect a Stacks-compatible wallet to create pools, contribute, and manage your funds.
      </p>

      <button
        onClick={handleConnect}
        className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-surface-3 hover:border-border-hover hover:bg-surface-3/80 transition-all cursor-pointer group"
      >
        <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M21 12V7H5a2 2 0 010-4h14v4" />
            <path d="M3 5v14a2 2 0 002 2h16v-5" />
            <path d="M18 12a2 2 0 000 4h4v-4z" />
          </svg>
        </div>
        <div className="text-left flex-1">
          <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
            Connect Wallet
          </p>
          <p className="text-xs text-text-tertiary">Leather, Xverse, or other Stacks wallets</p>
        </div>
        <svg className="h-4 w-4 text-text-tertiary group-hover:text-text-secondary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
      </button>

      <p className="text-xs text-text-tertiary mt-4 text-center">
        New to Stacks?{" "}
        <a
          href="https://leather.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Get the Leather wallet
        </a>
      </p>
    </Modal>
  );
}
