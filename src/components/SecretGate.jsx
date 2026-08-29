import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Key, Sparkles } from 'lucide-react';

export const SecretGate = ({ onOpenUnlockModal }) => {
  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-6 pt-28 pb-16 z-10 overflow-hidden font-sans">
      {/* Ambient Glow Center */}
      <div 
        className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full pointer-events-none opacity-20 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(217, 166, 178, 0.4) 0%, rgba(216, 180, 119, 0.15) 50%, rgba(8, 11, 22, 0) 70%)'
        }}
      />

      <div className="max-w-xl mx-auto flex flex-col items-center">
        {/* Large Lock Icon Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#151B30]/90 border border-[#D9A6B2]/30 flex items-center justify-center text-[#D9A6B2] shadow-[0_0_50px_rgba(217,166,178,0.25)] mb-8"
        >
          <Lock className="w-10 h-10 text-[#D8B477]" />
        </motion.div>

        {/* Small Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#101528] border border-[#D8B477]/30 backdrop-blur-md mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D8B477]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold">
            THERE'S SOMETHING HIDDEN HERE
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-4xl sm:text-6xl font-serif font-normal text-[#F8F5F0] tracking-tight leading-tight mb-4"
        >
          This little corner <br />
          <span className="italic font-light text-[#D9A6B2]">is just for you.</span>
        </motion.h1>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-base sm:text-lg text-[#B8B6C4] font-light max-w-md mb-10 leading-relaxed font-serif italic"
        >
          "A quiet place kept close to my heart."
        </motion.p>

        {/* Unlock Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <button
            onClick={onOpenUnlockModal}
            className="group relative inline-flex items-center space-x-3 px-9 py-4 rounded-full bg-[#151B30] text-[#F8F5F0] border border-[#D9A6B2]/30 hover:border-[#D9A6B2] hover:bg-[#D9A6B2]/15 transition-all duration-500 shadow-[0_0_30px_rgba(217,166,178,0.2)] hover:shadow-[0_0_40px_rgba(217,166,178,0.4)] hover:-translate-y-0.5 cursor-pointer font-sans"
          >
            <Key className="w-4 h-4 text-[#D8B477]" />
            <span className="text-sm uppercase tracking-[0.2em] font-medium">Unlock Secret Space</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
