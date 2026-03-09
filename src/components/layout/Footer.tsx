import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Main footer */}
        <div className="py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center text-[9px] font-bold text-surface">
                S
              </div>
              <span className="text-sm font-semibold text-text-primary">
                Stack<span className="text-primary">Pool</span>
              </span>
            </div>
            <p className="text-xs text-text-tertiary leading-relaxed max-w-[200px]">
              Bitcoin-powered group payments. Built on Stacks.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-medium text-text-secondary mb-3 uppercase tracking-wider">Product</p>
            <div className="space-y-2">
              <Link href="/explore" className="block text-sm text-text-tertiary hover:text-text-primary transition-colors">
                Explore Pools
              </Link>
              <Link href="/create" className="block text-sm text-text-tertiary hover:text-text-primary transition-colors">
                Create Pool
              </Link>
              <Link href="/dashboard" className="block text-sm text-text-tertiary hover:text-text-primary transition-colors">
                Dashboard
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <p className="text-xs font-medium text-text-secondary mb-3 uppercase tracking-wider">Resources</p>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-text-tertiary hover:text-text-primary transition-colors">
                Documentation
              </Link>
              <Link href="#" className="block text-sm text-text-tertiary hover:text-text-primary transition-colors">
                Smart Contract
              </Link>
              <Link href="#" className="block text-sm text-text-tertiary hover:text-text-primary transition-colors">
                FAQ
              </Link>
            </div>
          </div>

          {/* Community */}
          <div>
            <p className="text-xs font-medium text-text-secondary mb-3 uppercase tracking-wider">Community</p>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-text-tertiary hover:text-text-primary transition-colors">
                GitHub
              </Link>
              <Link href="#" className="block text-sm text-text-tertiary hover:text-text-primary transition-colors">
                X / Twitter
              </Link>
              <Link href="#" className="block text-sm text-text-tertiary hover:text-text-primary transition-colors">
                Discord
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/30 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-tertiary">
            &copy; {new Date().getFullYear()} StackPool. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-text-tertiary">
            <Link href="#" className="hover:text-text-secondary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-text-secondary transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
