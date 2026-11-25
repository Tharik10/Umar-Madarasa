import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import PublicLayout from './components/public/PublicLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import BranchesPage from './pages/public/BranchesPage';
import CoursesPage from './pages/public/CoursesPage';
import TeachersPage from './pages/public/TeachersPage';
import EventsPage from './pages/public/EventsPage';
import AchievementsPage from './pages/public/AchievementsPage';
import GalleryPage from './pages/public/GalleryPage';
import AnnouncementsPage from './pages/public/AnnouncementsPage';
import ContactPage from './pages/public/ContactPage';
import NotFoundPage from './pages/public/NotFoundPage';

import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SettingsProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/branches" element={<BranchesPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/teachers" element={<TeachersPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/announcements" element={<AnnouncementsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </SettingsProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
