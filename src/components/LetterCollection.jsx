import React from 'react';
import { motion } from 'framer-motion';
import { LetterCard } from './LetterCard';

export const LetterCollection = ({ letters, onOpenLetter }) => {
  return (
    <section className="relative py-12 px-6 z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#D8B477] font-semibold block mb-2">
            COLLECTION
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F8F5F0] font-normal mb-2">
            Letters I've Written For You
          </h2>
          <p className="text-[#B8B6C4] font-light text-base sm:text-lg">
            Personal thoughts and quiet notes saved forever.
          </p>
        </motion.div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {letters.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <LetterCard item={item} onOpenLetter={onOpenLetter} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
