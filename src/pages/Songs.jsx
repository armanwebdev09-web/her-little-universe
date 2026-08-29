import React, { useState, useRef, useEffect } from 'react';
import { DailySongHero } from '../components/DailySongHero';
import { MusicPlayer } from '../components/MusicPlayer';
import { SongTimeline } from '../components/SongTimeline';
import { MiniPlayer } from '../components/MiniPlayer';
import { songsData } from '../data/songsData';
import { siteConfig } from '../data/siteConfig';
import { api } from '../services/api';
import { Music, Heart } from 'lucide-react';

export const Songs = () => {
  const playerRef = useRef(null);
  const [unlockedSongs, setUnlockedSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);

  // Fetch today's song and unlocked past soundtrack from backend API on mount
  useEffect(() => {
    const fetchDailySongs = async () => {
      try {
        const todayRes = await api.getTodaySong();
        const unlockedRes = await api.getUnlockedSongs();

        if (unlockedRes.success && Array.isArray(unlockedRes.data)) {
          setUnlockedSongs(unlockedRes.data);
        } else {
          setUnlockedSongs([]);
        }

        if (todayRes.success && todayRes.data) {
          setCurrentSong(todayRes.data);
        } else if (unlockedRes.success && unlockedRes.data && unlockedRes.data.length > 0) {
          setCurrentSong(unlockedRes.data[0]);
        } else {
          setCurrentSong(null);
        }
      } catch (err) {
        setUnlockedSongs([]);
        setCurrentSong(null);
      }
    };

    fetchDailySongs();
  }, []);

  // Determine if today is her birthday
  const checkIsBirthday = () => {
    const today = new Date();
    const bday = new Date(siteConfig.birthdayDate);
    return today.getMonth() === bday.getMonth() && today.getDate() === bday.getDate();
  };

  const isBirthdayToday = checkIsBirthday();

  // IntersectionObserver to reveal Sticky MiniPlayer when main player scrolls out of view
  useEffect(() => {
    const target = playerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowMiniPlayer(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const handleSelectSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    scrollToPlayer();
  };

  const scrollToPlayer = () => {
    if (playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPrev = () => {
    if (unlockedSongs.length === 0 || !currentSong) return;
    const currentIndex = unlockedSongs.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + unlockedSongs.length) % unlockedSongs.length;
    setCurrentSong(unlockedSongs[prevIndex]);
    setIsPlaying(true);
  };

  const handleSelectNext = () => {
    if (unlockedSongs.length === 0 || !currentSong) return;
    const currentIndex = unlockedSongs.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % unlockedSongs.length;
    setCurrentSong(unlockedSongs[nextIndex]);
    setIsPlaying(true);
  };

  return (
    <div className="relative z-10 pb-20 font-sans">
      {/* Top Banner Hero */}
      <DailySongHero
        unlockedCount={unlockedSongs.length}
        totalCount={unlockedSongs.length}
      />

      {unlockedSongs.length > 0 && currentSong ? (
        <>
          {/* Main Music Player Card */}
          <MusicPlayer
            playerRef={playerRef}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onTogglePlay={(playingState) => setIsPlaying(playingState)}
            onSelectPrev={handleSelectPrev}
            onSelectNext={handleSelectNext}
            onSelectAnother={scrollToPlayer}
            isBirthdayToday={isBirthdayToday}
          />

          {/* Daily Song Timeline */}
          <SongTimeline
            songs={unlockedSongs}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onSelectSong={handleSelectSong}
            isSongLocked={() => false}
          />
        </>
      ) : (
        /* Empty State */
        <section className="py-20 px-6 text-center">
          <div className="max-w-md mx-auto p-12 rounded-3xl bg-[#151B30]/60 border border-[#D9A6B2]/15 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-[#101528] border border-[#D9A6B2]/20 flex items-center justify-center mx-auto mb-4 text-[#D9A6B2]">
              <Music className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-2xl font-serif text-[#F8F5F0] font-normal mb-2 flex items-center justify-center gap-2">
              <span>No song for today yet</span>
              <Heart className="w-5 h-5 text-[#D9A6B2] fill-[#D9A6B2]" />
            </h3>
            <p className="text-sm text-[#B8B6C4] font-light">
              Add a new song in the Admin Panel to unlock your daily soundtrack.
            </p>
          </div>
        </section>
      )}

      {/* Sticky Mini Player on Scroll */}
      {currentSong && (
        <MiniPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          onTogglePlay={(state) => setIsPlaying(state)}
          onScrollToPlayer={scrollToPlayer}
          visible={showMiniPlayer}
        />
      )}
    </div>
  );
};
