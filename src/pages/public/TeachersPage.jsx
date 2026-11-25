import React, { useEffect, useState } from 'react';
import { GraduationCap, Clock, Building2, Award } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';
import SeoHead from '../../components/common/SeoHead';
import { LoadingSpinner, EmptyState } from '../../components/common/StateFeedback';

export default function TeachersPage() {
  const { t, pick } = useLanguage();
  const { settings } = useSettings();
  const [teachers, setTeachers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeachers() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      const [teacherRes, branchRes] = await Promise.all([
        supabase
          .from('teachers')
          .select('*, madarasa_branches(id, name_en, name_ta)')
          .eq('is_active', true)
          .order('display_order', { ascending: true }),
        supabase
          .from('madarasa_branches')
          .select('id, name_en, name_ta')
          .eq('is_active', true)
          .order('display_order', { ascending: true }),
      ]);
      setTeachers(teacherRes.data || []);
      setBranches(branchRes.data || []);
      setLoading(false);
    }
    loadTeachers();
  }, []);

  const filtered =
    selectedBranch === 'ALL' ? teachers : teachers.filter((item) => item.branch_id === selectedBranch);

  return (
    <div className="pb-20">
      <SeoHead
        title="Teachers & Staff"
        description="Meet the qualified Ulama, Huffaz, and Islamic educators at Umar Makthab and Hifl Madarasa."
      />

      <section className="islamic-pattern text-white py-14 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
            Faculty & Huffaz
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">{t('teachers')}</h1>
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
            {filtered.map((teacher) => (
              <article
                key={teacher.id}
                className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-xs hover:shadow-lg transition flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={teacher.photo_url || settings.logo_url || '/logo.png'}
                    alt={pick(teacher, 'full_name')}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 bg-emerald-950 shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <h2 className="text-lg font-extrabold text-emerald-950">
                      {pick(teacher, 'full_name')}
                    </h2>
                    <p className="text-xs font-bold text-amber-700">
                      {pick(teacher, 'department')}
                    </p>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{pick(teacher, 'qualification')}</span>
                    </p>
                  </div>
                </div>

                {pick(teacher, 'bio') && (
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
                    {pick(teacher, 'bio')}
                  </p>
                )}

                <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  {teacher.experience_years > 0 && (
                    <p className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>
                        {t('experienceLabel')}: {teacher.experience_years} {t('years')}
                      </span>
                    </p>
                  )}
                  {teacher.class_timing && (
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>
                        {t('timingLabel')}: {teacher.class_timing}
                      </span>
                    </p>
                  )}
                  {teacher.madarasa_branches && (
                    <p className="flex items-center gap-1.5 font-semibold text-emerald-900">
                      <Building2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>{pick(teacher.madarasa_branches, 'name')}</span>
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
