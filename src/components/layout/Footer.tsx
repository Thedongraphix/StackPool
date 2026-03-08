import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-text-tertiary">
            <div className="h-5 w-5 rounded bg-primary/80 flex items-center justify-center text-[10px] font-bold text-surface">
              S
            </div>
            <span>StackPool</span>
            <span className="mx-1">|</span>
            <span>Built on Stacks. Secured by Bitcoin.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-tertiary">
            <Link href="#" className="hover:text-text-secondary transition-colors">
              About
            </Link>
            <Link href="#" className="hover:text-text-secondary transition-colors">
              Docs
            </Link>
            <Link href="#" className="hover:text-text-secondary transition-colors">
              GitHub
            </Link>
            <Link href="#" className="hover:text-text-secondary transition-colors">
              X / Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
