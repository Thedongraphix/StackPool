"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  suffix?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, suffix, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full h-11 rounded-xl bg-surface-3/60 border border-border px-4 text-sm text-text-primary placeholder:text-text-tertiary",
              "transition-all duration-200",
              "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:bg-surface-3",
              error && "border-error/50 focus:border-error focus:ring-error/20",
              suffix && "pr-16",
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-tertiary font-mono select-none">
              {suffix}
            </span>
          )}
        </div>
        {hint && !error && <p className="text-xs text-text-tertiary font-light">{hint}</p>}
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
