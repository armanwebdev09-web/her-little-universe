import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';

export const DiscoveryCounter = ({ discoveredCount, totalCount }) => {
  const allDiscovered = discoveredCount >= totalCount && totalCount > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 mb-6 flex flex-col items-center justify-center z-20 relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-[#151B30]/80 border border-[#D9A6B2]/20 backdrop-blur-md text-xs font-mono text-[#F8F5F0] shadow-md"
      >
        <Star className="w-3.5 h-3.5 fill-[#D8B477] text-[#D8B477]" />
        <span>
          <strong className="text-[#D9A6B2] font-semibold">{discoveredCount}</strong> / {totalCount} memories discovered
        </span>
      </motion.div>

      {/* Completion Banner when all stars are found */}
      <AnimatePresence>
        {allDiscovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#D9A6B2]/20 via-[#D8B477]/20 to-[#D9A6B2]/20 border border-[#D8B477]/40 text-center text-xs font-serif text-[#F8F5F0] max-w-md shadow-xl"
          >
            <div className="flex items-center justify-center space-x-2 text-[#D8B477] font-semibold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>UNIVERSE COMPLETE ✨</span>
            </div>
            <p className="italic">
              "You found every little piece of our universe. Maybe there are still a few secrets left."
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
