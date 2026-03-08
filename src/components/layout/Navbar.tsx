"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import { useWallet } from "@/hooks/useWallet";
import { cn, truncateAddress } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isConnected, address, connect, disconnect } = useWallet();

  const links = [
    { href: "/explore", label: "Explore" },
    { href: "/create", label: "Create Pool" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const displayAddress = address ? truncateAddress(address) : "";

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
      <nav className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-surface text-sm">
                S
              </div>
              <span className="text-lg font-semibold tracking-tight text-text-primary">
                Stack<span className="text-primary">Pool</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-text-primary bg-surface-3"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Wallet + mobile toggle */}
            <div className="flex items-center gap-3">
              {isConnected ? (
                <div className="relative hidden sm:block" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 h-9 px-3 rounded-lg bg-surface-2 border border-border text-sm text-text-primary hover:border-border-hover transition-colors cursor-pointer"
                  >
                    <div className="h-5 w-5 rounded-full bg-primary/20 border border-primary/30" />
                    <span className="font-mono text-xs">{displayAddress}</span>
                    <svg className={cn("h-3 w-3 text-text-tertiary transition-transform", dropdownOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-48 rounded-xl border border-border bg-surface-2 shadow-xl shadow-black/20 overflow-hidden animate-fade-in">
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-3 transition-colors"
                      >
                        My Pools
                      </Link>
                      <button
                        onClick={() => {
                          disconnect();
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error-muted transition-colors cursor-pointer"
                      >
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  size="sm"
                  className="hidden sm:inline-flex"
                  onClick={connect}
                >
                  Connect Wallet
                </Button>
              )}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex flex-col gap-1 p-2 rounded-lg hover:bg-surface-2 transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                <span className={cn("block w-5 h-0.5 bg-text-secondary transition-transform", mobileOpen && "rotate-45 translate-y-[3px]")} />
                <span className={cn("block w-5 h-0.5 bg-text-secondary transition-opacity", mobileOpen && "opacity-0")} />
                <span className={cn("block w-5 h-0.5 bg-text-secondary transition-transform", mobileOpen && "-rotate-45 -translate-y-[3px]")} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-30 border-b border-border bg-surface/95 backdrop-blur-xl animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-text-primary bg-surface-3"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              {isConnected ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm">
                    <div className="h-5 w-5 rounded-full bg-primary/20 border border-primary/30" />
                    <span className="font-mono text-xs text-text-primary">{displayAddress}</span>
                  </div>
                  <button
                    onClick={() => {
                      disconnect();
                      setMobileOpen(false);
                    }}
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-error text-left hover:bg-error-muted transition-colors cursor-pointer"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              ) : (
                <Button fullWidth size="sm" onClick={connect}>
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
