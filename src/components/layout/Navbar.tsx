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
    { href: "/create", label: "Create" },
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
      <nav className="sticky top-0 z-40 bg-surface/80 backdrop-blur-2xl border-b border-border/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary font-bold text-surface text-xs">
                S
              </div>
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
                    <div className="absolute right-0 mt-1.5 w-48 rounded-2xl border border-border/60 bg-surface-2 shadow-xl shadow-black/30 overflow-hidden animate-fade-in-scale">
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2.5 text-[13px] text-text-secondary hover:text-text-primary hover:bg-surface-3/50 transition-colors"
                      >
                        My Pools
                      </Link>
                      <div className="h-px bg-border/40 mx-3" />
                      <button
                        onClick={() => { disconnect(); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-3.5 py-2.5 text-[13px] text-error/70 hover:text-error hover:bg-error-muted/40 transition-colors cursor-pointer"
                      >
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
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface-3/40 text-[13px]">
                    <div className="h-4 w-4 rounded-full bg-gradient-to-br from-primary/50 to-primary/20" />
                    <span className="font-mono text-xs text-text-secondary">{displayAddress}</span>
                  </div>
                  <button
                    onClick={() => { disconnect(); setMobileOpen(false); }}
                    className="w-full px-3 py-2.5 rounded-xl text-[13px] text-error/70 text-left hover:bg-error-muted/30 transition-colors cursor-pointer"
                  >
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
