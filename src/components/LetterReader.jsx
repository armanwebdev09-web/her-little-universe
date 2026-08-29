import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Heart, Sparkles, Music, Image as ImageIcon, Flower2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LetterReader = ({ selectedLetter, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedLetter) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLetter, onClose]);

  if (!selectedLetter) return null;

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

        {/* Parchment/Paper Letter Reader Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 25 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#151B30] via-[#101528] to-[#151B30] border-2 border-[#D9A6B2]/30 p-8 sm:p-12 shadow-[0_0_60px_rgba(217,166,178,0.25)] text-left z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-[#B8B6C4] hover:text-[#F8F5F0] hover:bg-[#101528] transition-colors focus:outline-none cursor-pointer"
            aria-label="Close letter"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Letter Top Header */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#D9A6B2]/20">
            <div className="flex items-center space-x-2 text-[#D8B477]">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-widest font-semibold">
                {selectedLetter.type || selectedLetter.category || 'LOVE LETTER'}
              </span>
            </div>

            {selectedLetter.date && (
              <div className="flex items-center space-x-1.5 text-xs text-[#B8B6C4] font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#D9A6B2]" />
                <span>{selectedLetter.date}</span>
              </div>
            )}
          </div>

          {/* Letter Title */}
          <h2 className="text-3xl sm:text-4xl font-serif text-[#F8F5F0] font-normal leading-tight mb-6 text-center sm:text-left">
            {selectedLetter.title}
          </h2>

          {/* Opening Salutation */}
          {selectedLetter.openingLine && (
            <p className="text-lg font-serif text-[#D9A6B2] italic mb-4">
              {selectedLetter.openingLine}
            </p>
          )}

          {/* Letter Body Paragraphs */}
          <div className="space-y-6 text-base sm:text-lg text-[#F8F5F0]/90 font-serif font-light leading-relaxed tracking-wide whitespace-pre-line border-l-2 border-[#D9A6B2]/20 pl-4 sm:pl-6 my-6 italic">
            {selectedLetter.content}
          </div>

          {/* Closing Sign-off */}
          <div className="pt-6 mt-6 border-t border-[#D9A6B2]/15 text-right font-serif">
            <p className="text-base sm:text-lg italic text-[#D9A6B2]">
              {selectedLetter.closing || selectedLetter.signOff || "Always yours,"}
            </p>
            <p className="text-lg sm:text-xl text-[#F8F5F0] font-semibold mt-1 flex items-center justify-end space-x-1.5">
              <Heart className="w-4 h-4 fill-[#D9A6B2] text-[#D9A6B2] inline-block mr-1" />
              <span>{selectedLetter.signature || selectedLetter.senderName || "Me"}</span>
            </p>
          </div>

          {/* Attachment Action Triggers */}
          {(selectedLetter.songId || selectedLetter.memoryId || selectedLetter.littleThingId) && (
            <div className="mt-8 pt-6 border-t border-[#101528] flex flex-wrap items-center justify-center gap-3">
              {selectedLetter.songId && (
                <button
                  onClick={() => { onClose(); navigate('/songs'); }}
                  className="px-4 py-2 rounded-full bg-[#101528] text-[#D8B477] border border-[#D8B477]/30 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Play Attached Song</span>
                </button>
              )}
              {selectedLetter.memoryId && (
                <button
                  onClick={() => { onClose(); navigate('/memories'); }}
                  className="px-4 py-2 rounded-full bg-[#101528] text-[#D9A6B2] border border-[#D9A6B2]/30 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>See Memory Behind This</span>
                </button>
              )}
              {selectedLetter.littleThingId && (
                <button
                  onClick={() => { onClose(); navigate('/little-things'); }}
                  className="px-4 py-2 rounded-full bg-[#101528] text-[#F8F5F0] border border-[#F8F5F0]/30 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer"
                >
                  <Flower2 className="w-3.5 h-3.5 text-[#D9A6B2]" />
                  <span>See Little Thing I Love</span>
                </button>
              )}
            </div>
          )}

          {/* Bottom Action */}
          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-[#101528] text-[#F8F5F0] border border-[#D9A6B2]/30 text-xs font-sans tracking-widest uppercase hover:bg-[#D9A6B2] hover:text-[#080B16] transition-colors cursor-pointer"
            >
              Keep Close to Heart
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
