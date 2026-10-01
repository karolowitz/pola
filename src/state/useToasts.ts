import { useCallback, useRef, useState } from "react";
import type { Toast, ToastTone } from "@/types";

type PushOptions = {
  tone?: ToastTone;
  duration?: number;
  action?: { label: string; onClick: () => void };
};

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const push = useCallback((message: string, opts: PushOptions = {}) => {
    const id = ++idRef.current;
    setToasts((t) => [
      ...t.filter((x) => x.message !== message),
      { id, message, tone: opts.tone ?? "default", action: opts.action },
    ]);
    window.setTimeout(
      () => setToasts((t) => t.filter((x) => x.id !== id)),
      opts.duration ?? 2600,
    );
  }, []);

  return { toasts, push };
}

export type PushToast = ReturnType<typeof useToasts>["push"];
