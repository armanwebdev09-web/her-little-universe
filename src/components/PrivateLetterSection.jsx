import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, ArrowRight, Lock } from 'lucide-react';
import { secretLettersData } from '../data/secretLettersData';
import { LetterReader } from './LetterReader';

export const PrivateLetterSection = () => {
  const [selectedLetter, setSelectedLetter] = useState(null);

  return (
    <section className="relative py-8 z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {secretLettersData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => setSelectedLetter(item)}
            className="group relative rounded-3xl bg-[#101528] border border-[#D9A6B2]/20 p-6 flex flex-col justify-between hover:border-[#D9A6B2]/50 hover:bg-[#151B30] transition-all duration-500 cursor-pointer shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#151B30]">
                <div className="flex items-center space-x-2 text-[#D8B477]">
                  <Lock className="w-3.5 h-3.5" />
                  <span className="text-[10px] tracking-[0.2em] font-sans font-semibold uppercase">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-[#B8B6C4] font-mono">
                  <Calendar className="w-3.5 h-3.5 text-[#D9A6B2]" />
                  <span>{item.date}</span>
                </div>
              </div>

              <h3 className="text-2xl font-serif text-[#F8F5F0] font-normal mb-2 group-hover:text-[#D9A6B2] transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-[#B8B6C4] font-light italic font-serif leading-relaxed line-clamp-2">
                "{item.preview}"
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-[#151B30] flex items-center justify-between text-xs text-[#D9A6B2] uppercase tracking-widest font-semibold group-hover:translate-x-1 transition-transform">
              <span>Read Private Letter</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        ))}
      </div>

      <LetterReader
        selectedLetter={selectedLetter}
        onClose={() => setSelectedLetter(null)}
      />
    </section>
  );
};
