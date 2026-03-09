"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useStats } from "@/hooks/usePool";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1800;
    const steps = 50;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  const display = target >= 1 ? Math.round(count).toLocaleString() : count.toFixed(3);
  return (
    <span className="font-mono font-semibold">
      {display}
      {suffix}
    </span>
  );
}

/* ─── Inline SVG illustrations for each step ─── */

function IllustrationCreate() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-auto">
      <rect x="40" y="30" width="120" height="80" rx="16" fill="var(--color-surface-3)" stroke="var(--color-border)" strokeWidth="1"/>
      <circle cx="100" cy="70" r="28" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.3"/>
      <circle cx="100" cy="70" r="16" fill="var(--color-primary)" opacity="0.08"/>
      <line x1="100" y1="62" x2="100" y2="78" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="92" y1="70" x2="108" y2="70" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round"/>
      <rect x="64" y="95" width="72" height="5" rx="2.5" fill="var(--color-border)" opacity="0.5"/>
    </svg>
  );
}

function IllustrationShare() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-auto">
      <circle cx="100" cy="70" r="12" fill="var(--color-primary)" opacity="0.12" stroke="var(--color-primary)" strokeWidth="1"/>
      <circle cx="100" cy="70" r="4" fill="var(--color-primary)" opacity="0.7"/>
      {[
        { cx: 48, cy: 38 }, { cx: 152, cy: 38 },
        { cx: 40, cy: 90 }, { cx: 160, cy: 90 },
        { cx: 70, cy: 118 }, { cx: 130, cy: 118 },
      ].map((p, i) => (
        <g key={i}>
          <line x1="100" y1="70" x2={p.cx} y2={p.cy} stroke="var(--color-border)" strokeWidth="1" opacity="0.5"/>
          <circle cx={p.cx} cy={p.cy} r="7" fill="var(--color-surface-3)" stroke="var(--color-border)" strokeWidth="1"/>
          <circle cx={p.cx} cy={p.cy} r="2.5" fill="var(--color-text-tertiary)" opacity="0.4"/>
        </g>
      ))}
    </svg>
  );
}

function IllustrationRelease() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-auto">
      <path d="M100 22 L140 42 L140 80 Q140 110 100 124 Q60 110 60 80 L60 42 Z"
        fill="var(--color-surface-3)" stroke="var(--color-border)" strokeWidth="1"/>
      <path d="M100 34 L130 49 L130 78 Q130 102 100 113 Q70 102 70 78 L70 49 Z"
        fill="var(--color-success)" opacity="0.05"/>
      <path d="M86 72 L96 82 L116 58" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
    </svg>
  );
}

