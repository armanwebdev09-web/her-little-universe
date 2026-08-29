import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export const UniverseRecap = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-12 px-6 z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-8 sm:p-12 rounded-3xl bg-[#151B30]/70 border border-[#D9A6B2]/20 backdrop-blur-xl text-center glow-card"
        >
          <div className="flex justify-center mb-3 text-[#D8B477]">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <span className="text-xs uppercase tracking-[0.25em] font-sans text-[#D8B477] font-semibold block mb-2">
            NIGHT SKY MAP
          </span>

          <h2 className="text-2xl sm:text-4xl font-serif text-[#F8F5F0] font-normal mb-3">
            Look How Far We've Come.
          </h2>

          <p className="text-sm sm:text-base text-[#B8B6C4] font-light italic font-serif max-w-lg mx-auto mb-6">
            "Every little moment became a star in our universe."
          </p>

          <button
            onClick={() => navigate('/our-universe')}
            className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full bg-[#101528] text-[#F8F5F0] border border-[#D9A6B2]/30 hover:border-[#D9A6B2] hover:bg-[#151B30] text-xs font-sans tracking-widest uppercase transition-all cursor-pointer shadow-md"
          >
            <span>Enter Our Universe</span>
            <ArrowRight className="w-4 h-4 text-[#D9A6B2]" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
