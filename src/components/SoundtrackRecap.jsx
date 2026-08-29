import React from 'react';
import { motion } from 'framer-motion';
import { Play, Music, Calendar } from 'lucide-react';
import { songsData } from '../data/songsData';

export const SoundtrackRecap = ({ onSelectSong }) => {
  return (
    <section className="relative py-12 px-6 z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold block mb-2">
            PLAYLIST RECAP
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif text-[#F8F5F0] font-normal mb-2">
            Our Soundtrack
          </h2>
          <p className="text-sm text-[#B8B6C4] font-light">
            All the songs I chose for you step by step.
          </p>
        </motion.div>

        {/* Songs Playlist Grid */}
        <div className="space-y-3">
          {songsData.slice(0, 5).map((song, index) => (
            <div
              key={song.id}
              onClick={() => onSelectSong(song)}
              className="p-4 rounded-2xl bg-[#151B30]/70 border border-[#D9A6B2]/15 flex items-center justify-between hover:bg-[#151B30] hover:border-[#D9A6B2]/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#101528] flex-shrink-0 relative">
                  <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#080B16]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 fill-[#F8F5F0] text-[#F8F5F0]" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-serif font-semibold text-[#F8F5F0] group-hover:text-[#D9A6B2] transition-colors">
                    {song.title}
                  </h4>
                  <p className="text-xs text-[#B8B6C4] font-sans">{song.artist}</p>
                </div>
              </div>

              <div className="text-xs text-[#B8B6C4] font-mono hidden sm:flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-[#D8B477]" />
                <span>{song.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
