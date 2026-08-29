import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Music, Volume2, Heart, ArrowRight } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { api } from '../services/api';

export const DailySong = () => {
  const navigate = useNavigate();
  const [song, setSong] = useState(siteConfig.todaysSong);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(song.durationSeconds || 180);
  const [isLiked, setIsLiked] = useState(true);

  const audioRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const fetchTodaySong = async () => {
      try {
        const res = await api.getTodaySong();
        if (res.success && res.data) {
          setSong({
            title: res.data.title,
            artist: res.data.artist,
            cover: res.data.coverUrl || res.data.cover,
            audio: res.data.audioUrl || res.data.audio,
            message: res.data.message || siteConfig.todaysSong.message,
          });
        }
      } catch (err) {
        // Fallback to default siteConfig today's song
      }
    };

    fetchTodaySong();
  }, []);

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
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [song]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Audio playback issue:", err);
        setIsPlaying(true);
      });
    }
  };

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

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <section id="songs" className="relative py-20 px-6 z-10">
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-medium block mb-2">
            TODAY'S SELECTION
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F8F5F0] font-normal mb-3">
            A Song For You
          </h2>
          <p className="text-[#B8B6C4] font-light text-base sm:text-lg">
            One song. Every day. Just for you.
          </p>
        </motion.div>

        {/* Audio Element */}
        <audio ref={audioRef} src={song.audio} preload="metadata" />

        {/* Premium Music Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-3xl bg-[#151B30]/80 border border-[#D9A6B2]/20 backdrop-blur-xl p-6 sm:p-10 shadow-[0_0_40px_rgba(217,166,178,0.1)] hover:shadow-[0_0_50px_rgba(217,166,178,0.2)] transition-all duration-500"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Album Artwork Container */}
            <div className="relative group flex-shrink-0 w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-2xl border border-[#D9A6B2]/20">
              <img
                src={song.cover}
                alt={song.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isPlaying ? 'scale-105' : 'scale-100 group-hover:scale-105'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B16]/70 via-transparent to-transparent" />
              
              {/* Spinning Vinyl Effect Badge */}
              <div className="absolute top-3 right-3 p-2 rounded-full bg-[#080B16]/60 backdrop-blur-md border border-[#D9A6B2]/20">
                <Music className={`w-4 h-4 text-[#D9A6B2] ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
              </div>
            </div>

            {/* Song Info & Controls */}
            <div className="flex-1 w-full flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#D8B477] font-semibold">
                    TODAY'S SONG
                  </span>
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="text-[#D9A6B2] hover:scale-110 transition-transform p-1"
                    aria-label="Like song"
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#D9A6B2]' : ''}`} />
                  </button>
                </div>

                <h3 className="text-2xl sm:text-4xl font-serif text-[#F8F5F0] font-normal mt-1 mb-1">
                  {song.title}
                </h3>
                <p className="text-[#B8B6C4] text-sm sm:text-base font-light tracking-wide">
                  {song.artist}
                </p>
              </div>

              {/* Personal Message Bubble */}
              <div className="p-4 rounded-xl bg-[#101528]/80 border border-[#D9A6B2]/10 italic text-[#F8F5F0]/90 text-sm font-serif leading-relaxed">
                "{song.message}"
              </div>

              {/* Player Progress Controls */}
              <div className="space-y-2">
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

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => navigate('/songs')}
                  className="flex items-center space-x-1.5 text-xs text-[#B8B6C4] hover:text-[#D9A6B2] transition-colors group cursor-pointer"
                >
                  <span>Our Full Soundtrack</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Main Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  className="flex items-center space-x-3 px-6 py-3 rounded-full bg-[#D9A6B2] text-[#080B16] font-medium text-xs tracking-widest uppercase hover:bg-[#F8F5F0] hover:shadow-[0_0_25px_rgba(217,166,178,0.5)] transition-all duration-300 transform active:scale-95 cursor-pointer"
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
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
