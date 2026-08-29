import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Calendar } from 'lucide-react';
import { api } from '../services/api';

export const StoryPreviewSection = () => {
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.getStoryEvents();
        if (res.success && Array.isArray(res.data)) {
          const featured = res.data.filter((e) => e.featured).slice(0, 3);
          setFeaturedEvents(featured.length > 0 ? featured : res.data.slice(0, 3));
        }
      } catch (err) {
        // Fallback
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="relative py-16 px-6 z-10 max-w-6xl mx-auto text-center space-y-10">
      <div>
        <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold block mb-2">
          OUR STORY
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-[#F8F5F0]">
          A collection of the little moments <br />
          <span className="italic font-light text-[#D9A6B2]">that made us.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {featuredEvents.map((evt) => (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-3xl bg-[#151B30]/70 border border-[#D9A6B2]/15 backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-[#D9A6B2]/30 transition-all"
          >
            <div className="space-y-3">
              <span className="text-xs font-mono text-[#D8B477] flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{evt.date}</span>
              </span>
              <h3 className="text-xl font-serif text-[#F8F5F0]">{evt.title}</h3>
              <p className="text-xs text-[#B8B6C4] font-serif italic line-clamp-3">
                "{evt.description}"
              </p>
            </div>

            <button
              onClick={() => navigate('/our-story')}
              className="inline-flex items-center space-x-1.5 text-xs text-[#D9A6B2] hover:underline pt-2 cursor-pointer"
            >
              <span>Read story moment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </div>

      <div>
        <button
          onClick={() => navigate('/our-story')}
          className="px-8 py-3.5 rounded-full bg-[#101528] text-[#F8F5F0] border border-[#D9A6B2]/30 hover:border-[#D9A6B2] font-semibold text-xs uppercase tracking-widest transition-all inline-flex items-center space-x-2 cursor-pointer"
        >
          <span>Explore Our Story</span>
          <ArrowRight className="w-4 h-4 text-[#D8B477]" />
        </button>
      </div>
    </section>
  );
};
