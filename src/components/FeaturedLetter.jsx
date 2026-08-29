import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Sparkles, BookOpen } from 'lucide-react';
import { featuredLetterData } from '../data/lettersData';

export const FeaturedLetter = ({ onOpenLetter }) => {
  const item = featuredLetterData;

  return (
    <section className="relative pb-12 px-6 z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          onClick={() => onOpenLetter(item)}
          className="group relative rounded-3xl bg-[#151B30]/90 border-2 border-[#D9A6B2]/30 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_0_50px_rgba(217,166,178,0.18)] hover:border-[#D9A6B2]/60 hover:shadow-[0_0_60px_rgba(217,166,178,0.28)] transition-all duration-500 cursor-pointer overflow-hidden"
        >
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9A6B2]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#D9A6B2]/20 transition-all duration-500" />

          {/* Top Tag & Date */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#101528]">
            <div className="flex items-center space-x-2 text-[#D8B477]">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-mono tracking-widest uppercase font-semibold">
                TODAY'S LETTER
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-[#B8B6C4] font-mono">
              <Calendar className="w-3.5 h-3.5 text-[#D9A6B2]" />
              <span>{item.date}</span>
            </div>
          </div>

          {/* Content Preview */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start space-x-5 flex-1">
              {/* Envelope Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-[#101528] border border-[#D9A6B2]/30 flex items-center justify-center text-[#D9A6B2] shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Mail className="w-7 h-7" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-4xl font-serif text-[#F8F5F0] font-normal mb-2 group-hover:text-[#D9A6B2] transition-colors duration-300">
                  {item.title}
                </h2>
                <p className="text-sm sm:text-base text-[#B8B6C4] font-light italic font-serif leading-relaxed line-clamp-2">
                  "{item.preview}"
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenLetter(item);
              }}
              className="flex items-center space-x-2 px-7 py-3.5 rounded-full bg-[#D9A6B2] text-[#080B16] font-medium text-xs tracking-widest uppercase hover:bg-[#F8F5F0] hover:shadow-[0_0_25px_rgba(217,166,178,0.5)] transition-all duration-300 transform active:scale-95 cursor-pointer flex-shrink-0"
            >
              <BookOpen className="w-4 h-4" />
              <span>OPEN LETTER</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
