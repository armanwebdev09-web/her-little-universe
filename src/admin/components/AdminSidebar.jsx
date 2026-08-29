import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Music,
  Camera,
  Mail,
  Quote,
  Sparkles,
  Lock,
  Gift,
  Settings,
  LogOut,
  Gift as SurpriseIcon,
  Heart as StoryIcon,
  Flower2 as ThingIcon,
  CalendarDays
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminSidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Songs', href: '/admin/songs', icon: Music },
    { label: 'Daily Surprises', href: '/admin/surprises', icon: SurpriseIcon },
    { label: 'Our Story', href: '/admin/story', icon: StoryIcon },
    { label: 'The Little Things', href: '/admin/little-things', icon: ThingIcon },
    { label: 'Memories', href: '/admin/memories', icon: Camera },
    { label: 'Letters', href: '/admin/letters', icon: Mail },
    { label: 'Quotes', href: '/admin/quotes', icon: Quote },
    { label: 'Universe', href: '/admin/universe', icon: Sparkles },
    { label: 'Secret Space', href: '/admin/secret', icon: Lock },
    { label: 'Birthday', href: '/admin/birthday', icon: Gift },
    { label: 'Countdown Planner', href: '/admin/birthday/countdown', icon: CalendarDays },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleNav = (href) => {
    navigate(href);
    if (setMobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between min-h-screen p-4 border-r border-slate-800">
      <div>
        {/* Brand */}
        <div className="flex items-center space-x-2.5 px-3 py-4 mb-6 border-b border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white font-bold text-sm">
            H
          </div>
          <div>
            <h2 className="text-sm font-sans font-semibold text-white tracking-wide">
              HER LITTLE UNIVERSE
            </h2>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
              MANAGEMENT DASHBOARD
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <button
                key={item.label}
                onClick={() => handleNav(item.href)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-500 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Lock Admin Logout Button */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700/50 hover:border-rose-900 text-xs font-sans font-medium transition-colors cursor-pointer"
        >
          <span className="flex items-center space-x-2">
            <LogOut className="w-4 h-4" />
            <span>Lock Admin</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500">ESC</span>
        </button>
      </div>
    </aside>
  );
};
