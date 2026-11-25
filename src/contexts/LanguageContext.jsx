import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const UI_STRINGS = {
  en: {
    home: 'Home',
    about: 'About Us',
    branches: 'Branches',
    courses: 'Courses',
    teachers: 'Teachers',
    events: 'Events & Live',
    achievements: 'Achievements',
    gallery: 'Gallery',
    announcements: 'Announcements',
    contact: 'Contact',
    adminLogin: 'Admin Portal',
    exploreCourses: 'Explore Courses',
    watchLive: 'Watch Programs',
    upcomingEvents: 'Upcoming Events & Programs',
    livePrograms: 'Live & Upcoming YouTube Programs',
    aboutIntro: 'About Umar Madarasa',
    featuredCourses: 'Featured Courses & Classes',
    ourTeachers: 'Dedicated Faculty & Huffaz',
    recentAchievements: 'Student & Institutional Achievements',
    latestAnnouncements: 'Latest Announcements',
    photoGallery: 'Campus & Event Gallery',
    subscribeYoutube: 'Subscribe to Our Official YouTube Channel',
    viewAll: 'View All',
    readMore: 'Read More',
    noRecords: 'No published records available yet.',
    loading: 'Loading content...',
    timingLabel: 'Class Timing',
    experienceLabel: 'Experience',
    years: 'Years',
    allBranches: 'All Branches',
    allCategories: 'All Categories',
    watchOnYoutube: 'Watch on YouTube',
    viewDetails: 'View Event Details',
    footerRights: 'All rights reserved.',
  },
  ta: {
    home: 'முகப்பு',
    about: 'எங்களைப் பற்றி',
    branches: 'கிளைகள்',
    courses: 'பாடப்பிரிவுகள்',
    teachers: 'ஆசிரியர்கள்',
    events: 'நிகழ்வுகள் & நேரலை',
    achievements: 'சாதனைகள்',
    gallery: 'புகைப்படத் தொகுப்பு',
    announcements: 'அறிவிப்புகள்',
    contact: 'தொடர்புக்கு',
    adminLogin: 'நிர்வாகம்',
    exploreCourses: 'பாடப்பிரிவுகளைக் காண்க',
    watchLive: 'நிகழ்ச்சிகளைக் காண்க',
    upcomingEvents: 'வரவிருக்கும் நிகழ்வுகள் & நிகழ்ச்சிகள்',
    livePrograms: 'யூடியூப் நேரலை மற்றும் நிகழ்ச்சிகள்',
    aboutIntro: 'உமர் மதரஸா அறிமுகம்',
    featuredCourses: 'சிறப்பு பாடப்பிரிவுகள்',
    ourTeachers: 'தகுதிவாய்ந்த ஆசிரியர்கள் & ஹாஃபிழ்கள்',
    recentAchievements: 'மாணவர் மற்றும் நிறுவன சாதனைகள்',
    latestAnnouncements: 'முக்கிய அறிவிப்புகள்',
    photoGallery: 'புகைப்படத் தொகுப்பு',
    subscribeYoutube: 'எங்கள் அதிகாரப்பூர்வ யூடியூப் சேனலை சப்ஸ்கிரைப் செய்யுங்கள்',
    viewAll: 'அனைத்தையும் காண்க',
    readMore: 'மேலும் படிக்க',
    noRecords: 'தற்போது தகவல்கள் எதுவும் பதிவேற்றப்படவில்லை.',
    loading: 'தகவல்கள் ஏற்றப்படுகின்றன...',
    timingLabel: 'வகுப்பு நேரம்',
    experienceLabel: 'அனுபவம்',
    years: 'ஆண்டுகள்',
    allBranches: 'அனைத்து கிளைகள்',
    allCategories: 'அனைத்து பிரிவுகள்',
    watchOnYoutube: 'யூடியூபில் காண்க',
    viewDetails: 'நிகழ்வு விவரங்கள்',
    footerRights: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const toggleLanguage = () => setLang((prev) => (prev === 'en' ? 'ta' : 'en'));
  const t = (key) => UI_STRINGS[lang]?.[key] || UI_STRINGS.en[key] || key;
  const pick = (record, baseField) => {
    if (!record) return '';
    if (lang === 'ta' && record[`${baseField}_ta`]) return record[`${baseField}_ta`];
    return record[`${baseField}_en`] || record[baseField] || '';
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, pick }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
