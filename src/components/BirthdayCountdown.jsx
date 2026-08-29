import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { siteConfig } from '../data/siteConfig';

export const BirthdayCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isToday: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(siteConfig.birthdayDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isToday: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <section id="birthday" className="relative py-24 px-6 z-10">
      <div className="max-w-5xl mx-auto text-center">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-medium block mb-2">
            COUNTDOWN
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F8F5F0] font-normal mb-3">
            Something special is getting closer.
          </h2>
          <p className="text-[#B8B6C4] font-light text-base sm:text-lg">
            Counting down to your day.
          </p>
        </motion.div>

        {/* Countdown Display Card */}
        {timeLeft.isToday ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="p-10 sm:p-16 rounded-3xl glass-panel border border-[#D9A6B2]/30 max-w-2xl mx-auto shadow-[0_0_50px_rgba(217,166,178,0.2)] text-center"
          >
            <h3 className="text-4xl sm:text-6xl font-serif text-[#D9A6B2] mb-4">
              Today is your day. ❤️
            </h3>
            <p className="text-[#F8F5F0] text-lg font-light">
              Happy Birthday, {siteConfig.herName}! May your universe shine brighter than ever today.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HOURS', value: timeLeft.hours },
              { label: 'MINUTES', value: timeLeft.minutes },
              { label: 'SECONDS', value: timeLeft.seconds },
            ].map((unit, index) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative p-6 sm:p-8 rounded-2xl bg-[#151B30]/70 border border-[#D9A6B2]/15 backdrop-blur-md glow-card-hover group flex flex-col items-center justify-center"
              >
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#D9A6B2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <span className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-[#F8F5F0] tracking-tight group-hover:text-[#D9A6B2] transition-colors duration-300">
                  {formatNumber(unit.value)}
                </span>
                <span className="mt-3 text-[10px] sm:text-xs tracking-[0.25em] font-sans text-[#B8B6C4] uppercase font-medium">
                  {unit.label}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
