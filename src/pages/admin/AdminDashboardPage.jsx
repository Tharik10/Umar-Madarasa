import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import SeoHead from '../../components/common/SeoHead';
import {
  OverviewModule,
  EventsModule,
  YouTubeLiveModule,
  TeachersModule,
  CoursesModule,
  BranchesModule,
  AchievementsModule,
  GalleryModule,
  SliderModule,
  AnnouncementsModule,
  ContactSettingsModule,
  WebsiteSettingsModule,
} from '../../components/admin/AdminModules';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderModule = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewModule onNavigate={setActiveTab} />;
      case 'events':
        return <EventsModule />;
      case 'youtube':
        return <YouTubeLiveModule />;
      case 'teachers':
        return <TeachersModule />;
      case 'courses':
        return <CoursesModule />;
      case 'branches':
        return <BranchesModule />;
      case 'achievements':
        return <AchievementsModule />;
      case 'gallery':
        return <GalleryModule />;
      case 'slider':
        return <SliderModule />;
      case 'announcements':
        return <AnnouncementsModule />;
      case 'contact':
        return <ContactSettingsModule />;
      case 'settings':
        return <WebsiteSettingsModule />;
      default:
        return <OverviewModule onNavigate={setActiveTab} />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <SeoHead title="Admin Dashboard" />
      {renderModule()}
    </AdminLayout>
  );
}
