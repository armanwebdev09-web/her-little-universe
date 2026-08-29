import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, Star, Heart } from 'lucide-react';

export const MemoryModal = ({
  selectedMemory,
  memoriesList,
  onClose,
  onNavigate,
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [selectedMemory]);

  useEffect(() => {
    if (!selectedMemory) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMemory, memoriesList]);

  if (!selectedMemory) return null;

  const currentIndex = memoriesList.findIndex((m) => m.id === selectedMemory.id);

  const handlePrev = () => {
    if (memoriesList.length === 0) return;
    const prevIndex = (currentIndex - 1 + memoriesList.length) % memoriesList.length;
    onNavigate(memoriesList[prevIndex]);
  };

  const handleNext = () => {
    if (memoriesList.length === 0) return;
    const nextIndex = (currentIndex + 1) % memoriesList.length;
    onNavigate(memoriesList[nextIndex]);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#080B16]/90 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl rounded-3xl bg-[#151B30] border border-[#D9A6B2]/30 p-6 sm:p-8 shadow-[0_0_60px_rgba(217,166,178,0.25)] text-left z-10 max-h-[90vh] flex flex-col justify-between overflow-y-auto"
        >
          {/* Top Bar with Category, Favorite, Close */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#101528]">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase font-sans font-semibold bg-[#101528] text-[#D8B477] border border-[#D8B477]/20">
                {selectedMemory.category}
              </span>
              {selectedMemory.favorite && (
                <div className="flex items-center space-x-1 text-xs text-[#D8B477]">
                  <Star className="w-3.5 h-3.5 fill-[#D8B477]" />
                  <span className="font-mono text-[10px] tracking-widest uppercase">FAVORITE</span>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#B8B6C4] hover:text-[#F8F5F0] hover:bg-[#101528] transition-colors focus:outline-none cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-2">
            {/* Large Image Preview Container */}
            <div className="md:col-span-7 relative h-64 sm:h-80 md:h-[400px] rounded-2xl overflow-hidden bg-[#101528] border border-[#D9A6B2]/15 flex items-center justify-center">
              {selectedMemory.image && !imageError ? (
                <img
                  src={selectedMemory.image}
                  alt={selectedMemory.title}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#101528] to-[#151B30]">
                  <div className="w-14 h-14 rounded-full bg-[#080B16] border border-[#D9A6B2]/20 flex items-center justify-center mb-3 text-[#D9A6B2]">
                    <Heart className="w-6 h-6 fill-[#D9A6B2]/20" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] font-sans text-[#D8B477] font-medium mb-1">
                    MEMORY SNAPSHOT
                  </span>
                  <p className="text-sm text-[#B8B6C4] italic font-serif">
                    "Your memory will live here."
                  </p>
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-xs text-[#B8B6C4] font-mono mb-2">
                  <Calendar className="w-4 h-4 text-[#D9A6B2]" />
                  <span>{selectedMemory.date}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif text-[#F8F5F0] font-normal leading-snug mb-3">
                  {selectedMemory.title}
                </h2>

                <p className="text-sm sm:text-base text-[#B8B6C4] font-light leading-relaxed">
                  {selectedMemory.fullDescription || selectedMemory.description}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Controls Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-[#101528] mt-4">
            <button
              onClick={handlePrev}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#101528] text-[#B8B6C4] hover:text-[#F8F5F0] hover:bg-[#151B30] border border-[#D9A6B2]/15 text-xs font-sans tracking-widest uppercase transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-[#D9A6B2]" />
              <span>PREVIOUS</span>
            </button>

            <span className="text-xs font-mono text-[#B8B6C4]/60">
              {currentIndex + 1} / {memoriesList.length}
            </span>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#101528] text-[#B8B6C4] hover:text-[#F8F5F0] hover:bg-[#151B30] border border-[#D9A6B2]/15 text-xs font-sans tracking-widest uppercase transition-colors cursor-pointer"
            >
              <span>NEXT</span>
              <ChevronRight className="w-4 h-4 text-[#D9A6B2]" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
