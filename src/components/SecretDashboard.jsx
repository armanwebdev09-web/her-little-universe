import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Camera,
  Video,
  Mail,
  Moon,
  FileText,
  Sparkles,
  Home as HomeIcon,
  LogOut,
  Heart
} from 'lucide-react';
import { useSecretAuth } from '../context/SecretAuthContext';
import { PrivatePhotoGallery } from './PrivatePhotoGallery';
import { PrivateVideoGallery } from './PrivateVideoGallery';
import { PrivateLetterSection } from './PrivateLetterSection';
import { secretNotesData, secretFeaturedMemory } from '../data/secretMemoriesData';
import { api } from '../services/api';

export const SecretDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useSecretAuth();
  const [activeTab, setActiveTab] = useState('PHOTOS');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.getSecretItems();
        if (res.success && Array.isArray(res.items)) {
          setItems(res.items);
        }
      } catch (err) {
        // Fallback to local default data
      }
    };

    fetchItems();
  }, []);

  const notesList = items.filter((i) => i.type === 'NOTE');
  const memoriesList = items.filter((i) => i.type === 'MEMORY');

  const tabs = [
    { id: 'PHOTOS', label: 'Private Photos', icon: Camera },
    { id: 'VIDEOS', label: 'Private Videos', icon: Video },
    { id: 'LETTERS', label: 'Private Letters', icon: Mail },
    { id: 'MEMORIES', label: 'Hidden Memories', icon: Moon },
    { id: 'NOTES', label: 'Things I Never Said', icon: FileText },
  ];

  return (
    <div className="relative z-10 pt-28 pb-20 px-6 max-w-6xl mx-auto font-sans">
      {/* Top Bar with Lock Action */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#151B30]">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#101528] border border-[#D8B477]/30 text-xs font-semibold text-[#D8B477]">
          <Lock className="w-3.5 h-3.5" />
          <span className="tracking-[0.2em] uppercase">PRIVATE SPACE UNLOCKED</span>
        </div>

        <button
          onClick={logout}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#151B30] text-[#D9A6B2] border border-[#D9A6B2]/30 hover:bg-rose-500/10 hover:border-rose-400 text-xs font-sans uppercase tracking-widest transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Lock Secret Space</span>
        </button>
      </div>

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <span className="text-xs uppercase tracking-[0.25em] text-[#D9A6B2] font-semibold block mb-2">
          OUR PRIVATE CORNER
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif font-normal text-[#F8F5F0] mb-3">
          Welcome to our <span className="italic font-light text-[#D9A6B2]">little secret.</span>
        </h1>
        <p className="text-[#B8B6C4] font-light text-base sm:text-lg max-w-xl mx-auto font-serif italic">
          "These are the things I wanted to keep close, just for us."
        </p>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-sans tracking-widest uppercase transition-all duration-300 flex items-center space-x-2 cursor-pointer ${
                isActive
                  ? 'bg-[#D9A6B2] text-[#080B16] font-semibold shadow-[0_0_20px_rgba(217,166,178,0.4)]'
                  : 'bg-[#151B30]/70 text-[#B8B6C4] hover:text-[#F8F5F0] hover:bg-[#151B30] border border-[#D9A6B2]/15'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'PHOTOS' && (
          <motion.div
            key="photos"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <PrivatePhotoGallery />
          </motion.div>
        )}

        {activeTab === 'VIDEOS' && (
          <motion.div
            key="videos"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <PrivateVideoGallery />
          </motion.div>
        )}

        {activeTab === 'LETTERS' && (
          <motion.div
            key="letters"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <PrivateLetterSection />
          </motion.div>
        )}

        {activeTab === 'MEMORIES' && (
          <motion.div
            key="memories"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="py-4 space-y-6"
          >
            {(memoriesList.length > 0 ? memoriesList : [secretFeaturedMemory]).map((mem) => (
              <div key={mem.id} className="relative rounded-3xl bg-[#101528] border-2 border-[#D9A6B2]/30 p-8 sm:p-12 shadow-[0_0_50px_rgba(217,166,178,0.18)] max-w-4xl mx-auto overflow-hidden">
                <div className="flex items-center space-x-2 text-[#D8B477] mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-widest font-semibold">
                    HIDDEN SECRET MEMORY
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-7 h-64 sm:h-80 rounded-2xl overflow-hidden bg-[#080B16] border border-[#D9A6B2]/20">
                    <img
                      src={mem.image || mem.imageUrl || secretFeaturedMemory.image}
                      alt={mem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="md:col-span-5 text-left space-y-4">
                    <span className="text-xs font-mono text-[#D9A6B2]">{mem.date}</span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-[#F8F5F0]">
                      {mem.title}
                    </h3>
                    <p className="text-sm text-[#B8B6C4] font-light leading-relaxed italic font-serif">
                      "{mem.caption || mem.description}"
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-[#D9A6B2]">
                      <Heart className="w-4 h-4 fill-[#D9A6B2]" />
                      <span>Kept close to heart forever</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'NOTES' && (
          <motion.div
            key="notes"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="py-4 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {(notesList.length > 0 ? notesList : secretNotesData).map((note) => (
              <div
                key={note.id}
                className="p-6 rounded-3xl bg-[#101528] border border-[#D9A6B2]/20 text-left shadow-lg"
              >
                <div className="w-8 h-8 rounded-full bg-[#151B30] border border-[#D8B477]/30 flex items-center justify-center text-[#D8B477] mb-4">
                  <Heart className="w-4 h-4 fill-[#D8B477]/20" />
                </div>
                <span className="text-[10px] font-mono text-[#D9A6B2] block mb-1">{note.date}</span>
                <h4 className="text-lg font-serif text-[#F8F5F0] mb-2">
                  {note.title}
                </h4>
                <p className="text-sm text-[#B8B6C4] font-serif italic leading-relaxed">
                  "{note.content || note.text}"
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Lock / Return Section */}
      <div className="mt-16 pt-8 border-t border-[#151B30] flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#151B30] text-[#D9A6B2] border border-[#D9A6B2]/30 hover:border-[#D9A6B2] text-xs font-sans tracking-widest uppercase transition-all cursor-pointer shadow-md"
        >
          <Lock className="w-4 h-4" />
          <span>Lock Secret Space</span>
        </button>

        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#101528] text-[#B8B6C4] hover:text-[#F8F5F0] border border-[#D9A6B2]/15 text-xs font-sans tracking-widest uppercase transition-all cursor-pointer"
        >
          <HomeIcon className="w-4 h-4 text-[#D8B477]" />
          <span>Back Home</span>
        </button>
      </div>
    </div>
  );
};
