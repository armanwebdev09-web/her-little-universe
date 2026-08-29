import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, Home as HomeIcon } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 pt-36 pb-24 px-6 max-w-xl mx-auto text-center space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-20 h-20 mx-auto rounded-full bg-[#151B30] border border-[#D8B477]/30 flex items-center justify-center text-[#D8B477] shadow-[0_0_40px_rgba(216,180,119,0.2)]"
      >
        <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '12s' }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <span className="text-xs font-mono text-[#D8B477] uppercase tracking-widest block font-semibold">
          404 • PAGE NOT FOUND
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#F8F5F0]">
          Looks like we wandered somewhere <br />
          <span className="italic font-light text-[#D9A6B2]">that doesn't exist.</span>
        </h1>
        <p className="text-sm text-[#B8B6C4] font-serif italic pt-2">
          "Don't worry, every path leads back to where we belong."
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pt-4"
      >
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3.5 rounded-full bg-[#D9A6B2] text-[#080B16] font-semibold text-xs uppercase tracking-widest hover:bg-[#F8F5F0] transition-colors inline-flex items-center space-x-2 cursor-pointer shadow-[0_0_20px_rgba(217,166,178,0.3)]"
        >
          <HomeIcon className="w-4 h-4" />
          <span>Take Me Home</span>
        </button>
      </motion.div>
    </div>
  );
};
