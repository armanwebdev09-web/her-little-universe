import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star, Heart } from 'lucide-react';

export const MemoryCard = ({ item, onClick }) => {
  const [imageError, setImageError] = useState(false);

  // Determine height based on aspect ratio for organic grid feel
  const getAspectClass = (ratio) => {
    switch (ratio) {
      case 'portrait':
        return 'h-80 sm:h-96';
      case 'landscape':
        return 'h-52 sm:h-60';
      case 'square':
      default:
        return 'h-64 sm:h-72';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      onClick={() => onClick(item)}
      className="group relative rounded-3xl bg-[#151B30]/80 border border-[#D9A6B2]/15 backdrop-blur-xl p-5 flex flex-col justify-between glow-card-hover cursor-pointer overflow-hidden"
    >
      {/* Image Container */}
      <div className={`relative w-full ${getAspectClass(item.aspectRatio)} rounded-2xl overflow-hidden bg-[#101528] border border-[#D9A6B2]/10 mb-4`}>
        {item.image && !imageError ? (
          <img
            src={item.image}
            alt={item.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#101528] to-[#151B30]">
            <div className="w-10 h-10 rounded-full bg-[#080B16] border border-[#D9A6B2]/20 flex items-center justify-center mb-2 text-[#D9A6B2]">
              <Heart className="w-4 h-4 fill-[#D9A6B2]/20" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#D8B477] font-medium mb-1">
              SNAPSHOT
            </span>
            <p className="text-xs text-[#B8B6C4]/80 italic font-serif">
              "Your memory will live here."
            </p>
          </div>
        )}

        {/* Favorite Badge */}
        {item.favorite && (
          <div className="absolute top-3 right-3 p-1.5 rounded-full bg-[#080B16]/80 backdrop-blur-md border border-[#D8B477]/30 text-[#D8B477] shadow-md">
            <Star className="w-3.5 h-3.5 fill-[#D8B477]" />
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-[#080B16]/80 backdrop-blur-md border border-[#D9A6B2]/20 text-[9px] tracking-[0.2em] font-sans uppercase text-[#D9A6B2] font-semibold">
          {item.category}
        </div>
      </div>

      {/* Card Content Details */}
      <div>
        <div className="flex items-center space-x-1.5 text-xs text-[#B8B6C4]/80 font-mono mb-1">
          <Calendar className="w-3 h-3 text-[#D9A6B2]" />
          <span>{item.date}</span>
        </div>

        <h3 className="text-lg font-serif font-normal text-[#F8F5F0] group-hover:text-[#D9A6B2] transition-colors duration-300 line-clamp-1">
          {item.title}
        </h3>

        <p className="text-xs text-[#B8B6C4] font-light line-clamp-2 mt-1">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
};
