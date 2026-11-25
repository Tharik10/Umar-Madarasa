import React, { useEffect, useState } from 'react';
import { MapPin, Phone, BookOpen, ExternalLink } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';
import SeoHead from '../../components/common/SeoHead';
import { LoadingSpinner, EmptyState } from '../../components/common/StateFeedback';

export default function BranchesPage() {
  const { t, pick } = useLanguage();
  const { settings } = useSettings();
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBranches() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      const [branchRes, courseRes] = await Promise.all([
        supabase
          .from('madarasa_branches')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true }),
        supabase.from('courses').select('id, branch_id, title_en, title_ta').eq('is_active', true),
      ]);
      setBranches(branchRes.data || []);
      setCourses(courseRes.data || []);
      setLoading(false);
    }
    loadBranches();
  }, []);

  return (
    <div className="pb-20">
      <SeoHead
        title="Madarasa Branches"
        description="Explore all Umar Makthab and Hifl Madarasa branches, addresses, contact details, and available courses."
      />

      <section className="islamic-pattern text-white py-14 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
            Campuses & Centers
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">{t('branches')}</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <LoadingSpinner />
        ) : branches.length === 0 ? (
          <EmptyState title={t('noRecords')} />
        ) : (
          <div className="space-y-8">
            {branches.map((branch) => {
              const branchCourses = courses.filter((c) => c.branch_id === branch.id);
              return (
                <article
                  key={branch.id}
                  className="bg-white rounded-3xl overflow-hidden border border-emerald-900/10 shadow-sm grid grid-cols-1 lg:grid-cols-12"
                >
                  <div className="lg:col-span-5 bg-emerald-950 min-h-64">
                    <img
                      src={branch.image_url || settings.logo_url || '/logo.png'}
                      alt={pick(branch, 'name')}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <h2 className="text-2xl font-extrabold text-emerald-950">
                        {pick(branch, 'name')}
                      </h2>
                      <p className="text-slate-700 leading-relaxed">
                        {pick(branch, 'description')}
                      </p>

                      <div className="space-y-2 pt-2 text-sm">
                        <p className="flex items-start gap-2 text-slate-700">
                          <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-1" />
                          <span>{pick(branch, 'address')}</span>
                        </p>
                        <p className="flex items-center gap-2 font-semibold text-emerald-900">
                          <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                          <a href={`tel:${branch.contact_number}`}>{branch.contact_number}</a>
                        </p>
                      </div>

                      {branchCourses.length > 0 && (
                        <div className="pt-3">
                          <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 mb-2">
                            <BookOpen className="w-4 h-4 text-amber-600" />
                            <span>Available Courses at this Branch</span>
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {branchCourses.map((c) => (
                              <span
                                key={c.id}
                                className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-900/15 text-emerald-900 text-xs font-semibold"
                              >
                                {pick(c, 'title')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {branch.map_url && (
                      <div>
                        <a
                          href={branch.map_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold transition"
                        >
                          <span>View on Google Maps</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
