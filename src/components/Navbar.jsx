import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Menu, X, Sparkles, Lock } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';

export const Navbar = ({ onComingSoonClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isBirthdayLocked =
    new Date().getTime() < new Date(siteConfig.birthdayDate).getTime() &&
    !siteConfig.allowBypassBirthdayLock;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, item) => {
    if (item.comingSoon) {
      e.preventDefault();
      onComingSoonClick(item.label);
      setMobileMenuOpen(false);
      return;
    }

    if (item.label === 'Home') {
      e.preventDefault();
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
      setMobileMenuOpen(false);
      return;
    }

    if (item.label === 'Little Things') {
      e.preventDefault();
      if (location.pathname === '/little-things') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/little-things');
      }
      setMobileMenuOpen(false);
      return;
    }

    if (item.label === 'Surprise') {
      e.preventDefault();
      if (location.pathname === '/surprise') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/surprise');
      }
      setMobileMenuOpen(false);
      return;
    }

    if (item.label === 'Our Story') {
      e.preventDefault();
      if (location.pathname === '/our-story') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/our-story');
      }
      setMobileMenuOpen(false);
      return;
    }

    if (item.label === 'Memories') {
      e.preventDefault();
      if (location.pathname === '/memories') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/memories');
      }
      setMobileMenuOpen(false);
      return;
    }

    if (item.label === 'Songs') {
      e.preventDefault();
      if (location.pathname === '/songs') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/songs');
      }
      setMobileMenuOpen(false);
      return;
    }

    if (item.label === 'Letters') {
      e.preventDefault();
      if (location.pathname === '/letters') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/letters');
      }
      setMobileMenuOpen(false);
      return;
    }

    if (item.label === 'Our Universe') {
      e.preventDefault();
      if (location.pathname === '/our-universe') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/our-universe');
      }
      setMobileMenuOpen(false);
      return;
    }

    if (item.label === 'Secret') {
      e.preventDefault();
      if (location.pathname === '/secret') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/secret');
      }
      setMobileMenuOpen(false);
      return;
    }

    if (item.label === 'Birthday') {
      e.preventDefault();
      if (location.pathname === '/birthday') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/birthday');
      }
      setMobileMenuOpen(false);
      return;
    }

    if (item.href.startsWith('#')) {
      e.preventDefault();
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.querySelector(item.href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.querySelector(item.href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
    }
  };

  const isLinkActive = (item) => {
    if (item.label === 'Home' && location.pathname === '/') return true;
    if (item.label === 'Little Things' && location.pathname === '/little-things') return true;
    if (item.label === 'Surprise' && (location.pathname === '/surprise' || location.pathname === '/surprise/archive')) return true;
    if (item.label === 'Our Story' && location.pathname === '/our-story') return true;
    if (item.label === 'Memories' && location.pathname === '/memories') return true;
    if (item.label === 'Songs' && location.pathname === '/songs') return true;
    if (item.label === 'Letters' && location.pathname === '/letters') return true;
    if (item.label === 'Our Universe' && location.pathname === '/our-universe') return true;
    if (item.label === 'Secret' && location.pathname === '/secret') return true;
    if (item.label === 'Birthday' && location.pathname === '/birthday') return true;
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-3.5 glass-nav shadow-lg'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="group flex items-center space-x-2 text-left tracking-[0.22em] font-serif text-lg sm:text-xl font-medium text-[#F8F5F0] hover:text-[#D9A6B2] transition-colors duration-300"
        >
          <Sparkles className="w-4 h-4 text-[#D8B477] opacity-80 group-hover:rotate-12 transition-transform duration-300" />
          <span>HER LITTLE UNIVERSE</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {siteConfig.navItems.map((item) => {
            const active = isLinkActive(item);
            const isBdayLocked = item.label === 'Birthday' && isBirthdayLocked;

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`px-3 py-1.5 rounded-full text-xs lg:text-sm tracking-widest font-sans uppercase transition-all duration-300 relative group flex items-center space-x-1 ${
                  item.isSpecial
                    ? 'text-[#D9A6B2] border border-[#D9A6B2]/30 hover:border-[#D9A6B2] hover:bg-[#D9A6B2]/10 hover:shadow-[0_0_15px_rgba(217,166,178,0.25)]'
                    : active
                    ? 'text-[#F8F5F0] font-semibold border-b-2 border-[#D9A6B2]'
                    : 'text-[#B8B6C4] hover:text-[#F8F5F0]'
                }`}
              >
                <span>{item.label}</span>
                {isBdayLocked && (
                  <Lock className="w-3 h-3 text-[#D8B477]/80 inline-block ml-0.5" />
                )}
                {item.comingSoon && (
                  <span className="ml-1 text-[9px] lowercase opacity-40 group-hover:opacity-70">
                    ✦
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Mobile Menu Icon Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#B8B6C4] hover:text-[#F8F5F0] hover:bg-[#151B30]/60 transition-colors focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-[#D9A6B2]" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-[#080B16]/95 backdrop-blur-xl border-b border-[#D9A6B2]/15 py-6 px-8 flex flex-col space-y-4 shadow-2xl transition-all animate-fadeIn">
          {siteConfig.navItems.map((item) => {
            const active = isLinkActive(item);
            const isBdayLocked = item.label === 'Birthday' && isBirthdayLocked;

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`py-2 text-sm tracking-widest uppercase flex items-center justify-between border-b border-[#151B30]/50 ${
                  active
                    ? 'text-[#D9A6B2] font-semibold'
                    : 'text-[#F8F5F0] hover:text-[#D9A6B2]'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <span>{item.label}</span>
                  {isBdayLocked && (
                    <Lock className="w-3.5 h-3.5 text-[#D8B477]" />
                  )}
                </div>
                {item.comingSoon ? (
                  <span className="text-[10px] uppercase tracking-normal px-2 py-0.5 rounded-full bg-[#151B30] text-[#B8B6C4] border border-[#D9A6B2]/20">
                    Soon
                  </span>
                ) : (
                  <span className="text-[#D8B477]">→</span>
                )}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};
