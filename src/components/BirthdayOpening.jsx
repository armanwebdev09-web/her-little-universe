import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';

export const BirthdayOpening = ({ onComplete }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // 3 second timer for automatic transition into full birthday view
    const timer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Subtle celebration confetti particle effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animId;
    const colors = ['#D9A6B2', '#D8B477', '#F8F5F0', 'rgba(217, 166, 178, 0.6)'];

    const confetti = Array.from({ length: 60 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 100,
      y: canvas.height / 2 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6 - 2,
      size: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confetti.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.alpha -= 0.01;

        if (p.alpha > 0) {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (confetti.some((p) => p.alpha > 0)) {
        animId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080B16] text-[#F8F5F0] overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

        {/* Expanding Radial Light Flare */}
        <motion.div
          initial={{ scale: 0.1, opacity: 0 }}
          animate={{ scale: 3.5, opacity: 0.4 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(217, 166, 178, 0.9) 0%, rgba(216, 180, 119, 0.4) 40%, rgba(8, 11, 22, 0) 75%)'
          }}
        />

        {/* Text Sequence */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col items-center z-20 text-center px-6"
        >
          <div className="w-16 h-16 rounded-full bg-[#151B30] border-2 border-[#D9A6B2] flex items-center justify-center text-[#D9A6B2] mb-6 shadow-[0_0_40px_rgba(217,166,178,0.5)]">
            <Sparkles className="w-8 h-8 text-[#D8B477] animate-spin" style={{ animationDuration: '8s' }} />
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-[#F8F5F0] font-normal mb-3">
            Opening your birthday gift...
          </h1>

          <p className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold">
            FOR {siteConfig.herName} ❤️
          </p>

          {/* Skip Animation Button */}
          <button
            onClick={onComplete}
            className="mt-10 px-5 py-2 rounded-full bg-[#101528] text-[#B8B6C4] hover:text-[#F8F5F0] border border-[#D9A6B2]/20 text-[10px] uppercase font-sans tracking-widest transition-colors cursor-pointer"
          >
            Skip animation →
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
