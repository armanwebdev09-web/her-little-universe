import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

export const StoryEnding = ({ onSeeMemoriesClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onSeeMemoriesClick) {
      onSeeMemoriesClick();
    } else {
      navigate('/memories');
    }
  };

  return (
    <section className="relative py-24 px-6 z-10 text-center">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {/* Animated Arrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-[#D9A6B2]"
        >
          <ChevronDown className="w-8 h-8 animate-bounce mx-auto" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal text-[#F8F5F0] mb-4"
        >
          And this is only the <span className="italic font-light text-[#D9A6B2]">beginning.</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-xl text-[#B8B6C4] font-light max-w-lg mb-10 leading-relaxed"
        >
          There are still so many moments left to write.
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button
            onClick={handleClick}
            className="group relative inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-[#151B30] text-[#F8F5F0] border border-[#D9A6B2]/30 hover:border-[#D9A6B2] hover:bg-[#D9A6B2]/15 transition-all duration-500 shadow-[0_0_25px_rgba(217,166,178,0.15)] hover:shadow-[0_0_35px_rgba(217,166,178,0.3)] hover:-translate-y-0.5 cursor-pointer"
          >
            <span className="text-sm uppercase tracking-[0.2em] font-medium">See Our Memories</span>
            <ArrowRight className="w-4 h-4 text-[#D9A6B2] group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
