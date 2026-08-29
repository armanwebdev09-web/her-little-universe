import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MemoriesHero } from '../components/MemoriesHero';
import { FeaturedMemoryCard } from '../components/FeaturedMemoryCard';
import { MemoryFilters } from '../components/MemoryFilters';
import { MemoryCard } from '../components/MemoryCard';
import { MemoryModal } from '../components/MemoryModal';
import { memoriesData } from '../data/memoriesData';
import { api } from '../services/api';
import { Sparkles, ArrowLeft, Home as HomeIcon } from 'lucide-react';

export const Memories = () => {
  const navigate = useNavigate();
  const [memoriesList, setMemoriesList] = useState(memoriesData);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedMemory, setSelectedMemory] = useState(null);

  useEffect(() => {
    const fetchApiMemories = async () => {
      try {
        const res = await api.getMemories();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setMemoriesList(res.data);
        }
      } catch (err) {
        // Fallback to local default dataset
      }
    };

    fetchApiMemories();
  }, []);

  // Filter memories array based on activeCategory
  const filteredMemories = memoriesList.filter((item) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'FAVORITES') return item.favorite === true;
    return item.category === activeCategory;
  });

  return (
    <div className="relative z-10 pb-20">
      {/* Top Banner Hero */}
      <MemoriesHero />

      {/* Featured Memory Section */}
      <FeaturedMemoryCard onSelectMemory={(item) => setSelectedMemory(item)} />

      {/* Filter Tabs & Count */}
      <MemoryFilters
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        totalCount={filteredMemories.length}
      />

      {/* Main Responsive Memory Grid */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        {filteredMemories.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
          >
            <AnimatePresence>
              {filteredMemories.map((item) => (
                <MemoryCard
                  key={item.id}
                  item={item}
                  onClick={(mem) => setSelectedMemory(mem)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 sm:p-16 rounded-3xl bg-[#151B30]/60 border border-[#D9A6B2]/15 text-center max-w-md mx-auto my-12"
          >
            <div className="w-12 h-12 rounded-full bg-[#101528] border border-[#D9A6B2]/20 flex items-center justify-center mx-auto mb-4 text-[#D8B477]">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-2xl font-serif text-[#F8F5F0] font-normal mb-2">
              Nothing here yet.
            </h3>
            <p className="text-sm text-[#B8B6C4] font-light">
              Maybe a new memory is waiting to be added.
            </p>
          </motion.div>
        )}
      </section>

      {/* Bottom CTA Section */}
      <section className="relative py-16 px-6 text-center border-t border-[#151B30]/80 max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#F8F5F0] mb-3">
          More memories are <span className="italic font-light text-[#D9A6B2]">waiting to happen.</span>
        </h2>
        <p className="text-[#B8B6C4] font-light text-base sm:text-lg mb-8">
          The album is never really finished.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate('/our-story')}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#151B30] text-[#F8F5F0] border border-[#D9A6B2]/30 hover:border-[#D9A6B2] hover:bg-[#D9A6B2]/15 text-xs font-sans tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-[#D9A6B2]" />
            <span>Back to Our Story</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#101528] text-[#B8B6C4] hover:text-[#F8F5F0] hover:bg-[#151B30] border border-[#D9A6B2]/15 text-xs font-sans tracking-widest uppercase transition-all duration-300 cursor-pointer"
          >
            <HomeIcon className="w-4 h-4 text-[#D8B477]" />
            <span>Back Home</span>
          </button>
        </div>
      </section>

      {/* Memory Lightbox Modal */}
      <MemoryModal
        selectedMemory={selectedMemory}
        memoriesList={filteredMemories.length > 0 ? filteredMemories : memoriesList}
        onClose={() => setSelectedMemory(null)}
        onNavigate={(mem) => setSelectedMemory(mem)}
      />
    </div>
  );
};
