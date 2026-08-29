import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, Heart, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { api } from '../services/api';
import { StoryHero } from '../components/StoryHero';
import { StoryEnding } from '../components/StoryEnding';

export const OurStory = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filterCategory, setFilterCategory] = useState('ALL');

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await api.getStoryEvents();
        if (res.success && Array.isArray(res.data)) {
          setEvents(res.data);
        }
      } catch (err) {
        // Fallback
      }
    };

    fetchStory();
  }, []);

  const filteredEvents = events.filter((e) => {
    return filterCategory === 'ALL' || (e.category && e.category.toUpperCase() === filterCategory);
  });

  return (
    <div className="relative z-10 pb-20 overflow-x-hidden">
      {/* Hero */}
      <StoryHero />

      {/* Dynamic Story Counter & Filters */}
      <section className="relative max-w-4xl mx-auto px-6 mb-12 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#101528] border border-[#D8B477]/30 text-xs font-mono text-[#D8B477] mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{events.length} LITTLE MOMENTS IN OUR STORY</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {['ALL', 'BEGINNING', 'MILESTONE', 'MEMORY', 'ADVENTURE', 'SPECIAL_DAY', 'FUNNY', 'GRATEFUL', 'FUTURE'].map((cat) => (
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
      </section>

      {/* Beginning Visual Transition */}
      <div className="text-center py-6">
        <span className="text-xs uppercase tracking-[0.3em] font-serif text-[#D9A6B2] italic block">
          "Every story starts somewhere..."
        </span>
      </div>

      {/* Vertical Timeline */}
      <section className="relative py-8 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="relative">
          {/* Vertical Spine */}
          <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#D9A6B2]/50 via-[#D9A6B2]/20 to-transparent pointer-events-none" />

          <div className="space-y-12">
            {filteredEvents.map((evt, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#D8B477] border-4 border-[#080B16] z-20 shadow-[0_0_15px_rgba(216,180,119,0.5)]" />

                  {/* Content Card Box */}
                  <div className="w-full md:w-1/2 pl-14 md:pl-0 md:px-8">
                    <div className="p-6 sm:p-8 rounded-3xl bg-[#151B30]/80 border border-[#D9A6B2]/20 backdrop-blur-xl shadow-xl space-y-4 hover:border-[#D9A6B2]/40 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-[#D8B477] flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{evt.date}</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#101528] border border-[#D9A6B2]/20 text-[10px] font-mono text-[#D9A6B2] uppercase">
                          {evt.category}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-serif text-[#F8F5F0]">{evt.title}</h3>

                      {evt.imageUrl && (
                        <div className="rounded-2xl overflow-hidden h-48 bg-[#080B16] border border-[#D9A6B2]/15">
                          <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover" />
                        </div>
                      )}

                      <p className="text-sm text-[#B8B6C4] font-serif italic leading-relaxed">
                        "{evt.description}"
                      </p>

                      {evt.memoryId && (
                        <button
                          onClick={() => navigate('/memories')}
                          className="inline-flex items-center space-x-1.5 text-xs text-[#D9A6B2] hover:underline pt-2 cursor-pointer"
                        >
                          <Heart className="w-3.5 h-3.5 text-[#D9A6B2]" />
                          <span>View linked memory</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Ending CTA */}
      <StoryEnding onSeeMemoriesClick={() => navigate('/memories')} />
    </div>
  );
};
