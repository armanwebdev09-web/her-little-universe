import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Heart, Calendar } from 'lucide-react';

export const TimelineCard = ({ item, isEven }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative my-12 sm:my-16 w-full flex flex-col md:flex-row items-center justify-center">
      {/* Central Timeline Spine Node (Desktop & Mobile) */}
      <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 z-20 flex items-center justify-center">
        <div className="w-9 h-9 rounded-full bg-[#080B16] border-2 border-[#D9A6B2] flex items-center justify-center shadow-[0_0_15px_rgba(217,166,178,0.5)] group">
          <span className="text-[10px] font-mono font-bold text-[#D8B477]">
            {item.number}
          </span>
        </div>
      </div>

      {/* Card Wrapper (Responsive Grid/Flex alignment) */}
      <div className={`w-full flex ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center`}>
        {/* Content Box (Occupies half width on desktop, full width offset on mobile) */}
        <div className="w-full md:w-1/2 pl-16 pr-4 md:px-10">
          <motion.div
            initial={{ opacity: 0, x: isEven ? 40 : -40, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="group relative rounded-3xl bg-[#151B30]/80 border border-[#D9A6B2]/15 backdrop-blur-xl p-6 sm:p-8 glow-card-hover overflow-hidden"
          >
            {/* Subtle Gradient Glow inside Card */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D9A6B2]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#D9A6B2]/15 transition-all duration-500" />

            {/* Header Meta: Category & Date */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase font-sans font-semibold bg-[#101528] text-[#D8B477] border border-[#D8B477]/20">
                {item.category}
              </span>
              <div className="flex items-center space-x-1.5 text-xs text-[#B8B6C4] font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#D9A6B2]" />
                <span>{item.date}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-serif font-normal text-[#F8F5F0] mb-3 group-hover:text-[#D9A6B2] transition-colors duration-300">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-[#B8B6C4] font-light leading-relaxed mb-6">
              {item.description}
            </p>

            {/* Image Box or Elegant Fallback Placeholder */}
            <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-[#101528] border border-[#D9A6B2]/15 flex items-center justify-center">
              {item.image && !imageError ? (
                <img
                  src={item.image}
                  alt={item.title}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#101528] to-[#151B30] group-hover:from-[#151B30] group-hover:to-[#101528] transition-colors duration-500">
                  <div className="w-12 h-12 rounded-full bg-[#080B16] border border-[#D9A6B2]/20 flex items-center justify-center mb-3 text-[#D9A6B2] shadow-inner">
                    <Heart className="w-5 h-5 fill-[#D9A6B2]/20" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] font-sans text-[#D8B477] font-medium mb-1">
                    MEMORY SNAPSHOT
                  </span>
                  <p className="text-xs text-[#B8B6C4]/80 italic font-serif">
                    "Your memory will live here."
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Empty Half on Desktop to keep spacing balanced */}
        <div className="hidden md:block md:w-1/2" />
      </div>
    </div>
  );
};
