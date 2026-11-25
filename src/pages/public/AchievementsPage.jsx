import React, { useEffect, useState } from 'react';
import { Award, Calendar, User } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';
import SeoHead from '../../components/common/SeoHead';
import { LoadingSpinner, EmptyState } from '../../components/common/StateFeedback';

const CATEGORIES = [
  'ALL',
  'Student Achievement',
  'Award & Certificate',
  'Competition Result',
  'Institution Achievement',
];

export default function AchievementsPage() {
  const { t, pick } = useLanguage();
  const { settings } = useSettings();
  const [achievements, setAchievements] = useState([]);
  const [category, setCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAchievements() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_published', true)
        .order('achievement_date', { ascending: false });
      setAchievements(data || []);
      setLoading(false);
    }
    loadAchievements();
  }, []);

  const filtered =
    category === 'ALL' ? achievements : achievements.filter((a) => a.category === category);

  return (
    <div className="pb-20">
      <SeoHead
        title="Achievements & Honors"
        description="Student Hifz completions, Quran competition awards, and institutional milestones at Umar Makthab and Hifl Madarasa."
      />

      <section className="islamic-pattern text-white py-14 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
            Honors & Milestones
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">{t('achievements')}</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-emerald-900/10 shadow-xs hover:shadow-lg transition flex flex-col"
              >
                <div className="h-52 bg-emerald-950 overflow-hidden">
                  <img
                    src={item.image_url || settings.logo_url || '/logo.png'}
                    alt={pick(item, 'title')}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2 text-xs font-bold text-amber-700 mb-2">
                    <span className="inline-flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      {item.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.achievement_date}
                    </span>
                  </div>
                  <h2 className="text-lg font-extrabold text-emerald-950 mb-2">
                    {pick(item, 'title')}
                  </h2>
                  {item.student_or_recipient && (
                    <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1 mb-2">
                      <User className="w-3.5 h-3.5 text-amber-600" />
                      <span>{item.student_or_recipient}</span>
                    </p>
                  )}
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">
                    {pick(item, 'description')}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
