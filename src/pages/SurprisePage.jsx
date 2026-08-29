import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Gift, Sparkles, HelpCircle, Heart, Music, Mail, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export const SurprisePage = () => {
  const navigate = useNavigate();
  const [todaySurprise, setTodaySurprise] = useState(null);
  const todayStr = new Date().toISOString().split('T')[0];
  const storageKey = `dailySurpriseOpened_${todayStr}`;

  const [isOpened, setIsOpened] = useState(() => {
    return localStorage.getItem(storageKey) === 'true';
  });

  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const fetchTodaySurprise = async () => {
      try {
        const res = await api.getTodaySurprise();
        if (res.success && res.data) {
          setTodaySurprise(res.data);
        }
      } catch (err) {
        // Fallback
      }
    };

    fetchTodaySurprise();
  }, []);

  const handleOpenSurprise = () => {
    setIsOpened(true);
    localStorage.setItem(storageKey, 'true');
  };

  return (
    <div className="relative z-10 pt-28 pb-20 px-6 max-w-4xl mx-auto text-center min-h-[80vh] flex flex-col justify-center items-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold block mb-2">
          DAILY SELECTION
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif text-[#F8F5F0]">
          Today's Little <span className="italic font-light text-[#D9A6B2]">Surprise.</span>
        </h1>
        <p className="text-[#B8B6C4] font-light text-sm sm:text-base mt-2">
          One small gift chosen just for you every day.
        </p>
      </motion.div>

      {todaySurprise ? (
        <div className="w-full max-w-xl mx-auto">
          {!isOpened ? (
            /* Unopened Gift State */
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-10 rounded-3xl bg-[#151B30]/80 border border-[#D9A6B2]/20 backdrop-blur-xl shadow-2xl space-y-6 flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-[#101528] border border-[#D8B477]/40 flex items-center justify-center text-[#D8B477] shadow-[0_0_40px_rgba(216,180,119,0.2)]">
                <Gift className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-serif text-[#F8F5F0]">Something small for you.</h3>
                <p className="text-xs text-[#B8B6C4] font-mono">{todaySurprise.date}</p>
              </div>

              <button
                onClick={handleOpenSurprise}
                className="px-8 py-3.5 rounded-full bg-[#D9A6B2] text-[#080B16] font-semibold text-xs uppercase tracking-widest hover:bg-[#F8F5F0] hover:shadow-[0_0_30px_rgba(217,166,178,0.5)] transition-all cursor-pointer"
              >
                {todaySurprise.buttonText || 'Open Today\'s Surprise ❤️'}
              </button>
            </motion.div>
          ) : (
            /* Revealed Surprise Content Card */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="p-8 sm:p-10 rounded-3xl bg-[#151B30]/90 border border-[#D9A6B2]/30 backdrop-blur-xl shadow-[0_0_50px_rgba(217,166,178,0.15)] text-left space-y-6"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#101528] text-[#D8B477] border border-[#D8B477]/30 text-[10px] font-mono font-semibold uppercase tracking-widest flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>OPENED FOR TODAY</span>
                </span>
                <span className="text-xs text-[#B8B6C4] font-mono">{todaySurprise.date}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif text-[#F8F5F0]">{todaySurprise.title}</h2>

              {todaySurprise.imageUrl && (
                <div className="rounded-2xl overflow-hidden h-64 bg-[#080B16] border border-[#D9A6B2]/20">
                  <img src={todaySurprise.imageUrl} alt={todaySurprise.title} className="w-full h-full object-cover" />
                </div>
              )}

              {todaySurprise.type === 'QUESTION' ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#101528] border border-[#D9A6B2]/15 text-sm font-serif italic text-[#F8F5F0]">
                    "{todaySurprise.question}"
                  </div>

                  {!showAnswer ? (
                    <button
                      onClick={() => setShowAnswer(true)}
                      className="px-5 py-2.5 rounded-full bg-[#101528] border border-[#D8B477]/40 text-[#D8B477] hover:bg-[#151B30] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Reveal Answer
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl bg-[#101528] border border-[#D8B477]/30 text-sm font-serif text-[#D8B477] leading-relaxed"
                    >
                      💡 {todaySurprise.answer}
                    </motion.div>
                  )}
                </div>
              ) : (
                todaySurprise.message && (
                  <p className="text-base text-[#B8B6C4] font-serif italic leading-relaxed">
                    "{todaySurprise.message}"
                  </p>
                )
              )}

              <div className="pt-4 border-t border-[#101528] flex items-center justify-between text-xs text-[#B8B6C4]">
                <button
                  onClick={() => navigate('/surprise/archive')}
                  className="flex items-center space-x-1.5 text-[#D9A6B2] hover:underline cursor-pointer"
                >
                  <span>View Previous Surprises</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="p-10 rounded-3xl bg-[#151B30]/60 border border-[#D9A6B2]/15 text-center max-w-md mx-auto">
          <Gift className="w-10 h-10 text-[#D8B477] mx-auto mb-3 opacity-60" />
          <h3 className="text-xl font-serif text-[#F8F5F0] mb-1">Some days need no surprise.</h3>
          <p className="text-xs text-[#B8B6C4]">Check back tomorrow for the next little moment.</p>
        </div>
      )}
    </div>
  );
};
