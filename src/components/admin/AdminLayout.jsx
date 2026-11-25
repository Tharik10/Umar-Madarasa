import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Youtube,
  Users,
  BookOpen,
  Building2,
  Award,
  Image as ImageIcon,
  SlidersHorizontal,
  Bell,
  PhoneCall,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';

export const ADMIN_MENU_ITEMS = [
  { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'events', label: 'Events Management', icon: Calendar },
  { id: 'youtube', label: 'YouTube Live Management', icon: Youtube },
  { id: 'teachers', label: 'Teachers Management', icon: Users },
  { id: 'courses', label: 'Courses Management', icon: BookOpen },
  { id: 'branches', label: 'Madarasa Branch Management', icon: Building2 },
  { id: 'achievements', label: 'Achievements Management', icon: Award },
  { id: 'gallery', label: 'Gallery Management', icon: ImageIcon },
  { id: 'slider', label: 'Homepage Slider Management', icon: SlidersHorizontal },
  { id: 'announcements', label: 'Announcements Management', icon: Bell },
  { id: 'contact', label: 'Contact Settings', icon: PhoneCall },
  { id: 'settings', label: 'Website Settings', icon: Settings },
];

export default function AdminLayout({ activeTab, setActiveTab, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { adminProfile, signOutAdmin } = useAuth();
  const { settings } = useSettings();

  const handleSelect = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-emerald-950 text-white flex flex-col border-r border-amber-400/20 transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={settings.logo_url || '/logo.png'}
              alt="Umar Madarasa Logo"
              className="w-11 h-11 rounded-full object-contain bg-emerald-900 border border-amber-400/60"
            />
            <div>
              <span className="block text-sm font-extrabold leading-tight">Umar Madarasa</span>
              <span className="block text-[11px] text-amber-300">Admin Control Panel</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg bg-emerald-900 text-amber-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {ADMIN_MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-bold transition cursor-pointer ${
                  active
                    ? 'bg-amber-400 text-emerald-950 shadow'
                    : 'text-emerald-100 hover:bg-emerald-900/80 hover:text-amber-200'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-emerald-900 space-y-2">
          <div className="px-3 py-2 rounded-xl bg-emerald-900/60 text-xs">
            <p className="font-bold text-white truncate">{adminProfile?.full_name || 'Administrator'}</p>
            <p className="text-emerald-300 text-[11px] truncate">{adminProfile?.email}</p>
          </div>
          <button
            type="button"
            onClick={signOutAdmin}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="lg:hidden p-2 rounded-xl bg-emerald-950 text-amber-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-extrabold text-emerald-950">
              {ADMIN_MENU_ITEMS.find((m) => m.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>

          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-900/15 transition"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
