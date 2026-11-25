import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Award,
  Bell,
  ArrowRight,
  Youtube,
  Building2,
  MapPin,
  Phone,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';
import HeroSlider from '../../components/public/HeroSlider';
import EventCard from '../../components/public/EventCard';
import EventModal from '../../components/public/EventModal';
import SeoHead from '../../components/common/SeoHead';
import { LoadingSpinner, EmptyState } from '../../components/common/StateFeedback';

export default function HomePage() {
  const { t, pick, lang } = useLanguage();
  const { settings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [data, setData] = useState({
    slides: [],
    events: [],
    liveEvents: [],
    courses: [],
    teachers: [],
    achievements: [],
    announcements: [],
    gallery: [],
    branches: [],
  });

  useEffect(() => {
    async function loadHomeData() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      const maxSlides = settings.max_slider_slides || 6;

      const [
        slidesRes,
        upcomingRes,
        liveRes,
        coursesRes,
        teachersRes,
        achievementsRes,
        announcementsRes,
        galleryRes,
        branchesRes,
      ] = await Promise.all([
        supabase
          .from('homepage_slides')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(maxSlides),
        supabase
          .from('events')
          .select('*, madarasa_branches(name_en, name_ta)')
          .eq('is_published', true)
          .in('status', ['Upcoming', 'Live'])
          .order('event_date', { ascending: true })
          .limit(3),
        supabase
          .from('events')
          .select('*, madarasa_branches(name_en, name_ta)')
          .eq('is_published', true)
          .not('youtube_url', 'is', null)
          .neq('youtube_url', '')
          .order('event_date', { ascending: false })
          .limit(3),
        supabase
          .from('courses')
          .select('*, madarasa_branches(name_en, name_ta)')
          .eq('is_active', true)
          .order('is_featured', { ascending: false })
          .order('display_order', { ascending: true })
          .limit(3),
        supabase
          .from('teachers')
          .select('*, madarasa_branches(name_en, name_ta)')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(4),
        supabase
          .from('achievements')
          .select('*')
          .eq('is_published', true)
          .order('achievement_date', { ascending: false })
          .limit(3),
        supabase
          .from('announcements')
          .select('*')
          .eq('status', 'Active')
          .order('publish_date', { ascending: false })
          .limit(3),
        supabase
          .from('gallery_images')
          .select('*')
          .eq('is_published', true)
          .order('display_order', { ascending: true })
          .limit(6),
        supabase
          .from('madarasa_branches')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true }),
      ]);

      setData({
        slides: slidesRes.data || [],
        events: upcomingRes.data || [],
        liveEvents: liveRes.data || [],
        courses: coursesRes.data || [],
        teachers: teachersRes.data || [],
        achievements: achievementsRes.data || [],
        announcements: announcementsRes.data || [],
        gallery: galleryRes.data || [],
        branches: branchesRes.data || [],
      });
      setLoading(false);
    }

    loadHomeData();
  }, [settings.max_slider_slides]);

  return (
    <div>
      <SeoHead
        title="Home"
        description="Official website of Umar Makthab and Hifl Madarasa — Quran Hifz, Tajweed, Makthab education, live programs, and branches."
      />

      <section className="islamic-pattern text-white py-14 sm:py-20 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{pick(settings, 'tagline')}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                {pick(settings, 'institution_name')}
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
                {pick(settings, 'about_summary')}
              </p>

              <div className="flex flex-wrap gap-3.5 pt-2">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm shadow-lg transition"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{t('exploreCourses')}</span>
                </Link>
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-white border border-amber-400/35 font-bold text-sm transition"
                >
                  <Youtube className="w-4 h-4 text-red-400" />
                  <span>{t('watchLive')}</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative p-3 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-2xl">
                <img
                  src={settings.logo_url || '/logo.png'}
                  alt="Umar Makthab and Hifl Madarasa Official Emblem"
                  className="w-56 h-56 sm:w-64 sm:h-64 rounded-full object-contain bg-emerald-950 p-1"
                />
              </div>
              <p className="mt-4 font-serif text-amber-300 text-lg text-center">
                {lang === 'en' ? settings.institution_name_ta : settings.institution_name_en}
              </p>
            </div>
          </div>

          {data.slides.length > 0 && (
            <div className="mt-12">
              <HeroSlider slides={data.slides} />
            </div>
          )}
        </div>
      </section>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-20 py-16">
          {data.announcements.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-2xl border border-amber-500/30 shadow-sm p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                      <Bell className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-emerald-950">
                      {t('latestAnnouncements')}
                    </h2>
                  </div>
                  <Link
                    to="/announcements"
                    className="inline-flex items-center gap-1 text-sm font-bold text-emerald-800 hover:text-amber-700"
                  >
                    <span>{t('viewAll')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {data.announcements.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-900/10 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-amber-700 flex items-center gap-1 mb-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.publish_date}
                        </span>
                        <h3 className="font-bold text-emerald-950 mb-1.5">{pick(item, 'title')}</h3>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {pick(item, 'description')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
                  {t('aboutIntro')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
                  {pick(settings, 'institution_name')}
                </h2>
                <p className="text-slate-600 leading-relaxed">{pick(settings, 'history')}</p>
                <div className="p-4 rounded-2xl bg-emerald-950 text-emerald-50 border-l-4 border-amber-400">
                  <p className="text-xs uppercase tracking-wider text-amber-300 font-bold mb-1">
                    Our Vision
                  </p>
                  <p className="text-sm leading-relaxed">{pick(settings, 'vision')}</p>
                </div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-bold transition"
                >
                  <span>{t('readMore')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-emerald-950 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-600" />
                    <span>{t('branches')}</span>
                  </h3>
                  <Link to="/branches" className="text-xs font-bold text-emerald-800 hover:underline">
                    {t('viewAll')}
                  </Link>
                </div>

                {data.branches.length > 0 ? (
                  <div className="space-y-3">
                    {data.branches.slice(0, 3).map((branch) => (
                      <div
                        key={branch.id}
                        className="p-4 rounded-2xl bg-white border border-emerald-900/10 shadow-xs flex items-start gap-4"
                      >
                        <img
                          src={branch.image_url || settings.logo_url || '/logo.png'}
                          alt={pick(branch, 'name')}
                          className="w-14 h-14 rounded-xl object-cover bg-emerald-950 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-emerald-950">{pick(branch, 'name')}</h4>
                          <p className="text-xs text-slate-600 mt-0.5">{pick(branch, 'address')}</p>
                          <p className="text-xs font-semibold text-emerald-800 mt-1">
                            {branch.contact_number}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="Branches will appear here once added in Admin Dashboard." />
                )}
              </div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
                    Programs & Gatherings
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
                    {t('upcomingEvents')}
                  </h2>
                </div>
                <Link
                  to="/events"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 hover:text-amber-700"
                >
                  <span>{t('viewAll')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {data.events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.events.map((ev) => (
                    <EventCard key={ev.id} event={ev} onSelectEvent={setSelectedEvent} />
                  ))}
                </div>
              ) : (
                <EmptyState title="No upcoming events scheduled right now." />
              )}
            </div>

            {data.liveEvents.length > 0 && (
              <div className="pt-4">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <Youtube className="w-7 h-7 text-red-600" />
                    <h2 className="text-2xl font-extrabold text-emerald-950">
                      {t('livePrograms')}
                    </h2>
                  </div>
                  {settings.youtube_channel_url && (
                    <a
                      href={settings.youtube_channel_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow transition"
                    >
                      <Youtube className="w-4 h-4" />
                      <span>{t('subscribeYoutube')}</span>
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.liveEvents.map((ev) => (
                    <EventCard key={ev.id} event={ev} onSelectEvent={setSelectedEvent} />
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="bg-emerald-950 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                    Islamic Curriculum
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold">{t('featuredCourses')}</h2>
                </div>
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-300 hover:underline"
                >
                  <span>{t('viewAll')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {data.courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {data.courses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-emerald-900/60 border border-amber-400/20 rounded-2xl overflow-hidden flex flex-col"
                    >
                      {course.image_url && (
                        <img
                          src={course.image_url}
                          alt={pick(course, 'title')}
                          className="h-44 w-full object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="p-6 flex-1 flex flex-col">
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wide mb-1">
                          {course.department}
                        </span>
                        <h3 className="text-lg font-bold text-white mb-2">
                          {pick(course, 'title')}
                        </h3>
                        <p className="text-sm text-emerald-100/85 line-clamp-3 mb-4 flex-1">
                          {pick(course, 'description')}
                        </p>
                        <div className="text-xs text-amber-200/90 pt-3 border-t border-emerald-800">
                          {pick(course, 'class_info')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-emerald-200 text-sm">{t('noRecords')}</p>
              )}
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <Users className="w-6 h-6 text-emerald-800" />
                  <h2 className="text-2xl font-extrabold text-emerald-950">{t('ourTeachers')}</h2>
                </div>
                <Link
                  to="/teachers"
                  className="inline-flex items-center gap-1 text-sm font-bold text-emerald-800 hover:underline"
                >
                  <span>{t('viewAll')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {data.teachers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {data.teachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      className="bg-white rounded-2xl p-5 border border-emerald-900/10 shadow-xs text-center"
                    >
                      <img
                        src={teacher.photo_url || settings.logo_url || '/logo.png'}
                        alt={pick(teacher, 'full_name')}
                        className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-2 border-amber-400 bg-emerald-950"
                        loading="lazy"
                      />
                      <h3 className="font-bold text-emerald-950">{pick(teacher, 'full_name')}</h3>
                      <p className="text-xs font-semibold text-amber-700 mt-0.5">
                        {pick(teacher, 'department')}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {pick(teacher, 'qualification')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title={t('noRecords')} />
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <Award className="w-6 h-6 text-amber-600" />
                  <h2 className="text-2xl font-extrabold text-emerald-950">
                    {t('recentAchievements')}
                  </h2>
                </div>
                <Link
                  to="/achievements"
                  className="inline-flex items-center gap-1 text-sm font-bold text-emerald-800 hover:underline"
                >
                  <span>{t('viewAll')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {data.achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {data.achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className="bg-white rounded-2xl overflow-hidden border border-emerald-900/10 shadow-xs"
                    >
                      {ach.image_url && (
                        <img
                          src={ach.image_url}
                          alt={pick(ach, 'title')}
                          className="h-44 w-full object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="p-5">
                        <span className="text-xs font-bold text-amber-700">{ach.category}</span>
                        <h3 className="font-bold text-emerald-950 mt-1">{pick(ach, 'title')}</h3>
                        <p className="text-sm text-slate-600 mt-1.5 line-clamp-2">
                          {pick(ach, 'description')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title={t('noRecords')} />
              )}
            </div>

            {data.gallery.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-extrabold text-emerald-950">{t('photoGallery')}</h2>
                  <Link
                    to="/gallery"
                    className="inline-flex items-center gap-1 text-sm font-bold text-emerald-800 hover:underline"
                  >
                    <span>{t('viewAll')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {data.gallery.map((img) => (
                    <Link
                      key={img.id}
                      to="/gallery"
                      className="group relative aspect-square rounded-xl overflow-hidden bg-emerald-950"
                    >
                      <img
                        src={img.image_url}
                        alt={pick(img, 'caption') || img.category}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-3xl islamic-pattern p-8 sm:p-10 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border border-amber-400/30">
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-amber-300">
                  Connect with {pick(settings, 'institution_name')}
                </h2>
                <p className="text-sm text-emerald-100 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{pick(settings, 'address')}</span>
                </p>
                <p className="text-sm text-emerald-100 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{settings.phone_number}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm transition"
                >
                  {t('contact')}
                </Link>
                {settings.youtube_channel_url && (
                  <a
                    href={settings.youtube_channel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition"
                  >
                    <Youtube className="w-4 h-4" />
                    <span>YouTube Channel</span>
                  </a>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
