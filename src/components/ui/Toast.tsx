"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface ToastData {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
const listeners: Set<(toast: ToastData) => void> = new Set();

export function showToast(message: string, type: ToastType = "info") {
  const toast: ToastData = { id: ++toastId, message, type };
  listeners.forEach((fn) => fn(toast));
}

const typeStyles: Record<ToastType, string> = {
  success: "border-success/20 bg-success/[0.06]",
  error: "border-error/20 bg-error/[0.06]",
  info: "border-primary/20 bg-primary/[0.06]",
};

const dotColors: Record<ToastType, string> = {
  success: "bg-success",
  error: "bg-error",
  info: "bg-primary",
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: ToastData) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 4000);
  }, []);

  useEffect(() => {
    listeners.add(addToast);
    return () => {
      listeners.delete(addToast);
    };
  }, [addToast]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm text-text-primary bg-surface-2 backdrop-blur-xl animate-fade-in-scale",
            typeStyles[toast.type]
          )}
        >
          <span className={cn("h-2 w-2 rounded-full shrink-0", dotColors[toast.type])} />
          <span className="font-light">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
