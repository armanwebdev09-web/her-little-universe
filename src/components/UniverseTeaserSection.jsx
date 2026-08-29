import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Star } from 'lucide-react';
import { api } from '../services/api';

export const UniverseTeaserSection = () => {
  const navigate = useNavigate();
  const [featuredStars, setFeaturedStars] = useState([]);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const res = await api.getUniverseStars();
        if (res.success && Array.isArray(res.data)) {
          const featured = res.data.filter((s) => s.featured).slice(0, 3);
          setFeaturedStars(featured.length > 0 ? featured : res.data.slice(0, 3));
        }
      } catch (err) {
        // Fallback
      }
    };

    fetchStars();
  }, []);

  return (
    <section className="relative py-16 px-6 z-10 max-w-6xl mx-auto text-center space-y-10">
      <div>
        <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold block mb-2">
          HER WORLD
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-[#F8F5F0]">
          There's a whole universe here, <br />
          <span className="italic font-light text-[#D9A6B2]">made of all our moments.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {featuredStars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-3xl bg-[#151B30]/70 border border-[#D8B477]/20 backdrop-blur-xl flex flex-col justify-between space-y-3 hover:border-[#D8B477]/40 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Star className="w-5 h-5 text-[#D8B477]" />
                <span className="text-[10px] font-mono text-[#D8B477] uppercase tracking-widest block">
                  {star.category}
                </span>
              </div>
              <h3 className="text-xl font-serif text-[#F8F5F0]">{star.title}</h3>
              {star.description && (
                <p className="text-xs text-[#B8B6C4] font-serif italic line-clamp-2">
                  "{star.description}"
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <button
          onClick={() => navigate('/our-universe')}
          className="px-8 py-3.5 rounded-full bg-[#101528] text-[#F8F5F0] border border-[#D8B477]/40 hover:border-[#D8B477] font-semibold text-xs uppercase tracking-widest transition-all inline-flex items-center space-x-2 cursor-pointer shadow-[0_0_25px_rgba(216,180,119,0.2)]"
        >
          <span>Explore Her World</span>
          <ArrowRight className="w-4 h-4 text-[#D8B477]" />
        </button>
      </div>
    </section>
  );
};