/* ─── Flow connector (simple line, no animation) ─── */
function FlowArrow() {
  return (
    <div className="hidden sm:flex items-center justify-center self-center -mx-3">
      <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
        <line x1="0" y1="12" x2="38" y2="12" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 3"/>
        <path d="M36 6 L44 12 L36 18" stroke="var(--color-border)" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

/* ─── FAQ Item ─── */
function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border/30 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
      >
        <span className="text-[15px] font-medium text-text-primary pr-4">{q}</span>
        <span className="text-text-tertiary shrink-0 text-lg leading-none transition-transform duration-200" style={{ transform: open ? "rotate(45deg)" : "rotate(0)" }}>
          +
        </span>
      </button>
      {open && (
        <p className="text-sm text-text-secondary leading-relaxed pb-5 -mt-1 max-w-2xl">
          {a}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const { stats } = useStats();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is sBTC?",
      a: "sBTC is a 1:1 Bitcoin-backed asset on the Stacks blockchain. It lets you use real Bitcoin value in smart contracts while maintaining the security guarantees of the Bitcoin network.",
    },
    {
      q: "What happens if the pool doesn't reach its target?",
      a: "Every contributor is automatically refunded by the smart contract after the deadline passes. No admin intervention needed — the contract handles everything trustlessly.",
    },
    {
      q: "Is there a fee for creating or contributing to a pool?",
      a: "StackPool charges zero platform fees. You only pay the standard Stacks network gas fee (typically around 0.001 STX per transaction).",
    },
    {
      q: "Can the pool creator run away with the funds?",
      a: "No. The smart contract is non-custodial. Funds can only be released to the pre-set recipient address when the target is met. The creator cannot modify the recipient or withdraw early.",
    },
    {
      q: "Which wallets are supported?",
      a: "StackPool works with any Stacks-compatible wallet including Leather (formerly Hiro Wallet) and Xverse. Connect with a single click.",
    },
  ];

  return (
    <div>
      {/* ══════════ HERO ══════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-surface-3/40 mb-8">
              <span className="text-xs font-medium text-text-secondary tracking-wide">Built on Stacks. Secured by Bitcoin.</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              Pool money.
              <br />
              <span className="text-primary">Trust the code.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-text-secondary leading-relaxed max-w-xl font-light">
              Bitcoin-powered group payments on Stacks. Split bills, run chamas,
              fund harambees — trustlessly.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/create">
                <Button size="lg">Create a Pool</Button>
              </Link>
              <Link href="/explore">
                <Button variant="secondary" size="lg">Explore Pools</Button>
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg">
            {[
              { value: stats.totalPools, suffix: "", label: "Pools Created" },
              { value: stats.totalSbtcPooled, suffix: " sBTC", label: "Total Pooled" },
              { value: stats.successfulPools, suffix: "", label: "Successful" },
            ].map((stat, i) => (
              <div key={stat.label} className="animate-fade-in" style={{ animationDelay: `${400 + i * 100}ms` }}>
                <div className="text-2xl sm:text-3xl text-text-primary">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-text-tertiary mt-1.5 font-light">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-32">
          <div className="text-center mb-16">
            <p className="text-xs font-medium tracking-[0.15em] uppercase text-text-tertiary mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Three steps. Zero middlemen.
            </h2>
            <p className="text-text-secondary mt-3 font-light max-w-md mx-auto text-[15px]">
              The smart contract is the only intermediary. Transparent, auditable, unstoppable.
            </p>
          </div>

          <div className="grid sm:grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-y-8">
            {/* Step 1 */}
            <div>
              <div className="rounded-2xl border border-border/60 bg-surface-2 p-6 transition-colors duration-200 hover:border-border-hover">
                <div className="mb-5 rounded-xl bg-surface-3/40 border border-border/40 p-3 overflow-hidden">
                  <IllustrationCreate />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-6 w-6 rounded-md bg-surface-3 border border-border/60 flex items-center justify-center font-mono text-[11px] font-semibold text-text-tertiary">1</span>
                  <h3 className="font-semibold text-text-primary text-[15px]">Create a Pool</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed font-light">
                  Define your target amount, set a deadline, and choose a recipient wallet. Deploy in one transaction.
                </p>
              </div>
            </div>

            <FlowArrow />

            {/* Step 2 */}
            <div className="sm:mt-12">
              <div className="rounded-2xl border border-border/60 bg-surface-2 p-6 transition-colors duration-200 hover:border-border-hover">
                <div className="mb-5 rounded-xl bg-surface-3/40 border border-border/40 p-3 overflow-hidden">
                  <IllustrationShare />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-6 w-6 rounded-md bg-surface-3 border border-border/60 flex items-center justify-center font-mono text-[11px] font-semibold text-text-tertiary">2</span>
                  <h3 className="font-semibold text-text-primary text-[15px]">Share & Collect</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed font-light">
                  Share a link or QR code. Contributors connect their wallet and add sBTC. Every transaction is on-chain.
                </p>
              </div>
            </div>

            <FlowArrow />

            {/* Step 3 */}
            <div>
              <div className="rounded-2xl border border-border/60 bg-surface-2 p-6 transition-colors duration-200 hover:border-border-hover">
                <div className="mb-5 rounded-xl bg-surface-3/40 border border-border/40 p-3 overflow-hidden">
                  <IllustrationRelease />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-6 w-6 rounded-md bg-surface-3 border border-border/60 flex items-center justify-center font-mono text-[11px] font-semibold text-text-tertiary">3</span>
                  <h3 className="font-semibold text-text-primary text-[15px]">Auto-Release</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed font-light">
                  Target reached? Funds release to the recipient. Deadline passed? Everyone is refunded automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-32">
          <div className="text-center mb-16">
            <p className="text-xs font-medium tracking-[0.15em] uppercase text-text-tertiary mb-3">Why StackPool</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Built for real life
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Trustless */}
            <div className="lg:row-span-2 rounded-2xl border border-border/60 bg-surface-2 p-7 flex flex-col justify-between relative overflow-hidden transition-colors duration-200 hover:border-border-hover">
              <div>
                <div className="h-10 w-10 rounded-xl bg-surface-3 border border-border/60 flex items-center justify-center mb-5">
                  <svg className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">100% Trustless</h3>
                <p className="text-sm text-text-secondary leading-relaxed font-light max-w-xs">
                  No custodian, no multisig signers. The Clarity smart contract is the sole arbiter — open-source and auditable by anyone.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 text-xs text-text-tertiary">
                <span>Verified on-chain</span>
                <span className="text-border/60">|</span>
                <span>Bitcoin finality</span>
              </div>
            </div>

            {/* Chamas */}
            <div className="rounded-2xl border border-border/60 bg-surface-2 p-6 flex flex-col justify-between transition-colors duration-200 hover:border-border-hover">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-surface-3 border border-border/60 flex items-center justify-center">
                    <svg className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-text-primary">Chamas</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed font-light">
                  Monthly investment groups with full contribution transparency. Every member sees exactly where the money goes.
                </p>
              </div>
              <div className="mt-4 flex -space-x-1.5">
                {[0,1,2,3,4].map(i => (
                  <div key={i} className="h-6 w-6 rounded-full border-2 border-surface-2 bg-surface-3 flex items-center justify-center text-[8px] font-medium text-text-tertiary">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                <div className="h-6 w-6 rounded-full border-2 border-surface-2 bg-surface-3 flex items-center justify-center text-[8px] font-medium text-text-tertiary">+3</div>
              </div>
            </div>

            {/* Auto-refund */}
            <div className="rounded-2xl border border-border/60 bg-surface-2 p-6 transition-colors duration-200 hover:border-border-hover">
              <div className="h-10 w-10 rounded-xl bg-surface-3 border border-border/60 flex items-center justify-center mb-4">
                <svg className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Auto-Refund</h3>
              <p className="text-sm text-text-secondary leading-relaxed font-light">
                Deadline passes without hitting the target? Every contributor is automatically refunded. No admin needed.
              </p>
            </div>

            {/* Bill Splitting — wide */}
            <div className="sm:col-span-2 rounded-2xl border border-border/60 bg-surface-2 p-6 transition-colors duration-200 hover:border-border-hover">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-surface-3 border border-border/60 flex items-center justify-center">
                      <svg className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-text-primary text-lg">Split anything with anyone</h3>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed font-light max-w-md">
                    Dinner tabs, rent, subscriptions, group travel. Set a pool, share the link, and everyone pays their share.
                  </p>
                </div>
                <div className="shrink-0 w-52 rounded-xl border border-border/40 bg-surface-3/30 p-4 space-y-2.5">
                  {[
                    { name: "Alex", pct: 75 },
                    { name: "Brenda", pct: 100 },
                    { name: "Chris", pct: 40 },
                  ].map((p) => (
                    <div key={p.name} className="flex items-center gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-surface-3 border border-border/60 text-[8px] flex items-center justify-center font-medium text-text-tertiary">{p.name[0]}</div>
                      <div className="flex-1">
                        <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden">
                          <div className="h-full rounded-full bg-primary/50" style={{ width: `${p.pct}%` }} />
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-text-tertiary w-7 text-right">{p.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Harambees */}
            <div className="rounded-2xl border border-border/60 bg-surface-2 p-6 transition-colors duration-200 hover:border-border-hover">
              <div className="h-10 w-10 rounded-xl bg-surface-3 border border-border/60 flex items-center justify-center mb-4">
                <svg className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Harambees</h3>
              <p className="text-sm text-text-secondary leading-relaxed font-light">
                Community fundraising with on-chain accountability. Perfect for medical funds, school fees, or emergency drives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ TRUST STRIP ══════════ */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <div className="grid sm:grid-cols-4 gap-6 sm:gap-0 sm:divide-x sm:divide-border/30">
            {[
              { icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", label: "Instant settlement" },
              { icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z", label: "Non-custodial" },
              { icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5", label: "Open-source" },
              { icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z", label: "Bitcoin-secured" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center sm:px-6">
                <svg className="h-5 w-5 text-text-tertiary mb-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span className="text-sm font-medium text-text-secondary">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-32">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20">
            <div>
              <p className="text-xs font-medium tracking-[0.15em] uppercase text-text-tertiary mb-3">FAQ</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Common questions
              </h2>
              <p className="text-text-secondary mt-3 font-light text-[15px] max-w-sm">
                Everything you need to know about StackPool and how it works.
              </p>
            </div>
            <div>
              {faqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  q={faq.q}
                  a={faq.a}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-32">
          <div className="relative rounded-2xl border border-border/60 bg-surface-2 overflow-hidden">
            <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-lg mx-auto leading-tight">
                Ready to pool with Bitcoin?
              </h2>
              <p className="text-text-secondary mt-4 max-w-md mx-auto font-light text-[15px] leading-relaxed">
                No fees. No middlemen. Just a smart contract and your group.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/create">
                  <Button size="lg">Create Your First Pool</Button>
                </Link>
                <Link href="/explore">
                  <Button variant="secondary" size="lg">Browse Pools</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
