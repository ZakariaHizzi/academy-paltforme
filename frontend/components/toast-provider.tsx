"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type ToastVariant = "info" | "success" | "error";

type ToastOptions = {
  variant?: ToastVariant;
  duration?: number;
};

type ToastRecord = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  toast: (message: string, options?: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, string> = {
  info: "bg-primary text-on-primary",
  success: "bg-secondary text-on-secondary",
  error: "bg-error text-on-error",
};

const VARIANT_ICONS: Record<ToastVariant, string> = {
  info: "info",
  success: "check_circle",
  error: "error",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, { variant = "info", duration }: ToastOptions = {}) => {
      const id = nextId.current++;
      const timeout = duration ?? Math.min(9000, Math.max(4000, message.length * 20));

      setToasts((current) => [...current, { id, message, variant }]);

      window.setTimeout(() => dismiss(id), timeout);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-atomic="false"
        aria-live="polite"
        className="fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-2 pointer-events-none"
      >
        {toasts.map((item) => (
          <div
            className={`pointer-events-auto flex items-start gap-2.5 rounded-lg px-4 py-3 shadow-xl ${VARIANT_STYLES[item.variant]}`}
            key={item.id}
            role="status"
          >
            <span className="material-symbols-outlined mt-0.5 text-lg">
              {VARIANT_ICONS[item.variant]}
            </span>
            <span className="max-h-[55vh] flex-1 overflow-y-auto whitespace-pre-line break-words font-body-sm text-body-sm">
              {item.message}
            </span>
            <button
              aria-label="Dismiss notification"
              className="mt-0.5 rounded p-0.5 opacity-80 transition-opacity hover:opacity-100"
              onClick={() => dismiss(item.id)}
              type="button"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside a ToastProvider.");
  }

  return context;
}
