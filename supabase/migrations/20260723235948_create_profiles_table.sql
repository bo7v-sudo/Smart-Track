/*
# Create profiles table for user roles

## Purpose
Stores a single row per authenticated user holding their role
(student or professor) and display name. This is how the app decides
where to redirect after login — students go to /dashboard, professors
go to /professor.

## New Tables
- `profiles`
  - `id` (uuid, primary key) — matches the user's id in auth.users
  - `email` (text) — convenience copy of the auth email
  - `full_name` (text) — display name chosen at registration
  - `role` (text, not null) — 'student' or 'professor'
  - `avatar_url` (text, nullable) — optional profile photo URL
  - `created_at` (timestamptz) — row creation time
  - `updated_at` (timestamptz) — row last update time

## Security
- Row Level Security ENABLED on `profiles`.
- Each authenticated user can read only their own profile row.
- Each authenticated user can insert only their own profile row.
- Each authenticated user can update only their own profile row.
- No DELETE policy is added (profiles are not deleted from the UI).
- A trigger auto-creates a profile row whenever a new auth.users row is
  inserted, defaulting role to 'student' so the row always exists even
  if the frontend insert is skipped (e.g. OAuth sign-up).

## Notes
1. `id` references auth.users(id) with ON DELETE CASCADE so the profile
   is removed if the auth user is deleted.
2. The role column is CHECK-constrained to 'student' or 'professor'.
3. A `handle_new_user` trigger function inserts a default profile on
   sign-up; the frontend later updates role/full_name after the user
   picks a role in the registration form.
*/

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'professor')),
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON public.profiles;
CREATE POLICY "select_own_profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON public.profiles;
CREATE POLICY "insert_own_profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
CREATE POLICY "update_own_profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Auto-create a profile row on new auth user sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
