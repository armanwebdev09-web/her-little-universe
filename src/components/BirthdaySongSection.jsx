import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Music } from 'lucide-react';
import { MusicPlayer } from './MusicPlayer';
import { birthdayData } from '../data/birthdayData';

export const BirthdaySongSection = ({ isPlaying, onTogglePlay }) => {
  return (
    <section id="birthday-song" className="relative py-12 px-6 z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold block mb-2">
            SPECIAL SOUNDTRACK
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F8F5F0] font-normal mb-2">
            The Song I Saved For Today
          </h2>
          <p className="text-sm text-[#B8B6C4] font-light">
            The grand finale reserved specifically for your birthday.
          </p>
        </motion.div>

        {/* Music Player */}
        <MusicPlayer
          song={birthdayData.birthdaySong}
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
        />
      </div>
    </section>
  );
};
