/*
# Create professor course management schema

## Purpose
Stores professor courses, lectures, AI-generated content, revision
history, and student enrollments for the Professor AI Lecture Assistant.

## New Tables
- `professor_courses`
  - `id` (uuid, pk)
  - `professor_id` (uuid, not null) — references auth.users
  - `name` (text) — course name
  - `code` (text) — course code (e.g. CHEM 230)
  - `description` (text)
  - `semester` (text) — e.g. "Fall 2026"
  - `color` (text) — gradient/color theme
  - `archived` (boolean, default false)
  - `created_at`, `updated_at`

- `professor_lectures`
  - `id` (uuid, pk)
  - `course_id` (uuid, not null) — references professor_courses
  - `professor_id` (uuid, not null) — references auth.users
  - `title` (text) — lecture title
  - `description` (text)
  - `status` (text) — draft/uploading/processing/review/revision/approved/published/archived
  - `file_name` (text) — original uploaded file name
  - `file_type` (text) — pdf/pptx/docx/image/video/notes
  - `file_size` (text) — human-readable size
  - `content` (jsonb) — all AI-generated content sections
  - `quality_score` (jsonb) — AI quality metrics
  - `difficulty` (text) — easy/medium/hard
  - `estimated_study_time` (text) — e.g. "45 min"
  - `approved` (boolean, default false)
  - `published_at` (timestamptz, nullable)
  - `created_at`, `updated_at`

- `lecture_versions`
  - `id` (uuid, pk)
  - `lecture_id` (uuid, not null) — references professor_lectures
  - `version_number` (integer) — sequential version
  - `content` (jsonb) — snapshot of content at this version
  - `editor` (text) — 'ai' or 'professor'
  - `label` (text) — description of the change
  - `created_at`

- `course_enrollments`
  - `id` (uuid, pk)
  - `course_id` (uuid, not null) — references professor_courses
  - `student_id` (uuid, not null) — references auth.users
  - `enrolled_at` (timestamptz)

## Security
- Row Level Security ENABLED on all four tables.
- professor_courses: owner (professor_id = auth.uid()) has full CRUD.
- professor_lectures: owner (professor_id = auth.uid()) has full CRUD.
- lecture_versions: a professor can manage versions for lectures they own.
- course_enrollments: professors can manage enrollments for their courses;
  students can read enrollments for courses they're in (for future student
  view).
- All owner columns default to auth.uid() so frontend inserts work.
*/

CREATE TABLE IF NOT EXISTS public.professor_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text,
  description text,
  semester text,
  color text DEFAULT 'from-primary to-accent',
  archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (professor_id)
);

-- Drop the accidental unique constraint from the IF NOT EXISTS first creation
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'professor_courses_professor_id_key') THEN
    ALTER TABLE public.professor_courses DROP CONSTRAINT professor_courses_professor_id_key;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.professor_lectures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.professor_courses(id) ON DELETE CASCADE,
  professor_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'draft',
  file_name text,
  file_type text,
  file_size text,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  quality_score jsonb,
  difficulty text,
  estimated_study_time text,
  approved boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.professor_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professor_lectures ENABLE ROW LEVEL SECURITY;

-- Course policies
DROP POLICY IF EXISTS "select_own_courses" ON public.professor_courses;
CREATE POLICY "select_own_courses"
  ON public.professor_courses FOR SELECT
  TO authenticated USING (auth.uid() = professor_id);

DROP POLICY IF EXISTS "insert_own_courses" ON public.professor_courses;
CREATE POLICY "insert_own_courses"
  ON public.professor_courses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = professor_id);

DROP POLICY IF EXISTS "update_own_courses" ON public.professor_courses;
CREATE POLICY "update_own_courses"
  ON public.professor_courses FOR UPDATE
  TO authenticated USING (auth.uid() = professor_id) WITH CHECK (auth.uid() = professor_id);

DROP POLICY IF EXISTS "delete_own_courses" ON public.professor_courses;
CREATE POLICY "delete_own_courses"
  ON public.professor_courses FOR DELETE
  TO authenticated USING (auth.uid() = professor_id);

-- Lecture policies
DROP POLICY IF EXISTS "select_own_lectures" ON public.professor_lectures;
CREATE POLICY "select_own_lectures"
  ON public.professor_lectures FOR SELECT
  TO authenticated USING (auth.uid() = professor_id);

DROP POLICY IF EXISTS "insert_own_lectures" ON public.professor_lectures;
CREATE POLICY "insert_own_lectures"
  ON public.professor_lectures FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = professor_id);

DROP POLICY IF EXISTS "update_own_lectures" ON public.professor_lectures;
CREATE POLICY "update_own_lectures"
  ON public.professor_lectures FOR UPDATE
  TO authenticated USING (auth.uid() = professor_id) WITH CHECK (auth.uid() = professor_id);

DROP POLICY IF EXISTS "delete_own_lectures" ON public.professor_lectures;
CREATE POLICY "delete_own_lectures"
  ON public.professor_lectures FOR DELETE
  TO authenticated USING (auth.uid() = professor_id);

-- Lecture versions table
CREATE TABLE IF NOT EXISTS public.lecture_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lecture_id uuid NOT NULL REFERENCES public.professor_lectures(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  editor text NOT NULL DEFAULT 'professor',
  label text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lecture_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_versions" ON public.lecture_versions;
CREATE POLICY "select_own_versions"
  ON public.lecture_versions FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.professor_lectures pl
            WHERE pl.id = lecture_id AND pl.professor_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_versions" ON public.lecture_versions;
CREATE POLICY "insert_own_versions"
  ON public.lecture_versions FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.professor_lectures pl
            WHERE pl.id = lecture_id AND pl.professor_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_versions" ON public.lecture_versions;
CREATE POLICY "delete_own_versions"
  ON public.lecture_versions FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.professor_lectures pl
            WHERE pl.id = lecture_id AND pl.professor_id = auth.uid())
  );

-- Course enrollments table
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.professor_courses(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, student_id)
);

ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_course_enrollments" ON public.course_enrollments;
CREATE POLICY "select_course_enrollments"
  ON public.course_enrollments FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.professor_courses pc
            WHERE pc.id = course_id AND pc.professor_id = auth.uid())
    OR student_id = auth.uid()
  );

DROP POLICY IF EXISTS "insert_course_enrollments" ON public.course_enrollments;
CREATE POLICY "insert_course_enrollments"
  ON public.course_enrollments FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.professor_courses pc
            WHERE pc.id = course_id AND pc.professor_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_course_enrollments" ON public.course_enrollments;
CREATE POLICY "delete_course_enrollments"
  ON public.course_enrollments FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.professor_courses pc
            WHERE pc.id = course_id AND pc.professor_id = auth.uid())
  );

-- Timestamp triggers
CREATE OR REPLACE FUNCTION public.update_course_timestamp()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS on_professor_courses_update ON public.professor_courses;
CREATE TRIGGER on_professor_courses_update
  BEFORE UPDATE ON public.professor_courses
  FOR EACH ROW EXECUTE FUNCTION public.update_course_timestamp();

CREATE OR REPLACE FUNCTION public.update_lecture_timestamp()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS on_professor_lectures_update ON public.professor_lectures;
CREATE TRIGGER on_professor_lectures_update
  BEFORE UPDATE ON public.professor_lectures
  FOR EACH ROW EXECUTE FUNCTION public.update_lecture_timestamp();
