import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl z-10 text-left border border-slate-200"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 text-rose-600 mb-3">
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="text-lg font-sans font-semibold text-slate-900">
              {title || 'Are you sure?'}
            </h3>
          </div>

          <p className="text-xs text-slate-500 font-sans mb-6 leading-relaxed">
            {message || 'This action cannot be undone.'}
          </p>

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-sans font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 text-xs font-sans font-medium transition-colors shadow-sm"
            >
              Delete Item
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
