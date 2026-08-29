import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronUp, Music } from 'lucide-react';

export const MiniPlayer = ({
  currentSong,
  isPlaying,
  onTogglePlay,
  onScrollToPlayer,
  visible,
}) => {
  if (!visible || !currentSong) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 sm:w-96 z-40"
      >
        <div className="p-3 rounded-2xl bg-[#151B30]/95 backdrop-blur-xl border border-[#D9A6B2]/30 shadow-[0_0_35px_rgba(217,166,178,0.25)] flex items-center justify-between gap-3">
          {/* Left Thumbnail & Info (Clicking scrolls to main player) */}
          <div
            onClick={onScrollToPlayer}
            className="flex items-center space-x-3 flex-1 cursor-pointer overflow-hidden group"
          >
            <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-[#101528] border border-[#D9A6B2]/20 flex-shrink-0">
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-[#080B16]/50 flex items-center justify-center">
                  <Music className="w-4 h-4 text-[#D9A6B2] animate-bounce" />
                </div>
              )}
            </div>

            <div className="overflow-hidden">
              <h4 className="text-xs font-serif font-semibold text-[#F8F5F0] truncate group-hover:text-[#D9A6B2] transition-colors">
                {currentSong.title}
              </h4>
              <p className="text-[10px] text-[#B8B6C4] font-light truncate">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* Controls: Play/Pause & Scroll Up button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onTogglePlay(!isPlaying)}
              className="p-2.5 rounded-full bg-[#D9A6B2] text-[#080B16] hover:bg-[#F8F5F0] transition-colors cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-[#080B16]" />
              ) : (
                <Play className="w-4 h-4 fill-[#080B16]" />
              )}
            </button>

            <button
              onClick={onScrollToPlayer}
              className="p-2.5 rounded-full bg-[#101528] text-[#B8B6C4] hover:text-[#F8F5F0] border border-[#D9A6B2]/15 transition-colors cursor-pointer"
              aria-label="Scroll to player"
            >
              <ChevronUp className="w-4 h-4 text-[#D9A6B2]" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
