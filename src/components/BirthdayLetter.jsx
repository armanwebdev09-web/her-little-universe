import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Heart, BookOpen } from 'lucide-react';
import { birthdayData } from '../data/birthdayData';
import { LetterReader } from './LetterReader';

export const BirthdayLetter = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const letter = birthdayData.birthdayLetter;

  return (
    <section className="relative py-12 px-6 z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          onClick={() => setSelectedLetter(letter)}
          className="group relative rounded-3xl bg-[#151B30]/90 border-2 border-[#D9A6B2]/30 backdrop-blur-2xl p-8 sm:p-12 shadow-[0_0_50px_rgba(217,166,178,0.2)] hover:border-[#D9A6B2]/60 hover:shadow-[0_0_60px_rgba(217,166,178,0.3)] transition-all duration-500 cursor-pointer text-center flex flex-col items-center"
        >
          {/* Closed Envelope Visual */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#101528] border border-[#D9A6B2]/30 flex items-center justify-center text-[#D9A6B2] shadow-inner mb-6 group-hover:scale-105 transition-transform">
            <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-[#D8B477]" />
          </div>

          <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold block mb-2">
            A LETTER FOR YOU
          </span>

          <h2 className="text-3xl sm:text-5xl font-serif text-[#F8F5F0] font-normal mb-3">
            {letter.title}
          </h2>

          <p className="text-sm sm:text-base text-[#B8B6C4] font-light italic font-serif leading-relaxed max-w-lg mb-8">
            "{letter.preview}"
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLetter(letter);
            }}
            className="flex items-center space-x-2 px-8 py-4 rounded-full bg-[#D9A6B2] text-[#080B16] font-medium text-xs tracking-widest uppercase hover:bg-[#F8F5F0] shadow-[0_0_25px_rgba(217,166,178,0.5)] transition-all duration-300 transform active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Your Birthday Letter</span>
          </button>
        </motion.div>
      </div>

      <LetterReader
        selectedLetter={selectedLetter}
        onClose={() => setSelectedLetter(null)}
      />
    </section>
  );
};
