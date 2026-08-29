import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star, Sparkles, Heart } from 'lucide-react';
import { featuredMemoryData } from '../data/memoriesData';

export const FeaturedMemoryCard = ({ onSelectMemory }) => {
  const [imageError, setImageError] = useState(false);
  const item = featuredMemoryData;

  return (
    <section className="relative pb-12 px-6 z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          onClick={() => onSelectMemory(item)}
          className="group relative rounded-3xl bg-[#151B30]/80 border border-[#D9A6B2]/25 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(217,166,178,0.15)] hover:shadow-[0_0_55px_rgba(217,166,178,0.25)] hover:border-[#D9A6B2]/50 transition-all duration-500 cursor-pointer overflow-hidden"
        >
          {/* Top Tag & Favorite Star */}
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#101528] text-[#D8B477] border border-[#D8B477]/20 text-[10px] tracking-[0.2em] font-semibold uppercase">
              <Sparkles className="w-3 h-3" />
              <span>FEATURED MEMORY</span>
            </div>
            {item.favorite && (
              <div className="flex items-center space-x-1.5 text-xs text-[#D8B477] bg-[#101528]/80 px-3 py-1 rounded-full border border-[#D8B477]/20">
                <Star className="w-3.5 h-3.5 fill-[#D8B477]" />
                <span className="font-mono text-[10px] tracking-wider uppercase">FAVORITE</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Image Container */}
            <div className="lg:col-span-7 relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-[#101528] border border-[#D9A6B2]/20">
              {item.image && !imageError ? (
                <img
                  src={item.image}
                  alt={item.title}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#101528] to-[#151B30]">
                  <Heart className="w-8 h-8 text-[#D9A6B2] mb-3 fill-[#D9A6B2]/20" />
                  <span className="text-xs uppercase tracking-[0.2em] text-[#D8B477] font-medium mb-1">
                    FEATURED SNAPSHOT
                  </span>
                  <p className="text-sm text-[#B8B6C4] italic font-serif">
                    "Your memory will live here."
                  </p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B16]/50 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Text Details */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
              <div className="flex items-center space-x-2 text-xs text-[#B8B6C4] font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#D9A6B2]" />
                <span>{item.date}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#F8F5F0] group-hover:text-[#D9A6B2] transition-colors duration-300">
                {item.title}
              </h2>

              <p className="text-sm sm:text-base text-[#B8B6C4] font-light leading-relaxed">
                {item.description}
              </p>

              <div className="pt-2 flex items-center space-x-2 text-xs font-semibold tracking-widest text-[#D9A6B2] uppercase group-hover:translate-x-1 transition-transform duration-300">
                <span>View Full Memory</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
