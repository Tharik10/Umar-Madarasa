-- ============================================================================
-- UMAR MAKTHAB & HIFL MADARASA - PRODUCTION SUPABASE SCHEMA & RLS POLICIES
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. ADMIN PROFILES
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid() AND is_active = TRUE
  );
$$;

-- 2. MADARASA BRANCHES
CREATE TABLE IF NOT EXISTS public.madarasa_branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_ta TEXT,
  image_url TEXT,
  address_en TEXT NOT NULL,
  address_ta TEXT,
  description_en TEXT NOT NULL,
  description_ta TEXT,
  contact_number TEXT NOT NULL,
  email TEXT,
  map_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. COURSES / CLASSES
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES public.madarasa_branches(id) ON DELETE SET NULL,
  title_en TEXT NOT NULL,
  title_ta TEXT,
  department TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ta TEXT,
  class_info_en TEXT NOT NULL,
  class_info_ta TEXT,
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TEACHERS / STAFF
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES public.madarasa_branches(id) ON DELETE SET NULL,
  full_name_en TEXT NOT NULL,
  full_name_ta TEXT,
  photo_url TEXT,
  department_en TEXT NOT NULL,
  department_ta TEXT,
  qualification_en TEXT NOT NULL,
  qualification_ta TEXT,
  experience_years INTEGER,
  class_timing TEXT,
  bio_en TEXT,
  bio_ta TEXT,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. EVENTS & YOUTUBE PROGRAMS
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES public.madarasa_branches(id) ON DELETE SET NULL,
  title_en TEXT NOT NULL,
  title_ta TEXT,
  description_en TEXT NOT NULL,
  description_ta TEXT,
  poster_url TEXT,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  youtube_url TEXT,
  status TEXT NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Live', 'Completed')),
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL DEFAULT 'Student Achievement' CHECK (
    category IN ('Student Achievement', 'Award & Certificate', 'Competition Result', 'Institution Achievement')
  ),
  title_en TEXT NOT NULL,
  title_ta TEXT,
  description_en TEXT NOT NULL,
  description_ta TEXT,
  student_or_recipient TEXT,
  achievement_date DATE NOT NULL,
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. GALLERY IMAGES
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (
    category IN ('Group Photos', 'Annual Functions', 'Educational Programs', 'Student Activities', 'Special Events')
  ),
  caption_en TEXT,
  caption_ta TEXT,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. HOMEPAGE SLIDER
CREATE TABLE IF NOT EXISTS public.homepage_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_ta TEXT,
  caption_en TEXT,
  caption_ta TEXT,
  image_url TEXT NOT NULL,
  cta_label_en TEXT,
  cta_link TEXT,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_ta TEXT,
  description_en TEXT NOT NULL,
  description_ta TEXT,
  publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
  attachment_url TEXT,
  attachment_label TEXT,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. WEBSITE & CONTACT SETTINGS (Singleton id = 1)
