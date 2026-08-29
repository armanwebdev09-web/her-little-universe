import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Dices, X, Music, Image as ImageIcon, Mail, Flower2, Heart, ArrowRight, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export const OurUniverse = () => {
  const navigate = useNavigate();
  const [stars, setStars] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedStar, setSelectedStar] = useState(null);
  const [hoveredStar, setHoveredStar] = useState(null);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const res = await api.getUniverseStars();
        if (res.success && Array.isArray(res.data)) {
          setStars(res.data);
        }
      } catch (err) {
        // Fallback
      }
    };

    fetchStars();
  }, []);

  const filteredStars = stars.filter((s) => {
    if (activeFilter === 'ALL') return true;
    return s.category && s.category.toUpperCase() === activeFilter;
  });

  const featuredStars = stars.filter((s) => s.featured);

  return (
    <div className="relative z-10 pt-28 pb-20 px-6 max-w-7xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#151B30]/80 border border-[#D8B477]/30 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D8B477]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold">
            HER WORLD
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-6xl font-serif text-[#F8F5F0]"
        >
          A little universe made from all <br />
          <span className="italic font-light text-[#D9A6B2]">the moments that matter.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-base text-[#B8B6C4] font-light max-w-xl mx-auto"
        >
          Every star represents a memory, a song, a letter, or a little detail. Click any star to explore.
        </motion.p>

        {/* Dynamic Star Counter & Tonight's Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-[#D8B477]"
        >
          <span className="px-4 py-1.5 rounded-full bg-[#101528] border border-[#D8B477]/30 font-semibold">
            ✨ {stars.length} moments in our little universe
          </span>
        </motion.div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
        {['ALL', 'MEMORY', 'SONG', 'LETTER', 'MILESTONE', 'LITTLE_THING', 'SPECIAL', 'BIRTHDAY'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              activeFilter === cat
                ? 'bg-[#D8B477] text-[#080B16]'
                : 'bg-[#151B30]/80 text-[#B8B6C4] hover:text-[#F8F5F0] border border-[#D9A6B2]/15'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Main Interactive Visual Star Field Canvas */}
      <div className="relative w-full h-[460px] sm:h-[560px] rounded-3xl bg-gradient-to-b from-[#080B16] via-[#101528] to-[#080B16] border border-[#D9A6B2]/20 shadow-[0_0_80px_rgba(8,11,22,0.8)] overflow-hidden">
        {/* Subtle Constellation Lines for Featured Stars */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40">
          {featuredStars.length > 1 &&
            featuredStars.map((star, idx) => {
              if (idx === featuredStars.length - 1) return null;
              const nextStar = featuredStars[idx + 1];
              const p1X = star.positionX !== undefined ? star.positionX : 50;
              const p1Y = star.positionY !== undefined ? star.positionY : 50;
              const p2X = nextStar.positionX !== undefined ? nextStar.positionX : 50;
              const p2Y = nextStar.positionY !== undefined ? nextStar.positionY : 50;

              return (
                <line
                  key={`line-${star.id}-${nextStar.id}`}
                  x1={`${p1X}%`}
                  y1={`${p1Y}%`}
                  x2={`${p2X}%`}
                  y2={`${p2Y}%`}
                  stroke="#D8B477"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}
        </svg>

        {/* Stars */}
        {filteredStars.map((star) => {
          const posX = star.positionX !== undefined ? star.positionX : star.position?.x || 50;
          const posY = star.positionY !== undefined ? star.positionY : star.position?.y || 50;
          const isFeatured = Boolean(star.featured);

          return (
            <div
              key={star.id}
              onClick={() => setSelectedStar(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
              style={{ left: `${posX}%`, top: `${posY}%` }}
            >
              {/* Star glowing orb */}
              <div
                className={`rounded-full transition-all duration-300 ${
                  isFeatured
                    ? 'w-5 h-5 bg-[#D8B477] shadow-[0_0_20px_#D8B477] animate-pulse'
                    : 'w-3.5 h-3.5 bg-[#D9A6B2] shadow-[0_0_12px_#D9A6B2] hover:scale-125'
                }`}
              />

              {/* Hover Tooltip */}
              {hoveredStar && hoveredStar.id === star.id && (
                <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 bg-[#151B30]/95 text-[#F8F5F0] p-2.5 rounded-xl border border-[#D8B477]/40 shadow-2xl text-left pointer-events-none whitespace-nowrap z-30">
                  <span className="text-[9px] font-mono text-[#D8B477] uppercase block">{star.category}</span>
                  <span className="text-xs font-serif font-bold block">{star.title}</span>
                  <span className="text-[10px] text-[#B8B6C4] font-mono block">{star.date}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Our Constellation Featured Section */}
      {featuredStars.length > 0 && (
        <div className="space-y-4 text-center pt-6">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D8B477] font-semibold">
            OUR CONSTELLATION
          </span>
          <h2 className="text-2xl font-serif text-[#F8F5F0]">The anchors of our story</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
            {featuredStars.slice(0, 3).map((f) => (
              <div
                key={f.id}
                onClick={() => setSelectedStar(f)}
                className="p-5 rounded-2xl bg-[#151B30]/70 border border-[#D8B477]/30 hover:border-[#D8B477] transition-all cursor-pointer space-y-2"
              >
                <span className="text-[10px] font-mono text-[#D8B477] uppercase block">{f.category}</span>
                <h3 className="text-lg font-serif text-[#F8F5F0]">{f.title}</h3>
                <p className="text-xs text-[#B8B6C4] font-serif italic line-clamp-2">"{f.description}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accessible Grid List below canvas for keyboard & accessibility users */}
      <div className="space-y-4 pt-8 border-t border-[#151B30]">
        <h3 className="text-sm font-mono uppercase tracking-widest text-[#B8B6C4] font-semibold text-center sm:text-left">
          ALL VISIBLE STARS ({filteredStars.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredStars.map((star) => (
            <div
              key={star.id}
              onClick={() => setSelectedStar(star)}
              className="p-4 rounded-2xl bg-[#151B30]/60 border border-[#D9A6B2]/15 hover:border-[#D9A6B2]/40 transition-all cursor-pointer flex items-center justify-between text-left"
            >
              <div>
                <span className="text-[9px] font-mono text-[#D8B477] uppercase block">{star.category}</span>
                <h4 className="text-sm font-serif text-[#F8F5F0] font-semibold">{star.title}</h4>
                <span className="text-[10px] text-[#B8B6C4] font-mono block">{star.date}</span>
              </div>
              <Star className="w-4 h-4 text-[#D8B477]" />
            </div>
          ))}
        </div>
      </div>

      {/* Star Detail Modal */}
      <AnimatePresence>
        {selectedStar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#080B16]/85 backdrop-blur-md"
              onClick={() => setSelectedStar(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#151B30] rounded-3xl p-8 border border-[#D8B477]/40 shadow-[0_0_60px_rgba(216,180,119,0.25)] z-10 text-center space-y-4"
            >
              <button onClick={() => setSelectedStar(null)} className="absolute top-4 right-4 p-2 text-[#B8B6C4] hover:text-white">
                <X className="w-5 h-5" />
              </button>

              <div className="text-3xl text-[#D8B477]">⭐</div>
              <span className="text-[10px] font-mono text-[#D8B477] uppercase tracking-widest font-semibold block">
                {selectedStar.category} • {selectedStar.date}
              </span>

              <h3 className="text-2xl font-serif text-[#F8F5F0]">{selectedStar.title}</h3>

              {selectedStar.description && (
                <p className="text-sm font-serif text-[#B8B6C4] italic leading-relaxed">
                  "{selectedStar.description}"
                </p>
              )}

              {/* Attachment Triggers */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-3 border-t border-[#101528]">
                {selectedStar.songId && (
                  <button
                    onClick={() => { setSelectedStar(null); navigate('/songs'); }}
                    className="px-4 py-2 rounded-full bg-[#101528] text-[#D8B477] border border-[#D8B477]/30 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>Play Song</span>
                  </button>
                )}
                {selectedStar.memoryId && (
                  <button
                    onClick={() => { setSelectedStar(null); navigate('/memories'); }}
                    className="px-4 py-2 rounded-full bg-[#101528] text-[#D9A6B2] border border-[#D9A6B2]/30 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>View Memory</span>
                  </button>
                )}
                {selectedStar.letterId && (
                  <button
                    onClick={() => { setSelectedStar(null); navigate('/letters'); }}
                    className="px-4 py-2 rounded-full bg-[#101528] text-[#F8F5F0] border border-[#F8F5F0]/30 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#D9A6B2]" />
                    <span>Read Letter</span>
                  </button>
                )}
                {selectedStar.littleThingId && (
                  <button
                    onClick={() => { setSelectedStar(null); navigate('/little-things'); }}
                    className="px-4 py-2 rounded-full bg-[#101528] text-[#F8F5F0] border border-[#F8F5F0]/30 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Flower2 className="w-3.5 h-3.5 text-[#D9A6B2]" />
                    <span>See Little Thing</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
