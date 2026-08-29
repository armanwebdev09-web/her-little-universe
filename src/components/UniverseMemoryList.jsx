import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Star, Eye } from 'lucide-react';

export const UniverseMemoryList = ({
  stars,
  discoveredIds,
  onSelectStar,
}) => {
  return (
    <section className="relative py-12 px-6 z-10 max-w-5xl mx-auto">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold block mb-2">
          ACCESSIBLE LIST
        </span>
        <h2 className="text-2xl sm:text-4xl font-serif text-[#F8F5F0] font-normal mb-2">
          Explore memories
        </h2>
        <p className="text-sm text-[#B8B6C4] font-light">
          A list view of all stars currently shining in our sky.
        </p>
      </motion.div>

      {/* Grid of memory list items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stars.map((star) => {
          const isDiscovered = discoveredIds.includes(star.id);

          return (
            <div
              key={star.id}
              onClick={() => onSelectStar(star)}
              className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isDiscovered
                  ? 'bg-[#151B30] border-[#D9A6B2]/30 shadow-md'
                  : 'bg-[#101528]/70 border-[#151B30] hover:border-[#D9A6B2]/30 hover:bg-[#151B30]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-sans font-semibold tracking-widest uppercase text-[#D8B477] px-2 py-0.5 rounded-full bg-[#101528] border border-[#D8B477]/20">
                    {star.category}
                  </span>
                  {isDiscovered && (
                    <span className="text-[9px] font-mono text-[#D9A6B2] flex items-center space-x-1">
                      <Eye className="w-3 h-3 inline" />
                      <span>DISCOVERED</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-serif text-[#F8F5F0] font-normal mb-1">
                  {star.title}
                </h3>
                <p className="text-xs text-[#B8B6C4] font-light line-clamp-2">
                  {star.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#101528] flex items-center justify-between text-[11px] font-mono text-[#B8B6C4]/70">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-[#D9A6B2]" />
                  <span>{star.date}</span>
                </span>
                <span className="text-[#D9A6B2] font-sans uppercase tracking-widest text-[9px] font-semibold">
                  Tap Star →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
