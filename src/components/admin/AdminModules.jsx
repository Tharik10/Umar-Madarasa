import React, { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Youtube,
  CheckCircle2,
  XCircle,
  Loader2,
  Upload,
  Save,
  Calendar,
  Users,
  BookOpen,
  Building2,
  Image as ImageIcon,
  Radio,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadImageToBucket, deleteImageFromBucketByUrl } from '../../lib/storage';
import { isValidYouTubeUrl } from '../../lib/youtube';
import { useSettings } from '../../contexts/SettingsContext';

function Toast({ toast, onClear }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClear, 4000);
    return () => clearTimeout(t);
  }, [toast, onClear]);

  if (!toast) return null;
  return (
    <div
      className={`mb-5 p-4 rounded-xl text-sm font-semibold flex items-center justify-between shadow-sm ${
        toast.type === 'error'
          ? 'bg-red-50 border border-red-200 text-red-800'
          : 'bg-emerald-50 border border-emerald-300 text-emerald-900'
      }`}
    >
      <span>{toast.message}</span>
      <button type="button" onClick={onClear} className="text-xs underline ml-4 cursor-pointer">
        Dismiss
      </button>
    </div>
  );
}

// 1. DASHBOARD OVERVIEW MODULE
export function OverviewModule({ onNavigate }) {
  const [stats, setStats] = useState({
    events: 0,
    upcomingEvents: 0,
    teachers: 0,
    courses: 0,
    branches: 0,
    gallery: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      const [evAll, evUp, teach, crs, br, gal, recEv, recAnn] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase
          .from('events')
          .select('id', { count: 'exact', head: true })
          .in('status', ['Upcoming', 'Live']),
        supabase.from('teachers').select('id', { count: 'exact', head: true }),
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('madarasa_branches').select('id', { count: 'exact', head: true }),
        supabase.from('gallery_images').select('id', { count: 'exact', head: true }),
        supabase
          .from('events')
          .select('id, title_en, event_date, status, youtube_url')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('announcements')
          .select('id, title_en, publish_date, status')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      setStats({
        events: evAll.count || 0,
        upcomingEvents: evUp.count || 0,
        teachers: teach.count || 0,
        courses: crs.count || 0,
        branches: br.count || 0,
        gallery: gal.count || 0,
      });
      setRecentEvents(recEv.data || []);
      setRecentAnnouncements(recAnn.data || []);
      setLoading(false);
    }
    loadOverview();
  }, []);

  const cards = [
    { label: 'Total Events', value: stats.events, icon: Calendar, tab: 'events' },
    { label: 'Upcoming / Live Events', value: stats.upcomingEvents, icon: Radio, tab: 'youtube' },
    { label: 'Total Teachers', value: stats.teachers, icon: Users, tab: 'teachers' },
    { label: 'Total Courses', value: stats.courses, icon: BookOpen, tab: 'courses' },
    { label: 'Madarasa Branches', value: stats.branches, icon: Building2, tab: 'branches' },
    { label: 'Gallery Images', value: stats.gallery, icon: ImageIcon, tab: 'gallery' },
  ];

  if (loading) {
    return <div className="py-16 text-center text-sm text-slate-600">Loading dashboard metrics...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => onNavigate(c.tab)}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-700 transition text-left flex items-center justify-between cursor-pointer"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{c.label}</p>
                <p className="text-3xl font-extrabold text-emerald-950 mt-1">{c.value}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-900">
                <Icon className="w-6 h-6 text-amber-600" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-emerald-950">Recent Events</h2>
            <button
              type="button"
              onClick={() => onNavigate('events')}
              className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
            >
              Manage Events
            </button>
          </div>
          {recentEvents.length === 0 ? (
            <p className="text-sm text-slate-500">No events created yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm">
              {recentEvents.map((ev) => (
                <li key={ev.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{ev.title_en}</p>
                    <p className="text-xs text-slate-500">{ev.event_date}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold">
                    {ev.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-emerald-950">Recent Announcements</h2>
            <button
              type="button"
              onClick={() => onNavigate('announcements')}
              className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
            >
              Manage Announcements
            </button>
          </div>
          {recentAnnouncements.length === 0 ? (
            <p className="text-sm text-slate-500">No announcements posted yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm">
              {recentAnnouncements.map((ann) => (
                <li key={ann.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{ann.title_en}</p>
                    <p className="text-xs text-slate-500">{ann.publish_date}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold">
                    {ann.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// 2. EVENTS MANAGEMENT MODULE
export function EventsModule() {
  const [events, setEvents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [posterFile, setPosterFile] = useState(null);

  const emptyForm = {
    title_en: '',
    title_ta: '',
    description_en: '',
    description_ta: '',
    event_date: '',
    event_time: '',
    youtube_url: '',
    status: 'Upcoming',
    branch_id: '',
    poster_url: '',
    is_published: true,
  };
  const [form, setForm] = useState(emptyForm);

  const loadData = async () => {
    setLoading(true);
    const [evRes, brRes] = await Promise.all([
      supabase
        .from('events')
        .select('*, madarasa_branches(name_en)')
        .order('event_date', { ascending: false }),
      supabase.from('madarasa_branches').select('id, name_en').order('display_order'),
    ]);
    setEvents(evRes.data || []);
    setBranches(brRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.youtube_url && !isValidYouTubeUrl(form.youtube_url)) {
      setToast({ type: 'error', message: 'Please enter a valid YouTube video or live stream URL.' });
      return;
    }

    setSaving(true);
    try {
      let posterUrl = form.poster_url;
      if (posterFile) {
        posterUrl = await uploadImageToBucket('event-posters', posterFile);
      }

      const payload = {
        title_en: form.title_en.trim(),
        title_ta: form.title_ta.trim() || null,
        description_en: form.description_en.trim(),
        description_ta: form.description_ta.trim() || null,
        event_date: form.event_date,
        event_time: form.event_time.trim(),
        youtube_url: form.youtube_url.trim() || null,
        status: form.status,
        branch_id: form.branch_id || null,
        poster_url: posterUrl || null,
        is_published: form.is_published,
      };

      if (editingId) {
        const { error } = await supabase.from('events').update(payload).eq('id', editingId);
        if (error) throw error;
        setToast({ type: 'success', message: 'Event updated successfully.' });
      } else {
        const { error } = await supabase.from('events').insert([payload]);
        if (error) throw error;
        setToast({ type: 'success', message: 'Event created successfully.' });
      }

      setForm(emptyForm);
      setEditingId(null);
      setPosterFile(null);
      await loadData();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (ev) => {
    setEditingId(ev.id);
    setPosterFile(null);
    setForm({
      title_en: ev.title_en || '',
      title_ta: ev.title_ta || '',
      description_en: ev.description_en || '',
      description_ta: ev.description_ta || '',
      event_date: ev.event_date || '',
      event_time: ev.event_time || '',
      youtube_url: ev.youtube_url || '',
      status: ev.status || 'Upcoming',
      branch_id: ev.branch_id || '',
      poster_url: ev.poster_url || '',
      is_published: ev.is_published,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTogglePublish = async (ev) => {
    const { error } = await supabase
      .from('events')
      .update({ is_published: !ev.is_published })
      .eq('id', ev.id);
    if (!error) {
      setToast({
        type: 'success',
        message: !ev.is_published ? 'Event published to public site.' : 'Event unpublished.',
      });
      loadData();
    }
  };

  const handleDelete = async (ev) => {
    if (!window.confirm(`Delete event "${ev.title_en}" permanently?`)) return;
    await deleteImageFromBucketByUrl('event-posters', ev.poster_url);
    const { error } = await supabase.from('events').delete().eq('id', ev.id);
    if (!error) {
      setToast({ type: 'success', message: 'Event deleted.' });
      loadData();
    }
  };

  return (
    <div className="space-y-8">
      <Toast toast={toast} onClear={() => setToast(null)} />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-emerald-950">
            {editingId ? 'Edit Event' : 'Add New Event / Program'}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Event Title (English) *</label>
            <input
              type="text"
              required
              value={form.title_en}
              onChange={(e) => setForm({ ...form, title_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Event Title (Tamil)</label>
            <input
              type="text"
              value={form.title_ta}
              onChange={(e) => setForm({ ...form, title_ta: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Event Date *</label>
            <input
              type="date"
              required
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Event Time *</label>
            <input
              type="text"
              required
              placeholder="e.g. 10:00 AM - 1:00 PM"
              value={form.event_time}
              onChange={(e) => setForm({ ...form, event_time: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Event Status *</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Live">Live</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Associated Branch</label>
            <select
              value={form.branch_id}
              onChange={(e) => setForm({ ...form, branch_id: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
            >
              <option value="">All Branches / General</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name_en}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              YouTube Video / Live URL (Optional — can be added later)
            </label>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={form.youtube_url}
              onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Event Poster Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:bg-emerald-50 file:text-emerald-900 file:font-bold"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description (English) *
            </label>
            <textarea
              required
              rows={3}
              value={form.description_en}
              onChange={(e) => setForm({ ...form, description_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description (Tamil)
            </label>
            <textarea
              rows={2}
              value={form.description_ta}
              onChange={(e) => setForm({ ...form, description_ta: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            className="rounded text-emerald-800"
          />
          <span>Publish immediately on public website</span>
        </label>

        <div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold shadow transition cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>{editingId ? 'Update Event' : 'Create Event'}</span>
          </button>
        </div>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 font-extrabold text-sm text-emerald-950">
          All Events ({events.length})
        </div>
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading events...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase">
                <tr>
                  <th className="px-5 py-3">Event</th>
                  <th className="px-5 py-3">Date & Time</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">YouTube Link</th>
                  <th className="px-5 py-3">Visibility</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{ev.title_en}</td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {ev.event_date} • {ev.event_time}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold">
                        {ev.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {ev.youtube_url ? (
                        <a
                          href={ev.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 font-bold hover:underline inline-flex items-center gap-1"
                        >
                          <Youtube className="w-3.5 h-3.5" /> Linked
                        </a>
                      ) : (
                        <span className="text-slate-400">Not added yet</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(ev)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                          ev.is_published
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {ev.is_published ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Published
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" /> Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(ev)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-emerald-900 cursor-pointer"
                        title="Edit Event"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(ev)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// 3. DEDICATED YOUTUBE LIVE LINK MANAGEMENT MODULE
export function YouTubeLiveModule() {
  const [events, setEvents] = useState([]);
  const [edits, setEdits] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('events')
      .select('id, title_en, event_date, event_time, youtube_url, status')
      .order('event_date', { ascending: false });
    const list = data || [];
    setEvents(list);
    const initialEdits = {};
    list.forEach((ev) => {
      initialEdits[ev.id] = {
        youtube_url: ev.youtube_url || '',
        status: ev.status || 'Upcoming',
      };
    });
    setEdits(initialEdits);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSaveYoutubeLink = async (eventId) => {
    const current = edits[eventId];
    if (current.youtube_url && !isValidYouTubeUrl(current.youtube_url)) {
      setToast({ type: 'error', message: 'Invalid YouTube URL format.' });
      return;
    }

    setSavingId(eventId);
    const { error } = await supabase
      .from('events')
      .update({
        youtube_url: current.youtube_url.trim() || null,
        status: current.status,
      })
      .eq('id', eventId);

    setSavingId(null);
    if (error) {
      setToast({ type: 'error', message: error.message });
    } else {
      setToast({
        type: 'success',
        message: 'YouTube link & program status updated live on the public website!',
      });
      loadEvents();
    }
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClear={() => setToast(null)} />

      <div className="bg-emerald-950 text-white p-6 rounded-2xl border border-amber-400/30">
        <div className="flex items-center gap-2.5 text-amber-300 font-extrabold text-base mb-1">
          <Youtube className="w-5 h-5 text-red-500" />
          <span>Instant YouTube Live & Video Link Updater</span>
        </div>
        <p className="text-xs text-emerald-100/90">
          Add or update the YouTube Live URL and broadcast status for any existing event without
          recreating the event. Changes appear immediately on the public Events and Home pages.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-slate-500">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl text-center text-sm text-slate-500">
          No events found. Create an event in Events Management first.
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((ev) => {
            const state = edits[ev.id] || { youtube_url: '', status: ev.status };
            return (
              <div
                key={ev.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-4 items-center"
              >
                <div className="lg:col-span-4">
                  <h3 className="font-extrabold text-emerald-950 text-sm">{ev.title_en}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {ev.event_date} • {ev.event_time}
                  </p>
                </div>

                <div className="lg:col-span-4">
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    YouTube Live / Video URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/live/..."
                    value={state.youtube_url}
                    onChange={(e) =>
                      setEdits({
                        ...edits,
                        [ev.id]: { ...state, youtube_url: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Status</label>
                  <select
                    value={state.status}
                    onChange={(e) =>
                      setEdits({
                        ...edits,
                        [ev.id]: { ...state, status: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Live">Live</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="lg:col-span-2 flex justify-end">
                  <button
                    type="button"
                    disabled={savingId === ev.id}
                    onClick={() => handleSaveYoutubeLink(ev.id)}
                    className="w-full lg:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow transition cursor-pointer"
                  >
                    {savingId === ev.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Update Link</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// 4. TEACHERS MANAGEMENT MODULE
export function TeachersModule() {
  const [teachers, setTeachers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const emptyForm = {
    full_name_en: '',
    full_name_ta: '',
    department_en: '',
    department_ta: '',
    qualification_en: '',
    qualification_ta: '',
    experience_years: '',
    class_timing: '',
    bio_en: '',
    bio_ta: '',
    branch_id: '',
    photo_url: '',
    display_order: 1,
    is_active: true,
  };
  const [form, setForm] = useState(emptyForm);

  const loadData = async () => {
    const [tRes, bRes] = await Promise.all([
      supabase
        .from('teachers')
        .select('*, madarasa_branches(name_en)')
        .order('display_order', { ascending: true }),
      supabase.from('madarasa_branches').select('id, name_en').order('display_order'),
    ]);
    setTeachers(tRes.data || []);
    setBranches(bRes.data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let photoUrl = form.photo_url;
      if (photoFile) {
        photoUrl = await uploadImageToBucket('teacher-photos', photoFile);
      }

      const payload = {
        full_name_en: form.full_name_en.trim(),
        full_name_ta: form.full_name_ta.trim() || null,
        department_en: form.department_en.trim(),
        department_ta: form.department_ta.trim() || null,
        qualification_en: form.qualification_en.trim(),
        qualification_ta: form.qualification_ta.trim() || null,
        experience_years: form.experience_years ? Number(form.experience_years) : null,
        class_timing: form.class_timing.trim() || null,
        bio_en: form.bio_en.trim() || null,
        bio_ta: form.bio_ta.trim() || null,
        branch_id: form.branch_id || null,
        photo_url: photoUrl || null,
        display_order: Number(form.display_order) || 1,
        is_active: form.is_active,
      };

      if (editingId) {
        const { error } = await supabase.from('teachers').update(payload).eq('id', editingId);
        if (error) throw error;
        setToast({ type: 'success', message: 'Teacher profile updated.' });
      } else {
        const { error } = await supabase.from('teachers').insert([payload]);
        if (error) throw error;
        setToast({ type: 'success', message: 'Teacher profile added.' });
      }

      setForm(emptyForm);
      setEditingId(null);
      setPhotoFile(null);
      loadData();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setPhotoFile(null);
    setForm({
      full_name_en: t.full_name_en || '',
      full_name_ta: t.full_name_ta || '',
      department_en: t.department_en || '',
      department_ta: t.department_ta || '',
      qualification_en: t.qualification_en || '',
      qualification_ta: t.qualification_ta || '',
      experience_years: t.experience_years ?? '',
      class_timing: t.class_timing || '',
      bio_en: t.bio_en || '',
      bio_ta: t.bio_ta || '',
      branch_id: t.branch_id || '',
      photo_url: t.photo_url || '',
      display_order: t.display_order || 1,
      is_active: t.is_active,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (t) => {
    if (!window.confirm(`Delete teacher "${t.full_name_en}"?`)) return;
    await deleteImageFromBucketByUrl('teacher-photos', t.photo_url);
    await supabase.from('teachers').delete().eq('id', t.id);
    setToast({ type: 'success', message: 'Teacher profile deleted.' });
    loadData();
  };

  return (
    <div className="space-y-8">
      <Toast toast={toast} onClear={() => setToast(null)} />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-emerald-950">
            {editingId ? 'Edit Teacher Profile' : 'Add Teacher / Ustad Profile'}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="text-xs font-bold text-slate-500 cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name (English) *</label>
            <input
              type="text"
              required
              value={form.full_name_en}
              onChange={(e) => setForm({ ...form, full_name_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name (Tamil)</label>
            <input
              type="text"
              value={form.full_name_ta}
              onChange={(e) => setForm({ ...form, full_name_ta: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Department / Subject (English) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Hifz-ul-Quran & Tajweed"
              value={form.department_en}
              onChange={(e) => setForm({ ...form, department_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Department / Subject (Tamil)
            </label>
            <input
              type="text"
              value={form.department_ta}
              onChange={(e) => setForm({ ...form, department_ta: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Qualification / Islamic Degree (English) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Hafiz, Alim Fazil"
              value={form.qualification_en}
              onChange={(e) => setForm({ ...form, qualification_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Qualification (Tamil)
            </label>
            <input
              type="text"
              value={form.qualification_ta}
              onChange={(e) => setForm({ ...form, qualification_ta: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Teaching Experience (Years, Optional)
            </label>
            <input
              type="number"
              min="0"
              value={form.experience_years}
              onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Class Timing</label>
            <input
              type="text"
              placeholder="e.g. Fajr to 8:30 AM & 4:30 PM - 7:30 PM"
              value={form.class_timing}
              onChange={(e) => setForm({ ...form, class_timing: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Associated Branch</label>
            <select
              value={form.branch_id}
              onChange={(e) => setForm({ ...form, branch_id: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
            >
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name_en}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Teacher Photograph</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:bg-emerald-50 file:text-emerald-900 file:font-bold"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Short Description (English)
            </label>
            <textarea
              rows={2}
              value={form.bio_en}
              onChange={(e) => setForm({ ...form, bio_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          />
          <span>Active Teacher Profile (Visible on Public Website)</span>
        </label>

        <div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold shadow transition cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>{editingId ? 'Update Teacher' : 'Save Teacher'}</span>
          </button>
        </div>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase">
            <tr>
              <th className="px-5 py-3">Teacher</th>
              <th className="px-5 py-3">Department</th>
              <th className="px-5 py-3">Qualification</th>
              <th className="px-5 py-3">Branch</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {teachers.map((t) => (
              <tr key={t.id}>
                <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-3">
                  {t.photo_url && (
                    <img
                      src={t.photo_url}
                      alt={t.full_name_en}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  )}
                  <span>{t.full_name_en}</span>
                </td>
                <td className="px-5 py-3.5 text-slate-600">{t.department_en}</td>
                <td className="px-5 py-3.5 text-slate-600">{t.qualification_en}</td>
                <td className="px-5 py-3.5 text-slate-600">{t.madarasa_branches?.name_en || '-'}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`px-2.5 py-1 rounded-full font-bold ${
                      t.is_active ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {t.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(t)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-emerald-900 cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(t)}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 5. COURSES MANAGEMENT MODULE
export function CoursesModule() {
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const emptyForm = {
    title_en: '',
    title_ta: '',
    department: 'Hifz Department',
    description_en: '',
    description_ta: '',
    class_info_en: '',
    class_info_ta: '',
    branch_id: '',
    image_url: '',
    is_featured: true,
    is_active: true,
  };
  const [form, setForm] = useState(emptyForm);

  const loadData = async () => {
    const [cRes, bRes] = await Promise.all([
      supabase
        .from('courses')
        .select('*, madarasa_branches(name_en)')
        .order('display_order', { ascending: true }),
      supabase.from('madarasa_branches').select('id, name_en').order('display_order'),
    ]);
    setCourses(cRes.data || []);
    setBranches(bRes.data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        imageUrl = await uploadImageToBucket('gallery-images', imageFile, 'courses');
      }
      const payload = {
        title_en: form.title_en.trim(),
        title_ta: form.title_ta.trim() || null,
        department: form.department.trim(),
        description_en: form.description_en.trim(),
        description_ta: form.description_ta.trim() || null,
        class_info_en: form.class_info_en.trim(),
        class_info_ta: form.class_info_ta.trim() || null,
        branch_id: form.branch_id || null,
        image_url: imageUrl || null,
        is_featured: form.is_featured,
        is_active: form.is_active,
      };
      if (editingId) {
        const { error } = await supabase.from('courses').update(payload).eq('id', editingId);
        if (error) throw error;
        setToast({ type: 'success', message: 'Course updated.' });
      } else {
        const { error } = await supabase.from('courses').insert([payload]);
        if (error) throw error;
        setToast({ type: 'success', message: 'Course added.' });
      }
      setForm(emptyForm);
      setEditingId(null);
      setImageFile(null);
      loadData();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete course "${c.title_en}"?`)) return;
    await supabase.from('courses').delete().eq('id', c.id);
    setToast({ type: 'success', message: 'Course deleted.' });
    loadData();
  };

  return (
    <div className="space-y-8">
      <Toast toast={toast} onClear={() => setToast(null)} />
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
      >
        <h2 className="text-base font-extrabold text-emerald-950">
          {editingId ? 'Edit Course' : 'Add Educational Course'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Course Name (English) *</label>
            <input
              type="text"
              required
              value={form.title_en}
              onChange={(e) => setForm({ ...form, title_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Course Name (Tamil)</label>
            <input
              type="text"
              value={form.title_ta}
              onChange={(e) => setForm({ ...form, title_ta: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Department *</label>
            <input
              type="text"
              required
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Associated Branch</label>
            <select
              value={form.branch_id}
              onChange={(e) => setForm({ ...form, branch_id: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
            >
              <option value="">All Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name_en}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Class Info & Schedule (English) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mon - Sat | Morning & Evening Batches"
              value={form.class_info_en}
              onChange={(e) => setForm({ ...form, class_info_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Course Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:bg-emerald-50 file:text-emerald-900 file:font-bold"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Description (English) *</label>
            <textarea
              required
              rows={2}
              value={form.description_en}
              onChange={(e) => setForm({ ...form, description_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Description (Tamil)</label>
            <textarea
              rows={2}
              value={form.description_ta}
              onChange={(e) => setForm({ ...form, description_ta: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{editingId ? 'Update Course' : 'Add Course'}</span>
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase">
            <tr>
              <th className="px-5 py-3">Course</th>
              <th className="px-5 py-3">Department</th>
              <th className="px-5 py-3">Branch</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map((c) => (
              <tr key={c.id}>
                <td className="px-5 py-3.5 font-bold text-slate-900">{c.title_en}</td>
                <td className="px-5 py-3.5 text-slate-600">{c.department}</td>
                <td className="px-5 py-3.5 text-slate-600">{c.madarasa_branches?.name_en || 'All'}</td>
                <td className="px-5 py-3.5 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(c.id);
                      setForm({
                        title_en: c.title_en || '',
                        title_ta: c.title_ta || '',
                        department: c.department || '',
                        description_en: c.description_en || '',
                        description_ta: c.description_ta || '',
                        class_info_en: c.class_info_en || '',
                        class_info_ta: c.class_info_ta || '',
                        branch_id: c.branch_id || '',
                        image_url: c.image_url || '',
                        is_featured: c.is_featured,
                        is_active: c.is_active,
                      });
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-emerald-900 cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c)}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 6. MADARASA BRANCH MANAGEMENT MODULE
export function BranchesModule() {
  const [branches, setBranches] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const emptyForm = {
    name_en: '',
    name_ta: '',
    address_en: '',
    address_ta: '',
    description_en: '',
    description_ta: '',
    contact_number: '',
    map_url: '',
    image_url: '',
    display_order: 1,
    is_active: true,
  };
  const [form, setForm] = useState(emptyForm);

  const loadBranches = async () => {
    const { data } = await supabase
      .from('madarasa_branches')
      .select('*')
      .order('display_order', { ascending: true });
    setBranches(data || []);
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        imageUrl = await uploadImageToBucket('madarasa-logo', imageFile, 'branches');
      }
      const payload = {
        name_en: form.name_en.trim(),
        name_ta: form.name_ta.trim() || null,
        address_en: form.address_en.trim(),
        address_ta: form.address_ta.trim() || null,
        description_en: form.description_en.trim(),
        description_ta: form.description_ta.trim() || null,
        contact_number: form.contact_number.trim(),
        map_url: form.map_url.trim() || null,
        image_url: imageUrl || null,
        display_order: Number(form.display_order) || 1,
        is_active: form.is_active,
      };
      if (editingId) {
        const { error } = await supabase
          .from('madarasa_branches')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        setToast({ type: 'success', message: 'Madarasa branch updated.' });
      } else {
        const { error } = await supabase.from('madarasa_branches').insert([payload]);
        if (error) throw error;
        setToast({ type: 'success', message: 'Madarasa branch added.' });
      }
      setForm(emptyForm);
      setEditingId(null);
      setImageFile(null);
      loadBranches();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (b) => {
    if (!window.confirm(`Delete branch "${b.name_en}"?`)) return;
    await supabase.from('madarasa_branches').delete().eq('id', b.id);
    setToast({ type: 'success', message: 'Branch deleted.' });
    loadBranches();
  };

  return (
    <div className="space-y-8">
      <Toast toast={toast} onClear={() => setToast(null)} />
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
      >
        <h2 className="text-base font-extrabold text-emerald-950">
          {editingId ? 'Edit Madarasa Branch' : 'Add Madarasa Branch'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Branch Name (English) *</label>
            <input
              type="text"
              required
              value={form.name_en}
              onChange={(e) => setForm({ ...form, name_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Branch Name (Tamil)</label>
            <input
              type="text"
              value={form.name_ta}
              onChange={(e) => setForm({ ...form, name_ta: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Contact Number *</label>
            <input
              type="text"
              required
              value={form.contact_number}
              onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Branch Image / Logo</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:bg-emerald-50 file:text-emerald-900 file:font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Address (English) *</label>
            <input
              type="text"
              required
              value={form.address_en}
              onChange={(e) => setForm({ ...form, address_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Address (Tamil)</label>
            <input
              type="text"
              value={form.address_ta}
              onChange={(e) => setForm({ ...form, address_ta: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Description (English) *</label>
            <textarea
              required
              rows={2}
              value={form.description_en}
              onChange={(e) => setForm({ ...form, description_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{editingId ? 'Update Branch' : 'Add Branch'}</span>
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase">
            <tr>
              <th className="px-5 py-3">Branch Name</th>
              <th className="px-5 py-3">Address</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {branches.map((b) => (
              <tr key={b.id}>
                <td className="px-5 py-3.5 font-bold text-slate-900">{b.name_en}</td>
                <td className="px-5 py-3.5 text-slate-600">{b.address_en}</td>
                <td className="px-5 py-3.5 text-slate-600">{b.contact_number}</td>
                <td className="px-5 py-3.5 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(b.id);
                      setForm({
                        name_en: b.name_en || '',
                        name_ta: b.name_ta || '',
                        address_en: b.address_en || '',
                        address_ta: b.address_ta || '',
                        description_en: b.description_en || '',
                        description_ta: b.description_ta || '',
                        contact_number: b.contact_number || '',
                        map_url: b.map_url || '',
                        image_url: b.image_url || '',
                        display_order: b.display_order || 1,
                        is_active: b.is_active,
                      });
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-emerald-900 cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(b)}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 7. ACHIEVEMENTS MANAGEMENT MODULE
export function AchievementsModule() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const emptyForm = {
    category: 'Student Achievement',
    title_en: '',
    title_ta: '',
    description_en: '',
    description_ta: '',
    student_or_recipient: '',
    achievement_date: '',
    image_url: '',
    is_published: true,
  };
  const [form, setForm] = useState(emptyForm);

  const loadData = async () => {
    const { data } = await supabase
      .from('achievements')
      .select('*')
      .order('achievement_date', { ascending: false });
    setItems(data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        imageUrl = await uploadImageToBucket('achievement-images', imageFile);
      }
      const payload = {
        category: form.category,
        title_en: form.title_en.trim(),
        title_ta: form.title_ta.trim() || null,
        description_en: form.description_en.trim(),
        description_ta: form.description_ta.trim() || null,
        student_or_recipient: form.student_or_recipient.trim() || null,
        achievement_date: form.achievement_date,
        image_url: imageUrl || null,
        is_published: form.is_published,
      };
      if (editingId) {
        await supabase.from('achievements').update(payload).eq('id', editingId);
        setToast({ type: 'success', message: 'Achievement updated.' });
      } else {
        await supabase.from('achievements').insert([payload]);
        setToast({ type: 'success', message: 'Achievement added.' });
      }
      setForm(emptyForm);
      setEditingId(null);
      setImageFile(null);
      loadData();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete achievement "${item.title_en}"?`)) return;
    await deleteImageFromBucketByUrl('achievement-images', item.image_url);
    await supabase.from('achievements').delete().eq('id', item.id);
    setToast({ type: 'success', message: 'Achievement deleted.' });
    loadData();
  };

  return (
    <div className="space-y-8">
      <Toast toast={toast} onClear={() => setToast(null)} />
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
      >
        <h2 className="text-base font-extrabold text-emerald-950">
          {editingId ? 'Edit Achievement' : 'Add Achievement / Award'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
            >
              <option value="Student Achievement">Student Achievement</option>
              <option value="Award & Certificate">Award & Certificate</option>
              <option value="Competition Result">Competition Result</option>
              <option value="Institution Achievement">Institution Achievement</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Achievement Date *</label>
            <input
              type="date"
              required
              value={form.achievement_date}
              onChange={(e) => setForm({ ...form, achievement_date: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Title (English) *</label>
            <input
              type="text"
              required
              value={form.title_en}
              onChange={(e) => setForm({ ...form, title_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Title (Tamil)</label>
            <input
              type="text"
              value={form.title_ta}
              onChange={(e) => setForm({ ...form, title_ta: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Student / Recipient Name</label>
            <input
              type="text"
              value={form.student_or_recipient}
              onChange={(e) => setForm({ ...form, student_or_recipient: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Achievement Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:bg-emerald-50 file:text-emerald-900 file:font-bold"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Description (English) *</label>
            <textarea
              required
              rows={2}
              value={form.description_en}
              onChange={(e) => setForm({ ...form, description_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{editingId ? 'Update Achievement' : 'Save Achievement'}</span>
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-3.5 font-bold text-slate-900">{item.title_en}</td>
                <td className="px-5 py-3.5 text-slate-600">{item.category}</td>
                <td className="px-5 py-3.5 text-slate-600">{item.achievement_date}</td>
                <td className="px-5 py-3.5 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(item.id);
                      setForm({
                        category: item.category,
                        title_en: item.title_en || '',
                        title_ta: item.title_ta || '',
                        description_en: item.description_en || '',
                        description_ta: item.description_ta || '',
                        student_or_recipient: item.student_or_recipient || '',
                        achievement_date: item.achievement_date || '',
                        image_url: item.image_url || '',
                        is_published: item.is_published,
                      });
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-emerald-900 cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 8. GALLERY MANAGEMENT MODULE
export function GalleryModule() {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState('Group Photos');
  const [captionEn, setCaptionEn] = useState('');
  const [captionTa, setCaptionTa] = useState('');
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);

  const loadImages = async () => {
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });
    setImages(data || []);
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length) {
      setToast({ type: 'error', message: 'Please select one or more images to upload.' });
      return;
    }

    setUploading(true);
    try {
      const records = [];
      for (const file of files) {
        const publicUrl = await uploadImageToBucket('gallery-images', file);
        records.push({
          category,
          caption_en: captionEn.trim() || null,
          caption_ta: captionTa.trim() || null,
          image_url: publicUrl,
          is_published: true,
        });
      }
      const { error } = await supabase.from('gallery_images').insert(records);
      if (error) throw error;

      setToast({
        type: 'success',
        message: `${records.length} image(s) uploaded to ${category}.`,
      });
      setFiles([]);
      setCaptionEn('');
      setCaptionTa('');
      loadImages();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateCaption = async (img) => {
    const nextCaption = window.prompt('Edit English Caption:', img.caption_en || '');
    if (nextCaption === null) return;
    await supabase
      .from('gallery_images')
      .update({ caption_en: nextCaption.trim() || null })
      .eq('id', img.id);
    setToast({ type: 'success', message: 'Caption updated.' });
    loadImages();
  };

  const handleDelete = async (img) => {
    if (!window.confirm('Delete this gallery image permanently?')) return;
    await deleteImageFromBucketByUrl('gallery-images', img.image_url);
    await supabase.from('gallery_images').delete().eq('id', img.id);
    setToast({ type: 'success', message: 'Gallery image deleted.' });
    loadImages();
  };

  return (
    <div className="space-y-8">
      <Toast toast={toast} onClear={() => setToast(null)} />

      <form
        onSubmit={handleUpload}
        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
      >
        <h2 className="text-base font-extrabold text-emerald-950">Upload Gallery Photos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
            >
              <option value="Group Photos">Group Photos</option>
              <option value="Annual Functions">Annual Functions</option>
              <option value="Educational Programs">Educational Programs</option>
              <option value="Student Activities">Student Activities</option>
              <option value="Special Events">Special Events</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Images (Multiple Allowed) *
            </label>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:bg-emerald-50 file:text-emerald-900 file:font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Caption (English)</label>
            <input
              type="text"
              value={captionEn}
              onChange={(e) => setCaptionEn(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Caption (Tamil)</label>
            <input
              type="text"
              value={captionTa}
              onChange={(e) => setCaptionTa(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold shadow cursor-pointer"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span>Upload Selected Photos</span>
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col"
          >
            <img src={img.image_url} alt={img.category} className="h-40 w-full object-cover" />
            <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[11px] font-bold text-amber-700">{img.category}</span>
                <p className="text-xs text-slate-700 line-clamp-2">{img.caption_en || 'No caption'}</p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleUpdateCaption(img)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-emerald-900 cursor-pointer"
                  title="Edit Caption"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(img)}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                  title="Delete Image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 9. HOMEPAGE SLIDER MANAGEMENT MODULE
export function SliderModule() {
  const { settings, refreshSettings } = useSettings();
  const [slides, setSlides] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [maxSlides, setMaxSlides] = useState(settings.max_slider_slides || 6);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    title_en: '',
    title_ta: '',
    caption_en: '',
    caption_ta: '',
    cta_label_en: 'Explore Courses',
    cta_link: '/courses',
    display_order: 1,
    is_active: true,
  });

  const loadSlides = async () => {
    const { data } = await supabase
      .from('homepage_slides')
      .select('*')
      .order('display_order', { ascending: true });
    setSlides(data || []);
  };

  useEffect(() => {
    loadSlides();
    setMaxSlides(settings.max_slider_slides || 6);
  }, [settings.max_slider_slides]);

  const handleCreateSlide = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setToast({ type: 'error', message: 'Please select a slider banner image.' });
      return;
    }
    setSaving(true);
    try {
      const imageUrl = await uploadImageToBucket('homepage-slides', imageFile);
      const { error } = await supabase.from('homepage_slides').insert([
        {
          title_en: form.title_en.trim(),
          title_ta: form.title_ta.trim() || null,
          caption_en: form.caption_en.trim() || null,
          caption_ta: form.caption_ta.trim() || null,
          cta_label_en: form.cta_label_en.trim() || null,
          cta_link: form.cta_link.trim() || null,
          display_order: Number(form.display_order) || slides.length + 1,
          is_active: form.is_active,
          image_url: imageUrl,
        },
      ]);
      if (error) throw error;
      setToast({ type: 'success', message: 'Homepage slide added.' });
      setForm({
        title_en: '',
        title_ta: '',
        caption_en: '',
        caption_ta: '',
        cta_label_en: 'Explore Courses',
        cta_link: '/courses',
        display_order: slides.length + 2,
        is_active: true,
      });
      setImageFile(null);
      loadSlides();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (slide) => {
    await supabase
      .from('homepage_slides')
      .update({ is_active: !slide.is_active })
      .eq('id', slide.id);
    loadSlides();
  };

  const handleMoveOrder = async (slide, delta) => {
    await supabase
      .from('homepage_slides')
      .update({ display_order: Math.max(1, (slide.display_order || 1) + delta) })
      .eq('id', slide.id);
    loadSlides();
  };

  const handleSaveMaxSlides = async () => {
    await supabase
      .from('website_settings')
      .update({ max_slider_slides: Number(maxSlides) })
      .eq('id', 1);
    await refreshSettings();
    setToast({ type: 'success', message: 'Maximum displayed slides limit updated.' });
  };

  const handleDelete = async (slide) => {
    if (!window.confirm(`Delete slide "${slide.title_en}"?`)) return;
    await deleteImageFromBucketByUrl('homepage-slides', slide.image_url);
    await supabase.from('homepage_slides').delete().eq('id', slide.id);
    setToast({ type: 'success', message: 'Slide deleted.' });
    loadSlides();
  };

  return (
    <div className="space-y-8">
      <Toast toast={toast} onClear={() => setToast(null)} />

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-sm text-emerald-950">Maximum Displayed Slides</h3>
          <p className="text-xs text-slate-500">
            Control how many active slides appear in the 3-second automatic homepage carousel.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="1"
            max="15"
            value={maxSlides}
            onChange={(e) => setMaxSlides(e.target.value)}
            className="w-20 px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold"
          />
          <button
            type="button"
            onClick={handleSaveMaxSlides}
            className="px-4 py-2 rounded-xl bg-emerald-900 text-white text-xs font-bold cursor-pointer"
          >
            Save Limit
          </button>
        </div>
      </div>

      <form
        onSubmit={handleCreateSlide}
        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
      >
        <h2 className="text-base font-extrabold text-emerald-950">Add Homepage Slider Image</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Slide Title (English) *</label>
            <input
              type="text"
              required
              value={form.title_en}
              onChange={(e) => setForm({ ...form, title_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Slide Title (Tamil)</label>
            <input
              type="text"
              value={form.title_ta}
              onChange={(e) => setForm({ ...form, title_ta: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Caption (English)</label>
            <input
              type="text"
              value={form.caption_en}
              onChange={(e) => setForm({ ...form, caption_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Display Order</label>
            <input
              type="number"
              min="1"
              value={form.display_order}
              onChange={(e) => setForm({ ...form, display_order: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Button Route (Optional)</label>
            <input
              type="text"
              placeholder="/courses or /events"
              value={form.cta_link}
              onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Slider Banner Image *</label>
            <input
              type="file"
              required
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:bg-emerald-50 file:text-emerald-900 file:font-bold"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Slide</span>
        </button>
      </form>

      <div className="space-y-3">
        {slides.map((s) => (
          <div
            key={s.id}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={s.image_url}
                alt={s.title_en}
                className="w-24 h-14 rounded-xl object-cover bg-emerald-950"
              />
              <div>
                <p className="font-extrabold text-sm text-emerald-950">{s.title_en}</p>
                <p className="text-xs text-slate-500">Order: #{s.display_order}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleMoveOrder(s, -1)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer"
                title="Move Up"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleMoveOrder(s, 1)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer"
                title="Move Down"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleToggleActive(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                  s.is_active ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {s.is_active ? 'Enabled' : 'Disabled'}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(s)}
                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 10. ANNOUNCEMENTS MANAGEMENT MODULE
export function AnnouncementsModule() {
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const emptyForm = {
    title_en: '',
    title_ta: '',
    description_en: '',
    description_ta: '',
    publish_date: new Date().toISOString().slice(0, 10),
    attachment_url: '',
    attachment_label: '',
    status: 'Active',
  };
  const [form, setForm] = useState(emptyForm);

  const loadData = async () => {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('publish_date', { ascending: false });
    setList(data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title_en: form.title_en.trim(),
      title_ta: form.title_ta.trim() || null,
      description_en: form.description_en.trim(),
      description_ta: form.description_ta.trim() || null,
      publish_date: form.publish_date,
      attachment_url: form.attachment_url.trim() || null,
      attachment_label: form.attachment_label.trim() || null,
      status: form.status,
    };
    if (editingId) {
      await supabase.from('announcements').update(payload).eq('id', editingId);
      setToast({ type: 'success', message: 'Announcement updated.' });
    } else {
      await supabase.from('announcements').insert([payload]);
      setToast({ type: 'success', message: 'Announcement published.' });
    }
    setForm(emptyForm);
    setEditingId(null);
    loadData();
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete announcement "${item.title_en}"?`)) return;
    await supabase.from('announcements').delete().eq('id', item.id);
    setToast({ type: 'success', message: 'Announcement deleted.' });
    loadData();
  };

  return (
    <div className="space-y-8">
      <Toast toast={toast} onClear={() => setToast(null)} />
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
      >
        <h2 className="text-base font-extrabold text-emerald-950">
          {editingId ? 'Edit Announcement' : 'Post Official Announcement'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Title (English) *</label>
            <input
              type="text"
              required
              value={form.title_en}
              onChange={(e) => setForm({ ...form, title_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Title (Tamil)</label>
            <input
              type="text"
              value={form.title_ta}
              onChange={(e) => setForm({ ...form, title_ta: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Publish Date *</label>
            <input
              type="date"
              required
              value={form.publish_date}
              onChange={(e) => setForm({ ...form, publish_date: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Status *</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
            >
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Optional Attachment URL
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={form.attachment_url}
              onChange={(e) => setForm({ ...form, attachment_url: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Attachment Label</label>
            <input
              type="text"
              placeholder="Download Admission Form"
              value={form.attachment_label}
              onChange={(e) => setForm({ ...form, attachment_label: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Description (English) *</label>
            <textarea
              required
              rows={3}
              value={form.description_en}
              onChange={(e) => setForm({ ...form, description_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{editingId ? 'Update Announcement' : 'Publish Announcement'}</span>
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-3.5 font-bold text-slate-900">{item.title_en}</td>
                <td className="px-5 py-3.5 text-slate-600">{item.publish_date}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`px-2.5 py-1 rounded-full font-bold ${
                      item.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(item.id);
                      setForm({
                        title_en: item.title_en || '',
                        title_ta: item.title_ta || '',
                        description_en: item.description_en || '',
                        description_ta: item.description_ta || '',
                        publish_date: item.publish_date || '',
                        attachment_url: item.attachment_url || '',
                        attachment_label: item.attachment_label || '',
                        status: item.status || 'Active',
                      });
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-emerald-900 cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 11. CONTACT SETTINGS MODULE
export function ContactSettingsModule() {
  const { settings, refreshSettings } = useSettings();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from('website_settings')
      .update({
        address_en: form.address_en,
        address_ta: form.address_ta,
        phone_number: form.phone_number,
        whatsapp_number: form.whatsapp_number,
        email: form.email,
        google_maps_url: form.google_maps_url,
        youtube_channel_url: form.youtube_channel_url,
      })
      .eq('id', 1);

    setSaving(false);
    if (error) {
      setToast({ type: 'error', message: error.message });
    } else {
      await refreshSettings();
      setToast({ type: 'success', message: 'Contact settings saved and live on website!' });
    }
  };

  return (
    <div>
      <Toast toast={toast} onClear={() => setToast(null)} />
      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 max-w-3xl"
      >
        <h2 className="text-base font-extrabold text-emerald-950">
          Public Contact & Social Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
            <input
              type="text"
              required
              value={form.phone_number || ''}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number *</label>
            <input
              type="text"
              required
              value={form.whatsapp_number || ''}
              onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Email *</label>
            <input
              type="email"
              required
              value={form.email || ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Google Maps Link</label>
            <input
              type="url"
              value={form.google_maps_url || ''}
              onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official YouTube Channel URL
            </label>
            <input
              type="url"
              value={form.youtube_channel_url || ''}
              onChange={(e) => setForm({ ...form, youtube_channel_url: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Address (English) *</label>
            <textarea
              required
              rows={2}
              value={form.address_en || ''}
              onChange={(e) => setForm({ ...form, address_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Address (Tamil)</label>
            <textarea
              rows={2}
              value={form.address_ta || ''}
              onChange={(e) => setForm({ ...form, address_ta: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold shadow cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Contact Information</span>
        </button>
      </form>
    </div>
  );
}

// 12. WEBSITE SETTINGS MODULE
export function WebsiteSettingsModule() {
  const { settings, refreshSettings } = useSettings();
  const [form, setForm] = useState(settings);
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let logoUrl = form.logo_url;
      if (logoFile) {
        logoUrl = await uploadImageToBucket('madarasa-logo', logoFile);
      }
      const { error } = await supabase
        .from('website_settings')
        .update({
          institution_name_en: form.institution_name_en,
          institution_name_ta: form.institution_name_ta,
          tagline_en: form.tagline_en,
          tagline_ta: form.tagline_ta,
          logo_url: logoUrl,
          about_summary_en: form.about_summary_en,
          about_summary_ta: form.about_summary_ta,
          history_en: form.history_en,
          history_ta: form.history_ta,
          vision_en: form.vision_en,
          vision_ta: form.vision_ta,
          mission_en: form.mission_en,
          mission_ta: form.mission_ta,
          objectives_en: form.objectives_en,
          objectives_ta: form.objectives_ta,
          management_info_en: form.management_info_en,
          management_info_ta: form.management_info_ta,
        })
        .eq('id', 1);

      if (error) throw error;
      await refreshSettings();
      setToast({ type: 'success', message: 'Institutional profile & website settings saved.' });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Toast toast={toast} onClear={() => setToast(null)} />
      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5"
      >
        <h2 className="text-base font-extrabold text-emerald-950">
          Institution Profile, About Us & Branding
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Institution Name (English)
            </label>
            <input
              type="text"
              value={form.institution_name_en || ''}
              onChange={(e) => setForm({ ...form, institution_name_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Institution Name (Tamil)
            </label>
            <input
              type="text"
              value={form.institution_name_ta || ''}
              onChange={(e) => setForm({ ...form, institution_name_ta: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tagline (English)</label>
            <input
              type="text"
              value={form.tagline_en || ''}
              onChange={(e) => setForm({ ...form, tagline_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official Logo Upload (Defaults to Umar Madarasa Emblem)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:bg-emerald-50 file:text-emerald-900 file:font-bold"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              About Introduction (English)
            </label>
            <textarea
              rows={2}
              value={form.about_summary_en || ''}
              onChange={(e) => setForm({ ...form, about_summary_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Institution History (English)
            </label>
            <textarea
              rows={3}
              value={form.history_en || ''}
              onChange={(e) => setForm({ ...form, history_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Vision (English)</label>
            <textarea
              rows={3}
              value={form.vision_en || ''}
              onChange={(e) => setForm({ ...form, vision_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mission (English)</label>
            <textarea
              rows={3}
              value={form.mission_en || ''}
              onChange={(e) => setForm({ ...form, mission_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Educational Objectives (English)
            </label>
            <textarea
              rows={3}
              value={form.objectives_en || ''}
              onChange={(e) => setForm({ ...form, objectives_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Management Information (English)
            </label>
            <textarea
              rows={2}
              value={form.management_info_en || ''}
              onChange={(e) => setForm({ ...form, management_info_en: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold shadow cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Website Settings</span>
        </button>
      </form>
    </div>
  );
}
