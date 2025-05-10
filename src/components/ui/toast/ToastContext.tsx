import React, { createContext, useContext, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = {
  id: string;
  message: string;
  timeout?: number;
};

type ToastContextType = {
  showToast: (toast: ToastType) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const showToast = useCallback((toast: ToastType) => {
    setToasts((prev) => [...prev, toast]);

    if (toast.timeout && toast.timeout > 0) {
      setTimeout(() => removeToast(toast.id), toast.timeout);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="bg-gray-800 text-white px-4 py-2 rounded shadow flex justify-between items-center gap-2 min-w-[200px]"
            >
              <span>{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} className="text-white">
                ✕
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
