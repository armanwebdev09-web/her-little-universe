import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, FastForward } from 'lucide-react';

export const BirthdayIntro = ({ herName, onComplete }) => {
  const [step, setStep] = useState(0);

  // Auto-skip if prefers-reduced-motion is set
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      onComplete();
      return;
    }

    const timer1 = setTimeout(() => setStep(1), 1800);
    const timer2 = setTimeout(() => setStep(2), 3600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#080B16] text-[#F8F5F0]">
      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute top-6 right-6 px-4 py-2 rounded-full bg-[#151B30]/80 text-[#B8B6C4] hover:text-[#F8F5F0] border border-[#D9A6B2]/20 text-xs font-mono uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer z-10"
      >
        <FastForward className="w-3.5 h-3.5 text-[#D8B477]" />
        <span>Skip Intro</span>
      </button>

      <div className="text-center space-y-6 max-w-xl mx-auto">
        {step === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-2xl sm:text-3xl font-serif font-light text-[#B8B6C4] italic"
          >
            Today is a little different...
          </motion.p>
        )}

        {step === 1 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-2xl sm:text-3xl font-serif font-light text-[#B8B6C4] italic"
          >
            Because today is yours.
          </motion.p>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#151B30] border border-[#D9A6B2]/30">
              <Sparkles className="w-4 h-4 text-[#D8B477]" />
              <span className="text-xs uppercase tracking-widest text-[#D9A6B2] font-semibold">
                HAPPY BIRTHDAY
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif text-[#F8F5F0]">
              Happy Birthday, <br />
              <span className="italic font-light text-[#D9A6B2]">{herName || 'Sofia'} ❤️</span>
            </h1>

            <div>
              <button
                onClick={onComplete}
                className="px-8 py-3.5 rounded-full bg-[#D9A6B2] text-[#080B16] font-semibold text-xs uppercase tracking-widest hover:bg-[#F8F5F0] transition-colors inline-flex items-center space-x-2 cursor-pointer shadow-[0_0_30px_rgba(217,166,178,0.4)]"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Begin Birthday Journey</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
