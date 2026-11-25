import React, { useEffect, useState } from 'react';
import { Bell, Calendar, Paperclip } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import SeoHead from '../../components/common/SeoHead';
import { LoadingSpinner, EmptyState } from '../../components/common/StateFeedback';

export default function AnnouncementsPage() {
  const { t, pick } = useLanguage();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnnouncements() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .eq('status', 'Active')
        .order('publish_date', { ascending: false });
      setAnnouncements(data || []);
      setLoading(false);
    }
    loadAnnouncements();
  }, []);

  return (
    <div className="pb-20">
      <SeoHead
        title="Announcements"
        description="Official notices, admissions updates, and announcements from Umar Makthab and Hifl Madarasa."
      />

      <section className="islamic-pattern text-white py-14 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
            Notice Board
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">{t('announcements')}</h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <LoadingSpinner />
        ) : announcements.length === 0 ? (
          <EmptyState title={t('noRecords')} />
        ) : (
          <div className="space-y-5">
            {announcements.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-emerald-900/10 shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.publish_date}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800">
                    <Bell className="w-3.5 h-3.5" />
                    {item.status}
                  </span>
                </div>

                <h2 className="text-xl font-extrabold text-emerald-950">{pick(item, 'title')}</h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {pick(item, 'description')}
                </p>

                {item.attachment_url && (
                  <div className="pt-2">
                    <a
                      href={item.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-900/15 transition"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-amber-600" />
                      <span>{item.attachment_label || 'View Attachment'}</span>
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
