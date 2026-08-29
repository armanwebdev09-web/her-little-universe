import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Dices, Heart, ArrowRight, X, Music, Calendar } from 'lucide-react';
import { api } from '../services/api';

export const LittleThingsPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [randomItem, setRandomItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.getLittleThings();
        if (res.success && Array.isArray(res.data)) {
          setItems(res.data);
        }
      } catch (err) {
        // Fallback
      }
    };

    fetchItems();
  }, []);

  const handleFetchRandom = async () => {
    try {
      const res = await api.getRandomLittleThing();
      if (res.success && res.data) {
        setRandomItem(res.data);
      }
    } catch (err) {
      // Fallback
    }
  };

  const filteredItems = items.filter((item) => {
    return filterCategory === 'ALL' || (item.category && item.category.toUpperCase() === filterCategory);
  });

  return (
    <div className="relative z-10 pt-28 pb-20 px-6 max-w-6xl mx-auto space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#151B30]/80 border border-[#D9A6B2]/20 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D8B477]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#D9A6B2] font-semibold">
            THE LITTLE THINGS
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-6xl font-serif text-[#F8F5F0]"
        >
          It's the tiny things I <span className="italic font-light text-[#D9A6B2]">remember most.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-base text-[#B8B6C4] font-light max-w-xl mx-auto"
        >
          A collection of small details, little habits, inside jokes, and observations that make you, you.
        </motion.p>

        {/* Random Discovery Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-2"
        >
          <button
            onClick={handleFetchRandom}
            className="px-6 py-3 rounded-full bg-[#101528] text-[#D8B477] border border-[#D8B477]/40 hover:bg-[#151B30] hover:shadow-[0_0_25px_rgba(216,180,119,0.3)] font-semibold text-xs uppercase tracking-widest transition-all inline-flex items-center space-x-2.5 cursor-pointer"
          >
            <Dices className="w-4 h-4 text-[#D8B477] animate-spin" style={{ animationDuration: '6s' }} />
            <span>Tell Me Something Random</span>
          </button>
        </motion.div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
        {['ALL', 'FAVORITE', 'LITTLE_HABIT', 'INSIDE_JOKE', 'NICKNAME', 'PLACE', 'SONG', 'FOOD', 'MOVIE', 'BOOK', 'FLOWER', 'PHRASE', 'REASON', 'RANDOM'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              filterCategory === cat
                ? 'bg-[#D9A6B2] text-[#080B16]'
                : 'bg-[#151B30]/80 text-[#B8B6C4] hover:text-[#F8F5F0] border border-[#D9A6B2]/15'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Collectible Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center text-[#B8B6C4] font-serif italic">
          Apparently I still have a lot to learn about you.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className={`p-6 rounded-3xl bg-[#151B30]/80 border border-[#D9A6B2]/20 backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-[#D9A6B2]/40 transition-all ${
                item.featured ? 'sm:col-span-2 md:col-span-2 bg-[#151B30]/90 border-[#D8B477]/30' : ''
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon || '🌷'}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#101528] text-[#D9A6B2] border border-[#D9A6B2]/20 text-[10px] font-mono font-semibold uppercase">
                    {item.category}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-widest font-mono text-[#D8B477] block mb-1">
                    {item.title}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif text-[#F8F5F0]">{item.value}</h3>
                </div>

                {item.imageUrl && (
                  <div className="rounded-2xl overflow-hidden h-44 bg-[#080B16] border border-[#D9A6B2]/15">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {item.description && (
                  <p className="text-xs text-[#B8B6C4] font-serif italic leading-relaxed">
                    "{item.description}"
                  </p>
                )}
              </div>

              {/* Action links */}
              <div className="pt-2 flex items-center justify-between text-xs">
                {item.memoryId && (
                  <button
                    onClick={() => navigate('/memories')}
                    className="flex items-center space-x-1 text-[#D9A6B2] hover:underline cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>View memory</span>
                  </button>
                )}
                {item.songId && (
                  <button
                    onClick={() => navigate('/songs')}
                    className="flex items-center space-x-1 text-[#D8B477] hover:underline cursor-pointer"
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>Play song</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Random Discovery Modal Overlay */}
      <AnimatePresence>
        {randomItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#080B16]/85 backdrop-blur-md"
              onClick={() => setRandomItem(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-[#151B30] rounded-3xl p-8 border border-[#D8B477]/40 shadow-[0_0_60px_rgba(216,180,119,0.2)] z-10 text-center space-y-4"
            >
              <button onClick={() => setRandomItem(null)} className="absolute top-4 right-4 p-2 text-[#B8B6C4] hover:text-white">
                <X className="w-5 h-5" />
              </button>

              <div className="text-4xl">{randomItem.icon || '🌷'}</div>
              <span className="text-[10px] font-mono text-[#D8B477] uppercase tracking-widest font-semibold block">
                RANDOM LITTLE THING
              </span>

              <h4 className="text-xs uppercase font-mono text-[#D9A6B2] tracking-wider">{randomItem.title}</h4>
              <h3 className="text-2xl font-serif text-[#F8F5F0]">{randomItem.value}</h3>

              {randomItem.description && (
                <p className="text-sm font-serif text-[#B8B6C4] italic leading-relaxed">
                  "{randomItem.description}"
                </p>
              )}

              <button
                onClick={handleFetchRandom}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#D8B477] text-[#080B16] font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Another Random Fact
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