CREATE TABLE IF NOT EXISTS public.website_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  institution_name_en TEXT NOT NULL DEFAULT 'Umar Makthab and Hifl Madarasa',
  institution_name_ta TEXT NOT NULL DEFAULT 'உமர் மக்தப் மற்றும் ஹிஃப்ழ் மதரஸா',
  tagline_en TEXT NOT NULL DEFAULT 'Nurturing Quranic Excellence & Prophetic Character',
  tagline_ta TEXT NOT NULL DEFAULT 'குர்ஆனிய அறிவும் நற்குணமும் வளர்க்கும் இஸ்லாமிய கல்விக்கூடம்',
  logo_url TEXT DEFAULT '/logo.png',
  about_summary_en TEXT NOT NULL DEFAULT 'Umar Makthab and Hifl Madarasa is dedicated to imparting authentic Quranic memorization (Hifz), Tajweed, foundational Makthab studies, and moral upbringing in a disciplined, nurturing environment.',
  about_summary_ta TEXT NOT NULL DEFAULT 'உமர் மக்தப் மற்றும் ஹிஃப்ழ் மதரஸா மாணவர்களுக்குத் தூய குர்ஆன் மனனம் (ஹிஃப்ழ்), தஜ்வீத், அடிப்படை மக்தப் கல்வி மற்றும் நற்பண்புகளை ஒழுக்கமான சூழலில் கற்பித்து வருகிறது.',
  history_en TEXT NOT NULL DEFAULT 'Founded with the sincere vision of preserving the Holy Quran in young hearts while equipping students with strong Islamic etiquette, Umar Makthab and Hifl Madarasa has grown into a trusted educational beacon serving families across three branches.',
  history_ta TEXT NOT NULL DEFAULT 'இளம் உள்ளங்களில் திருக்குர்ஆனைப் பாதுகாப்பதோடு சிறந்த இஸ்லாமிய ஒழுக்கங்களையும் வளர்க்கும் உயரிய நோக்கத்துடன் தொடங்கப்பட்ட உமர் மக்தப் மற்றும் ஹிஃப்ழ் மதரஸா, இன்று மூன்று கிளைகளுடன் சிறப்பாகச் செயல்பட்டு வருகிறது.',
  vision_en TEXT NOT NULL DEFAULT 'To cultivate a generation of Huffaz and principled learners who embody the teachings of the Quran and Sunnah with wisdom, humility, and service to humanity.',
  vision_ta TEXT NOT NULL DEFAULT 'திருக்குர்ஆன் மற்றும் நபிவழி போதனைகளைப் பின்பற்றி, பணிவுடனும் ஞானத்துடனும் சமூகத்திற்குச் சேவையாற்றும் தலைமுறையை உருவாக்குதல்.',
  mission_en TEXT NOT NULL DEFAULT 'Deliver structured Hifz and Makthab curricula under qualified Ulama and Huffaz, ensuring individual attention, Tajweed mastery, and holistic character development.',
  mission_ta TEXT NOT NULL DEFAULT 'தகுதிவாய்ந்த உலமாக்கள் மற்றும் ஹாஃபிழ்களின் வழிகாட்டுதலில் தனிப்பட்ட கவனம், தஜ்வீத் தேர்ச்சி மற்றும் முழுமையான நற்பண்பு வளர்ச்சியுடன் தரமான கல்வியை வழங்குதல்.',
  objectives_en TEXT NOT NULL DEFAULT '1. Accurate Quran recitation with Tajweed rules.
2. Complete Hifz-ul-Quran with regular revision (Muraja''ah).
3. Essential Fiqh, Aqeedah, Seerah, and daily Duas.
4. Respect for parents, elders, and community service.',
  objectives_ta TEXT NOT NULL DEFAULT '1. தஜ்வீத் விதிகளுடன் திருக்குர்ஆனைத் துல்லியமாக ஓதுதல்.
