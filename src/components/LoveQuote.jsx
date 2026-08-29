import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Quote } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { api } from '../services/api';

export const LoveQuote = () => {
  const [quoteData, setQuoteData] = useState(siteConfig.quote);

  useEffect(() => {
    const fetchApiQuotes = async () => {
      try {
        const res = await api.getQuotes();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const active = res.data.filter((q) => q.active !== false);
          if (active.length > 0) {
            const randomQuote = active[Math.floor(Math.random() * active.length)];
            setQuoteData({
              text: randomQuote.quote || randomQuote.text,
              subtext: randomQuote.subtext || randomQuote.author || siteConfig.quote.subtext,
            });
          }
        }
      } catch (err) {
        // Fallback to default quote
      }
    };

    fetchApiQuotes();
  }, []);

  return (
    <section className="relative py-24 px-6 z-10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative p-10 sm:p-16 rounded-3xl bg-[#151B30]/60 border border-[#D9A6B2]/15 backdrop-blur-xl glow-card max-w-3xl mx-auto overflow-hidden"
        >
          {/* Subtle Corner Accents */}
          <div className="absolute top-4 left-4 text-[#D9A6B2]/20">
            <Quote className="w-8 h-8 rotate-180" />
          </div>
          <div className="absolute bottom-4 right-4 text-[#D9A6B2]/20">
            <Quote className="w-8 h-8" />
          </div>

          {/* Glowing Center Sparkle */}
          <div className="flex justify-center mb-6">
            <div className="p-3 rounded-full bg-[#101528] border border-[#D9A6B2]/20 text-[#D8B477]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          {/* Quote Text */}
          <blockquote className="text-2xl sm:text-4xl md:text-5xl font-serif text-[#F8F5F0] font-light leading-snug sm:leading-relaxed tracking-tight italic mb-6">
            "{quoteData.text}"
          </blockquote>

          {/* Subtext */}
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] font-sans text-[#D9A6B2] font-medium">
            — {quoteData.subtext}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
