import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Video, Calendar, X, Lock } from 'lucide-react';

export const PrivateVideoGallery = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  const secretVideos = [
    {
      id: 1,
      title: "Late Night Laughs & Whispers",
      date: "14 SEP 2025",
      duration: "0:45",
      thumbnail: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Our Sunset Beach Walk",
      date: "20 DEC 2025",
      duration: "1:20",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <section className="relative py-8 z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {secretVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => setActiveVideo(video)}
            className="group relative rounded-3xl bg-[#101528] border border-[#D9A6B2]/15 overflow-hidden shadow-lg hover:border-[#D9A6B2]/40 transition-all duration-500 cursor-pointer"
          >
            <div className="relative h-60 w-full overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#080B16]/50 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#D9A6B2] text-[#080B16] flex items-center justify-center shadow-[0_0_30px_rgba(217,166,178,0.5)] group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-[#080B16] ml-1" />
                </div>
              </div>

              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#080B16]/80 text-[#D8B477] border border-[#D8B477]/20 text-[10px] font-mono">
                {video.duration}
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-left">
                <div className="flex items-center space-x-1.5 text-[10px] text-[#B8B6C4] font-mono mb-1">
                  <Calendar className="w-3 h-3 text-[#D9A6B2]" />
                  <span>{video.date}</span>
                </div>
                <h3 className="text-lg font-serif text-[#F8F5F0]">
                  {video.title}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Demo Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="fixed inset-0 bg-[#080B16]/90 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-2xl rounded-3xl bg-[#151B30] border border-[#D9A6B2]/30 p-6 shadow-2xl z-10 text-center"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 p-2 text-[#B8B6C4] hover:text-[#F8F5F0]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-full bg-[#101528] border border-[#D8B477]/30 flex items-center justify-center mx-auto mb-4 text-[#D8B477]">
                <Video className="w-6 h-6 animate-pulse" />
              </div>

              <h3 className="text-2xl font-serif text-[#F8F5F0] mb-2">
                {activeVideo.title}
              </h3>
              <p className="text-xs text-[#B8B6C4] font-mono mb-6">
                Recorded on {activeVideo.date}
              </p>

              <div className="p-8 rounded-2xl bg-[#101528] border border-[#D9A6B2]/15 italic font-serif text-[#F8F5F0]">
                "Private video playback ready. Dedicated streaming backend can be connected in Step 10."
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
