import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Heart } from 'lucide-react';

export const ComingSoonModal = ({ isOpen, sectionName, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#080B16]/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-3xl bg-[#151B30] border border-[#D9A6B2]/30 p-8 shadow-[0_0_50px_rgba(217,166,178,0.2)] text-center z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#B8B6C4] hover:text-[#F8F5F0] hover:bg-[#101528] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="mx-auto w-14 h-14 rounded-full bg-[#101528] border border-[#D9A6B2]/30 flex items-center justify-center mb-5 text-[#D9A6B2]">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-serif font-normal text-[#F8F5F0] mb-2">
            {sectionName}
          </h3>

          {/* Description */}
          <p className="text-sm text-[#B8B6C4] font-light leading-relaxed mb-6">
            This special corner of your universe is currently being written with love and will unlock in our next chapter.
          </p>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#D9A6B2] to-[#D8B477] text-[#080B16] font-medium text-xs tracking-widest uppercase hover:opacity-90 transition-opacity shadow-md"
          >
            I Can't Wait ✨
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
