import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Heart } from 'lucide-react';

export const LetterHero = ({ totalLettersCount }) => {
  return (
    <section className="relative pt-32 pb-14 px-6 z-10 text-center flex flex-col items-center justify-center">
      {/* Ambient Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full pointer-events-none opacity-20 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(217, 166, 178, 0.4) 0%, rgba(216, 180, 119, 0.15) 50%, rgba(8, 11, 22, 0) 70%)'
        }}
      />

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Label Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#151B30]/80 border border-[#D9A6B2]/20 backdrop-blur-md mb-6"
        >
          <Mail className="w-3.5 h-3.5 text-[#D8B477]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#D9A6B2] font-semibold">
            LETTERS
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal text-[#F8F5F0] tracking-tight leading-[1.15] mb-6 max-w-3xl"
        >
          Words I wanted <br className="hidden sm:inline" />
          <span className="italic font-light text-[#D9A6B2]">you to have.</span>
        </motion.h1>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-base sm:text-xl text-[#B8B6C4] font-light max-w-xl leading-relaxed mb-6"
        >
          Because some feelings deserve more than a text message.
        </motion.p>

        {/* Dynamic Letter Counter Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-[#151B30]/70 border border-[#D8B477]/30 text-xs font-serif italic text-[#F8F5F0]"
        >
          <Heart className="w-3.5 h-3.5 fill-[#D9A6B2] text-[#D9A6B2]" />
          <span>{totalLettersCount} letters waiting for you</span>
        </motion.div>
      </div>
    </section>
  );
};
