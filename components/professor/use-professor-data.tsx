'use client';

import * as React from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/components/auth/auth-provider';
import type { LectureContent, QualityScore, LectureStatus, Difficulty } from '@/lib/professor-ai';

export type Course = {
  id: string;
  name: string;
  code: string;
  description: string;
  semester: string;
  color: string;
  archived: boolean;
  created_at: string;
  lecture_count?: number;
  student_count?: number;
};

export type Lecture = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  status: LectureStatus;
  file_name: string;
  file_type: string;
  file_size: string;
  content: LectureContent;
  quality_score: QualityScore | null;
  difficulty: Difficulty | null;
  estimated_study_time: string | null;
  approved: boolean;
  published_at: string | null;
  created_at: string;
};

export function useProfessorData() {
  const { user } = useAuth();
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [lectures, setLectures] = React.useState<Lecture[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadCourses = React.useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('professor_courses')
      .select('*')
      .eq('professor_id', user.id)
      .order('created_at', { ascending: false });
    if (data) {
      // Get lecture + student counts
      const enriched = await Promise.all(
        (data as Course[]).map(async (c) => {
          const [{ count: lc }, { count: sc }] = await Promise.all([
            supabase.from('professor_lectures').select('*', { count: 'exact', head: true }).eq('course_id', c.id),
            supabase.from('course_enrollments').select('*', { count: 'exact', head: true }).eq('course_id', c.id),
          ]);
          return { ...c, lecture_count: lc ?? 0, student_count: sc ?? 0 };
        }),
      );
      setCourses(enriched);
    }
  }, [user]);

  const loadLectures = React.useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('professor_lectures')
      .select('*')
      .eq('professor_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setLectures(data as Lecture[]);
  }, [user]);

  const refresh = React.useCallback(async () => {
    await Promise.all([loadCourses(), loadLectures()]);
    setLoading(false);
  }, [loadCourses, loadLectures]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const createCourse = async (course: {
    name: string;
    code: string;
    description: string;
    semester: string;
    color: string;
  }) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('professor_courses')
      .insert({ ...course, professor_id: user.id })
      .select()
      .single();
    if (error) throw error;
    await refresh();
    return data;
  };

  const updateCourse = async (id: string, patch: Partial<Course>) => {
    const { error } = await supabase.from('professor_courses').update(patch).eq('id', id);
    if (error) throw error;
    await refresh();
  };

  const deleteCourse = async (id: string) => {
    const { error } = await supabase.from('professor_courses').delete().eq('id', id);
    if (error) throw error;
    await refresh();
  };

  const createLecture = async (lecture: {
    course_id: string;
    title: string;
    file_name: string;
    file_type: string;
    file_size: string;
  }) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('professor_lectures')
      .insert({ ...lecture, professor_id: user.id, status: 'processing' })
      .select()
      .single();
    if (error) throw error;
    await refresh();
    return data;
  };

  const updateLecture = async (id: string, patch: Partial<Lecture>) => {
    const { error } = await supabase.from('professor_lectures').update(patch).eq('id', id);
    if (error) throw error;
    await refresh();
  };

  const saveVersion = async (lectureId: string, content: LectureContent, editor: string, label: string) => {
    const { count } = await supabase
      .from('lecture_versions')
      .select('*', { count: 'exact', head: true })
      .eq('lecture_id', lectureId);
    await supabase.from('lecture_versions').insert({
      lecture_id: lectureId,
      version_number: (count ?? 0) + 1,
      content,
      editor,
      label,
    });
  };

  const getVersions = async (lectureId: string) => {
    const { data } = await supabase
      .from('lecture_versions')
      .select('*')
      .eq('lecture_id', lectureId)
      .order('version_number', { ascending: false });
    return data ?? [];
  };

  return {
    courses,
    lectures,
    loading,
    refresh,
    createCourse,
    updateCourse,
    deleteCourse,
    createLecture,
    updateLecture,
    saveVersion,
    getVersions,
  };
}
