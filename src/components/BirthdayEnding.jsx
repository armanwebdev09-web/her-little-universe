import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Home as HomeIcon, Lock, Sparkles, RefreshCw, Compass } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';

export const BirthdayEnding = ({ finalMessageText, confettiEnabled, onReplay }) => {
  const navigate = useNavigate();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Single confetti particle burst on render if enabled and reduced-motion is not set
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (confettiEnabled !== false && !mediaQuery.matches) {
      const items = Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        x: Math.random() * 200 - 100,
        y: Math.random() * -180 - 40,
        color: ['#D9A6B2', '#D8B477', '#F8F5F0'][i % 3],
        scale: Math.random() * 0.8 + 0.4,
      }));
      setParticles(items);
    }
  }, [confettiEnabled]);

  return (
    <section className="relative py-20 px-6 z-10 text-center border-t border-[#151B30]/80">
      {/* Particle Burst Elements */}
      <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: p.scale }}
            animate={{ x: p.x, y: p.y, opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: p.color }}
          />
        ))}
      </div>

      <div className="max-w-3xl mx-auto flex flex-col items-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-16 h-16 rounded-full bg-[#151B30] border border-[#D9A6B2]/40 flex items-center justify-center text-[#D9A6B2] shadow-[0_0_30px_rgba(217,166,178,0.3)]"
        >
          <Heart className="w-8 h-8 fill-[#D9A6B2]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold block">
            ONE LAST THING...
          </span>

          <h2 className="text-4xl sm:text-6xl font-serif text-[#F8F5F0] font-normal">
            Happy Birthday, <span className="italic font-light text-[#D9A6B2]">{siteConfig.herName}.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="p-8 sm:p-12 rounded-3xl bg-[#151B30]/80 border border-[#D9A6B2]/30 backdrop-blur-xl shadow-[0_0_50px_rgba(217,166,178,0.15)] text-center space-y-4 max-w-2xl"
        >
          <p className="text-lg sm:text-2xl font-serif text-[#F8F5F0] leading-relaxed italic">
            "{finalMessageText || "Thank you for making my world brighter every day. Happy Birthday ❤️"}"
          </p>

          <p className="text-base sm:text-lg font-serif text-[#D9A6B2] italic pt-4 border-t border-[#101528]">
            Always yours. ❤️
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          {onReplay && (
            <button
              onClick={onReplay}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#101528] text-[#B8B6C4] hover:text-[#F8F5F0] border border-[#D9A6B2]/20 text-xs font-sans tracking-widest uppercase transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-[#D8B477]" />
              <span>Read Everything Again</span>
            </button>
          )}

          <button
            onClick={() => navigate('/our-universe')}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#151B30] text-[#F8F5F0] border border-[#D8B477]/40 hover:border-[#D8B477] text-xs font-sans tracking-widest uppercase transition-all cursor-pointer shadow-md"
          >
            <Compass className="w-4 h-4 text-[#D8B477]" />
            <span>Explore Her World</span>
          </button>

          <button
            onClick={() => navigate('/secret')}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#D9A6B2] text-[#080B16] font-semibold text-xs font-sans tracking-widest uppercase hover:bg-[#F8F5F0] transition-all cursor-pointer shadow-[0_0_20px_rgba(217,166,178,0.3)]"
          >
            <Lock className="w-4 h-4" />
            <span>Open Secret Space 🔐</span>
          </button>
        </motion.div>

        <span className="text-xs text-[#B8B6C4]/40 font-serif italic pt-4 block">
          Made with love for {siteConfig.herName}.
        </span>
      </div>
    </section>
  );
};
