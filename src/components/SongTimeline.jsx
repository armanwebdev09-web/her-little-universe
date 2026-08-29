import React from 'react';
import { motion } from 'framer-motion';
import { Play, Lock, CheckCircle2, Music, Calendar } from 'lucide-react';

export const SongTimeline = ({
  songs,
  currentSong,
  isPlaying,
  onSelectSong,
  isSongLocked,
}) => {
  return (
    <section className="relative py-16 px-6 z-10">
      <div className="max-w-4xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold block mb-2">
            TIMELINE
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F8F5F0] font-normal mb-2">
            The Songs So Far
          </h2>
          <p className="text-[#B8B6C4] font-light text-base">
            A daily collection of melodies and memories.
          </p>
        </motion.div>

        {/* Songs List */}
        <div className="space-y-4">
          {songs.map((song, index) => {
            const locked = isSongLocked(song);
            const isCurrent = currentSong?.id === song.id;

            return (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`relative rounded-2xl p-5 border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[#151B30] border-[#D9A6B2] shadow-[0_0_30px_rgba(217,166,178,0.2)]'
                    : locked
                    ? 'bg-[#101528]/50 border-[#151B30] opacity-80'
                    : 'bg-[#151B30]/60 border-[#D9A6B2]/15 hover:border-[#D9A6B2]/40 hover:bg-[#151B30]/90'
                }`}
              >
                {locked ? (
                  /* Future Locked Card (Mysterious) */
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-2">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-[#080B16] border border-[#D9A6B2]/20 flex items-center justify-center text-[#D8B477]">
                        <Lock className="w-5 h-5 text-[#D8B477]" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono text-[#D8B477] uppercase tracking-wider font-semibold">
                            DAY {song.dayNumber} • LOCKED
                          </span>
                        </div>
                        <h3 className="text-lg font-serif text-[#F8F5F0]/70 italic">
                          "There's a song waiting for you."
                        </h3>
                        <p className="text-xs text-[#B8B6C4]/60 font-mono mt-0.5">
                          Come back on {song.date}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 py-2 rounded-full bg-[#080B16] border border-[#151B30] text-xs font-mono text-[#B8B6C4]/50">
                      🔒 Not yet available
                    </div>
                  </div>
                ) : (
                  /* Unlocked Available Song Card */
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Album Cover Thumbnail */}
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#101528] border border-[#D9A6B2]/20 flex-shrink-0">
                        <img
                          src={song.cover}
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                        {isCurrent && isPlaying && (
                          <div className="absolute inset-0 bg-[#080B16]/60 backdrop-blur-[1px] flex items-center justify-center">
                            <Music className="w-5 h-5 text-[#D9A6B2] animate-bounce" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div>
                        <div className="flex items-center space-x-2 text-xs font-mono text-[#B8B6C4] mb-0.5">
                          <span className="text-[#D8B477] font-semibold">DAY {song.dayNumber}</span>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-[#D9A6B2]" />
                            <span>{song.date}</span>
                          </span>
                          <span>•</span>
                          <span className="text-[#D9A6B2] flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>UNLOCKED</span>
                          </span>
                        </div>

                        <h3 className="text-lg font-serif font-normal text-[#F8F5F0]">
                          {song.title}
                        </h3>
                        <p className="text-xs text-[#B8B6C4] font-light">
                          {song.artist}
                        </p>
                        {song.message && (
                          <p className="text-xs text-[#B8B6C4]/80 italic font-serif mt-1 line-clamp-1">
                            "{song.message}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Play Button */}
                    <button
                      onClick={() => onSelectSong(song)}
                      className={`px-5 py-2.5 rounded-full text-xs font-sans tracking-widest uppercase transition-all duration-300 flex items-center space-x-2 cursor-pointer ${
                        isCurrent && isPlaying
                          ? 'bg-[#D9A6B2] text-[#080B16] font-semibold shadow-[0_0_15px_rgba(217,166,178,0.4)]'
                          : 'bg-[#101528] text-[#F8F5F0] hover:bg-[#D9A6B2] hover:text-[#080B16] border border-[#D9A6B2]/20'
                      }`}
                    >
                      <Play className={`w-3.5 h-3.5 ${isCurrent && isPlaying ? 'fill-[#080B16]' : 'fill-current'}`} />
                      <span>{isCurrent && isPlaying ? 'PLAYING' : 'LISTEN'}</span>
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
