import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass } from 'lucide-react';

export const ConstellationBanner = () => {
  return (
    <section className="relative py-12 px-6 z-10 text-center max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="p-8 sm:p-12 rounded-3xl bg-[#151B30]/60 border border-[#D9A6B2]/15 backdrop-blur-xl glow-card"
      >
        <div className="flex justify-center mb-4 text-[#D8B477]">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>

        <span className="text-xs uppercase tracking-[0.25em] font-sans text-[#D8B477] font-semibold block mb-3">
          OUR CONSTELLATION
        </span>

        <p className="text-xl sm:text-3xl font-serif text-[#F8F5F0] font-light italic leading-relaxed max-w-2xl mx-auto">
          "Somewhere between all these little moments, there is an entire universe that belongs to us."
        </p>
      </motion.div>
    </section>
  );
};
