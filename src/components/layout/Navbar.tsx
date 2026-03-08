"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const links = [
    { href: "/explore", label: "Explore" },
    { href: "/create", label: "Create Pool" },
    { href: "/dashboard", label: "Dashboard" },
  ];

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
              {walletConnected ? (
                <button
                  onClick={() => setWalletConnected(false)}
                  className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg bg-surface-2 border border-border text-sm text-text-primary hover:border-border-hover transition-colors cursor-pointer"
                >
                  <div className="h-5 w-5 rounded-full bg-primary/20 border border-primary/30" />
                  <span className="font-mono text-xs">chris.btc</span>
                </button>
              ) : (
                <Button
                  size="sm"
                  className="hidden sm:inline-flex"
                  onClick={() => setWalletConnected(true)}
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
              {walletConnected ? (
                <button
                  onClick={() => setWalletConnected(false)}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm cursor-pointer"
                >
                  <div className="h-5 w-5 rounded-full bg-primary/20 border border-primary/30" />
                  <span className="font-mono text-xs text-text-primary">chris.btc</span>
                </button>
              ) : (
                <Button fullWidth size="sm" onClick={() => setWalletConnected(true)}>
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