2. முறையான திருப்புதலுடன் (முராஜஆ) முழு குர்ஆன் மனனம்.
3. அத்தியாவசிய ஃபிக்ஹ், அகீதா, சீறா மற்றும் அன்றாட துஆக்கள்.
4. பெற்றோர், பெரியோர்களை மதித்தல் மற்றும் சமூக நல்லிணக்கம்.',
  management_info_en TEXT NOT NULL DEFAULT 'Managed by the Umar Educational & Charitable Trust Board of Trustees, Senior Principal, and Academic Council of Huffaz & Ulama.',
  management_info_ta TEXT NOT NULL DEFAULT 'உமர் கல்வி மற்றும் அறக்கட்டளை நிர்வாகக் குழு, தலைமை ஆசிரியர் மற்றும் உலமாக்கள் சபையால் நிர்வகிக்கப்படுகிறது.',
  address_en TEXT NOT NULL DEFAULT 'Umar Makthab and Hifl Madarasa, Main Campus, Tamil Nadu, India',
  address_ta TEXT NOT NULL DEFAULT 'உமர் மக்தப் மற்றும் ஹிஃப்ழ் மதரஸா, தலைமை வளாகம், தமிழ்நாடு, இந்தியா',
  phone_number TEXT NOT NULL DEFAULT '+91 98400 00000',
  whatsapp_number TEXT NOT NULL DEFAULT '+91 98400 00000',
  email TEXT NOT NULL DEFAULT 'info@umarmadarasa.org',
  google_maps_url TEXT NOT NULL DEFAULT 'https://maps.google.com',
  youtube_channel_url TEXT NOT NULL DEFAULT 'https://www.youtube.com',
  max_slider_slides INTEGER NOT NULL DEFAULT 6 CHECK (max_slider_slides BETWEEN 1 AND 15),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.website_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_branches_active_order ON public.madarasa_branches (is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_courses_active_branch ON public.courses (is_active, branch_id, display_order);
CREATE INDEX IF NOT EXISTS idx_teachers_active_branch ON public.teachers (is_active, branch_id, display_order);
CREATE INDEX IF NOT EXISTS idx_events_published_date ON public.events (is_published, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_published_date ON public.achievements (is_published, achievement_date DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_published_cat ON public.gallery_images (is_published, category, display_order);
CREATE INDEX IF NOT EXISTS idx_slides_active_order ON public.homepage_slides (is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_announcements_status_date ON public.announcements (status, publish_date DESC);

-- TRIGGERS
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'admin_profiles',
    'madarasa_branches',
    'courses',
    'teachers',
    'events',
    'achievements',
    'gallery_images',
    'homepage_slides',
    'announcements',
    'website_settings'
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_updated_at ON public.%I;', tbl, tbl);
    EXECUTE format(
      'CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();',
      tbl, tbl
    );
  END LOOP;
END $$;

-- ROW LEVEL SECURITY
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.madarasa_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view own and team profiles"
  ON public.admin_profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins can update own profile"
  ON public.admin_profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Public can read active branches"
  ON public.madarasa_branches FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admins can manage branches"
  ON public.madarasa_branches FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public can read active courses"
  ON public.courses FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public can read active teachers"
  ON public.teachers FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admins can manage teachers"
  ON public.teachers FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public can read published events"
  ON public.events FOR SELECT USING (is_published = TRUE OR public.is_admin());
CREATE POLICY "Admins can manage events"
  ON public.events FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public can read published achievements"
  ON public.achievements FOR SELECT USING (is_published = TRUE OR public.is_admin());
CREATE POLICY "Admins can manage achievements"
  ON public.achievements FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public can read published gallery images"
  ON public.gallery_images FOR SELECT USING (is_published = TRUE OR public.is_admin());
CREATE POLICY "Admins can manage gallery images"
  ON public.gallery_images FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public can read active slides"
  ON public.homepage_slides FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admins can manage slides"
  ON public.homepage_slides FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public can read active announcements"
  ON public.announcements FOR SELECT USING (status = 'Active' OR public.is_admin());
CREATE POLICY "Admins can manage announcements"
  ON public.announcements FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public can read website settings"
  ON public.website_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admins can update website settings"
  ON public.website_settings FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- STORAGE BUCKETS & POLICIES
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('madarasa-logo', 'madarasa-logo', TRUE, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']),
  ('event-posters', 'event-posters', TRUE, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']),
  ('teacher-photos', 'teacher-photos', TRUE, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']),
  ('gallery-images', 'gallery-images', TRUE, 8388608, ARRAY['image/png', 'image/jpeg', 'image/webp']),
  ('achievement-images', 'achievement-images', TRUE, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']),
  ('homepage-slides', 'homepage-slides', TRUE, 8388608, ARRAY['image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for Madarasa storage"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('madarasa-logo','event-posters','teacher-photos','gallery-images','achievement-images','homepage-slides'));

CREATE POLICY "Admins can upload to Madarasa storage"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() AND bucket_id IN ('madarasa-logo','event-posters','teacher-photos','gallery-images','achievement-images','homepage-slides'));

CREATE POLICY "Admins can update Madarasa storage"
  ON storage.objects FOR UPDATE TO authenticated
  USING (public.is_admin() AND bucket_id IN ('madarasa-logo','event-posters','teacher-photos','gallery-images','achievement-images','homepage-slides'));

CREATE POLICY "Admins can delete from Madarasa storage"
  ON storage.objects FOR DELETE TO authenticated
  USING (public.is_admin() AND bucket_id IN ('madarasa-logo','event-posters','teacher-photos','gallery-images','achievement-images','homepage-slides'));
