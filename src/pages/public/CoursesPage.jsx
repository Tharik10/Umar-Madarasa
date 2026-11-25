import React, { useEffect, useState } from 'react';
import { Clock, Building2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';
import SeoHead from '../../components/common/SeoHead';
import { LoadingSpinner, EmptyState } from '../../components/common/StateFeedback';

export default function CoursesPage() {
  const { t, pick } = useLanguage();
  const { settings } = useSettings();
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      const [courseRes, branchRes] = await Promise.all([
        supabase
          .from('courses')
          .select('*, madarasa_branches(id, name_en, name_ta)')
          .eq('is_active', true)
          .order('display_order', { ascending: true }),
        supabase
          .from('madarasa_branches')
          .select('id, name_en, name_ta')
          .eq('is_active', true)
          .order('display_order', { ascending: true }),
      ]);
      setCourses(courseRes.data || []);
      setBranches(branchRes.data || []);
      setLoading(false);
    }
    loadCourses();
  }, []);

  const filtered =
    selectedBranch === 'ALL' ? courses : courses.filter((c) => c.branch_id === selectedBranch);

  return (
    <div className="pb-20">
      <SeoHead
        title="Courses & Classes"
        description="Browse Hifz-ul-Quran, Makthab, Tajweed, and Islamic studies programs offered at Umar Madarasa."
      />

      <section className="islamic-pattern text-white py-14 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
            Academic Programs
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">{t('courses')}</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {branches.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              type="button"
              onClick={() => setSelectedBranch('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedBranch === 'ALL'
                  ? 'bg-emerald-900 text-amber-300 shadow'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-700'
              }`}
            >
              {t('allBranches')}
            </button>
            {branches.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBranch(b.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedBranch === b.id
                    ? 'bg-emerald-900 text-amber-300 shadow'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-700'
                }`}
              >
                {pick(b, 'name')}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState title={t('noRecords')} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((course) => (
              <article
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden border border-emerald-900/10 shadow-xs hover:shadow-lg transition flex flex-col"
              >
                <div className="h-48 bg-emerald-950 overflow-hidden">
                  <img
                    src={course.image_url || settings.logo_url || '/logo.png'}
                    alt={pick(course, 'title')}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">
                      {course.department}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-emerald-950 mb-2">
                    {pick(course, 'title')}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
                    {pick(course, 'description')}
                  </p>
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5 font-semibold text-emerald-900">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{pick(course, 'class_info')}</span>
                    </p>
                    {course.madarasa_branches && (
                      <p className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>{pick(course.madarasa_branches, 'name')}</span>
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
