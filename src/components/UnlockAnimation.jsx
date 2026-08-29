import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Sparkles } from 'lucide-react';

export const UnlockAnimation = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 850);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080B16] text-[#F8F5F0] overflow-hidden">
        {/* Soft Radial Light Flare Expand */}
        <motion.div
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 3.5, opacity: 0.35 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(217, 166, 178, 0.8) 0%, rgba(216, 180, 119, 0.4) 40%, rgba(8, 11, 22, 0) 70%)'
          }}
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center z-10 text-center"
        >
          <div className="w-24 h-24 rounded-full bg-[#151B30] border-2 border-[#D9A6B2] flex items-center justify-center text-[#D9A6B2] shadow-[0_0_60px_rgba(217,166,178,0.5)] mb-6 animate-pulse">
            <Unlock className="w-10 h-10 text-[#D8B477]" />
          </div>

          <h2 className="text-3xl font-serif font-normal text-[#F8F5F0] mb-2 tracking-wide">
            Unlocking Secret Space...
          </h2>
          <p className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold flex items-center justify-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome my love</span>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
