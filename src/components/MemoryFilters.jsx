import React from 'react';
import { Sparkles, Star } from 'lucide-react';

export const MemoryFilters = ({
  activeCategory,
  onSelectCategory,
  totalCount,
}) => {
  const categories = [
    { label: 'ALL', value: 'ALL' },
    { label: 'MOMENTS', value: 'MOMENTS' },
    { label: 'ADVENTURES', value: 'ADVENTURES' },
    { label: 'SPECIAL DAYS', value: 'SPECIAL DAYS' },
    { label: 'RANDOM', value: 'RANDOM' },
    { label: 'FAVORITES', value: 'FAVORITES', icon: Star },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-6 mb-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#151B30]">
        {/* Dynamic Memory Count */}
        <div className="flex items-center space-x-2 text-[#F8F5F0]">
          <Sparkles className="w-4 h-4 text-[#D8B477]" />
          <span className="font-serif text-lg sm:text-xl font-normal">
            {totalCount} {totalCount === 1 ? 'little memory' : 'little memories'}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.value;
            const Icon = cat.icon;

            return (
              <button
                key={cat.value}
                onClick={() => onSelectCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-xs font-sans tracking-widest uppercase transition-all duration-300 flex items-center space-x-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#D9A6B2] text-[#080B16] font-semibold shadow-[0_0_20px_rgba(217,166,178,0.4)]'
                    : 'bg-[#151B30]/70 text-[#B8B6C4] hover:text-[#F8F5F0] hover:bg-[#151B30] border border-[#D9A6B2]/15'
                }`}
              >
                {Icon && (
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'fill-[#080B16] text-[#080B16]' : 'text-[#D8B477]'
                    }`}
                  />
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
