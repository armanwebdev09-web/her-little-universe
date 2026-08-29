import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';

export const Hero = () => {
  const navigate = useNavigate();

  const handleEnterStory = () => {
    navigate('/our-story');
  };

  const handleScrollToNext = () => {
    const nextSection = document.querySelector('#birthday');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24 pb-16 z-10 overflow-hidden">
      {/* Background Soft Glow Center */}
      <div 
        className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full pointer-events-none opacity-20 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(217, 166, 178, 0.4) 0%, rgba(216, 180, 119, 0.15) 50%, rgba(8, 11, 22, 0) 70%)'
        }}
      />

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Her Name Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#151B30]/80 border border-[#D9A6B2]/20 backdrop-blur-md mb-8 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D9A6B2] animate-pulse" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#D9A6B2] font-medium">
            FOR {siteConfig.herName}
          </span>
        </motion.div>

        {/* Small Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
          className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#D8B477] font-medium mb-4 max-w-xl"
        >
          FOR THE GIRL WHO MAKES ORDINARY DAYS SPECIAL
        </motion.p>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.4, ease: 'easeOut' }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-normal text-[#F8F5F0] tracking-tight leading-[1.1] mb-6 drop-shadow-sm"
        >
          Welcome to your <br className="hidden sm:inline" />
          <span className="italic font-light text-[#D9A6B2]">little universe.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
          className="text-base sm:text-xl text-[#B8B6C4] font-light max-w-2xl leading-relaxed mb-10"
        >
          This little corner of the internet belongs to you.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
        >
          <button
            onClick={handleEnterStory}
            className="group relative inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-[#151B30] text-[#F8F5F0] border border-[#D9A6B2]/30 hover:border-[#D9A6B2] hover:bg-[#D9A6B2]/15 transition-all duration-500 shadow-[0_0_25px_rgba(217,166,178,0.12)] hover:shadow-[0_0_35px_rgba(217,166,178,0.3)] hover:-translate-y-0.5 cursor-pointer"
          >
            <span className="text-sm uppercase tracking-[0.2em] font-medium">Enter Our Story</span>
            <span className="text-[#D9A6B2] group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </motion.div>
      </div>

      {/* Subtle Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
        onClick={handleScrollToNext}
      >
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#B8B6C4]">Scroll</span>
        <ChevronDown className="w-4 h-4 text-[#D9A6B2] animate-bounce" />
      </motion.div>
    </section>
  );
};
