import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Gift, Sparkles, ArrowRight } from 'lucide-react';

export const DailySurpriseTeaserCard = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-12 px-6 z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-8 sm:p-10 rounded-3xl bg-[#151B30]/70 border border-[#D8B477]/25 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(216,180,119,0.1)] hover:shadow-[0_0_50px_rgba(216,180,119,0.18)] transition-all"
        >
          <div className="flex items-center space-x-5 text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#101528] border border-[#D8B477]/40 flex items-center justify-center text-[#D8B477] shrink-0">
              <Gift className="w-7 h-7 text-[#D8B477] animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D8B477] font-semibold block mb-1">
                TODAY'S LITTLE SURPRISE
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-[#F8F5F0]">
                There's something waiting for you.
              </h3>
            </div>
          </div>

          <button
            onClick={() => navigate('/surprise')}
            className="px-6 py-3 rounded-full bg-[#D8B477] text-[#080B16] font-semibold text-xs uppercase tracking-widest hover:bg-[#F8F5F0] hover:shadow-[0_0_25px_rgba(216,180,119,0.4)] transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <span>Open It</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
