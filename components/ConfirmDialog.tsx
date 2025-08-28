"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ConfirmDialogContextType {
  confirm: (message: string) => Promise<boolean>;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

export function useConfirmDialog() {
  const ctx = useContext(ConfirmDialogContext);
  if (!ctx) throw new Error("useConfirmDialog must be used within ConfirmDialogProvider");
  return ctx;
}

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [resolve, setResolve] = useState<(v: boolean) => void>();

  function confirm(message: string) {
    setMessage(message);
    setOpen(true);
    return new Promise<boolean>((res) => {
      setResolve(() => res);
    });
  }

  function handleClose(result: boolean) {
    setOpen(false);
    if (resolve) resolve(result);
  }

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-xs border border-gray-200">
            <div className="mb-6 text-gray-800 text-base font-medium text-center">{message}</div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition" onClick={() => handleClose(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition" onClick={() => handleClose(true)}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  );
}
