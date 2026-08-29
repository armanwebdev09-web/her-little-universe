import React from 'react';
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative py-12 px-6 z-10 border-t border-[#151B30]/80 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-3">
        <div className="flex items-center space-x-2 text-sm text-[#B8B6C4] font-serif tracking-wider">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 fill-[#D9A6B2] text-[#D9A6B2] inline-block animate-pulse" />
          <span>for you.</span>
        </div>

        <p className="text-xs text-[#B8B6C4]/60 tracking-widest font-sans uppercase">
          © 2026 Her Little Universe
        </p>
      </div>
    </footer>
  );
};
