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

/* ─── Hero Illustration: Pooling Diagram ─── */

function HeroIllustration() {
  const wallets = [
    { x: 65, y: 42, label: "0.05" },
    { x: 335, y: 42, label: "0.12" },
    { x: 50, y: 210, label: "0.08" },
    { x: 350, y: 210, label: "0.03" },
  ];
  const poolCenter = { x: 200, y: 148 };

  return (
    <div className="relative w-full max-w-[460px] mx-auto">
      <svg viewBox="0 0 400 320" fill="none" className="w-full h-auto">
        <defs>
          <pattern id="heroGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--color-border)" strokeWidth="0.3" opacity="0.4"/>
          </pattern>
        </defs>

        <rect x="30" y="10" width="340" height="300" fill="url(#heroGrid)" rx="16" opacity="0.5"/>

        {wallets.map((w, i) => {
          const mx = (w.x + poolCenter.x) / 2;
          const my = (w.y + poolCenter.y) / 2 + (i < 2 ? 20 : -20);
          return (
            <path
              key={`flow-${i}`}
              d={`M${w.x},${w.y} Q${mx},${my} ${poolCenter.x},${poolCenter.y}`}
              stroke="var(--color-primary)"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.25"
              fill="none"
            />
          );
        })}

        <ellipse cx="200" cy="178" rx="62" ry="18" fill="var(--color-surface-3)" stroke="var(--color-border)" strokeWidth="1"/>
        <path d="M138,148 L138,178" stroke="var(--color-border)" strokeWidth="1"/>
        <path d="M262,148 L262,178" stroke="var(--color-border)" strokeWidth="1"/>
        <ellipse cx="200" cy="168" rx="61" ry="17" fill="var(--color-primary)" opacity="0.08"/>
        <path d="M139,148 L139,168" stroke="var(--color-primary)" strokeWidth="0.5" opacity="0.3"/>
        <path d="M261,148 L261,168" stroke="var(--color-primary)" strokeWidth="0.5" opacity="0.3"/>
        <ellipse cx="200" cy="158" rx="60" ry="16" fill="var(--color-primary)" opacity="0.12" stroke="var(--color-primary)" strokeWidth="0.5" strokeDasharray="3 3"/>
        <ellipse cx="200" cy="148" rx="62" ry="18" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1"/>
        <ellipse cx="200" cy="148" rx="44" ry="12" fill="none" stroke="var(--color-border)" strokeWidth="0.5" opacity="0.5"/>

        <text x="200" y="153" textAnchor="middle" fontSize="16" fontFamily="var(--font-mono)" fontWeight="600" fill="var(--color-primary)" opacity="0.5">
          &#x20BF;
        </text>

        <rect x="168" y="196" width="64" height="20" rx="6" fill="var(--color-surface-3)" stroke="var(--color-border)" strokeWidth="0.5"/>
        <text x="200" y="209" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fontWeight="500" fill="var(--color-text-secondary)">
          0.28 / 0.50
        </text>
        <text x="200" y="230" textAnchor="middle" fontSize="8" fontFamily="var(--font-sans)" fill="var(--color-text-tertiary)">
          sBTC pooled
        </text>

        {wallets.map((w, i) => (
          <g key={`wallet-${i}`}>
            <rect x={w.x - 32} y={w.y - 18} width="64" height="36" rx="10" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1"/>
            <rect x={w.x - 16} y={w.y - 8} width="12" height="9" rx="2" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1" opacity="0.6"/>
            <rect x={w.x - 12} y={w.y - 5} width="4" height="3" rx="1" fill="var(--color-text-tertiary)" opacity="0.4"/>
            <text x={w.x + 8} y={w.y + 1} fontSize="9" fontFamily="var(--font-mono)" fontWeight="500" fill="var(--color-primary)" opacity="0.8">
              {w.label}
            </text>
            <circle
              cx={w.x}
              cy={i < 2 ? w.y + 18 : w.y - 18}
              r="2"
              fill="var(--color-primary)"
              opacity="0.4"
            />
          </g>
        ))}

        {[0, 1, 2].map((i) => (
          <g key={`block-${i}`}>
            <rect
              x={152 + i * 2}
              y={252 + i * 14}
              width={96 - i * 4}
              height="10"
              rx="3"
              fill="var(--color-surface-3)"
              stroke="var(--color-border)"
              strokeWidth="0.5"
              opacity={1 - i * 0.2}
            />
            <rect x={162 + i * 2} y={255 + i * 14} width={20} height="3" rx="1.5" fill="var(--color-border)" opacity={0.5 - i * 0.1}/>
            <rect x={188 + i * 2} y={255 + i * 14} width={12} height="3" rx="1.5" fill="var(--color-border)" opacity={0.3 - i * 0.05}/>
          </g>
        ))}

        <line x1="200" y1="234" x2="200" y2="250" stroke="var(--color-border)" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.4"/>
        <text x="200" y="247" textAnchor="middle" fontSize="7" fontFamily="var(--font-sans)" fill="var(--color-text-tertiary)" opacity="0.6">
          on-chain
        </text>

        <g>
          <line x1="276" y1="140" x2="276" y2="186" stroke="var(--color-text-tertiary)" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4"/>
          <line x1="272" y1="140" x2="280" y2="140" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.4"/>
          <line x1="272" y1="186" x2="280" y2="186" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.4"/>
          <text x="284" y="166" fontSize="7" fontFamily="var(--font-mono)" fill="var(--color-text-tertiary)" opacity="0.5">
            target
          </text>
        </g>
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
            {/* Left — copy */}
            <div className="flex-1 min-w-0 animate-fade-in-up">
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

              <div className="mt-14 grid grid-cols-3 gap-8 max-w-lg">
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

            {/* Right — illustration (hidden on mobile) */}
            <div className="hidden lg:block w-[440px] shrink-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS — Horizontal Track ══════════ */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-32">
          <div className="mb-16">
            <p className="text-xs font-medium tracking-[0.15em] uppercase text-primary/70 mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Three steps. Zero middlemen.
            </h2>
          </div>

          {/* Desktop: horizontal track with connected nodes */}
          <div className="hidden sm:block relative">
            {/* The track line */}
            <div className="absolute top-[28px] left-[28px] right-[28px] h-px bg-primary/20" />

            <div className="grid grid-cols-3 gap-0">
              {[
                {
                  num: "01",
                  title: "Create",
                  desc: "Set a target amount, deadline, and recipient. One transaction deploys your pool to the blockchain.",
                  detail: "create-pool(title, target, recipient, deadline)",
                },
                {
                  num: "02",
                  title: "Collect",
                  desc: "Share a link. Contributors connect their wallet and send sBTC. Every contribution is recorded on-chain.",
                  detail: "contribute(pool-id, amount)",
                },
                {
                  num: "03",
                  title: "Release",
                  desc: "Target met? Funds go to the recipient. Deadline passed? Every contributor is automatically refunded.",
                  detail: "withdraw-funds(pool-id) | refund(pool-id)",
                },
              ].map((step, i) => (
                <div key={step.num} className={`relative ${i === 1 ? "px-8" : i === 0 ? "pr-8" : "pl-8"}`}>
                  {/* Node on the track */}
                  <div className="relative z-10 h-14 w-14 rounded-full border border-primary/30 bg-surface flex items-center justify-center mb-8">
                    <span className="font-mono text-lg font-bold text-primary">{step.num}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-text-primary mb-3">{step.title}</h3>
                  <p className="text-[15px] text-text-secondary leading-relaxed font-light mb-5">
                    {step.desc}
                  </p>

                  {/* Code-like function signature */}
                  <div className="inline-block px-3 py-1.5 rounded-lg bg-surface-3/50 border border-border/30">
                    <code className="text-[11px] font-mono text-text-tertiary">{step.detail}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical steps */}
          <div className="sm:hidden space-y-10">
            {[
              {
                num: "01",
                title: "Create",
                desc: "Set a target amount, deadline, and recipient. One transaction deploys your pool to the blockchain.",
              },
              {
                num: "02",
                title: "Collect",
                desc: "Share a link. Contributors connect their wallet and send sBTC. Every contribution is recorded on-chain.",
              },
              {
                num: "03",
                title: "Release",
                desc: "Target met? Funds go to the recipient. Deadline passed? Every contributor is automatically refunded.",
              },
            ].map((step) => (
              <div key={step.num} className="flex gap-5">
                <div className="shrink-0 h-12 w-12 rounded-full border border-primary/30 bg-surface flex items-center justify-center">
                  <span className="font-mono text-base font-bold text-primary">{step.num}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed font-light">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ USE CASES — Editorial Rows ══════════ */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-32">
          <div className="mb-20">
            <p className="text-xs font-medium tracking-[0.15em] uppercase text-primary/70 mb-3">Use cases</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Built for real life
            </h2>
          </div>

          {/* Row 1 — Bill splitting */}
          <div className="flex flex-col sm:flex-row items-start gap-8 sm:gap-16 pb-16 border-b border-border/30">
            <div className="shrink-0 sm:w-16">
              <span className="font-mono text-5xl font-bold text-primary/30">01</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">Split anything with anyone</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed font-light max-w-lg">
                Dinner tabs, rent, subscriptions, group travel. Set a pool, share the link, and everyone pays their share. No chasing payments. No spreadsheets.
              </p>
            </div>
            {/* Inline visual: progress breakdown */}
            <div className="shrink-0 sm:w-56">
              <div className="space-y-3">
                {[
                  { name: "Alex", amount: "0.003", pct: 75 },
                  { name: "Brenda", amount: "0.004", pct: 100 },
                  { name: "Chris", amount: "0.002", pct: 40 },
                ].map((p) => (
                  <div key={p.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-text-secondary">{p.name}</span>
                      <span className="text-[11px] font-mono text-text-tertiary">{p.amount} sBTC</span>
                    </div>
                    <div className="h-1 rounded-full bg-surface-3 overflow-hidden">
                      <div className="h-full rounded-full bg-primary/40" style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2 — Chamas */}
          <div className="flex flex-col sm:flex-row items-start gap-8 sm:gap-16 py-16 border-b border-border/30">
            <div className="shrink-0 sm:w-16">
              <span className="font-mono text-5xl font-bold text-primary/30">02</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">Chamas & savings groups</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed font-light max-w-lg">
                Monthly investment circles with full contribution transparency. Every member sees exactly where the money goes. Rotating payouts, fixed targets — the contract enforces the rules.
              </p>
            </div>
            <div className="shrink-0 sm:w-56">
              <div className="flex -space-x-2 mb-3">
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-surface bg-surface-3 flex items-center justify-center text-[9px] font-medium text-text-tertiary">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                <div className="h-8 w-8 rounded-full border-2 border-surface bg-surface-3 flex items-center justify-center text-[9px] font-medium text-text-tertiary">
                  +4
                </div>
              </div>
              <p className="text-xs text-text-tertiary font-light">12 members contributing monthly</p>
            </div>
          </div>

          {/* Row 3 — Harambees */}
          <div className="flex flex-col sm:flex-row items-start gap-8 sm:gap-16 py-16 border-b border-border/30">
            <div className="shrink-0 sm:w-16">
              <span className="font-mono text-5xl font-bold text-primary/30">03</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">Community harambees</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed font-light max-w-lg">
                Fundraising with on-chain accountability. Medical emergencies, school fees, disaster relief. Donors see every contribution and know their money reaches the right person.
              </p>
            </div>
            <div className="shrink-0 sm:w-56">
              <div className="text-right">
                <span className="font-mono text-2xl font-bold text-text-primary">0.45</span>
                <span className="text-sm text-text-tertiary ml-1">/ 0.50 sBTC</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden mt-2">
                <div className="h-full rounded-full bg-success/50" style={{ width: "90%" }} />
              </div>
              <p className="text-xs text-text-tertiary font-light mt-2 text-right">90% funded — 23 contributors</p>
            </div>
          </div>

          {/* Row 4 — Group travel */}
          <div className="flex flex-col sm:flex-row items-start gap-8 sm:gap-16 pt-16">
            <div className="shrink-0 sm:w-16">
              <span className="font-mono text-5xl font-bold text-primary/30">04</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">Group travel & events</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed font-light max-w-lg">
                Collect for accommodation, transport, and activities in a single pool. Everyone tracks progress in real time. No one has to front the cash.
              </p>
            </div>
            <div className="shrink-0 sm:w-56">
              <div className="flex flex-col gap-1.5">
                {["Flights", "Hotel", "Activities"].map((item, i) => (
                  <div key={item} className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">{item}</span>
                    <span className="text-[11px] font-mono text-text-tertiary">
                      {["0.12", "0.08", "0.03"][i]} sBTC
                    </span>
                  </div>
                ))}
                <div className="mt-1 pt-2 border-t border-border/30 flex items-center justify-between">
                  <span className="text-xs font-medium text-text-primary">Total</span>
                  <span className="text-xs font-mono font-medium text-primary">0.23 sBTC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ ARCHITECTURE STRIP ══════════ */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-10">
            {/* Left: Architecture flow with icons */}
            <div className="flex items-center gap-4 sm:gap-6">
              {[
                {
                  label: "Your Wallet",
                  sub: "Leather / Xverse",
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="6" width="20" height="14" rx="3"/>
                      <path d="M16 14h.01"/>
                      <path d="M2 10h20"/>
                    </svg>
                  ),
                },
                {
                  label: "Smart Contract",
                  sub: "Clarity on Stacks",
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="4" width="16" height="16" rx="2"/>
                      <path d="M9 9l6 6"/>
                      <path d="M15 9l-6 6"/>
                      <path d="M4 12h2"/>
                      <path d="M18 12h2"/>
                      <path d="M12 4v2"/>
                      <path d="M12 18v2"/>
                    </svg>
                  ),
                },
                {
                  label: "Bitcoin",
                  sub: "Final settlement",
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M9.5 8h4a2 2 0 010 4H9.5V8z"/>
                      <path d="M9.5 12h4.5a2 2 0 010 4H9.5v-4z"/>
                      <path d="M11 6v2"/>
                      <path d="M13 6v2"/>
                      <path d="M11 16v2"/>
                      <path d="M13 16v2"/>
                    </svg>
                  ),
                },
              ].map((layer, i) => (
                <div key={layer.label} className="flex items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      {layer.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{layer.label}</p>
                      <p className="text-[11px] text-text-tertiary font-light mt-0.5">{layer.sub}</p>
                    </div>
                  </div>
                  {i < 2 && (
                    <svg width="28" height="12" viewBox="0 0 28 12" fill="none" className="shrink-0">
                      <path d="M0 6h22M20 2l6 4-6 4" stroke="var(--color-primary)" strokeWidth="1.2" strokeOpacity="0.4"/>
                    </svg>
                  )}
                </div>
              ))}
            </div>

            {/* Right: key properties */}
            <div className="flex items-center gap-6 text-sm text-text-secondary">
              {[
                { prop: "Non-custodial", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> },
                { prop: "Open-source", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
                { prop: "Zero fees", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M6 12h12"/></svg> },
              ].map((item, i) => (
                <div key={item.prop} className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="text-primary opacity-60">{item.icon}</span>
                    {item.prop}
                  </span>
                  {i < 2 && <span className="text-border/40">|</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-32">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20">
            <div>
              <p className="text-xs font-medium tracking-[0.15em] uppercase text-primary/70 mb-3">FAQ</p>
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
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-32 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-lg mx-auto leading-tight">
            Ready to pool with <span className="text-primary">Bitcoin</span>?
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
      </section>
    </div>
  );
}
