import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LetterHero } from '../components/LetterHero';
import { FeaturedLetter } from '../components/FeaturedLetter';
import { LetterReader } from '../components/LetterReader';
import { api } from '../services/api';
import { Sparkles, Home as HomeIcon, ArrowRight, Lock, Mail, Heart, CheckCircle2 } from 'lucide-react';

export const Letters = () => {
  const navigate = useNavigate();
  const [letters, setLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [openedMap, setOpenedMap] = useState({});

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const res = await api.getLetters();
        if (res.success && Array.isArray(res.data)) {
          setLetters(res.data);
        }
      } catch (err) {
        // Fallback
      }
    };

    fetchLetters();

    // Load opened state from localStorage
    const map = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('letterOpened_')) {
        const id = key.replace('letterOpened_', '');
        map[id] = true;
      }
    }
    setOpenedMap(map);
  }, []);

  const handleOpenLetter = (letter) => {
    if (letter.locked) return;
    localStorage.setItem(`letterOpened_${letter.id}`, 'true');
    setOpenedMap((prev) => ({ ...prev, [letter.id]: true }));
    setSelectedLetter(letter);
  };

  const filteredLetters = letters.filter((item) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'OPEN_WHEN') return item.type === 'OPEN_WHEN';
    if (activeFilter === 'BIRTHDAY') return item.type === 'BIRTHDAY';
    if (activeFilter === 'SPECIAL') return item.type === 'SPECIAL';
    if (activeFilter === 'AVAILABLE') return !item.locked;
    return true;
  });

  const featuredLetter = letters.find((l) => l.featured) || letters[0];

  return (
    <div className="relative z-10 pb-20 overflow-x-hidden">
      {/* Top Banner Hero */}
      <LetterHero totalLettersCount={letters.length} />

      {/* Featured Letter Banner */}
      {featuredLetter && (
        <FeaturedLetter
          featuredLetter={featuredLetter}
          onOpenLetter={(item) => handleOpenLetter(item)}
        />
      )}

      {/* Filter Tabs */}
      <div className="w-full max-w-6xl mx-auto px-6 mb-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-[#151B30]">
          <div className="flex items-center space-x-2 text-[#F8F5F0]">
            <Sparkles className="w-4 h-4 text-[#D8B477]" />
            <span className="font-serif text-lg font-normal">
              Love Letter Vault
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {['ALL', 'OPEN_WHEN', 'BIRTHDAY', 'SPECIAL', 'AVAILABLE'].map((tab) => {
              const isActive = activeFilter === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-2 rounded-full text-xs font-sans tracking-widest uppercase transition-all duration-300 flex items-center space-x-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#D9A6B2] text-[#080B16] font-semibold shadow-[0_0_20px_rgba(217,166,178,0.4)]'
                      : 'bg-[#151B30]/70 text-[#B8B6C4] hover:text-[#F8F5F0] hover:bg-[#151B30] border border-[#D9A6B2]/15'
                  }`}
                >
                  <span>{tab.replace('_', ' ')}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Love Letter Envelope Cards Grid */}
      <section className="relative max-w-6xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredLetters.map((letter, idx) => {
            const isOpened = Boolean(openedMap[letter.id]);
            const isLocked = Boolean(letter.locked);

            return (
              <motion.div
                key={letter.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`p-6 rounded-3xl bg-[#151B30]/80 border backdrop-blur-xl flex flex-col justify-between space-y-4 text-left transition-all ${
                  isLocked
                    ? 'border-[#D8B477]/20 opacity-75'
                    : isOpened
                    ? 'border-emerald-500/30'
                    : 'border-[#D9A6B2]/30 hover:border-[#D9A6B2]/60 shadow-[0_0_25px_rgba(217,166,178,0.1)]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-[#101528] border border-[#D9A6B2]/20 flex items-center justify-center text-[#D9A6B2]">
                      {isLocked ? <Lock className="w-5 h-5 text-[#D8B477]" /> : <Mail className="w-5 h-5" />}
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#101528] text-[#D8B477] border border-[#D8B477]/20">
                      {letter.type}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif text-[#F8F5F0] line-clamp-2">{letter.title}</h3>

                  <p className="text-xs text-[#B8B6C4] font-serif italic line-clamp-2">
                    "{letter.preview || 'Open to read...'}"
                  </p>
                </div>

                <div className="pt-2 border-t border-[#101528] flex items-center justify-between">
                  {isLocked ? (
                    <span className="text-xs font-mono text-[#D8B477] flex items-center space-x-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked until {letter.unlockDate || letter.date}</span>
                    </span>
                  ) : isOpened ? (
                    <button
                      onClick={() => handleOpenLetter(letter)}
                      className="px-4 py-2 rounded-full bg-[#101528] text-[#F8F5F0] border border-[#D9A6B2]/30 text-xs font-semibold uppercase tracking-wider hover:bg-[#D9A6B2] hover:text-[#080B16] transition-colors cursor-pointer flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Read Again</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenLetter(letter)}
                      className="px-5 py-2 rounded-full bg-[#D9A6B2] text-[#080B16] text-xs font-semibold uppercase tracking-widest hover:bg-[#F8F5F0] transition-colors cursor-pointer flex items-center space-x-1.5"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>Open Letter</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="relative py-16 px-6 text-center border-t border-[#151B30]/80 max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#F8F5F0] mb-3">
          Some words are meant to be <span className="italic font-light text-[#D9A6B2]">kept forever.</span>
        </h2>
        <p className="text-[#B8B6C4] font-light text-base sm:text-lg mb-8">
          Whenever you need a reminder, this little space will be here for you.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#101528] text-[#B8B6C4] hover:text-[#F8F5F0] hover:bg-[#151B30] border border-[#D9A6B2]/15 text-xs font-sans tracking-widest uppercase transition-all duration-300 cursor-pointer"
          >
            <HomeIcon className="w-4 h-4 text-[#D8B477]" />
            <span>Back Home</span>
          </button>

          <button
            onClick={() => navigate('/our-story')}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#151B30] text-[#F8F5F0] border border-[#D9A6B2]/30 hover:border-[#D9A6B2] hover:bg-[#D9A6B2]/15 text-xs font-sans tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-md"
          >
            <span>Explore Our Story</span>
            <ArrowRight className="w-4 h-4 text-[#D9A6B2]" />
          </button>
        </div>
      </section>

      {/* Intimate Letter Reader Modal */}
      <LetterReader
        selectedLetter={selectedLetter}
        onClose={() => setSelectedLetter(null)}
      />
    </div>
  );
};
