import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export const BirthdayStorySection = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.getStoryEvents();
        if (res.success && Array.isArray(res.data)) {
          const featured = res.data.filter((e) => e.featured).slice(0, 3);
          setEvents(featured.length > 0 ? featured : res.data.slice(0, 3));
        }
      } catch (err) {
        // Fallback
      }
    };

    fetchEvents();
  }, []);

  if (events.length === 0) return null;

  return (
    <section className="relative py-16 px-6 max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold block">
          OUR MILESTONES
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-[#F8F5F0]">
          Somewhere along the way, <br />
          <span className="italic font-light text-[#D9A6B2]">this became our story.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {events.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-3xl bg-[#151B30]/70 border border-[#D9A6B2]/20 backdrop-blur-xl flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#D8B477] uppercase block">{item.date}</span>
              <h3 className="text-xl font-serif text-[#F8F5F0]">{item.title}</h3>
              <p className="text-xs text-[#B8B6C4] font-serif italic line-clamp-3">"{item.description}"</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate('/our-story')}
          className="px-8 py-3.5 rounded-full bg-[#101528] text-[#F8F5F0] border border-[#D9A6B2]/30 hover:border-[#D9A6B2] font-semibold text-xs uppercase tracking-widest transition-all inline-flex items-center space-x-2 cursor-pointer"
        >
          <span>See Our Whole Story</span>
          <ArrowRight className="w-4 h-4 text-[#D9A6B2]" />
        </button>
      </div>
    </section>
  );
};
