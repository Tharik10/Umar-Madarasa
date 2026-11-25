import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import SeoHead from '../../components/common/SeoHead';
import { LoadingSpinner, EmptyState } from '../../components/common/StateFeedback';

const GALLERY_CATEGORIES = [
  'ALL',
  'Group Photos',
  'Annual Functions',
  'Educational Programs',
  'Student Activities',
  'Special Events',
];

export default function GalleryPage() {
  const { t, pick } = useLanguage();
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('ALL');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });
      setImages(data || []);
      setLoading(false);
    }
    loadGallery();
  }, []);

  const filtered =
    category === 'ALL' ? images : images.filter((img) => img.category === category);

  return (
    <div className="pb-20">
      <SeoHead
        title="Photo Gallery"
        description="Photo gallery of Umar Makthab and Hifl Madarasa events, student activities, and annual functions."
      />

      <section className="islamic-pattern text-white py-14 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
            Visual Memories
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">{t('gallery')}</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-wrap gap-2 mb-8">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                category === cat
                  ? 'bg-emerald-900 text-amber-300 shadow'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-700'
              }`}
            >
              {cat === 'ALL' ? t('allCategories') : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState title={t('noRecords')} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((img) => (
              <figure
                key={img.id}
                onClick={() => setLightboxImage(img)}
                className="group bg-white rounded-2xl overflow-hidden border border-emerald-900/10 shadow-xs hover:shadow-xl transition cursor-pointer"
              >
                <div className="aspect-4/3 bg-emerald-950 overflow-hidden">
                  <img
                    src={img.image_url}
                    alt={pick(img, 'caption') || img.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <figcaption className="p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                    {img.category}
                  </span>
                  {pick(img, 'caption') && (
                    <p className="text-sm font-medium text-emerald-950 mt-0.5 line-clamp-2">
                      {pick(img, 'caption')}
                    </p>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>

      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="max-w-4xl w-full bg-emerald-950 rounded-2xl overflow-hidden border border-amber-400/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 text-white border-b border-emerald-900">
              <span className="text-xs font-bold text-amber-300">{lightboxImage.category}</span>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-amber-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={lightboxImage.image_url}
              alt={pick(lightboxImage, 'caption') || lightboxImage.category}
              className="w-full max-h-[75vh] object-contain bg-black"
            />
            {pick(lightboxImage, 'caption') && (
              <div className="p-4 text-sm text-emerald-50">{pick(lightboxImage, 'caption')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
