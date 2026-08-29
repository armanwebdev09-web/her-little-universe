import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift as GiftIcon, Sparkles, Heart, X, BookOpen, Music, Camera, FileText } from 'lucide-react';
import { birthdayData } from '../data/birthdayData';
import { secretNotesData } from '../data/secretMemoriesData';

export const BirthdayGifts = ({ onOpenLetter, onOpenMemories, onPlaySong }) => {
  const [activeGiftModal, setActiveGiftModal] = useState(null);

  const handleGiftClick = (gift) => {
    if (gift.type === 'LETTER') {
      onOpenLetter(birthdayData.birthdayLetter);
    } else if (gift.type === 'MEMORIES') {
      onOpenMemories();
    } else if (gift.type === 'SONGS') {
      onPlaySong();
    } else {
      setActiveGiftModal(gift);
    }
  };

  return (
    <section className="relative py-16 px-6 z-10">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold block mb-2">
            DIGITAL GIFTS
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F8F5F0] font-normal mb-3">
            I left a few things for you.
          </h2>
          <p className="text-[#B8B6C4] font-light text-base sm:text-lg">
            Tap a gift to unwrap what's inside.
          </p>
        </motion.div>

        {/* Gift Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {birthdayData.gifts.map((gift, index) => (
            <motion.div
              key={gift.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onClick={() => handleGiftClick(gift)}
              className="group relative rounded-3xl bg-[#151B30]/80 border border-[#D9A6B2]/20 p-6 backdrop-blur-xl flex flex-col justify-between hover:border-[#D9A6B2]/50 hover:bg-[#151B30] glow-card-hover cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{gift.icon}</span>
                  <span className="text-[10px] font-mono tracking-widest text-[#D8B477] uppercase font-semibold">
                    {gift.number}
                  </span>
                </div>

                <h3 className="text-xs tracking-[0.2em] font-sans text-[#D8B477] uppercase font-semibold mb-1">
                  {gift.title}
                </h3>
                <h4 className="text-xl font-serif text-[#F8F5F0] font-normal mb-2 group-hover:text-[#D9A6B2] transition-colors">
                  {gift.subtitle}
                </h4>
                <p className="text-xs text-[#B8B6C4] font-light leading-relaxed">
                  {gift.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#101528] flex items-center justify-between text-xs font-sans tracking-widest uppercase text-[#D9A6B2] group-hover:translate-x-1 transition-transform">
                <span>Unwrap Gift</span>
                <span>→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gift Content Modal for Notes or Final Gift */}
      <AnimatePresence>
        {activeGiftModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveGiftModal(null)}
              className="fixed inset-0 bg-[#080B16]/85 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#151B30] border border-[#D9A6B2]/30 p-8 shadow-2xl z-10 text-center"
            >
              <button
                onClick={() => setActiveGiftModal(null)}
                className="absolute top-4 right-4 p-2 text-[#B8B6C4] hover:text-[#F8F5F0]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-[#101528] border border-[#D8B477]/30 flex items-center justify-center mx-auto mb-4 text-[#D8B477] text-2xl">
                {activeGiftModal.icon}
              </div>

              <h3 className="text-2xl font-serif text-[#F8F5F0] mb-2">
                {activeGiftModal.subtitle}
              </h3>

              {activeGiftModal.type === 'NOTES' ? (
                <div className="space-y-4 my-6 text-left">
                  {secretNotesData.map((note) => (
                    <div key={note.id} className="p-4 rounded-xl bg-[#101528] border border-[#D9A6B2]/15">
                      <h4 className="text-xs font-serif font-semibold text-[#D8B477] mb-1">{note.title}</h4>
                      <p className="text-xs text-[#B8B6C4] italic font-serif">"{note.text}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-[#101528] border border-[#D9A6B2]/15 my-6 text-left font-serif text-sm text-[#F8F5F0] leading-relaxed italic">
                  "No matter where life takes us or how many birthdays pass, I promise to keep making ordinary days feel special for you."
                </div>
              )}

              <button
                onClick={() => setActiveGiftModal(null)}
                className="w-full py-3 rounded-full bg-[#D9A6B2] text-[#080B16] text-xs font-sans uppercase tracking-widest font-semibold hover:bg-[#F8F5F0]"
              >
                Keep Close to Heart ❤️
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
