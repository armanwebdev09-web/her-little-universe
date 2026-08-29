import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Heart, Sparkles, Lock } from 'lucide-react';

export const OpenWhenCard = ({ item, onOpenLetter }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    if (item.locked) return;
    
    // Trigger envelope unsealing animation sequence before opening reader
    setIsOpening(true);
    setTimeout(() => {
      setIsOpening(false);
      onOpenLetter(item);
    }, 600);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      className={`group relative rounded-2xl p-6 border transition-all duration-500 cursor-pointer overflow-hidden flex flex-col justify-between ${
        item.locked
          ? 'bg-[#101528]/50 border-[#151B30] opacity-75'
          : isOpening
          ? 'bg-[#151B30] border-[#D9A6B2] shadow-[0_0_40px_rgba(217,166,178,0.3)] scale-102'
          : 'bg-[#151B30]/70 border-[#D9A6B2]/15 hover:border-[#D9A6B2]/40 hover:bg-[#151B30] glow-card-hover'
      }`}
    >
      {/* Top Envelope Icon / Wax Seal Badge */}
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${
            isOpening
              ? 'bg-[#D9A6B2] text-[#080B16] border-[#D9A6B2] rotate-12 scale-110'
              : 'bg-[#101528] text-[#D9A6B2] border-[#D9A6B2]/20 group-hover:border-[#D9A6B2]/40'
          }`}
        >
          {item.locked ? (
            <Lock className="w-4 h-4 text-[#D8B477]" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
        </div>

        <span className="text-[10px] tracking-[0.2em] font-sans font-semibold uppercase text-[#D8B477] bg-[#101528] px-2.5 py-1 rounded-full border border-[#D8B477]/20">
          OPEN WHEN
        </span>
      </div>

      {/* Title & Description */}
      <div>
        <h3 className="text-lg font-serif font-normal text-[#F8F5F0] mb-2 group-hover:text-[#D9A6B2] transition-colors duration-300">
          {item.title}
        </h3>
        <p className="text-xs text-[#B8B6C4] font-light leading-relaxed mb-4">
          {item.description}
        </p>
      </div>

      {/* Animated Envelope Flap / Sliding Letter Indicator */}
      <div className="pt-3 border-t border-[#101528] flex items-center justify-between text-xs text-[#D9A6B2]">
        {item.locked ? (
          <span className="text-xs font-mono text-[#B8B6C4]/60">🔒 Sealed</span>
        ) : isOpening ? (
          <span className="text-xs font-serif italic text-[#D8B477] animate-pulse">
            Opening letter...
          </span>
        ) : (
          <span className="text-xs font-sans uppercase tracking-widest text-[#B8B6C4] group-hover:text-[#D9A6B2] transition-colors flex items-center space-x-1">
            <span>Read Envelope</span>
            <span>→</span>
          </span>
        )}
      </div>
    </motion.div>
  );
};
