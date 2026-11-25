# Umar Makthab & Hifl Madarasa (உமர் மக்தப் மற்றும் ஹிஃப்ழ் மதரஸா)
## Official Website & Dynamic Admin Management System

A production-ready, bilingual (Tamil & English) Islamic educational institution web application built with **React.js (Vite)**, **Tailwind CSS**, **React Router**, **Supabase (PostgreSQL, Authentication, Storage, Row Level Security)**, and **Vercel**.

---

## 1. Local Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template and add your Supabase credentials
cp .env.example .env

# 3. Start local development server
npm run dev

# 4. Build for production
npm run build
```

---

## 2. Supabase Database & Storage Setup

1. Create a new project in [Supabase](https://supabase.com).
2. Open **SQL Editor** in your Supabase Dashboard.
3. Paste and run the entire contents of `supabase/schema.sql`. This creates:
   - All 10 relational tables (`admin_profiles`, `madarasa_branches`, `courses`, `teachers`, `events`, `achievements`, `gallery_images`, `homepage_slides`, `announcements`, `website_settings`)
   - Performance indexes & `updated_at` triggers
   - Strict **Row Level Security (RLS)** policies (Public read-only for published/active records; write access restricted exclusively to verified rows in `admin_profiles`)
   - All 6 public Storage buckets (`madarasa-logo`, `event-posters`, `teacher-photos`, `gallery-images`, `achievement-images`, `homepage-slides`) with file size & MIME-type validation

---

## 3. Creating the First Administrator Securely

Public sign-ups are disabled on the frontend and blocked by RLS. To provision your first administrator:

1. In Supabase Dashboard, go to **Authentication → Settings** and disable **"Enable Sign Ups"** (or invite users manually).
2. Go to **Authentication → Users → Add User** and create an administrator email and strong password. Copy the newly created user's **UUID**.
3. Run the following SQL in the **Supabase SQL Editor**:

```sql
INSERT INTO public.admin_profiles (id, email, full_name, role, is_active)
VALUES (
  'PASTE-AUTH-USER-UUID-HERE',
  'admin@umarmadarasa.org',
  'Principal Administrator',
  'super_admin',
  TRUE
);
```

4. Log in at `/admin/login`.

---

## 4. GitHub & Vercel Deployment

1. Push this repository to **GitHub** (ensure `.env` is ignored; only `.env.example` is committed).
2. Import the GitHub repository into **Vercel**.
3. Add the following Environment Variables in Vercel Project Settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. `vercel.json` is pre-configured for SPA client-side routing (`/admin/login`, `/admin/dashboard`, `/events`, etc.).
