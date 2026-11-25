import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Globe, ShieldCheck, PhoneCall } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, toggleLanguage, t, pick } = useLanguage();
  const { settings } = useSettings();

  const navItems = [
    { to: '/', label: t('home') },
    { to: '/about', label: t('about') },
    { to: '/branches', label: t('branches') },
    { to: '/courses', label: t('courses') },
    { to: '/teachers', label: t('teachers') },
    { to: '/events', label: t('events') },
    { to: '/achievements', label: t('achievements') },
    { to: '/gallery', label: t('gallery') },
    { to: '/announcements', label: t('announcements') },
    { to: '/contact', label: t('contact') },
  ];

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
        : 'text-emerald-50 hover:text-amber-300 hover:bg-emerald-900/70'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-emerald-950/95 backdrop-blur-md border-b border-amber-400/20 shadow-lg">
      <div className="bg-[#02221a] border-b border-emerald-900/80 text-xs text-emerald-100/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="font-serif text-amber-300 text-sm tracking-wide">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </span>
            <span className="hidden md:inline text-emerald-300/70">|</span>
            <a
              href={`tel:${settings.phone_number}`}
              className="hidden sm:inline-flex items-center gap-1.5 hover:text-amber-300 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              {settings.phone_number}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label="Switch Language between English and Tamil"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 font-semibold border border-amber-400/30 transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 text-emerald-200 hover:text-amber-300 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('adminLogin')}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-md group-hover:scale-105 transition-transform">
              <img
                src={settings.logo_url || '/logo.png'}
                alt="Umar Makthab and Hifl Madarasa Official Logo"
                className="w-full h-full object-contain rounded-full bg-emerald-950"
              />
            </div>
            <div>
              <span className="block text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight">
                {pick(settings, 'institution_name')}
              </span>
              <span className="block text-xs text-amber-300/90 font-medium">
                {lang === 'en' ? settings.institution_name_ta : settings.institution_name_en}
              </span>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === '/'}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileOpen}
            className="xl:hidden p-2.5 rounded-xl bg-emerald-900 text-amber-300 hover:bg-emerald-800 border border-amber-400/25 transition"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="xl:hidden bg-emerald-950 border-t border-amber-400/20 px-4 pt-3 pb-6 space-y-1.5 shadow-2xl"
          aria-label="Mobile Navigation"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'text-emerald-50 hover:bg-emerald-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
