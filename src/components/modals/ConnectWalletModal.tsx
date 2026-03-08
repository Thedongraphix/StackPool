"use client";

import Modal from "./Modal";
import { useWallet } from "@/hooks/useWallet";

interface ConnectWalletModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ConnectWalletModal({ open, onClose }: ConnectWalletModalProps) {
  const { connect } = useWallet();

  function handleConnect() {
    connect();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Connect your wallet">
      <div className="space-y-2">
        <button
          onClick={handleConnect}
          className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-surface-3 hover:border-border-hover hover:bg-surface-3/80 transition-all cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-xl bg-[#7C3AED] flex items-center justify-center text-white font-bold text-sm shrink-0">
            L
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">Leather</p>
            <p className="text-xs text-text-tertiary">Stacks & Bitcoin wallet</p>
          </div>
          <svg className="ml-auto h-4 w-4 text-text-tertiary group-hover:text-text-secondary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>

        <button
          onClick={handleConnect}
          className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-surface-3 hover:border-border-hover hover:bg-surface-3/80 transition-all cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-xl bg-[#EE7A30] flex items-center justify-center text-white font-bold text-sm shrink-0">
            X
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">Xverse</p>
            <p className="text-xs text-text-tertiary">Bitcoin web3 wallet</p>
          </div>
          <svg className="ml-auto h-4 w-4 text-text-tertiary group-hover:text-text-secondary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

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
