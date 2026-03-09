"use client";

import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  charCount?: number;
  charLimit?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, charCount, charLimit, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={id} className="block text-sm font-medium text-text-primary">
              {label}
            </label>
          )}
          {charLimit !== undefined && charCount !== undefined && (
            <span
              className={cn(
                "text-xs tabular-nums font-mono",
                charCount > charLimit ? "text-error" : "text-text-tertiary"
              )}
            >
              {charCount}/{charLimit}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-xl bg-surface-3/60 border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary resize-none",
            "transition-all duration-200",
            "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:bg-surface-3",
            error && "border-error/50 focus:border-error focus:ring-error/20",
            className
          )}
          rows={3}
          {...props}
        />
        {hint && !error && <p className="text-xs text-text-tertiary font-light">{hint}</p>}
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
