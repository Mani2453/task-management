"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Toast {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function showToast(message: string, type: "success" | "error" | "info" = "info") {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }

  // Listen for session-expired-toast event globally
  React.useEffect(() => {
    function onSessionExpiredToast() {
      showToast("Session expired. Please log in again.", "error");
    }
    window.addEventListener("session-expired-toast", onSessionExpiredToast);
    return () => window.removeEventListener("session-expired-toast", onSessionExpiredToast);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`relative min-w-[220px] max-w-xs px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-white animate-fade-in-up transition-all
              ${toast.type === "success" ? "bg-gradient-to-r from-green-500 to-green-600" : toast.type === "error" ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-blue-500 to-blue-600"}
              border-b-4
              ${toast.type === "success" ? "border-green-300" : toast.type === "error" ? "border-red-300" : "border-blue-300"}
            `}
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
          >
            <span className="text-lg">
              {toast.type === 'success' ? '✔️' : toast.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span className="flex-1 text-sm font-medium">{toast.message}</span>
            <span className="absolute top-1 right-2 text-xs opacity-60">{toast.type?.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
