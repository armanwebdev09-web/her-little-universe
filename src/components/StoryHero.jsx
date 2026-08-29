import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

export const StoryHero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 z-10 text-center flex flex-col items-center justify-center">
      {/* Soft Center Glow */}
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
          <Sparkles className="w-3.5 h-3.5 text-[#D8B477]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#D9A6B2] font-semibold">
            OUR STORY
          </span>
        </motion.div>

        {/* Large Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal text-[#F8F5F0] tracking-tight leading-[1.15] mb-6 max-w-3xl"
        >
          Every beautiful story has <br className="hidden sm:inline" />
          <span className="italic font-light text-[#D9A6B2]">little moments.</span>
        </motion.h1>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-base sm:text-xl text-[#B8B6C4] font-light max-w-xl leading-relaxed mb-8"
        >
          And these are some of ours.
        </motion.p>

        {/* Intimate Quote Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="p-4 sm:p-6 rounded-2xl bg-[#151B30]/50 border border-[#D9A6B2]/15 backdrop-blur-md italic font-serif text-sm sm:text-base text-[#F8F5F0]/90 max-w-2xl"
        >
          "Our story isn't one big moment. It's all the little moments that brought us here."
        </motion.div>
      </div>
    </section>
  );
};
