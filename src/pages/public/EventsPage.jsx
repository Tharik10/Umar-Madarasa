import React, { useEffect, useState } from 'react';
import { Youtube } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';
import EventCard from '../../components/public/EventCard';
import EventModal from '../../components/public/EventModal';
import SeoHead from '../../components/common/SeoHead';
import { LoadingSpinner, EmptyState } from '../../components/common/StateFeedback';

export default function EventsPage() {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const [events, setEvents] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('events')
        .select('*, madarasa_branches(name_en, name_ta)')
        .eq('is_published', true)
        .order('event_date', { ascending: false });
      setEvents(data || []);
      setLoading(false);
    }
    loadEvents();
  }, []);

  const statuses = ['ALL', 'Live', 'Upcoming', 'Completed'];
  const filtered =
    statusFilter === 'ALL' ? events : events.filter((e) => e.status === statusFilter);

  return (
    <div className="pb-20">
      <SeoHead
        title="Events & YouTube Live Programs"
        description="Watch live and recorded Islamic programs, annual functions, and upcoming events from Umar Makthab and Hifl Madarasa."
      />

      <section className="islamic-pattern text-white py-14 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
              Gatherings & Broadcasts
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">{t('events')}</h1>
          </div>
          {settings.youtube_channel_url && (
            <a
              href={settings.youtube_channel_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow transition"
            >
              <Youtube className="w-4 h-4" />
              <span>{t('subscribeYoutube')}</span>
            </a>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-wrap gap-2 mb-8">
          {statuses.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-emerald-900 text-amber-300 shadow'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-700'
              }`}
            >
              {st === 'ALL' ? 'All Programs' : st}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState title={t('noRecords')} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((ev) => (
              <EventCard key={ev.id} event={ev} onSelectEvent={setSelectedEvent} />
            ))}
          </div>
        )}
      </div>

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
