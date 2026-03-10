"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import { useWallet } from "@/hooks/useWallet";
import { cn, truncateAddress } from "@/lib/utils";
import { NETWORK_STRING } from "@/lib/stacks";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isConnected, address, connect, disconnect } = useWallet();

  const links = [
    { href: "/explore", label: "Explore" },
    { href: "/create", label: "Create" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const [copied, setCopied] = useState(false);
  const displayAddress = address ? truncateAddress(address) : "";

  const isTestnet = NETWORK_STRING === "testnet";
  const explorerBase = isTestnet ? "https://explorer.hiro.so/?chain=testnet" : "https://explorer.hiro.so";
  const faucetUrl = "https://explorer.hiro.so/sandbox/faucet?chain=testnet";

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-surface/80 backdrop-blur-2xl border-b border-border/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image src="/apple-touch-icon.png" alt="StackPool" width={28} height={28} className="rounded-lg" />
              <span className="text-[15px] font-semibold tracking-tight text-text-primary">
                Stack<span className="text-primary">Pool</span>
              </span>
            </Link>

            {/* Desktop nav — centered pill */}
            <div className="hidden md:flex items-center bg-surface-3/50 rounded-full p-0.5 border border-border/40">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200",
                    pathname === link.href
                      ? "bg-surface-2 text-text-primary shadow-sm border border-border/60"
                      : "text-text-tertiary hover:text-text-secondary"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2.5">
              {isConnected ? (
                <div className="relative hidden sm:block" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 h-8 pl-2 pr-3 rounded-full bg-surface-3/50 border border-border/40 text-[13px] text-text-primary hover:bg-surface-3 transition-all duration-200 cursor-pointer"
                  >
                    <div className="h-4.5 w-4.5 rounded-full bg-gradient-to-br from-primary/50 to-primary/20" />
                    <span className="font-mono text-xs text-text-secondary">{displayAddress}</span>
                    <svg className={cn("h-3 w-3 text-text-tertiary transition-transform duration-200", dropdownOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-56 rounded-2xl border border-border/60 bg-surface-2 shadow-xl shadow-black/30 overflow-hidden animate-fade-in-scale">
                      {/* Full address + copy */}
                      <div className="px-3.5 pt-3 pb-2">
                        <p className="text-[10px] uppercase tracking-wider text-text-tertiary mb-1.5">
                          {isTestnet ? "Testnet" : "Mainnet"} Address
                        </p>
                        <button
                          onClick={copyAddress}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-surface-3/60 hover:bg-surface-3 transition-colors cursor-pointer group"
                        >
                          <span className="font-mono text-[11px] text-text-secondary truncate flex-1 text-left">
                            {address}
                          </span>
                          {copied ? (
                            <svg className="h-3.5 w-3.5 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                          ) : (
                            <svg className="h-3.5 w-3.5 text-text-tertiary group-hover:text-text-secondary shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                          )}
                        </button>
                        {copied && <p className="text-[10px] text-success mt-1 ml-1">Copied!</p>}
                      </div>

                      <div className="h-px bg-border/40 mx-3" />

                      {/* Navigation links */}
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-text-secondary hover:text-text-primary hover:bg-surface-3/50 transition-colors"
                        >
                          <svg className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                          My Pools
                        </Link>
                        <a
                          href={`${explorerBase}/address/${address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-text-secondary hover:text-text-primary hover:bg-surface-3/50 transition-colors"
                        >
                          <svg className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                          View on Explorer
                        </a>
                        {isTestnet && (
                          <a
                            href={faucetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-text-secondary hover:text-text-primary hover:bg-surface-3/50 transition-colors"
                          >
                            <svg className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            Get Testnet STX
                          </a>
                        )}
                      </div>

                      <div className="h-px bg-border/40 mx-3" />

                      <button
                        onClick={() => { disconnect(); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-error/70 hover:text-error hover:bg-error-muted/40 transition-colors cursor-pointer"
                      >
                        <svg className="h-4 w-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button size="sm" className="hidden sm:inline-flex !h-8 !rounded-full !px-4 !text-[13px]" onClick={connect}>
                  Connect Wallet
                </Button>
              )}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-surface-3/40 transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                <span className={cn("block w-4.5 h-[1.5px] bg-text-secondary transition-all duration-300 origin-center", mobileOpen && "rotate-45 translate-y-[4.5px]")} />
                <span className={cn("block w-4.5 h-[1.5px] bg-text-secondary transition-all duration-300", mobileOpen && "opacity-0 scale-x-0")} />
                <span className={cn("block w-4.5 h-[1.5px] bg-text-secondary transition-all duration-300 origin-center", mobileOpen && "-rotate-45 -translate-y-[4.5px]")} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 z-30 border-b border-border/40 bg-surface/95 backdrop-blur-2xl animate-fade-in">
          <div className="px-4 py-3 space-y-0.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors",
                  pathname === link.href
                    ? "text-text-primary bg-surface-3/60"
                    : "text-text-tertiary hover:text-text-secondary"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border/30 mt-2">
              {isConnected ? (
                <div className="space-y-1">
                  {/* Address with copy */}
                  <button
                    onClick={copyAddress}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface-3/40 text-[13px] cursor-pointer hover:bg-surface-3/60 transition-colors"
                  >
                    <div className="h-4 w-4 rounded-full bg-gradient-to-br from-primary/50 to-primary/20 shrink-0" />
                    <span className="font-mono text-xs text-text-secondary truncate flex-1 text-left">{address}</span>
                    {copied ? (
                      <svg className="h-3.5 w-3.5 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    ) : (
                      <svg className="h-3.5 w-3.5 text-text-tertiary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                    )}
                  </button>
                  {copied && <p className="text-[10px] text-success ml-3">Copied to clipboard!</p>}

                  <a
                    href={`${explorerBase}/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] text-text-secondary hover:bg-surface-3/40 transition-colors"
                  >
                    <svg className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    View on Explorer
                  </a>

                  {isTestnet && (
                    <a
                      href={faucetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] text-text-secondary hover:bg-surface-3/40 transition-colors"
                    >
                      <svg className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      Get Testnet STX
                    </a>
                  )}

                  <button
                    onClick={() => { disconnect(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] text-error/70 text-left hover:bg-error-muted/30 transition-colors cursor-pointer"
                  >
                    <svg className="h-4 w-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    Disconnect Wallet
                  </button>
                </div>
              ) : (
                <Button fullWidth size="sm" className="!rounded-full" onClick={connect}>
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
