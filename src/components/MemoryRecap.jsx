import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { memoriesData } from '../data/memoriesData';
import { MemoryModal } from './MemoryModal';

export const MemoryRecap = () => {
  const navigate = useNavigate();
  const [selectedMemory, setSelectedMemory] = useState(null);

  const sampleMemories = memoriesData.slice(0, 4);

  return (
    <section className="relative py-12 px-6 z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold block mb-2">
            SCRAPBOOK HIGHLIGHTS
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif text-[#F8F5F0] font-normal mb-2">
            A Few Moments
          </h2>
          <p className="text-sm text-[#B8B6C4] font-light">
            Selected snapshots from our scrapbook album.
          </p>
        </motion.div>

        {/* Memories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {sampleMemories.map((mem) => (
            <div
              key={mem.id}
              onClick={() => setSelectedMemory(mem)}
              className="group relative h-56 rounded-2xl overflow-hidden bg-[#101528] border border-[#D9A6B2]/15 cursor-pointer shadow-md"
            >
              <img src={mem.image} alt={mem.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B16] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="text-[9px] font-mono text-[#D8B477] block mb-0.5">{mem.date}</span>
                <h4 className="text-sm font-serif text-[#F8F5F0] group-hover:text-[#D9A6B2] transition-colors">{mem.title}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/memories')}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#151B30] text-[#F8F5F0] border border-[#D9A6B2]/30 hover:bg-[#D9A6B2]/15 text-xs font-sans tracking-widest uppercase transition-colors cursor-pointer"
          >
            <span>See All Memories</span>
            <ArrowRight className="w-4 h-4 text-[#D9A6B2]" />
          </button>
        </div>
      </div>

      <MemoryModal
        selectedMemory={selectedMemory}
        memoriesList={sampleMemories}
        onClose={() => setSelectedMemory(null)}
        onNavigate={(m) => setSelectedMemory(m)}
      />
    </section>
  );
};
