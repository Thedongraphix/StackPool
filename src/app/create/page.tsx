"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { cn, formatBtc } from "@/lib/utils";
import { showToast } from "@/components/ui/Toast";
import { useWallet } from "@/hooks/useWallet";
import { useCreatePool } from "@/hooks/useContribute";
import ConnectWalletModal from "@/components/modals/ConnectWalletModal";
import { getTxUrl } from "@/lib/stacks";

const EMOJIS = [
  { key: "party", display: "\uD83C\uDF89" },
  { key: "palm_tree", display: "\uD83C\uDF34" },
  { key: "fork_and_knife", display: "\uD83C\uDF74" },
  { key: "house", display: "\uD83C\uDFE0" },
  { key: "briefcase", display: "\uD83D\uDCBC" },
  { key: "chart_increasing", display: "\uD83D\uDCC8" },
  { key: "books", display: "\uD83D\uDCDA" },
  { key: "rocket", display: "\uD83D\uDE80" },
  { key: "birthday_cake", display: "\uD83C\uDF82" },
  { key: "money", display: "\uD83D\uDCB0" },
  { key: "globe_with_meridians", display: "\uD83C\uDF10" },
  { key: "heart", display: "\u2764\uFE0F" },
];

export default function CreatePoolPage() {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("party");
  const [targetAmount, setTargetAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [deadline, setDeadline] = useState("");
  const [minContribution, setMinContribution] = useState("");
  const [hasMinContribution, setHasMinContribution] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  const { isConnected, address } = useWallet();
  const { loading: creating, txId, createPool } = useCreatePool();

  const canProceedStep1 = title.trim().length > 0 && description.trim().length > 0;
  const canProceedStep2 =
    targetAmount && parseFloat(targetAmount) > 0 && recipient.trim().length > 0 && deadline;

  const getSelectedEmojiDisplay = () =>
    EMOJIS.find((e) => e.key === selectedEmoji)?.display || "\uD83C\uDF89";

  async function handleCreate() {
    if (!isConnected || !address) {
      setConnectModalOpen(true);
      return;
    }

    await createPool({
      title,
      description,
      targetAmountStx: parseFloat(targetAmount),
      recipient,
      deadlineDate: new Date(deadline),
      minContributionStx: hasMinContribution ? parseFloat(minContribution || "0") : 0,
      isPublic: true,
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-primary transition-colors duration-200 mb-4"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create a Pool</h1>
        <p className="text-text-secondary mt-1.5 font-light">Set up a group contribution in 2 minutes</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1 max-w-xl">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[
              { num: 1, label: "Details" },
              { num: 2, label: "Settings" },
              { num: 3, label: "Review" },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (s.num < step) setStep(s.num);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                    step === s.num
                      ? "bg-primary text-surface shadow-[0_0_12px_rgba(247,147,26,0.2)]"
                      : step > s.num
                        ? "bg-primary/[0.08] text-primary border border-primary/15 cursor-pointer"
                        : "bg-surface-3/60 text-text-tertiary border border-border/40"
                  )}
                >
                  <span className="font-mono text-xs">{s.num}</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < 2 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>

          {/* Step 1: Details */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <Input
                id="title"
                label="Pool Title"
                placeholder="Weekend Trip to Mombasa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Textarea
                id="description"
                label="Description"
                placeholder="Collecting for accommodation and transport. Everyone contributes their share."
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 280))}
                charCount={description.length}
                charLimit={280}
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">Pool Icon</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji.key}
                      onClick={() => setSelectedEmoji(emoji.key)}
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center text-lg transition-all duration-200 cursor-pointer",
                        selectedEmoji === emoji.key
                          ? "bg-primary/10 border-2 border-primary/40 scale-110 shadow-[0_0_10px_rgba(247,147,26,0.1)]"
                          : "bg-surface-3/60 border border-border hover:border-border-hover hover:scale-105"
                      )}
                    >
                      {emoji.display}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={() => setStep(2)} disabled={!canProceedStep1} fullWidth>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Settings */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <Input
                id="target"
                label="Target Amount"
                type="number"
                placeholder="0.008"
                suffix="sBTC"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                hint={targetAmount ? `Approx. ${(parseFloat(targetAmount || "0") * 7500000).toLocaleString()} KES` : undefined}
              />

              <Input
                id="recipient"
                label="Recipient Wallet"
                placeholder="SP... or yourname.btc"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                hint="Funds will be sent to this address when the target is met"
              />

              <div className="space-y-1.5">
                <label htmlFor="deadline" className="block text-sm font-medium text-text-primary">
                  Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                  className="w-full h-11 rounded-xl bg-surface-3/60 border border-border px-4 text-sm text-text-primary transition-all duration-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:bg-surface-3 [color-scheme:dark]"
                />
                <p className="text-xs text-text-tertiary">
                  Unmet pools are fully refunded after this date.
                </p>
              </div>

              {/* Min contribution toggle */}
              <div className="rounded-xl border border-border/60 bg-surface-3/30 p-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-text-primary">
                    Require minimum contribution?
                  </span>
                  <button
                    onClick={() => setHasMinContribution(!hasMinContribution)}
                    className={cn(
                      "relative w-10 h-5.5 rounded-full transition-colors cursor-pointer",
                      hasMinContribution ? "bg-primary" : "bg-surface-3 border border-border"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
                        hasMinContribution ? "translate-x-5" : "translate-x-0.5"
                      )}
                    />
                  </button>
                </label>
                {hasMinContribution && (
                  <div className="mt-3">
                    <Input
                      id="minContrib"
                      type="number"
                      placeholder="0.001"
                      suffix="sBTC"
                      value={minContribution}
                      onChange={(e) => setMinContribution(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!canProceedStep2} className="flex-1">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="card-glow divide-y divide-border/40">
                <div className="p-4 flex items-center gap-3">
                  <span className="text-2xl">{getSelectedEmojiDisplay()}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
                    <p className="text-xs text-text-tertiary mt-0.5 line-clamp-1">{description}</p>
                  </div>
                </div>

                {[
                  { label: "Target", value: `${formatBtc(parseFloat(targetAmount || "0"))} sBTC` },
                  { label: "Recipient", value: recipient },
                  { label: "Deadline", value: new Date(deadline).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
                  ...(hasMinContribution && minContribution
                    ? [{ label: "Min. Contribution", value: `${minContribution} sBTC` }]
                    : []),
                ].map((row) => (
                  <div key={row.label} className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-text-secondary">{row.label}</span>
                    <span className="text-sm text-text-primary font-medium font-mono truncate ml-4 max-w-[200px]">
                      {row.value}
                    </span>
                  </div>
                ))}

                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Est. gas fee</span>
                  <span className="text-sm text-text-tertiary font-mono">~0.001 STX</span>
                </div>
              </div>

              <div className="rounded-xl border border-warning/15 bg-warning/[0.04] p-3.5">
                <p className="text-xs text-warning leading-relaxed">
                  Once created, the target amount and recipient cannot be changed. Make sure
                  everything looks correct before proceeding.
                </p>
              </div>

              {txId && (
                <div className="rounded-xl border border-success/15 bg-success/[0.04] p-3.5">
                  <p className="text-xs text-success leading-relaxed">
                    Transaction submitted!{" "}
                    <a
                      href={getTxUrl(txId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium"
                    >
                      View on Explorer
                    </a>
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" onClick={() => setStep(2)} className="flex-1" disabled={creating}>
                  Back
                </Button>
                {isConnected ? (
                  <Button onClick={handleCreate} className="flex-1" disabled={creating || !!txId}>
                    {creating ? "Signing..." : txId ? "Pool Created" : "Create Pool"}
                  </Button>
                ) : (
                  <Button onClick={() => setConnectModalOpen(true)} className="flex-1">
                    Connect Wallet to Continue
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Preview - Desktop */}
        <div className="hidden lg:block w-80">
          <div className="sticky top-24">
            <p className="text-xs text-text-tertiary uppercase tracking-[0.15em] font-medium mb-3">
              Preview
            </p>
            <div className="card-glow p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{getSelectedEmojiDisplay()}</span>
                <h3 className="text-sm font-semibold text-text-primary truncate">
                  {title || "Your Pool Title"}
                </h3>
              </div>
              <p className="text-xs text-text-tertiary line-clamp-2 mb-4">
                {description || "Your pool description will appear here..."}
              </p>
              <div className="w-full h-1.5 rounded-full bg-surface-3 mb-3" />
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-text-primary">
                  0.000 / {targetAmount ? formatBtc(parseFloat(targetAmount)) : "0.000"} sBTC
                </span>
              </div>
              {deadline && (
                <p className="text-xs text-text-tertiary mt-3 pt-3 border-t border-border">
                  Deadline:{" "}
                  {new Date(deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConnectWalletModal
        open={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
      />
    </div>
  );
}
