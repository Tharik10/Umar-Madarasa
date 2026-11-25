import React from 'react';
import { MapPin, Phone, MessageCircle, Mail, Youtube, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';
import SeoHead from '../../components/common/SeoHead';

export default function ContactPage() {
  const { t, pick } = useLanguage();
  const { settings } = useSettings();
  const whatsappDigits = (settings.whatsapp_number || '').replace(/[^0-9]/g, '');

  return (
    <div className="pb-20">
      <SeoHead
        title="Contact Us"
        description="Get in touch with Umar Makthab and Hifl Madarasa via phone, WhatsApp, email, or visit our campus."
      />

      <section className="islamic-pattern text-white py-14 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
            Reach Out
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">{t('contact')}</h1>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900">
              <MapPin className="w-6 h-6 text-amber-600" />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-extrabold text-emerald-950">Madarasa Address</h2>
              <p className="text-sm text-slate-700 leading-relaxed">{pick(settings, 'address')}</p>
              {settings.google_maps_url && (
                <a
                  href={settings.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline pt-1"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900">
              <Phone className="w-6 h-6 text-amber-600" />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-extrabold text-emerald-950">Phone Contact</h2>
              <a
                href={`tel:${settings.phone_number}`}
                className="text-base font-bold text-emerald-900 hover:text-amber-700 block"
              >
                {settings.phone_number}
              </a>
              <p className="text-xs text-slate-500">Available during Madarasa office hours</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900">
              <MessageCircle className="w-6 h-6 text-emerald-700" />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-extrabold text-emerald-950">WhatsApp Direct</h2>
              <p className="text-sm font-semibold text-slate-700">{settings.whatsapp_number}</p>
              {whatsappDigits && (
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition mt-1"
                >
                  <span>Message on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900">
              <Mail className="w-6 h-6 text-amber-600" />
            </div>
            <div className="space-y-2">
              <h2 className="font-extrabold text-emerald-950">Email & Official Channel</h2>
              <a
                href={`mailto:${settings.email}`}
                className="text-sm font-semibold text-emerald-900 hover:underline block"
              >
                {settings.email}
              </a>
              {settings.youtube_channel_url && (
                <a
                  href={settings.youtube_channel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition"
                >
                  <Youtube className="w-4 h-4" />
                  <span>{t('subscribeYoutube')}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
