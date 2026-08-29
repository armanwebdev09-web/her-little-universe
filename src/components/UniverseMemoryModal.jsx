import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, Sparkles, Eye, Heart } from 'lucide-react';

export const UniverseMemoryModal = ({
  selectedStar,
  starsList,
  onClose,
  onNavigate,
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [selectedStar]);

  useEffect(() => {
    if (!selectedStar) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && !selectedStar.isEasterEgg) {
        handlePrev();
      } else if (e.key === 'ArrowRight' && !selectedStar.isEasterEgg) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStar, starsList]);

  if (!selectedStar) return null;

  const isEasterEgg = selectedStar.isEasterEgg;
  const currentIndex = starsList.findIndex((s) => s.id === selectedStar.id);

  const handlePrev = () => {
    if (starsList.length === 0) return;
    const prevIndex = (currentIndex - 1 + starsList.length) % starsList.length;
    onNavigate(starsList[prevIndex]);
  };

  const handleNext = () => {
    if (starsList.length === 0) return;
    const nextIndex = (currentIndex + 1) % starsList.length;
    onNavigate(starsList[nextIndex]);
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
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 25 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl rounded-3xl bg-[#151B30] border border-[#D9A6B2]/30 p-6 sm:p-10 shadow-[0_0_60px_rgba(217,166,178,0.25)] text-left z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-[#B8B6C4] hover:text-[#F8F5F0] hover:bg-[#101528] transition-colors focus:outline-none cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal Header Meta */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#101528]">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase font-sans font-semibold bg-[#101528] text-[#D8B477] border border-[#D8B477]/20">
                {selectedStar.category || 'MEMORY STAR'}
              </span>
              {selectedStar.isTodayStar && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase font-sans font-semibold bg-[#D9A6B2] text-[#080B16]">
                  TODAY
                </span>
              )}
            </div>

            {selectedStar.date && (
              <div className="flex items-center space-x-1.5 text-xs text-[#B8B6C4] font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#D9A6B2]" />
                <span>{selectedStar.date}</span>
              </div>
            )}
          </div>

          {/* Secret Easter Egg Mode */}
          {isEasterEgg ? (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#101528] border border-[#D9A6B2]/30 flex items-center justify-center text-[#D9A6B2] mb-4 text-2xl animate-bounce">
                👀
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif text-[#F8F5F0] font-normal mb-3">
                Well... you weren't supposed to find this so quickly. 👀
              </h2>
              <p className="text-sm sm:text-base text-[#B8B6C4] font-light max-w-md mb-8">
                You've discovered a hidden corner of our universe. More secrets are waiting ahead!
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-full bg-[#D9A6B2] text-[#080B16] font-medium text-xs tracking-widest uppercase hover:bg-[#F8F5F0] transition-colors cursor-pointer shadow-md"
              >
                Go back
              </button>
            </div>
          ) : (
            /* Normal Memory Star Content */
            <div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-4">
                {/* Image Container */}
                <div className="md:col-span-7 relative h-56 sm:h-72 rounded-2xl overflow-hidden bg-[#101528] border border-[#D9A6B2]/15 flex items-center justify-center">
                  {selectedStar.image && !imageError ? (
                    <img
                      src={selectedStar.image}
                      alt={selectedStar.title}
                      onError={() => setImageError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#101528] to-[#151B30]">
                      <div className="w-12 h-12 rounded-full bg-[#080B16] border border-[#D9A6B2]/20 flex items-center justify-center mb-3 text-[#D9A6B2]">
                        <Heart className="w-5 h-5 fill-[#D9A6B2]/20" />
                      </div>
                      <span className="text-xs uppercase tracking-[0.2em] font-sans text-[#D8B477] font-medium mb-1">
                        MEMORY SNAPSHOT
                      </span>
                      <p className="text-xs text-[#B8B6C4] italic font-serif">
                        "Your memory will live here."
                      </p>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="md:col-span-5 flex flex-col justify-between space-y-3">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-serif text-[#F8F5F0] font-normal leading-snug mb-3">
                      {selectedStar.title}
                    </h2>
                    <p className="text-sm text-[#B8B6C4] font-light leading-relaxed">
                      {selectedStar.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center space-x-1.5 text-xs text-[#D8B477] font-mono">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Discovered in our stars</span>
                  </div>
                </div>
              </div>

              {/* Navigation Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-[#101528] mt-6">
                <button
                  onClick={handlePrev}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#101528] text-[#B8B6C4] hover:text-[#F8F5F0] border border-[#D9A6B2]/15 text-xs font-sans tracking-widest uppercase transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-[#D9A6B2]" />
                  <span>PREVIOUS MEMORY</span>
                </button>

                <span className="text-xs font-mono text-[#B8B6C4]/60">
                  {currentIndex + 1} / {starsList.length}
                </span>

                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#101528] text-[#B8B6C4] hover:text-[#F8F5F0] border border-[#D9A6B2]/15 text-xs font-sans tracking-widest uppercase transition-colors cursor-pointer"
                >
                  <span>NEXT MEMORY</span>
                  <ChevronRight className="w-4 h-4 text-[#D9A6B2]" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
