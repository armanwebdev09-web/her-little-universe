import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { BirthdayGate } from '../components/BirthdayGate';
import { BirthdayIntro } from '../components/BirthdayIntro';
import { BirthdayHero } from '../components/BirthdayHero';
import { BirthdayLetter } from '../components/BirthdayLetter';
import { BirthdayGifts } from '../components/BirthdayGifts';
import { BirthdaySongSection } from '../components/BirthdaySongSection';
import { SoundtrackRecap } from '../components/SoundtrackRecap';
import { MemoryRecap } from '../components/MemoryRecap';
import { BirthdayStorySection } from '../components/BirthdayStorySection';
import { BirthdayLittleThingsSection } from '../components/BirthdayLittleThingsSection';
import { UniverseRecap } from '../components/UniverseRecap';
import { BirthdayEnding } from '../components/BirthdayEnding';
import { LetterReader } from '../components/LetterReader';
import { RefreshCw, Heart } from 'lucide-react';

const REVISIT_KEY = 'birthdayExperienceCompleted';

export const Birthday = () => {
  const [bdayStatus, setBdayStatus] = useState({ state: 'BEFORE_BIRTHDAY' });
  const [bdayContent, setBdayContent] = useState(null);
  const [showIntro, setShowIntro] = useState(false);
  const [hasCompletedBefore, setHasCompletedBefore] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [isPlayingSong, setIsPlayingSong] = useState(false);

  const fetchStatusAndContent = async () => {
    try {
      const statusRes = await api.getBirthdayStatus();
      if (statusRes.success && statusRes.data) {
        setBdayStatus(statusRes.data);
      }

      const contentRes = await api.getBirthdayContent();
      if (contentRes.success && contentRes.data) {
        setBdayContent(contentRes.data);
      }
    } catch (err) {
      // Fallback
    }
  };

  useEffect(() => {
    fetchStatusAndContent();

    // Check revisit state
    const completed = localStorage.getItem(REVISIT_KEY) === 'true';
    setHasCompletedBefore(completed);
    if (!completed) {
      setShowIntro(true);
    }

    const interval = setInterval(fetchStatusAndContent, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleCompleteIntro = () => {
    setShowIntro(false);
    localStorage.setItem(REVISIT_KEY, 'true');
    setHasCompletedBefore(true);
  };

  const handleReplayExperience = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowIntro(true);
  };

  const isUnlocked = bdayStatus.state === 'BIRTHDAY' || bdayStatus.state === 'AFTER_BIRTHDAY';

  // State 1: BEFORE_BIRTHDAY -> Render locked countdown gate
  if (!isUnlocked) {
    return <BirthdayGate statusData={bdayStatus} onUnlockReady={fetchStatusAndContent} />;
  }

  // Intro animation sequence
  if (showIntro && bdayStatus.openingAnimationEnabled !== false) {
    return <BirthdayIntro herName={bdayStatus.herName} onComplete={handleCompleteIntro} />;
  }

  return (
    <div className="relative z-10 pb-20 overflow-x-hidden">
      {/* Revisit Banner if completed before */}
      {hasCompletedBefore && (
        <div className="pt-24 px-6 text-center">
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-[#151B30]/80 border border-[#D8B477]/30 text-xs text-[#B8B6C4] font-mono">
            <span>Welcome back ❤️</span>
            <button
              onClick={handleReplayExperience}
              className="text-[#D8B477] hover:underline font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Replay Intro</span>
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <BirthdayHero herName={bdayContent?.herName} birthdayDate={bdayContent?.birthdayDate} />

      {/* Hero Personal Callout */}
      <section className="relative py-8 px-6 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-8 rounded-3xl bg-[#151B30]/60 border border-[#D9A6B2]/20 backdrop-blur-xl"
        >
          <p className="text-xl sm:text-2xl font-serif text-[#F8F5F0] font-light italic leading-relaxed">
            "{bdayContent?.heroMessage || 'Today, the whole little universe is celebrating you.'}"
          </p>
        </motion.div>
      </section>

      {/* SECTION 1 — Birthday Letter */}
      <BirthdayLetter letterText={bdayContent?.birthdayLetter} />

      {/* SECTION 2 — Digital Gifts & Featured Memories */}
      <BirthdayGifts
        onOpenLetter={(letter) => setSelectedLetter(letter)}
        onOpenMemories={() => {
          const el = document.getElementById('memory-recap');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onPlaySong={() => {
          setIsPlayingSong(true);
          const el = document.getElementById('birthday-song');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <div id="memory-recap">
        <MemoryRecap />
      </div>

      {/* SECTION 3 — Our Soundtrack */}
      <BirthdaySongSection
        isPlaying={isPlayingSong}
        onTogglePlay={() => setIsPlayingSong(!isPlayingSong)}
      />

      <SoundtrackRecap
        onSelectSong={() => {
          setIsPlayingSong(true);
          const el = document.getElementById('birthday-song');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* SECTION 4 — Our Story */}
      <BirthdayStorySection />

      {/* SECTION 5 — The Little Things */}
      <BirthdayLittleThingsSection />

      {/* SECTION 6 — Her World / Universe */}
      <UniverseRecap />

      {/* SECTION 7 & 8 — Final Message & Ending Reveal */}
      <BirthdayEnding
        finalMessageText={bdayContent?.finalMessage}
        confettiEnabled={bdayContent?.confettiEnabled}
        onReplay={handleReplayExperience}
      />

      {/* Letter Reader Lightbox */}
      <LetterReader
        selectedLetter={selectedLetter}
        onClose={() => setSelectedLetter(null)}
      />
    </div>
  );
};
