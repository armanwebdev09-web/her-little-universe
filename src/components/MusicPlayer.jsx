import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  Heart,
  Calendar,
  RotateCcw,
  Sparkles,
  Cake
} from 'lucide-react';

export const MusicPlayer = ({
  currentSong,
  isPlaying,
  onTogglePlay,
  onSelectPrev,
  onSelectNext,
  onSelectAnother,
  isBirthdayToday,
  playerRef,
}) => {
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(currentSong?.durationSeconds || 180);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  // Sync internal HTML5 Audio element with active song state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.src = currentSong.audio;
    setCurrentTime(0);
    setIsEnded(false);

    if (isPlaying) {
      audio.play().catch((err) => console.warn("Audio playback issue:", err));
    }
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && !isEnded) {
      audio.play().catch((err) => console.warn("Audio play error:", err));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsEnded(true);
      onTogglePlay(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onTogglePlay]);

  const handleSeek = (e) => {
    const bar = progressRef.current;
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;

    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsEnded(false);
      onTogglePlay(true);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentSong) return null;

  return (
    <section ref={playerRef} className="relative py-8 px-6 z-10">
      <div className="max-w-4xl mx-auto">
        {/* Hidden HTML5 Audio Element */}
        <audio ref={audioRef} preload="metadata" />

        {/* Birthday Alert State if today is birthday */}
        {isBirthdayToday && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#D9A6B2]/20 via-[#D8B477]/20 to-[#D9A6B2]/20 border border-[#D8B477]/40 text-center flex items-center justify-center space-x-3 shadow-lg"
          >
            <Cake className="w-5 h-5 text-[#D8B477] animate-bounce" />
            <span className="text-sm font-serif font-semibold text-[#F8F5F0]">
              TODAY'S SONG IS DIFFERENT. HAPPY BIRTHDAY MY LOVE! 🎂
            </span>
          </motion.div>
        )}

        {/* Main Music Player Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl bg-[#151B30]/90 border border-[#D9A6B2]/25 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_0_50px_rgba(217,166,178,0.18)]"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Album Artwork with slow rotation when playing */}
            <div className="relative group flex-shrink-0 w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl border border-[#D9A6B2]/20">
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isPlaying ? 'scale-105' : 'scale-100'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B16]/60 via-transparent to-transparent" />

              {/* Spinning Vinyl Badge */}
              <div className="absolute top-3 right-3 p-2 rounded-full bg-[#080B16]/70 backdrop-blur-md border border-[#D9A6B2]/20">
                <Music
                  className={`w-4 h-4 text-[#D9A6B2] ${isPlaying ? 'animate-spin' : ''}`}
                  style={{ animationDuration: '6s' }}
                />
              </div>
            </div>

            {/* Song Meta & Audio Controls */}
            <div className="flex-1 w-full flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#D8B477] font-semibold">
                    TODAY'S SELECTION • DAY {currentSong.dayNumber}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-[#B8B6C4] font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#D9A6B2]" />
                    <span>{currentSong.date}</span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-4xl font-serif text-[#F8F5F0] font-normal">
                  {currentSong.title}
                </h2>
                <p className="text-[#B8B6C4] text-sm sm:text-base font-light tracking-wide">
                  {currentSong.artist}
                </p>
              </div>

              {/* Personal Message Bubble ("Why this song?") */}
              {currentSong.message && (
                <div className="p-4 rounded-xl bg-[#101528]/80 border border-[#D9A6B2]/15 text-[#F8F5F0]/90 text-sm font-serif italic leading-relaxed">
                  <span className="text-[10px] uppercase font-sans tracking-widest text-[#D9A6B2] not-italic font-semibold block mb-1">
                    WHY THIS SONG?
                  </span>
                  "{currentSong.message}"
                </div>
              )}

              {/* Song Finished Overlay Banner */}
              <AnimatePresence>
                {isEnded && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl bg-[#101528] border border-[#D8B477]/30 text-center flex flex-col sm:flex-row items-center justify-between gap-3"
                  >
                    <span className="text-sm font-serif text-[#D9A6B2] flex items-center space-x-1.5">
                      <Heart className="w-4 h-4 fill-[#D9A6B2]" />
                      <span>Song finished ❤️</span>
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleReplay}
                        className="px-3 py-1.5 rounded-full bg-[#151B30] text-xs font-sans uppercase tracking-wider text-[#F8F5F0] hover:text-[#D9A6B2] border border-[#D9A6B2]/20 flex items-center space-x-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3 text-[#D8B477]" />
                        <span>Play Again</span>
                      </button>
                      <button
                        onClick={onSelectAnother}
                        className="px-3 py-1.5 rounded-full bg-[#D9A6B2] text-xs font-sans uppercase tracking-wider text-[#080B16] font-medium hover:bg-[#F8F5F0] cursor-pointer"
                      >
                        Choose Another
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Seek Progress Bar */}
              <div className="space-y-1.5">
                <div
                  ref={progressRef}
                  onClick={handleSeek}
                  className="relative h-2 w-full bg-[#101528] rounded-full cursor-pointer overflow-hidden border border-[#D9A6B2]/10 group"
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#D8B477] to-[#D9A6B2] rounded-full transition-all duration-100"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-[#B8B6C4]/70">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main Controls Bar: Prev, Play/Pause, Next, Volume */}
              <div className="flex items-center justify-between pt-2">
                {/* Skip Prev */}
                <button
                  onClick={onSelectPrev}
                  className="p-2.5 rounded-full bg-[#101528] text-[#B8B6C4] hover:text-[#F8F5F0] border border-[#D9A6B2]/15 transition-colors cursor-pointer"
                  aria-label="Previous song"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                {/* Primary Play/Pause Button */}
                <button
                  onClick={() => onTogglePlay(!isPlaying)}
                  className="flex items-center space-x-3 px-8 py-3.5 rounded-full bg-[#D9A6B2] text-[#080B16] font-medium text-xs tracking-widest uppercase hover:bg-[#F8F5F0] shadow-[0_0_25px_rgba(217,166,178,0.4)] hover:shadow-[0_0_35px_rgba(217,166,178,0.6)] transition-all duration-300 transform active:scale-95 cursor-pointer"
                  aria-label={isPlaying ? 'Pause song' : 'Play song'}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-[#080B16]" />
                      <span>PAUSE</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-[#080B16]" />
                      <span>PLAY SONG</span>
                    </>
                  )}
                </button>

                {/* Skip Next */}
                <button
                  onClick={onSelectNext}
                  className="p-2.5 rounded-full bg-[#101528] text-[#B8B6C4] hover:text-[#F8F5F0] border border-[#D9A6B2]/15 transition-colors cursor-pointer"
                  aria-label="Next song"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                {/* Volume Slider & Mute Toggle */}
                <div className="hidden sm:flex items-center space-x-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 text-[#B8B6C4] hover:text-[#D9A6B2] transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-[#D9A6B2]" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      if (isMuted) setIsMuted(false);
                    }}
                    className="w-20 h-1.5 bg-[#101528] rounded-lg appearance-none cursor-pointer accent-[#D9A6B2]"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
