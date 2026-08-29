import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Lock, ArrowRight, Gift } from 'lucide-react';

export const LetterCard = ({ item, onOpenLetter }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={() => !item.locked && onOpenLetter(item)}
      className={`group relative rounded-2xl p-6 border transition-all duration-500 overflow-hidden flex flex-col justify-between ${
        item.locked
          ? 'bg-[#101528]/50 border-[#151B30] opacity-80 cursor-not-allowed'
          : 'bg-[#151B30]/70 border-[#D9A6B2]/15 hover:border-[#D9A6B2]/40 hover:bg-[#151B30] glow-card-hover cursor-pointer'
      }`}
    >
      <div>
        {/* Card Header Meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#101528] border border-[#D9A6B2]/20 flex items-center justify-center text-[#D9A6B2]">
              {item.isBirthdayLetter ? (
                <Gift className="w-4 h-4 text-[#D8B477]" />
              ) : item.locked ? (
                <Lock className="w-4 h-4 text-[#D8B477]" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
            </div>
            <span className="text-[10px] tracking-[0.2em] font-sans font-semibold uppercase text-[#D8B477]">
              {item.category || 'LOVE LETTER'}
            </span>
          </div>

          <div className="flex items-center space-x-1 text-xs text-[#B8B6C4] font-mono">
            <Calendar className="w-3 h-3 text-[#D9A6B2]" />
            <span>{item.date}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif font-normal text-[#F8F5F0] mb-2 group-hover:text-[#D9A6B2] transition-colors duration-300">
          {item.title}
        </h3>

        {/* Preview or Locked Message */}
        {item.locked ? (
          <p className="text-xs text-[#B8B6C4]/70 font-mono italic my-3">
            🔒 This letter is waiting for the right moment.
          </p>
        ) : (
          <p className="text-xs sm:text-sm text-[#B8B6C4] font-light leading-relaxed mb-4 line-clamp-2 italic font-serif">
            "{item.preview}"
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-[#101528] flex items-center justify-between">
        {item.locked ? (
          <span className="text-xs font-mono text-[#B8B6C4]/50">Sealed for now</span>
        ) : (
          <span className="text-xs font-sans tracking-widest uppercase text-[#D9A6B2] group-hover:translate-x-1 transition-transform duration-300 flex items-center space-x-1">
            <span>Read Letter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </motion.div>
  );
};
