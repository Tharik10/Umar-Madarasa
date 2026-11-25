import React from 'react';
import { Calendar, Clock, Youtube, Radio, MapPin, Eye } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { isValidYouTubeUrl, getYouTubeThumbnailUrl } from '../../lib/youtube';

export default function EventCard({ event, onSelectEvent }) {
  const { t, pick } = useLanguage();
  const hasYoutube = isValidYouTubeUrl(event.youtube_url);
  const poster = event.poster_url || getYouTubeThumbnailUrl(event.youtube_url);

  const statusBadge = {
    Live: 'bg-red-600 text-white animate-pulse',
    Upcoming: 'bg-amber-400 text-emerald-950',
    Completed: 'bg-emerald-900 text-emerald-100',
  }[event.status] || 'bg-emerald-800 text-white';

  return (
    <article
      onClick={() => onSelectEvent && onSelectEvent(event)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelectEvent && onSelectEvent(event)}
      className="group bg-white rounded-2xl overflow-hidden border border-emerald-900/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      <div className="relative h-52 bg-emerald-950 overflow-hidden">
        {poster ? (
          <img
            src={poster}
            alt={pick(event, 'title')}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full islamic-pattern flex items-center justify-center p-6 text-center">
            <span className="font-serif text-amber-300 text-xl">{pick(event, 'title')}</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide shadow ${statusBadge}`}>
            {event.status === 'Live' && <Radio className="w-3.5 h-3.5 inline mr-1" />}
            {event.status}
          </span>
        </div>
        {hasYoutube && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-red-600/95 text-white text-xs font-bold flex items-center gap-1 shadow">
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube</span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-emerald-800 mb-2">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            {event.event_date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {event.event_time}
          </span>
        </div>

        <h3 className="text-lg font-bold text-emerald-950 group-hover:text-emerald-700 transition mb-2 line-clamp-2">
          {pick(event, 'title')}
        </h3>

        <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
          {pick(event, 'description')}
        </p>

        {event.madarasa_branches && (
          <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>{pick(event.madarasa_branches, 'name')}</span>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          {hasYoutube ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600">
              <Youtube className="w-4 h-4" />
              {t('watchOnYoutube')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <Eye className="w-4 h-4" />
              {t('viewDetails')}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
