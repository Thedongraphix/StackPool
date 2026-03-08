"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { mockStats } from "@/lib/mockData";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1600;
    const steps = 40;
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
    <span className="font-mono font-bold">
      {display}
      {suffix}
    </span>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gradient glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Pool money.
              <br />
              <span className="text-primary">Trust the contract.</span>
            </h1>
            <p className="mt-5 text-lg text-text-secondary leading-relaxed max-w-lg">
              Bitcoin-powered group payments on Stacks. Split bills, run chamas, fund harambees —
              automatically.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/create">
                <Button size="lg">Create a Pool</Button>
              </Link>
              <Link href="/explore">
                <Button variant="secondary" size="lg">
                  Explore Pools
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg">
            <div>
              <div className="text-2xl sm:text-3xl text-text-primary">
                <AnimatedCounter target={mockStats.totalPools} />
              </div>
              <p className="text-sm text-text-tertiary mt-1">Pools Created</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl text-text-primary">
                <AnimatedCounter target={mockStats.totalSbtcPooled} suffix=" sBTC" />
              </div>
              <p className="text-sm text-text-tertiary mt-1">Total Pooled</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl text-text-primary">
                <AnimatedCounter target={mockStats.successfulPools} />
              </div>
              <p className="text-sm text-text-tertiary mt-1">Successful</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">How it works</h2>
            <p className="text-text-secondary mt-3 max-w-md mx-auto">
              Three steps. No middlemen. No trust required.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: "01",
                title: "Create a Pool",
                desc: "Set a target amount, deadline, and recipient address. The smart contract handles the rest.",
              },
              {
                step: "02",
                title: "Share the Link",
                desc: "Send a QR code or link to your group. Contributors connect their wallet and add sBTC.",
              },
              {
                step: "03",
                title: "Funds Auto-Release",
                desc: "When the target is hit, funds go to the recipient. If the deadline passes, everyone gets refunded.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-border bg-surface-2 p-6 sm:p-8"
              >
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-primary-muted text-primary font-mono text-sm font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Built for real life</h2>
            <p className="text-text-secondary mt-3">From monthly chamas to one-time splits.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Chamas",
                desc: "Monthly investment group contributions with full transparency",
              },
              {
                icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
                title: "Harambees",
                desc: "Community fundraising with on-chain accountability",
              },
              {
                icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
                title: "Bill Splitting",
                desc: "Split dinners, rent, and subscriptions without awkward follow-ups",
              },
              {
                icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Group Travel",
                desc: "Collect for accommodation, transport, and activities — one pool",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-surface-2 p-5 sm:p-6 hover:border-border-hover transition-colors"
              >
                <svg
                  className="h-8 w-8 text-primary mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <h3 className="text-sm font-semibold text-text-primary mb-1">{item.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24">
          <div className="rounded-2xl border border-border bg-surface-2 p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Ready to pool with Bitcoin?
              </h2>
              <p className="text-text-secondary mt-3 max-w-md mx-auto">
                Create your first pool in under 2 minutes. No fees. No middlemen.
              </p>
              <div className="mt-8">
                <Link href="/create">
                  <Button size="lg">Create Your First Pool</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
