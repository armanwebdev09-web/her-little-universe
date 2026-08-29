import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Flower2 } from 'lucide-react';
import { api } from '../services/api';

export const LittleThingsTeaserSection = () => {
  const navigate = useNavigate();
  const [featuredThings, setFeaturedThings] = useState([]);

  useEffect(() => {
    const fetchThings = async () => {
      try {
        const res = await api.getLittleThings();
        if (res.success && Array.isArray(res.data)) {
          const featured = res.data.filter((t) => t.featured).slice(0, 3);
          setFeaturedThings(featured.length > 0 ? featured : res.data.slice(0, 3));
        }
      } catch (err) {
        // Fallback
      }
    };

    fetchThings();
  }, []);

  return (
    <section className="relative py-16 px-6 z-10 max-w-6xl mx-auto text-center space-y-10">
      <div>
        <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold block mb-2">
          BECAUSE I NOTICE
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-[#F8F5F0]">
          The little things you probably don't <br />
          <span className="italic font-light text-[#D9A6B2]">realize I notice.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {featuredThings.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-3xl bg-[#151B30]/70 border border-[#D9A6B2]/15 backdrop-blur-xl flex flex-col justify-between space-y-3 hover:border-[#D9A6B2]/30 transition-all"
          >
            <div className="space-y-2">
              <span className="text-2xl block">{item.icon || '🌷'}</span>
              <span className="text-[10px] font-mono text-[#D8B477] uppercase tracking-widest block">
                {item.title}
              </span>
              <h3 className="text-xl font-serif text-[#F8F5F0]">{item.value}</h3>
              {item.description && (
                <p className="text-xs text-[#B8B6C4] font-serif italic line-clamp-2">
                  "{item.description}"
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <button
          onClick={() => navigate('/little-things')}
          className="px-8 py-3.5 rounded-full bg-[#101528] text-[#F8F5F0] border border-[#D9A6B2]/30 hover:border-[#D9A6B2] font-semibold text-xs uppercase tracking-widest transition-all inline-flex items-center space-x-2 cursor-pointer"
        >
          <span>See All The Little Things</span>
          <ArrowRight className="w-4 h-4 text-[#D8B477]" />
        </button>
      </div>
    </section>
  );
};
