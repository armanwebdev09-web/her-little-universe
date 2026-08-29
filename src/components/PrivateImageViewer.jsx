import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, Lock } from 'lucide-react';

export const PrivateImageViewer = ({
  selectedPhoto,
  photosList,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    if (!selectedPhoto) return;

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
  }, [selectedPhoto, photosList]);

  if (!selectedPhoto) return null;

  const currentIndex = photosList.findIndex((p) => p.id === selectedPhoto.id);

  const handlePrev = () => {
    if (photosList.length === 0) return;
    const prevIndex = (currentIndex - 1 + photosList.length) % photosList.length;
    onNavigate(photosList[prevIndex]);
  };

  const handleNext = () => {
    if (photosList.length === 0) return;
    const nextIndex = (currentIndex + 1) % photosList.length;
    onNavigate(photosList[nextIndex]);
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
          className="fixed inset-0 bg-[#080B16]/95 backdrop-blur-2xl"
        />

        {/* Lightbox Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl rounded-3xl bg-[#151B30] border border-[#D9A6B2]/30 p-6 sm:p-8 shadow-[0_0_60px_rgba(217,166,178,0.25)] text-left z-10 max-h-[90vh] flex flex-col justify-between overflow-y-auto"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#101528]">
            <div className="flex items-center space-x-2 text-[#D8B477]">
              <Lock className="w-4 h-4" />
              <span className="text-[10px] tracking-[0.2em] font-sans uppercase font-semibold">
                PRIVATE SNAPSHOT
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#B8B6C4] hover:text-[#F8F5F0] hover:bg-[#101528] transition-colors cursor-pointer"
              aria-label="Close photo preview"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Photo & Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-2">
            <div className="md:col-span-8 relative h-64 sm:h-80 md:h-[420px] rounded-2xl overflow-hidden bg-[#101528] border border-[#D9A6B2]/15">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-4 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-xs text-[#B8B6C4] font-mono mb-2">
                  <Calendar className="w-4 h-4 text-[#D9A6B2]" />
                  <span>{selectedPhoto.date}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif text-[#F8F5F0] font-normal leading-snug mb-3">
                  {selectedPhoto.title}
                </h2>

                <p className="text-sm text-[#B8B6C4] font-light leading-relaxed italic font-serif">
                  "{selectedPhoto.caption}"
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#101528] mt-4">
            <button
              onClick={handlePrev}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#101528] text-[#B8B6C4] hover:text-[#F8F5F0] hover:bg-[#151B30] border border-[#D9A6B2]/15 text-xs font-sans tracking-widest uppercase transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-[#D9A6B2]" />
              <span>PREVIOUS</span>
            </button>

            <span className="text-xs font-mono text-[#B8B6C4]/60">
              {currentIndex + 1} / {photosList.length}
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
