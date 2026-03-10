"use client";

import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import Modal from "./Modal";
import { showToast } from "@/components/ui/Toast";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  poolTitle: string;
  poolId: string;
}

export default function ShareModal({ open, onClose, poolTitle, poolId }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const url = typeof window !== "undefined" ? `${window.location.origin}/pool/${poolId}` : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    showToast("Link copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 512;
    const padding = 48;
    canvas.width = size + padding * 2;
    canvas.height = size + padding * 2;

    // White background with rounded corners
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(0, 0, canvas.width, canvas.height, 24);
    ctx.fill();

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, padding, padding, size, size);

      // Add label at bottom
      ctx.fillStyle = "#666666";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("StackPool", canvas.width / 2, canvas.height - 16);

      const link = document.createElement("a");
      link.download = `stackpool-${poolId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Modal open={open} onClose={onClose} title="Share this pool">
      <div className="space-y-5">
        {/* QR Code */}
        <div className="flex flex-col items-center">
          <div
            ref={qrRef}
            className="bg-white rounded-2xl p-5 shadow-sm"
          >
            <QRCode
              value={url || `https://stackpool.app/pool/${poolId}`}
              size={180}
              level="M"
              fgColor="#0A0A0B"
              bgColor="#ffffff"
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>
          <button
            onClick={handleDownloadQR}
            className="mt-3 flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Download QR
          </button>
        </div>

        {/* URL Copy */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-10 rounded-xl bg-surface-3/60 border border-border px-3 flex items-center overflow-hidden">
            <span className="text-xs text-text-tertiary font-mono truncate">{url || `stackpool.app/pool/${poolId}`}</span>
          </div>
          <button
            onClick={handleCopy}
            className="h-10 px-4 rounded-xl bg-primary/10 border border-primary/20 text-sm font-medium text-primary hover:bg-primary/15 transition-colors shrink-0 cursor-pointer"
          >
            {copied ? (
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                Copied
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                Copy Link
              </span>
            )}
          </button>
        </div>

        {/* Social share buttons */}
        <div>
          <p className="text-xs text-text-tertiary mb-2.5 text-center">Share via</p>
          <div className="flex items-center justify-center gap-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Contribute to "${poolTitle}" on StackPool: ${url || `stackpool.app/pool/${poolId}`}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
              aria-label="Share on WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Contribute to "${poolTitle}" on StackPool`)}&url=${encodeURIComponent(url || `stackpool.app/pool/${poolId}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-xl bg-white/5 border border-border flex items-center justify-center text-text-secondary hover:bg-white/10 transition-colors"
              aria-label="Share on X"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(url || `stackpool.app/pool/${poolId}`)}&text=${encodeURIComponent(`Contribute to "${poolTitle}" on StackPool`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-xl bg-[#0088cc]/10 border border-[#0088cc]/20 flex items-center justify-center text-[#0088cc] hover:bg-[#0088cc]/20 transition-colors"
              aria-label="Share on Telegram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}
