import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Gift, Calendar, ArrowLeft, Heart } from 'lucide-react';
import { api } from '../services/api';

export const SurpriseArchivePage = () => {
  const navigate = useNavigate();
  const [archive, setArchive] = useState([]);

  useEffect(() => {
    const fetchArchive = async () => {
      try {
        const res = await api.getSurpriseArchive();
        if (res.success && Array.isArray(res.data)) {
          setArchive(res.data);
        }
      } catch (err) {
        // Fallback
      }
    };

    fetchArchive();
  }, []);

  return (
    <div className="relative z-10 pt-28 pb-20 px-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#151B30] pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold block mb-1">
            SURPRISE ARCHIVE
          </span>
          <h1 className="text-3xl font-serif text-[#F8F5F0]">Past Unlocked Surprises</h1>
        </div>

        <button
          onClick={() => navigate('/surprise')}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#101528] border border-[#D9A6B2]/20 text-xs text-[#B8B6C4] hover:text-[#F8F5F0] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Today's Surprise</span>
        </button>
      </div>

      {archive.length === 0 ? (
        <div className="py-16 text-center text-[#B8B6C4] italic font-serif">
          No past surprises in the archive yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {archive.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="p-6 rounded-3xl bg-[#151B30]/80 border border-[#D9A6B2]/15 text-left space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-[#B8B6C4] font-mono">
                <span>{s.date}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#101528] text-[#D8B477] text-[10px]">
                  {s.type}
                </span>
              </div>
              <h3 className="text-xl font-serif text-[#F8F5F0]">{s.title}</h3>
              <p className="text-xs text-[#B8B6C4] font-serif italic line-clamp-3">
                "{s.message || s.question}"
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
