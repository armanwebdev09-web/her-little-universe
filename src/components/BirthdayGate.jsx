import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Gift, Lock, Home as HomeIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export const BirthdayGate = ({ statusData, onUnlockReady }) => {
  const navigate = useNavigate();
  const [todayCountdown, setTodayCountdown] = useState(null);
  const [archive, setArchive] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    days: statusData?.daysRemaining || 0,
    hours: statusData?.hoursRemaining || 0,
    minutes: statusData?.minutesRemaining || 0,
    seconds: statusData?.secondsRemaining || 0,
  });

  useEffect(() => {
    if (statusData) {
      setTimeLeft({
        days: statusData.daysRemaining || 0,
        hours: statusData.hoursRemaining || 0,
        minutes: statusData.minutesRemaining || 0,
        seconds: statusData.secondsRemaining || 0,
      });
    }

    const fetchCountdownData = async () => {
      try {
        const todayRes = await api.getTodayCountdown();
        if (todayRes.success && todayRes.data) {
          setTodayCountdown(todayRes.data);
        }

        const archiveRes = await api.getCountdownArchive();
        if (archiveRes.success && Array.isArray(archiveRes.data)) {
          setArchive(archiveRes.data);
        }
      } catch (err) {
        // Fallback
      }
    };

    fetchCountdownData();
  }, [statusData]);

  // Live second decrement loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          if (onUnlockReady) onUnlockReady();
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onUnlockReady]);

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-6 pt-28 pb-16 z-10 overflow-hidden space-y-12">
      {/* Ambient Glow */}
      <div 
        className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full pointer-events-none opacity-20 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(217, 166, 178, 0.4) 0%, rgba(216, 180, 119, 0.15) 50%, rgba(8, 11, 22, 0) 70%)'
        }}
      />

      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {/* Locked Gift Box Visual */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#151B30]/90 border border-[#D8B477]/40 flex items-center justify-center text-[#D8B477] shadow-[0_0_50px_rgba(216,180,119,0.2)] mb-6"
        >
          <Gift className="w-10 h-10 text-[#D8B477]" />
          <div className="absolute -top-1.5 -right-1.5 p-1.5 rounded-full bg-[#080B16] border border-[#D9A6B2] text-[#D9A6B2]">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* Small Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#101528] border border-[#D8B477]/30 backdrop-blur-md mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D8B477]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold">
            SOMETHING SPECIAL IS COMING
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal text-[#F8F5F0] tracking-tight leading-tight mb-4"
        >
          Something special is <br />
          <span className="italic font-light text-[#D9A6B2]">getting closer every day.</span>
        </motion.h1>

        {/* Countdown Grid */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-xl mb-8"
        >
          {[
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HOURS', value: timeLeft.hours },
            { label: 'MINUTES', value: timeLeft.minutes },
            { label: 'SECONDS', value: timeLeft.seconds },
          ].map((unit) => (
            <div
              key={unit.label}
              className="p-4 rounded-2xl bg-[#151B30]/70 border border-[#D9A6B2]/15 backdrop-blur-md text-center"
            >
              <span className="text-3xl sm:text-4xl font-serif text-[#F8F5F0] block">
                {formatNumber(unit.value)}
              </span>
              <span className="text-[10px] tracking-[0.2em] font-sans text-[#B8B6C4] uppercase font-medium">
                {unit.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Today's Countdown Revealed Card */}
        {todayCountdown && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl p-8 rounded-3xl bg-[#151B30]/80 border border-[#D9A6B2]/30 backdrop-blur-xl shadow-[0_0_40px_rgba(217,166,178,0.15)] text-center space-y-3 mb-8"
          >
            <span className="text-[10px] font-mono text-[#D8B477] uppercase tracking-widest block font-semibold">
              TODAY'S COUNTDOWN REVEAL • DAY {todayCountdown.dayOffset}
            </span>
            <h3 className="text-2xl font-serif text-[#F8F5F0]">{todayCountdown.title}</h3>
            {todayCountdown.personalMessage && (
              <p className="text-sm text-[#B8B6C4] font-serif italic">"{todayCountdown.personalMessage}"</p>
            )}
          </motion.div>
        )}

        {/* Countdown Days Released Archive */}
        {archive.length > 0 && (
          <div className="w-full max-w-xl space-y-4">
            <span className="text-xs font-mono text-[#D8B477] uppercase tracking-widest block text-center">
              COUNTDOWN STORY ARCHIVE
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {archive.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border backdrop-blur-md ${
                    item.locked
                      ? 'bg-[#101528]/40 border-[#151B30] text-[#B8B6C4]/40'
                      : 'bg-[#151B30]/60 border-[#D9A6B2]/20 text-[#F8F5F0]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase text-[#D8B477]">
                      Day {item.dayOffset}
                    </span>
                    {item.locked ? (
                      <Lock className="w-3.5 h-3.5 text-[#B8B6C4]/40" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <h4 className="text-sm font-serif font-medium">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Return Button */}
        <motion.button
          onClick={() => navigate('/')}
          className="mt-8 flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#101528] text-[#B8B6C4] hover:text-[#F8F5F0] hover:bg-[#151B30] border border-[#D9A6B2]/15 text-xs font-sans tracking-widest uppercase transition-all cursor-pointer"
        >
          <HomeIcon className="w-4 h-4 text-[#D8B477]" />
          <span>Go Back Home</span>
        </motion.button>
      </div>
    </section>
  );
};
