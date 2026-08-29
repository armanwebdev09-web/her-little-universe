import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AdminToastContext = createContext(null);

export const AdminToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AdminToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className={`p-4 rounded-xl shadow-lg border flex items-center justify-between pointer-events-auto ${
                toast.type === 'error'
                  ? 'bg-rose-900/90 text-rose-100 border-rose-700'
                  : 'bg-emerald-900/90 text-emerald-100 border-emerald-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                {toast.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-rose-300" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                )}
                <span className="text-xs font-sans font-medium">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 p-1 rounded-md hover:bg-white/10 text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AdminToastContext.Provider>
  );
};

export const useAdminToast = () => {
  const context = useContext(AdminToastContext);
  if (!context) {
    throw new Error('useAdminToast must be used within an AdminToastProvider');
  }
  return context;
};
