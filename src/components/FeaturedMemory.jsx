import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Heart, Bookmark } from 'lucide-react';
import { featuredMemory } from '../data/storyData';

export const FeaturedMemory = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative py-20 px-6 z-10">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold block mb-2">
            FEATURED CHAPTER
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F8F5F0] font-normal">
            One moment I'll always keep.
          </h2>
        </motion.div>

        {/* Large Prominent Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative rounded-3xl bg-[#151B30]/90 border-2 border-[#D9A6B2]/30 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_0_50px_rgba(217,166,178,0.18)] hover:border-[#D9A6B2]/50 transition-all duration-500 overflow-hidden"
        >
          {/* Top Decorative Banner */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#101528]">
            <div className="flex items-center space-x-2 text-[#D8B477]">
              <Bookmark className="w-4 h-4 fill-[#D8B477]" />
              <span className="text-xs font-mono tracking-widest uppercase font-semibold">
                TREASURED MEMORY
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-[#B8B6C4] font-mono">
              <Calendar className="w-3.5 h-3.5 text-[#D9A6B2]" />
              <span>{featuredMemory.date}</span>
            </div>
          </div>

          {/* Card Body */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Large Image Placeholder / Image Container */}
            <div className="md:col-span-7 relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-[#101528] border border-[#D9A6B2]/20 shadow-xl group">
              {featuredMemory.image && !imageError ? (
                <img
                  src={featuredMemory.image}
                  alt={featuredMemory.title}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#101528] to-[#151B30]">
                  <Sparkles className="w-8 h-8 text-[#D9A6B2] mb-3 animate-pulse" />
                  <span className="text-xs uppercase tracking-[0.2em] font-sans text-[#D8B477] font-medium mb-1">
                    FEATURED SNAPSHOT
                  </span>
                  <p className="text-sm text-[#B8B6C4] italic font-serif">
                    "Your memory will live here."
                  </p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B16]/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Content Details */}
            <div className="md:col-span-5 flex flex-col justify-center space-y-4">
              <h3 className="text-2xl sm:text-3xl font-serif text-[#F8F5F0] font-normal leading-snug">
                {featuredMemory.title}
              </h3>
              <p className="text-sm sm:text-base text-[#B8B6C4] font-light leading-relaxed">
                {featuredMemory.description}
              </p>

              <div className="pt-2 flex items-center space-x-2 text-xs text-[#D9A6B2] italic font-serif">
                <Heart className="w-4 h-4 fill-[#D9A6B2]" />
                <span>Etched in our stars forever</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
