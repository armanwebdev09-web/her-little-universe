import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star as StarIcon, Eye } from 'lucide-react';
import { constellationLines, secretEasterEggStar } from '../data/universeData';

export const StarField = ({
  stars,
  discoveredIds,
  onSelectStar,
}) => {
  const [hoveredStar, setHoveredStar] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  // Convert percentage positions into SVG coordinate points for constellation lines
  const getStarById = (id) => stars.find((s) => s.id === id);

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 mb-16 z-20">
      <div
        onMouseMove={handleMouseMove}
        className="relative w-full h-[550px] sm:h-[650px] md:h-[720px] rounded-3xl bg-[#080B16]/90 border border-[#D9A6B2]/20 backdrop-blur-2xl overflow-hidden shadow-[0_0_60px_rgba(8,11,22,0.9)] group"
      >
        {/* Subtle Ambient Radial Glowing Backdrop */}
        <div 
          className="absolute inset-0 pointer-events-none transition-transform duration-1000 ease-out opacity-30"
          style={{
            transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
            background: 'radial-gradient(circle at 45% 40%, rgba(217, 166, 178, 0.25) 0%, rgba(216, 180, 119, 0.1) 45%, rgba(8, 11, 22, 0) 75%)'
          }}
        />

        {/* Constellation SVG Lines Layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-700 ease-out z-10"
          style={{
            transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`,
          }}
        >
          {constellationLines.map(([startId, endId], idx) => {
            const startStar = getStarById(startId);
            const endStar = getStarById(endId);
            if (!startStar || !endStar) return null;

            return (
              <line
                key={`line-${idx}`}
                x1={`${startStar.position.x}%`}
                y1={`${startStar.position.y}%`}
                x2={`${endStar.position.x}%`}
                y2={`${endStar.position.y}%`}
                stroke="rgba(217, 166, 178, 0.25)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
            );
          })}
        </svg>

        {/* Main Star Nodes Layer (Parallax shift) */}
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out z-20"
          style={{
            transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
          }}
        >
          {/* Memory Stars */}
          {stars.map((star) => {
            const isDiscovered = discoveredIds.includes(star.id);
            const isToday = star.isTodayStar;

            return (
              <div
                key={star.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/star"
                style={{
                  left: `${star.position.x}%`,
                  top: `${star.position.y}%`,
                }}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                onClick={() => onSelectStar(star)}
              >
                {/* Touch-Friendly Enlarged Invisible Tap Area */}
                <div className="absolute -inset-4 rounded-full pointer-events-auto" />

                {/* Outer Glow Ring */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isToday
                      ? 'bg-[#D9A6B2]/20 border border-[#D9A6B2] shadow-[0_0_25px_rgba(217,166,178,0.6)] animate-pulse'
                      : isDiscovered
                      ? 'bg-[#D8B477]/15 border border-[#D8B477]/40'
                      : 'bg-transparent hover:bg-[#D9A6B2]/15 border border-transparent hover:border-[#D9A6B2]/40'
                  }`}
                >
                  {/* Central Star Point */}
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      isToday
                        ? 'w-3 h-3 bg-[#D9A6B2] shadow-[0_0_12px_#D9A6B2]'
                        : isDiscovered
                        ? 'w-2.5 h-2.5 bg-[#D8B477] shadow-[0_0_8px_#D8B477]'
                        : 'w-2 h-2 bg-[#F8F5F0]/80 group-hover/star:bg-[#D9A6B2] group-hover/star:scale-150'
                    }`}
                  />
                </div>

                {/* Hover Tooltip displaying Star Title */}
                {hoveredStar?.id === star.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#151B30] border border-[#D9A6B2]/30 text-[11px] font-serif text-[#F8F5F0] whitespace-nowrap shadow-xl z-30 pointer-events-none"
                  >
                    <span className="flex items-center space-x-1">
                      <span>{star.title}</span>
                      {isDiscovered && (
                        <Eye className="w-3 h-3 text-[#D8B477] inline" />
                      )}
                    </span>
                  </motion.div>
                )}
              </div>
            );
          })}

          {/* Hidden Easter Egg Star in Upper Right Corner */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer opacity-30 hover:opacity-100 transition-opacity"
            style={{
              left: `${secretEasterEggStar.position.x}%`,
              top: `${secretEasterEggStar.position.y}%`,
            }}
            onClick={() => onSelectStar(secretEasterEggStar)}
            title="Secret Star"
          >
            <div className="w-6 h-6 rounded-full bg-transparent hover:bg-[#D9A6B2]/20 border border-transparent hover:border-[#D9A6B2] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D9A6B2]/50 animate-ping" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
