'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Search, Plus, FileText, Calendar, Users, Sparkles } from 'lucide-react';
import { ProfessorLayout } from '@/components/professor/professor-layout';
import { useProfessorData } from '@/components/professor/use-professor-data';
import { StatusBadge, EmptyState, Skeleton } from '@/components/professor/shared';
import { RouteGuard } from '@/components/auth/route-guard';
import { supabase } from '@/lib/supabase-client';
import { type LectureStatus, statusConfig } from '@/lib/professor-ai';
import { cn } from '@/lib/utils';

export default function CourseDetailPage() {
  return (
    <RouteGuard require="professor">
      <ProfessorLayout>
        <CourseDetail />
      </ProfessorLayout>
    </RouteGuard>
  );
}

function CourseDetail() {
  const params = useParams();
  const router = useRouter();
  const { courses, lectures, loading, refresh } = useProfessorData();
  const courseId = params.id as string;
  const course = courses.find((c) => c.id === courseId);
  const courseLectures = lectures.filter((l) => l.course_id === courseId);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<LectureStatus | 'all'>('all');
  const [view, setView] = React.useState<'lectures' | 'students'>('lectures');

  const filtered = courseLectures.filter((l) => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusOptions: (LectureStatus | 'all')[] = ['all', 'draft', 'processing', 'review', 'published', 'archived'];

  if (loading) {
    return (
      <div>
        <Skeleton className="mb-6 h-10 w-48" />
        <Skeleton className="mb-6 h-32" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-40" />)}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div>
        <button onClick={() => router.push('/professor/courses')} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to courses
        </button>
        <EmptyState icon={FileText} title="Course not found" description="This course may have been deleted." />
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => router.push('/professor/courses')} className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to courses
      </button>

      {/* Course header */}
      <div className={cn('relative overflow-hidden rounded-2xl p-6 shadow-soft')}>
        <div className={cn('absolute inset-0 bg-gradient-to-br opacity-90', course.color)} />
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/70">{course.semester}</p>
            <h1 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">{course.name}</h1>
            <p className="mt-1 text-sm text-white/80">{course.code} · {course.description}</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-white/90">
              <span className="inline-flex items-center gap-1.5"><FileText className="h-4 w-4" /> {courseLectures.length} lectures</span>
              <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> {course.student_count ?? 0} students</span>
            </div>
          </div>
          <button
            onClick={() => router.push(`/professor/assistant?course=${course.id}`)}
            className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-transform hover:scale-[1.03]"
          >
            <Sparkles className="h-4 w-4" />
            Upload Lecture
          </button>
        </div>
      </div>

      {/* View tabs */}
      <div className="mt-6 flex gap-1 rounded-xl bg-muted/50 p-1">
        <button onClick={() => setView('lectures')} className={cn('flex-1 rounded-lg py-2 text-sm font-medium transition-all', view === 'lectures' ? 'bg-background text-foreground shadow-soft' : 'text-muted-foreground')}>
          Lectures ({courseLectures.length})
        </button>
        <button onClick={() => setView('students')} className={cn('flex-1 rounded-lg py-2 text-sm font-medium transition-all', view === 'students' ? 'bg-background text-foreground shadow-soft' : 'text-muted-foreground')}>
          Students ({course.student_count ?? 0})
        </button>
      </div>

      {view === 'lectures' ? (
        <>
          {/* Search + filter */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lectures..." className="h-10 w-full rounded-xl border border-border bg-muted/40 pl-10 pr-4 text-sm outline-none focus:border-primary/50 focus:bg-background" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as LectureStatus | 'all')} className="h-10 rounded-xl border border-border bg-muted/40 px-4 text-sm outline-none focus:border-primary/50">
              {statusOptions.map((s) => (
                <option key={s} value={s} className="bg-background">{s === 'all' ? 'All statuses' : statusConfig[s as LectureStatus].label}</option>
              ))}
            </select>
          </div>

          {/* Lectures grid */}
          {filtered.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon={FileText}
                title={search || statusFilter !== 'all' ? 'No lectures found' : 'No lectures yet'}
                description={search || statusFilter !== 'all' ? 'Try adjusting your search or filters.' : 'Upload your first lecture to this course.'}
                action={
                  <button onClick={() => router.push(`/professor/assistant?course=${course.id}`)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]">
                    <Plus className="h-4 w-4" />
                    Upload Lecture
                  </button>
                }
              />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((lecture, i) => (
                <motion.button
                  key={lecture.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => router.push(`/professor/lectures/${lecture.id}`)}
                  className="group flex flex-col rounded-2xl glass-card p-5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
                      <FileText className="h-5 w-5" />
                    </span>
                    <StatusBadge status={lecture.status} animate />
                  </div>
                  <p className="mt-4 font-display text-base font-semibold line-clamp-2">{lecture.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground truncate">{lecture.file_name}</p>
                  <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted-foreground">
                    {lecture.difficulty && <span className="capitalize">{lecture.difficulty}</span>}
                    {lecture.estimated_study_time && <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{lecture.estimated_study_time}</span>}
                    {lecture.quality_score && <span className="ml-auto font-semibold text-primary">{lecture.quality_score.overall}/100</span>}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </>
      ) : (
        <StudentList courseId={course.id} />
      )}
    </div>
  );
}

function StudentList({ courseId }: { courseId: string }) {
  const [students, setStudents] = React.useState<{ id: string; student_id: string; enrolled_at: string }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [enrolling, setEnrolling] = React.useState(false);

  const load = async () => {
    const { data } = await supabase.from('course_enrollments').select('*').eq('course_id', courseId);
    setStudents(data ?? []);
    setLoading(false);
  };

  React.useEffect(() => { load(); }, [courseId]);

  const enroll = async () => {
    // In a real app, you'd look up the student by email. For demo, we skip.
    setEnrolling(true);
    setEmail('');
    setEnrolling(false);
  };

  if (loading) return <div className="mt-4"><Skeleton className="h-32" /></div>;

  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-2xl glass-card p-5 shadow-soft">
        <h3 className="font-display text-base font-semibold">Enrolled students</h3>
        {students.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No students enrolled yet. Students will appear here once they join your course.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {students.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground">S</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">Student</p>
                  <p className="text-xs text-muted-foreground">Enrolled {new Date(s.enrolled_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
