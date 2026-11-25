import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Youtube, ExternalLink, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';

export default function Footer() {
  const { t, pick } = useLanguage();
  const { settings } = useSettings();
  const year = new Date().getFullYear();
  const whatsappDigits = (settings.whatsapp_number || '').replace(/[^0-9]/g, '');

  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={settings.logo_url || '/logo.png'}
                alt="Umar Madarasa Logo"
                className="w-14 h-14 rounded-full object-contain bg-emerald-900 p-0.5 border border-amber-400/50"
              />
              <div>
                <h3 className="text-white font-bold text-base leading-snug">
                  {pick(settings, 'institution_name')}
                </h3>
                <p className="text-xs text-amber-300">{pick(settings, 'tagline')}</p>
              </div>
            </div>
            <p className="text-sm text-emerald-200/85 leading-relaxed">
              {pick(settings, 'about_summary')}
            </p>
            {settings.youtube_channel_url && (
              <a
                href={settings.youtube_channel_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow transition"
              >
                <Youtube className="w-4 h-4" />
                <span>{t('subscribeYoutube')}</span>
              </a>
            )}
          </div>

          <div>
            <h4 className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-4">
              {t('about')} & Academics
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-amber-300 transition">{t('about')}</Link></li>
              <li><Link to="/branches" className="hover:text-amber-300 transition">{t('branches')}</Link></li>
              <li><Link to="/courses" className="hover:text-amber-300 transition">{t('courses')}</Link></li>
              <li><Link to="/teachers" className="hover:text-amber-300 transition">{t('teachers')}</Link></li>
              <li><Link to="/achievements" className="hover:text-amber-300 transition">{t('achievements')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-4">
              Programs & Media
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/events" className="hover:text-amber-300 transition">{t('events')}</Link></li>
              <li><Link to="/gallery" className="hover:text-amber-300 transition">{t('gallery')}</Link></li>
              <li><Link to="/announcements" className="hover:text-amber-300 transition">{t('announcements')}</Link></li>
              <li><Link to="/contact" className="hover:text-amber-300 transition">{t('contact')}</Link></li>
              <li><Link to="/admin/login" className="text-amber-300/80 hover:text-amber-300 transition">{t('adminLogin')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-4">
              {t('contact')}
            </h4>
            <ul className="space-y-3 text-sm text-emerald-100/90">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <span>{pick(settings, 'address')}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings.phone_number}`} className="hover:text-amber-300">{settings.phone_number}</a>
              </li>
              {whatsappDigits && (
                <li className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <a href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
                    WhatsApp: {settings.whatsapp_number}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-amber-300">{settings.email}</a>
              </li>
              {settings.google_maps_url && (
                <li>
                  <a href={settings.google_maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-amber-300 hover:underline text-xs font-semibold pt-1">
                    <span>Open Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#021d16] border-t border-emerald-900 py-4 px-4 text-center text-xs text-emerald-300/80">
        © {year} {settings.institution_name_en} ({settings.institution_name_ta}). {t('footerRights')}
      </div>
    </footer>
  );
}
