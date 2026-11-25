import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Target, CheckCircle2, Users, Building2, History } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';
import SeoHead from '../../components/common/SeoHead';
import { LoadingSpinner } from '../../components/common/StateFeedback';

export default function AboutPage() {
  const { t, pick } = useLanguage();
  const { settings } = useSettings();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBranches() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('madarasa_branches')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      setBranches(data || []);
      setLoading(false);
    }
    fetchBranches();
  }, []);

  return (
    <div className="pb-20">
      <SeoHead
        title="About Us"
        description="Learn about Umar Makthab and Hifl Madarasa history, vision, mission, educational objectives, management, and three branches."
      />

      <section className="islamic-pattern text-white py-14 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
            Institutional Profile
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">{t('about')}</h1>
          <p className="text-emerald-100/90 mt-2 max-w-2xl">{pick(settings, 'tagline')}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-7 border border-emerald-900/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-900">
              <Building2 className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-extrabold">{pick(settings, 'institution_name')}</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">{pick(settings, 'about_summary')}</p>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-emerald-900/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-900">
              <History className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-extrabold">Institution History</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">{pick(settings, 'history')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-emerald-950 text-white rounded-2xl p-7 border border-amber-400/30 space-y-3">
            <div className="flex items-center gap-2.5 text-amber-300">
              <Compass className="w-6 h-6" />
              <h2 className="text-xl font-extrabold">Our Vision</h2>
            </div>
            <p className="text-emerald-100 leading-relaxed">{pick(settings, 'vision')}</p>
          </div>

          <div className="bg-emerald-900 text-white rounded-2xl p-7 border border-amber-400/30 space-y-3">
            <div className="flex items-center gap-2.5 text-amber-300">
              <Target className="w-6 h-6" />
              <h2 className="text-xl font-extrabold">Our Mission</h2>
            </div>
            <p className="text-emerald-100 leading-relaxed">{pick(settings, 'mission')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-7 border border-emerald-900/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-extrabold">Educational Objectives</h2>
            </div>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
              {pick(settings, 'objectives')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-emerald-900/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-900">
              <Users className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-extrabold">Management & Governance</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">{pick(settings, 'management_info')}</p>
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
                Our Campuses
              </span>
              <h2 className="text-2xl font-extrabold text-emerald-950">Madarasa Branches</h2>
            </div>
            <Link
              to="/branches"
              className="px-4 py-2 rounded-xl bg-emerald-900 text-white text-xs font-bold hover:bg-emerald-800 transition"
            >
              View Detailed Branch Info
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="bg-white rounded-2xl overflow-hidden border border-emerald-900/10 shadow-xs flex flex-col"
                >
                  <img
                    src={branch.image_url || settings.logo_url || '/logo.png'}
                    alt={pick(branch, 'name')}
                    className="h-44 w-full object-cover bg-emerald-950"
                  />
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-emerald-950">{pick(branch, 'name')}</h3>
                    <p className="text-xs text-amber-700 font-semibold mt-1">
                      {pick(branch, 'address')}
                    </p>
                    <p className="text-sm text-slate-600 mt-2 flex-1">
                      {pick(branch, 'description')}
                    </p>
                    <p className="text-xs font-bold text-emerald-900 mt-3 pt-3 border-t border-slate-100">
                      Contact: {branch.contact_number}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
