import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev?.id ? null : prev));
    }, 4500);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          {toast.type === 'success' && <CheckCircle2 size={20} color="#10B981" />}
          {toast.type === 'error' && <AlertCircle size={20} color="#EF4444" />}
          {toast.type === 'info' && <Info size={20} color="#38BDF8" />}
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={hideToast} aria-label="Close">
            <X size={16} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
