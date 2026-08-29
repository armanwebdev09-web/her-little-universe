import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Sparkles, Gift } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';

export const DailySongHero = ({ unlockedCount, totalCount }) => {
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    const target = new Date(siteConfig.birthdayDate).getTime();
    const now = new Date().getTime();
    const diff = target - now;
    const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    setDaysRemaining(days);
  }, []);

  const progressPercentage = Math.min(100, Math.round((unlockedCount / totalCount) * 100));

  return (
    <section className="relative pt-32 pb-12 px-6 z-10 text-center flex flex-col items-center justify-center">
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
          <Music className="w-3.5 h-3.5 text-[#D8B477]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#D9A6B2] font-semibold">
            OUR SOUNDTRACK
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal text-[#F8F5F0] tracking-tight leading-[1.15] mb-6 max-w-3xl"
        >
          One song for <br className="hidden sm:inline" />
          <span className="italic font-light text-[#D9A6B2]">every day.</span>
        </motion.h1>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-base sm:text-xl text-[#B8B6C4] font-light max-w-xl leading-relaxed mb-8"
        >
          Some feelings are easier to say with a song.
        </motion.p>

        {/* Meta Stats: Birthday Indicator & Playlist Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-xl p-5 rounded-2xl bg-[#151B30]/60 border border-[#D9A6B2]/15 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          {/* Birthday Days Badge */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#101528] border border-[#D8B477]/30 text-[#D8B477]">
              <Gift className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B8B6C4] font-semibold block">
                BIRTHDAY IN
              </span>
              <span className="text-sm font-serif font-semibold text-[#F8F5F0]">
                {daysRemaining} {daysRemaining === 1 ? 'DAY' : 'DAYS'}
              </span>
            </div>
          </div>

          {/* Soundtrack Progress */}
          <div className="w-full sm:w-auto flex-1 sm:max-w-xs text-left">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-semibold mb-1.5">
              <span className="text-[#D9A6B2]">YOUR SOUNDTRACK</span>
              <span className="text-[#F8F5F0] font-mono">{unlockedCount} / {totalCount} SONGS</span>
            </div>
            <div className="h-2 w-full bg-[#101528] rounded-full overflow-hidden border border-[#D9A6B2]/10">
              <div
                className="h-full bg-gradient-to-r from-[#D8B477] to-[#D9A6B2] rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
