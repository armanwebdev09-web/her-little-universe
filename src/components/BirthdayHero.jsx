import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { birthdayData } from '../data/birthdayData';

export const BirthdayHero = () => {
  return (
    <section className="relative pt-32 pb-16 px-6 z-10 text-center flex flex-col items-center justify-center">
      {/* Central Glowing Moon Visual */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full mb-8 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #F8F5F0 0%, #D8B477 40%, rgba(8, 11, 22, 0) 75%)',
          boxShadow: '0 0 60px 20px rgba(216, 180, 119, 0.25)',
          filter: 'blur(0.5px)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart className="w-10 h-10 fill-[#080B16] text-[#080B16] opacity-30 animate-pulse" />
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#151B30]/80 border border-[#D8B477]/30 backdrop-blur-md mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D8B477]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold">
            {birthdayData.tagline}
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal text-[#F8F5F0] tracking-tight leading-tight mb-4"
        >
          HAPPY BIRTHDAY, <br />
          <span className="italic font-light text-[#D9A6B2]">{siteConfig.herName} ❤️</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-base sm:text-xl text-[#B8B6C4] font-light max-w-xl leading-relaxed mb-6"
        >
          {birthdayData.subheading}
        </motion.p>

        {/* Configurable Date Display Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="px-5 py-2 rounded-full bg-[#101528] border border-[#D9A6B2]/20 text-xs font-mono text-[#D9A6B2]"
        >
          {birthdayData.dateDisplay}
        </motion.div>
      </div>
    </section>
  );
};
