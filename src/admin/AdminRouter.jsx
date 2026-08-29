import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminLayout } from './components/AdminLayout';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminSongs } from './pages/AdminSongs';
import { AdminSurprises } from './pages/AdminSurprises';
import { AdminStory } from './pages/AdminStory';
import { AdminLittleThings } from './pages/AdminLittleThings';
import { AdminMemories } from './pages/AdminMemories';
import { AdminLetters } from './pages/AdminLetters';
import { AdminQuotes } from './pages/AdminQuotes';
import { AdminUniverse } from './pages/AdminUniverse';
import { AdminSecret } from './pages/AdminSecret';
import { AdminBirthday } from './pages/AdminBirthday';
import { AdminBirthdayCountdown } from './pages/AdminBirthdayCountdown';
import { AdminSettings } from './pages/AdminSettings';

export const AdminRouter = () => {
  const { isAdminAuthenticated } = useAdminAuth();

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/songs" element={<AdminSongs />} />
        <Route path="/surprises" element={<AdminSurprises />} />
        <Route path="/story" element={<AdminStory />} />
        <Route path="/little-things" element={<AdminLittleThings />} />
        <Route path="/memories" element={<AdminMemories />} />
        <Route path="/letters" element={<AdminLetters />} />
        <Route path="/quotes" element={<AdminQuotes />} />
        <Route path="/universe" element={<AdminUniverse />} />
        <Route path="/secret" element={<AdminSecret />} />
        <Route path="/birthday" element={<AdminBirthday />} />
        <Route path="/birthday/countdown" element={<AdminBirthdayCountdown />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
};
