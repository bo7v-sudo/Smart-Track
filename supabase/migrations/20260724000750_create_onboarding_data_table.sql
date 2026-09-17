
/*
# Create onboarding_data table and add onboarding_completed flag

## Purpose
Stores the full set of answers a student provides during the 13-step
onboarding wizard. A separate column on `profiles` tracks whether
onboarding has been completed so the app can gate dashboard access.

## New Tables
- `onboarding_data`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null) — references auth.users, the owner
  - `university` (text) — student's university name
  - `faculty` (text) — faculty/school (e.g. Engineering)
  - `department` (text) — specific department/major
  - `academic_year` (text) — e.g. "Year 1", "Year 3"
  - `current_gpa` (numeric) — student's current GPA, nullable
  - `gpa_scale` (numeric) — the scale (4.0, 5.0, 10.0), default 4.0
  - `current_subjects` (jsonb) — array of subject names the student is taking
  - `weekly_study_hours` (integer) — preferred weekly study hours target
  - `preferred_study_time` (text) — morning/afternoon/evening/night
  - `learning_style` (text) — visual/auditory/reading/kinesthetic
  - `weak_subjects` (jsonb) — array of subjects the student struggles with
  - `upcoming_exams` (jsonb) — array of {subject, date} exam entries
  - `personal_goals` (text) — free-text goals
  - `ai_profile` (jsonb) — the generated AI study profile summary
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

## Modified Tables
- `profiles`
  - Added `onboarding_completed` (boolean, default false) — gates dashboard access

## Security
- Row Level Security ENABLED on `onboarding_data`.
- Each authenticated user can read/insert/update only their own row.
- The new `profiles.onboarding_completed` column is covered by the
  existing update_own_profile policy (column-level access is not
  restricted, so the existing policy governs it).

## Notes
1. `user_id` defaults to auth.uid() so inserts from the frontend work
   even when the client omits the field.
2. One row per user — the upsert pattern is used on save.
3. The `ai_profile` jsonb stores the full AI-generated summary so it can
   be displayed later without recomputation.
*/

CREATE TABLE IF NOT EXISTS public.onboarding_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  university text,
  faculty text,
  department text,
  academic_year text,
  current_gpa numeric,
  gpa_scale numeric NOT NULL DEFAULT 4.0,
  current_subjects jsonb NOT NULL DEFAULT '[]'::jsonb,
  weekly_study_hours integer,
  preferred_study_time text,
  learning_style text,
  weak_subjects jsonb NOT NULL DEFAULT '[]'::jsonb,
  upcoming_exams jsonb NOT NULL DEFAULT '[]'::jsonb,
  personal_goals text,
  ai_profile jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_onboarding" ON public.onboarding_data;
CREATE POLICY "select_own_onboarding"
  ON public.onboarding_data FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_onboarding" ON public.onboarding_data;
CREATE POLICY "insert_own_onboarding"
  ON public.onboarding_data FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_onboarding" ON public.onboarding_data;
CREATE POLICY "update_own_onboarding"
  ON public.onboarding_data FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add onboarding_completed flag to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN onboarding_completed boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION public.update_onboarding_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_onboarding_data_update ON public.onboarding_data;
CREATE TRIGGER on_onboarding_data_update
  BEFORE UPDATE ON public.onboarding_data
  FOR EACH ROW EXECUTE FUNCTION public.update_onboarding_timestamp();
