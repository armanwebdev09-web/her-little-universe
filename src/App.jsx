import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SecretAuthProvider } from './context/SecretAuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminToastProvider } from './context/AdminToastContext';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import { StarBackground } from './components/StarBackground';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { OurStory } from './pages/OurStory';
import { LittleThingsPage } from './pages/LittleThingsPage';
import { Memories } from './pages/Memories';
import { Songs } from './pages/Songs';
import { SurprisePage } from './pages/SurprisePage';
import { SurpriseArchivePage } from './pages/SurpriseArchivePage';
import { Letters } from './pages/Letters';
import { OurUniverse } from './pages/OurUniverse';
import { Secret } from './pages/Secret';
import { Birthday } from './pages/Birthday';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminRouter } from './admin/AdminRouter';
import { Footer } from './components/Footer';
import { ComingSoonModal } from './components/ComingSoonModal';

// Helper component to reset scroll position on route change and update page titles
function RouteTracker() {
  const { pathname } = useLocation();
  useDocumentTitle();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MainLayout() {
  const [comingSoonModal, setComingSoonModal] = useState({
    isOpen: false,
    sectionName: '',
  });

  const handleOpenComingSoon = (sectionName) => {
    setComingSoonModal({
      isOpen: true,
      sectionName,
    });
  };

  const handleCloseComingSoon = () => {
    setComingSoonModal({
      isOpen: false,
      sectionName: '',
    });
  };

  return (
    <div className="relative min-h-screen bg-[#080B16] text-[#F8F5F0] overflow-x-hidden font-sans selection:bg-[#D9A6B2]/30 selection:text-[#F8F5F0]">
      <RouteTracker />

      {/* Dynamic Canvas Starry Sky */}
      <StarBackground />

      {/* Sticky Navbar */}
      <Navbar onComingSoonClick={handleOpenComingSoon} />

      {/* Public Routes */}
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/little-things" element={<LittleThingsPage />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/surprise" element={<SurprisePage />} />
          <Route path="/surprise/archive" element={<SurpriseArchivePage />} />
          <Route path="/letters" element={<Letters />} />
          <Route path="/our-universe" element={<OurUniverse />} />
          <Route path="/secret" element={<Secret />} />
          <Route path="/birthday" element={<Birthday />} />
          {/* Custom 404 page for unhandled routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Coming Soon Modal */}
      <ComingSoonModal
        isOpen={comingSoonModal.isOpen}
        sectionName={comingSoonModal.sectionName}
        onClose={handleCloseComingSoon}
      />
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <AdminToastProvider>
        <SecretAuthProvider>
          <Router>
            <Routes>
              {/* Separate Admin Panel Route Shell */}
              <Route path="/admin/*" element={<AdminRouter />} />

              {/* Public Website Shell */}
              <Route path="/*" element={<MainLayout />} />
            </Routes>
          </Router>
        </SecretAuthProvider>
      </AdminToastProvider>
    </AdminAuthProvider>
  );
}
