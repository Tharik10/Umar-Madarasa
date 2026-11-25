import React from 'react';
import { X, Calendar, Clock, Youtube, ExternalLink, MapPin } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getYouTubeEmbedUrl, isValidYouTubeUrl } from '../../lib/youtube';

export default function EventModal({ event, onClose }) {
  const { pick, t } = useLanguage();
  if (!event) return null;

  const hasYoutube = isValidYouTubeUrl(event.youtube_url);
  const embedUrl = getYouTubeEmbedUrl(event.youtube_url);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-amber-400/30 animate-fade-in my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-950 text-white">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 text-xs font-extrabold">
              {event.status}
            </span>
            <h3 className="font-bold text-base sm:text-lg line-clamp-1">{pick(event, 'title')}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-amber-300 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {hasYoutube && embedUrl ? (
          <div className="aspect-video w-full bg-black">
            <iframe
              src={embedUrl}
              title={pick(event, 'title')}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : event.poster_url ? (
          <div className="max-h-96 overflow-hidden bg-emerald-950 flex items-center justify-center">
            <img
              src={event.poster_url}
              alt={pick(event, 'title')}
              className="w-full max-h-96 object-contain"
            />
          </div>
        ) : null}

        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-emerald-900">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-lg">
              <Calendar className="w-4 h-4 text-amber-600" />
              {event.event_date}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-lg">
              <Clock className="w-4 h-4 text-amber-600" />
              {event.event_time}
            </span>
            {event.madarasa_branches && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-lg">
                <MapPin className="w-4 h-4 text-amber-600" />
                {pick(event.madarasa_branches, 'name')}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-extrabold text-emerald-950">{pick(event, 'title')}</h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">
            {pick(event, 'description')}
          </p>

          {hasYoutube && (
            <div className="pt-3 flex flex-wrap gap-3">
              <a
                href={event.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow transition"
              >
                <Youtube className="w-4 h-4" />
                <span>{t('watchOnYoutube')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
