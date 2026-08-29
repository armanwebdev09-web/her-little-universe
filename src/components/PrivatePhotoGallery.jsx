import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Lock, Image as ImageIcon } from 'lucide-react';
import { secretPhotosData } from '../data/secretPhotosData';
import { PrivateImageViewer } from './PrivateImageViewer';
import { api } from '../services/api';

export const PrivatePhotoGallery = () => {
  const [photosList, setPhotosList] = useState(secretPhotosData);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchPrivatePhotos = async () => {
      try {
        const res = await api.getSecretItems('PHOTO');
        if (res.success && Array.isArray(res.items) && res.items.length > 0) {
          setPhotosList(res.items);
        }
      } catch (err) {
        // Fallback to local default data
      }
    };

    fetchPrivatePhotos();
  }, []);

  return (
    <section className="relative py-8 z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photosList.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            onClick={() => setSelectedPhoto(item)}
            className="group relative rounded-3xl bg-[#101528] border border-[#D9A6B2]/15 overflow-hidden shadow-lg hover:border-[#D9A6B2]/40 transition-all duration-500 cursor-pointer"
          >
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <img
                src={item.image || item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B16] via-transparent to-transparent opacity-80" />

              <div className="absolute top-3 left-3 p-1.5 rounded-full bg-[#080B16]/80 backdrop-blur-md border border-[#D9A6B2]/20 text-[#D8B477]">
                <Lock className="w-3.5 h-3.5" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-left">
                <div className="flex items-center space-x-1.5 text-[10px] text-[#B8B6C4] font-mono mb-1">
                  <Calendar className="w-3 h-3 text-[#D9A6B2]" />
                  <span>{item.date}</span>
                </div>
                <h3 className="text-lg font-serif font-normal text-[#F8F5F0] group-hover:text-[#D9A6B2] transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <PrivateImageViewer
        selectedPhoto={selectedPhoto}
        photosList={photosList}
        onClose={() => setSelectedPhoto(null)}
        onNavigate={(photo) => setSelectedPhoto(photo)}
      />
    </section>
  );
};
